// Industry detection: classify a page based on its content, then return
// copy that's specific to that industry.

export type Industry =
  | "b2b-saas"
  | "ecommerce"
  | "creator"
  | "agency"
  | "fintech"
  | "media"
  | "unknown";

interface Signal {
  industry: Industry;
  patterns: RegExp[];
  weight: number;
}

const SIGNALS: Signal[] = [
  // B2B SaaS
  { industry: "b2b-saas", patterns: [/\b(API|SDK|integrations?|platform)\b/i, /\b(workflow|automation|productivity)\b/i, /\b[Ss][Aa][Aa][Ss]\b/, /\b[Bb]2[Bb]\b/, /\bCRM\b/, /\bSaaS\b/], weight: 3 },
  { industry: "b2b-saas", patterns: [/\b(sign up|free trial|book a demo|get started)\b/i, /\b(team|teams|enterprise|startup|company)\b/i, /\b(slack|notion|salesforce|hubspot|linear)\b/i], weight: 1 },
  // Ecommerce
  { industry: "ecommerce", patterns: [/\b(add to cart|free shipping|cart|checkout|shop now)\b/i, /\b(price|buy now|order|sale|discount)\b/i, /\$\s?\d+/, /\bshop\b/i], weight: 4 },
  { industry: "ecommerce", patterns: [/\b(shipping|returns?|warranty|sizing|sizing chart)\b/i], weight: 2 },
  // Creator / newsletter
  { industry: "creator", patterns: [/\b(newsletter|subscribe to my|subscribe to the)\b/i, /\b(my latest|my best|weekly|monthly)\b/i, /\b(essay|writing|creator|substack)\b/i], weight: 4 },
  // Agency
  { industry: "agency", patterns: [/\b(our work|our clients?|our portfolio|our team|our approach|our services)\b/i, /\b(case stud(?:y|ies))\b/i, /\b(client|customer) stories\b/i], weight: 5 },
  // Fintech / payments
  { industry: "fintech", patterns: [/\b(transfer|wire|invest|portfolio|trading|brokerage)\b/i, /\b(banking|bank|credit card|debit)\b/i, /\bSEC|FINRA|CFPB/i], weight: 5 },
  // Media / news
  { industry: "media", patterns: [/\b(subscribe|newsletter|articles?\b|opinion|reported)\b/i, /\b(newsroom|press|journalists)\b/i, /\bNYT|WaPo|Bloomberg|Reuters\b/], weight: 4 },
];

const CTA_PATTERNS: Record<Industry, RegExp[]> = {
  "b2b-saas": [/\b(start free trial|book a demo|get started free|sign up free)\b/i, /\b(talk to sales|contact sales)\b/i],
  "ecommerce": [/\b(add to cart|shop now|buy now|order now)\b/i, /\b(checkout|view cart)\b/i],
  "creator": [/\b(subscribe|join \w[\w\s]{0,30}list)\b/i, /\b(read|read more|continue reading)\b/i],
  "agency": [/\b(see our work|view case stud|book a call|book a consult)\b/i, /\b(start a project|hire us)\b/i],
  "fintech": [/\b(open an account|start investing|get approved|apply now)\b/i, /\b(check rate|compare)\b/i],
  "media": [/\b(subscribe|read article|read more)\b/i, /\b(share|newsletter)\b/i],
  "unknown": [],
};

const INDUSTRY_LABEL: Record<Industry, string> = {
  "b2b-saas": "B2B SaaS",
  "ecommerce": "E-commerce",
  "creator": "Creator / Newsletter",
  "agency": "Agency",
  "fintech": "Fintech",
  "media": "Media",
  "unknown": "General",
};

export function detectIndustry(parsed: { title: string; h1: string; bodyText: string; ctaButtons: string[]; metaDescription: string }): Industry {
  const haystack = `${parsed.title} ${parsed.h1} ${parsed.bodyText} ${parsed.ctaButtons.join(" ")} ${parsed.metaDescription}`.slice(0, 4000);
  const scores: Record<Industry, number> = {
    "b2b-saas": 0,
    "ecommerce": 0,
    "creator": 0,
    "agency": 0,
    "fintech": 0,
    "media": 0,
    "unknown": 0,
  };
  for (const sig of SIGNALS) {
    let hits = 0;
    for (const pat of sig.patterns) {
      if (pat.test(haystack)) hits++;
    }
    if (hits > 0) scores[sig.industry] += hits * sig.weight;
  }
  // Pick the max
  let max: Industry = "unknown";
  let maxVal = 0;
  for (const [ind, sc] of Object.entries(scores) as [Industry, number][]) {
    if (sc > maxVal) {
      maxVal = sc;
      max = ind;
    }
  }
  return maxVal >= 3 ? max : "unknown";
}

export function industryLabel(i: Industry): string {
  return INDUSTRY_LABEL[i];
}

// Industry-specific advice strings: returned when a relevant killer fires
// for that page. Helps the report feel specific, not generic.
const INDUSTRY_TIPS: Record<Industry, Partial<Record<string, string>>> = {
  "b2b-saas": {
    trust:
      "B2B buyers check reference customers before talking to sales. Three named logos outperform ten anonymous testimonials.",
    pricing:
      "Hide nothing. Pricing friction in B2B is rarely the number; it is the unanswered question that follows.",
    cta:
      "Your single CTA should ask for the lowest-commitment entry point — trial, demo, or contact — not for a contract.",
  },
  "ecommerce": {
    trust:
      "Show return policy, shipping cost, and delivery date in the first scroll. Buyers who cannot find these abandon.",
    pricing:
      "Anchor the highest option in the middle. People pick the option one tier above the cheapest.",
    cta:
      "Multiple CTAs split attention. Pick one and put your brand color on it.",
  },
  "creator": {
    trust:
      "Your name is the brand. Use it on every page. Avoid stock photography in favor of your face.",
    pricing:
      "Annual plans convert at 2-3x monthly if you can afford the discount. The default should be annual.",
    cta:
      "Subscribe is the right verb, not Sign Up. One word, lower friction.",
  },
  "agency": {
    trust:
      "Show three named client results. Generic ‘we work with great brands’ copy fails on agency pages.",
    pricing:
      "Three-tier pricing only. Two confuses, four paralyzes.",
    cta:
      "Replace ‘Contact us’ with ‘Book a 15-minute scoping call.’ Specificity converts.",
  },
  "fintech": {
    trust:
      "Fintech visitors need three things in the first scroll: who you are, what regulators oversee you, and a path to look at the product without signing up.",
    pricing:
      "Show fees. Hiding pricing in fintech is a top-three reason for abandonment.",
    cta:
      "Replace ‘Get started’ with the action (‘Open account,’ ‘Apply,’ ‘Get card’).",
  },
  "media": {
    trust:
      "Bylines and dates beat design. Readers stay where they trust the writer.",
    pricing:
      "Subscription tiers must differ in value, not access. People pay for higher quality or exclusivity.",
    cta:
      "Subscribe is for paying. ‘Sign up for the newsletter’ is for free. Pick one and be clear.",
  },
  "unknown": {},
};

export function industryTip(industry: Industry, category: string): string | null {
  return INDUSTRY_TIPS[industry][category] ?? null;
}

// Detect whether the page's CTA matches industry expectations.
export function ctaAlignmentNote(industry: Industry, ctaText: string): string | null {
  const patterns = CTA_PATTERNS[industry];
  for (const p of patterns) {
    if (p.test(ctaText)) return null; // matches expectations
  }
  if (industry === "unknown") return null;
  return `For ${INDUSTRY_LABEL[industry]} pages, your CTA "${ctaText}" is unconventional. Industry-standard verbs convert better.`;
}