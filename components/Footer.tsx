import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-ink-900 bg-bone-200">
      <div className="document py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-vermillion bg-vermillion text-bone-50 text-[9px] font-mono font-bold uppercase tracking-stamped">
                rmp
              </span>
              <span className="font-mono text-[11px] uppercase tracking-stamped font-semibold">
                Croast
              </span>
            </div>
            <p className="mt-3 max-w-sm font-mono text-xs text-ink-700 leading-relaxed">
              Verdicts on landing pages. No login. No data retention. No nonsense.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-2.5 font-mono text-[11px] uppercase tracking-stamped text-ink-700 sm:grid-cols-3"
          >
            <Link href="/" className="transition-colors duration-200 hover:text-vermillion">Verdict</Link>
            <Link href="/pricing" className="transition-colors duration-200 hover:text-vermillion">Pricing</Link>
            <Link href="/vs" className="transition-colors duration-200 hover:text-vermillion">Vs.</Link>
            <Link href="/history" className="transition-colors duration-200 hover:text-vermillion">Archive</Link>
            <Link href="/about" className="transition-colors duration-200 hover:text-vermillion">About</Link>
            <Link href="/changelog" className="transition-colors duration-200 hover:text-vermillion">Changelog</Link>
            <Link href="/status" className="transition-colors duration-200 hover:text-vermillion">Status</Link>
            <Link href="/privacy" className="transition-colors duration-200 hover:text-vermillion">Privacy</Link>
            <a
              href="https://github.com/razel369/roast-my-page/issues"
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 hover:text-vermillion"
            >
              Contact
            </a>
          </nav>

          <div className="filing text-right">
            <div>Filed {new Date().getFullYear()}</div>
            <div className="mt-1">All verdicts final</div>
            <div className="mt-2 h-px w-12 bg-rule ml-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}
