"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// Surfaces a "Pro · Manage" pill + link in the header when the
// rmp_pro_token cookie is present. Purely client-side detection.
export function ProHeaderIndicator() {
  const [pro, setPro] = useState(false);
  useEffect(() => {
    if (typeof document === "undefined") return;
    setPro(/(?:^|;\s*)rmp_pro_token=/.test(document.cookie));
  }, []);

  if (!pro) return null;

  return (
    <span className="hidden items-center gap-2 sm:flex">
      <span className="border border-vermillion bg-vermillion px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-stamped text-bone-50">
        Pro
      </span>
      <Link
        href="/welcome"
        className="font-mono text-[11px] uppercase tracking-stamped text-vermillion transition-colors hover:text-ink-900"
        aria-label="Manage subscription"
      >
        Manage
      </Link>
    </span>
  );
}
