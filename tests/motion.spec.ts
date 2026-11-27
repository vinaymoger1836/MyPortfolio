import { expect, test } from "@playwright/test";
import { projects } from "../src/content/projects";
import { visibleSections } from "../src/lib/sections";

/** Time for the page to load, hydrate and go idle (Lenis loads on idle). */
const SETTLE = 2500;

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing moves beyond fades", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(SETTLE);

    // Lenis is never loaded.
    expect(await page.evaluate(() => document.documentElement.classList.contains("lenis"))).toBe(false);

    // Marquee stops; its duplicate track is gone.
    const track = page.locator(".marquee-track").first();
    if ((await track.count()) > 0) {
      expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
      await expect(page.locator(".marquee-copy").first()).toBeHidden();
    }

    // Rotator is replaced by the static role list.
    await expect(page.locator(".rotator")).toBeHidden();
    await expect(page.locator(".roles-static")).toBeVisible();

    // Reveals fade without moving: no transform on any of them.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const transforms = await page
      .locator("[data-reveal]")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
    expect(new Set(transforms)).toEqual(new Set(["none"]));

    // No pointer effects are mounted.
    await expect(page.locator(".hero-spot")).toHaveCount(0);
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all content is visible at its final state", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500); // CSS hero sequence finishes

    for (const s of visibleSections) {
      await expect(page.locator(`#${s.id}`)).toBeVisible();
    }
    await expect(page.locator("#projects article")).toHaveCount(projects.length);

    const hidden = await page
      .locator("[data-reveal], .hero-in, .hero-word")
      .evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== "1").length);
    expect(hidden).toBe(0);
  });
});

test("touch devices get no tilt", async ({ page, isMobile }) => {
  test.skip(!isMobile, "touch only");
  await page.goto("/");
  await page.waitForTimeout(SETTLE);

  const card = page.locator("#projects article").first();
  await card.scrollIntoViewIfNeeded();
  // The whole card links to its case study (P3); stay on the page.
  await page.evaluate(() =>
    document.addEventListener("click", (e) => e.preventDefault(), { capture: true }),
  );
  await card.tap({ position: { x: 20, y: 20 } });
  // TiltCard is the article's grandparent (TiltCard > SpotlightCard > article).
  const transform = await card.evaluate(
    (el) => el.parentElement?.parentElement?.style.transform ?? "",
  );
  expect(transform).not.toContain("rotate");
});
