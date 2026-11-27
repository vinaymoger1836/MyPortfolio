import { expect, test, type Page } from "@playwright/test";
import { getNeighbours, orderedProjects, projects } from "../src/content/projects";
import { site } from "../src/content/site";

const ui = site.ui.caseStudy;

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

test("every project slug is prerendered with its own page", async ({ page }) => {
  const errors = trackErrors(page);
  for (const project of projects) {
    const res = await page.goto(`/projects/${project.slug}`);
    expect(res?.status(), project.slug).toBe(200);
    // Static HTML from the build, not rendered on demand.
    expect(res?.headers()["x-nextjs-prerender"] ?? res?.headers()["x-nextjs-cache"], project.slug).toBeTruthy();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(project.title);
    await expect(page).toHaveTitle(new RegExp(project.title));

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow, `horizontal scroll on ${project.slug}`).toBe(false);

    // No dead links; in-page anchors resolve.
    const hrefs = await page
      .locator("a")
      .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      expect(href, "empty or '#' href").not.toMatch(/^#?$/);
      if (href.startsWith("#")) await expect(page.locator(href)).toHaveCount(1);
    }

    // Honest label for design case studies only.
    await expect(page.locator("[data-design-note]")).toHaveCount(
      project.status === "design-case-study" ? 1 : 0,
    );
  }
  expect(errors).toEqual([]);
});

test("unknown slug shows the custom 404", async ({ page }) => {
  const res = await page.goto("/projects/does-not-exist");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(site.ui.notFound.title);
  await expect(page.getByRole("link", { name: site.ui.notFound.home })).toHaveAttribute("href", "/");
});

test("card opens its case study and Back returns to the projects section", async ({ page }) => {
  await page.goto("/");
  const project = orderedProjects[0]!;
  await page.locator(`#project-${project.slug}`).getByRole("link", { name: project.title, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}$`));
  await expect(page.locator("h1")).toHaveText(project.title);

  await page.getByRole("link", { name: ui.backToProjects }).click();
  await expect(page).toHaveURL(/\/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("previous/next follow the home order and wrap around", async ({ page }) => {
  for (const project of [orderedProjects[0]!, orderedProjects.at(-1)!]) {
    await page.goto(`/projects/${project.slug}`);
    const pair = getNeighbours(project.slug)!;
    const nav = page.getByRole("navigation", { name: ui.moreProjects });
    await expect(nav.locator('a[rel="prev"]')).toHaveAttribute("href", `/projects/${pair.previous.slug}`);
    await expect(nav.locator('a[rel="next"]')).toHaveAttribute("href", `/projects/${pair.next.slug}`);
  }
});

test("each case study has its own share image", async ({ page, request }) => {
  for (const project of projects) {
    await page.goto(`/projects/${project.slug}`);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og, project.slug).toContain(`/projects/${project.slug}/opengraph-image`);
    const res = await request.get(new URL(og!).pathname);
    expect(res.status(), project.slug).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

test("lightbox is fully keyboard operable", async ({ page }) => {
  const project = projects.find((p) => (p.gallery?.length ?? 0) > 1);
  test.skip(!project, "no project has a multi-image gallery");
  const images = project!.gallery!;
  const errors = trackErrors(page);
  await page.goto(`/projects/${project!.slug}`);

  const thumbs = page.locator("#gallery a");
  await expect(thumbs).toHaveCount(images.length);
  await thumbs.nth(1).focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: ui.lightbox.label });
  await expect(dialog).toBeVisible();
  const position = (n: number) =>
    ui.lightbox.position.replace("{n}", String(n)).replace("{total}", String(images.length));
  await expect(dialog.getByText(position(2))).toBeVisible();
  await expect(dialog.getByRole("img")).toHaveAttribute("alt", images[1]!.alt);
  // Focus starts inside the dialog.
  expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);

  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText(position(3 > images.length ? 1 : 3))).toBeVisible();
  await page.keyboard.press("Home");
  await expect(dialog.getByText(position(1))).toBeVisible();
  await page.keyboard.press("ArrowLeft"); // wraps to the last image
  await expect(dialog.getByText(position(images.length))).toBeVisible();
  await page.keyboard.press("End");
  await expect(dialog.getByText(position(images.length))).toBeVisible();

  // Tab and Shift+Tab stay inside.
  for (const key of ["Tab", "Tab", "Tab", "Tab", "Shift+Tab", "Shift+Tab", "Shift+Tab"]) {
    await page.keyboard.press(key);
    expect(await dialog.evaluate((d) => d.contains(document.activeElement)), key).toBe(true);
  }

  // Buttons work from the keyboard too.
  await dialog.getByRole("button", { name: ui.lightbox.next }).focus();
  await page.keyboard.press("Enter");
  await expect(dialog.getByText(position(1))).toBeVisible();

  // Esc closes and focus returns to the thumbnail that opened it.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(thumbs.nth(1)).toBeFocused();
  expect(errors).toEqual([]);
});

test("gallery thumbnails link to the full image without JS", async ({ browser }) => {
  const project = projects.find((p) => (p.gallery?.length ?? 0) > 0);
  test.skip(!project, "no project has a gallery");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`/projects/${project!.slug}`);
  await expect(page.locator("h1")).toHaveText(project!.title);
  await expect(page.locator("#gallery a").first()).toHaveAttribute("href", project!.gallery![0]!.src);
  // Every section is visible without JS.
  for (const el of await page.locator("main section").all()) {
    await expect(el).toBeVisible();
  }
  await context.close();
});

test("hero cover is the shared element for the page transition", async ({ page }) => {
  const slug = orderedProjects[0]!.slug;
  const vtName = () =>
    page.locator(".case-cover").evaluate((el) => getComputedStyle(el).viewTransitionName);

  await page.goto(`/projects/${slug}`);
  expect(await vtName()).toBe("project-cover");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  expect(await vtName()).toBe("none");
});
