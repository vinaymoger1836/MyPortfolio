import { expect, test, type Page } from "@playwright/test";
import { profile } from "../src/content/profile";
import { site } from "../src/content/site";

/** Collects console errors and uncaught exceptions for the whole test. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

const htmlClass = (page: Page) =>
  page.evaluate(() => document.documentElement.className);

const bodyBg = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test("home page loads with the name as the only h1", async ({ page }) => {
  const errors = trackErrors(page);
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(site.title);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveText(profile.name);
  await expect(page.locator("main")).toBeVisible();

  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalScroll).toBe(false);
  expect(errors).toEqual([]);
});

test("dark is the default even when the OS prefers light", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  expect(await htmlClass(page)).toContain("dark");
  expect(await htmlClass(page)).not.toContain("light");
  expect(await bodyBg(page)).toBe("rgb(10, 11, 13)");
});

test("theme toggle switches and remembers the theme", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto("/");
  const toggle = page.getByRole("button", { name: site.ui.themeToggle });

  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/\blight\b/);
  expect(await bodyBg(page)).toBe("rgb(250, 250, 247)");

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/\blight\b/);

  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  expect(await bodyBg(page)).toBe("rgb(10, 11, 13)");

  expect(errors).toEqual([]);
});
