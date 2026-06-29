export function Features() {
  const items = [
    {
      icon: "I",
      title: "Specific findings, not generic advice",
      body: "Each exhibit names what is wrong, why it costs you money, and exactly how to fix it. No improve your value prop filler.",
    },
    {
      icon: "II",
      title: "Ship-ready rewrites",
      body: "We do not just point at the problem. We hand you a rewritten headline, sub-headline, and call to action you can paste in today.",
    },
    {
      icon: "III",
      title: "60-second verdict",
      body: "What a five-figure consultant delivers over two weeks and three Zoom calls. Same brutal honesty. None of the calendar tetris.",
    },
    {
      icon: "IV",
      title: "Objection-coverage map",
      body: "See every reason a buyer might walk away, and which ones your page actually addresses. The rest is money on the floor.",
    },
    {
      icon: "V",
      title: "Sharable verdict link",
      body: "Every audit produces a sharable URL with a custom stamp image. Drop it in Slack, send to your co-founder, post on X.",
    },
    {
      icon: "VI",
      title: "No signup. No tracking.",
      body: "We do not store your URL, do not require an account, do not email you. Run a verdict, get the answer, ship the fix.",
    },
  ];

  return (
    <section id="features" className="document py-16 sm:py-20">
      <header className="animate-fade-in-up">
        <div className="filing">§ II · Why this exists</div>
        <h3 className="display mt-2 text-3xl sm:text-4xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}>
          The CRO audit you could not afford.
        </h3>
        <p className="mt-2 max-w-2xl font-body text-sm text-ink-700">
          Built because every founder we knew was either guessing what to fix on their landing page,
          or burning five figures on a consultant for the same five insights.
        </p>
        <div className="mt-4 hairline" />
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <article key={it.title} className="exhibit card-lift animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="exhibit-head">
              <span className="text-vermillion font-bold">{it.icon}</span>
              <span>{it.title}</span>
            </div>
            <div className="exhibit-body font-body text-sm text-ink-800 leading-relaxed">
              {it.body}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}