"use client";
import { useEffect, useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  STATUS_COLOR,
  STATUS_LABEL,
  categorizeKillers,
  statusForCategory,
  type Category,
  type CategoryStatus,
} from "@/lib/categories";
import type { RoastResult } from "@/lib/types";

// Progressive reveal loader. Shows category-by-category checks lighting
// up as the analysis "completes", even though our backend returns the
// full result in a single round-trip. The illusion is created by
// revealing categories in waves tied to the actual elapsed time.
//
// Once the result arrives, we swap in real statuses. If the request
// fails or takes longer than 6s, we surface an error state.

interface Props {
  loading: boolean;
  result: RoastResult | null;
  error: string | null;
  onRetry?: () => void;
}

interface RevealedState {
  status: CategoryStatus;
  count: number;
}

const CHECK_DURATIONS_MS = [0, 220, 440, 660, 880, 1100, 1320, 1540, 1760];

export function RoastLoader({ loading, result, error, onRetry }: Props) {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<"pending" | "fetching" | "analyzing" | "scoring" | "done">("pending");

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      setPhase(result ? "done" : "pending");
      return;
    }
    setPhase("fetching");
    const started = Date.now();
    const tick = setInterval(() => {
      const e = Date.now() - started;
      setElapsed(e);
      if (e > 4500) setPhase("scoring");
      else if (e > 800) setPhase("analyzing");
    }, 80);
    return () => clearInterval(tick);
  }, [loading, result]);

  // Real statuses from the result, OR simulated "checking" while loading.
  const revealed = {} as Record<Category, RevealedState>;
  if (result) {
    const grouped = categorizeKillers(result.killers);
    for (const cat of CATEGORY_ORDER) {
      const list = grouped.get(cat);
      revealed[cat] = {
        status: statusForCategory(list),
        count: list?.length ?? 0,
      };
    }
  } else if (loading) {
    for (const cat of CATEGORY_ORDER) {
      revealed[cat] = { status: "clean", count: 0 };
    }
  }

  if (!loading && !result && error) {
    return (
      <section className="document py-10">
        <div className="border-2 border-vermillion bg-highlight-tint p-6 sm:p-8 text-center">
          <div className="filing mb-1 text-vermillion">Notice</div>
          <p className="font-display text-lg text-ink-900">{error}</p>
          {onRetry && (
            <button type="button" onClick={onRetry} className="btn-stamp mt-4 inline-flex">
              Try again
            </button>
          )}
        </div>
      </section>
    );
  }

  if (!loading && !result) return null;

  return (
    <section className="document py-10">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="filing">§ Audit · in progress</div>
          <h3
            className="display mt-2 text-2xl sm:text-3xl"
            style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
          >
            {loading
              ? phaseLabel(phase, elapsed)
              : "Verdict ready"}
          </h3>
        </div>
        {loading && (
          <div className="font-mono text-[10px] uppercase tracking-stamped text-ink-500">
            {(elapsed / 1000).toFixed(1)}s elapsed
          </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {CATEGORY_ORDER.map((cat, i) => {
          const meta = CATEGORY_META[cat];
          const state = revealed[cat];
          const due = CHECK_DURATIONS_MS[i] ?? 2000;
          const isRevealed = !!result || elapsed >= due;
          const status: CategoryStatus = isRevealed ? state.status : "clean";
          const colors = STATUS_COLOR[status];
          const dot = isRevealed ? colors.dot : "#9C988F";
          const barColor = isRevealed ? colors.bar : "#9C988F";
          const textColor = isRevealed ? colors.text : "#9C988F";
          return (
            <div
              key={cat}
              className={`relative flex flex-col border bg-bone-50 px-3 py-3 transition-all duration-300 ${
                isRevealed ? "border-ink-900 opacity-100" : "border-ink-900/30 opacity-60"
              }`}
            >
              <div
                className="absolute inset-x-0 top-0 h-1 transition-all duration-500"
                style={{
                  background: barColor,
                  width: isRevealed ? "100%" : "30%",
                }}
                aria-hidden
              />
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
                  § {meta.roman}
                </span>
                <span className={`font-display text-xs ${isRevealed ? "text-ink-500" : "text-ink-400"}`} aria-hidden>
                  {isRevealed && !loading && status !== "clean" ? meta.icon : isRevealed ? "✓" : "·"}
                </span>
              </div>
              <div className="mt-1.5 font-display text-sm font-bold leading-tight text-ink-900 sm:text-base">
                {meta.label}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all ${isRevealed ? "" : "animate-pulse"}`}
                  style={{ background: dot }}
                  aria-hidden
                />
                <span
                  className="font-mono text-[9px] uppercase tracking-stamped"
                  style={{ color: textColor }}
                >
                  {isRevealed
                    ? state.count > 0
                      ? `${state.count} issue${state.count === 1 ? "" : "s"}`
                      : STATUS_LABEL[status]
                    : "Checking…"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-stamped text-ink-500">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-vermillion" />
          <span>Running 9 conversion checks. Hold tight.</span>
        </div>
      )}
    </section>
  );
}

function phaseLabel(phase: string, elapsed: number): string {
  if (phase === "scoring") return "Compiling verdict…";
  if (phase === "analyzing") return `Analyzing… (${(elapsed / 1000).toFixed(1)}s)`;
  if (phase === "fetching") return "Fetching page…";
  return "Initializing…";
}