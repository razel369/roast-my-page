"use client";
import { useEffect, useState } from "react";

interface Props {
  steps: string[];
  verdictId?: string;
}

// Interactive 60-minute action plan with checkboxes.
// Completion state persists to localStorage per verdict ID so users
// who revisit the share link can see what they finished.
export function ActionPlanChecklist({ steps, verdictId }: Props) {
  const storageKey = verdictId ? `rmp_plan_${verdictId}` : null;
  const [done, setDone] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setDone(new Set(JSON.parse(raw) as number[]));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(done)));
    } catch {
      /* ignore */
    }
  }, [done, storageKey]);

  const toggle = (i: number) => {
    setDone((cur) => {
      const next = new Set(cur);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const completed = done.size;
  const total = steps.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <article className="border-2 border-ink-900 bg-bone-50">
      <header className="flex items-center justify-between border-b-2 border-ink-900 bg-bone-200 px-4 py-3">
        <span className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-vermillion">
            § VIII
          </span>
          <span className="font-display text-lg font-bold text-ink-900">
            One-hour action plan
          </span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">
          {completed}/{total}{" "}
          <span className="text-vermillion font-bold">{pct}%</span>
        </span>
      </header>

      {/* progress bar */}
      <div className="h-1 w-full bg-bone-200">
        <div
          className="h-full bg-vermillion transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>

      <ol className="space-y-2 px-4 py-4">
        {steps.map((step, i) => {
          const checked = done.has(i);
          return (
            <li
              key={i}
              className={`flex items-start gap-3 border bg-bone-100 px-3 py-3 transition-all ${
                checked ? "border-vermillion/50 bg-highlight-tint" : "border-ink-900"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                aria-label={checked ? "Mark step incomplete" : "Mark step complete"}
                className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion ${
                  checked
                    ? "border-vermillion bg-vermillion text-bone-50"
                    : "border-ink-900 bg-bone-50"
                }`}
              >
                {checked ? (
                  <span className="font-mono text-base font-bold">✓</span>
                ) : (
                  <span className="font-mono text-[10px] text-ink-500">{String(i + 1).padStart(2, "0")}</span>
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="filing">Minutes {minutesForSlot(i)}</span>
                  {checked && (
                    <span className="font-mono text-[9px] uppercase tracking-stamped text-vermillion font-bold">
                      Done
                    </span>
                  )}
                </div>
                <p
                  className={`mt-0.5 font-body text-sm leading-snug ${
                    checked ? "text-ink-500 line-through" : "text-ink-900"
                  }`}
                >
                  {step}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {pct === 100 && (
        <div className="border-t-2 border-vermillion bg-vermillion p-3 text-center">
          <p className="font-display text-sm font-bold text-bone-50">
            Shipped. Now re-run this verdict to see your score move.
          </p>
        </div>
      )}

      {pct > 0 && pct < 100 && (
        <div className="border-t border-ink-900 bg-bone-100 px-4 py-2">
          <p className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">
            {total - completed} to go · {pct}% complete
          </p>
        </div>
      )}
    </article>
  );
}

function minutesForSlot(i: number): string {
  // Mirrors the Quick Wins timeline slots: 0–15, 15–35, 35–55, etc.
  const slots = ["0–15", "15–35", "35–50", "50–60"];
  if (i < 4) return slots[i];
  return `+${i * 10}`;
}
