import type { ParsedPage } from "./types";

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function matchFirst(re: RegExp, html: string): string {
  const m = html.match(re);
  return m ? m[1].trim() : "";
}

function matchAll(re: RegExp, html: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    out.push(m[1].trim());
  }
  return out;
}

function countImg(html: string): number {
  return (html.match(/<img[\s>]/gi) || []).length;
}

function looksLikeCta(text: string): boolean {
  if (!text) return false;
  if (text.length > 60) return false;
  if (text.length < 2) return false;
  // Common CTA signals
  return /^(get|start|try|book|buy|join|sign|download|subscribe|request|see|watch|schedule|launch|create|build|generate|claim|reserve|discover|explore|talk|contact|learn|read|view|find|send|submit|click|go|continue|next|order|pick|choose|upgrade)/i.test(
    text,
  );
}

export function parseHtml(html: string, url: string): ParsedPage {
  let host = "";
  try {
    host = new URL(url).hostname;
  } catch {
    host = url;
  }

  const title = matchFirst(/<title[^>]*>([\s\S]*?)<\/title>/i, html);
  const metaDescription = matchFirst(
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
    html,
  ) || matchFirst(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i, html);

  const h1 = stripHtml(matchFirst(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html));
  const h2s = matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, html).map(stripHtml);

  const bodyRaw = matchFirst(/<body[\s\S]*?>([\s\S]*?)<\/body>/i, html) || html;
  const bodyText = stripHtml(bodyRaw);

  // CTAs: anchors + buttons
  const buttonTexts = matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi, html)
    .map(stripHtml)
    .filter(looksLikeCta);
  const anchorTexts = matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi, html)
    .map(stripHtml)
    .filter(looksLikeCta);

  // Deduplicate but preserve order
  const ctaButtons: string[] = [];
  const seen = new Set<string>();
  for (const c of [...buttonTexts, ...anchorTexts]) {
    const key = c.toLowerCase();
    if (!seen.has(key) && c.length > 1 && c.length < 60) {
      seen.add(key);
      ctaButtons.push(c);
    }
  }

  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const hasNumbers = /\b\d{2,}\b/.test(bodyText + " " + h1);
  const lower = bodyText.toLowerCase() + " " + h1.toLowerCase() + " " + h2s.join(" ").toLowerCase();
  const hasTestimonials = /testimonial|what our customers|reviews|quotes from|customers say|case study/i.test(lower);
  const hasLogos = /trusted by|as seen in|customers include|logo|featured in/i.test(lower) || countImg(html) > 4;
  const hasGuarantee = /money[- ]back|guarantee|refund|risk[- ]free|cancel anytime/i.test(lower);
  const hasPricing = /pricing|plans|\$\d|per month|\/month|from \$|tier/i.test(lower);
  const hasFAQ = /f\.?a\.?q|questions|asked questions|help center|common questions/i.test(lower);

  return {
    url,
    domain: host,
    title,
    metaDescription,
    h1,
    h2s,
    bodyText,
    ctaButtons,
    wordCount,
    hasNumbers,
    hasTestimonials,
    hasLogos,
    hasGuarantee,
    imageCount: countImg(html),
    hasPricing,
    hasFAQ,
  };
}

const TRACKING_PARAMS = [
  /^utm_/i,
  /^fbclid$/i,
  /^gclid$/i,
  /^msclkid$/i,
  /^mc_cid$/i,
  /^mc_eid$/i,
  /^_ga$/i,
  /^ref$/i,
  /^ref_/i,
];

// Strip tracking query params before fetching — saves bytes and reduces noise.
export function cleanUrl(raw: string): string {
  let url = raw.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  try {
    const u = new URL(url);
    const params = new URLSearchParams(u.search);
    const keys = Array.from(params.keys());
    for (const k of keys) {
      if (TRACKING_PARAMS.some((re) => re.test(k))) params.delete(k);
    }
    u.search = params.toString();
    // Normalize trailing slash on bare hosts (avoid /index.html vs /).
    let path = u.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
    u.pathname = path;
    return u.toString();
  } catch {
    return url;
  }
}

export async function fetchAndParse(url: string): Promise<ParsedPage> {
  const normalized = cleanUrl(url);

  // 6s cap so we stay within Vercel Hobby's 10s function budget (fetch + analyze + LLM).
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6_000);

  try {
    const res = await fetch(normalized, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; croastBot/1.0; +https://croast.io) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!res.ok) {
      throw new Error(`Upstream responded ${res.status}`);
    }

    const ct = res.headers.get("content-type") || "";
    if (ct && !ct.includes("html") && !ct.includes("text")) {
      throw new Error(`Unsupported content type: ${ct}`);
    }

    const html = await res.text();
    if (html.length < 200) throw new Error("Page is too small to analyze");

    const parsed = parseHtml(html, normalized);
    return checkJsRendered(html, parsed);
  } finally {
    clearTimeout(timeout);
  }
}

// Detect pages that load their content via JavaScript (React/Vue SPAs).
// We can't render JS on Vercel Hobby, so flag it for the form to surface.
function checkJsRendered(html: string, parsed: ParsedPage): ParsedPage {
  const bodyMatch = html.match(/<body[\s\S]*?>([\s\S]*?)<\/body>/i);
  const bodyInner = (bodyMatch?.[1] || "").trim();
  // Real text: strip scripts/styles and see what's left
  const strippedBody = bodyInner
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<template[\s\S]*?<\/template>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const realTextLength = strippedBody.length;

  const looksLikeJsApp =
    realTextLength < 200 &&
    parsed.wordCount < 30 &&
    /<div[^>]*id=["'](root|app|__next|__nuxt|main)["']/i.test(html);

  if (looksLikeJsApp) {
    return {
      ...parsed,
      jsRendered: true,
      fetchWarning:
        "This page looks like a JavaScript app (React, Vue, Next.js). The bot only sees an empty shell — switch to paste mode above for a real audit.",
    };
  }

  return parsed;
}

export function parseFromText(text: string, url: string): ParsedPage {
  // Build a minimal HTML wrapper so the same parser works
  const html = `<html><head><title></title><meta name="description" content=""/></head><body><h1>${escapeHtml(
    text.split("\n")[0] || "",
  )}</h1>${escapeHtml(text).split("\n").slice(1).join(" ")}</body></html>`;
  return parseHtml(html, url);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}