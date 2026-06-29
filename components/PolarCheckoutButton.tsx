"use client";
import { useState } from "react";

interface Props {
  plan: "pro" | "team";
  price: string;
  onSuccess?: () => void;
}

export function PolarCheckoutButton({ plan, price, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (!data.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={checkout}
        disabled={loading}
        className="btn-stamp inline-flex w-full justify-center disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-bone-50 border-t-transparent" />
            Redirecting to checkout…
          </>
        ) : (
          <>Subscribe · {price} USD/mo</>
        )}
      </button>
      {error && (
        <div className="border-l-4 border-vermillion bg-highlight-tint px-3 py-2 font-mono text-[11px] text-ink-900">
          {error}
        </div>
      )}
      <p className="filing text-center text-[10px]">
        Secure checkout by Polar.sh · Apple Pay & Google Pay supported
      </p>
    </div>
  );
}
