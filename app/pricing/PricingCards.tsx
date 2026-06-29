"use client";
import { useState } from "react";
import Link from "next/link";
import { PayPalButton } from "@/components/PayPalButton";

interface Plan {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  cta: string;
  href: string;
  highlight: boolean;
  planId?: "pro" | "team";
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
    name: "Pro",
    price: "$19",
    cadence: "per month",
    blurb: "For founders shipping landing pages every week.",
    cta: "Subscribe",
    href: "#",
    highlight: true,
    planId: "pro",
    features: [
      "Unlimited verdicts",
      "Before and after diff generator",
      "Visual layout audit (screenshot)",
      "LLM-enriched qualitative critique",
      "Cloud archive across devices",
      "PDF export and email to team",
    ],
  },
  {
    name: "Team",
    price: "$79",
    cadence: "per month",
    blurb: "For agencies and growth teams.",
    cta: "Subscribe",
    href: "#",
    highlight: false,
    planId: "team",
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Shared workspace and comments",
      "White-label verdict reports",
      "Priority LLM routing",
      "API access",
    ],
  },
];

export function PricingCards() {
  const [checkoutPlan, setCheckoutPlan] = useState<"pro" | "team" | null>(null);

  return (
    <>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`exhibit relative ${p.highlight ? "border-vermillion border-2" : ""}`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-vermillion text-bone-50 px-3 py-1 font-mono text-[9px] uppercase tracking-stamped font-bold">
                Most popular
              </div>
            )}
            <div className="exhibit-head">
              <span className="font-bold text-vermillion">{p.name}</span>
              <span>{p.cadence}</span>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-baseline gap-2">
                <div className="font-display text-5xl font-bold text-ink-900 leading-none"
                  style={{ fontVariationSettings: "'wght' 800, 'opsz' 144" }}>
                  {p.price}
                </div>
                <div className="filing">{p.cadence}</div>
              </div>
              <p className="mt-3 font-body text-sm text-ink-700">{p.blurb}</p>

              {p.planId ? (
                checkoutPlan === p.planId ? (
                  <div className="mt-4">
                    <PayPalButton plan={p.planId} price={p.price} onSuccess={() => setCheckoutPlan(null)} />
                    <button
                      type="button"
                      onClick={() => setCheckoutPlan(null)}
                      className="mt-2 w-full text-center font-mono text-[10px] uppercase tracking-stamped text-ink-500 hover:text-ink-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCheckoutPlan(p.planId!)}
                    className="btn-stamp mt-5 inline-flex w-full justify-center"
                  >
                    {p.cta}
                  </button>
                )
              ) : (
                <Link
                  href={p.href}
                  className="btn-ghost-stamp mt-5 inline-flex w-full justify-center"
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
          All paid plans billed monthly. Cancel anytime. Payments powered by PayPal.
          <br />
          Apple Pay available on Safari and supported iOS/macOS devices.
        </p>
      </div>
    </>
  );
}
