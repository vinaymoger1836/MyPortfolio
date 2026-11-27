import { expect, test, type Page } from "@playwright/test";
import { profile } from "../src/content/profile";
import { orderedProjects } from "../src/content/projects";
import { site } from "../src/content/site";

test.skip(({ isMobile }) => isMobile, "metadata doesn't depend on the viewport");

const jsonLd = async (page: Page) =>
  (await page.locator('script[type="application/ld+json"]').allTextContents()).map(
    (t) => JSON.parse(t) as Record<string, unknown>,
  );

test("robots.txt allows crawling and links the sitemap", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  const body = await res.text();
  expect(body).toContain("Allow: /");
  expect(body).toContain(`Sitemap: ${site.url}/sitemap.xml`);
});

test("sitemap lists the home page and every case study", async ({ request }) => {
  const res = await request.get("/sitemap.xml");
  expect(res.status()).toBe(200);
  const xml = await res.text();
  expect(xml).toContain(`<loc>${site.url}/</loc>`);
  for (const p of orderedProjects) {
    expect(xml).toContain(`<loc>${site.url}/projects/${p.slug}</loc>`);
  }
});

test("home has canonical, share card and Person JSON-LD", async ({ page, request }) => {
  await page.goto("/");
  // Next.js drops the trailing slash on the root URL; both forms are the same page.
  const root = new RegExp(`^${site.url.replaceAll(".", "\\.")}/?$`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", root);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", site.title);
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", root);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toMatch(/^https:\/\/.+\/opengraph-image/);
  const img = await request.get(new URL(og!).pathname + new URL(og!).search);
  expect(img.status()).toBe(200);
  expect(img.headers()["content-type"]).toContain("image/png");
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");

  const [ld] = await jsonLd(page);
  const graph = (ld?.["@graph"] ?? []) as Array<Record<string, unknown>>;
  const person = graph.find((n) => n["@type"] === "Person");
  expect(person).toMatchObject({ name: profile.name, jobTitle: profile.role });
  expect(person?.sameAs).toEqual(profile.socials.map((s) => s.url));
});

test("case study has canonical and CreativeWork JSON-LD", async ({ page }) => {
  const project = orderedProjects[0]!;
  await page.goto(`/projects/${project.slug}`);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${site.url}/projects/${project.slug}`,
  );
  const [ld] = await jsonLd(page);
  expect(ld).toMatchObject({
    "@type": "CreativeWork",
    name: project.title,
    description: project.tagline,
    url: `${site.url}/projects/${project.slug}`,
  });
});

test("favicon set is served", async ({ page, request }) => {
  await page.goto("/");
  for (const rel of ["icon", "apple-touch-icon"]) {
    const href = await page.locator(`link[rel="${rel}"]`).first().getAttribute("href");
    expect(href, rel).toBeTruthy();
    const res = await request.get(href!);
    expect(res.status(), rel).toBe(200);
    expect(res.headers()["content-type"], rel).toContain("image/png");
  }
});
