import { ImageResponse } from "next/og";
import { decodeRoast } from "@/lib/storage";
import type { Severity } from "@/lib/types";

// On Vercel/Linux deploy, change this to `export const runtime = "edge"` for
// faster cold starts. Local Windows builds hit a known bug in @vercel/og's
// bundled-font loader (fileURLToPath fails on Windows-style paths); the route
// still builds and ships, and works correctly in production.
export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Croast — landing page audit";

const severityColor: Record<Severity, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#facc15",
};

const verdictColor = (score: number) =>
  score >= 82 ? "#22c55e" : score >= 65 ? "#facc15" : score >= 40 ? "#f97316" : "#ef4444";

// Fetch fonts explicitly — works around a Windows-specific bug in @vercel/og's
// bundled font path.
async function loadFonts() {
  const regular = await fetch(
    new URL("https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIw2boKoduKmMEVuLyfMZhrib2Bg-4.woff2"),
  ).then((r) => r.arrayBuffer());
  const bold = await fetch(
    new URL("https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIw2boKoduKmMEVuFuYMZhrib2Bg-4.woff2"),
  ).then((r) => r.arrayBuffer());
  return [
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: bold, weight: 800 as const, style: "normal" as const },
  ];
}

export default async function Image({ params }: { params: { id: string } }) {
  const roast = decodeRoast(params.id);
  const fonts = await loadFonts();

  if (!roast) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#0b0b0e",
            color: "#f7f7f8",
            fontFamily: "Inter",
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 800 }}>Croast</div>
          <div style={{ fontSize: 28, marginTop: 16, color: "#a1a1aa" }}>
            Brutal audits for landing pages.
          </div>
        </div>
      ),
      { ...size, fonts },
    );
  }

  const topKiller = roast.killers[0];
  const scoreColor = verdictColor(roast.score);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0b0b0e 0%, #18181b 60%, #27272a 100%)",
          fontFamily: "Inter",
          padding: 60,
          color: "#f7f7f8",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 9999,
              border: "2px solid #f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M16 6 C 12 11, 11 14, 12 17 C 9 17, 8 21, 11 24 C 13 26, 19 26, 21 24 C 24 21, 23 17, 20 17 C 21 14, 20 11, 16 6 Z"
                fill="#f97316"
              />
              <path
                d="M11.5 16.5 L 14.5 19.5 L 20.5 13.5"
                stroke="#0b0b0e"
                strokeWidth="2"
                strokeLinecap="square"
                fill="none"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>Croast</div>
            <div style={{ fontSize: 14, color: "#a1a1aa", letterSpacing: 2, marginTop: -2 }}>YOUR AI CONVERSION ENGINEER</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 20, color: "#a1a1aa" }}>
            croast.io
          </div>
        </div>

        {/* Big score + domain */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
            marginTop: 50,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 280,
              height: 280,
              borderRadius: 9999,
              border: `12px solid ${scoreColor}`,
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 140, fontWeight: 800, color: scoreColor, lineHeight: 1 }}>
              {roast.score}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: 4,
                color: "#a1a1aa",
                marginTop: 12,
              }}
            >
              /100
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 22,
                color: "#a1a1aa",
                letterSpacing: 4,
                fontWeight: 700,
              }}
            >
              ROAST OF
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                marginTop: 8,
                lineHeight: 1.05,
                color: "#f7f7f8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {roast.domain}
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 32,
                fontWeight: 700,
                color: scoreColor,
              }}
            >
              {roast.verdictLabel}
            </div>
            <div
              style={{
                marginTop: 14,
                fontSize: 22,
                color: "#d4d4d8",
                lineHeight: 1.35,
                maxWidth: 520,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {roast.verdictBlurb}
            </div>
          </div>
        </div>

        {/* Top killer strip */}
        {topKiller && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 20,
              padding: 20,
              borderRadius: 16,
              border: `2px solid ${severityColor[topKiller.severity]}55`,
              background: `${severityColor[topKiller.severity]}15`,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 3,
                color: severityColor[topKiller.severity],
                flexShrink: 0,
              }}
            >
              TOP KILLER · {topKiller.severity.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#f7f7f8",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {topKiller.title}
            </div>
          </div>
        )}
      </div>
    ),
    { ...size, fonts },
  );
}