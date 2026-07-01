// Reusable layout for industry-specific landing pages. Each page passes its
// own industry data (label, hero copy, features, FAQs).

import Link from "next/link";

export interface IndustryFeature {
  num: string;
  title: string;
  body: string;
}

export interface IndustryFAQ {
  q: string;
  a: string;
}

export interface IndustryLandingProps {
  industry: string;
  hero: string;
  intro: string;
  features: IndustryFeature[];
  faqs: IndustryFAQ[];
}

export function IndustryLanding({ industry, hero, intro, features, faqs }: IndustryLandingProps) {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ For · {industry}</div>
        <h1
          className="display mt-3 text-4xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          {hero}
        </h1>
        <p className="mt-4 max-w-2xl font-body text-base text-ink-700 leading-relaxed sm:text-lg">{intro}</p>
        <div className="mt-6 hairline" />
      </header>

      {/* Form CTA */}
      <div className="mt-8 border-2 border-vermillion bg-highlight-tint p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-stamped text-vermillion font-bold">Free · no signup</p>
        <h2 className="mt-2 display text-2xl sm:text-3xl text-ink-900">Paste your {industry} URL. Get a verdict in 60 seconds.</h2>
        <Link href="/" className="btn-stamp mt-4 inline-flex">Try it on my site</Link>
      </div>

      {/* Industry features */}
      <div className="mt-12">
        <div className="filing mb-3">§ I · What {industry} founders should know</div>
        <ol className="space-y-4">
          {features.map((f) => (
            <li key={f.num} className="border border-ink-900 bg-bone-50 p-4">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-vermillion w-8">
                  {f.num}
                </span>
                <h3 className="font-display text-lg font-bold text-ink-900">{f.title}</h3>
              </div>
              <p className="mt-2 font-body text-sm text-ink-800 leading-relaxed">{f.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQs */}
      <div className="mt-12">
        <div className="filing mb-3">§ II · FAQ</div>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <details key={i} className="border border-ink-900 bg-bone-50 px-4 py-3">
              <summary className="font-display text-base font-bold text-ink-900 cursor-pointer">
                {f.q}
              </summary>
              <p className="mt-2 font-body text-sm text-ink-700 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="btn-stamp inline-flex">Run a verdict</Link>
        <p className="mt-3 filing text-[10px]">Free · 60 seconds · no signup</p>
      </div>
    </section>
  );
}