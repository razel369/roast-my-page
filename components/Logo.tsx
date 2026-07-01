"use client";

interface Props {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "monochrome" | "inverse";
  showWordmark?: boolean;
}

export function Logo({ size = "md", variant = "default", showWordmark = true }: Props) {
  const dims = size === "sm" ? { mark: 24, font: 16 } : size === "lg" ? { mark: 44, font: 32 } : { mark: 32, font: 22 };
  const accent = variant === "monochrome" ? "currentColor" : variant === "inverse" ? "#E8E5DE" : "#C8321C";

  return (
    <span className="inline-flex items-center gap-2">
      <svg
        width={dims.mark}
        height={dims.mark}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        {/* Outer ring — verification seal */}
        <circle cx="16" cy="16" r="15" stroke={accent} strokeWidth="1.5" />
        {/* Flame mark */}
        <path
          d="M16 6 C 12 11, 11 14, 12 17 C 9 17, 8 21, 11 24 C 13 26, 19 26, 21 24 C 24 21, 23 17, 20 17 C 21 14, 20 11, 16 6 Z"
          fill={accent}
        />
        {/* Inner check */}
        <path
          d="M11.5 16.5 L 14.5 19.5 L 20.5 13.5"
          stroke={variant === "monochrome" ? "currentColor" : variant === "inverse" ? "#0F0F0F" : "#E8E5DE"}
          strokeWidth="2"
          strokeLinecap="square"
          fill="none"
        />
      </svg>
      {showWordmark && (
        <span
          className="font-display font-bold leading-none tracking-[-0.025em]"
          style={{ fontSize: `${dims.font}px`, color: variant === "inverse" ? "#E8E5DE" : "var(--ink)" }}
        >
          Croast
        </span>
      )}
    </span>
  );
}