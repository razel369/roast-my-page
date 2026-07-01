import type { Metadata } from "next";
import Link from "next/link";
import data from "../../data/state-of-saas-2026.json";

export const metadata: Metadata = {
  title: "State of SaaS Landing Pages 2026 — Croast",
  description:
    "We audited 15 of the most-used B2B SaaS landing pages with Croast. The median score is 82. The strongest pages share three patterns. The weakest pages share two.",
};

interface Audit {
  name: string;
  url: string;
  domain: string;
  score: number;
  verdict: string;
  h1: string;
  ctaCount: number;
  wordCount: number;
  topIssue: string | null;
  topIssueFix: string | null;
  issueCount: number;
  hasFaq: boolean;
  hasPricing: boolean;
  hasSocialProof: boolean;
  headlineStrategy?: string;
  headlineVerdict?: string;
}

interface Corpus {
  generatedAt: string;
  sampleSize: number;
  medianScore: number;
  meanScore: number;
  topQuartile: number;
  bottomQuartile: number;
  scoreDistribution: Record<string, number>;
  llmInsights: string[];
  llmHeadlinePatterns: string[];
}

const audits: Audit[] = (data as { audits: Audit[] }).audits.sort((a, b) => b.score - a.score);
const corpus: Corpus = (data as { corpus: Corpus }).corpus;

const STRATEGY_LABEL: Record<string, string> = {
  outcome: "Outcome",
  feature: "Feature",
  audience: "Audience",
  category: "Category",
  vague: "Vague",
};
export default function StateOfSaasPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Report · 2026 · B2B SaaS</div>
        <h1
          className="display mt-3 text-4xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          State of SaaS Landing Pages
        </h1>
        <p className="mt-4 max-w-2xl font-body text-base text-ink-700 leading-relaxed sm:text-lg">
          We audited {corpus.sampleSize} of the most-used B2B SaaS landing pages with Croast.
          {" "}The median score is <strong>{corpus.medianScore}/100</strong>.
          {" "}The strongest pages share three patterns. The weakest share two.
        </p>
        <div className="mt-6 hairline" />
        <p className="mt-3 font-mono text-[10px] uppercase tracking-stamped text-ink-500">
          Generated {new Date(corpus.generatedAt).toLocaleDateString()} · re-runnable via <code className="font-mono">npm run audit-batch</code>
        </p>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-4">
        <StatBlock label="Median score" value={`${corpus.medianScore}/100`} accent />
        <StatBlock label="Mean score" value={`${corpus.meanScore}/100`} />
        <StatBlock label="Top quartile" value={`${corpus.topQuartile}+`} small />
        <StatBlock label="Bottom quartile" value={`${corpus.bottomQuartile}-`} small />
      </div>

      <div className="mt-10">
        <div className="filing mb-3">§ I · Score distribution</div>
        <div className="border border-ink-900 bg-bone-50 p-4">
          <div className="space-y-2">
            {Object.entries(corpus.scoreDistribution).map(([bucket, count]) => {
              const pct = Math.round((count / corpus.sampleSize) * 100);
              const color =
                bucket.includes("Killer") ? "var(--vermillion)" :
                bucket.includes("Needs Work") ? "var(--warn)" :
                bucket.includes("Solid") ? "var(--gold)" : "var(--forest)";
              return (
                <div key={bucket}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">{bucket}</span>
                    <span className="font-mono text-[10px] text-ink-500">{count} of {corpus.sampleSize} · {pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-bone-200">
                    <div className="h-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="filing mb-3">§ II · Per-page results</div>
        <div className="border border-ink-900 bg-bone-50 overflow-x-auto">
          <table className="w-full font-mono text-sm">
            <thead>
              <tr className="border-b border-ink-900 bg-bone-200 text-left">
                <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-stamped text-ink-500">Page</th>
                <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-stamped text-ink-500 text-right">Score</th>
                <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-stamped text-ink-500 text-right">Issues</th>
                <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-stamped text-ink-500 text-right">CTAs</th>
                <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-stamped text-ink-500">Headline strategy</th>
              </tr>
            </thead>
            <tbody>
              {audits.map((a, i) => {
                const scoreColor = a.score >= 85 ? "var(--forest)" : a.score >= 70 ? "var(--gold)" : "var(--vermillion)";
                return (
                  <tr key={a.name} className={i % 2 === 0 ? "bg-bone-50" : "bg-bone-100"}>
                    <td className="px-3 py-2">
                      <a href={a.url} target="_blank" rel="noreferrer" className="font-display font-bold text-ink-900 hover:text-vermillion">
                        {a.name}
                      </a>
                    </td>
                    <td className="px-3 py-2 text-right font-display font-bold" style={{ color: scoreColor, fontVariationSettings: "'wght' 800, 'opsz' 144" }}>
                      {a.score}
                    </td>
                    <td className="px-3 py-2 text-right text-ink-700">{a.issueCount}</td>
                    <td className="px-3 py-2 text-right text-ink-700">{a.ctaCount}</td>
                    <td className="px-3 py-2 text-ink-700">
                      {a.headlineStrategy ? (
                        <span className="font-mono text-[10px] uppercase tracking-stamped">
                          {STRATEGY_LABEL[a.headlineStrategy] ?? a.headlineStrategy}
                        </span>
                      ) : (
                        <span className="text-ink-500">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <div className="filing mb-3">§ III · What we found</div>
        <div className="border border-ink-900 bg-bone-100 p-5 space-y-4">
          {corpus.llmInsights.map((insight, i) => (
            <div key={i} className="flex gap-3">
              <span className="font-mono text-[10px] font-bold text-vermillion mt-1 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-body text-sm text-ink-800 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="filing mb-3">§ IV · Headline patterns</div>
        <div className="border border-ink-900 bg-bone-50 p-5 space-y-4">
          {corpus.llmHeadlinePatterns.map((p, i) => (
            <div key={i} className="flex gap-3 border-l-2 border-vermillion pl-3">
              <p className="font-body text-sm text-ink-800 leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 border-t-2 border-ink-900 pt-6">
        <div className="filing mb-3">§ V · Methodology</div>
        <div className="font-body text-sm text-ink-800 leading-relaxed space-y-2">
          <p>
            Each page was fetched by Croast&apos;s server and analyzed by our rule engine. The engine scores 0-100
            based on nine categories: headline, CTA, social proof, trust, specificity, page depth, SEO, FAQ, and pricing.
          </p>
          <p>
            Headlines were additionally classified by an LLM into one of five strategies:{" "}
            <span className="font-mono text-xs">outcome</span>, <span className="font-mono text-xs">feature</span>,{" "}
            <span className="font-mono text-xs">audience</span>, <span className="font-mono text-xs">category</span>, or{" "}
            <span className="font-mono text-xs">vague</span>.
          </p>
          <p>
            The corpus-level insights were generated by feeding all 15 (page, score, headline) triples to the
            LLM and asking it to find patterns. To re-run with fresh data, set{" "}
            <code className="font-mono">LLM_API_KEY</code> and <code className="font-mono">LLM_BASE_URL</code> and
            run <code className="font-mono">npm run audit-batch</code>.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="btn-stamp inline-flex">Run a verdict on your site</Link>
        <p className="mt-3 filing text-[10px]">Free · 60 seconds · no signup</p>
      </div>
    </section>
  );
}

function StatBlock({ label, value, accent, small }: { label: string; value: string; accent?: boolean; small?: boolean }) {
  return (
    <div className={"border px-4 py-3 " + (accent ? "border-vermillion bg-highlight-tint" : "border-ink-900 bg-bone-50")}>
      <div className="filing">{label}</div>
      <div className={"font-display font-bold text-ink-900 " + (small ? "text-base" : "text-2xl")}>
        {value}
      </div>
    </div>
  );
}
