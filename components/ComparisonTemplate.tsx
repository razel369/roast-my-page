import Link from "next/link";

interface Point {
  feature: string;
  other: string;
  us: string;
}

interface Faq {
  q: string;
  a: string;
}

interface Props {
  competitor: string;
  category: string;
  intro: string;
  verdict: string;
  comparison: Point[];
  faq?: Faq[];
  ctaHref?: string;
}

export function ComparisonTemplate({
  competitor,
  category,
  intro,
  verdict,
  comparison,
  faq = [],
  ctaHref = "/",
}: Props) {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Comparison · {category}</div>
        <h1
          className="display mt-3 text-5xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Roast My Page vs. <span className="text-vermillion">{competitor}</span>
        </h1>
        <p className="mt-4 max-w-2xl font-body text-base text-ink-700 leading-relaxed">
          {intro}
        </p>
        <div className="mt-6 hairline" />
      </header>

      {/* Verdict callout */}
      <div className="mt-8 border-2 border-vermillion bg-highlight-tint p-6 sm:p-8">
        <div className="filing mb-1 text-vermillion font-bold">Bottom line</div>
        <p className="font-display text-xl text-ink-900 sm:text-2xl">{verdict}</p>
      </div>

      {/* Comparison table */}
      <h2
        className="display mt-12 text-3xl sm:text-4xl"
        style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
      >
        Side-by-side
      </h2>
      <div className="mt-4 overflow-x-auto border border-ink-900">
        <table className="w-full border-collapse font-body text-sm">
          <thead>
            <tr className="border-b-2 border-ink-900 bg-bone-200">
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-stamped text-ink-500">
                Capability
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-stamped text-ink-500">
                {competitor}
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-stamped text-vermillion">
                Roast My Page
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row, i) => (
              <tr key={row.feature} className={i % 2 === 0 ? "bg-bone-50" : "bg-bone-100"}>
                <td className="border-b border-ink-900/20 px-4 py-3 font-semibold text-ink-900">
                  {row.feature}
                </td>
                <td className="border-b border-ink-900/20 px-4 py-3 text-ink-700">
                  {row.other}
                </td>
                <td className="border-b border-ink-900/20 px-4 py-3 text-ink-900">
                  <span className="font-semibold">{row.us}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* When to use which */}
      <h2
        className="display mt-12 text-3xl sm:text-4xl"
        style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
      >
        When to use which
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="border border-ink-900 bg-bone-50 p-5">
          <div className="filing mb-2">Reach for {competitor} when…</div>
          <p className="font-body text-sm text-ink-800 leading-relaxed">
            {competitor === "Hotjar"
              ? "You already have traffic (10k+ visits/mo) and want to watch real users fumble through your form, abandon carts, or never scroll past the fold."
              : competitor === "PageSpeed Insights"
                ? "Your conversion rate is fine but mobile load time is hurting rankings, or you've shipped a bug that's tanking your LCP / CLS."
                : "You need a custom experiment designed, a multivariate test running for six weeks, or someone to physically attend your sprint and watch you rebuild the page."}
          </p>
        </div>
        <div className="border-2 border-vermillion bg-highlight-tint p-5">
          <div className="filing mb-2 text-vermillion font-bold">Reach for Roast My Page when…</div>
          <p className="font-body text-sm text-ink-900 leading-relaxed">
            You just shipped a landing page and want the same five insights a senior CRO would flag, in plain English,
            before you spend a dollar on traffic.
          </p>
        </div>
      </div>

      {faq.length > 0 && (
        <>
          <h2
            className="display mt-12 text-3xl sm:text-4xl"
            style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
          >
            FAQ
          </h2>
          <div className="mt-4 space-y-3">
            {faq.map((f, i) => (
              <div key={i} className="border border-ink-900 bg-bone-50 p-5">
                <div className="filing mb-1">Q{i + 1}</div>
                <div className="font-display text-lg text-ink-900">{f.q}</div>
                <p className="mt-2 font-body text-sm text-ink-700 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-12 border-2 border-ink-900 bg-ink-900 p-8 text-center text-bone-50 sm:p-12">
        <div className="filing mb-2 text-vermillion">The verdict</div>
        <h2 className="display text-3xl sm:text-5xl">
          Get your own verdict in 60 seconds.
        </h2>
        <p className="mx-auto mt-3 max-w-lg font-body text-base text-bone-200">
          Free. No signup. The same five insights a {competitor === "a CRO consultant" ? "$10K consultant" : "senior " + competitor + " analyst"} would catch.
        </p>
        <Link href={ctaHref} className="btn-stamp mt-6 inline-flex">
          File your verdict
        </Link>
      </div>
    </section>
  );
}
