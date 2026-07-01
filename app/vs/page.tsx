interface Comparison {
  slug: string;
  name: string;
  category: string;
  priceLine: string;
  blurb: string;
  verdict: string;
}

const COMPARISONS: Comparison[] = [
  {
    slug: "hotjar",
    name: "Hotjar",
    category: "Behavior analytics",
    priceLine: "From $32/mo · 100 sessions/mo on the cheapest plan",
    blurb: "Heatmaps, session recordings, on-page surveys. Shows you what users do — not what to fix.",
    verdict: "Use both. Hotjar reveals the where; Croast reveals the why.",
  },
  {
    slug: "pagespeed",
    name: "PageSpeed Insights",
    category: "Performance scoring",
    priceLine: "Free · Google's Lighthouse under the hood",
    blurb: "Tells you your page is slow and has layout shift. Says nothing about why nobody is buying.",
    verdict: "PageSpeed is for engineers fixing TTFB. Croast is for marketers fixing conversions.",
  },
  {
    slug: "cro-consultant",
    name: "A CRO consultant",
    category: "Human audit",
    priceLine: "$5,000–$15,000 per engagement",
    blurb: "Two weeks of Zoom calls, a 40-page PDF, three rounds of revisions.",
    verdict: "A consultant delivers the same structural fixes. We deliver them in 60 seconds for free.",
  },
];

export const metadata = {
  title: "Croast vs — comparisons",
  description:
    "Croast compared to Hotjar, PageSpeed Insights, and a $10K CRO consultant. Same verdict, different price tags.",
};

export default function VsIndexPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Comparisons · Side-by-side verdicts</div>
        <h1
          className="display mt-3 text-5xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Croast vs.
          <br />
          <span className="text-vermillion">Everything else.</span>
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-700">
          People ask which tool is &ldquo;better.&rdquo; Honest answer: they do different things. These pages are
          straight comparisons, not sales tactics.
        </p>
        <div className="mt-6 hairline" />
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPARISONS.map((c) => (
          <a
            key={c.slug}
            href={`/vs/${c.slug}`}
            className="group exhibit card-lift block"
          >
            <div className="exhibit-head">
              <span className="text-vermillion font-bold">vs.</span>
              <span>{c.name}</span>
            </div>
            <div className="exhibit-body space-y-3">
              <div className="filing">{c.category}</div>
              <div className="font-display text-lg font-semibold text-ink-900">{c.blurb}</div>
              <div className="border-l-4 border-vermillion bg-highlight-tint px-3 py-2 font-body text-xs text-ink-900">
                {c.verdict}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-stamped text-ink-500">{c.priceLine}</div>
              <div className="text-right text-vermillion font-mono text-[10px] uppercase tracking-stamped">
                Read the comparison →
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-14 border border-ink-900 bg-bone-100 p-6 text-center">
        <h2 className="display text-2xl text-ink-900">Or just try it.</h2>
        <p className="mt-2 font-body text-sm text-ink-700">
          Sixty seconds. One verdict. No signup.
        </p>
        <a href="/" className="btn-stamp mt-4 inline-flex">
          File a verdict
        </a>
      </div>
    </section>
  );
}
