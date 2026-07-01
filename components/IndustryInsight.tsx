import type { RoastResult } from "@/lib/types";
import { industryLabel } from "@/lib/industry";

interface Props {
  result: RoastResult;
}

const ACCENT_BY_INDUSTRY: Record<string, string> = {
  "b2b-saas": "var(--ink)",
  "ecommerce": "var(--gold-dark)",
  "creator": "var(--forest)",
  "agency": "var(--vermillion-dark)",
  "fintech": "var(--warn)",
  "media": "var(--forest)",
  "unknown": "var(--ink-500)",
};

export function IndustryInsight({ result }: Props) {
  if (!result.industry || result.industry === "unknown") return null;
  const tips = result.industryTips ?? [];
  if (tips.length === 0) return null;
  const accent = ACCENT_BY_INDUSTRY[result.industry] ?? "var(--ink)";

  return (
    <article className="border-2 border-ink-900 bg-bone-100 p-5 sm:p-6">
      <header className="mb-3 flex items-center justify-between gap-3">
        <span className="filing text-vermillion font-bold">§ Industry insight</span>
        <span
          className="inline-block border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-stamped"
          style={{ borderColor: accent, color: accent }}
        >
          {industryLabel(result.industry)}
        </span>
      </header>
      <p className="font-body text-sm text-ink-800 leading-relaxed mb-3">
        We identified this page as <strong>{industryLabel(result.industry)}</strong>. The advice below is tuned to that market:
      </p>
      <ul className="space-y-2">
        {tips.slice(0, 4).map((t, i) => (
          <li
            key={i}
            className="flex items-start gap-3 border-l-2 border-ink-900 pl-3 font-body text-sm text-ink-900 leading-relaxed"
          >
            <span className="font-mono text-[10px] font-bold text-vermillion mt-0.5 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}