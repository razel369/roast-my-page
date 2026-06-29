export function FinalCTA() {
  return (
    <section className="document py-16 sm:py-20">
      <div className="exhibit p-10 sm:p-14 text-center animate-fade-in-scale">
        <div className="filing">§ V · Motion to file</div>
        <div className="relative inline-block">
          <h3 className="display mt-3 text-3xl sm:text-5xl"
            style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}>
            Stop guessing what to fix on your landing page.
          </h3>
          <div className="mt-2 h-0.5 w-3/4 mx-auto bg-vermillion/30" />
        </div>
        <p className="mx-auto mt-4 max-w-lg font-body text-base text-ink-700">
          Paste your URL. Get a brutal verdict in 60 seconds. Ship the fix before lunch.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a href="#roast-form" className="btn-stamp inline-flex">
            Deliver verdict
          </a>
          <span className="filing">~60s · No signup</span>
        </div>
      </div>
    </section>
  );
}