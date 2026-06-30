"use client";
import { useCallback, useState } from "react";
import { Hero } from "@/components/Hero";
import { RoastForm } from "@/components/RoastForm";
import { RoastResults } from "@/components/RoastResults";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { SocialProof } from "@/components/SocialProof";
import { FinalCTA } from "@/components/FinalCTA";
import { EmailCapture } from "@/components/EmailCapture";
import { FaqSection, FAQ_ITEMS } from "@/components/FaqSection";
import { ComparisonStrip } from "@/components/ComparisonStrip";
import { Onboarding } from "@/components/Onboarding";
import { TierBadge } from "@/components/TierBadge";
import { ProFeaturesTeaser } from "@/components/ProFeaturesTeaser";
import { RoastLoader } from "@/components/RoastLoader";
import type { RoastResult } from "@/lib/types";

export default function HomePage() {
  const [result, setResult] = useState<RoastResult | null>(null);
  const [source, setSource] = useState<"llm" | "rules">("rules");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLoadingChange = useCallback((v: boolean) => setLoading(v), []);
  const onErrorChange = useCallback((e: string | null) => setError(e), []);

  return (
    <>
      <Hero />
      <RoastForm
        onResult={(r, s) => {
          setResult(r);
          if (s) setSource(s);
        }}
        onLoadingChange={onLoadingChange}
        onErrorChange={onErrorChange}
      />

      {loading && !result && (
        <RoastLoader loading={loading} result={null} error={null} />
      )}

      {result ? (
        <div className="document">
          <div className="double-rule h-1 mt-8 mb-8" />
          <TierBadge plan="free" />
          <RoastResults result={result} source={source} />
          <EmailCapture score={result.score} trigger={true} />
          <ProFeaturesTeaser />
          <ComparisonStrip />
          <FaqSection items={FAQ_ITEMS} />
        </div>
      ) : (
        <>
          <SocialProof />
          <Features />
          <HowItWorks />
          <FinalCTA />
          <ProFeaturesTeaser />
          <ComparisonStrip />
          <FaqSection items={FAQ_ITEMS} />
          <Onboarding />
        </>
      )}
    </>
  );
}
