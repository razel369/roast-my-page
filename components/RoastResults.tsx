"use client";
import type { RoastResult } from "@/lib/types";
import { Stamp } from "./Stamp";
import { ShareButton } from "./ShareButton";
import { FeedbackWidget } from "./FeedbackWidget";
import { DiagnosticGrid } from "./DiagnosticGrid";
import { HeroRewriteCard } from "./HeroRewriteCard";
import { QuickWinsTimeline } from "./QuickWinsTimeline";
import { TrustAudit } from "./TrustAudit";
import { ActionPlanChecklist } from "./ActionPlanChecklist";

interface Props {
  result: RoastResult;
  source?: "llm" | "rules";
}


function verdictColor(v: string): string {
  if (v === "Conversion Killer") return "var(--vermillion)";
  if (v === "Needs Work") return "var(--warn)";
  if (v === "Solid") return "var(--gold)";
  return "var(--forest)";
}

function VerdictBanner({ result, filingId, date, source }: { result: RoastResult; filingId: string; date: string; source?: "llm" | "rules" }) {
  const accent = verdictColor(result.verdictLabel);
  return (
    <div
      className="relative overflow-hidden border-2 border-ink-900 bg-bone-50 animate-stamp-drop"
      style={{ boxShadow: "8px 8px 0 #0F0F0F" }}
    >
      <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-[0.03] select-none" aria-hidden>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-l border-ink-900" />
        ))}
      </div>
      <div className="relative flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-end sm:gap-10 sm:px-10 sm:py-9">
        <div>
          <div className="filing mb-1">FILING {filingId} · {date}</div>
          <div className="flex items-baseline gap-3 mt-2">
            <span
              className="font-display clamp-stat leading-none"
              style={{
                color: accent,
                fontVariationSettings: "'wght' 900, 'opsz' 144, 'SOFT' 0",
              }}
            >
              {result.score}
            </span>
            <span className="font-display text-3xl font-bold text-ink-900/40 sm:text-5xl">/ 100</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="inline-block border-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-stamped font-bold"
            style={{ borderColor: accent, color: accent, background: "var(--bone-100)" }}
          >
            Verdict · {result.verdictLabel}
          </div>
          <h2 className="mt-3 display break-all text-3xl sm:text-5xl text-ink-900">
            {result.domain}
          </h2>
          <p className="mt-3 max-w-2xl font-body text-base text-ink-700 leading-relaxed">
            {result.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {source === "llm" && (
              <div className="inline-flex items-center gap-2 border border-ink-900 bg-bone-100 px-3 py-1 font-mono text-[10px] uppercase tracking-stamped text-ink-700">
                <span className="h-2 w-2 rounded-full bg-forest" />
                AI-enriched
              </div>
            )}
            <div className="inline-flex items-center gap-2 border border-ink-900 bg-bone-100 px-3 py-1 font-mono text-[10px] uppercase tracking-stamped text-ink-700">
              Reviewed · {date}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function RoastResults({ result, source }: Props) {
  const filingId = `RM-${new Date(result.timestamp).getFullYear()}-${String(result.timestamp).slice(-4)}`;
  const date = new Date(result.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="document pt-12 pb-12 space-y-14 animate-fade-in">
      <VerdictBanner result={result} filingId={filingId} date={date} source={source} />
      {/* ─── Document header ─────────────────────────────────────── */}
      <header>
        <div className="filing flex flex-wrap items-center justify-between gap-2">
          <span>{filingId}</span>
          <span>{date}</span>
        </div>
        <div className="mt-4 double-rule h-1" />

        <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <div className="filing mb-2">Re:</div>
            <h2 className="display break-all text-3xl sm:text-5xl">
              {result.domain}
            </h2>
            <div className="mt-4 max-w-xl font-body text-base text-ink-700 leading-relaxed">
              {result.summary}
            </div>

            {source === "llm" && (
              <div className="mt-4 inline-flex items-center gap-2 border border-vermillion bg-highlight-tint px-3 py-1 font-mono text-[10px] uppercase tracking-stamped text-ink-900">
                <span className="h-2 w-2 rounded-full bg-vermillion" />
                Reviewed by AI · MiniMax M3
              </div>
            )}
            {source === "rules" && (
              <div className="mt-4 inline-flex items-center gap-2 border border-rule bg-bone-100 px-3 py-1 font-mono text-[10px] uppercase tracking-stamped text-ink-700">
                <span className="h-2 w-2 rounded-full bg-rule" />
                Rule-based review
              </div>
            )}
          </div>

          {/* The signature: a big rotated stamp. */}
          <div className="flex flex-col items-center gap-3 sm:items-end">
            <Stamp score={result.score} verdict={result.verdictLabel} size="lg" />
            <ShareButton result={result} />
          </div>
        </div>
      </header>

      {/* ─── Section II — Metrics ────────────────────────────────── */}
      <section>
        <SectionHeader num="II" title="Measurements" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <MetricWithBar label="Headline words" value={result.metrics.headlineWords} max={20} good={result.metrics.headlineWords >= 6 && result.metrics.headlineWords <= 14} />
          <MetricWithBar label="Calls to action" value={result.metrics.ctaCount} max={6} good={result.metrics.ctaCount >= 1 && result.metrics.ctaCount <= 4} />
          <MetricWithBar label="Words on page" value={result.metrics.wordCount} max={500} good={result.metrics.wordCount >= 250} />
          <MetricWithBar label="Trust score" value={result.metrics.trustScore} max={100} good={result.metrics.trustScore >= 60} unit="%" />
          <MetricWithBar label="Power words" value={result.metrics.powerWordCount} max={12} good={result.metrics.powerWordCount >= 3} />
        </div>
        <p className="mt-3 filing">Each metric scored against patterns of pages that convert above 5%.</p>
      </section>

      {/* ─── Section III — Visual critique ────────────────────────── */}
      {result.visualCritique?.enabled && (
        <section>
          <SectionHeader
            num="III"
            title="Visual Examination"
            subtitle="Desktop and mobile screenshots were captured and reviewed by the AI. It saw the actual page."
          />
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Block label="Above the fold" body={result.visualCritique.aboveTheFold} />
            <Block label="Visual hierarchy" body={result.visualCritique.visualHierarchy} />
          </div>
          {result.visualCritique.layoutIssues.length > 0 && (
            <div className="mt-6">
              <div className="filing mb-3">Layout issues</div>
              <ul className="space-y-2">
                {result.visualCritique.layoutIssues.map((s, i) => (
                  <li key={i} className="flex gap-3 border-l-4 border-vermillion bg-highlight-tint px-4 py-2 text-sm text-ink-900">
                    <span className="font-mono text-xs font-bold text-vermillion">−</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <NotesList
              label="Desktop (1280 × 800)"
              notes={result.visualCritique.desktopNotes}
            />
            <NotesList
              label="Mobile (390 × 844)"
              notes={result.visualCritique.mobileNotes}
            />
          </div>
        </section>
      )}

      {/* ─── Section IV — Diagnosis (categorized, visual) ─────────── */}
      <section>
        <SectionHeader
          num={result.visualCritique?.enabled ? "IV" : "III"}
          title="Diagnosis"
          subtitle="9 conversion-killer categories. Click a tile to see the underlying issues with evidence and fix."
        />
        <div className="mt-6">
          {result.killers.length === 0 ? (
            <div className="border border-ink-900 bg-bone-100 p-6 font-body text-sm text-ink-700">
              No issues filed. You are in the top quartile. Test, do not guess.
            </div>
          ) : (
            <DiagnosticGrid
              killers={result.killers}
              heroRewriteHeadline={result.heroRewrite.headline}
            />
          )}
        </div>
      </section>

      {/* ─── Section V — Quick wins + Hero rewrite ─────────────────── */}
      <section className="grid gap-6 sm:grid-cols-2">
        <QuickWinsTimeline wins={result.quickWins} />
        <div className="relative">
          <HeroRewriteCard rewrite={result.heroRewrite} originalH1={result.originalH1} />
        </div>
      </section>

      {/* ─── Section VI — Trust + Objections (consolidated audit) ──── */}
      <section>
        <TrustAudit
          trust={result.trustAnalysis}
          objections={result.objectionMap}
        />
      </section>

      {/* ─── Section VII — One-hour plan (interactive checklist) ──── */}
      <section>
        <ActionPlanChecklist steps={result.oneHourPlan} verdictId={result.id} />
      </section>

      {/* ─── Footer of the document ───────────────────────────────── */}
      <footer className="border-t-2 border-ink-900 pt-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="btn-ghost-stamp"
          >
            Verdict another page
          </button>
          <div className="filing">
            End of file · {filingId}
          </div>
        </div>
        <div className="mt-8">
          <FeedbackWidget
            verdictId={result.id}
            domain={result.domain}
            score={result.score}
            source="results_inline"
          />
        </div>
      </footer>
    </section>
  );
}

function SectionHeader({
  num,
  title,
  subtitle,
}: {
  num: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header>
      <div className="filing flex items-baseline gap-3">
        <span className="text-vermillion font-bold">§ {num}</span>
        <span>Section {num}</span>
      </div>
      <h3
        className="display mt-2 text-3xl sm:text-4xl"
        style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
      >
        {title}
      </h3>
      {subtitle && (
        <p className="mt-2 max-w-2xl font-body text-sm text-ink-700">{subtitle}</p>
      )}
      <div className="mt-4 hairline" />
    </header>
  );
}

function MetricWithBar({ label, value, max, good, unit }: { label: string; value: number; max: number; good?: boolean; unit?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="bg-bone-50 border border-ink-900 px-4 py-4 text-center">
      <div
        className={`font-display text-3xl font-bold leading-none ${
          good === undefined ? "text-ink-900" : good ? "text-vermillion" : "text-ink-700"
        }`}
        style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
      >
        {value}{unit || ""}
      </div>
      <div className="mt-2 filing">{label}</div>
      <div className="mt-2 h-1.5 w-full bg-bone-300 rounded-none overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-expo-out ${
            good === undefined ? "bg-ink-900" : good ? "bg-vermillion" : "bg-ink-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Block({ label, body }: { label: string; body?: string }) {
  return (
    <div className="exhibit">
      <div className="exhibit-head">{label}</div>
      <div className="exhibit-body font-body text-sm text-ink-900 leading-relaxed">
        {body || "—"}
      </div>
    </div>
  );
}

function NotesList({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div className="exhibit">
      <div className="exhibit-head">{label}</div>
      <div className="exhibit-body">
        {notes.length > 0 ? (
          <ul className="space-y-2">
            {notes.map((n, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-800">
                <span className="text-vermillion font-bold">+</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-mono text-xs text-ink-500">No notes filed.</p>
        )}
      </div>
    </div>
  );
}