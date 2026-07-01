"use client";
import { useEffect, useState } from "react";
import { getTrendForDomain, getTrendSummary, type TrendSummary } from "@/lib/storage";

interface Props {
  domain?: string;
  inline?: boolean;
}

export function TrendChart({ domain, inline }: Props) {
  const [points, setPoints] = useState<{ timestamp: number; score: number }[]>([]);
  const [summary, setSummary] = useState<TrendSummary | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const s = getTrendSummary();
    setSummary(s);
    if (domain) {
      setPoints(getTrendForDomain(domain).map((p) => ({ timestamp: p.timestamp, score: p.score })));
    } else {
      // No specific domain: show overall score-over-time across all entries
      try {
        const raw = localStorage.getItem("rmp_history_v1");
        if (raw) {
          const list = JSON.parse(raw) as { timestamp: number; score: number; domain: string }[];
          const sorted = list.slice().sort((a, b) => a.timestamp - b.timestamp).slice(-10);
          setPoints(sorted.map((p) => ({ timestamp: p.timestamp, score: p.score })));
        }
      } catch {}
    }
  }, [domain]);

  // Need at least 2 points for a chart
  if (!summary || summary.totalAudits === 0) return null;
  if (points.length < 2) {
    return (
      <div className={inline ? "" : "document py-8"}>
        <TrendSummaryCard summary={summary} />
        {points.length === 1 && (
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-stamped text-ink-500">
            Run another audit to start seeing your score trend.
          </p>
        )}
      </div>
    );
  }

  // Sparkline geometry
  const W = 480;
  const H = 80;
  const padding = 6;
  const minScore = Math.min(...points.map((p) => p.score), 0);
  const maxScore = Math.max(...points.map((p) => p.score), 100);
  const range = Math.max(maxScore - minScore, 1);
  const stepX = (W - padding * 2) / Math.max(points.length - 1, 1);
  const xy = points.map((p, i) => ({
    x: padding + i * stepX,
    y: padding + (1 - (p.score - minScore) / range) * (H - padding * 2),
    score: p.score,
  }));

  const lastX = xy[xy.length - 1].x;
  const lastY = xy[xy.length - 1].y;
  const polyline = xy.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const fillPath = `M ${xy[0].x.toFixed(1)},${(H - padding).toFixed(1)} L ${polyline.replace(/ /g, ' L ')} L ${lastX.toFixed(1)},${(H - padding).toFixed(1)} Z`;

  // Direction
  const direction = summary.lastDirection;
  const delta = summary.lastDelta;
  const dirColor = direction === "up" ? "var(--forest)" : direction === "down" ? "var(--vermillion)" : "var(--ink-500)";
  const dirArrow = direction === "up" ? "↑" : direction === "down" ? "↓" : "→";

  return (
    <div className={inline ? "" : "document py-8"}>
      <TrendSummaryCard summary={summary} />
      <div className="mt-4 border border-ink-900 bg-bone-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="filing">Score trend</span>
          <span className="font-mono text-[11px] uppercase tracking-stamped font-bold" style={{ color: dirColor }}>
            {dirArrow} {delta > 0 ? "+" : ""}{delta} since last audit
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20" preserveAspectRatio="none">
          <path d={fillPath} fill="var(--ink)" opacity="0.06" />
          <polyline points={polyline} fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
          {xy.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2" fill="var(--ink)" />
          ))}
          <circle cx={lastX} cy={lastY} r="3.5" fill="var(--vermillion)" />
        </svg>
        <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-stamped text-ink-500">
          <span>{new Date(points[0].timestamp).toLocaleDateString()}</span>
          <span>{points.length} runs · {domain ?? "all sites"}</span>
          <span>{new Date(points[points.length - 1].timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

function TrendSummaryCard({ summary }: { summary: TrendSummary }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <StatBlock label="Total audits" value={String(summary.totalAudits)} />
      <StatBlock label="Avg score" value={String(summary.avgScore)} suffix="/100" />
      <StatBlock label="Best domain" value={summary.bestDomain || "—"} small />
    </div>
  );
}

function StatBlock({ label, value, suffix, small }: { label: string; value: string; suffix?: string; small?: boolean }) {
  return (
    <div className="border border-ink-900 bg-bone-100 px-3 py-2">
      <div className="filing">{label}</div>
      <div className={"font-display font-bold text-ink-900 " + (small ? "text-sm truncate" : "text-2xl")}>
        {value}{suffix && <span className="font-mono text-xs text-ink-500">{suffix}</span>}
      </div>
    </div>
  );
}