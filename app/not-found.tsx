import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-narrow py-24 text-center">
      <div className="text-5xl">🕳️</div>
      <h1 className="mt-4 text-3xl font-extrabold">404 — page not found</h1>
      <p className="mt-2 text-ink-400">
        That URL doesn&apos;t exist. But your landing page might still be roastable.
      </p>
      <Link href="/" className="btn-primary mt-6 inline-flex">
        Roast a page 🔥
      </Link>
    </div>
  );
}