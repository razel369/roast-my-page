import Link from "next/link";
import { PricingCards } from "./PricingCards";

export const metadata = {
  title: "Pricing— Croast",
  description: "Free for one-off audits. Pro for teams shipping every week.",
};

export default function PricingPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">{[String.fromCharCode(0xA7)]} Pricing {String.fromCharCode(0xB7)} Filed under: Tiers</div>
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
        <FAQ q="How many free verdicts do I get?" a="Three per day, per IP. No signup, no card. Pro removes the daily cap and adds AI critique and visual review." />
        <FAQ q="Can I cancel Pro anytime?" a="Yes. No contracts, no retention team, no are-you-sure popups." />
        <FAQ q="Do you store my URL or page content?" a="No. Each audit runs in memory and is discarded. Shareable verdict links are encoded directly into the URL, so even shares don't touch our servers." />
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