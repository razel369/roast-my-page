// OpenAI Chat Completions client — MiniMax M3 compatible.
//
// MiniMax exposes MiniMax-M3 via a standard OpenAI-compatible Chat Completions
// endpoint, which works with both sk-api (PAYG) and sk-cp (Token Plan) keys.
//
// Spec: https://platform.minimaxi.com/docs/api-reference/text-chat-openai
//       server: https://api.minimaxi.com
//       endpoint: POST /v1/chat/completions
//       auth: Authorization: Bearer <key>
//
// Configuration (set in .env.local):
//   LLM_BASE_URL     https://api.minimaxi.com
//   LLM_API_KEY      sk-cp-... or sk-api-...
//   LLM_MODEL        MiniMax-M3
//   LLM_ENABLED      "true" to enable (auto-detected if LLM_API_KEY is set)

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | ContentPart[];
}

export type ContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string; detail?: "low" | "high" | "auto" } };

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface LlmConfig {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export function getLlmConfig(): LlmConfig {
  const apiKey = process.env.LLM_API_KEY || "";
  const enabledFlag = process.env.LLM_ENABLED;
  const enabled =
    enabledFlag === "true" ||
    (enabledFlag !== "false" && apiKey.length > 0);
  return {
    enabled,
    baseUrl: (process.env.LLM_BASE_URL || "https://api.minimaxi.com").replace(/\/+$/, ""),
    apiKey,
    model: process.env.LLM_MODEL || "MiniMax-M3",
  };
}

export class LlmError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "LlmError";
    this.status = status;
  }
}

interface ChatCompletionResponse {
  choices?: Array<{
    index: number;
    finish_reason: string;
    message: { role: string; content: string; reasoning_content?: string };
  }>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  model?: string;
  base_resp?: { status_code: number; status_msg: string };
}

export async function chatComplete(
  messages: ChatMessage[],
  opts: ChatOptions = {},
): Promise<string> {
  const cfg = getLlmConfig();
  if (!cfg.enabled) {
    throw new LlmError("LLM is not configured (set LLM_API_KEY and LLM_BASE_URL).");
  }

  const body: Record<string, unknown> = {
    model: cfg.model,
    messages,
    max_completion_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.7,
  };

  // Hard cap to fit inside Vercel Hobby's 10s function budget alongside fetch + analysis.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);
  const signal = opts.signal ?? controller.signal;

  try {
    const res = await fetch(`${cfg.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new LlmError(
        `LLM request failed: ${res.status} ${text.slice(0, 300)}`,
        res.status,
      );
    }

    const data = (await res.json()) as ChatCompletionResponse;

    if (data.base_resp && data.base_resp.status_code && data.base_resp.status_code !== 0) {
      throw new LlmError(
        `LLM error: ${data.base_resp.status_code} ${data.base_resp.status_msg || "(no message)"}`,
      );
    }

    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.length === 0) {
      throw new LlmError(
        `LLM returned no content (model=${data.model}, finish=${data.choices?.[0]?.finish_reason}).`,
      );
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}

// Robust JSON extractor.
// 1. Tries ```json fenced block first.
// 2. Otherwise finds the first '{' and last balanced '}'.
// 3. If the JSON is truncated, attempts to close open strings/brackets/objects
//    and re-parses. This rescues cases where max_completion_tokens cut off output.
export function extractJson<T = unknown>(text: string): T {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;

  const start = candidate.indexOf("{");
  if (start === -1) {
    throw new LlmError("LLM returned no JSON object (no '{' found).");
  }

  // Walk forward and find the matching closing brace, respecting strings and escapes.
  const end = findMatchingBrace(candidate, start);
  if (end === -1) {
    // Truncated or malformed — try to repair by closing open brackets.
    const repaired = repairTruncatedJson(candidate.slice(start));
    try {
      return JSON.parse(repaired) as T;
    } catch (err) {
      throw new LlmError(`LLM JSON parse failed (and repair failed): ${(err as Error).message}`);
    }
  }

  const slice = candidate.slice(start, end + 1);
  try {
    return JSON.parse(slice) as T;
  } catch (err) {
    const repaired = repairTruncatedJson(slice);
    try {
      return JSON.parse(repaired) as T;
    } catch {
      throw new LlmError(`LLM JSON parse failed: ${(err as Error).message}`);
    }
  }
}

function findMatchingBrace(text: string, openIndex: number): number {
  let depth = 0;
  let inString = false;
  let escape = false;
  for (let i = openIndex; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function repairTruncatedJson(slice: string): string {
  // Strip any trailing incomplete string/value fragment after the last complete entry.
  let result = slice;
  // Drop a trailing partial key or value after the last comma/newline.
  const lastComplete = Math.max(
    result.lastIndexOf("}"),
    result.lastIndexOf("]"),
    result.lastIndexOf('",'),
  );
  if (lastComplete > result.length * 0.5) {
    result = result.slice(0, lastComplete + 1);
  }
  // Close any unclosed braces/brackets.
  const opens: string[] = [];
  let inString = false;
  let escape = false;
  for (let i = 0; i < result.length; i++) {
    const ch = result[i];
    if (escape) { escape = false; continue; }
    if (inString) {
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === "{") opens.push("}");
    else if (ch === "[") opens.push("]");
    else if (ch === "}" || ch === "]") opens.pop();
  }
  // If we're still inside a string, close it.
  if (inString) result += '"';
  // Close remaining open brackets/braces in reverse order.
  result += opens.reverse().join("");
  return result;
}