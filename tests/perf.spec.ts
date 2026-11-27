import { expect, test } from "@playwright/test";

/**
 * Scroll performance. Runs in its own Playwright project after the other
 * tests finish (playwright.config.ts), so parallel tests don't compete for
 * the CPU and show up as long tasks.
 */
const SETTLE = 2500;

test("full scroll has no long tasks and no layout shift", async ({ page }) => {
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
