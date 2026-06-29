"use client";
import { useEffect, useState } from "react";

// Minimal privacy notice — only renders when analytics is actually enabled.
// We don't use cookies or cross-site tracking, but EU/CA visitors still
// benefit from an explicit one-line notice linked to the full policy.

const STORAGE_KEY = "rmp_privacy_ack_v1";

export function PrivacyNotice() {
  const analyticsOn = !!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!analyticsOn) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    // small delay so the page paints first
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, [analyticsOn]);

  const dismiss = (permanent: boolean) => {
    try {
      if (permanent) localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!analyticsOn || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy notice"
      className="fixed inset-x-3 bottom-3 z-40 border-2 border-ink-900 bg-bone-50 p-3 shadow-[4px_4px_0_#0F0F0F] animate-fade-in sm:inset-x-auto sm:left-1/2 sm:max-w-md sm:-translate-x-1/2"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 font-body text-xs text-ink-800 leading-relaxed">
          <span className="font-bold text-ink-900">Privacy: </span>
          We use cookieless analytics (Plausible) to count page views. No
          tracking, no third parties.{" "}
          <a
            href="/privacy"
            className="underline decoration-vermillion decoration-2 underline-offset-2 hover:text-vermillion"
          >
            Full policy
          </a>
          .
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <button
            type="button"
            onClick={() => dismiss(true)}
            className="bg-vermillion px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-stamped text-bone-50 hover:bg-vermillion-dark"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={() => dismiss(false)}
            className="font-mono text-[10px] uppercase tracking-stamped text-ink-500 hover:text-ink-900"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
}
