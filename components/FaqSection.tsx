"use client";
import { useState } from "react";

interface QA {
  q: string;
  a: string;
}

export function FaqSection({ items }: { items: QA[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="document py-16">
      <header className="animate-fade-in-up">
        <div className="filing">§ V · Frequently filed questions</div>
        <h3
          className="display mt-2 text-3xl sm:text-4xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Questions, answered.
        </h3>
        <div className="mt-4 hairline" />
      </header>

      <div className="mt-8 space-y-2">
        {items.map((item, i) => {
          const open = openIdx === i;
          return (
            <div key={i} className="border border-ink-900 bg-bone-50">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left font-display text-base text-ink-900 hover:text-vermillion sm:text-lg"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-vermillion w-8 shrink-0">
                    Q{i + 1}
                  </span>
                  <span>{item.q}</span>
                </span>
                <span
                  className={`font-mono text-xl text-ink-500 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              {open && (
                <div className="border-t border-ink-900/30 px-4 py-3 font-body text-sm text-ink-800 leading-relaxed animate-fade-in">
                  <span className="font-mono text-xs font-bold text-ink-500 mr-3">A</span>
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export const FAQ_ITEMS: QA[] = [
  {
    q: "Is Roast My Page really free?",
    a: "Yes. No signup, no credit card. Each audit runs in about 6 seconds using a hand-tuned rule engine, with optional AI enrichment on top.",
  },
  {
    q: "What does it actually check?",
    a: "Headline strength, CTA copy and count, social proof, risk-reversal, specificity, word count, meta description, FAQ presence, pricing visibility, trust signals, and objection coverage.",
  },
  {
    q: "Do you store my URL or the page content?",
    a: "No. Each audit runs in-memory on our server and is discarded. Shareable roast links are encoded directly into the URL — your browser (and the recipient's) decode them; our server never sees them open or share them.",
  },
  {
    q: "How accurate is the score?",
    a: "The score is rule-derived, not predictive. It's a directional audit, not an A/B test. Use it to find issues, then validate with your own experiments.",
  },
  {
    q: "Why not just use Hotjar or PageSpeed?",
    a: "Those tell you what is happening (heatmaps, performance). We tell you why your copy isn't converting, with a specific fix for each issue.",
  },
  {
    q: "Can I get this on every page of my site?",
    a: "Not yet. Today's audit covers one URL at a time — typically the homepage or a pricing page. Multi-site audits and recurring monitoring are on the roadmap.",
  },
];
