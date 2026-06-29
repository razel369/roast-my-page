import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Roast My Page vs a $10K CRO consultant — comparison";

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
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🔥</div>
          <div style={{ fontSize: 26, fontWeight: 700 }}>Roast My Page</div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 90 }}>
          <div style={{ fontSize: 32, color: "#a1a1aa", fontWeight: 700, letterSpacing: 4 }}>VS.</div>
          <div style={{ fontSize: 110, fontWeight: 800, color: "#f97316", lineHeight: 1 }}>A $10K consultant</div>
        </div>
        <div style={{ fontSize: 34, fontWeight: 700, marginTop: 30, color: "#f7f7f8", maxWidth: 900, lineHeight: 1.2 }}>
          Same five insights. 0 seconds vs 2 weeks. Pick your bill.
        </div>
        <div style={{ marginTop: "auto", fontSize: 22, color: "#a1a1aa" }}>roastmypage.com/vs/cro-consultant</div>
      </div>
    ),
    { ...size, fonts },
  );
}
export const dynamic = 'force-dynamic';
