import type { Metadata } from "next";
import { IndustryLanding } from "../_IndustryLanding";

export const metadata: Metadata = {
  title: "Croast for agencies — audit your client landing pages in seconds",
  description:
    "The conversion audit for agency landing pages. Audit any client page in 60 seconds, share the verdict, deliver recommendations without sending a deck. Free, no signup.",
};

const FEATURES = [
  {
    num: "01",
    title: "Audit any client landing page in 60 seconds",
    body: "Send a client a verdict link before your next status call. They see the same score, the same issues, the same fixes — no PDF to format, no deck to send.",
  },
  {
    num: "02",
    title: "Share a verdict without an account",
    body: "Verdict links are encoded into the URL itself. Click, read, done. No one has to sign up to see the audit.",
  },
  {
    num: "03",
    title: "Three named clients beat ten anonymous testimonials",
    body: "Agency pages live and die by the case-study wall. Croast flags generic work claims and tells you where to add the named-client proof that actually closes the next lead.",
  },
  {
    num: "04",
    title: "Replace \"Contact us\" with a specific call",
    body: "\"Contact us\" is the surrender flag. Croast detects weak CTAs and recommends specifics like \"Book a 15-minute scoping call\" or \"Start a project in 2 weeks\".",
  },
];

const FAQS = [
  {
    q: "Can I use Croast for client work?",
    a: "Yes. Free for one-off audits; Pro if you&apos;re doing 5+ audits a week. The verdict link is shareable as-is, no Croast branding required on the page itself.",
  },
  {
    q: "What about white-label reports?",
    a: "That&apos;s on the Pro roadmap. Today the verdict shows the Croast flame mark; if you need full white-label, file a verdict and we&apos;ll know it&apos;s a real ask.",
  },
  {
    q: "Can I run multi-page audits across a client funnel?",
    a: "Yes. Paste up to 5 URLs (home, services, contact, case study, etc.) and Croast returns a site-level score plus CTA consistency, message consistency, and funnel order.",
  },
];

export default function AgencyPage() {
  return (
    <IndustryLanding
      industry="agency"
      hero="A landing page audit built for agency work."
      intro="Agencies bill hours for work Croast does in 60 seconds. Run a verdict before your next client call and let the audit do the heavy lifting on first-pass structural review."
      features={FEATURES}
      faqs={FAQS}
    />
  );
}