// JSON-LD structured data: WebApplication + FAQPage + BreadcrumbList.
// Helps Google show rich results for "landing page audit tool" queries.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://roastmypage.com";

const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Roast My Page",
  url: SITE_URL,
  description:
    "Free AI-powered landing page audit. Paste a URL, get a brutal verdict on what's killing your conversion in 60 seconds.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Conversion score (0–100)",
    "Conversion killer finder (severity, evidence, fix)",
    "Hero rewrite suggestions",
    "Trust signal analysis",
    "Objection coverage map",
    "One-hour action plan",
  ],
};

const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Roast My Page really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. No signup, no credit card. Each audit takes ~6 seconds and uses both a hand-tuned rule engine and an optional AI layer.",
      },
    },
    {
      "@type": "Question",
      name: "What does it check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Headline strength, CTA copy and count, social proof, risk-reversal, specificity, word count, meta description, FAQ presence, pricing visibility, trust signals, and objection coverage.",
      },
    },
    {
      "@type": "Question",
      name: "Do you store my URL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No server-side storage. Shareable roast links are encoded directly into the URL — the recipient can decode them client-side.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the score?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The score is rule-derived, not predictive. It's a directional audit, not an A/B test. Use it to find issues, then run your own experiments.",
      },
    },
  ],
};

const org = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Roast My Page",
  url: SITE_URL,
};

export function WebAppSchema() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
    </>
  );
}
