import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

/**
 * Smoke tests run against the production build: `pnpm build` first,
 * then `pnpm test:e2e` starts `next start` (or reuses a running server locally).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      testIgnore: /perf.spec.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-360",
      testIgnore: /perf.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 780 },
        isMobile: true,
        hasTouch: true,
      },
    },
    // Timing-sensitive: runs alone, after the functional tests.
    {
      name: "perf",
      testMatch: /perf.spec.ts/,
      dependencies: ["desktop", "mobile-360"],
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
