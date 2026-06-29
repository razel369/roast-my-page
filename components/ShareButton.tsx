"use client";
import { useState } from "react";
import type { RoastResult } from "@/lib/types";
import { buildShareUrl } from "@/lib/share";

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

  const tweetText = `My landing page scored ${result.score}/100 on Roast My Page — "${result.verdictLabel}". The teardown:`;
  const tweetUrl = buildShareUrl(result);
  const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(tweetUrl)}`;

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
        <span className="text-ink-500 group-hover:text-ink-900 transition-colors">✕</span>
        <span>Post to X</span>
      </a>
    </div>
  );
}