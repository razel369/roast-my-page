// POST /api/checkout — creates a Polar checkout session and returns the URL.
// Browser is then redirected client-side.

import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      plan?: "pro" | "team";
      email?: string;
    };
    const plan = body.plan;
    if (!plan || (plan !== "pro" && plan !== "team")) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://roastmypage.com";

    const session = await createCheckoutSession({
      plan,
      email: body.email,
      successUrl: `${origin.replace(/\/$/, "")}/welcome?checkout_id={CHECKOUT_ID}`,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
