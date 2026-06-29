import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan: string | undefined = body?.plan;

    if (!plan || !["pro", "team"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan. Must be 'pro' or 'team'." }, { status: 400 });
    }

    const order = await createOrder({ plan: plan as "pro" | "team" });
    return NextResponse.json(order);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
