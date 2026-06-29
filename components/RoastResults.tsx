"use client";
import type { RoastResult } from "@/lib/types";
import { Stamp } from "./Stamp";
import { ShareButton } from "./ShareButton";
import { FeedbackWidget } from "./FeedbackWidget";
import { DiagnosticGrid } from "./DiagnosticGrid";

interface Props {
  result: RoastResult;
  source?: "llm" | "rules";
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

      {/* ─── Section V — Quick wins ───────────────────────────────── */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="exhibit">
          <div className="exhibit-head">
            <span>Quick wins</span>
            <span>Today</span>
          </div>
          <ol className="exhibit-body">
            {result.quickWins.map((w, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs font-bold text-vermillion w-6 shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink-900">{w}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="exhibit card-lift">
          <div className="exhibit-head">
            <span>Proposed hero rewrite</span>
            <span>Drop-in</span>
          </div>
          <div className="exhibit-body space-y-3">
            <div>
              <div className="filing mb-1">Headline</div>
              <div className="border border-ink-900 bg-bone-50 px-3 py-2 font-display text-lg text-ink-900">
                {result.heroRewrite.headline}
              </div>
            </div>
            <div>
              <div className="filing mb-1">Sub-headline</div>
              <div className="border border-ink-900 bg-bone-50 px-3 py-2 font-body text-sm text-ink-800">
                {result.heroRewrite.subhead}
              </div>
            </div>
            <div>
              <div className="filing mb-1">Call to action</div>
              <div className="border border-ink-900 bg-bone-100 px-3 py-2 font-mono text-xs uppercase tracking-stamped text-ink-900">
                {result.heroRewrite.cta}
              </div>
            </div>
            <p className="text-xs text-ink-500 italic">{result.heroRewrite.rationale}</p>
          </div>
        </div>
      </section>

      {/* ─── Section VI — Trust + Objections ──────────────────────── */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="exhibit card-lift">
          <div className="exhibit-head">
            <span>Trust signals</span>
            <span>Score {result.trustAnalysis.score}/100</span>
          </div>
          <div className="exhibit-body space-y-3">
            <ListGroup label="On record" items={result.trustAnalysis.signals} accent="text-vermillion" />
            <ListGroup label="Missing from the record" items={result.trustAnalysis.missing} accent="text-ink-500 line-through" />
          </div>
        </div>

        <div className="exhibit card-lift">
          <div className="exhibit-head">
            <span>Objections covered</span>
            <span>What buyers worry about</span>
          </div>
          <div className="exhibit-body grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ListGroup label="Addressed" items={result.objectionMap.handled} accent="text-vermillion" />
            <ListGroup label="Not addressed" items={result.objectionMap.missing} accent="text-ink-500 line-through" />
          </div>
        </div>
      </section>

      {/* ─── Section VII — One-hour plan ──────────────────────────── */}
      <section>
        <SectionHeader
          num={result.visualCritique?.enabled ? "VII" : "VI"}
          title="One-hour action plan"
          subtitle="Time-boxed. Prioritized. Ship by lunch."
        />
        <ol className="mt-6 space-y-2">
          {result.oneHourPlan.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-4 border border-ink-900 bg-bone-50 px-4 py-3 card-lift animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="font-mono text-[11px] uppercase tracking-stamped text-vermillion font-bold w-12 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-body text-sm text-ink-900 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
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

function ListGroup({
  label,
  items,
  accent,
}: {
  label: string;
  items: string[];
  accent: string;
}) {
  return (
    <div>
      <div className="filing mb-2">{label}</div>
      {items.length > 0 ? (
        <ul className="space-y-1.5 text-sm text-ink-900">
          {items.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className={`${accent} font-bold shrink-0`}>{accent.includes("line-through") ? "✕" : "✓"}</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-mono text-xs text-ink-500">None.</p>
      )}
    </div>
  );
}