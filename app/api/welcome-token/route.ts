// GET /api/welcome-token?email=... — looks up the most recent Pro token
// for the given email. Used by /welcome when the webhook hasn't arrived yet.

import { NextRequest, NextResponse } from "next/server";
import { lookupToken, upstashConfigured } from "@/lib/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  if (!upstashConfigured()) {
    return NextResponse.json({
      token: null,
      warning: "Token store is in-memory only — webhook events on a fresh server will not match.",
    });
  }

  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  try {
    // Scan keys with email match (slow on big datasets but fine for our volume).
    const result = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "SCAN",
        "0",
        "MATCH",
        "rmp_pro_tokens:*",
        "COUNT",
        "100",
      ]),
      signal: AbortSignal.timeout(5_000),
    });
    if (!result.ok) return NextResponse.json({ error: "Scan failed." }, { status: 500 });
    const data = (await result.json()) as Array<{ result?: [string, string[]] }>;
    const keys = data[0]?.result?.[1] || [];
    for (const k of keys) {
      if (k.startsWith("rmp_pro_tokens:sub:")) continue;
      const val = await lookupToken(k.replace("rmp_pro_tokens:", ""));
      if (val && val.email.toLowerCase() === email) {
        return NextResponse.json({ token: k.replace("rmp_pro_tokens:", "") });
      }
    }
    return NextResponse.json({ token: null });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
