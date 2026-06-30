import type { ParsedPage } from "./types";

// Pre-baked demo pages so visitors see the magic without supplying a URL.
// Each is hand-crafted to demonstrate a different score band and pattern.
export interface DemoSeed {
  label: string;
  description: string;
  band: "killer" | "needs-work" | "solid" | "strong";
  page: ParsedPage;
}

export const DEMO_SEEDS: DemoSeed[] = [
  {
    label: "Generic SaaS",
    band: "killer",
    description: "Welcome-page syndrome â€” vague copy, weak CTAs, no proof.",
    page: {
      url: "https://demo.example.com",
      domain: "demo.example.com",
      title: "Welcome to Acme â€” The Best Solution",
      metaDescription: "",
      h1: "Welcome to Acme â€” The Best All-in-One Solution for Everyone",
      h2s: ["Features", "About"],
      bodyText:
        "Our revolutionary platform is the next-generation solution that helps businesses unlock their full potential. " +
        "We empower teams to leverage cutting-edge technology to achieve world-class results. " +
        "Click here to learn more. Submit a request and our team will be in touch.",
      ctaButtons: ["Learn more", "Click here", "Submit"],
      wordCount: 65,
      hasNumbers: false,
      hasTestimonials: false,
      hasLogos: false,
      hasGuarantee: false,
      imageCount: 0,
      hasPricing: false,
      hasFAQ: false,
    },
  },
  {
    label: "Indie hacker (decent)",
    band: "needs-work",
    description: "Real numbers and a real CTA â€” but thin on trust.",
    page: {
      url: "https://indie.example.com",
      domain: "indie.example.com",
      title: "Starter â€” Ship faster",
      metaDescription: "Starter helps indie hackers launch landing pages in 60 seconds.",
      h1: "Ship your landing page in 60 seconds",
      h2s: ["Why Starter", "Pricing"],
      bodyText:
        "Starter is the fastest way for indie hackers to launch landing pages. " +
        "Start your free trial. Get started in 60 seconds. No credit card required. " +
        "Pricing starts at $9 per month. Cancel anytime. Free trial for 14 days.",
      ctaButtons: ["Start free trial", "Get started", "See pricing"],
      wordCount: 80,
      hasNumbers: true,
      hasTestimonials: false,
      hasLogos: false,
      hasGuarantee: true,
      imageCount: 2,
      hasPricing: true,
      hasFAQ: false,
    },
  },
  {
    label: "B2B SaaS (solid)",
    band: "solid",
    description: "Specific, structured, and trust-heavy. Just needs polish.",
    page: {
      url: "https://b2b.example.com",
      domain: "b2b.example.com",
      title: "Pipeline â€” Revenue intelligence for B2B teams",
      metaDescription: "Pipeline tells you which deals will close this quarter â€” and which won't. ",
      h1: "Know which deals will close â€” 30 days before your forecast meeting.",
      h2s: ["How Pipeline works", "Customers", "Pricing", "FAQ", "Get a demo"],
      bodyText:
        "Pipeline pulls data from your CRM, email, and call tools to score every deal in real time. " +
        "Built specifically for B2B sales teams running weekly pipeline reviews. " +
        "Sales leaders using Pipeline report tighter forecasts and shorter weekly pipeline reviews. " +
        "SOC 2 Type II certified. GDPR compliant. Get a free 14-day trial â€” no credit card required. " +
        "Pricing starts at $49 per user per month. Cancel anytime. " +
        "Frequently asked questions: How is this different from Clari? Can I import historical deals? " +
        "Is my data secure? Do you support Salesforce and HubSpot? How long does onboarding take? " +
        "What if I want to export everything? Talk to sales to see Pipeline in your data.",
      ctaButtons: ["Get a free demo", "Start free trial", "See pricing", "Talk to sales"],
      wordCount: 180,
      hasNumbers: true,
      hasTestimonials: true,
      hasLogos: true,
      hasGuarantee: true,
      imageCount: 6,
      hasPricing: true,
      hasFAQ: true,
    },
  },
];
