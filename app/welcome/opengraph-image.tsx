import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const alt = "Welcome to Croast Pro";

async function loadFonts() {
  const bold = await fetch(
    new URL("https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIw2boKoduKmMEVuFuYMZhrib2Bg-4.woff2"),
  ).then((r) => r.arrayBuffer());
  return [{ name: "Inter", data: bold, weight: 700 as const, style: "normal" as const }];
}

export default async function Image() {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0b0b0e 0%, #18181b 60%, #27272a 100%)",
          fontFamily: "Inter",
          padding: 70,
          color: "#f7f7f8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 9999,
              border: "2px solid #f97316",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
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
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>Croast</div>
            <div style={{ fontSize: 12, color: "#a1a1aa", letterSpacing: 2, marginTop: -2 }}>YOUR AI CONVERSION ENGINEER</div>
          </div>
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, color: "#f97316", marginTop: 60, lineHeight: 1 }}>
          You&apos;re in.
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, marginTop: 18, color: "#f7f7f8", maxWidth: 900, lineHeight: 1.2 }}>
          Unlimited landings audited. AI critique enabled. Cancel anytime.
        </div>
        <div style={{ marginTop: "auto", fontSize: 22, color: "#a1a1aa" }}>croast.io/welcome</div>
      </div>
    ),
    { ...size, fonts },
  );
}
