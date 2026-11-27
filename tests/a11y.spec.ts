import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { orderedProjects, projects } from "../src/content/projects";
import { accentSchema } from "../src/content/schema";
import { site } from "../src/content/site";

/**
 * axe (WCAG 2.x A/AA) on the home page, a case study and the 404, in both
 * themes and both accent presets, plus the interactive states. Zero
 * serious or critical violations allowed.
 */
const THEMES = ["dark", "light"] as const;
const ACCENTS = accentSchema.options;
const PAGES = ["/", `/projects/${orderedProjects[0]!.slug}`, "/projects/does-not-exist"];

/** Final visual state: reveals shown, no transitions or animations mid-way. */
async function settle(page: Page) {
  await page.addStyleTag({
    content: "*,*::before,*::after{transition:none!important;animation:none!important}",
  });
  await page.evaluate(() => {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  });
}

async function open(page: Page, path: string, theme: string, accent: string) {
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
  await page.goto(path);
  await page.evaluate((a) => {
    document.documentElement.dataset.accent = a;
  }, accent);
  await settle(page);
}

async function expectNoSerious(page: Page, label: string, include?: string) {
  let axe = new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]);
  if (include) axe = axe.include(include);
  const { violations } = await axe.analyze();
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  const report = serious.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join("\n  ")}`,
  );
  expect(report, label).toEqual([]);
}

test.describe("axe", () => {
  test.skip(({ isMobile }) => isMobile, "desktop pass; mobile menu checked below");

  for (const path of PAGES) {
    for (const theme of THEMES) {
      for (const accent of ACCENTS) {
        test(`${path} · ${theme} · ${accent}`, async ({ page }) => {
          await open(page, path, theme, accent);
          await expect(page.locator("html")).toHaveClass(new RegExp(`\\b${theme}\\b`));
          await expectNoSerious(page, `${path} ${theme} ${accent}`);
        });
      }
    }
  }

  test("contact form with errors shown", async ({ page }) => {
    for (const theme of THEMES) {
      await open(page, "/", theme, site.accent);
      await page
        .getByRole("form", { name: site.ui.contact.formLabel })
        .getByRole("button", { name: site.ui.contact.submit })
        .click();
      await expect(page.getByText(site.ui.contact.errors.name)).toBeVisible();
      await expectNoSerious(page, `form errors ${theme}`, "#contact");
    }
  });

  test("lightbox open", async ({ page }) => {
    const project = projects.find((p) => (p.gallery?.length ?? 0) > 0);
    test.skip(!project, "no gallery");
    for (const theme of THEMES) {
      await open(page, `/projects/${project!.slug}`, theme, site.accent);
      await page.locator("#gallery a").first().click();
      const dialog = page.getByRole("dialog", { name: site.ui.caseStudy.lightbox.label });
      await expect(dialog).toBeVisible();
      await expectNoSerious(page, `lightbox ${theme}`, "dialog");
    }
  });
});

test("mobile menu open", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  for (const theme of THEMES) {
    await open(page, "/", theme, site.accent);
    await page.getByRole("button", { name: site.ui.menuOpen }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await expectNoSerious(page, `mobile menu ${theme}`, "#mobile-menu");
  }
});
