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
  await card.tap({ position: { x: 20, y: 20 } });
  // TiltCard is the article's grandparent (TiltCard > SpotlightCard > article).
  const transform = await card.evaluate(
    (el) => el.parentElement?.parentElement?.style.transform ?? "",
  );
  expect(transform).not.toContain("rotate");
});

test("full scroll has no long tasks and no layout shift", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop trace only");
  await page.addInitScript(() => {
    const w = window as unknown as { __perf: { long: number[]; cls: number; armed: boolean } };
    w.__perf = { long: [], cls: 0, armed: false };
    new PerformanceObserver((list) => {
      if (!w.__perf.armed) return;
      for (const e of list.getEntries()) w.__perf.long.push(Math.round(e.duration));
    }).observe({ type: "longtask", buffered: false });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
        if (!e.hadRecentInput) w.__perf.cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto("/");
  await page.waitForTimeout(SETTLE);
  await page.evaluate(() => {
    (window as unknown as { __perf: { armed: boolean } }).__perf.armed = true;
  });
  await page.mouse.move(600, 400);

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 300) {
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1500);

  const perf = await page.evaluate(
    () => (window as unknown as { __perf: { long: number[]; cls: number } }).__perf,
  );
  expect(perf.long.filter((d) => d > 50), "long tasks (ms)").toEqual([]);
  expect(perf.cls).toBe(0);
});
