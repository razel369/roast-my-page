// POST /api/manage — exchange a Pro token for a Polar customer-portal URL.
// The browser is then redirected there so the user can manage billing,
// update card, view invoices, or cancel.

import { NextRequest, NextResponse } from "next/server";
import { createCustomerPortalSession, lookupToken } from "@/lib/polar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth && /^Bearer\s+/.test(auth)) {
    const m = auth.match(/^Bearer\s+(.+)$/);
    if (m) return m[1].trim();
  }
  return req.cookies.get("rmp_pro_token")?.value ?? null;
}

export async function POST(req: NextRequest) {
  const token = extractToken(req);
  if (!token) {
    return NextResponse.json({ error: "Not authenticated as Pro." }, { status: 401 });
  }

  const record = await lookupToken(token);
  if (!record) {
    return NextResponse.json({ error: "Pro token invalid or expired." }, { status: 401 });
  }

  try {
    const session = await createCustomerPortalSession({
      customerId: record.polarCustomerId,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Polar portal failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
