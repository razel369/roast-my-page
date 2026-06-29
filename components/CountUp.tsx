"use client";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  durationMs?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export function CountUp({ value, durationMs = 1100, className, style, ariaLabel }: Props) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }
    startRef.current = null;
    const tick = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs]);

  return (
    <span className={className} style={style} aria-label={ariaLabel ?? `${value}`}>
      {display}
    </span>
  );
}
