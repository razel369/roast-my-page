"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Hero() {
  // Detect the visitor's own domain so they can one-click roast this site.
  // Suppressed on localhost (dev) and on roastmypage.com itself.
  const [selfUrl, setSelfUrl] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    if (!host) return;
    if (host === "localhost" || host === "127.0.0.1") return;
    if (host.endsWith("roastmypage.com") || host.endsWith(".vercel.app")) {
      // Demo affordance: still link to demo seed.
      setSelfUrl(null);
      return;
    }
    setSelfUrl(`https://${host}`);
  }, []);

  return (
    <section className="document pt-16 pb-10 sm:pt-28 relative">
      {/* Decorative watermark */}
      <div className="watermark text-[240px] sm:text-[360px] right-0 top-0 leading-none select-none">
        RMP
      </div>

      <div className="filing flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-vermillion animate-pulse-subtle" />
          RM-2026-A
        </span>
        <span>Public · ~60s · No signup</span>
      </div>
      <div className="mt-6 double-rule h-1" />

      <div className="mt-10 grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end relative">
        <div className="animate-fade-in-up">
          <div className="filing mb-4">Case No. RM-2026-001</div>
          <h1
            className="display text-[56px] leading-[0.92] sm:text-[88px] sm:leading-[0.9]"
            style={{ fontVariationSettings: "'wght' 700, 'opsz' 144, 'SOFT' 0, 'WONK' 0" }}
          >
            A verdict on your landing page in 60 seconds.
          </h1>
          <div className="mt-2 h-1 w-24 bg-vermillion animate-draw-line origin-left" />
          <p className="mt-6 max-w-xl font-body text-base text-ink-700 leading-relaxed sm:text-lg">
            Paste your URL. Get a brutal, specific audit of the 5 things
            killing your conversion — with the rewrite dropped in.
            Free, no signup.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#roast-form" className="btn-stamp inline-flex">
              Deliver verdict
            </a>
            {selfUrl && (
              <Link
                href={`/?url=${encodeURIComponent(selfUrl)}#roast-form`}
                className="btn-ghost-stamp inline-flex"
                title={`Roast ${new URL(selfUrl).hostname}`}
              >
                <span className="text-vermillion font-bold">↻</span>
                <span>Try it on <span className="font-semibold">{new URL(selfUrl).hostname}</span></span>
              </Link>
            )}
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
            {[
              "A score from 0 to 100, with reasons.",
              "5 conversion killers, ranked by severity.",
              "A rewritten hero you can paste in today.",
              "A one-hour action plan, time-boxed.",
            ].map((line, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-800 animate-fade-in" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                <span className="font-mono text-[11px] text-vermillion font-semibold w-6 shrink-0">
                  0{i + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Filing mark — a vertical stamp on the right rail. */}
        <div className="hidden sm:flex flex-col items-end gap-1 pb-2 animate-fade-in">
          <div className="font-mono text-[10px] uppercase tracking-stamped text-ink-500">
            Case File
          </div>
          <div className="font-display text-3xl text-ink-900 leading-none italic"
            style={{ fontVariationSettings: "'wght' 400, 'opsz' 144, 'SOFT' 100" }}>
            #0001
          </div>
          <div className="mt-2 h-20 w-px bg-rule" />
        </div>
      </div>
    </section>
  );
}
