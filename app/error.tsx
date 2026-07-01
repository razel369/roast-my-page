"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook for future telemetry
    console.error("[Croast]", error);
  }, [error]);

  return (
    <div className="container-narrow py-24 text-center">
      <div className="text-5xl">💥</div>
      <h1 className="mt-4 text-2xl font-bold">Something burned down.</h1>
      <p className="mt-2 text-ink-400">
        We hit an unexpected error. Try again, or roast a different page.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="btn-primary">Retry</button>
        <a href="/" className="btn-secondary">Back to home</a>
      </div>
    </div>
  );
}