"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Feature {
  badge: string;
  title: string;
  body: string;
  status: "shipped" | "soon";
}

const SHIPPED: Feature[] = [
  {
    badge: "1",
    title: "Unlimited verdicts",
    body: "Rate-limited on free (3/day). Pro removes the cap so you can audit before every launch.",
    status: "shipped",
  },
  {
    badge: "2",
    title: "AI-enriched critique",
    body: "A language model reviews your copy alongside the rule engine. Catches nuance the patterns miss. Requires an LLM API key.",
    status: "shipped",
  },
  {
    badge: "3",
    title: "Visual layout audit",
    body: "We render the page in a real browser and audit the layout, not just the copy. Requires a Browserless API key.",
    status: "shipped",
  },
];

const COMING_SOON: Feature[] = [
  {
    badge: "4",
    title: "Before/after diff generator",
    body: "Run a verdict, ship the changes, re-run. See what you actually moved.",
    status: "soon",
  },
  {
    badge: "5",
    title: "Cloud archive across devices",
    body: "Every roast saved to your private workspace, accessible on any browser you sign in on.",
    status: "soon",
  },
  {
    badge: "6",
    title: "PDF export + email to team",
    body: "Send the verdict to your designer, your dev, your cofounder. One click.",
    status: "soon",
  },
];

export function ProFeaturesTeaser() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const has = /(?:^|;\s*)rmp_pro_token=/.test(document.cookie);
    setIsPro(has);
  }, []);

  if (isPro) {
    return (
      <section className="document py-12">
        <div className="border-2 border-vermillion bg-highlight-tint p-6 sm:p-8 text-center animate-fade-in-up">
          <div className="filing mb-2 text-vermillion font-bold">Pro · active</div>
          <h3
            className="display text-3xl sm:text-4xl"
            style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
          >
            You&apos;re on Pro. Run unlimited.
          </h3>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="btn-stamp inline-flex">
              Run a verdict
            </Link>
            <Link href="/welcome" className="btn-ghost-stamp inline-flex">
              View Pro token
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="document py-16 sm:py-20">
      <header className="animate-fade-in-up">
        <div className="filing">§ VI · What Pro unlocks</div>
        <h3
          className="display mt-2 text-3xl sm:text-4xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Behind the paywall.
        </h3>
        <p className="mt-2 max-w-2xl font-body text-sm text-ink-700">
          Same brutal honesty — without the per-day limit and with the AI layer that catches nuance.
          Cancel anytime. $19/mo billed by Polar.sh.
        </p>
        <div className="mt-4 hairline" />
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHIPPED.map((f, i) => (
          <article
            key={f.title}
            className="exhibit relative animate-fade-in border-vermillion/40 bg-bone-50/80"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="absolute right-3 top-3 z-10 grid place-items-center bg-vermillion px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-stamped text-bone-50">
              Pro
            </div>
            <div className="exhibit-head bg-bone-200">
              <span className="font-mono text-xs font-bold text-ink-500">{f.badge}</span>
              <span className="text-ink-900">{f.title}</span>
            </div>
            <div className="exhibit-body font-body text-sm text-ink-800 leading-relaxed">
              {f.body}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMING_SOON.map((f, i) => (
          <article
            key={f.title}
            className="exhibit relative animate-fade-in border-ink-900/30 bg-bone-100/60 opacity-70"
            style={{ animationDelay: `${(i + SHIPPED.length) * 80}ms` }}
          >
            <div className="absolute right-3 top-3 z-10 grid place-items-center border border-ink-900 bg-bone-50 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-stamped text-ink-700">
              Soon
            </div>
            <div className="exhibit-head bg-bone-200">
              <span className="font-mono text-xs font-bold text-ink-500">{f.badge}</span>
              <span className="text-ink-700">{f.title}</span>
            </div>
            <div className="exhibit-body font-body text-sm text-ink-700 leading-relaxed">
              {f.body}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/pricing" className="btn-stamp inline-flex">
          See pricing
        </Link>
        <p className="mt-3 filing text-[10px]">
          30-day money-back guarantee · Cancel anytime · Polar.sh handles billing
        </p>
      </div>
    </section>
  );
}