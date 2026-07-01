"use client";
import { useEffect, useState } from "react";
import { readRoastFromPath } from "@/lib/share";
import { RoastResults } from "@/components/RoastResults";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { ResultTLDR } from "@/components/ResultTLDR";
import type { RoastResult } from "@/lib/types";
import "../../print.css";

export default function RoastView({ params }: { params: { id: string } }) {
  const { id } = params;
  const [result, setResult] = useState<RoastResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const r = readRoastFromPath(id);
    if (r) {
      setResult(r);
      if (typeof document !== "undefined") {
        document.title = `Roast of ${r.domain}: ${r.score}/100 (${r.verdictLabel}) -- Croast`;
      }
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="document py-24 text-center">
        <div className="text-5xl">🔥</div>
        <h1 className="mt-4 display text-3xl text-ink-900">That roast link is broken or expired.</h1>
        <p className="mt-2 font-body text-ink-700">Generate a fresh one -- it only takes 60 seconds.</p>
        <a href="/" className="btn-stamp mt-6 inline-flex">Roast a page</a>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="document py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-vermillion border-t-transparent" />
        <p className="mt-3 font-mono text-xs uppercase tracking-stamped text-ink-500">Decoding roast…</p>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <ResultTLDR result={result} />
      <RoastResults result={result} />
      <div className="document pb-12 no-print">
        <FeedbackWidget
          verdictId={result.id}
          domain={result.domain}
          score={result.score}
          source="share_view"
        />
      </div>
    </div>
  );
}