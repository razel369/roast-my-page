import Link from "next/link";

const items = [
  { label: "vs Hotjar", href: "/vs/hotjar", note: "Heatmaps ≠ audit" },
  { label: "vs PageSpeed", href: "/vs/pagespeed", note: "Speed ≠ conversion" },
  { label: "vs a consultant", href: "/vs/cro-consultant", note: "Free in 60s vs $10K in 2 weeks" },
];

export function ComparisonStrip() {
  return (
    <section className="document py-10">
      <div className="filing mb-3">§ Compare · Side-by-side</div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className="group border border-ink-900 bg-bone-50 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-vermillion hover:shadow-exhibit-hover"
          >
            <div className="font-mono text-[11px] uppercase tracking-stamped text-vermillion font-bold">
              {it.label}
            </div>
            <div className="mt-1 font-body text-xs text-ink-700 group-hover:text-ink-900">
              {it.note}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-3 text-center">
        <Link
          href="/vs"
          className="font-mono text-[10px] uppercase tracking-stamped text-ink-500 hover:text-vermillion"
        >
          All comparisons →
        </Link>
      </div>
    </section>
  );
}
