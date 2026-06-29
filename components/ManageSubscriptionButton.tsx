"use client";
import { useState } from "react";

export function ManageSubscriptionButton({ label = "Manage subscription" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/manage", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not open portal");
      if (!data.url) throw new Error("No portal URL returned");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className="btn-ghost-stamp inline-flex w-full justify-center disabled:opacity-60"
      >
        {loading ? "Opening Polar…" : label}
      </button>
      {error && (
        <p className="border-l-4 border-vermillion bg-highlight-tint px-3 py-2 font-mono text-[11px] text-ink-900">
          {error}
        </p>
      )}
    </div>
  );
}
