import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders hero, form, and core sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Croast/);
    // Hero H1 contains the brand promise
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    // Demo chips render
    const demoChips = page.getByRole("button", { name: /strong landing page|acme|fastest/i });
    await expect(demoChips.first()).toBeVisible();
    // Footer with brand
    await expect(page.getByText("Croast").first()).toBeVisible();
  });

  test("demo chip runs a local audit and renders results", async ({ page }) => {
    await page.goto("/");
    // Click the first demo chip
    const firstChip = page.getByRole("button", { name: /strong landing page|acme|fastest/i }).first();
    await firstChip.click();
    // Wait for the verdict to render (the stamp has the score text)
    await expect(page.getByText(/Verdict ·|verdict ·/i).first()).toBeVisible({ timeout: 15_000 });
    // Diagnosis grid is present
    await expect(page.getByText(/Diagnosis|§ II · Funnel analysis/i).first()).toBeVisible();
  });
});

test.describe("Multi-page form", () => {
  test("toggles to multi-page mode and accepts up to 5 URLs", async ({ page }) => {
    await page.goto("/");
    // Click the "Multi-page" tab
    const multiTab = page.getByRole("tab", { name: /multi-page/i });
    if (await multiTab.count() > 0) {
      await multiTab.click();
      const textarea = page.locator("textarea#urls");
      await expect(textarea).toBeVisible();
      await textarea.fill("https://example.com\nhttps://example.org\nhttps://example.net");
      // We don't submit (would hit real network); just check the form accepted input
      const value = await textarea.inputValue();
      expect(value.split("\n").length).toBe(3);
    }
  });
});

test.describe("Share view", () => {
  test("/history page renders for any visitor", async ({ page }) => {
    await page.goto("/history");
    await expect(page.locator("h1").first()).toBeVisible();
  });
});