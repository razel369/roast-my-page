import type { TrustAnalysis, ObjectionMap } from "@/lib/types";

interface Props {
  trust: TrustAnalysis;
  objections: ObjectionMap;
}

// Combined "Trust audit" — replaces two text-heavy side-by-side exhibits
// with a single scored card. Pass/fail state per item, score at top.
export function TrustAudit({ trust, objections }: Props) {
  const trustScoreColor =
    trust.score >= 60 ? "#2A4D2A" : trust.score >= 30 ? "#D62828" : "#C8321C";

  return (
    <article className="border-2 border-ink-900 bg-bone-50">
      <header className="flex items-center justify-between border-b-2 border-ink-900 bg-bone-200 px-4 py-3">
        <span className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-vermillion">
            § VII
          </span>
          <span className="font-display text-lg font-bold text-ink-900">
            Trust audit
          </span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">
          score{" "}
          <span
            className="font-display text-base font-bold"
            style={{ color: trustScoreColor }}
          >
            {trust.score}
          </span>
          <span className="text-ink-500"> / 100</span>
        </span>
      </header>

      <div className="grid gap-6 p-4 sm:grid-cols-2">
        <AuditColumn
          label="On record"
          sublabel="Things buyers can verify"
          items={trust.signals}
          empty="No trust signals found. Buyers will distrust by default."
          status="pass"
        />
        <AuditColumn
          label="Missing from the record"
          sublabel="What's not on the page"
          items={trust.missing}
          empty="Nothing missing — trust record is complete."
          status="fail"
        />
        <AuditColumn
          label="Objections addressed"
          sublabel="What buyers worry about, and you covered"
          items={objections.handled}
          empty="No objections addressed on the page."
          status="pass"
        />
        <AuditColumn
          label="Open objections"
          sublabel="Reasons buyers might walk away"
          items={objections.missing}
          empty="No open objections on the page."
          status="fail"
        />
      </div>
    </article>
  );
}

function AuditColumn({
  label,
  sublabel,
  items,
  empty,
  status,
}: {
  label: string;
  sublabel: string;
  items: string[];
  empty: string;
  status: "pass" | "fail";
}) {
  const isEmpty = items.length === 0;
  const has = !isEmpty;
  const dot = status === "pass" ? "#2A4D2A" : "#C8321C";
  const glyph = status === "pass" ? "✓" : "✕";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 border-b border-ink-900/30 pb-2">
        <span className="font-display text-sm font-bold text-ink-900">{label}</span>
        <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      <p className="mt-1 font-body text-[11px] italic text-ink-500">{sublabel}</p>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 border-l-2 pl-2 font-body text-sm leading-snug"
            style={{
              borderColor: dot,
              color: status === "fail" ? "#5B5B5B" : "#1F1F1F",
              textDecoration: status === "fail" ? "line-through" : "none",
            }}
          >
            <span
              className="font-mono text-[10px] font-bold mt-0.5 shrink-0"
              style={{ color: dot }}
            >
              {glyph}
            </span>
            <span>{item}</span>
          </li>
        ))}
        {isEmpty && (
          <li
            className="flex items-start gap-2 border-l-2 pl-2 font-body text-sm italic text-ink-500"
            style={{ borderColor: dot }}
          >
            <span className="font-mono text-[10px] font-bold mt-0.5 shrink-0" style={{ color: dot }}>
              {glyph}
            </span>
            <span>{empty}</span>
          </li>
        )}
      </ul>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
        <span className="font-mono text-[9px] uppercase tracking-stamped" style={{ color: dot }}>
          {has ? (status === "pass" ? "Verified" : "Gap") : (status === "pass" ? "Nothing to verify" : "Nothing missing")}
        </span>
      </div>
    </div>
  );
}
