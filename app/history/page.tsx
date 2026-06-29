"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getHistory, clearHistory, deleteRoast, type HistoryEntry } from "@/lib/storage";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(getHistory());
    setHydrated(true);
  }, []);

  const onClear = () => {
    if (confirm("Clear all verdicts on file? This cannot be undone.")) {
      clearHistory();
      setItems([]);
    }
  };

  const onDelete = (id: string) => {
    deleteRoast(id);
    setItems((cur) => cur.filter((e) => e.id !== id));
  };

  return (
    <section className="document py-12">
      <header>
        <div className="filing">§ Archive · Filed verdicts</div>
        <h1
          className="display mt-3 text-4xl sm:text-5xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Saved verdicts
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-ink-700">
          Every verdict you file is saved locally on this device. Up to 25 most recent.
        </p>
        <div className="mt-4 hairline" />
      </header>

      <div className="mt-6 flex items-end justify-between">
        <div className="filing">{items.length} on file</div>
        {items.length > 0 && (
          <button onClick={onClear} className="btn-ghost-stamp">
            Clear all
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {!hydrated && (
          <div className="exhibit p-6 text-center font-mono text-sm text-ink-500">Loading…</div>
        )}

        {hydrated && items.length === 0 && (
          <div className="exhibit p-10 text-center">
            <div className="font-display text-5xl text-ink-500">∅</div>
            <p className="mt-3 font-body text-ink-700">No verdicts on file.</p>
            <Link href="/" className="btn-stamp mt-4 inline-flex">File your first verdict</Link>
          </div>
        )}

        {hydrated && items.map((entry) => (
          <article key={entry.id} className="exhibit">
            <div className="exhibit-head">
              <span className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-ink-900 font-mono text-xs font-bold"
                  style={{
                    color:
                      entry.score >= 82 ? "#2A4D2A"
                      : entry.score >= 65 ? "#7A7567"
                      : entry.score >= 40 ? "#D62828"
                      : "#C8321C",
                  }}
                >
                  {entry.score}
                </span>
                <span>{entry.domain}</span>
              </span>
              <span>{entry.verdictLabel}</span>
            </div>
            <div className="exhibit-body flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="filing">
                Filed {new Date(entry.timestamp).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/r/${entry.encoded}`} className="btn-ghost-stamp text-[10px]">
                  Open verdict
                </Link>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="btn-ghost-stamp text-[10px] text-vermillion"
                  aria-label="Delete"
                >
                  ✕ Strike
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}