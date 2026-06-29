"use client";
import { useState } from "react";
import type { RoastResult } from "@/lib/types";
import { DEMO_SEEDS } from "@/lib/seeds";
import { roast as runAnalyzer } from "@/lib/analyzer";
import { saveRoast } from "@/lib/storage";

interface Props {
  onResult: (r: RoastResult, source?: "llm" | "rules") => void;
}

export function RoastForm({ onResult }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"url" | "paste">("url");
  const [pasted, setPasted] = useState("");

  const handleRoast = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (mode === "url") {
      if (!url.trim()) {
        setError("Drop a URL first.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch page");
        const result: RoastResult = data.result;
        saveRoast(result);
        onResult(result, data.source);
        if (data.warning) setError(data.warning);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch page";
        setError(message);
        try {
          const demo = buildRoastFromUrlGuess(url.trim());
          saveRoast(demo);
          onResult(demo, "rules");
          setError(
            `${message} — built a best-guess verdict from your URL. Paste your copy below for full accuracy.`,
          );
        } catch {}
      } finally {
        setLoading(false);
      }
    } else {
      if (!pasted.trim()) {
        setError("Paste some page copy first.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() || "https://pasted.local", text: pasted }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to analyze text");
        const result: RoastResult = data.result;
        saveRoast(result);
        onResult(result, data.source);
        if (data.warning) setError(data.warning);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemo = (idx: number) => {
    const seed = DEMO_SEEDS[idx];
    const result = runAnalyzer(seed.page);
    saveRoast(result);
    onResult(result, "rules");
  };

  return (
    <section className="document pb-12" id="roast-form">
      <div className="exhibit card-lift">
        {/* Exhibit header — like a forensic filing tab. */}
        <div className="exhibit-head">
          <span className="flex items-center gap-3">
            <span className="font-mono font-bold text-vermillion">EX. 01</span>
            <span>Subject URL</span>
          </span>
          <span className="text-ink-500">Required</span>
        </div>

        <form onSubmit={handleRoast} className="animate-fade-in px-5 py-6 sm:px-7 sm:py-7 space-y-5">
          {/* Mode tabs — improved styling */}
          <div className="flex gap-1 bg-bone-300 p-1 border border-ink-900 w-fit">
            {(["url", "paste"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`px-4 py-2 font-mono text-[10px] uppercase tracking-stamped font-semibold transition-all duration-200 ${
                  mode === m
                    ? "bg-vermillion text-bone-50 shadow-stamp"
                    : "bg-transparent text-ink-700 hover:text-ink-900"
                }`}
              >
                {m === "url" ? "Enter URL" : "Paste copy"}
              </button>
            ))}
          </div>

          {mode === "url" ? (
            <div>
              <label className="filing mb-2 block" htmlFor="url">URL of the accused</label>
              <input
                id="url"
                type="text"
                inputMode="url"
                autoComplete="url"
                autoFocus
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yourstartup.com"
                className="stamp-field"
                disabled={loading}
              />
            </div>
          ) : (
            <div>
              <label className="filing mb-2 block" htmlFor="paste">Paste the page copy</label>
              <textarea
                id="paste"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                placeholder="Headline, subhead, CTAs, body copy…"
                rows={8}
                className="stamp-field resize-y leading-relaxed"
                disabled={loading}
              />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Site URL (optional, for the case file)"
                className="stamp-field mt-2 text-xs"
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="border-l-4 border-vermillion bg-highlight-tint px-4 py-3 font-mono text-xs text-ink-900">
              <span className="font-bold uppercase tracking-stamped">Notice: </span>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="btn-stamp"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-bone-50 border-t-transparent" />
                  Deliberating…
                </>
              ) : (
                <>Deliver verdict</>
              )}
            </button>
            <span className="filing">~60s · No URL is stored</span>
          </div>
        </form>

        {/* Demo chips — improved clickable cards */}
        <div className="border-t border-ink-900 px-5 py-4 sm:px-7">
          <div className="filing mb-3">Exhibits on file — try a demo</div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {DEMO_SEEDS.map((seed, idx) => (
              <button
                key={seed.label}
                type="button"
                onClick={() => handleDemo(idx)}
                className="group flex items-center gap-3 border border-ink-900 bg-bone-100 px-3 py-2.5 font-mono text-[11px] uppercase tracking-stamped text-ink-900 transition-all duration-200 hover:border-vermillion hover:text-vermillion hover:shadow-exhibit-hover hover:-translate-y-0.5 text-left"
                title={seed.description}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-ink-900 shrink-0"
                  style={{
                    background:
                      seed.band === "strong"
                        ? "#2A4D2A"
                        : seed.band === "solid"
                          ? "#7A7567"
                          : seed.band === "needs-work"
                            ? "#D62828"
                            : "#C8321C",
                  }}
                />
                <span className="font-semibold">{seed.label}</span>
                <span className="text-ink-500 normal-case tracking-normal hidden sm:inline">— {seed.description}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function buildRoastFromUrlGuess(rawUrl: string) {
  let host = rawUrl;
  try {
    host = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`).hostname;
  } catch {}
  const brand = host.split(".")[0] || "your site";
  const page = {
    url: rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
    domain: host,
    title: `${brand[0].toUpperCase()}${brand.slice(1)} — Home`,
    metaDescription: "",
    h1: `Welcome to ${brand}`,
    h2s: [],
    bodyText: "",
    ctaButtons: ["Learn more"],
    wordCount: 0,
    hasNumbers: false,
    hasTestimonials: false,
    hasLogos: false,
    hasGuarantee: false,
    imageCount: 0,
    hasPricing: false,
    hasFAQ: false,
  };
  return runAnalyzer(page);
}