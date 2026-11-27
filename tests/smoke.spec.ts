import { expect, test, type Page } from "@playwright/test";
import { profile } from "../src/content/profile";
import { projects } from "../src/content/projects";
import { site } from "../src/content/site";
import { visibleSections } from "../src/lib/sections";

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

test("every visible section renders in order and in-page links resolve", async ({
  page,
}) => {
  await page.goto("/");

  const ids = await page.locator("main > section[id]").evaluateAll((els) =>
    els.map((el) => el.id),
  );
  expect(ids).toEqual(visibleSections.map((s) => s.id));

  // No dead links: every href is non-empty, never "#", and in-page anchors exist.
  const hrefs = await page
    .locator("a")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  for (const href of hrefs) {
    expect(href, "empty or '#' href").not.toMatch(/^#?$/);
    if (href.startsWith("#")) {
      await expect(page.locator(href), `missing target ${href}`).toHaveCount(1);
    }
  }
});

test("project tag filter narrows the list", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator("#projects article");
  await expect(cards).toHaveCount(projects.length);

  const tag = "Frontend";
  await page
    .getByRole("group", { name: site.ui.projects.filterLabel })
    .getByRole("button", { name: tag, exact: true })
    .click();
  await expect(cards).toHaveCount(
    projects.filter((p) => p.tags.includes(tag)).length,
  );

  await page.getByRole("button", { name: site.ui.projects.all, exact: true }).click();
  await expect(cards).toHaveCount(projects.length);
});

test("contact form shows inline errors when empty", async ({ page }) => {
  await page.goto("/");
  const form = page.getByRole("form", { name: site.ui.contact.formLabel });

  await form.getByRole("button", { name: site.ui.contact.submit }).click();
  await expect(form.getByText(site.ui.contact.errors.name)).toBeVisible();
  await expect(form.getByText(site.ui.contact.errors.email)).toBeVisible();
  await expect(form.getByText(site.ui.contact.errors.message)).toBeVisible();
  await expect(page).toHaveURL(/\/$/);
});

test("mobile menu opens and closes after choosing a link", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");

  await page.getByRole("button", { name: site.ui.menuOpen }).click();
  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();

  const label = visibleSections.find((s) => s.id === "projects")?.navLabel ?? "";
  await menu.getByRole("link", { name: label, exact: true }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#projects$/);
});

test("resume PDF is served", async ({ request }) => {
  const res = await request.get(profile.resumeUrl);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
});
