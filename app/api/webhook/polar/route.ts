// POST /api/webhook/polar — Polar calls us on subscription events.
// Mint or revoke Pro tokens based on event type.

import { NextRequest, NextResponse } from "next/server";
import {
  getPolarConfig,
  issueToken,
  revokeBySubscription,
  verifyWebhookSignatureAsync,
} from "@/lib/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SubscriptionLike {
  id: string;
  status: string;
  customer_id: string;
  customer?: { email?: string };
  product_id: string;
}

function planFromProductId(productId: string): "pro" | "team" {
  const cfg = getPolarConfig();
  if (productId === cfg.productTeam) return "team";
  return "pro";
}

function extractSubscription(payload: unknown): SubscriptionLike | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (obj.subscription && typeof obj.subscription === "object") {
    return obj.subscription as SubscriptionLike;
  }
  // Some events embed the subscription fields directly on data.
  if (typeof obj.id === "string" && typeof obj.customer_id === "string") {
    return obj as unknown as SubscriptionLike;
  }
  return null;
}

async function handleEvent(event: string, payload: unknown) {
  const sub = extractSubscription(payload);
  if (!sub || !sub.id) {
    console.warn(`[webhook/polar] ${event}: no subscription in payload`);
    return;
  }

  if (
    event === "subscription.created" ||
    event === "subscription.active" ||
    event === "subscription.updated"
  ) {
    const email = sub.customer?.email;
    const customerId = sub.customer_id;
    if (!email || !customerId) {
      console.warn(`[webhook/polar] ${event}: missing email or customer_id`);
      return;
    }
    const plan = planFromProductId(sub.product_id);
    await issueToken({
      plan,
      email,
      polarCustomerId: customerId,
      polarSubscriptionId: sub.id,
      issuedAt: Date.now(),
    });
    console.log(`[webhook/polar] ${event}: ${plan} subscription for ${email}`);
    return;
  }

  if (event === "subscription.canceled" || event === "subscription.revoked") {
    await revokeBySubscription(sub.id);
    console.log(`[webhook/polar] ${event}: revoked access for ${sub.id}`);
  }
}

export async function POST(req: NextRequest) {
  const cfg = getPolarConfig();
  if (!cfg.enabled) {
    return NextResponse.json({ error: "Polar not configured" }, { status: 503 });
  }

  const rawBody = await req.text();

  const headers = {
    id: req.headers.get("webhook-id") || "",
    timestamp: req.headers.get("webhook-timestamp") || "",
    signature: req.headers.get("webhook-signature") || "",
  };

  if (cfg.webhookSecret) {
    const ok = await verifyWebhookSignatureAsync(rawBody, headers, cfg.webhookSecret);
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload: { type?: string; data?: unknown };
  try {
    payload = JSON.parse(rawBody) as { type?: string; data?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.type) {
    return NextResponse.json({ error: "Missing event type" }, { status: 400 });
  }

  try {
    await handleEvent(payload.type, payload.data);
  } catch (err) {
    console.error(`[webhook/polar] handler error: ${(err as Error).message}`);
  }

  return NextResponse.json({ received: true });
}
