"use client";
import Link from "next/link";
import { PolarCheckoutButton } from "@/components/PolarCheckoutButton";

interface Plan {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: string;
  href: string;
  highlight: boolean;
  badge?: string;
  planId?: "pro" | "pro-yearly" | "team";
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "For one-off verdicts and curious founders.",
    cta: "File a verdict",
    href: "/",
    highlight: false,
    features: [
      "3 verdicts per day",
      "Rule-engine audit (no AI)",
      "Sharable verdict link",
      "Local archive (this device)",
    ],
  },
  {
    name: "Pro · Monthly",
    price: "$19",
    cadence: "per month",
    blurb: "For founders shipping landing pages every week.",
    cta: "Subscribe",
    href: "#",
    highlight: false,
    planId: "pro",
    features: [
      "Unlimited single-page verdicts",
      "Multi-page funnel audits (up to 5 URLs)",
      "Site-level score + flow analysis",
      "AI-enriched critique (when LLM key configured)",
      "Visual layout audit (when Browserless configured)",
      "Share verdict links + history archive",
    ],
  },
  {
    name: "Pro · Yearly",
    price: "$190",
    cadence: "per year",
    blurb: "Two months free. For founders who ship all year.",
    cta: "Subscribe",
    href: "#",
    highlight: true,
    badge: "Save $38",
    planId: "pro-yearly",
    features: [
      "Everything in Pro Monthly",
      "$190/yr (~$15.83/mo · saves 17%)",
      "Lock in the current rate",
      "Cancel anytime · 30-day money-back",
      "Best for teams shipping weekly",
      "Priority in feature requests",
    ],
  },
];

export function PricingCards() {
  return (
    <>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:max-w-4xl lg:mx-auto">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`exhibit relative ${p.highlight ? "border-vermillion border-2" : ""}`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vermillion text-bone-50 px-3 py-1 font-mono text-[9px] uppercase tracking-stamped font-bold">
                {p.badge ?? "Most popular"}
              </div>
            )}
            <div className="exhibit-head">
              <span className="font-bold text-vermillion">{p.name}</span>
              <span>{p.cadence}</span>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-baseline gap-2">
                <div
                  className="font-display text-5xl font-bold text-ink-900 leading-none"
                  style={{ fontVariationSettings: "'wght' 800, 'opsz' 144" }}
                >
                  {p.price}
                </div>
                <div className="filing">{p.cadence}</div>
              </div>
              <p className="mt-3 font-body text-sm text-ink-700">{p.blurb}</p>

              {p.planId ? (
                <div className="mt-5">
                  <PolarCheckoutButton
                    plan={p.planId}
                    price={p.price}
                    suffix={p.planId === "pro-yearly" ? "/yr" : "/mo"}
                  />
                </div>
              ) : (
                <Link
                  href={p.href}
                  className="btn-stamp mt-5 inline-flex w-full justify-center"
                >
                  {p.cta}
                </Link>
              )}

              <ul className="mt-5 space-y-2 font-body text-sm text-ink-800">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-vermillion font-bold shrink-0">+</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="filing text-[11px]">
          Monthly or yearly. Cancel anytime. Payments powered by Polar.sh.
          <br />
          Apple Pay, Google Pay, and 30+ local payment methods supported globally.
        </p>
      </div>
    </>
  );
}