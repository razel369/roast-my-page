"use client";

interface StampProps {
  score: number;
  verdict: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZES = {
  sm: { box: "w-32 h-32", score: "text-5xl", verdict: "text-[8px]", label: "text-[8px]", padding: "p-3" },
  md: { box: "w-44 h-44", score: "text-7xl", verdict: "text-[9px]", label: "text-[9px]", padding: "p-4" },
  lg: { box: "w-60 h-60", score: "text-[88px] leading-none", verdict: "text-[10px]", label: "text-[10px]", padding: "p-5" },
  xl: { box: "w-80 h-80", score: "text-[120px] leading-none", verdict: "text-[11px]", label: "text-[11px]", padding: "p-6" },
};

const VERDICT_COLOR: Record<string, string> = {
  "Conversion Killer": "#C8321C",
  "Needs Work": "#D62828",
  Solid: "#7A7567",
  Strong: "#2A4D2A",
};

export function Stamp({ score, verdict, size = "lg" }: StampProps) {
  const s = SIZES[size];
  const accent = VERDICT_COLOR[verdict] ?? "#C8321C";

  return (
    <div className={`relative ${s.box} animate-stamp-slam`} aria-hidden>
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="ink-bleed">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="3" />
            <feDisplacementMap in="SourceGraphic" scale="1.4" />
          </filter>
          <filter id="ink-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
            <feDisplacementMap in="SourceGraphic" scale="0.9" />
          </filter>
        </defs>
      </svg>

      {/* Outer ring — double circle, classic stamp. */}
      <div
        className="absolute inset-0 rounded-full border-[3px]"
        style={{ borderColor: accent, filter: "url(#ink-rough)" }}
      />
      <div
        className="absolute inset-[10px] rounded-full border-[1.5px]"
        style={{ borderColor: accent, filter: "url(#ink-rough)" }}
      />

      {/* Inner content */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center ${s.padding}`}
        style={{ filter: "url(#ink-bleed)" }}
      >
        <div className={`font-mono ${s.verdict} uppercase tracking-stamped text-bone-50 font-bold`}>
          verdict
        </div>
        <div
          className={`font-display ${s.score} font-bold text-bone-50 leading-none my-1`}
          style={{ fontVariationSettings: "'wght' 800, 'opsz' 144, 'SOFT' 0" }}
        >
          {score}
        </div>
        <div className={`font-mono ${s.label} uppercase tracking-stamped text-bone-50 font-semibold border-t border-bone-50/60 pt-1`}>
          / 100
        </div>
        <div
          className={`font-mono ${s.label} uppercase tracking-stamped text-bone-50 mt-2 text-center leading-tight`}
          style={{ maxWidth: "85%" }}
        >
          {verdict}
        </div>
      </div>

      {/* Color fill under text — gives the "stamped onto paper" effect. */}
      <div
        className="absolute inset-0 rounded-full mix-blend-multiply opacity-90"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent} 0%, ${accent} 60%, color-mix(in srgb, ${accent} 70%, black) 100%)`,
          filter: "url(#ink-rough)",
        }}
      />

      {/* Ink spots — small imperfections. */}
      <div
        className="absolute h-1 w-1 rounded-full"
        style={{ background: accent, top: "12%", left: "20%", opacity: 0.7 }}
      />
      <div
        className="absolute h-0.5 w-0.5 rounded-full"
        style={{ background: accent, bottom: "18%", right: "16%", opacity: 0.5 }}
      />
      {/* Extra ink splatter */}
      <div
        className="absolute h-0.5 w-0.5 rounded-full"
        style={{ background: accent, top: "22%", right: "10%", opacity: 0.3 }}
      />
    </div>
  );
}