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
}

// Compact 3x3 grid of category tiles. Each tile is sized by severity:
// critical issues take more visual weight, clean categories stay tiny.
export function DiagnosticGrid({ killers }: Props) {
  const grouped = categorizeKillers(killers);
  const [expanded, setExpanded] = useState<Category | null>(null);
  const [filter, setFilter] = useState<"all" | "critical">("all");

  const criticalCount = killers.filter((k) => k.severity === "critical").length;
  const warningCount = killers.filter((k) => k.severity === "high" || k.severity === "medium").length;
  const cleanCount = CATEGORY_ORDER.length - CATEGORY_ORDER.filter((c) => statusForCategory(grouped.get(c)) !== "clean").length;

  const visibleGrouped = filter === "critical" ? filterToCritical(grouped) : grouped;
  const visibleKillerCount = killers.filter(
    (k) => filter === "all" || k.severity === "critical",
  ).length;

  function weightFor(s: CategoryStatus, hasContent: boolean): string {
    if (!hasContent && s === "clean") return "scale-90 opacity-60";
    if (s === "critical") return "scale-100 ring-2 ring-vermillion";
    if (s === "warning") return "scale-100";
    return "scale-95";
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-stamped text-ink-700">
          {killers.length > 0 ? (
            <>
              <span className="font-bold text-vermillion">{criticalCount} critical</span>
              <span className="mx-2 text-ink-300">·</span>
              <span className="font-bold text-[#C47015]">{warningCount} warning</span>
              <span className="mx-2 text-ink-300">·</span>
              <span className="font-bold text-forest">{cleanCount} clean</span>
              <span className="mx-2 text-ink-300">/ {CATEGORY_ORDER.length}</span>
            </>
          ) : (
            <span className="font-bold text-forest">0 issues · all categories clean</span>
          )}
        </div>
        <div role="tablist" aria-label="Severity filter" className="inline-flex border border-ink-900 bg-bone-100">
          {(["all", "critical"] as const).map((f) => (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={filter === f}
              onClick={() => { setFilter(f); setExpanded(null); }}
              className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-stamped transition-colors ${
                filter === f ? "bg-ink-900 text-bone-50" : "bg-transparent text-ink-700 hover:text-ink-900"
              }`}
            >
              {f === "all" ? "All issues" : `Critical only · ${criticalCount}`}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {CATEGORY_ORDER.map((cat) => {
          const list = visibleGrouped.get(cat);
          const status: CategoryStatus = statusForCategory(list);
          const meta = CATEGORY_META[cat];
          const colors = STATUS_COLOR[status];
          const hasContent = list && list.length > 0;
          const isOpen = expanded === cat;
          const isDim = filter === "critical" && !hasContent;
          const weight = weightFor(status, !!hasContent);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setExpanded(isOpen ? null : cat)}
              aria-pressed={isOpen}
              className={`group relative flex flex-col items-stretch border bg-bone-50 px-3 py-3 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion ${
                isOpen
                  ? "border-vermillion -translate-y-0.5 shadow-[4px_4px_0_#0F0F0F] z-10"
                  : "border-ink-900 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#0F0F0F]"
              } ${isDim ? "opacity-30 hover:opacity-60" : ""} ${weight}`}
              disabled={isDim && !isOpen}
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: colors.bar }} aria-hidden />
              <div className="absolute right-3 top-3.5">
                <span
                  className={`block h-2 w-2 rounded-full ${status === "critical" ? "animate-pulse" : ""}`}
                  style={{ background: colors.dot }}
                  aria-hidden
                />
              </div>
              <div className="mt-1 flex items-baseline justify-between pr-4">
                <span className="font-mono text-[9px] uppercase tracking-stamped text-ink-500">§ {meta.roman}</span>
                <span className="font-display text-xs text-ink-400" aria-hidden>{meta.icon}</span>
              </div>
              <div className="mt-1.5 font-display text-sm font-bold leading-tight text-ink-900 sm:text-base">
                {meta.label}
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                {hasContent ? (
                  <span
                    className="font-mono text-[9px] uppercase tracking-stamped font-bold"
                    style={{ color: colors.text }}
                  >
                    {list!.length} {list!.length === 1 ? "issue" : "issues"}
                  </span>
                ) : (
                  <span
                    className="font-mono text-[9px] uppercase tracking-stamped flex items-center gap-1"
                    style={{ color: colors.text }}
                  >
                    <span aria-hidden>✓</span> {STATUS_LABEL[status]}
                  </span>
                )}
              </div>
              {status === "critical" && (
                <span className="mt-2 inline-block self-start bg-vermillion px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-stamped text-bone-50">
                  Critical
                </span>
              )}
            </button>
          );
        })}
      </div>

      {filter === "critical" && criticalCount === 0 && (
        <div className="mt-6 border-2 border-forest bg-bone-100 p-4 text-center font-body text-sm text-ink-900">
          <span className="text-forest font-bold">✓</span> No critical issues. Your copy fundamentals are sound.
        </div>
      )}

      {expanded && visibleGrouped.has(expanded) && (
        <div className="mt-6 animate-fade-in">
          <CategoryDetail
            category={expanded}
            killers={visibleGrouped.get(expanded) ?? []}
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
    <article className="border-2 border-vermillion bg-bone-50 shadow-[4px_4px_0_#0F0F0F]">
      <header className="flex items-center justify-between border-b-2 border-vermillion bg-bone-200 px-4 py-3">
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
  high: { bg: "#C47015", text: "#FFFFFF", label: "High" },
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
          <span className="font-mono text-[10px] font-bold uppercase tracking-stamped opacity-80">
            EX. {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-display text-sm font-bold">{killer.title}</span>
        </span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-stamped">
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

function filterToCritical<T extends { severity: "critical" | "high" | "medium" }>(
  grouped: Map<Category, T[]>,
): Map<Category, T[]> {
  const out = new Map<Category, T[]>();
  for (const [cat, list] of grouped) {
    const filtered = list.filter((k) => k.severity === "critical");
    if (filtered.length > 0) out.set(cat, filtered);
  }
  return out;
}