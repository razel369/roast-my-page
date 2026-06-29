import Link from "next/link";
import { PricingCards } from "./PricingCards";

export const metadata = {
  title: "Pricing — Roast My Page",
  description: "Free for one-off verdicts. Pro for teams shipping every week.",
};

export default function PricingPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Pricing · Filed under: Tiers</div>
        <h1
          className="display mt-3 text-5xl sm:text-6xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          One verdict is free.
          <br />
          <span className="text-vermillion">Unlimited is cheap.</span>
        </h1>
        <p className="mt-4 max-w-xl font-body text-base text-ink-700">
          Use it once to see the value. Upgrade when you ship landing pages faster than you can audit them.
        </p>
        <div className="mt-6 hairline" />
      </header>

      <PricingCards />

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        <FAQ q="Is the free tier really unlimited?" a="No — rate-limited per IP (3/day on free, 8/min on Pro) so we don't get crushed by bots. Real humans hit the limit only when they're stress-testing." />
        <FAQ q="Can I cancel Pro anytime?" a="Yes. No contracts, no retention team, no are you sure popups." />
        <FAQ q="Do you store my URL or page content?" a="Free verdicts are not stored on our servers. Pro archive is stored in your private cloud workspace." />
      </div>
    </section>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="exhibit">
      <div className="exhibit-head">
        <span>Q</span>
        <span>{q}</span>
      </div>
      <div className="exhibit-body font-body text-sm text-ink-800 leading-relaxed">
        {a}
      </div>
    </div>
  );
}