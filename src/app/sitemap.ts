import type { MetadataRoute } from "next";
import { orderedProjects } from "@/content/projects";
import { absoluteUrl } from "@/lib/seo";

/** Home + every case study; lastModified is the build date (as in the footer). */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    ...orderedProjects.map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
