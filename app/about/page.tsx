import Link from "next/link";

export const metadata = {
  title: "About — Roast My Page",
  description: "Why this exists and how it works.",
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
          We kept watching smart founders spend weeks A and B testing buttons on pages with broken copy.
          Hiring a CRO consultant was five to fifteen thousand dollars. The free tools (Hotjar, et al.) showed
          data but never told you what to actually fix.
        </p>
        <p>
          So we built Roast My Page: a brutally specific audit that hands you the structural fixes a $10K
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
          The engine is rule-based for speed and reliability. The architecture is built so a real LLM can be
          dropped in for richer qualitative feedback without changing the UI or storage.
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
            "We do not send marketing emails (we have none).",
            "We do not pretend every page deserves a 95.",
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
          What is next
        </h2>
        <p>
          Deeper qualitative critique (visual layout, mobile UX, microcopy tone), a before-and-after diff
          generator, and an optional LLM mode for the long tail of pages the rule engine cannot fully judge.
          If you want first access, file a verdict and we will know what you actually need.
        </p>

        <div className="mt-10">
          <Link href="/" className="btn-stamp inline-flex">
            File a verdict
          </Link>
        </div>
      </div>
    </section>
  );
}