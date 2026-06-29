export function HowItWorks() {
  const steps = [
    { n: "01", title: "Drop a URL", body: "Paste your landing page link, or paste the copy directly. We fetch the rest." },
    { n: "02", title: "We examine the page", body: "Headline, calls to action, trust, objections, structure, length, specificity, plus desktop and mobile screenshots." },
    { n: "03", title: "Ship the fixes", body: "Prioritized exhibits, a hero rewrite, a one-hour action plan. Copy, paste, deploy, measure." },
  ];
  return (
    <section className="document py-16 sm:py-20">
      <header className="animate-fade-in-up">
        <div className="filing">§ III · Procedure</div>
        <h3 className="display mt-2 text-3xl sm:text-4xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}>
          Three steps. No filler.
        </h3>
        <div className="mt-4 hairline" />
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <article key={s.n} className="exhibit card-lift animate-fade-in" style={{ animationDelay: `${i * 120}ms` }}>
            <div className="exhibit-head">
              <span className="text-vermillion font-bold">Step {s.n}</span>
              <span>{s.title}</span>
            </div>
            <div className="exhibit-body font-body text-sm text-ink-800 leading-relaxed">
              {s.body}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}