// Site-level scoring for multi-page audits.
// Takes the per-page results and produces a coherent flow analysis.

import type { FlowAnalysis, RoastResult, Verdict, MultiPageRoast, Killer } from "./types";

const VERDICT_LABEL: Record<Verdict, string> = {
  "conversion-killer": "Conversion Killer",
  "needs-work": "Needs Work",
  "decent": "Solid",
  "strong": "Strong",
};

const VERDICT_WEIGHT: Record<Verdict, number> = {
  "conversion-killer": 25,
  "needs-work": 55,
  "decent": 78,
  "strong": 92,
};

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function stringSimilarity(a: string, b: string): number {
  const max = Math.max(a.length, b.length);
  if (max === 0) return 1;
  return 1 - levenshtein(a, b) / max;
}

export function aggregateSiteScore(pages: RoastResult[]): number {
  if (pages.length === 0) return 0;
  // Weighted: worst page weighs most, average fills the rest
  const scores = pages.map((p) => VERDICT_WEIGHT[p.verdict]);
  const avg = scores.reduce((s, x) => s + x, 0) / scores.length;
  const min = Math.min(...scores);
  // If only 1 page, just return its score. Otherwise blend 60% worst + 40% avg
  if (pages.length === 1) return scores[0];
  return Math.round(min * 0.6 + avg * 0.4);
}

function verdictFromScore(score: number): { verdict: Verdict; label: string } {
  if (score < 35) return { verdict: "conversion-killer", label: VERDICT_LABEL["conversion-killer"] };
  if (score < 60) return { verdict: "needs-work", label: VERDICT_LABEL["needs-work"] };
  if (score < 80) return { verdict: "decent", label: VERDICT_LABEL["decent"] };
  return { verdict: "strong", label: VERDICT_LABEL["strong"] };
}

function checkCTAAlignment(pages: RoastResult[]): { score: number; note: string } {
  if (pages.length < 2) return { score: 100, note: "Only one page audited; CTA alignment is trivially aligned." };
  const ctaLists = pages.map((p) => p.heroRewrite.cta.toLowerCase().trim());
  const first = ctaLists[0];
  const total = pages.length - 1;
  let matching = 0;
  for (let i = 1; i < ctaLists.length; i++) {
    if (stringSimilarity(first, ctaLists[i]) > 0.6) matching++;
  }
  const score = Math.round((matching / total) * 100);
  const note =
    score >= 80
      ? "Your CTAs are consistent across the funnel."
      : score >= 50
        ? "Your CTAs drift across pages. The homepage says one thing, the pricing page says another."
        : "Your CTAs are inconsistent. Visitors landing on a deeper page get a different ask than the homepage.";
  return { score, note };
}

function checkMessageAlignment(pages: RoastResult[]): { score: number; note: string } {
  if (pages.length < 2) return { score: 100, note: "" };
  const headlines = pages.map((p) => p.heroRewrite.headline.toLowerCase());
  const subs = pages.map((p) => p.heroRewrite.subhead.toLowerCase());
  let totalSim = 0;
  let count = 0;
  for (let i = 0; i < headlines.length; i++) {
    for (let j = i + 1; j < headlines.length; j++) {
      totalSim += stringSimilarity(headlines[i], headlines[j]) * 0.6 + stringSimilarity(subs[i], subs[j]) * 0.4;
      count++;
    }
  }
  const score = count === 0 ? 100 : Math.round((totalSim / count) * 100);
  const note =
    score >= 75
      ? "Your value proposition is consistent across pages."
      : score >= 50
        ? "Your value prop shifts page to page. Visitors sense the seams."
        : "Your pages tell different stories. The funnel has cognitive breaks.";
  return { score, note };
}

function funnelIsCoherent(pages: RoastResult[]): { coherent: boolean; note: string } {
  if (pages.length < 2) return { coherent: true, note: "Single-page audit; no funnel to evaluate." };
  // Look for escalation of specificity: pricing should reference features, signup should reference pricing, etc.
  const urlHints = pages.map((p) => {
    const u = p.url.toLowerCase();
    if (/pricing|price|cost/.test(u)) return "pricing";
    if (/signup|register|join|start/.test(u)) return "signup";
    if (/about|team|company|story/.test(u)) return "about";
    if (/feature|capabilities|product/.test(u)) return "features";
    if (/contact|demo|sales|talk/.test(u)) return "contact";
    if (/blog|article|post/.test(u)) return "blog";
    return "unknown";
  });

  // Funnel order heuristic
  const order: Record<string, number> = {
    home: 0, features: 1, pricing: 2, signup: 3, about: 4, blog: 5, contact: 6, unknown: -1,
  };
  // pages[0] should typically be home (no path) — accept anything
  const orders = urlHints.map((h) => order[h] ?? -1);
  let monotonic = true;
  for (let i = 1; i < orders.length; i++) {
    if (orders[i] !== -1 && orders[i - 1] !== -1 && orders[i] < orders[i - 1]) {
      monotonic = false;
      break;
    }
  }
  return {
    coherent: monotonic,
    note: monotonic
      ? "Your pages follow a logical progression."
      : "Your URL order is out of sequence (e.g., signup before pricing). Visitors hit a signup CTA before they have context.",
  };
}

function dedupeKillers(pages: RoastResult[]): Killer[] {
  // Find killers that appear across multiple pages (systemic issues)
  const all = pages.flatMap((p) => p.killers);
  const seen = new Map<string, Killer>();
  for (const k of all) {
    const key = k.title.toLowerCase();
    if (!seen.has(key) || k.severity === "critical") seen.set(key, k);
  }
  return Array.from(seen.values()).slice(0, 5);
}

export function buildMultiPageRoast(pages: RoastResult[]): MultiPageRoast {
  const siteScore = aggregateSiteScore(pages);
  const { verdict: siteVerdict, label: siteVerdictLabel } = verdictFromScore(siteScore);
  const ctaCheck = checkCTAAlignment(pages);
  const msgCheck = checkMessageAlignment(pages);
  const funnelCheck = funnelIsCoherent(pages);

  const sortedByScore = [...pages].sort((a, b) => a.score - b.score);
  const weakestPage = sortedByScore[0]?.url ?? null;
  const strongestPage = sortedByScore[sortedByScore.length - 1]?.url ?? null;

  const flow: FlowAnalysis = {
    funnelCoherent: funnelCheck.coherent,
    ctaConsistency: ctaCheck.score,
    messageConsistency: msgCheck.score,
    weakestPage,
    strongestPage,
    notes: [
      ctaCheck.note,
      msgCheck.note,
      funnelCheck.note,
      weakestPage ? `Weakest page in your funnel: ${new URL(weakestPage).pathname || "/"} (${sortedByScore[0].score}/100).` : "",
    ].filter(Boolean),
  };

  return {
    id: `mp-${Date.now()}`,
    domain: pages[0]?.domain ?? "",
    timestamp: Date.now(),
    siteScore,
    siteVerdict,
    siteVerdictLabel,
    pages,
    flow,
    crossPageRecommendations: [
      weakestPage && pages.length > 1
        ? `Fix ${new URL(weakestPage).pathname || "/"} first — it's your weakest page and your funnel's bottleneck.`
        : "",
      ctaCheck.score < 70
        ? "Align the call-to-action across all pages. The pricing page and the homepage should ask for the same thing."
        : "",
      msgCheck.score < 70
        ? "Tighten your headline and subhead across pages. Visitors should feel like they're on the same product from page to page."
        : "",
      funnelCheck.coherent
        ? ""
        : "Reorder your pages so each one builds on the last. Pricing should come before signup.",
    ].filter(Boolean),
  };
}