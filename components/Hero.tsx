"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const DEMO_URLS = [
  "stripe.com",
  "linear.app",
  "vercel.com",
  "notion.so",
  "figma.com",
  "yourstartup.com",
];

export function Hero() {
  const [selfUrl, setSelfUrl] = useState<string | null>(null);
  const [demoUrl, setDemoUrl] = useState("");
  const [demoIdx, setDemoIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "auditing" | "done">("typing");

  // Detect host for self-roast button
  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    if (!host || host === "localhost" || host === "127.0.0.1") return;
    if (host.endsWith("roastmypage.com") || host.endsWith(".vercel.app")) return;
    setSelfUrl(`https://${host}`);
  }, []);

  // Live audit demo cycle
  useEffect(() => {
    const url = DEMO_URLS[demoIdx % DEMO_URLS.length];
    let typingTimer: number | undefined;
    let phaseTimer: number | undefined;
    let cycleTimer: number | undefined;

    setPhase("typing");
    setDemoUrl("");
    let i = 0;
    const tick = () => {
      i += 1;
      setDemoUrl(url.slice(0, i));
      if (i < url.length) {
        typingTimer = window.setTimeout(tick, 70 + Math.random() * 50);
      } else {
        phaseTimer = window.setTimeout(() => {
          setPhase("auditing");
          cycleTimer = window.setTimeout(() => {
            setPhase("done");
            window.setTimeout(() => {
              setDemoIdx((idx) => idx + 1);
            }, 600);
          }, 1600);
        }, 350);
      }
    };
    typingTimer = window.setTimeout(tick, 350);

    return () => {
      if (typingTimer) clearTimeout(typingTimer);
      if (phaseTimer) clearTimeout(phaseTimer);
      if (cycleTimer) clearTimeout(cycleTimer);
    };
  }, [demoIdx]);
  return (
    <section className="paper-bg-grain relative overflow-hidden">
      <div className="watermark text-[260px] sm:text-[420px] right-[-30px] top-[-20px] sm:top-[-40px] animate-float">
        VERDICT
      </div>

      <div className="document pt-12 pb-14 sm:pt-24 sm:pb-20 relative">
        <div className="filing flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-vermillion animate-pulse-subtle" />
            RM-2026-A
          </span>
          <span>Public · ~60s · No signup</span>
        </div>
        <div className="mt-6 double-rule h-1" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
          <div>
            <div className="filing mb-5">CASE NO. RM-2026-001 · OPEN</div>
            <h1
              className="display clamp-hero text-ink-900"
              style={{ fontVariationSettings: "'wght' 700, 'opsz' 144, 'SOFT' 0, 'WONK' 0" }}
            >
              A verdict on your landing page <span className="text-vermillion italic" style={{ fontVariationSettings: "'wght' 400, 'opsz' 144, 'SOFT' 100" }}>in 60 seconds.</span>
            </h1>
            <div className="mt-4 h-1 w-32 bg-vermillion animate-draw-line origin-left" aria-hidden />

            <p className="mt-7 max-w-xl font-body text-base text-ink-700 leading-relaxed sm:text-lg">
              Paste your URL. Get a brutal, specific audit of the five things killing your conversion — with the rewrite dropped in. Free, no signup.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
              {[
                { num: "01", t: "Score from 0 to 100, with reasons." },
                { num: "02", t: "5 conversion killers, ranked by severity." },
                { num: "03", t: "A rewritten hero you can paste in today." },
                { num: "04", t: "A one-hour action plan, time-boxed." },
              ].map((line, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-ink-800 animate-fade-in"
                  style={{ animationDelay: `${i * 100 + 200}ms` }}
                >
                  <span className="font-mono text-[11px] font-bold text-vermillion w-7 shrink-0">
                    {line.num}
                  </span>
                  <span className="border-l-2 border-ink-900 pl-3 -ml-3 py-1">{line.t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
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
                  <span>Try on <span className="font-semibold">{new URL(selfUrl).hostname}</span></span>
                </Link>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="filing mb-3">EXHIBIT 01 · LIVE AUDIT</div>
            <div className="border-2 border-ink-900 bg-bone-50 shadow-[6px_6px_0_#0F0F0F]">
              <div className="flex items-center gap-1.5 border-b-2 border-ink-900 bg-bone-200 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-vermillion" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#D4A017]" />
                <span className="h-2.5 w-2.5 rounded-full bg-forest" />
                <span className="ml-2 font-mono text-[10px] uppercase tracking-stamped text-ink-500">
                  roastmypage.com/audit
                </span>
              </div>
              <div className="space-y-3 px-4 py-4 font-mono text-sm">
                <div>
                  <div className="filing mb-1">URL of the accused</div>
                  <div className="flex items-center justify-between border border-ink-700 bg-bone-100 px-3 py-2">
                    <span className="text-ink-900">
                      https://
                      <span className="text-vermillion">{demoUrl}</span>
                      {(phase === "typing" || phase === "auditing") && (
                        <span className="inline-block h-4 w-1.5 bg-vermillion ml-0.5 align-middle animate-pulse" aria-hidden />
                      )}
                    </span>
                    <span className={"filing " + (phase === "done" ? "text-forest" : "text-vermillion")}>
                      {phase === "typing" ? "TYPING" : phase === "auditing" ? "RUNNING" : "DONE"}
                    </span>
                  </div>
                </div>

                {phase !== "typing" && (
                  <div>
                    <div className="filing mb-1">Verdict</div>
                    <div className="flex items-center justify-between border border-ink-700 bg-bone-100 px-3 py-2">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="font-display text-3xl font-bold"
                          style={{ color: phase === "auditing" ? "var(--warn)" : "var(--vermillion)", fontVariationSettings: "'wght' 800, 'opsz' 144" }}
                        >
                          {phase === "auditing" ? "··" : "47"}
                        </span>
                        <span className="font-mono text-xs text-ink-500">/ 100</span>
                      </div>
                      <span className={"filing " + (phase === "done" ? "text-vermillion" : "text-ink-300")}>
                        {phase === "done" ? "CONVERSION KILLER" : "PENDING"}
                      </span>
                    </div>
                  </div>
                )}

                {phase === "auditing" && (
                  <div className="h-1 w-full bg-bone-200 overflow-hidden">
                    <div className="h-full bg-vermillion animate-progress" />
                  </div>
                )}

                {phase === "done" && (
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="border border-ink-900/20 bg-bone-200 px-2 py-1.5 text-center">
                      <div className="font-display text-base font-bold text-vermillion">5</div>
                      <div className="filing text-ink-500">Killers</div>
                    </div>
                    <div className="border border-ink-900/20 bg-bone-200 px-2 py-1.5 text-center">
                      <div className="font-display text-base font-bold text-ink-900">1</div>
                      <div className="filing text-ink-500">Rewrites</div>
                    </div>
                    <div className="border border-ink-900/20 bg-bone-200 px-2 py-1.5 text-center">
                      <div className="font-display text-base font-bold text-ink-900">3</div>
                      <div className="filing text-ink-500">Wins</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <p className="mt-4 font-mono text-[10px] uppercase tracking-stamped text-ink-500 text-right">
              Anonymized demo · Real audits take 4–8s
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
