// scripts/audit-batch.ts
//
// Batch-audit a curated list of B2B SaaS landing pages using Croast's
// rule engine + LLM. Output is committed to data/state-of-saas-2026.json
// and rendered as a public report at /state-of-saas-2026.
//
// Run:  npm run audit-batch
//
// Requires: LLM_API_KEY + LLM_BASE_URL env vars for the LLM call (optional).
// Without LLM env, the rule-engine data is still produced; LLM sections
// fall back to "skipped" and the report page shows a note.

import { fetchAndParse } from "../lib/fetcher";
import { roast } from "../lib/analyzer";
import { detectIndustry } from "../lib/industry";
import { chatComplete } from "../lib/llm";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

interface Target {
  name: string;
  url: string;
}

const TARGETS: Target[] = [
  { name: "Stripe", url: "https://stripe.com" },
  { name: "Linear", url: "https://linear.app" },
  { name: "Vercel", url: "https://vercel.com" },
  { name: "Notion", url: "https://notion.so" },
  { name: "Figma", url: "https://figma.com" },
  { name: "Webflow", url: "https://webflow.com" },
  { name: "Asana", url: "https://asana.com" },
  { name: "Calendly", url: "https://calendly.com" },
  { name: "Loom", url: "https://loom.com" },
  { name: "Ahrefs", url: "https://ahrefs.com" },
  { name: "Buffer", url: "https://buffer.com" },
  { name: "Intercom", url: "https://intercom.com" },
  { name: "Zapier", url: "https://zapier.com" },
  { name: "Airtable", url: "https://airtable.com" },
  { name: "Slack", url: "https://slack.com" },
];
interface PageAudit {
  name: string;
  url: string;
  domain: string;
  score: number;
  verdict: string;
  industry: string;
  h1: string;
  ctaCount: number;
  wordCount: number;
  topIssue: string | null;
  topIssueFix: string | null;
  issueCount: number;
  hasFaq: boolean;
  hasPricing: boolean;
  hasSocialProof: boolean;
  headlineStrategy?: "outcome" | "feature" | "vague" | "category" | "audience";
  headlineVerdict?: string;
}

interface CorpusAnalysis {
  generatedAt: string;
  sampleSize: number;
  medianScore: number;
  meanScore: number;
  topQuartile: number;
  bottomQuartile: number;
  scoreDistribution: Record<string, number>;
  llmInsights: string[];
  llmHeadlinePatterns: string[];
}

async function classifyHeadlineWithLLM(name: string, h1: string) {
  const llmConfig = (await import("../lib/llm")).getLlmConfig();
  if (!llmConfig.enabled) return null;
  try {
    const res = await chatComplete(
      [
        { role: "system", content: 'You classify landing page headlines. Reply ONLY as JSON: {"strategy": "outcome" | "feature" | "vague" | "category" | "audience", "verdict": "one short sentence on what this headline is doing"}.' },
        { role: "user", content: `Headline: "${h1}"` },
      ],
      { temperature: 0.2, maxTokens: 120 },
    );
    const parsed = JSON.parse(res);
    return { strategy: String(parsed.strategy || "vague"), verdict: String(parsed.verdict || "") };
  } catch (err) {
    console.warn(`[${name}] headline classification failed: ${(err as Error).message}`);
    return null;
  }
}

async function findCorpusPatternsWithLLM(audits: PageAudit[]) {
  const llmConfig = (await import("../lib/llm")).getLlmConfig();
  if (!llmConfig.enabled) return null;
  const summary = audits.map((a) => `- ${a.name}: ${a.score}/100, ${a.verdict}, headline="${a.h1}", topIssue=${a.topIssue ?? "none"}`).join("\n");
  try {
    const res = await chatComplete(
      [
        { role: "system", content: 'You are a senior CRO analyst reviewing a dataset of audited B2B SaaS landing pages. Find patterns. Reply ONLY as JSON: {"insights": ["3-5 short observations about what makes the highest and lowest scorers different", each one 1-2 sentences", "headlinePatterns": ["3 short patterns of how top scorers write headlines"]}' },
        { role: "user", content: `Dataset of ${audits.length} B2B SaaS landing pages:\n\n${summary}` },
      ],
      { temperature: 0.3, maxTokens: 800 },
    );
    const parsed = JSON.parse(res);
    return {
      insights: Array.isArray(parsed.insights) ? parsed.insights.map(String) : [],
      headlinePatterns: Array.isArray(parsed.headlinePatterns) ? parsed.headlinePatterns.map(String) : [],
    };
  } catch (err) {
    console.warn(`[corpus analysis] failed: ${(err as Error).message}`);
    return null;
  }
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

function distribution(scores: number[]): Record<string, number> {
  const buckets: Record<string, number> = {
    "0-19 (Conversion Killer)": 0,
    "20-39 (Conversion Killer)": 0,
    "40-59 (Needs Work)": 0,
    "60-79 (Solid)": 0,
    "80-100 (Strong)": 0,
  };
  for (const s of scores) {
    if (s < 20) buckets["0-19 (Conversion Killer)"]++;
    else if (s < 40) buckets["20-39 (Conversion Killer)"]++;
    else if (s < 60) buckets["40-59 (Needs Work)"]++;
    else if (s < 80) buckets["60-79 (Solid)"]++;
    else buckets["80-100 (Strong)"]++;
  }
  return buckets;
}

async function main() {
  console.log(`Auditing ${TARGETS.length} B2B SaaS landing pages...\n`);

  const audits: PageAudit[] = [];

  for (const target of TARGETS) {
    process.stdout.write(`  - ${target.name.padEnd(14)} `);
    try {
      const parsed = await fetchAndParse(target.url);
      const result = roast(parsed);
      const industry = detectIndustry(parsed);
      const headlineAI = await classifyHeadlineWithLLM(target.name, result.heroRewrite.headline);
      const audit: PageAudit = {
        name: target.name,
        url: target.url,
        domain: parsed.domain,
        score: result.score,
        verdict: result.verdictLabel,
        industry,
        h1: result.originalH1 || result.heroRewrite.headline,
        ctaCount: result.metrics.ctaCount,
        wordCount: result.metrics.wordCount,
        topIssue: result.killers[0]?.title ?? null,
        topIssueFix: result.killers[0]?.fix ?? null,
        issueCount: result.killers.length,
        hasFaq: /faq/i.test(parsed.bodyText),
        hasPricing: /pricing|price|\$/i.test(parsed.bodyText),
        hasSocialProof: /customer|testimonial|trusted|users|company/i.test(parsed.bodyText),
        headlineStrategy: headlineAI?.strategy as PageAudit["headlineStrategy"],
        headlineVerdict: headlineAI?.verdict,
      };
      audits.push(audit);
      console.log(`${audit.score}/100  ${audit.verdict}` + (headlineAI ? `  [${headlineAI.strategy}]` : ""));
    } catch (err) {
      console.log(`FAILED: ${(err as Error).message}`);
    }
  }

  console.log("\nAsking LLM to identify patterns across the corpus...");
  const corpusAI = await findCorpusPatternsWithLLM(audits);

  const scores = audits.map((a) => a.score);
  const corpus: CorpusAnalysis = {
    generatedAt: new Date().toISOString(),
    sampleSize: audits.length,
    medianScore: Math.round(percentile(scores, 50)),
    meanScore: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
    topQuartile: percentile(scores, 75),
    bottomQuartile: percentile(scores, 25),
    scoreDistribution: distribution(scores),
    llmInsights: corpusAI?.insights ?? [
      "(LLM analysis skipped — set LLM_API_KEY + LLM_BASE_URL to enable pattern detection)",
    ],
    llmHeadlinePatterns: corpusAI?.headlinePatterns ?? [
      "(LLM analysis skipped — set LLM_API_KEY + LLM_BASE_URL to enable pattern detection)",
    ],
  };

  const out = { audits, corpus };
  const outPath = "data/state-of-saas-2026.json";
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nWrote ${outPath}`);
  console.log(`Median score: ${corpus.medianScore}/100`);
  console.log(`Mean score:   ${corpus.meanScore}/100`);
  console.log(`Top quartile: ${corpus.topQuartile}/100`);
  console.log(`Bottom quartile: ${corpus.bottomQuartile}/100`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
