import { expect, test, type Page } from "@playwright/test";
import { profile } from "../src/content/profile";
import { projects } from "../src/content/projects";
import { services } from "../src/content/services";
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

test("nav links scroll to their section", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav (the mobile menu has its own test)");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: site.ui.primaryNav });
  for (const id of ["projects", "contact", "about"] as const) {
    const label = visibleSections.find((s) => s.id === id)?.navLabel;
    if (!label) continue;
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

/* ---------- contact ---------- */

const c = site.ui.contact;
const contactForm = (page: Page) => page.getByRole("form", { name: c.formLabel });

async function fillValid(page: Page) {
  const form = contactForm(page);
  await form.locator("#contact-name").fill("Test Person");
  await form.locator("#contact-email").fill("test@example.com");
  await form.locator("#contact-message").fill("Hello from the smoke test.");
}

/** Never let a test reach the real Web3Forms API. */
async function mockWeb3Forms(page: Page, reply: { status: number; json: object }) {
  const bodies: Record<string, unknown>[] = [];
  await page.route("https://api.web3forms.com/**", async (route) => {
    bodies.push(route.request().postDataJSON() as Record<string, unknown>);
    await route.fulfill({ status: reply.status, json: reply.json });
  });
  return bodies;
}

async function provider(page: Page) {
  return contactForm(page).getAttribute("data-provider");
}

test("contact form flags an invalid email and clears it once fixed", async ({ page }) => {
  await page.goto("/");
  const form = contactForm(page);
  await fillValid(page);
  const email = form.locator("#contact-email");
  await email.fill("not-an-email");
  await form.getByRole("button", { name: c.submit }).click();
  await expect(form.getByText(c.errors.email)).toBeVisible();
  await expect(email).toHaveAttribute("aria-invalid", "true");
  await expect(email).toBeFocused();

  await email.fill("fixed@example.com");
  await expect(form.getByText(c.errors.email)).toBeHidden();
  await expect(email).not.toHaveAttribute("aria-invalid");
});

test("Services CTA pre-selects Freelance and the service", async ({ page }) => {
  test.skip(services.length === 0, "no services");
  await page.goto("/");
  const service = services[services.length - 1]!;
  await page.locator(`a[data-contact-service="${service.title}"]`).click();
  await expect(page).toHaveURL(/#contact$/);
  const form = contactForm(page);
  await expect(form.getByRole("radio", { name: c.types.freelance })).toBeChecked();
  const select = form.getByRole("combobox", { name: c.service });
  await expect(select).toBeVisible();
  await expect(select).toHaveValue(service.title);

  // Hidden again for other enquiry types.
  await form.getByText(c.types.job, { exact: true }).click();
  await expect(select).toBeHidden();
});

test("copy email confirms with a toast", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: c.copyEmail }).click();
  await expect(page.getByRole("status").filter({ hasText: c.copied })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(profile.email);
});

test("contact form without a key falls back to email", async ({ page }) => {
  await page.goto("/");
  test.skip((await provider(page)) !== "mailto", "built with a Web3Forms key");
  const form = contactForm(page);
  await expect(form).toHaveAttribute("action", `mailto:${profile.email}`);
  await expect(form.getByText(c.mailtoNote)).toBeVisible();
});

test("Web3Forms: a valid message shows the success state", async ({ page }) => {
  const bodies = await mockWeb3Forms(page, {
    status: 200,
    json: { success: true, body: { message: "Email sent successfully!" } },
  });
  await page.goto("/");
  test.skip((await provider(page)) !== "web3forms", "built without a Web3Forms key");
  await fillValid(page);
  await contactForm(page).getByRole("button", { name: c.submit }).click();

  const heading = page.getByRole("heading", { name: c.successTitle });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();
  expect(bodies).toHaveLength(1);
  expect(bodies[0]).toMatchObject({
    name: "Test Person",
    email: "test@example.com",
    message: "Hello from the smoke test.",
    type: c.types.job,
  });
  expect(bodies[0]!.access_key).toBeTruthy();
  expect(bodies[0]).not.toHaveProperty("botcheck");

  await page.getByRole("button", { name: c.sendAnother }).click();
  await expect(contactForm(page).getByRole("button", { name: c.submit })).toBeVisible();
});

test("Web3Forms: a failed send shows the error and an email fallback", async ({ page }) => {
  await mockWeb3Forms(page, {
    status: 429,
    json: { success: false, message: "Too many requests. Please try later!" },
  });
  await page.goto("/");
  test.skip((await provider(page)) !== "web3forms", "built without a Web3Forms key");
  await fillValid(page);
  await contactForm(page).getByRole("button", { name: c.submit }).click();

  const alert = page.getByRole("alert").filter({ hasText: c.errorTitle });
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("Too many requests");
  await expect(alert.getByRole("link", { name: c.errorFallback })).toHaveAttribute(
    "href",
    new RegExp(`^mailto:${profile.email}\\?subject=`),
  );
});

test("Web3Forms: the honeypot sends nothing", async ({ page }) => {
  const bodies = await mockWeb3Forms(page, { status: 200, json: { success: true } });
  await page.goto("/");
  test.skip((await provider(page)) !== "web3forms", "built without a Web3Forms key");
  await fillValid(page);
  await page.locator('input[name="botcheck"]').evaluate((el: HTMLInputElement) => {
    el.checked = true;
  });
  await contactForm(page).getByRole("button", { name: c.submit }).click();
  await expect(page.getByRole("heading", { name: c.successTitle })).toBeVisible();
  expect(bodies).toHaveLength(0);
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
