// Screenshot capture with three backends, auto-detected by environment:
//   1. Remote service (Browserless.io) — used in serverless / Vercel
//   2. Local Playwright/Chromium     — used in dev / self-hosted
//   3. Disabled                     — when DISABLE_SCREENSHOTS=true

import type { Browser } from "playwright";

export interface ScreenshotCapture {
  desktop: CapturedImage | null;
  mobile: CapturedImage | null;
  errors: string[];
  elapsedMs: number;
  backend: "playwright" | "browserless" | "disabled";
}

export interface CapturedImage {
  base64: string;
  width: number;
  height: number;
  device: "desktop" | "mobile";
}

const DESKTOP_VIEWPORT = { width: 1280, height: 800 };
const MOBILE_VIEWPORT = { width: 390, height: 844 };

export function screenshotsDisabled(): boolean {
  return process.env.DISABLE_SCREENSHOTS === "true";
}

function browserlessConfigured(): boolean {
  return !!process.env.BROWSERLESS_URL && !!process.env.BROWSERLESS_TOKEN;
}

export async function captureScreenshots(rawUrl: string): Promise<ScreenshotCapture> {
  const started = Date.now();

  if (screenshotsDisabled()) {
    return { desktop: null, mobile: null, errors: ["disabled"], elapsedMs: 0, backend: "disabled" };
  }

  let normalized = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) normalized = "https://" + normalized;

  // Prefer remote service in serverless (Vercel, etc.) where Chromium won't run.
  if (browserlessConfigured()) {
    return captureViaBrowserless(normalized, started);
  }

  // On serverless platforms (Vercel, Netlify, etc.) Chromium is not available,
  // so Playwright will fail. Skip gracefully instead of hanging.
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return { desktop: null, mobile: null, errors: ["no-browserless"], elapsedMs: 0, backend: "disabled" };
  }

  // Fall back to local Playwright (dev / self-hosted).
  return captureViaPlaywright(normalized, started);
}

// ──────────────────────────────────────────────────────────────────────
// Browserless.io backend (serverless-friendly)
// Docs: https://docs.browserless.io/rest-apis/screenshot
// ──────────────────────────────────────────────────────────────────────
async function captureViaBrowserless(url: string, started: number): Promise<ScreenshotCapture> {
  const base = (process.env.BROWSERLESS_URL || "https://production-sfo.browserless.io").replace(/\/+$/, "");
  const token = process.env.BROWSERLESS_TOKEN || "";
  const errors: string[] = [];

  const results = await Promise.allSettled([
    captureOneBrowserless(base, token, url, "desktop"),
    captureOneBrowserless(base, token, url, "mobile"),
  ]);

  const desktop = results[0].status === "fulfilled" ? results[0].value : (errors.push(`desktop: ${(results[0] as PromiseRejectedResult).reason?.message ?? "failed"}`), null);
  const mobile = results[1].status === "fulfilled" ? results[1].value : (errors.push(`mobile: ${(results[1] as PromiseRejectedResult).reason?.message ?? "failed"}`), null);

  return { desktop, mobile, errors, elapsedMs: Date.now() - started, backend: "browserless" };
}

async function captureOneBrowserless(
  base: string,
  token: string,
  url: string,
  device: "desktop" | "mobile",
): Promise<CapturedImage | null> {
  const viewport = device === "desktop" ? DESKTOP_VIEWPORT : MOBILE_VIEWPORT;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const res = await fetch(`${base}/screenshot?token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        viewport,
        deviceScaleFactor: 1,
        fullPage: false,
        type: "png",
        // Block tracking scripts for cleaner output.
        blockAds: true,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    return {
      base64: buffer.toString("base64"),
      width: viewport.width,
      height: viewport.height,
      device,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ──────────────────────────────────────────────────────────────────────
// Local Playwright/Chromium backend (dev / self-hosted / VPS)
// ──────────────────────────────────────────────────────────────────────
async function captureViaPlaywright(url: string, started: number): Promise<ScreenshotCapture> {
  const errors: string[] = [];
  let browser: Browser | null = null;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const results = await Promise.allSettled([
      withTimeout(captureOnePlaywright(browser, url, "desktop"), 25_000, "desktop"),
      withTimeout(captureOnePlaywright(browser, url, "mobile"), 25_000, "mobile"),
    ]);

    const desktop = results[0].status === "fulfilled" ? results[0].value : (errors.push(`desktop: ${(results[0] as PromiseRejectedResult).reason?.message ?? "failed"}`), null);
    const mobile = results[1].status === "fulfilled" ? results[1].value : (errors.push(`mobile: ${(results[1] as PromiseRejectedResult).reason?.message ?? "failed"}`), null);

    return { desktop, mobile, errors, elapsedMs: Date.now() - started, backend: "playwright" };
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
    return { desktop: null, mobile: null, errors, elapsedMs: Date.now() - started, backend: "playwright" };
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        /* ignore */
      }
    }
  }
}

async function captureOnePlaywright(
  browser: Browser,
  url: string,
  device: "desktop" | "mobile",
): Promise<CapturedImage | null> {
  const context = await browser.newContext({
    viewport: device === "desktop" ? DESKTOP_VIEWPORT : MOBILE_VIEWPORT,
    userAgent:
      device === "mobile"
        ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    deviceScaleFactor: 1,
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();
  try {
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 20_000,
    });
    await page.waitForLoadState("load", { timeout: 20_000 }).catch(() => {});
    await page.waitForTimeout(1_500);
    // Dismiss obvious cookie banners.
    for (const sel of [
      'button:has-text("Accept")',
      'button:has-text("Accept all")',
      'button:has-text("Got it")',
      'button:has-text("Agree")',
      'button:has-text("Allow")',
      '[aria-label*="accept" i]',
    ]) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 200 })) await el.click({ timeout: 800 });
      } catch {
        /* keep going */
      }
    }
    await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});

    const buffer = await page.screenshot({
      type: "png",
      fullPage: false,
      animations: "disabled",
    });

    const viewport = page.viewportSize() ?? DESKTOP_VIEWPORT;
    return {
      base64: buffer.toString("base64"),
      width: viewport.width,
      height: viewport.height,
      device,
    };
  } finally {
    await page.close().catch(() => {});
    await context.close().catch(() => {});
  }
}

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} screenshot timed out after ${ms}ms`)), ms),
    ),
  ]);
}

export function captureBackend(): "playwright" | "browserless" | "disabled" {
  if (screenshotsDisabled()) return "disabled";
  if (browserlessConfigured()) return "browserless";
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return "disabled";
  return "playwright";
}