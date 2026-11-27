import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Vercel already sends `X-Robots-Tag: noindex` on preview deployments.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
