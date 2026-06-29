// Plausible analytics — only loads if NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
// Tracks page views, outbound clicks, and file downloads automatically.
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
