import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";
import { WebAppSchema } from "@/components/WebAppSchema";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://roastmypage.com";

export const metadata: Metadata = {
  title: "Roast My Page — A verdict on your landing page in 60 seconds",
  description:
    "Paste your URL. Get a brutal, specific audit of what's killing your conversion — headline, CTAs, social proof, trust signals, and a one-hour fix plan. Free. No signup.",
  keywords: [
    "landing page audit",
    "conversion rate optimization",
    "AI marketing tool",
    "copy critique",
    "CRO tool",
    "landing page verdict",
    "free conversion audit",
  ],
  authors: [{ name: "Roast My Page" }],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Roast My Page — A verdict on your landing page",
    description:
      "Paste your URL. Get a brutal, specific audit of what's killing your conversion. Free, no signup, 60 seconds.",
    type: "website",
    siteName: "Roast My Page",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Roast My Page — A verdict on your landing page",
    description: "Paste your URL. Get a brutal verdict. Free, no signup.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#E8E5DE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
        <WebAppSchema />
      </head>
      <body className="paper-bg min-h-screen font-body text-ink-900 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
