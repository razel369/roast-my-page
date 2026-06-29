// Categorization of conversion killers.
// Each category maps to a visual style + a list of substring patterns
// matched against the killer title. Order matters: first match wins.

export type Category =
  | "headline"
  | "cta"
  | "social-proof"
  | "trust"
  | "specificity"
  | "depth"
  | "seo"
  | "faq"
  | "pricing";

export const CATEGORY_META: Record<
  Category,
  { label: string; roman: string; desc: string; icon: string }
> = {
  headline: {
    label: "Headline",
    roman: "I",
    desc: "Hero copy and primary promise",
    icon: "H1",
  },
  cta: {
    label: "Call to Action",
    roman: "II",
    desc: "Buttons and conversion triggers",
    icon: "→",
  },
  "social-proof": {
    label: "Social Proof",
    roman: "III",
    desc: "Testimonials, logos, customers",
    icon: "★",
  },
  trust: {
    label: "Trust & Risk",
    roman: "IV",
    desc: "Guarantees, refunds, security",
    icon: "§",
  },
  specificity: {
    label: "Specificity",
    roman: "V",
    desc: "Concrete numbers and claims",
    icon: "#",
  },
  depth: {
    label: "Page Depth",
    roman: "VI",
    desc: "Word count and content depth",
    icon: "¶",
  },
  seo: {
    label: "SEO & Meta",
    roman: "VII",
    desc: "Search snippet and meta",
    icon: "M",
  },
  faq: {
    label: "FAQ & Objections",
    roman: "VIII",
    desc: "Late-funnel objection handling",
    icon: "?",
  },
  pricing: {
    label: "Pricing",
    roman: "IX",
    desc: "Price transparency",
    icon: "$",
  },
};

interface Pattern {
  category: Category;
  patterns: RegExp[];
}

const RULES: Pattern[] = [
  { category: "headline", patterns: [/h1/i, /headline/i] },
  { category: "cta", patterns: [/cta/i, /call to action/i, /buttons?/i] },
  { category: "social-proof", patterns: [/social proof/i] },
  { category: "trust", patterns: [/risk reversal/i, /guarantee/i, /trust/i] },
  { category: "specificity", patterns: [/numbers/i, /specific/i, /unspecific/i, /vague/i] },
  { category: "depth", patterns: [/too thin/i, /page depth/i, /word count/i] },
  { category: "seo", patterns: [/meta description/i, /seo/i, /meta/i] },
  { category: "faq", patterns: [/faq/i, /objection/i] },
  { category: "pricing", patterns: [/pricing/i] },
];

export function categorizeKiller(title: string): Category {
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(title))) return rule.category;
  }
  return "depth";
}

export function categorizeKillers<T extends { title: string }>(killers: T[]): Map<Category, T[]> {
  const out = new Map<Category, T[]>();
  for (const k of killers) {
    const cat = categorizeKiller(k.title);
    const list = out.get(cat) ?? [];
    list.push(k);
    out.set(cat, list);
  }
  return out;
}

// All categories, ordered by their Roman-numeral index.
export const CATEGORY_ORDER: Category[] = [
  "headline",
  "cta",
  "social-proof",
  "trust",
  "specificity",
  "depth",
  "seo",
  "faq",
  "pricing",
];

export type CategoryStatus = "clean" | "warning" | "critical";

export function statusForCategory<T extends { severity: "critical" | "high" | "medium" }>(
  killers: T[] | undefined,
): CategoryStatus {
  if (!killers || killers.length === 0) return "clean";
  if (killers.some((k) => k.severity === "critical")) return "critical";
  return "warning";
}

export const STATUS_COLOR: Record<CategoryStatus, { dot: string; bar: string; text: string }> = {
  clean: { dot: "#2A4D2A", bar: "#2A4D2A", text: "#2A4D2A" },
  warning: { dot: "#D62828", bar: "#D62828", text: "#D62828" },
  critical: { dot: "#C8321C", bar: "#C8321C", text: "#C8321C" },
};

export const STATUS_LABEL: Record<CategoryStatus, string> = {
  clean: "Clean",
  warning: "Warning",
  critical: "Critical",
};
