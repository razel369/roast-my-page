"use client";
import { useEffect, useState } from "react";
import { readRoastFromPath } from "@/lib/share";
import { RoastResults } from "@/components/RoastResults";
import type { RoastResult } from "@/lib/types";

export default function RoastView({ params }: { params: { id: string } }) {
  const { id } = params;
  const [result, setResult] = useState<RoastResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const r = readRoastFromPath(id);
    if (r) {
      setResult(r);
      if (typeof document !== "undefined") {
        document.title = `Roast of ${r.domain}: ${r.score}/100 (${r.verdictLabel}) — Roast My Page`;
      }
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="container-narrow py-24 text-center">
        <div className="text-5xl">🔥</div>
        <h1 className="mt-4 text-2xl font-bold">That roast link is broken or expired.</h1>
        <p className="mt-2 text-ink-400">Generate a fresh one — it only takes 60 seconds.</p>
        <a href="/" className="btn-primary mt-6 inline-flex">Roast a page</a>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container-narrow py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-ember-500 border-t-transparent" />
        <p className="mt-3 text-sm text-ink-400">Decoding roast…</p>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <RoastResults result={result} />
    </div>
  );
}