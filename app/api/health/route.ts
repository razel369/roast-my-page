import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    web: { status: "operational", latencyMs: 0 },
    api: { status: "operational", latencyMs: 0 },
    roast: { status: "operational", latencyMs: 0 },
  };
  return NextResponse.json({
    status: "operational",
    timestamp: new Date().toISOString(),
    version: "0.4.0",
    checks,
  });
}