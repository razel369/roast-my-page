import { NextRequest, NextResponse } from "next/server";
import { fetchAndParse, parseFromText } from "@/lib/fetcher";
import { enrichRoast } from "@/lib/enrich";
import { clientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { getLlmConfig } from "@/lib/llm";
import { captureScreenshots, captureBackend, type ScreenshotCapture } from "@/lib/screenshot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isProRequest(req: NextRequest): boolean {
  const key = req.headers.get("x-api-key") || req.nextUrl.searchParams.get("api_key");
  const proKey = process.env.PRO_API_KEY;
  return !!proKey && key === proKey;
}

export async function POST(req: NextRequest) {
  const isPro = isProRequest(req);

  if (!isPro) {
    const ip = clientIpFromHeaders(req.headers);
    const limit = await rateLimit(`roast:${ip}`);

    if (!limit.allowed) {
      const resetIn = Math.ceil(limit.resetMs / 1000);
      return NextResponse.json(
        { error: `Free tier: 3 verdicts per day. Try again in ${resetIn}s, or subscribe for unlimited.` },
        {
          status: 429,
          headers: {
            "Retry-After": String(resetIn),
            "X-RateLimit-Remaining": "0",
          },
        },
      );
    }
  }

  try {
    const body = await req.json().catch(() => ({}));
    const url: string | undefined = body?.url;
    const text: string | undefined = body?.text;
    const includeScreenshots: boolean = isPro && body?.screenshots !== false;

    if (!url && !text) {
      return NextResponse.json({ error: "Provide a url or text." }, { status: 400 });
    }

    let parsed;
    let fetchWarning: string | undefined;
    if (text && text.trim().length > 20) {
      parsed = parseFromText(text, url || "https://pasted.local");
    } else {
      try {
        parsed = await fetchAndParse(url!);
        fetchWarning = parsed.fetchWarning;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Fetch failed";
        return NextResponse.json(
          { error: `Couldn't fetch that page: ${message}. Try pasting your copy directly instead.` },
          { status: 502 },
        );
      }
    }

    const screenshotsPromise: Promise<ScreenshotCapture> = includeScreenshots && captureBackend() !== "disabled" && url
      ? captureScreenshots(url)
      : Promise.resolve({ desktop: null, mobile: null, errors: [], elapsedMs: 0, backend: "disabled" });

    const { result, source, warning: llmWarning } = await enrichRoast(parsed, await screenshotsPromise, isPro);
    const warning = fetchWarning || llmWarning;

    return NextResponse.json(
      { result, source, warning, llmEnabled: isPro && getLlmConfig().enabled, plan: isPro ? "pro" : "free" },
      {
        headers: {
          "X-RateLimit-Remaining": String(isPro ? "unlimited" : "0"),
          "Cache-Control": "no-store",
          "X-Source": source,
          "X-Plan": isPro ? "pro" : "free",
        },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    plan: "free: 3/day rules-only · pro: unlimited + LLM + screenshots",
    llm: getLlmConfig(),
    screenshots: captureBackend(),
    hint: "POST { url } or { text } to roast. Pro users include x-api-key header.",
  });
}
