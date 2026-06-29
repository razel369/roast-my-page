"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: "Verdict" },
    { href: "/pricing", label: "Pricing" },
    { href: "/history", label: "Archive" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-ink-900/80 bg-bone-200/95 backdrop-blur-md shadow-exhibit"
          : "border-ink-900 bg-bone-200/90 backdrop-blur"
      }`}
    >
      <div className="document flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-vermillion bg-vermillion text-bone-50 text-[10px] font-mono font-bold uppercase tracking-stamped transition-transform duration-300 group-hover:scale-105">
            rmp
          </span>
          <span className="font-mono text-xs uppercase tracking-stamped text-ink-900 font-semibold">
            Roast My Page
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`relative font-mono text-[11px] uppercase tracking-stamped transition-colors duration-200 ${
                pathname === n.href
                  ? "text-vermillion"
                  : "text-ink-700 hover:text-ink-900"
              }`}
            >
              {n.label}
              {pathname === n.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-vermillion animate-draw-line origin-left" />
              )}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center border border-ink-900 bg-bone-100 sm:hidden transition-colors hover:bg-bone-200"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="font-mono text-base">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-900 bg-bone-100 sm:hidden animate-fade-in-down">
          <div className="document flex flex-col gap-1 py-3">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`py-2 font-mono text-[11px] uppercase tracking-stamped transition-colors ${
                  pathname === n.href ? "text-vermillion" : "text-ink-700 hover:text-ink-900"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}