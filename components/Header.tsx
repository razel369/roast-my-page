"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape, lock body scroll, restore focus
  useEffect(() => {
    if (!open) return;
    const button = toggleRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      button?.focus();
    };
  }, [open]);

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
    { href: "/privacy", label: "Privacy" },
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
        <Link href="/" className="flex items-center gap-3 group" aria-label="Roast My Page home">
          <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-vermillion bg-vermillion text-bone-50 text-[10px] font-mono font-bold uppercase tracking-stamped transition-transform duration-300 group-hover:scale-105">
            rmp
          </span>
          <span className="font-mono text-xs uppercase tracking-stamped text-ink-900 font-semibold">
            Roast My Page
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 sm:flex">
          {navItems.map((n) => {
            const isActive = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative font-mono text-[11px] uppercase tracking-stamped transition-colors duration-200 focus:outline-none focus-visible:text-vermillion ${
                  isActive ? "text-vermillion" : "text-ink-700 hover:text-ink-900"
                }`}
              >
                {n.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-vermillion animate-draw-line origin-left" />
                )}
              </Link>
            );
          })}
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center border border-ink-900 bg-bone-100 sm:hidden transition-colors hover:bg-bone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-vermillion"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className="relative block h-4 w-4">
            <span
              className={`absolute left-0 right-0 top-1 h-0.5 bg-ink-900 transition-transform duration-300 ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-3 h-0.5 bg-ink-900 transition-transform duration-300 ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-ink-900 bg-bone-100 transition-all duration-300 ease-out sm:hidden ${
          open ? "max-h-96 border-t opacity-100" : "max-h-0 border-t-0 opacity-0"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <nav className="document flex flex-col py-3">
          {navItems.map((n) => {
            const isActive = pathname === n.href || (n.href !== "/" && pathname?.startsWith(n.href));
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between border-b border-ink-900/10 py-3 font-mono text-xs uppercase tracking-stamped transition-colors last:border-b-0 ${
                  isActive ? "text-vermillion" : "text-ink-700 hover:text-ink-900"
                }`}
              >
                <span>{n.label}</span>
                {isActive && <span className="font-mono text-[10px] text-vermillion">●</span>}
              </Link>
            );
          })}
          <Link
            href="/#roast-form"
            onClick={() => setOpen(false)}
            className="btn-stamp mt-3 justify-center text-center"
          >
            File a verdict
          </Link>
        </nav>
      </div>
    </header>
  );
}
