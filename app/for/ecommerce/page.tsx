import type { Metadata } from "next";
import { IndustryLanding } from "../_IndustryLanding";

export const metadata: Metadata = {
  title: "Croast for e-commerce — landing page audit for product pages",
  description:
    "The conversion audit for e-commerce landing pages. Catches vague headlines, missing social proof, hidden shipping cost, and choice-paralysis CTAs. Free, 60 seconds.",
};

const FEATURES = [
  {
    num: "01",
    title: "Your product page should answer the five buyer questions in the first scroll",
    body: "Buyers want to know: what is it, what does it cost, when do I get it, why should I trust you, and what if I don&apos;t like it. Croast checks each of these and flags the ones you&apos;re missing.",
  },
  {
    num: "02",
    title: "Multiple competing CTAs kill conversion",
    body: "Add to cart, learn more, see reviews, view size guide, sign up for emails — every extra button is a decision the buyer has to make. Croast flags more than one primary CTA and recommends which to demote.",
  },
  {
    num: "03",
    title: "Show shipping cost and delivery date above the fold",
    body: "Buyers who can&apos;t find these abandon. Croast checks the first scroll for shipping cost, delivery date, and return policy, and flags the page if they&apos;re missing.",
  },
  {
    num: "04",
    title: "Use the word you should use",
    body: "Free shipping, not complimentary delivery. Returns, not money-back satisfaction. Reviews, not testimonials. Croast&apos;s language detector flags the words that are too soft for e-commerce buyers.",
  },
];

const FAQS = [
  {
    q: "Can I audit my Shopify or WooCommerce store?",
    a: "Yes — paste any product page URL. Croast fetches and reads the public HTML. For stores behind a password or login, use your marketing site instead.",
  },
  {
    q: "Does Croast give product-level advice?",
    a: "Not yet. Today it audits the structural pieces of the page (headline, CTA, social proof, FAQ, pricing). For product-specific copy, run a verdict and use the AI critique (Pro).",
  },
  {
    q: "What about my checkout flow?",
    a: "Audit each public page in your funnel separately. For the multi-page flow (home → category → product → cart), paste all four URLs and Croast will tell you where the funnel breaks.",
  },
];

export default function EcommercePage() {
  return (
    <IndustryLanding
      industry="e-commerce"
      hero="A landing page audit built for product pages."
      intro="Most e-commerce pages leak buyers because of vague copy, missing social proof, or hidden shipping cost. Croast catches all three in 60 seconds — for free."
      features={FEATURES}
      faqs={FAQS}
    />
  );
}