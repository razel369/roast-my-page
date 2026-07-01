import Link from "next/link";

export const metadata = {
  title: "About — Croast",
  description: "Why Croast exists, how the audit works, and what makes it different from Hotjar or a $10K CRO consultant.",
};

export default function AboutPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ About · Filed under: Origin</div>
        <h1
          className="display mt-3 text-4xl sm:text-5xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Built because good landing pages should not require a five-figure consultant.
        </h1>
        <div className="mt-6 hairline" />
      </header>

      <div className="mt-8 max-w-none space-y-6 font-body text-base text-ink-800 leading-relaxed">
        <p>
          Smart founders were spending weeks A/B testing buttons on pages with broken copy. Hiring a CRO
          consultant ran five to fifteen thousand dollars. The free tools — Hotjar, et al. — showed
          behavioral data but never said what to actually fix.
        </p>
        <p>
          So we built Croast: a brutally specific audit that hands you the structural fixes a $10K
          consultant would, in under a minute, for free.
        </p>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          How the audit works
        </h2>
        <p>
          We fetch your landing page, extract the structural pieces (headline, subheadlines, calls to action,
          body, trust signals, FAQ, pricing), and run them through a rule engine trained on the patterns that
          show up in high-converting pages. Each rule carries evidence and a fix. No generic advice.
        </p>
        <p>
          For Pro users, an optional LLM pass layers in qualitative critique on top of the rule output.
          For multi-page audits, the engine runs in parallel and produces a site-level score plus
          CTA consistency, message consistency, and funnel order checks.
        </p>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          What we do not do
        </h2>
        <ul className="list-none space-y-2 pl-0">
          {[
            "We do not store your URL or page content on a server.",
            "We do not require an account.",
            "We do not send marketing emails (the optional newsletter is opt-in, weekly, and about conversion).",
            "We do not pretend every page deserves a 95. We score the page against the rules, not on a curve.",
            "We do not train any model on your page content. Polar.sh is the merchant of record for payments, so we never see your card.",
          ].map((line, i) => (
            <li key={i} className="flex gap-3 border-l-4 border-ink-900 pl-4">
              <span className="font-mono text-xs text-ink-500 w-6 shrink-0">−</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          How we&apos;re different
        </h2>
        <p>
          Hotjar shows you <em>where</em> users drop off. Optimizely gives you A/B testing infrastructure.
          A $10K consultant tells you <em>why</em> after two weeks. Croast tells you <em>why</em> and{" "}
          <em>what to fix</em> in six seconds — for free — and the rules you get are the same ones a senior
          CRO would apply.
        </p>
        <p>
          We&apos;re a small team. We&apos;re Israeli, no registered business, using Polar.sh as our
          payment processor and Vercel as our host. We don&apos;t have a sales team, a marketing team,
          or a quarterly earnings call. We have an audit engine and a shared belief that conversion
          optimization should not be a luxury.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link href="/" className="btn-stamp inline-flex">
            File a verdict
          </Link>
          <Link href="/vs" className="btn-ghost-stamp inline-flex">
            See how we compare
          </Link>
        </div>
      </div>
    </section>
  );
}