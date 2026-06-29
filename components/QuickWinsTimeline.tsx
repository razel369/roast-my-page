// 3-step visual timeline for the "Quick wins". Each step is time-boxed
// and shows the action, the duration, and the expected impact.

interface Props {
  wins: string[];
}

export function QuickWinsTimeline({ wins }: Props) {
  if (!wins || wins.length === 0) {
    return (
      <div className="border border-ink-900 bg-bone-100 p-6 font-body text-sm text-ink-700">
        No quick wins filed. Either the page is already tight or the analyzer didn&apos;t find any 60-minute wins.
      </div>
    );
  }

  const slots = [
    { duration: "0–15", label: "minutes", impact: "Fastest lift" },
    { duration: "15–35", label: "minutes", impact: "Compounding" },
    { duration: "35–55", label: "minutes", impact: "Polish" },
  ];

  return (
    <article className="border-2 border-ink-900 bg-bone-50">
      <header className="flex items-center justify-between border-b-2 border-ink-900 bg-bone-200 px-4 py-3">
        <span className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-vermillion">
            FAST
          </span>
          <span className="font-display text-lg font-bold text-ink-900">
            3 quick wins · ship by lunch
          </span>
        </span>
        <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
          § VI
        </span>
      </header>

      <ol className="relative px-4 py-5">
        {/* Vertical line */}
        <span
          aria-hidden
          className="absolute left-[34px] top-5 bottom-5 w-px bg-ink-900/40 sm:left-[42px]"
        />

        {wins.slice(0, 3).map((win, i) => (
          <li key={i} className="relative flex items-start gap-4 pb-4 last:pb-0">
            {/* Time badge */}
            <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center border-2 border-ink-900 bg-bone-50 sm:h-14 sm:w-14">
              <div className="text-center leading-none">
                <div className="font-display text-sm font-bold text-ink-900 sm:text-base">
                  {slots[i]?.duration ?? ""}
                </div>
                <div className="font-mono text-[8px] uppercase tracking-stamped text-ink-500 sm:text-[9px]">
                  {slots[i]?.label ?? "min"}
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="flex-1 border border-ink-900 bg-bone-100 px-3 py-2">
              <div className="filing mb-0.5">Step {i + 1}</div>
              <p className="font-body text-sm text-ink-900 leading-snug">{win}</p>
              <div className="mt-1.5 filing text-vermillion font-bold">
                → {slots[i]?.impact ?? "Apply"}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="border-t-2 border-ink-900 bg-bone-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">
            Then re-run this verdict and compare scores.
          </p>
          <span className="font-mono text-[10px] uppercase tracking-stamped text-vermillion font-bold">
            Total: 60 min
          </span>
        </div>
      </div>
    </article>
  );
}
