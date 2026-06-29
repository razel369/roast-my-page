import { ComparisonTemplate } from "@/components/ComparisonTemplate";

export const metadata = {
  title: "Roast My Page vs Hotjar — same page, different answers",
  description:
    "Hotjar shows you where users click. Roast My Page tells you why your copy isn't converting. Honest comparison of two tools that solve different jobs.",
  keywords: ["Hotjar alternative", "Hotjar vs", "landing page audit", "heatmaps", "conversion audit"],
};

const comparison = [
  {
    feature: "What it tells you",
    other: "Heatmaps of where people click, scroll, or rage-click.",
    us: "Specific copy issues ranked by severity, each with a fix.",
  },
  {
    feature: "Time to first signal",
    other: "Days to weeks, while you collect enough sessions to be statistically meaningful.",
    us: "~6 seconds from URL paste to verdict.",
  },
  {
    feature: "Required traffic",
    other: "1,000+ sessions/mo before heatmaps reveal anything useful.",
    us: "Zero. Even day-one landing pages work.",
  },
  {
    feature: "Output",
    other: "Heatmap snapshots that need a human to interpret.",
    us: "A 0–100 score, ranked issues, a rewritten hero, a one-hour plan.",
  },
  {
    feature: "Cost (free tier)",
    other: "100 sessions/mo, capped at 3 heatmaps.",
    us: "Unlimited. No accounts, no paywalls, no demos.",
  },
  {
    feature: "Reads your copy",
    other: "No.",
    us: "Yes — headline, CTAs, trust signals, objection coverage, FAQ.",
  },
  {
    feature: "Privacy / data",
    other: "Records real users. Requires consent banner.",
    us: "Fetches the HTML, returns a verdict. Records nothing about real users.",
  },
  {
    feature: "Best for",
    other: "Optimizing an existing page that already has traffic.",
    us: "Catching copy issues on a page before you send a single visitor.",
  },
];

const faq = [
  {
    q: "Do they overlap at all?",
    a: "Almost not. Heatmaps show you that 70% of users never reach the testimonial section. Roast My Page tells you the testimonial section is buried below a 600-word hero. Different jobs, run them both.",
  },
  {
    q: "Which should I install first?",
    a: "Roast My Page, on day one. Fix the obvious copy issues before paying for traffic you intend to record. Then install Hotjar once you have enough volume.",
  },
  {
    q: "Does Roast My Page replace Hotjar?",
    a: "No, and we don't want it to. Use Hotjar once you have traffic. Use us to decide what the page should say in the first place.",
  },
];

export default function VsHotjarPage() {
  return (
    <ComparisonTemplate
      competitor="Hotjar"
      category="Analytics vs Audit"
      intro="Hotjar is a behavior analytics tool. It shows you what users do on a page that's already live. Roast My Page is a copy and structure audit — it tells you what's wrong with the page before you have any users. They answer different questions. Here is the honest comparison."
      verdict="Different jobs. Use Hotjar to record 1,000 sessions of real users and watch them fail. Use Roast My Page on day one so fewer of them fail in the first place."
      comparison={comparison}
      faq={faq}
    />
  );
}
