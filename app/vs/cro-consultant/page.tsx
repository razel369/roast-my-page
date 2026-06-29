import { ComparisonTemplate } from "@/components/ComparisonTemplate";

export const metadata = {
  title: "Roast My Page vs a $10K CRO consultant — same verdict, different bill",
  description:
    "Hiring a CRO consultant costs $5,000–$15,000 and takes two weeks. Roast My Page delivers the same five insights in 60 seconds. Honest comparison.",
  keywords: ["CRO consultant alternative", "free conversion audit", "landing page consultant"],
};

const comparison = [
  {
    feature: "Cost",
    other: "$5,000 – $15,000 per engagement.",
    us: "$0.",
  },
  {
    feature: "Turnaround",
    other: "2 weeks of email back-and-forth, three Zoom calls, a 40-page PDF.",
    us: "~60 seconds. One URL in, one verdict out.",
  },
  {
    feature: "Deliverable",
    other: "A long PDF with a heatmap, a prioritized backlog, and a research summary.",
    us: "A 0–100 score, 5 specific issues with fixes, a rewritten hero, a one-hour plan, and a shareable verdict link.",
  },
  {
    feature: "Iteration loop",
    other: "Pay again to re-run after each round of changes.",
    us: "Re-run unlimited times. Free, forever.",
  },
  {
    feature: "Expertise",
    other: "Senior practitioner, but with the bias of their prior playbook.",
    us: "Hand-tuned rules + optional LLM, calibrated against the patterns of high-converting pages.",
  },
  {
    feature: "Catches the obvious",
    other: "Usually — but you'll have paid $10K by the time they say 'your CTA is weak'.",
    us: "Always — it's the first thing we look at.",
  },
  {
    feature: "Catches the subtle",
    other: "Yes — that's where the price comes from.",
    us: "Closer. We catch structural patterns. Nuance lives in human review.",
  },
  {
    feature: "Best for",
    other: "Mid-market companies with $50k+ ad spend, where a 2% conversion lift pays for the engagement in a week.",
    us: "Early-stage teams who can't yet justify a $10K retainer but still need to ship a landing page.",
  },
];

const faq = [
  {
    q: "So I should never hire a CRO consultant?",
    a: "When you have the budget and the volume, yes — a real human catches cultural nuance and runs experiments we can't. Before that, run a free audit, ship the obvious fixes, then decide.",
  },
  {
    q: "What does Roast My Page miss that a consultant catches?",
    a: "Brand voice calibration, qualitative audience research, and the ability to run a live multivariate test on your behalf. Anything requiring a researcher is on them.",
  },
  {
    q: "Why free?",
    a: "Because the fifty insights every landing page needs are well-trodden patterns. Automating them is straightforward. The interesting work — what the page should actually say for your market — is what your consultant is really paid for.",
  },
];

export default function VsConsultantPage() {
  return (
    <ComparisonTemplate
      competitor="a CRO consultant"
      category="Free tool vs $10K engagement"
      intro="A senior conversion-rate optimization consultant charges $5,000–$15,000 and delivers the same five insights you would get from running a free audit. Sometimes with extra nuance. Mostly without."
      verdict="Use Roast My Page to find the structural issues today. Hire a human CRO consultant when your ad spend is large enough that a 2% lift pays for them in a week. That's the break-even."
      comparison={comparison}
      faq={faq}
    />
  );
}
