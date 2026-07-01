import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Launches -- Croast",
  description: "Where Croast is launching next. X threads, IndieHackers, Product Hunt, Reddit, and our public roadmap.",
};

const LAUNCHES = [
  {
    date: "2026-07-08",
    label: "Public launch",
    channel: "X (Twitter) / IndieHackers / Reddit",
    title: "Croast launches. The AI conversion engineer that audits your landing page in 60 seconds.",
    body:
      "We just launched Croast. The thesis: most landing page audits are either too slow ($10K consultant) or too vague (Hotjar). Croast does the structural review a senior CRO would, in under a minute, for free. The State of SaaS Landing Pages 2026 is up: 15 B2B SaaS sites audited with real LLM-driven pattern detection.",
    cta: { label: "Run a free verdict on your site", href: "/" },
    primaryLink: "https://x.com/intent/post?text=I%20audited%20my%20landing%20page%20with%20Croast%2E",
  },
  {
    date: "2026-07-15",
    label: "IndieHackers post",
    channel: "indiehackers.com",
    title: "Building a $1M ARR SaaS from Israel without a registered business",
    body:
      "The story behind Croast: how we shipped a 23-page SaaS (multi-page audit, share links, CSV export, Polar.sh payment, Gemini integration, E2E tests) in a single focused build, why we chose Polar.sh over Stripe, and the unit economics of an LLM-enriched audit tool at $19/mo.",
    cta: { label: "Read the build log", href: "/state-of-saas-2026" },
    primaryLink: "https://www.indiehackers.com/newest",
  },
  {
    date: "2026-07-22",
    label: "Product Hunt",
    channel: "producthunt.com",
    title: "Croast -- your AI conversion engineer",
    body:
      "One-line: paste a URL, get a verdict in 60 seconds. Differentiator: multi-page funnel audit (the first tool that audits your homepage + pricing + signup as a single funnel, not three pages in isolation). Free to use, Pro at $19/mo or $190/yr.",
    cta: { label: "Vote on Product Hunt", href: "https://www.producthunt.com/" },
    primaryLink: "https://www.producthunt.com/posts/croast",
  },
  {
    date: "2026-08-05",
    label: "Industry report #2",
    channel: "X (Twitter) / HackerNews",
    title: "State of E-commerce Landing Pages 2026",
    body:
      "Same audit engine, different 15-site list: Shopify-based DTC brands and indie ecom stores. The LLM-driven pattern detection this time focuses on shipping cost visibility, return policy, and social proof density. We expect very different findings than the B2B SaaS report.",
    cta: { label: "Read the report", href: "/state-of-ecommerce-2026" },
    primaryLink: null,
  },
];

const ROADMAP = [
  { quarter: "Q3 2026", item: "Chrome extension -- right-click any page to Roast it" },
  { quarter: "Q3 2026", item: "Public API for agencies to audit client sites at scale" },
  { quarter: "Q4 2026", item: "Multi-language audit (auto-detect + i18n headline feedback)" },
  { quarter: "Q4 2026", item: "Weekly trend emails (your site score over time, no login)" },
  { quarter: "Q1 2027", item: "Enterprise tier ($99/mo): white-label, SSO, dedicated support" },
];
export default function LaunchesPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Launches · 2026</div>
        <h1
          className="display mt-3 text-4xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Where Croast is going next.
        </h1>
        <p className="mt-4 max-w-2xl font-body text-base text-ink-700 leading-relaxed sm:text-lg">
          Public roadmap, planned launch dates, and how to follow the journey. We are a small,
          open team — every product decision is on GitHub, every launch is documented here.
        </p>
        <div className="mt-6 hairline" />
      </header>

      <div className="mt-10">
        <div className="filing mb-3">§ I · Planned launches</div>
        <ol className="space-y-4">
          {LAUNCHES.map((l) => (
            <li key={l.date} className="border border-ink-900 bg-bone-50 p-5">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-500">{l.date}</span>
                <span className="font-mono text-[10px] uppercase tracking-stamped text-vermillion font-bold">{l.label}</span>
                <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">· {l.channel}</span>
              </div>
              <h2 className="display text-xl sm:text-2xl text-ink-900">{l.title}</h2>
              <p className="mt-2 font-body text-sm text-ink-800 leading-relaxed">{l.body}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link href={l.cta.href} className="btn-ghost-stamp inline-flex">
                  {l.cta.label}
                </Link>
                {l.primaryLink && (
                  <a
                    href={l.primaryLink}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] uppercase tracking-stamped text-vermillion hover:underline"
                  >
                    external link →
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-12">
        <div className="filing mb-3">§ II · Public roadmap</div>
        <div className="border border-ink-900 bg-bone-50 p-5">
          <p className="font-body text-sm text-ink-700 mb-4">
            These are the next four quarters of work. Anything committed here is public; we
            will mark it shipped in the changelog.
          </p>
          <ul className="space-y-3">
            {ROADMAP.map((r, i) => (
              <li key={i} className="flex items-start gap-3 border-l-2 border-vermillion pl-3">
                <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-500 shrink-0 mt-0.5">{r.quarter}</span>
                <span className="font-body text-sm text-ink-900">{r.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-12">
        <div className="filing mb-3">§ III · Press kit</div>
        <div className="border border-ink-900 bg-bone-100 p-5">
          <p className="font-body text-sm text-ink-800 leading-relaxed mb-3">
            For blog mentions, podcast appearances, or affiliate partnerships: file an issue on{" "}
            <a
              href="https://github.com/razel369/roast-my-page/issues"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-vermillion"
            >
              GitHub
            </a>
            .
          </p>
          <p className="font-body text-sm text-ink-800 leading-relaxed">
            Founded in Israel. Backed by nobody. Running on Polar.sh + Vercel + Gemini.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link href="/" className="btn-stamp inline-flex">Run a free verdict</Link>
        <p className="mt-3 filing text-[10px]">Free · 60 seconds · no signup</p>
      </div>
    </section>
  );
}
