// CSV export utilities for multi-page audits.
// Builds a CSV blob and triggers a browser download.

import type { MultiPageRoast, RoastResult } from "./types";

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function row(...cells: unknown[]): string {
  return cells.map(escapeCsvCell).join(",");
}

export function buildMultiPageCsv(roast: MultiPageRoast): string {
  const lines: string[] = [];
  // Header
  lines.push(row("Croast multi-page audit report"));
  lines.push(row("Domain", roast.domain));
  lines.push(row("Site score", roast.siteScore, "/ 100"));
  lines.push(row("Site verdict", roast.siteVerdictLabel));
  lines.push(row("Pages audited", roast.pages.length));
  lines.push(row("Generated", new Date(roast.timestamp).toISOString()));
  lines.push(row());
  // Flow metrics
  lines.push(row("FLOW METRICS"));
  lines.push(row("Funnel coherent", roast.flow.funnelCoherent ? "yes" : "no"));
  lines.push(row("CTA consistency", roast.flow.ctaConsistency, "/ 100"));
  lines.push(row("Message consistency", roast.flow.messageConsistency, "/ 100"));
  lines.push(row("Weakest page", roast.flow.weakestPage || ""));
  lines.push(row("Strongest page", roast.flow.strongestPage || ""));
  lines.push(row());
  // Per-page detail
  lines.push(row("PER-PAGE BREAKDOWN"));
  lines.push(row("Path", "URL", "Score", "Verdict", "CTAs", "Headline", "Top issue", "Top issue severity", "Word count"));
  for (const p of roast.pages) {
    let path = "";
    try {
      path = new URL(p.url).pathname || "/";
    } catch {}
    const topKiller = p.killers[0];
    lines.push(
      row(
        path,
        p.url,
        p.score,
        p.verdictLabel,
        p.metrics.ctaCount,
        p.originalH1 || p.heroRewrite?.headline || "",
        topKiller?.title || "",
        topKiller?.severity || "",
        p.metrics.wordCount,
      ),
    );
  }
  lines.push(row());
  // Cross-page recommendations
  if (roast.crossPageRecommendations.length > 0) {
    lines.push(row("CROSS-PAGE RECOMMENDATIONS"));
    roast.crossPageRecommendations.forEach((r, i) => lines.push(row(i + 1, r)));
    lines.push(row());
  }
  // Per-page killer detail
  lines.push(row("ISSUES PER PAGE"));
  for (const p of roast.pages) {
    let path = "";
    try {
      path = new URL(p.url).pathname || "/";
    } catch {}
    lines.push(row(`Page: ${path}`));
    for (const k of p.killers) {
      lines.push(row(k.severity, k.title, k.fix));
    }
    lines.push(row());
  }
  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportMultiPageToCsv(roast: MultiPageRoast): void {
  const csv = buildMultiPageCsv(roast);
  const safeDomain = roast.domain.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-");
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(`croast-${safeDomain}-${date}.csv`, csv);
}

// Single-page export
export function buildSinglePageCsv(roast: RoastResult): string {
  const lines: string[] = [];
  lines.push(row("Croast single-page audit report"));
  lines.push(row("URL", roast.url));
  lines.push(row("Domain", roast.domain));
  lines.push(row("Score", roast.score, "/ 100"));
  lines.push(row("Verdict", roast.verdictLabel));
  lines.push(row("Generated", new Date(roast.timestamp).toISOString()));
  lines.push(row());
  lines.push(row("HEADLINE", "EVIDENCE", "FIX", "SEVERITY"));
  for (const k of roast.killers) {
    lines.push(row(k.title, k.evidence, k.fix, k.severity));
  }
  lines.push(row());
  lines.push(row("QUICK WINS"));
  roast.quickWins.forEach((w, i) => lines.push(row(i + 1, w)));
  lines.push(row());
  lines.push(row("TRUST SIGNALS", "PRESENT"));
  roast.trustAnalysis.signals.forEach(s => lines.push(row(s)));
  lines.push(row());
  lines.push(row("OPEN OBJECTIONS"));
  roast.objectionMap.missing.forEach(o => lines.push(row(o)));
  return lines.join("\n");
}

export function exportSinglePageToCsv(roast: RoastResult): void {
  const csv = buildSinglePageCsv(roast);
  const safeDomain = roast.domain.replace(/[^a-z0-9-]/gi, "-").replace(/-+/g, "-");
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(`croast-${safeDomain}-${date}.csv`, csv);
}