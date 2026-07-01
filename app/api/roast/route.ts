import { NextRequest, NextResponse } from "next/server";
import { fetchAndParse, parseFromText } from "@/lib/fetcher";
import { enrichRoast } from "@/lib/enrich";
import { clientIpFromHeaders, rateLimit } from "@/lib/rateLimit";
import { getLlmConfig } from "@/lib/llm";
import { captureScreenshots, captureBackend, type ScreenshotCapture } from "@/lib/screenshot";
import { lookupToken, type ProRecord } from "@/lib/polar";
import { buildMultiPageRoast } from "@/lib/siteScore";
import type { RoastResult } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function extractBearerOrCookie(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth && /^Bearer\s+/.test(auth)) {
    const m = auth.match(/^Bearer\s+(.+)$/);
    if (m) return m[1].trim();
  }
  const cookie = req.cookies.get("rmp_pro_token")?.value;
  if (cookie) return cookie;
  return null;
}

async function getProRecord(req: NextRequest): Promise<ProRecord | null> {
  const token = extractBearerOrCookie(req);
  if (!token) return null;
  return lookupToken(token);
}

function normalizeUrl(u: string): string {
  return u.startsWith("http") ? u : "https://" + u;
}

// Per-page audit pipeline. Throws on fetch/parse failure.
async function auditOne(url: string, isPro: boolean, includeScreenshots: boolean): Promise<RoastResult> {
  const parsed = await fetchAndParse(url);
  const fetchWarning = parsed.fetchWarning;

  const screenshotsPromise: Promise<ScreenshotCapture> =
    includeScreenshots && captureBackend() !== "disabled"
      ? captureScreenshots(url)
      : Promise.resolve({ desktop: null, mobile: null, errors: [], elapsedMs: 0, backend: "disabled" });

  const useLlm = isPro;
  const { result, source, warning: llmWarning } = await enrichRoast(parsed, await screenshotsPromise, useLlm);
  // Attach fetch warning
  return { ...result, ...(fetchWarning ? { fetchWarning } : {}) } as RoastResult;
}

export async function POST(req: NextRequest) {
  const pro = await getProRecord(req);
  const isPro = !!pro;

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
    const body = (await req.json().catch(() => ({}))) as {
      url?: string;
      text?: string;
      urls?: unknown;
      screenshots?: boolean;
    };
    const url = body?.url;
    const text = body?.text;
    const includeScreenshots = isPro && body?.screenshots !== false;

    if (!url && !text && !Array.isArray(body?.urls)) {
      return NextResponse.json({ error: "Provide a url, text, or urls[]." }, { status: 400 });
    }

    // Multi-page flow: array of URLs
    if (Array.isArray(body?.urls) && body.urls.length > 0) {
      const urls = (body.urls as unknown[])
        .map((u) => (typeof u === "string" ? u.trim() : ""))
        .filter((u) => u.length > 0)
        .slice(0, 5); // cap at 5 pages

      if (urls.length === 0) {
        return NextResponse.json({ error: "urls[] must contain at least one URL." }, { status: 400 });
      }

      const normalized = urls.map(normalizeUrl);

      // Run audits in parallel; each page can fail independently.
      const audits = await Promise.allSettled(normalized.map((u) => auditOne(u, isPro, false)));

      const pages: RoastResult[] = [];
      const pageErrors: { url: string; error: string }[] = [];
      audits.forEach((r, i) => {
        if (r.status === "fulfilled") {
          pages.push(r.value);
        } else {
          pageErrors.push({
            url: normalized[i],
            error: r.reason instanceof Error ? r.reason.message : "Unknown",
          });
        }
      });

      if (pages.length === 0) {
        return NextResponse.json(
          { error: "All pages failed to audit. Check that the URLs are reachable." },
          { status: 502 },
        );
      }

      const multi = buildMultiPageRoast(pages);
      return NextResponse.json(
        {
          result: multi,
          source: "rules",
          plan: isPro ? "pro" : "free",
          pageErrors: pageErrors.length > 0 ? pageErrors : undefined,
        },
        { headers: { "Cache-Control": "no-store", "X-Plan": isPro ? "pro" : "free", "X-MultiPage": "true" } },
      );
    }

    // Single-page flow (existing path)
    let parsed;
    let fetchWarning: string | undefined;
    if (text && text.trim().length > 20) {
      parsed = parseFromText(text, url || "https://pasted.local");
    } else {
      try {
        const result = await fetchAndParse(url!);
        parsed = result;
        fetchWarning = result.fetchWarning;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Fetch failed";
        return NextResponse.json(
          { error: `Couldn\u0027t fetch that page: ${message}. Try pasting your copy directly instead.` },
          { status: 502 },
        );
      }
    }

    const screenshotsPromise: Promise<ScreenshotCapture> =
      includeScreenshots && captureBackend() !== "disabled" && url
        ? captureScreenshots(url)
        : Promise.resolve({ desktop: null, mobile: null, errors: [], elapsedMs: 0, backend: "disabled" });

    const useLlm = isPro;
    const { result, source, warning: llmWarning } = await enrichRoast(parsed, await screenshotsPromise, useLlm);
    const warning = fetchWarning || llmWarning;

    return NextResponse.json(
      {
        result,
        source,
        warning,
        llmEnabled: useLlm && getLlmConfig().enabled,
        plan: isPro ? pro!.plan : "free",
      },
      {
        headers: {
          "X-RateLimit-Remaining": isPro ? "unlimited" : "0",
          "Cache-Control": "no-store",
          "X-Source": source,
          "X-Plan": isPro ? pro!.plan : "free",
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
    plan: "free: 3/day rules-only · pro: unlimited + LLM + screenshots (subscription required)",
    llm: getLlmConfig(),
    screenshots: captureBackend(),
    hint: "POST { url } or { urls: string[] } to roast. Pro users include Authorization: Bearer <token>.",
  });
}