import type { HeroRewrite } from "@/lib/types";

interface ReferenceExample {
  brand: string;
  url: string;
  headline: string;
  category: string;
}

// Real-world headline references from well-known B2B SaaS companies.
// Used as inspiration cards alongside the analyzer's suggested rewrite.
// If any of these are out of date by the time you read this, swap them
// for current ones — they're meant to be illustrative, not prescriptive.
const REFERENCES: ReferenceExample[] = [
  {
    brand: "Linear",
    url: "linear.app",
    headline: "Linear is a purpose-built tool for planning and building products.",
    category: "Direct & specific",
  },
  {
    brand: "Stripe",
    url: "stripe.com",
    headline: "Financial infrastructure to grow your revenue.",
    category: "Outcome-first",
  },
  {
    brand: "Vercel",
    url: "vercel.com",
    headline: "Develop. Preview. Ship. The frontend cloud.",
    category: "Rhythm + result",
  },
  {
    brand: "Notion",
    url: "notion.so",
    headline: "Write, plan, share. With AI at your side.",
    category: "Trio + AI signal",
  },
  {
    brand: "Webflow",
    url: "webflow.com",
    headline: "Build your business on a platform that grows with you.",
    category: "Audience + outcome",
  },
  {
    brand: "Figma",
    url: "figma.com",
    headline: "Where teams bring their next ideas to life.",
    category: "Future-tense, inclusive",
  },
];

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
          <div className="border border-dashed border-ink-900/40 bg-bone-50 p-3 font-display text-base text-ink-700 sm:text-lg">
            {originalH1 ? (
              <span className="line-through decoration-2 decoration-ink-700/50">
                {truncate(originalH1, 200)}
              </span>
            ) : (
              <span className="italic text-ink-500">No h1 detected on this page.</span>
            )}
          </div>
        </div>

        {/* AFTER */}
        <div className="relative bg-highlight-tint p-4">
          <div className="absolute left-0 right-0 top-0 h-1 bg-vermillion" aria-hidden />
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center border border-vermillion bg-vermillion font-mono text-[10px] font-bold text-bone-50">
              2
            </span>
            <span className="filing text-vermillion font-bold">After · drop-in replacement</span>
          </div>
          <div className="border-2 border-vermillion bg-bone-50 p-3 font-display text-base font-bold text-ink-900 sm:text-lg">
            {rewrite.headline}
          </div>
          <div className="mt-3 filing">Sub-headline</div>
          <div className="mt-1 font-body text-sm text-ink-800">{rewrite.subhead}</div>
          <div className="mt-3 filing">Call to action</div>
          <div className="mt-1 inline-block border-2 border-vermillion bg-vermillion px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-stamped text-bone-50">
            {rewrite.cta}
          </div>

          {/* Mobile arrow */}
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

      {/* Real-world references */}
      <div className="border-t-2 border-ink-900 bg-bone-50 px-4 py-4">
        <div className="filing mb-3">§ Reference · headlines from real B2B SaaS</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {REFERENCES.slice(0, 4).map((r) => (
            <a
              key={r.brand}
              href={`https://${r.url}`}
              target="_blank"
              rel="noreferrer"
              className="group block border border-ink-900 bg-bone-100 px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-vermillion hover:shadow-exhibit-hover"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-ink-900 group-hover:text-vermillion">
                  {r.brand}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
                  {r.category}
                </span>
              </div>
              <p className="mt-1 font-display text-sm font-bold leading-snug text-ink-900">
                {r.headline}
              </p>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
