"use client";
import Link from "next/link";
import { useState } from "react";
import type { MultiPageRoast, RoastResult } from "@/lib/types";
import { ShareButton } from "./ShareButton";
import { FeedbackWidget } from "./FeedbackWidget";
import { DiagnosticGrid } from "./DiagnosticGrid";
import { ActionPlanChecklist } from "./ActionPlanChecklist";
import { TrustAudit } from "./TrustAudit";

interface Props {
  result: MultiPageRoast;
}

function verdictColor(v: string): string {
  if (v === "Conversion Killer") return "var(--vermillion)";
  if (v === "Needs Work") return "var(--warn)";
  if (v === "Solid") return "var(--gold)";
  return "var(--forest)";
}
export function MultiPageResults({ result }: Props) {
  const accent = verdictColor(result.siteVerdictLabel);
  const [expandedPage, setExpandedPage] = useState<number | null>(null);

  return (
    <section className="document pt-12 pb-12 space-y-14 animate-fade-in">
      {/* Site-level verdict banner */}
      <div
        className="relative overflow-hidden border-2 border-ink-900 bg-bone-50 animate-stamp-drop"
        style={{ boxShadow: "8px 8px 0 #0F0F0F" }}
      >
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-[0.03] select-none" aria-hidden>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-l border-ink-900" />
          ))}
        </div>
        <div className="relative grid gap-6 px-6 py-8 sm:grid-cols-[auto_1fr] sm:items-end sm:gap-10 sm:px-10 sm:py-10">
          <div>
            <div className="filing mb-1">SITE FILING · {result.domain}</div>
            <div className="flex items-baseline gap-3 mt-2">
              <span
                className="font-display clamp-stat leading-none"
                style={{
                  color: accent,
                  fontVariationSettings: "'wght' 900, 'opsz' 144, 'SOFT' 0",
                }}
              >
                {result.siteScore}
              </span>
              <span className="font-display text-3xl font-bold text-ink-900/40 sm:text-5xl">/ 100</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="inline-block border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-stamped font-bold"
              style={{ borderColor: accent, color: accent, background: "var(--bone-100)" }}
            >
              Site verdict · {result.siteVerdictLabel}
            </div>
            <h2 className="mt-3 display text-3xl sm:text-4xl text-ink-900">
              {result.pages.length}-page funnel audited
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <ShareButton result={result.pages[0]} />
            </div>
          </div>
        </div>
      </div>

      {/* Flow analysis */}
      <section>
        <header>
          <div className="filing">§ II · Funnel analysis</div>
          <h3 className="display mt-2 text-2xl sm:text-3xl">How your pages work as a funnel</h3>
          <div className="mt-3 hairline" />
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <FlowMetric
            label="CTA consistency"
            score={result.flow.ctaConsistency}
            note={result.flow.notes.find((n) => /CTA/i.test(n)) ?? ""}
          />
          <FlowMetric
            label="Message consistency"
            score={result.flow.messageConsistency}
            note={result.flow.notes.find((n) => /message|prop/i.test(n)) ?? ""}
          />
          <FlowMetric
            label="Funnel order"
            score={result.flow.funnelCoherent ? 100 : 40}
            note={result.flow.notes.find((n) => /logical|sequence|progression|order/i.test(n)) ?? ""}
          />
        </div>

        {result.flow.weakestPage && (
          <div className="mt-4 border-l-4 border-vermillion bg-highlight-tint px-4 py-3 font-body text-sm text-ink-900">
            <span className="font-bold uppercase tracking-stamped">Weakest link · </span>
            <span className="font-mono text-xs">
              {new URL(result.flow.weakestPage).pathname || "/"}
            </span>
            <span className="block mt-1 font-body text-xs text-ink-700">
              This is your bottleneck. Fixing it lifts the entire site.
            </span>
          </div>
        )}

        {result.crossPageRecommendations.length > 0 && (
          <div className="mt-4 border border-ink-900 bg-bone-100 px-4 py-3">
            <div className="filing mb-2 text-vermillion font-bold">Cross-page fixes</div>
            <ol className="space-y-2">
              {result.crossPageRecommendations.map((rec, i) => (
                <li key={i} className="flex gap-3 font-body text-sm text-ink-900 leading-relaxed">
                  <span className="font-mono text-xs text-vermillion font-bold shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* Per-page cards */}
      <section>
        <header>
          <div className="filing">§ III · Page-by-page</div>
          <h3 className="display mt-2 text-2xl sm:text-3xl">Each page in detail</h3>
          <p className="mt-2 font-body text-sm text-ink-700">
            Sorted weakest first. Click a page to see the full audit.
          </p>
          <div className="mt-3 hairline" />
        </header>

        <div className="mt-5 space-y-3">
          {result.pages.map((page, i) => (
            <PageCard
              key={page.id || page.url}
              page={page}
              rank={i + 1}
              total={result.pages.length}
              expanded={expandedPage === i}
              onToggle={() => setExpandedPage(expandedPage === i ? null : i)}
            />
          ))}
        </div>
      </section>

      <FeedbackWidget verdictId={result.id} domain={result.domain} score={result.siteScore} source="results_inline" />
    </section>
  );
}

function FlowMetric({ label, score, note }: { label: string; score: number; note: string }) {
  const color = score >= 75 ? "var(--forest)" : score >= 50 ? "var(--warn)" : "var(--vermillion)";
  return (
    <div className="border border-ink-900 bg-bone-50 px-4 py-4">
      <div className="filing mb-1">{label}</div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-display text-4xl font-bold" style={{ color, fontVariationSettings: "'wght' 800, 'opsz' 144" }}>
          {score}
        </span>
        <span className="font-mono text-xs text-ink-500">/ 100</span>
      </div>
      <div className="h-1 w-full bg-bone-200 overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${score}%`, background: color }} />
      </div>
      {note && <p className="mt-2 font-body text-xs text-ink-700 leading-snug">{note}</p>}
    </div>
  );
}

function PageCard({
  page,
  rank,
  total,
  expanded,
  onToggle,
}: {
  page: RoastResult;
  rank: number;
  total: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const isWeakest = rank === 1;
  const accent = isWeakest
    ? "var(--vermillion)"
    : page.verdictLabel === "Needs Work"
      ? "var(--warn)"
      : page.verdictLabel === "Solid"
        ? "var(--gold)"
        : "var(--forest)";
  return (
    <article className="border border-ink-900 bg-bone-50 transition-all">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-bone-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion"
      >
        <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-500 w-12 shrink-0">
          {String(rank).padStart(2, "0")} / {total}
        </span>
        <span className="flex-1 min-w-0 truncate font-mono text-sm text-ink-900">
          {new URL(page.url).pathname || "/"}
        </span>
        <span
          className="font-display text-2xl font-bold shrink-0"
          style={{ color: accent, fontVariationSettings: "'wght' 800, 'opsz' 144" }}
        >
          {page.score}
        </span>
        <span
          className="font-mono text-[9px] uppercase tracking-stamped font-bold shrink-0"
          style={{ color: accent }}
        >
          {page.verdictLabel}
        </span>
        <span className={`font-mono text-sm text-ink-500 transition-transform ${expanded ? "rotate-90" : ""}`}>
          ▸
        </span>
      </button>
      {expanded && (
        <div className="border-t border-ink-900 px-4 py-4 space-y-4 animate-fade-in">
          {page.summary && (
            <div className="border-l-2 border-ink-900 pl-3 font-body text-sm text-ink-800 italic">
              {page.summary}
            </div>
          )}

          {page.killers.length > 0 && (
            <div>
              <div className="filing mb-2">Top issues on this page</div>
              <ul className="space-y-2">
                {page.killers.slice(0, 4).map((k, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-ink-900">
                    <span
                      className="font-mono text-[10px] font-bold uppercase tracking-stamped shrink-0 mt-0.5"
                      style={{
                        color:
                          k.severity === "critical"
                            ? "var(--vermillion)"
                            : k.severity === "high"
                              ? "var(--warn)"
                              : "var(--gold)",
                      }}
                    >
                      [{k.severity}]
                    </span>
                    <span>
                      <span className="font-semibold">{k.title}.</span> {k.evidence}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {page.heroRewrite && (
            <div className="border-2 border-vermillion bg-highlight-tint px-3 py-2">
              <div className="filing mb-1 text-vermillion font-bold">Drop-in headline</div>
              <div className="font-display text-base font-bold text-ink-900">
                {page.heroRewrite.headline}
              </div>
            </div>
          )}

          <details>
            <summary className="filing cursor-pointer text-vermillion font-bold">Show full diagnostic grid</summary>
            <div className="mt-3">
              <DiagnosticGrid killers={page.killers} />
            </div>
          </details>

          {page.trustAnalysis && page.objectionMap && (
            <details>
              <summary className="filing cursor-pointer">Show trust audit</summary>
              <div className="mt-3">
                <TrustAudit trust={page.trustAnalysis} objections={page.objectionMap} />
              </div>
            </details>
          )}
        </div>
      )}
    </article>
  );
}
