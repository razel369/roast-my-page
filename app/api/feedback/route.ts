// Post-verdict feedback endpoint.
// Optional persistence: LEAD_WEBHOOK_URL, or Upstash list (UPSTASH_FEEDBACK_LIST_KEY).
// Always logs to stdout so devs see it in Vercel logs.

import { NextRequest, NextResponse } from "next/server";
import { clientIpFromHeaders, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FeedbackPayload {
  verdictId?: string;
  domain?: string;
  score?: number;
  helpful: boolean;
  reason?: string;
  source?: string; // "share_view" | "results_inline"
}

const ALLOWED_REASONS = new Set([
  "generic",
  "wrong-score",
  "missing-issue",
  "good",
  "too-long",
  "other",
]);

export async function POST(req: NextRequest) {
  const ip = clientIpFromHeaders(req.headers);
  const limit = await rateLimit(`feedback:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Slow down." }, { status: 429 });
  }

  let body: FeedbackPayload;
  try {
    body = (await req.json()) as FeedbackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (typeof body.helpful !== "boolean") {
    return NextResponse.json({ error: "Missing helpful flag." }, { status: 400 });
  }
  const reason = typeof body.reason === "string" && ALLOWED_REASONS.has(body.reason)
    ? body.reason
    : undefined;

  const enriched = {
    helpful: body.helpful,
    reason,
    verdictId: body.verdictId || null,
    domain: body.domain || null,
    score: typeof body.score === "number" ? body.score : null,
    source: body.source || "unknown",
    userAgent: req.headers.get("user-agent") || "",
    timestamp: new Date().toISOString(),
  };

  // 1) Webhook
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "feedback", ...enriched }),
        signal: AbortSignal.timeout(4_000),
      });
    } catch (err) {
      console.warn(`[feedback] webhook failed: ${(err as Error).message}`);
    }
  }

  // 2) Upstash
  const listKey = process.env.UPSTASH_FEEDBACK_LIST_KEY;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (listKey && url && token) {
    try {
      await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(["LPUSH", listKey, JSON.stringify(enriched)]),
        signal: AbortSignal.timeout(3_000),
      });
    } catch (err) {
      console.warn(`[feedback] upstash push failed: ${(err as Error).message}`);
    }
  }

  // 3) Always log
  const emoji = enriched.helpful ? "👍" : "👎";
  console.log(`[feedback] ${emoji} ${enriched.domain || "?"} (score=${enriched.score}) reason=${enriched.reason || "—"}`);

  return NextResponse.json({ ok: true });
}
