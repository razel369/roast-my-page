export function SocialProof() {
  const stats = [
    { label: "Median score", value: "47", note: "The median landing page is genuinely bad." },
    { label: "Avg fix time", value: "23m", note: "To ship the top quick win." },
    { label: "Reported lift", value: "1.8×", note: "After applying the top three exhibits." },
  ];
  return (
    <section className="document py-16">
      <header className="animate-fade-in-up">
        <div className="filing">§ IV · Field observations</div>
        <h3 className="display mt-2 text-3xl sm:text-4xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}>
          What the record shows.
        </h3>
        <div className="mt-4 hairline" />
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div key={s.label} className="exhibit card-lift p-6 text-center animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="font-display text-5xl font-bold text-vermillion leading-none"
              style={{ fontVariationSettings: "'wght' 800, 'opsz' 144" }}>
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