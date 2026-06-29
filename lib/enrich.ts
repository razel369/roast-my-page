import type { ParsedPage, RoastResult, Killer, VisualCritique } from "./types";
import { roast as runRules } from "./analyzer";
import { chatComplete, extractJson, LlmError, getLlmConfig, type ChatMessage, type ContentPart } from "./llm";
import { ROASTER_SYSTEM_PROMPT, buildRoasterUserPrompt } from "./prompts";
import type { ScreenshotCapture, CapturedImage } from "./screenshot";

interface LlmResponse {
  killers: Array<{ title: string; severity: "critical" | "high" | "medium"; evidence: string; fix: string }>;
  quickWins: string[];
  heroRewrite: { headline: string; subhead: string; cta: string; rationale: string };
  verdictLabel: string;
  verdictBlurb: string;
  summary: string;
  visualCritique?: {
    aboveTheFold: string;
    visualHierarchy: string;
    desktopNotes: string[];
    mobileNotes: string[];
    layoutIssues: string[];
  };
}

interface EnrichOutcome {
  result: RoastResult;
  source: "llm" | "rules";
  warning?: string;
}

const VALID_VERDICTS = new Set(["Conversion Killer", "Needs Work", "Solid", "Strong"]);

function normalizeKillers(input: unknown): Killer[] {
  if (!Array.isArray(input)) return [];
  const out: Killer[] = [];
  for (const item of input) {
    if (!item || typeof item !== "object") continue;
    const k = item as Record<string, unknown>;
    const title = typeof k.title === "string" ? k.title.trim() : "";
    const severityRaw = typeof k.severity === "string" ? k.severity.toLowerCase() : "";
    const severity = (severityRaw === "critical" || severityRaw === "high" || severityRaw === "medium")
      ? severityRaw
      : "medium";
    const evidence = typeof k.evidence === "string" ? k.evidence.trim() : "";
    const fix = typeof k.fix === "string" ? k.fix.trim() : "";
    if (!title || !evidence || !fix) continue;
    out.push({ title: title.slice(0, 120), severity, evidence: evidence.slice(0, 400), fix: fix.slice(0, 400) });
    if (out.length >= 5) break;
  }
  return out;
}

function mergeKillers(ruleKillers: Killer[], llmKillers: Killer[]): Killer[] {
  const merged: Killer[] = [...llmKillers];
  const llmTitleTokens = new Set(
    llmKillers.flatMap((k) => k.title.toLowerCase().split(/\W+/).filter((w) => w.length > 4)),
  );
  for (const rk of ruleKillers) {
    const tokens = rk.title.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    const overlap = tokens.some((t) => llmTitleTokens.has(t));
    if (!overlap) merged.push(rk);
    if (merged.length >= 5) break;
  }
  return merged.slice(0, 5);
}

function normalizeVisualCritique(raw: unknown, hadScreenshots: boolean): VisualCritique | undefined {
  if (!hadScreenshots) return undefined;
  const v = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const asStringList = (x: unknown): string[] =>
    Array.isArray(x) ? x.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean) : [];
  const result: VisualCritique = {
    enabled: true,
    aboveTheFold: typeof v.aboveTheFold === "string" ? v.aboveTheFold.trim() : "",
    visualHierarchy: typeof v.visualHierarchy === "string" ? v.visualHierarchy.trim() : "",
    desktopNotes: asStringList(v.desktopNotes),
    mobileNotes: asStringList(v.mobileNotes),
    layoutIssues: asStringList(v.layoutIssues),
  };
  // If everything is empty, treat as "LLM didn't critique" rather than empty object.
  if (!result.aboveTheFold && !result.visualHierarchy && !result.desktopNotes.length && !result.mobileNotes.length && !result.layoutIssues.length) {
    return undefined;
  }
  return result;
}

function buildUserContent(
  p: ParsedPage,
  ruleSummary: string[],
  screenshots: ScreenshotCapture | null,
): string | ContentPart[] {
  const text = buildRoasterUserPrompt(p, ruleSummary);

  if (!screenshots) return text;

  const parts: ContentPart[] = [{ type: "text", text }];
  const addImage = (img: CapturedImage | null, label: string) => {
    if (!img) return;
    parts.push({
      type: "text",
      text: `[Attached: ${label} screenshot, ${img.width}x${img.height}]`,
    });
    parts.push({
      type: "image_url",
      image_url: { url: `data:image/png;base64,${img.base64}`, detail: "high" },
    });
  };
  addImage(screenshots.desktop, "desktop viewport (1280x800)");
  addImage(screenshots.mobile, "mobile viewport (390x844, iPhone 14)");

  parts.push({
    type: "text",
    text: "Remember: include the `visualCritique` object in your response — critique the actual layout, hierarchy, and mobile experience, not just the copy.",
  });

  return parts;
}

export async function enrichRoast(
  p: ParsedPage,
  screenshots: ScreenshotCapture | null,
  useLlm = true,
): Promise<EnrichOutcome> {
  const rules = runRules(p);
  const cfg = getLlmConfig();

  if (!cfg.enabled || !useLlm) {
    return { result: rules, source: "rules" };
  }

  try {
    const ruleSummary = rules.killers.map((k) => `${k.title} [${k.severity}]`);
    const userContent = buildUserContent(p, ruleSummary, screenshots);
    const messages: ChatMessage[] = [
      { role: "system", content: ROASTER_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ];

    const content = await chatComplete(messages, {
      temperature: 0.7,
      maxTokens: 4096,
    });

    const parsed = extractJson<LlmResponse>(content);

    const killers = mergeKillers(rules.killers, normalizeKillers(parsed.killers));
    const quickWins = Array.isArray(parsed.quickWins)
      ? parsed.quickWins.filter((w): w is string => typeof w === "string").slice(0, 3)
      : rules.quickWins;
    const heroRewrite = parsed.heroRewrite && typeof parsed.heroRewrite === "object"
      ? {
          headline: String(parsed.heroRewrite.headline ?? rules.heroRewrite.headline),
          subhead: String(parsed.heroRewrite.subhead ?? rules.heroRewrite.subhead),
          cta: String(parsed.heroRewrite.cta ?? rules.heroRewrite.cta),
          rationale: String(parsed.heroRewrite.rationale ?? rules.heroRewrite.rationale),
        }
      : rules.heroRewrite;

    const verdictLabel = VALID_VERDICTS.has(parsed.verdictLabel)
      ? parsed.verdictLabel
      : rules.verdictLabel;
    const verdictBlurb = typeof parsed.verdictBlurb === "string" && parsed.verdictBlurb.length > 5
      ? parsed.verdictBlurb
      : rules.verdictBlurb;
    const summary = typeof parsed.summary === "string" && parsed.summary.length > 20
      ? parsed.summary
      : rules.summary;

    const visualCritique = normalizeVisualCritique(
      parsed.visualCritique,
      Boolean(screenshots && (screenshots.desktop || screenshots.mobile)),
    );

    return {
      result: {
        ...rules,
        killers,
        quickWins,
        heroRewrite,
        verdictLabel,
        verdictBlurb,
        summary,
        visualCritique,
      },
      source: "llm",
    };
  } catch (err) {
    const message = err instanceof LlmError ? err.message : (err as Error).message;
    console.warn(`[roast] LLM enrichment failed, using rule engine only: ${message}`);
    return {
      result: rules,
      source: "rules",
      warning: `AI enrichment unavailable (${message}). Showing rule-engine roast.`,
    };
  }
}