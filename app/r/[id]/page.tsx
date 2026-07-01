"use client";
import { useEffect, useState } from "react";
import { readRoastFromPath } from "@/lib/share";
import { RoastResults } from "@/components/RoastResults";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { ResultTLDR } from "@/components/ResultTLDR";
import { MultiPageResults } from "@/components/MultiPageResults";
import "../../print.css";
import type { RoastResult, MultiPageRoast } from "@/lib/types";

export default function RoastView({ params }: { params: { id: string } }) {
  const { id } = params;
  const [result, setResult] = useState<RoastResult | MultiPageRoast | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const r = readRoastFromPath(id);
    if (r) {
      setResult(r);
      if (typeof document !== "undefined") {
        const score = "siteScore" in r ? r.siteScore : r.score;
        const verdict = "siteVerdictLabel" in r ? r.siteVerdictLabel : r.verdictLabel;
        document.title = `Croast of ${r.domain}: ${score}/100 (${verdict}) -- Croast`;
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
        <p className="mt-2 font-body text-ink-700">Generate a fresh one — it only takes 60 seconds.</p>
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

  const isMulti = "pages" in result && "siteScore" in result;
  const score = isMulti ? (result as MultiPageRoast).siteScore : (result as RoastResult).score;

  return (
    <div className="pt-8">
      {isMulti ? (
        <MultiPageResults result={result as MultiPageRoast} />
      ) : (
        <>
          <ResultTLDR result={result as RoastResult} />
          <RoastResults result={result as RoastResult} />
        </>
      )}
      <div className="document pb-12 no-print">
        <FeedbackWidget
          verdictId={result.id}
          domain={result.domain}
          score={score}
          source="share_view"
        />
      </div>
    </div>
  );
}