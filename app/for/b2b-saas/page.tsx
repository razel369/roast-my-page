import type { Metadata } from "next";
import { IndustryLanding } from "../_IndustryLanding";

export const metadata: Metadata = {
  title: "Croast for B2B SaaS — landing page audit built for software teams",
  description:
    "The conversion audit built for B2B SaaS landing pages. Catches the issues that kill trial signups: weak headline, generic CTAs, missing social proof, hidden pricing. Free, 60 seconds.",
};

const FEATURES = [
  {
    num: "01",
    title: "Your headline has to name the buyer, the outcome, and the timeframe",
    body: "B2B buyers are looking for a tool that does a specific job for a specific person. A vague hero (\"The future of work\") reads like a brochure. Croast flags headlines that fail the (audience) + (outcome) + (timeframe) test, and suggests three replacements grounded in your real product.",
  },
  {
    num: "02",
    title: "Your CTA should ask for the lowest-commitment step",
    body: "\"Get started\" loses to \"Start free trial — no card\" because the first removes friction. Croast detects weak CTAs and recommends the lowest-friction entry point for B2B (trial, demo, contact) — not a contract.",
  },
  {
    num: "03",
    title: "Social proof should be named, not anonymous",
    body: "Three named customers with logos > ten anonymous testimonials. B2B buyers check who trusts you before they talk to sales. Croast flags anonymous or missing proof and suggests where to add it.",
  },
  {
    num: "04",
    title: "Hide nothing about pricing",
    body: "B2B buyers bounce on hidden pricing. Croast flags missing or vague pricing and suggests the minimum disclosure that keeps them on the page.",
  },
];

const FAQS = [
  {
    q: "Is this just a PageSpeed alternative?",
    a: "No. PageSpeed measures load time. Croast measures whether your copy converts. Speed matters, but the bigger wins are usually in the headline, CTA, and trust signals.",
  },
  {
    q: "How is this different from Hotjar?",
    a: "Hotjar shows you behavioral data — heatmaps, session recordings. Croast tells you what to fix. Use Hotjar to find the bottleneck, then use Croast to fix the underlying copy.",
  },
  {
    q: "What about Pro?",
    a: "Pro adds AI-enriched critique (qualitative, not just rule-based) and visual layout review. $19/mo. Cancel anytime.",
  },
  {
    q: "Can I audit a page that requires login?",
    a: "No — Croast only reads public pages. For logged-in flows, run the audit on your marketing site and your public docs.",
  },
];

export default function B2BSaaSPage() {
  return (
    <IndustryLanding
      industry="B2B SaaS"
      hero="A landing page audit built for software teams."
      intro="Most B2B SaaS landing pages leak trials because of weak headlines, generic CTAs, or missing social proof. Croast catches all three in 60 seconds — for free."
      features={FEATURES}
      faqs={FAQS}
    />
  );
}