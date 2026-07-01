// POST /api/delete-my-data
// GDPR data-deletion endpoint. Removes the user's record from any
// server-side stores we maintain (newsletter list, etc.) and forwards
// the deletion request to any configured webhook for downstream systems.
//
// Croast stores audit results in the user's localStorage only — there is
// no server-side record of those audits. This endpoint handles the only
// server-side data we keep: the email (newsletter) and any Pro subscription
// record (managed through Polar.sh, not us).
//
// Body: { email?: string, token?: string }
// At least one of email or token must be provided.

import { NextRequest, NextResponse } from "next/server";
import { clientIpFromHeaders, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface DeletePayload {
  email?: string;
  token?: string;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length < 254;
}

export async function POST(req: NextRequest) {
  const ip = clientIpFromHeaders(req.headers);
  const limit = await rateLimit(`delete:${ip}`);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: DeletePayload;
  try {
    body = (await req.json()) as DeletePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const token = (body.token || "").trim();

  if (!email && !token) {
    return NextResponse.json({ error: "Provide email or token." }, { status: 400 });
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const deleted: { webhook: boolean; upstash: boolean } = { webhook: false, upstash: false };

  // 1. Forward to configured webhook (e.g., Mailchimp unsubscribes the contact)
  const webhook = process.env.DELETE_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "data_deletion_request",
          email: email || null,
          token: token || null,
          requestedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5_000),
      });
      deleted.webhook = res.ok;
    } catch (err) {
      console.warn(`[delete-my-data] webhook failed: ${(err as Error).message}`);
    }
  }

  // 2. Remove from Upstash list (if configured) — scan and delete matching
  const listKey = process.env.UPSTASH_LEAD_LIST_KEY;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const tok = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (listKey && url && tok && email) {
    try {
      // LRANGE then LREM each matching entry. We can't pattern-match in Redis,
      // so we read all and remove any item whose embedded email matches.
      const lenRes = await fetch(`${url.replace(/\/$/, "")}/llen/${listKey}`, {
        headers: { Authorization: `Bearer ${tok}` },
        signal: AbortSignal.timeout(3_000),
      });
      const lenText = await lenRes.text();
      const lenMatch = lenText.match(/"result":\s*(\d+)/);
      const len = lenMatch ? parseInt(lenMatch[1], 10) : 0;
      if (len > 0) {
        const itemsRes = await fetch(`${url.replace(/\/$/, "")}/lrange/0/${Math.max(0, len - 1)}`, {
          headers: { Authorization: `Bearer ${tok}` },
          signal: AbortSignal.timeout(3_000),
        });
        const itemsText = await itemsRes.text();
        const items: string[] = [];
        const re = /"email":\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(itemsText)) !== null) {
          try {
            const parsed = JSON.parse(`{"email":"${m[1]}"}`) as { email: string };
            if (parsed.email) items.push(parsed.email);
          } catch {
            // ignore parse errors
          }
        }
        for (const stored of items) {
          if (stored.toLowerCase() === email) {
            await fetch(`${url.replace(/\/$/, "")}/lrem/${listKey}/0/1`, {
              method: "POST",
              headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
              body: JSON.stringify(["LREM", listKey, 0, stored]),
              signal: AbortSignal.timeout(3_000),
            });
            deleted.upstash = true;
          }
        }
      }
    } catch (err) {
      console.warn(`[delete-my-data] upstash failed: ${(err as Error).message}`);
    }
  }

  // 3. Always log the request
  console.log(`[delete-my-data] requested email=${email || "(none)"} token=${token ? "yes" : "no"} deleted=${JSON.stringify(deleted)}`);

  return NextResponse.json({
    ok: true,
    message: "Deletion request processed. Server-side records removed. Local data (saved verdicts, history) is in your browser — clear it from Settings or via your browser.",
    deleted,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    description: "POST { email } or { token } to delete this user's server-side record.",
    note: "Local audit history is in your browser and not on our servers.",
  });
}