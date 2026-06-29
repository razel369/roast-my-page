"use client";
import { useState } from "react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  STATUS_COLOR,
  STATUS_LABEL,
  categorizeKillers,
  statusForCategory,
  type Category,
  type CategoryStatus,
} from "@/lib/categories";
import type { Killer } from "@/lib/types";

interface Props {
  killers: Killer[];
  heroRewriteHeadline: string;
}

// Compact 3×3 grid of category tiles, each with a status bar.
// Below: per-category expanded view with the original exhibit cards.
export function DiagnosticGrid({ killers }: Props) {
  const grouped = categorizeKillers(killers);
  const [expanded, setExpanded] = useState<Category | null>(null);

  return (
    <div>
      {/* Diagnostic tiles */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {CATEGORY_ORDER.map((cat) => {
          const list = grouped.get(cat);
          const status: CategoryStatus = statusForCategory(list);
          const meta = CATEGORY_META[cat];
          const color = STATUS_COLOR[status];
          const isOpen = expanded === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setExpanded(isOpen ? null : cat)}
              aria-pressed={isOpen}
              className={`group relative flex flex-col items-stretch border border-ink-900 bg-bone-50 px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-exhibit-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion ${
                isOpen ? "-translate-y-0.5 shadow-exhibit-hover" : ""
              }`}
            >
              {/* Status bar at the top */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: color.bar }}
                aria-hidden
              />
              {/* Roman + icon */}
              <div className="mt-1 flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">
                  § {meta.roman}
                </span>
                <span className="font-display text-xs text-ink-500" aria-hidden>
                  {meta.icon}
                </span>
              </div>
              <div className="mt-1.5 font-display text-sm font-bold leading-tight text-ink-900 sm:text-base">
                {meta.label}
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: color.dot }}
                  aria-hidden
                />
                <span className="font-mono text-[9px] uppercase tracking-stamped" style={{ color: color.text }}>
                  {list && list.length > 0 ? `${list.length} ${list.length === 1 ? "issue" : "issues"}` : STATUS_LABEL[status]}
                </span>
              </div>
              {/* Tooltip on hover: category description */}
              <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 hidden -translate-x-1/2 whitespace-nowrap border border-ink-900 bg-ink-900 px-2 py-1 font-mono text-[9px] uppercase tracking-stamped text-bone-50 shadow-lg group-hover:block">
                {meta.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded category — issues for that category */}
      {expanded && grouped.has(expanded) && (
        <div className="mt-6 animate-fade-in">
          <CategoryDetail
            category={expanded}
            killers={grouped.get(expanded) ?? []}
            onClose={() => setExpanded(null)}
          />
        </div>
      )}
    </div>
  );
}

function CategoryDetail({
  category,
  killers,
  onClose,
}: {
  category: Category;
  killers: Killer[];
  onClose: () => void;
}) {
  const meta = CATEGORY_META[category];
  return (
    <article className="border-2 border-ink-900 bg-bone-50">
      <header className="flex items-center justify-between border-b-2 border-ink-900 bg-bone-200 px-4 py-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-stamped text-vermillion">
            § {meta.roman}
          </span>
          <span className="font-display text-lg font-bold text-ink-900">{meta.label}</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-stamped text-ink-500 sm:inline">
            · {meta.desc}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close category"
          className="font-mono text-[10px] uppercase tracking-stamped text-ink-500 hover:text-ink-900"
        >
          ✕ close
        </button>
      </header>
      <ol className="space-y-3 p-4">
        {killers.map((k, i) => (
          <KillerCard key={i} killer={k} index={i} />
        ))}
      </ol>
    </article>
  );
}

const SEVERITY_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  critical: { bg: "#C8321C", text: "#FFFFFF", label: "Critical" },
  high: { bg: "#D62828", text: "#FFFFFF", label: "High" },
  medium: { bg: "#FFE5D6", text: "#7A2710", label: "Medium" },
};

function KillerCard({ killer, index }: { killer: Killer; index: number }) {
  const sev = SEVERITY_STYLE[killer.severity] || SEVERITY_STYLE.medium;
  return (
    <li className="border border-ink-900 bg-bone-100">
      <div
        className="flex items-center justify-between gap-3 border-b border-ink-900 px-3 py-2"
        style={{ background: sev.bg, color: sev.text }}
      >
        <span className="flex items-baseline gap-3">
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-stamped opacity-80"
            style={{ color: sev.text }}
          >
            EX. {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-sm font-bold">{killer.title}</span>
        </span>
        <span
          className="font-mono text-[9px] font-bold uppercase tracking-stamped"
          style={{ color: sev.text }}
        >
          {sev.label}
        </span>
      </div>
      <div className="space-y-3 px-4 py-3">
        <div>
          <div className="filing mb-1">Evidence</div>
          <p className="font-body text-sm text-ink-800 leading-relaxed">{killer.evidence}</p>
        </div>
        <div>
          <div className="filing mb-1 text-vermillion font-bold">Fix</div>
          <p className="font-body text-sm text-ink-900 leading-relaxed">{killer.fix}</p>
        </div>
      </div>
    </li>
  );
}
