// Email capture modal. Triggers after a roast completes.
// POSTs to /api/subscribe. Persistence is configurable via env (Upstash
// Redis list, or a generic webhook for Mailchimp/Beehiiv/Loops).

"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "rmp_subscribed_v1";
const SHOW_DELAY_MS = 12_000; // don't pop instantly; let user see the result first

export function EmailCapture({ score, trigger }: { score?: number; trigger: boolean }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!trigger) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => {
      setOpen(true);
    }, SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [trigger]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setMessage("That email looks off — try again.");
      return;
    }
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, score }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Subscribe failed");
      }
      setState("done");
      setMessage("You're in. First tip ships Sunday.");
      try {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
      } catch {
        /* ignore */
      }
      setTimeout(() => setOpen(false), 2200);
    } catch (err) {
      setState("error");
      setMessage((err as Error).message);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-capture-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 backdrop-blur-sm p-4 sm:items-center"
    >
      <div className="relative w-full max-w-md border-2 border-ink-900 bg-bone-50 p-6 shadow-[6px_6px_0_#0F0F0F] animate-fade-in">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 font-mono text-xs text-ink-500 hover:text-ink-900"
        >
          ✕ close
        </button>

        <div className="filing mb-2 text-vermillion font-bold">Filed under</div>
        <h3 id="email-capture-title" className="display text-2xl text-ink-900">
          One conversion tip a week. No fluff.
        </h3>
        <p className="mt-2 font-body text-sm text-ink-700">
          Each Sunday: one specific trick pulled from real audits, with the before/after copy. Unsubscribe in one click.
        </p>

        {state === "done" ? (
          <div className="mt-5 border border-vermillion bg-highlight-tint px-4 py-3 font-mono text-sm text-ink-900">
            ✓ {message}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block">
              <span className="filing mb-1 block">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-ink-900 bg-bone-50 px-3 py-2 font-body text-base text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-vermillion"
                autoComplete="email"
              />
            </label>
            <button
              type="submit"
              disabled={state === "loading"}
              className="btn-primary w-full disabled:opacity-60"
            >
              {state === "loading" ? "Filing…" : "Send me the tips"}
            </button>
            {message && (
              <p className={`font-mono text-xs ${state === "error" ? "text-vermillion" : "text-ink-700"}`}>
                {message}
              </p>
            )}
            <p className="font-mono text-[10px] uppercase tracking-stamped text-ink-500">
              No spam. One click unsubscribe.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
