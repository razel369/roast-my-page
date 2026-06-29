export default function Loading() {
  return (
    <div className="container-narrow py-24 text-center">
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-ember-500 border-t-transparent" />
      <p className="mt-4 text-sm text-ink-400">Loading…</p>
    </div>
  );
}