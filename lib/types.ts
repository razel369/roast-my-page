export type Severity = "critical" | "high" | "medium";
export type Verdict = "conversion-killer" | "needs-work" | "decent" | "strong";

export interface Killer {
  title: string;
  severity: Severity;
  evidence: string;
  fix: string;
}

export interface TrustAnalysis {
  score: number; // 0-100
  signals: string[];
  missing: string[];
}

export interface ObjectionMap {
  handled: string[];
  missing: string[];
}

export interface VisualCritique {
  enabled: boolean;
  desktopNotes: string[];
  mobileNotes: string[];
  layoutIssues: string[];
  aboveTheFold: string;
  visualHierarchy: string;
}

export interface HeroRewrite {
  headline: string;
  subhead: string;
  cta: string;
  rationale: string;
}

export interface ParsedPage {
  url: string;
  domain: string;
  title: string;
  metaDescription: string;
  h1: string;
  h2s: string[];
  bodyText: string;
  ctaButtons: string[];
  wordCount: number;
  hasNumbers: boolean;
  hasTestimonials: boolean;
  hasLogos: boolean;
  hasGuarantee: boolean;
  imageCount: number;
  hasPricing: boolean;
  hasFAQ: boolean;
  // Fetch diagnostics
  jsRendered?: boolean;
  fetchWarning?: string;
}

export interface RoastResult {
  id: string;
  url: string;
  domain: string;
  originalH1?: string;
  originalMetaDescription?: string;
  timestamp: number;
  score: number; // 0-100
  verdict: Verdict;
  verdictLabel: string;
  verdictBlurb: string;
  summary: string;
  killers: Killer[];
  quickWins: string[];
  heroRewrite: HeroRewrite;
  trustAnalysis: TrustAnalysis;
  objectionMap: ObjectionMap;
  oneHourPlan: string[];
  visualCritique?: VisualCritique;
  metrics: {
    headlineWords: number;
    ctaCount: number;
    wordCount: number;
    trustScore: number;
    powerWordCount: number;
  };
}

export interface MultiPageRoast {
  id: string;
  domain: string;
  timestamp: number;
  siteScore: number;
  siteVerdict: Verdict;
  siteVerdictLabel: string;
  pages: RoastResult[];
  flow: FlowAnalysis;
  crossPageRecommendations: string[];
}

export interface FlowAnalysis {
  funnelCoherent: boolean;       // does each page lead to the next logically?
  ctaConsistency: number;        // 0-100, how aligned CTAs are across pages
  messageConsistency: number;    // 0-100, how aligned value props are across pages
  weakestPage: string | null;    // URL of worst-scoring page
  strongestPage: string | null;  // URL of best-scoring page
  notes: string[];               // human-readable flow observations
}