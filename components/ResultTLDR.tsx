"use client";
import type { RoastResult } from "@/lib/types";

interface Props {
  result: RoastResult;
}

// Top-of-results summary card. Answers the four questions a founder
// asks in the first 30 seconds after running a roast:
//   1. What is my score?            -> shown in the hero meta strip
//   2. What is the one biggest issue? -> top killer
//   3. What exact copy should I use? -> hero rewrite headline
//   4. What do I fix in the next 15 minutes? -> top quick win
export function ResultTLDR({ result }: Props) {
  const topKiller = result.killers[0];
  const topWin = result.quickWins[0];
  const headline = result.heroRewrite?.headline;

  return (
    <section
      aria-labelledby="tldr-heading"
      className="mb-8 border-2 border-ink-900 bg-bone-50"
    >
      <header className="flex items-center justify-between border-b-2 border-ink-900 bg-bone-200 px-4 py-3">
        <span className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-vermillion">
            TL;DR
          </span>
          <h2
            id="tldr-heading"
            className="display text-lg font-bold text-ink-900"
          >
            The verdict, in 4 lines
          </h2>
        </span>
        <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
          § 0
        </span>
      </header>

      <ol className="grid gap-0 divide-y divide-ink-900/20 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
        <li className="px-4 py-4">
          <div className="filing mb-1">1. Your score</div>
          <div className="flex items-baseline gap-2">
            <span
              className="font-display text-4xl font-bold text-ink-900"
              style={{ fontVariationSettings: "'wght' 800, 'opsz' 144" }}
            >
              {result.score}
            </span>
            <span className="font-mono text-xs text-ink-500">/ 100</span>
            <span className="ml-auto font-mono text-[10px] uppercase tracking-stamped text-ink-700">
              {result.verdictLabel}
            </span>
          </div>
        </li>

        <li className="px-4 py-4">
          <div className="filing mb-1">2. Biggest problem</div>
          {topKiller ? (
            <>
              <div className="font-display text-base font-bold text-ink-900 leading-snug">
                {topKiller.title}
              </div>
              <p className="mt-1 font-body text-xs text-ink-700 leading-snug">
                {topKiller.evidence}
              </p>
            </>
          ) : (
            <div className="font-display text-base font-bold text-ink-900 leading-snug">
              No critical issues filed.
            </div>
          )}
        </li>

        <li className="px-4 py-4">
          <div className="filing mb-1 text-vermillion font-bold">3. Drop-in headline</div>
          {headline ? (
            <div className="border-2 border-vermillion bg-bone-50 px-3 py-2 font-display text-base font-bold text-ink-900">
              {headline}
            </div>
          ) : (
            <div className="font-body text-sm italic text-ink-500">
              No rewrite generated.
            </div>
          )}
        </li>

        <li className="px-4 py-4">
          <div className="filing mb-1 text-vermillion font-bold">4. Fix in 15 minutes</div>
          {topWin ? (
            <p className="font-body text-sm text-ink-900 leading-snug">
              {topWin}
            </p>
          ) : (
            <div className="font-body text-sm italic text-ink-500">
              No quick win filed.
            </div>
          )}
        </li>
      </ol>
    </section>
  );
}