export function SocialProof() {
  const checks = [
    {
      label: "Audit speed",
      value: "~6s",
      note: "From URL paste to verdict — no signup, no queue.",
    },
    {
      label: "Checks run",
      value: "9",
      note: "Headline, CTAs, social proof, trust, FAQ, pricing, and more across nine diagnostic categories.",
    },
    {
      label: "Output format",
      value: "100",
      note: "A score out of 100, with severity-ranked fixes in plain English.",
    },
  ];
  return (
    <section className="document py-16">
      <header className="animate-fade-in-up">
        <div className="filing">§ IV · What you get</div>
        <h3
          className="display mt-2 text-3xl sm:text-4xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          The case file.
        </h3>
        <div className="mt-4 hairline" />
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {checks.map((s, i) => (
          <div
            key={s.label}
            className="exhibit card-lift p-6 text-center animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className="font-display text-5xl font-bold text-vermillion leading-none"
              style={{ fontVariationSettings: "'wght' 800, 'opsz' 144" }}
            >
              {s.value}
            </div>
            <div className="mt-3 filing">{s.label}</div>
            <div className="mt-2 font-body text-xs text-ink-700">{s.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
