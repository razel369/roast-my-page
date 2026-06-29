const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3051/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: ".next/landing.png", fullPage: false });
  console.log("Landing captured");
  await page.goto("http://localhost:3051/pricing", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: ".next/pricing.png", fullPage: false });
  console.log("Pricing captured");
  await browser.close();
})();