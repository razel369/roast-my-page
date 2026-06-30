import type { ParsedPage, RoastResult, Killer, Verdict } from "./types";

const POWER_WORDS = [
  "free", "instantly", "proven", "guaranteed", "effortless", "unlock",
  "transform", "boost", "double", "triple", "secret", "exclusive", "save",
  "win", "master", "breakthrough", "elite", "premium", "ultimate", "fastest",
  "smartest", "only", "today", "now", "risk-free", "no-credit-card", "forever",
];

const OBJECTION_KEYWORDS: Record<string, string[]> = {
  "Price": ["free", "free trial", "no credit card", "money-back", "refund", "guarantee", "$", "discount", "starter", "from"],
  "Time to value": ["in minutes", "in seconds", "instantly", "set up in", "5 minutes", "60 seconds", "onboarding", "no setup", "ready in", "fast"],
  "Difficulty": ["easy", "simple", "no code", "drag-and-drop", "beginner", "step-by-step", "tutorial", "guide", "anyone can", "no technical"],
  "Will it work for me": ["for solopreneurs", "for teams", "for freelancers", "for startups", "for agencies", "for creators", "for designers", "industry", "use case", "who it's for"],
  "Trust / safety": ["trusted by", "10,000+", "1000+", "secure", "soc2", "gdpr", "encrypted", "backed by", "featured in", "as seen in", "customers"],
  "Support / help": ["24/7", "support", "help center", "docs", "documentation", "community", "discord", "slack", "live chat", "onboarding"],
  "Switching cost": ["migrate", "import", "switch in", "transfer", "onboard", "no lock-in", "cancel anytime", "free trial"],
};

const VAGUE_HERO_PATTERNS = [
  /welcome to/i,
  /the (best|ultimate|#1|leading)/i,
  /we (help|empower|enable)/i,
  /all-in-one/i,
  /next[- ]generation/i,
  /revolutionary/i,
  /cutting[- ]edge/i,
  /world[- ]class/i,
];

const WEAK_CTA_PATTERNS = [
  /^submit$/i,
  /^click here$/i,
  /^learn more$/i,
  /^read more$/i,
  /^here$/i,
  /^go$/i,
  /^more info$/i,
];

function pickVerdict(score: number): { v: Verdict; label: string; blurb: string } {
  if (score < 40)
    return {
      v: "conversion-killer",
      label: "Conversion Killer",
      blurb: "This page is actively repelling buyers. Every weak signal above the fold is pushing visitors toward your competitors.",
    };
  if (score < 65)
    return {
      v: "needs-work",
      label: "Needs Work",
      blurb: "Decent bones — a few targeted fixes could meaningfully lift your conversion rate from where it sits today.",
    };
  if (score < 82)
    return {
      v: "decent",
      label: "Solid",
      blurb: "Strong foundation. Tighten the weak spots and you'll move into the top tier of pages we score.",
    };
  return {
    v: "strong",
    label: "Strong",
    blurb: "High-converting page. Don't change much — test, don't guess.",
  };
}

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((acc, p) => acc + (p.test(text) ? 1 : 0), 0);
}

function detectTrustSignals(p: ParsedPage): { score: number; signals: string[]; missing: string[] } {
  const signals: string[] = [];
  const missing: string[] = [];
  let score = 30;

  const lower = p.bodyText.toLowerCase();

  if (p.hasNumbers) {
    signals.push("Specific numbers (users, revenue, time saved)");
    score += 12;
  } else {
    missing.push("No quantified credibility numbers anywhere");
  }

  if (p.hasTestimonials) {
    signals.push("Customer testimonials present");
    score += 14;
  } else {
    missing.push("Zero customer testimonials or quotes");
  }

  if (p.hasLogos) {
    signals.push("Customer / press logos visible");
    score += 10;
  } else {
    missing.push("No logo wall — looks like no one famous trusts you");
  }

  if (p.hasGuarantee || /money[- ]back|refund|risk[- ]free|guarantee/i.test(lower)) {
    signals.push("Risk-reversal / guarantee mentioned");
    score += 12;
  } else {
    missing.push("No risk-reversal (no guarantee, refund, or trial)");
  }

  if (/as seen in|featured in|forbes|techcrunch|y combinator/i.test(lower)) {
    signals.push("Press / authority mentions");
    score += 8;
  }

  if (/soc ?2|gdpr|encrypted|secure/i.test(lower)) {
    signals.push("Security / compliance signals");
    score += 6;
  }

  if (/from|users|customers|teams|companies/i.test(lower) && /\d{2,}/.test(lower)) {
    score += 4;
  }

  return { score: Math.min(100, score), signals, missing };
}

function detectObjectionCoverage(p: ParsedPage): { handled: string[]; missing: string[] } {
  const handled: string[] = [];
  const missing: string[] = [];
  const lower = p.bodyText.toLowerCase() + " " + p.h1.toLowerCase() + " " + p.h2s.join(" ").toLowerCase();

  for (const [name, keywords] of Object.entries(OBJECTION_KEYWORDS)) {
    const found = keywords.some((k) => lower.includes(k));
    if (found) handled.push(name);
    else missing.push(name);
  }
  return { handled, missing };
}

function findKillers(p: ParsedPage): Killer[] {
  const killers: Killer[] = [];
  const lower = p.bodyText.toLowerCase();

  // 1. Weak / vague headline
  if (p.h1.length > 0) {
    const vagueHits = countMatches(p.h1, VAGUE_HERO_PATTERNS);
    const h1Words = p.h1.trim().split(/\s+/).length;
    if (vagueHits > 0) {
      killers.push({
        title: "Headline is corporate fluff",
        severity: "critical",
        evidence: `"${p.h1}" — reads like a brochure, not a promise. No buyer would feel seen.`,
        fix: "Rewrite to (1) name the specific person, (2) name the specific outcome, (3) name the timeframe. Example shape: 'Ship [thing] in [time] without [pain].'",
      });
    } else if (h1Words > 14) {
      killers.push({
        title: "Headline is too long to scan",
        severity: "high",
        evidence: `"${p.h1}" — ${h1Words} words. Visitors decide whether to keep reading in seconds (Nielsen Norman Group), and long headlines lose readers before the promise lands.`,
        fix: "Aim for around 8–12 words (a common CRO convention). Move supporting context to the sub-headline, not the headline.",
      });
    } else if (h1Words < 4) {
      killers.push({
        title: "Headline is too short to be specific",
        severity: "high",
        evidence: `"${p.h1}" — ${h1Words} words isn't enough to communicate a real promise. Visitors can't tell what this is for.`,
        fix: "Add the audience or outcome. 'Notes. Fast.' is a tagline. 'Notes for designers who hate Notion.' is a conversion engine.",
      });
    }
  } else {
    killers.push({
      title: "No H1 headline found",
      severity: "critical",
      evidence: "The page has no top-level headline — meaning search engines AND humans can't tell what this is.",
      fix: "Add a single H1 that states (audience) + (outcome) + (timeframe or proof).",
    });
  }

  // 2. Generic CTA
  const weakCtas = p.ctaButtons.filter((c) => WEAK_CTA_PATTERNS.some((p) => p.test(c)));
  if (weakCtas.length > 0) {
    killers.push({
      title: "CTA buttons are passive, not commands",
      severity: "critical",
      evidence: `Found weak CTAs: ${weakCtas.slice(0, 3).map((c) => `"${c}"`).join(", ")}. "Learn More" is the surrender flag of marketing.`,
      fix: "Replace with action + value: 'Get My Free Audit', 'Start Free Trial', 'See My Roadmap'. The button should describe what they GET, not what the page is.",
    });
  }

  // 3. Too many CTAs
  if (p.ctaButtons.length > 6) {
    killers.push({
      title: "Choice paralysis from too many CTAs",
      severity: "high",
      evidence: `Detected ${p.ctaButtons.length} call-to-action buttons. Multiple competing CTAs force visitors to pick, and each option adds decision friction (Hick's Law, common UX heuristic).`,
      fix: "Pick ONE primary CTA. Demote everything else to footer or text links.",
    });
  }

  // 4. No social proof
  if (!p.hasTestimonials && !p.hasLogos && !p.hasNumbers) {
    killers.push({
      title: "Zero social proof above the fold",
      severity: "critical",
      evidence: "No testimonials, no logos, no numbers. Buyers can't tell if real humans trust this.",
      fix: "Add ONE of: (a) a single named testimonial with a real photo, (b) a logo wall of 5+ recognizable customers, or (c) one specific number ('2,341 teams use this').",
    });
  }

  // 5. No risk reversal
  if (!p.hasGuarantee && !/free trial|money[- ]back|cancel anytime|no credit card/i.test(lower)) {
    killers.push({
      title: "No risk reversal anywhere",
      severity: "high",
      evidence: "Buyers are wondering 'what if it doesn't work for me?' and you're not answering.",
      fix: "Add at least one of: free trial (no card), money-back guarantee, cancel-anytime, or 'free forever' tier.",
    });
  }

  // 6. No specificity (numbers)
  if (!p.hasNumbers) {
    killers.push({
      title: "Page is unspecific — no numbers anywhere",
      severity: "high",
      evidence: "Words like 'many', 'thousands', 'fast', 'easy' do nothing. Buyers filter vague copy as marketing.",
      fix: "Replace every vague claim with a number from your own data. 'Save hours' → your real time-saved figure. 'Many users' → your actual customer count.",
    });
  }

  // 7. Low word count (skinny page)
  if (p.wordCount < 200) {
    killers.push({
      title: "Page is too thin to convert",
      severity: "high",
      evidence: `Only ${p.wordCount} words. Buyers need enough context to justify a click — thin pages feel like a scam.`,
      fix: "In our experience, B2B pages around 600–1,500 words and B2C pages around 300–700 words tend to give buyers enough context. Add a 'How it works' section and a few use cases with specifics.",
    });
  }

  // 8. No meta description
  if (!p.metaDescription || p.metaDescription.length < 50) {
    killers.push({
      title: "Meta description is missing or weak",
      severity: "medium",
      evidence: `Meta: "${p.metaDescription || "(empty)"}". A missing or weak meta description makes your page blend in with competitors in search results, giving searchers no reason to choose your link.`,
      fix: "Write a meta description of roughly 140–160 characters (Google's documented SERP truncation limit) that (1) repeats the value prop, (2) adds a proof point, (3) ends with a soft CTA.",
    });
  }

  // 9. No FAQ
  if (!p.hasFAQ) {
    killers.push({
      title: "No FAQ to neutralize late-funnel objections",
      severity: "medium",
      evidence: "High-intent visitors at the bottom of the page stall on pricing/feature/objection questions. No FAQ = no answer = bounce.",
      fix: "Add a handful of FAQs targeting the real objections: 'How is this different from X?', 'Can I cancel?', 'Is my data secure?', etc. (5–8 is a common target range in CRO practice.)",
    });
  }

  // 10. No pricing visible
  if (!p.hasPricing && /pricing|plans|get started|sign up/i.test(lower)) {
    killers.push({
      title: "Pricing is hidden behind a click",
      severity: "medium",
      evidence: "When you make buyers click to learn the price, you lose the curious AND the qualified. Show a starting price or tier list above the fold of the pricing page.",
      fix: "Add a 'From $X/mo' badge near every CTA, or surface a 3-tier pricing summary on the homepage itself.",
    });
  }

  return killers.slice(0, 5);
}

function generateHeroRewrite(p: ParsedPage): { headline: string; subhead: string; cta: string; rationale: string } {
  const domain = p.domain.replace(/^www\./, "");
  const topic = p.h1.length > 0
    ? p.h1.replace(/[—\-|].*$/, "").trim().split(/\s+/).slice(0, 4).join(" ")
    : domain.split(".")[0];

  // Heuristic: extract what the product is from title/meta
  const descriptionHint = (p.metaDescription || p.h2s[0] || "").trim();

  const headline = `[Outcome] in [time] without [pain] — for [specific person]`;
  const subhead = descriptionHint.length > 30
    ? `${descriptionHint.slice(0, 90)}…`
    : `${topic} that turns visitors into customers. Built for teams who can't afford another slow week.`;
  const cta = p.ctaButtons[0] && !WEAK_CTA_PATTERNS.some((re) => re.test(p.ctaButtons[0] || ""))
    ? `Keep "${p.ctaButtons[0]}" but add urgency: "${p.ctaButtons[0]} — free for 14 days"`
    : `Replace "${p.ctaButtons[0] || "Submit"}" with "Start free — no card"`;
  const rationale = "Your headline should compress three things into a short scan-friendly line: WHO it's for, WHAT outcome, and WHY it's faster/cheaper/easier than the alternative. Around 8–12 words is a common target, but the real test is whether the promise is unmistakable in a glance. Move everything else to the subhead.";

  return { headline, subhead, cta, rationale };
}

function generateQuickWins(killers: Killer[], p: ParsedPage): string[] {
  const wins: string[] = [];

  // Pick the cheapest highest-impact fixes
  if (killers.some((k) => /headline/i.test(k.title))) {
    wins.push("Rewrite the headline to be (audience) + (outcome) + (timeframe). Roughly 30 minutes of work, and in our experience this is one of the higher-leverage edits you can make.");
  }
  if (killers.some((k) => /cta/i.test(k.title))) {
    wins.push("Change your primary CTA from generic ('Learn more', 'Submit') to value-named ('Get my free audit').");
  }
  if (killers.some((k) => /social proof/i.test(k.title))) {
    wins.push("Add a single named testimonial with a real photo and one specific result above the fold.");
  }
  if (!p.hasNumbers) {
    wins.push("Replace every vague claim ('thousands', 'many') with a real number from your own data (your actual customer count, your real time-saved figure).");
  }
  if (killers.some((k) => /risk reversal/i.test(k.title))) {
    wins.push("Add a 'free for 14 days, no credit card' badge next to your main CTA.");
  }
  if (p.wordCount < 400) {
    wins.push("Add a 'How it works in 3 steps' section with one concrete example per step.");
  }
  if (!p.hasFAQ) {
    wins.push("Drop in a 5-question FAQ covering your top 3 support tickets — copy from your inbox.");
  }

  // Always offer at least 3
  while (wins.length < 3) {
    wins.push("Add 2–3 trust badges near the CTA (security, press, integration logos). Trust is a numbers game.");
  }

  return wins.slice(0, 3);
}

function generateOneHourPlan(killers: Killer[]): string[] {
  // Pick the top 4 killers by severity and turn into a time-boxed plan
  const order = { critical: 0, high: 1, medium: 2 } as const;
  const sorted = [...killers].sort((a, b) => order[a.severity] - order[b.severity]).slice(0, 4);

  const plan: string[] = [];
  if (sorted.length > 0) plan.push(`Minutes 0–15 — ${sorted[0].title.split(" ").slice(0, 6).join(" ")}…`);
  if (sorted.length > 1) plan.push(`Minutes 15–35 — ${sorted[1].title.split(" ").slice(0, 6).join(" ")}…`);
  if (sorted.length > 2) plan.push(`Minutes 35–50 — ${sorted[2].title.split(" ").slice(0, 6).join(" ")}…`);
  plan.push("Minutes 50–60 — Re-run Roast My Page and compare your new score. Ship if +5+.");
  return plan;
}

function countPowerWords(text: string): number {
  const lower = text.toLowerCase();
  return POWER_WORDS.filter((w) => lower.includes(w)).length;
}

function computeScore(p: ParsedPage, killers: Killer[]): number {
  let score = 100;

  for (const k of killers) {
    if (k.severity === "critical") score -= 14;
    else if (k.severity === "high") score -= 9;
    else score -= 5;
  }

  // Hard floors/boosts
  if (p.wordCount < 100) score -= 10;
  if (p.hasTestimonials) score += 3;
  if (p.hasNumbers) score += 3;
  if (p.hasGuarantee) score += 2;
  if (p.imageCount < 1) score -= 3;

  return Math.max(8, Math.min(99, Math.round(score)));
}

function makeId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function roast(p: ParsedPage): RoastResult {
  const trustAnalysis = detectTrustSignals(p);
  const objectionMap = detectObjectionCoverage(p);
  const killers = findKillers(p);
  const heroRewrite = generateHeroRewrite(p);
  const quickWins = generateQuickWins(killers, p);
  const oneHourPlan = generateOneHourPlan(killers);
  const score = computeScore(p, killers);
  const { v, label, blurb } = pickVerdict(score);

  const summary = `We pulled apart ${p.wordCount} words of copy, ${p.ctaButtons.length} CTAs, ${p.h2s.length} sub-sections, and ${p.imageCount} images. Found ${killers.length} issues that are actively costing you conversions — including ${killers.filter((k) => k.severity === "critical").length} critical ones.`;

  return {
    id: makeId(),
    url: p.url,
    domain: p.domain,
    originalH1: p.h1,
    originalMetaDescription: p.metaDescription,
    timestamp: Date.now(),
    score,
    verdict: v,
    verdictLabel: label,
    verdictBlurb: blurb,
    summary,
    killers,
    quickWins,
    heroRewrite,
    trustAnalysis,
    objectionMap,
    oneHourPlan,
    metrics: {
      headlineWords: p.h1.trim().split(/\s+/).filter(Boolean).length,
      ctaCount: p.ctaButtons.length,
      wordCount: p.wordCount,
      trustScore: trustAnalysis.score,
      powerWordCount: countPowerWords(p.bodyText + " " + p.h1),
    },
  };
}

export function buildDemoRoast(url = "https://demo.example.com"): RoastResult {
  const demo: ParsedPage = {
    url,
    domain: new URL(url).hostname || "demo.example.com",
    title: "Welcome to Acme — The Best Solution",
    metaDescription: "",
    h1: "Welcome to Acme — The Best All-in-One Solution for Everyone",
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
  };
  return roast(demo);
}