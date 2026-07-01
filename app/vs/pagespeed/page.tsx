import { ComparisonTemplate } from "@/components/ComparisonTemplate";

export const metadata = {
  title: "Croast vs PageSpeed Insights — different problems",
  description:
    "PageSpeed tells you your site is slow. Croast tells you your copy isn't converting. They fix different jobs — here's the honest comparison.",
  keywords: ["PageSpeed alternative", "PageSpeed vs", "conversion audit", "Core Web Vitals"],
};

const comparison = [
  {
    feature: "What it measures",
    other: "Render speed, layout shift, LCP, CLS, TBT — Lighthouse metrics.",
    us: "Headline strength, CTA clarity, social proof, trust signals, objection coverage.",
  },
  {
    feature: "Tells you why nobody is buying",
    other: "No. Performance is rarely the reason.",
    us: "Yes. Each finding cites the specific copy issue and how to fix it.",
  },
  {
    feature: "Time to signal",
    other: "5–10 seconds.",
    us: "~6 seconds.",
  },
  {
    feature: "Output",
    other: "A number from 0–100, plus a performance waterfall.",
    us: "A number from 0–100, plus ranked issues, rewritten hero, action plan.",
  },
  {
    feature: "Audit depth",
    other: "Engineer-friendly: identifies slow JS, render-blocking CSS, oversized images.",
    us: "Marketer-friendly: identifies weak headline, generic CTA, missing trust.",
  },
  {
    feature: "Fix guidance",
    other: '"Defer unused JavaScript. Compress images."',
    us: '"Your headline is too long. Try this rewrite instead."',
  },
  {
    feature: "Cost",
    other: "Free.",
    us: "Free.",
  },
  {
    feature: "Best for",
    other: "Engineers tuning a slow web app or e-commerce store.",
    us: "Founders tuning a new landing page before sending paid traffic.",
  },
];

const faq = [
  {
    q: "Should I fix Core Web Vitals or copy first?",
    a: "Copy first. The fastest page in the world still won't convert if the hero says 'Welcome to our revolutionary next-generation platform'. After copy is tight, then fix performance so the search engines don't punish you.",
  },
  {
    q: "Can I use both?",
    a: "Yes, and you should. PageSpeed catches what your user feels; Croast catches what they decide. They're orthogonal problems.",
  },
  {
    q: "Is Croast a Lighthouse replacement?",
    a: "No. Lighthouse is a developer tool. Croast is a marketing tool. Different stacks, different outputs, different jobs.",
  },
];

export default function VsPageSpeedPage() {
  return (
    <ComparisonTemplate
      competitor="PageSpeed Insights"
      category="Performance vs Conversion"
      intro="PageSpeed Insights tells you whether your page loads fast. It does not — and was never designed to — tell you whether the page actually converts visitors into customers. Croast is the missing second half."
      verdict="PageSpeed makes your page fast. Croast makes your page sell. They fix different problems. Run both, in that order."
      comparison={comparison}
      faq={faq}
    />
  );
}
