export const metadata = {
  title: "Changelog — Croast",
  description: "What shipped, what changed. Updated as we ship.",
};

interface Entry {
  date: string;
  version: string;
  changes: string[];
}

const ENTRIES: Entry[] = [
  {
    date: "2026-06-29",
    version: "v0.4",
    changes: [
      "Comparison landing pages: /vs/hotjar, /vs/pagespeed, /vs/cro-consultant for SEO long-tail.",
      "Feedback widget on every verdict — quick 👍/👎 with optional reason.",
      "'Try it on {your domain}' CTA in hero (auto-fills your URL when you visit from a non-croast.io domain).",
      "URL normalization: tracking params (utm_*, fbclid, gclid) stripped before fetching — cleaner audits.",
      "JS-rendered page detection: when a site is a React/Vue SPA and returns an empty shell, we surface a paste-mode hint.",
      "Pricing FAQ accuracy fix: free is 3/day, Pro is 8/min.",
      "First-visit onboarding (3-step) for new visitors.",
    ],
  },
  {
    date: "2026-06-28",
    version: "v0.3",
    changes: [
      "Print stylesheet on /r/[id] — shareable roasts now print/PDF as clean B&W case files.",
      "Custom 404 in forensic design.",
      "/privacy page (real, replacing # placeholders).",
      "Visible FAQ section matching the JSON-LD FAQPage schema (Google rich-result eligible).",
      "Cmd/Ctrl+Enter keyboard shortcut in the form.",
      "Score counts up from 0 → real value over 1.2s with reduced-motion support.",
      "Better error UX — warnings get a paste-mode CTA, fatal errors get a dismiss.",
      "FAQ accordion component.",
    ],
  },
  {
    date: "2026-06-27",
    version: "v0.2",
    changes: [
      "Multi-platform share: X, LinkedIn, Reddit buttons with verdict emoji + top-killer quote.",
      "Plausible analytics (env-gated, no cookies, no fingerprinting).",
      "Email capture modal — pops 12s after a roast, 1-click unsubscribe.",
      "JSON-LD: WebApplication + FAQPage + Organization schema for Google rich results.",
      "Better meta description on the home page (was flagged by the tool itself).",
      "Removed fake 'what users say' stats — replaced with honest 'what you get' breakdown.",
    ],
  },
  {
    date: "2026-06-26",
    version: "v0.1",
    changes: [
      "Initial release. Rule-engine audit, shareable verdict links, local history.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Changelog · Filed as we ship</div>
        <h1
          className="display mt-3 text-5xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          What shipped.
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-700">
          Every change that went out, with the date and what it actually changed.
          No &ldquo;various improvements&rdquo; filler.
        </p>
        <div className="mt-6 hairline" />
      </header>

      <div className="mt-10 space-y-8">
        {ENTRIES.map((e) => (
          <article key={e.version} className="exhibit">
            <div className="exhibit-head">
              <span className="flex items-baseline gap-3">
                <span className="font-mono font-bold text-vermillion">{e.version}</span>
                <span className="text-ink-500 font-mono text-[11px]">
                  {new Date(e.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-stamped">Filed</span>
            </div>
            <ul className="exhibit-body space-y-2">
              {e.changes.map((c, i) => (
                <li key={i} className="flex gap-3 font-body text-sm text-ink-800 leading-relaxed">
                  <span className="text-vermillion font-bold shrink-0">+</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-12 border border-ink-900 bg-bone-100 p-6 text-center">
        <h2 className="display text-2xl text-ink-900">Subscribe to updates</h2>
        <p className="mt-2 font-body text-sm text-ink-700">
          One short email when we ship something meaningful. No noise.
        </p>
        <a href="/" className="btn-stamp mt-4 inline-flex">
          File your first verdict
        </a>
      </div>
    </section>
  );
}
