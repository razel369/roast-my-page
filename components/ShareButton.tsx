"use client";
import { useState } from "react";
import type { RoastResult } from "@/lib/types";
import { buildShareUrl } from "@/lib/share";

function verdictEmoji(v: string): string {
  switch (v) {
    case "Conversion Killer":
      return "🔥";
    case "Needs Work":
      return "🩹";
    case "Solid":
      return "👍";
    case "Strong":
      return "🏆";
    default:
      return "📄";
  }
}

function pickTweetQuote(result: RoastResult): string {
  // Pick the most severe killer for a punchy quote.
  const sevOrder = { critical: 0, high: 1, medium: 2 } as const;
  const top = [...result.killers].sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity])[0];
  if (top) {
    const trimmed = top.title.length > 60 ? top.title.slice(0, 57) + "…" : top.title;
    return `The #1 thing killing my conversion: "${trimmed}"`;
  }
  return "Brutally honest landing page teardown in 60 seconds.";
}

export function ShareButton({ result }: { result: RoastResult }) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = buildShareUrl(result);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const emoji = verdictEmoji(result.verdictLabel);
  const quote = pickTweetQuote(result);
  const tweetText = `${emoji} My landing page scored ${result.score}/100 — verdict: "${result.verdictLabel}".\n\n${quote}\n\nFree audit:`;
  const tweetUrl = buildShareUrl(result);
  const tweetIntent = `https://x.com/intent/post?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(tweetUrl)}`;

  const linkedinIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(tweetUrl)}`;
  const redditIntent = `https://www.reddit.com/submit?url=${encodeURIComponent(tweetUrl)}&title=${encodeURIComponent(`${emoji} ${result.score}/100 — Croast verdict`)}`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={copyLink}
        className="btn-ghost-stamp group"
      >
        {copied ? (
          <>
            <span>✓</span>
            <span>Filed</span>
          </>
        ) : (
          <>
            <span className="text-ink-500 group-hover:text-ink-900 transition-colors">⎘</span>
            <span>Copy verdict link</span>
          </>
        )}
      </button>
      <a
        href={tweetIntent}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost-stamp group"
      >
        <span className="text-ink-500 group-hover:text-ink-900 transition-colors">𝕏</span>
        <span>Share on X</span>
      </a>
      <a
        href={linkedinIntent}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost-stamp group"
      >
        <span className="text-ink-500 group-hover:text-ink-900 transition-colors">in</span>
        <span>LinkedIn</span>
      </a>
      <a
        href={redditIntent}
        target="_blank"
        rel="noreferrer"
        className="btn-ghost-stamp group hidden sm:inline-flex"
      >
        <span className="text-ink-500 group-hover:text-ink-900 transition-colors">r/</span>
        <span>Reddit</span>
      </a>
    </div>
  );
}
