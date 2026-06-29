// /welcome?checkout_id=... — landing after successful Polar checkout.
// We can't read the cookie server-side from a middleware without dynamic,
// and Polar sends the token via the webhook (separate request). So we
// recommend that the user paste their email here, look up their token in
// Polar, and surface it client-side.
//
// For convenience, also offer a "send me my token" form that posts to
// /api/welcome-token which looks up the user's recent subscription in
// our local token store.

"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ManageSubscriptionButton } from "@/components/ManageSubscriptionButton";

// Render-blocking metadata only — use the parent layout's defaults;
// /welcome is mostly a logged-in destination, not a marketing page.

function WelcomeInner() {
  const params = useSearchParams();
  const checkoutId = params.get("checkout_id") || params.get("session_id");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)rmp_pro_token=([^;]+)/);
      if (match) setToken(decodeURIComponent(match[1]));
    }
  }, []);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/welcome-token?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not find subscription yet");
      if (data.token) {
        setToken(data.token);
        document.cookie = `rmp_pro_token=${encodeURIComponent(data.token)}; path=/; max-age=2592000; SameSite=Lax`;
      } else {
        setError("No active subscription found for that email. If you just paid, give it a few seconds and retry.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Welcome · Subscription confirmed</div>
        <h1
          className="display mt-3 text-5xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          You&apos;re in.{" "}
          <span className="text-vermillion">Now what?</span>
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-700">
          Your Pro subscription is active. Below is your personal Pro token —
          keep it private. Use it on the web (it&apos;s auto-saved as a cookie)
          or paste it into API calls.
        </p>
        <div className="mt-6 hairline" />
      </header>

      <div className="mt-10 border-2 border-ink-900 bg-bone-50 p-6">
        <div className="filing mb-2 text-vermillion font-bold">Your Pro token</div>
        {token ? (
          <>
            <div className="flex items-stretch gap-2 border border-ink-900 bg-bone-100">
              <input
                readOnly
                value={token}
                className="w-full bg-transparent px-3 py-3 font-mono text-sm text-ink-900 focus:outline-none"
                onFocus={(e) => e.currentTarget.select()}
              />
              <button
                type="button"
                onClick={copy}
                className="border-l border-ink-900 bg-bone-200 px-4 font-mono text-[10px] uppercase tracking-stamped text-ink-900 hover:bg-bone-300"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-3 font-body text-sm text-ink-700">
              For API requests, send <code className="font-mono bg-bone-200 px-1">Authorization: Bearer {token.slice(0, 8)}…</code>.
              We&apos;ve also saved it as a cookie in this browser.
            </p>
          </>
        ) : (
          <form onSubmit={lookup} className="space-y-3">
            <label className="block">
              <span className="filing mb-1 block">Email used at checkout</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-ink-900 bg-bone-100 px-3 py-2 font-body text-base text-ink-900"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="btn-stamp disabled:opacity-60"
            >
              {loading ? "Looking up…" : "Get my Pro token"}
            </button>
            {error && (
              <p className="border-l-4 border-vermillion bg-highlight-tint px-3 py-2 font-mono text-[11px] text-ink-900">
                {error}
              </p>
            )}
            <p className="filing text-[10px]">
              Polar webhook can take 5–30 seconds to deliver your token after checkout.
            </p>
          </form>
        )}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link href="/" className="exhibit block card-lift p-5">
          <div className="filing">Step 1</div>
          <h3 className="mt-1 display text-2xl">Run an unlimited roast</h3>
          <p className="mt-2 font-body text-sm text-ink-700">
            AI-enriched critique, no daily limit, screenshots where enabled.
          </p>
        </Link>
        <Link href="/history" className="exhibit block card-lift p-5">
          <div className="filing">Step 2</div>
          <h3 className="mt-1 display text-2xl">Cloud archive coming</h3>
          <p className="mt-2 font-body text-sm text-ink-700">
            Your verdicts are still in browser localStorage. We&apos;re rolling out
            cloud sync across devices for Pro members.
          </p>
        </Link>
      </div>

      <div className="mt-12 border border-ink-900 bg-bone-100 p-5 text-center">
        <p className="font-mono text-[11px] uppercase tracking-stamped text-ink-700">
          Need to manage billing, invoices, or cancel?
        </p>
        <p className="mt-2 font-body text-sm text-ink-700">
          Polar handles all of it from their customer portal — update card, view invoices, cancel anytime.
        </p>
        <div className="mt-4">
          <ManageSubscriptionButton />
        </div>
      </div>

      {checkoutId && (
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-stamped text-ink-500">
          Reference · {checkoutId}
        </p>
      )}
    </section>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="document py-16">Loading…</div>}>
      <WelcomeInner />
    </Suspense>
  );
}
