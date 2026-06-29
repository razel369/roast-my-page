import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://roastmypage.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/vs/hotjar`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/vs/pagespeed`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/vs/cro-consultant`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/changelog`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/welcome`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/history`, lastModified: now, changeFrequency: "never", priority: 0.1 },
  ];
}
