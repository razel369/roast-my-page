import type { HeroRewrite } from "@/lib/types";

// Two-column "before → after" comparison. The "before" is reconstructed
// heuristically from the page's actual h1 (when the analyzer ran on a
// real page). The "after" is the analyzer's recommended copy.
export function HeroRewriteCard({
  rewrite,
  originalH1,
}: {
  rewrite: HeroRewrite;
  originalH1?: string;
}) {
  return (
    <article className="border-2 border-ink-900 bg-bone-50">
      <header className="flex items-center justify-between border-b-2 border-ink-900 bg-bone-200 px-4 py-3">
        <span className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-vermillion">
            DROP-IN
          </span>
          <span className="font-display text-lg font-bold text-ink-900">
            Proposed hero rewrite
          </span>
        </span>
        <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
          § V
        </span>
      </header>

      <div className="grid gap-0 sm:grid-cols-2">
        {/* BEFORE */}
        <div className="border-b-2 border-ink-900 p-4 sm:border-b-0 sm:border-r-2">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center border border-ink-900 bg-bone-200 font-mono text-[10px] font-bold text-ink-700">
              1
            </span>
            <span className="filing">Before · your current hero</span>
          </div>
          <div className="border border-dashed border-ink-900/40 bg-bone-50 p-3 font-display text-lg text-ink-700 sm:text-xl">
            {originalH1 ? (
              <span className="line-through decoration-2 decoration-ink-700/50">
                {truncate(originalH1, 200)}
              </span>
            ) : (
              <span className="italic text-ink-500">No h1 detected on this page.</span>
            )}
          </div>
          <div className="mt-3 filing">Sub-headline</div>
          <div className="mt-1 font-body text-sm italic text-ink-500">
            {truncate(originalH1 ? `${originalH1}.` : "(the existing sub-headline on your page)", 200)}
          </div>
          <div className="mt-3 filing">Call to action</div>
          <div className="mt-1 inline-block border border-ink-900 bg-bone-200 px-2 py-1 font-mono text-[10px] uppercase tracking-stamped text-ink-700">
            Submit
          </div>
        </div>

        {/* ARROW */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:block" aria-hidden />

        {/* AFTER */}
        <div className="relative bg-highlight-tint p-4">
          <div className="absolute left-0 right-0 top-0 h-1 bg-vermillion" aria-hidden />
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center border border-vermillion bg-vermillion font-mono text-[10px] font-bold text-bone-50">
              2
            </span>
            <span className="filing text-vermillion font-bold">After · drop-in replacement</span>
          </div>
          <div className="border-2 border-vermillion bg-bone-50 p-3 font-display text-lg font-bold text-ink-900 sm:text-xl">
            {rewrite.headline}
          </div>
          <div className="mt-3 filing">Sub-headline</div>
          <div className="mt-1 font-body text-sm text-ink-800">
            {rewrite.subhead}
          </div>
          <div className="mt-3 filing">Call to action</div>
          <div className="mt-1 inline-block border-2 border-vermillion bg-vermillion px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-stamped text-bone-50">
            {rewrite.cta}
          </div>

          {/* Arrow on mobile */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:hidden">
            <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-vermillion bg-bone-50 font-mono text-base font-bold text-vermillion">
              ↓
            </span>
          </div>
        </div>
      </div>

      <div className="border-t-2 border-ink-900 bg-bone-100 px-4 py-3">
        <div className="filing mb-1">Why this works</div>
        <p className="font-body text-sm italic text-ink-700">{rewrite.rationale}</p>
      </div>
    </article>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
