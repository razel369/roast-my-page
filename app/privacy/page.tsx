import Link from "next/link";

export const metadata = {
  title: "Privacy — Roast My Page",
  description:
    "What we collect, what we don't, and how the audit works without holding your data.",
};

export default function PrivacyPage() {
  return (
    <section className="document py-16">
      <header>
        <div className="filing">§ Privacy · Filed under: Records</div>
        <h1
          className="display mt-3 text-4xl sm:text-5xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          We do not store your URL. Or your page. Or your email unless you opt in.
        </h1>
        <div className="mt-6 hairline" />
      </header>

      <div className="mt-8 max-w-none space-y-6 font-body text-base text-ink-800 leading-relaxed">
        <p>
          Roast My Page was built around a single privacy claim:{" "}
          <strong>the audit should not require us to remember anything about you.</strong>
          {" "}Below is exactly what is on file, where it lives, and how to remove it.
        </p>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          What we collect
        </h2>
        <ul className="list-none space-y-2 pl-0">
          {[
            "Nothing. By default, no account is required and no server-side log of your URLs is kept.",
            "If you submit your email to the optional newsletter form, we store it so we can send you conversion tips. Unsubscribe at any time.",
            "Plausible analytics (only loaded if enabled) counts page views. No cookies, no fingerprinting, no cross-site tracking.",
            "If you upgrade to Pro, we set an authentication cookie (rmp_pro_token, 30-day expiry). It is required to call the roast endpoint at your elevated rate. Clear cookies to remove.",
          ].map((line, i) => (
            <li key={i} className="flex gap-3 border-l-4 border-ink-900 pl-4">
              <span className="font-mono text-xs text-ink-500 w-6 shrink-0">−</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Where the audit runs
        </h2>
        <p>
          When you submit a URL, our server fetches the page HTML, runs the
          analysis in memory, and returns a verdict. The HTML is not written to
          disk or analyzed for any other purpose. Shareable roast links are
          encoded directly into the URL — your browser and the recipient&apos;s
          browser decode them; our server never sees them open or share them.
        </p>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Local storage on your device
        </h2>
        <p>
          Saved verdicts live in your browser&apos;s <code className="font-mono">localStorage</code>.
          Clearing your browser data erases them. Visit{" "}
          <Link href="/history" className="underline decoration-vermillion decoration-2 underline-offset-4 hover:text-vermillion">
            /history
          </Link>{" "}
          to view or strike individual entries.
        </p>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Cookies and local storage
        </h2>
        <ul className="list-none space-y-2 pl-0">
          {[
            "rmp_pro_token — Pro authentication, 30 days. Set on /welcome, sent on every /api/roast call. Required to use the elevated rate. Clear via browser settings.",
            "Plausible analytics — only set when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is configured. Plausible is cookieless by design.",
            "rmp_history_v1 — localStorage on your device only. Holds your saved verdicts. Never transmitted.",
            "rmp_onboarded_v1, rmp_privacy_ack_v1, rmp_subscribed_v1 — localStorage flags for the onboarding tooltip, privacy notice, and email-capture dismissal. Device-local.",
          ].map((line, i) => (
            <li key={i} className="flex gap-3 border-l-4 border-ink-900 pl-4">
              <span className="font-mono text-xs text-ink-500 w-6 shrink-0">−</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Third parties
        </h2>
        <p>
          We use Vercel for hosting (privacy policy at{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-vermillion decoration-2 underline-offset-4 hover:text-vermillion"
          >
            vercel.com/legal/privacy-policy
          </a>
          ), Polar.sh for Pro billing (polar.sh/legal/privacy), and, optionally,
          Plausible for analytics. None of them receive any URLs you submit
          unless you publish a share link yourself.
        </p>

        <h2
          className="display mt-10 text-2xl sm:text-3xl"
          style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
        >
          Contact
        </h2>
        <p>
          Questions, removals, or complaints: open an issue at{" "}
          <a
            href="https://github.com/razel369/roast-my-page/issues"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-vermillion decoration-2 underline-offset-4 hover:text-vermillion"
          >
            github.com/razel369/roast-my-page/issues
          </a>.
        </p>

        <div className="mt-10">
          <Link href="/" className="btn-stamp inline-flex">Back to the verdict form</Link>
        </div>
      </div>
    </section>
  );
}
