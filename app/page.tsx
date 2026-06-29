"use client";
import { useState } from "react";
import { Hero } from "@/components/Hero";
import { RoastForm } from "@/components/RoastForm";
import { RoastResults } from "@/components/RoastResults";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { SocialProof } from "@/components/SocialProof";
import { FinalCTA } from "@/components/FinalCTA";
import { EmailCapture } from "@/components/EmailCapture";
import type { RoastResult } from "@/lib/types";

export default function HomePage() {
  const [result, setResult] = useState<RoastResult | null>(null);
  const [source, setSource] = useState<"llm" | "rules">("rules");

  return (
    <>
      <Hero />
      <RoastForm
        onResult={(r, s) => {
          setResult(r);
          if (s) setSource(s);
        }}
      />

      {result ? (
        <div className="document">
          <div className="double-rule h-1 mt-8 mb-8" />
          <RoastResults result={result} source={source} />
          <EmailCapture score={result.score} trigger={true} />
        </div>
      ) : (
        <>
          <SocialProof />
          <Features />
          <HowItWorks />
          <FinalCTA />
        </>
      )}
    </>
  );
}
