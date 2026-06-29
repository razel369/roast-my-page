// Email subscription endpoint.
// Persistence (any of):
//   - UPSTASH_LEAD_LIST_KEY  → push to a Redis list (free tier covers this)
//   - LEAD_WEBHOOK_URL       → POST JSON to a generic webhook (Mailchimp, Loops, etc.)
//   - LEAD_FORWARD_EMAIL     → log-only fallback for local dev
//
// If none are configured, the endpoint accepts the email and returns success
// silently — never blocks the user-facing flow.

import { NextRequest, NextResponse } from "next/server";
import { clientIpFromHeaders, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length < 254;
}

interface LeadPayload {
  email: string;
  score?: number;
  source?: string;
}

export async function POST(req: NextRequest) {
  const ip = clientIpFromHeaders(req.headers);
  const limit = await rateLimit(`lead:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Slow down." }, { status: 429 });
  }

  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const enriched = {
    email,
    score: typeof body.score === "number" ? body.score : null,
    source: body.source || "post_roast_modal",
    userAgent: req.headers.get("user-agent") || "",
    timestamp: new Date().toISOString(),
  };

  // 1) Webhook (Mailchimp, Loops, Beehiiv, Zapier, etc.)
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enriched),
        signal: AbortSignal.timeout(5_000),
      });
      if (!res.ok) {
        console.warn(`[subscribe] webhook returned ${res.status}`);
      }
    } catch (err) {
      console.warn(`[subscribe] webhook failed: ${(err as Error).message}`);
    }
  }

  // 2) Upstash Redis list (optional, requires UPSTASH_REDIS_REST_URL + _TOKEN).
  // Uses raw REST to avoid a hard @upstash/redis dependency.
  const listKey = process.env.UPSTASH_LEAD_LIST_KEY;
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (listKey && upstashUrl && upstashToken) {
    try {
      const payload = ["LPUSH", listKey, JSON.stringify(enriched)];
      await fetch(`${upstashUrl.replace(/\/$/, "")}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${upstashToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3_000),
      });
    } catch (err) {
      console.warn(`[subscribe] upstash push failed: ${(err as Error).message}`);
    }
  }

  // 3) Forward to email (no SMTP — uses a webhook transport, optional)
  // Done implicitly by LEAD_WEBHOOK_URL above.

  // 4) Always log so devs see it in Vercel logs.
  console.log(`[lead] ${enriched.email} (score=${enriched.score})`);

  return NextResponse.json({ ok: true });
}
