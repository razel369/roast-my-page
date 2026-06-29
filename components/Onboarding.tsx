"use client";
import { useEffect, useState } from "react";

interface Step {
  title: string;
  body: string;
  targetSelector: string;
  align?: "above" | "below" | "left" | "right";
}

const STORAGE_KEY = "rmp_onboarded_v1";

export function Onboarding() {
  const [stepIdx, setStepIdx] = useState<number | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const steps: Step[] = [
    {
      title: "Drop a URL",
      body: "Paste any landing page — yours, your competitor's, roastmypage.com itself.",
      targetSelector: "#url",
      align: "below",
    },
    {
      title: "Try a demo if you're shy",
      body: "Three pre-baked examples from different severity bands. One-click verdict.",
      targetSelector: 'button[title^="A strong landing page"]',
      align: "above",
    },
    {
      title: "Verify the verdict yourself",
      body: "Two minutes with a demo beats an hour of uncertainty.",
      targetSelector: "#roast-form",
      align: "below",
    },
  ];

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setStepIdx(0), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stepIdx === null) return;
    const step = steps[stepIdx];
    const el = document.querySelector(step.targetSelector);
    if (!el) {
      // Fallback if target not found, skip to next.
      if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1);
      else finish();
      return;
    }
    setRect(el.getBoundingClientRect());
    const onResize = () => setRect(el.getBoundingClientRect());
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx]);

  const finish = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setStepIdx(null);
    setRect(null);
  };

  const next = () => {
    if (stepIdx === null) return;
    if (stepIdx >= steps.length - 1) finish();
    else setStepIdx(stepIdx + 1);
  };

  if (stepIdx === null || !rect) return null;

  const step = steps[stepIdx];
  const tooltipWidth = 280;
  const tooltipHeight = 140;
  const margin = 12;
  let left = rect.left + rect.width / 2 - tooltipWidth / 2;
  let top = rect.bottom + margin;
  if (step.align === "above") {
    top = rect.top - tooltipHeight - margin;
  }
  // Clamp to viewport.
  left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8));

  return (
    <>
      {/* Backdrop with cutout — using a single dim overlay. */}
      <div
        className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={finish}
        aria-hidden
      />
      {/* Outline the target. */}
      <div
        className="pointer-events-none fixed z-50 rounded-sm ring-4 ring-vermillion ring-offset-2 ring-offset-ink-900"
        style={{
          left: rect.left - 6,
          top: rect.top - 6,
          width: rect.width + 12,
          height: rect.height + 12,
        }}
      />
      {/* Tooltip card. */}
      <div
        role="dialog"
        aria-labelledby={`onboard-${stepIdx}-title`}
        className="fixed z-50 border-2 border-ink-900 bg-bone-50 p-4 shadow-[4px_4px_0_#0F0F0F] animate-fade-in"
        style={{ left, top, width: tooltipWidth }}
      >
        <div className="filing mb-1 text-vermillion font-bold">
          Step {stepIdx + 1} of {steps.length}
        </div>
        <h2 id={`onboard-${stepIdx}-title`} className="display text-lg text-ink-900">
          {step.title}
        </h2>
        <p className="mt-2 font-body text-xs text-ink-700 leading-relaxed">{step.body}</p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={finish}
            className="font-mono text-[10px] uppercase tracking-stamped text-ink-500 hover:text-ink-900"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={next}
            className="bg-vermillion px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-stamped text-bone-50 hover:bg-vermillion-dark"
          >
            {stepIdx < steps.length - 1 ? "Next" : "Got it"}
          </button>
        </div>
      </div>
    </>
  );
}
