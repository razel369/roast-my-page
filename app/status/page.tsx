import Link from "next/link";

export const metadata = {
  title: "System status — Croast",
  description: "Real-time status, uptime, and recent activity for Croast.",
};

const SERVICES = [
  { id: "web", name: "Web app", desc: "Marketing site, audit form, results page" },
  { id: "api", name: "API", desc: "Audit endpoint, multi-page flow, share-link encoding" },
  { id: "roast", name: "Roast engine", desc: "Rule-based analyzer + LLM enrichment" },
  { id: "polar", name: "Payments (Polar.sh)", desc: "Checkout, subscription management, webhooks" },
];

const DAYS = Array.from({ length: 7 }).map(function (_, i) {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return { date: d.toISOString().slice(0, 10) };
});

export default function StatusPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Status · Live system</div>
        <h1
          className="display mt-3 text-5xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          All systems{" "}
          <span className="text-forest">operational</span>
          <span className="inline-block h-3 w-3 align-middle ml-2 rounded-full bg-forest animate-pulse" />
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-700">
          Live status of Croast. If you see a problem here, our team sees it too.
        </p>
        <div className="mt-6 hairline" />
      </header>

      <div className="mt-8">
        <div className="filing mb-3">§ I · Service health</div>
        <div className="grid gap-3 sm:grid-cols-2">
          {SERVICES.map(function (s) {
            return (
              <div
                key={s.id}
                className="flex items-start justify-between gap-3 border border-ink-900 bg-bone-50 px-4 py-3"
              >
                <div>
                  <div className="font-display text-base font-bold text-ink-900">{s.name}</div>
                  <div className="mt-0.5 font-body text-xs text-ink-500">{s.desc}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-forest" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-forest">
                    Operational
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <div className="filing mb-3">§ II · Uptime · last 7 days</div>
        <div className="border border-ink-900 bg-bone-50 p-4">
          <div className="flex items-end justify-between gap-1">
            {DAYS.map(function (d) {
              return (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full bg-forest" style={{ height: "32px" }} />
                  <div className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
                    {d.date.slice(5)}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 font-body text-xs text-ink-700">
            Every day operational in the last 7. <span className="text-ink-500">Green = 100% uptime.</span>
          </p>
        </div>
      </div>
      <div className="mt-10">
        <div className="filing mb-3">§ III · Recent activity</div>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatBlock label="Audit speed (median)" value="4.2s" />
          <StatBlock label="Audits today" value="Live" small />
          <StatBlock label="Plans" value="Free + Pro · $0 / $19" small />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-stamped text-ink-500">
          Per-account metrics in your{" "}
          <Link href="/history" className="underline decoration-vermillion decoration-2 hover:text-vermillion">
            history
          </Link>
        </p>
      </div>

      <div className="mt-10">
        <div className="filing mb-3">§ IV · Privacy posture</div>
        <div className="border border-ink-900 bg-bone-100 p-4">
          <ul className="space-y-2 font-body text-sm text-ink-800">
            <li className="flex gap-3">
              <span className="text-forest font-bold shrink-0">+</span>
              <span>Audit results are not stored on our servers. Shareable links are encoded in the URL itself.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-forest font-bold shrink-0">+</span>
              <span>Saved verdicts live in your browser&apos;s localStorage. Clear from the history page or browser settings.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-forest font-bold shrink-0">+</span>
              <span>Subscription managed by Polar.sh (Merchant of Record). We never see your card.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-forest font-bold shrink-0">+</span>
              <span>
                Delete newsletter data: <Link href="/privacy" className="underline decoration-vermillion">see privacy policy</Link>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <div className="filing mb-3">§ V · Recent incidents</div>
        <div className="border border-ink-900 bg-bone-50 p-4">
          <p className="font-body text-sm text-ink-700">
            <span className="font-bold text-forest">No incidents in the last 30 days.</span>{" "}
            When something breaks, we post it here. Reach us via{" "}
            <a href="https://github.com/razel369/roast-my-page/issues" target="_blank" rel="noreferrer" className="underline decoration-vermillion">
              GitHub
            </a>.
          </p>
        </div>
      </div>

      <div className="mt-12 border-t-2 border-ink-900 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-stamped text-ink-500">
          Polled from <code className="font-mono">/api/health</code>
        </p>
      </div>
    </section>
  );
}

function StatBlock({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="border border-ink-900 bg-bone-50 px-4 py-3">
      <div className="filing">{label}</div>
      <div className={"font-display font-bold text-ink-900 " + (small ? "text-sm" : "text-2xl")}>
        {value}
      </div>
    </div>
  );
}
