import Link from "next/link";

export const metadata = {
  title: "404 — Case file not found",
  description: "The page you tried to reach does not exist on file.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="document py-24">
      <div className="filing">§ Error · Case file not found</div>
      <h1
        className="display mt-4 text-[88px] leading-none sm:text-[140px]"
        style={{ fontVariationSettings: "'wght' 700, 'opsz' 144" }}
      >
        404.
      </h1>
      <div className="mt-2 h-1 w-24 bg-vermillion" />
      <p className="mt-8 max-w-xl font-body text-base text-ink-700 leading-relaxed sm:text-lg">
        Whatever URL brought you here isn&apos;t in our archive. It may have been
        renamed, contested, or simply never existed.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link href="/" className="btn-stamp justify-center">
          File a new verdict
        </Link>
        <Link href="/history" className="btn-ghost-stamp justify-center">
          See your archive
        </Link>
      </div>

      <div className="mt-16 border border-ink-900 bg-bone-100 p-5">
        <div className="filing mb-2">Filing note</div>
        <p className="font-mono text-xs text-ink-700 leading-relaxed">
          If you arrived here from a roast link someone shared, that link may
          have expired. Verdicts are encoded directly into the URL, so recipients
          can decode them client-side without our server ever seeing the data —
          but a corrupted or truncated URL will look like this.
        </p>
      </div>
    </section>
  );
}
