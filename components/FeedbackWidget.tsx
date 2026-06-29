"use client";
import { useState } from "react";

interface Props {
  verdictId?: string;
  domain?: string;
  score?: number;
  source?: "share_view" | "results_inline";
}

const REASONS: Array<{ key: string; label: string }> = [
  { key: "generic", label: "Too generic" },
  { key: "wrong-score", label: "Score feels off" },
  { key: "missing-issue", label: "Missed an issue" },
  { key: "too-long", label: "Too long" },
  { key: "other", label: "Other" },
];

export function FeedbackWidget({ verdictId, domain, score, source = "results_inline" }: Props) {
  const [stage, setStage] = useState<"ask" | "reason" | "done">("ask");
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const send = async (h: boolean, r?: string | null) => {
    setSending(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helpful: h,
          reason: r ?? undefined,
          verdictId,
          domain,
          score,
          source,
        }),
      });
    } catch {
      /* silent — feedback failure shouldn't block the user */
    } finally {
      setSending(false);
    }
  };

  if (stage === "done") {
    return (
      <div className="mt-4 border border-vermillion bg-highlight-tint px-4 py-3 font-mono text-sm text-ink-900">
        Thanks. We use this to fix what we keep getting wrong.
      </div>
    );
  }

  if (stage === "ask") {
    return (
      <div className="mt-4 border border-ink-900 bg-bone-50 px-4 py-3">
        <div className="filing mb-2">Was this verdict useful?</div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={sending}
            onClick={() => {
              setHelpful(true);
              void send(true, null);
              setStage("done");
            }}
            className="flex-1 border border-ink-900 bg-bone-100 px-3 py-2 font-mono text-xs uppercase tracking-stamped text-ink-900 transition-colors hover:border-vermillion hover:text-vermillion disabled:opacity-60"
          >
            Yes
          </button>
          <button
            type="button"
            disabled={sending}
            onClick={() => {
              setHelpful(false);
              setStage("reason");
            }}
            className="flex-1 border border-ink-900 bg-bone-100 px-3 py-2 font-mono text-xs uppercase tracking-stamped text-ink-900 transition-colors hover:border-vermillion hover:text-vermillion disabled:opacity-60"
          >
            Could be sharper
          </button>
        </div>
      </div>
    );
  }

  // stage === "reason"
  return (
    <div className="mt-4 border border-ink-900 bg-bone-50 px-4 py-3">
      <div className="filing mb-2">What was missing? (optional)</div>
      <div className="flex flex-wrap gap-2">
        {REASONS.map((r) => (
          <button
            key={r.key}
            type="button"
            disabled={sending}
            onClick={() => {
              setReason(r.key);
              setSending(true);
              void send(false, r.key);
              setSending(false);
              setStage("done");
            }}
            className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-stamped transition-colors ${
              reason === r.key
                ? "border-vermillion bg-highlight-tint text-vermillion"
                : "border-ink-900 bg-bone-100 text-ink-700 hover:text-vermillion"
            } disabled:opacity-60`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setStage("done");
        }}
        className="mt-3 font-mono text-[10px] uppercase tracking-stamped text-ink-500 hover:text-ink-900"
      >
        Skip
      </button>
    </div>
  );
}
