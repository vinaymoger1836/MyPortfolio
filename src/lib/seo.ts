import type { Metadata } from "next";
import { profile } from "@/content/profile";
import type { Project } from "@/content/schema";
import { site } from "@/content/site";
import { fill } from "@/lib/utils";

/**
 * Metadata and JSON-LD (handoff §2). Everything comes from the content files.
 *
 * Canonical URLs always point at production (`site.url`). On Vercel preview
 * builds, `metadataBase` is the preview's branch URL so share images resolve
 * on the preview itself (handy for LinkedIn's Post Inspector).
 */
const previewHost =
  process.env.VERCEL_ENV === "preview"
    ? (process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL)
    : undefined;

export const metadataBase = new URL(previewHost ? `https://${previewHost}` : site.url);

/** Absolute production URL for a path. */
export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();

const PERSON_ID = absoluteUrl("/#person");

/** Defaults for every page (root layout). */
export const rootMetadata: Metadata = {
  metadataBase,
  title: site.title,
  description: site.description,
  applicationName: site.title,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  openGraph: {
    type: "website",
    siteName: site.title,
    locale: "en_IN",
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
};

/** Home page: canonical URL and OpenGraph URL. */
export const homeMetadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
  openGraph: {
    type: "website",
    siteName: site.title,
    locale: "en_IN",
    title: site.title,
    description: site.description,
    url: absoluteUrl("/"),
  },
};

export function projectTitle(project: Project) {
  return fill(site.ui.caseStudy.metaTitle, { title: project.title, name: profile.name });
}

/** Case-study page metadata. The share image comes from its opengraph-image route. */
export function projectMetadata(project: Project): Metadata {
  const title = projectTitle(project);
  const url = absoluteUrl(`/projects/${project.slug}`);
  return {
    title,
    description: project.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: project.tagline,
      url,
      siteName: site.title,
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title, description: project.tagline },
  };
}

/** schema.org Person (and the WebSite it belongs to), for the home page. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: profile.name,
        url: absoluteUrl("/"),
        jobTitle: profile.role,
        description: profile.pitch,
        email: `mailto:${profile.email}`,
        homeLocation: { "@type": "Place", name: profile.location },
        image: absoluteUrl("/opengraph-image"),
        sameAs: profile.socials.map((s) => s.url),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: site.title,
        url: absoluteUrl("/"),
        description: site.description,
        author: { "@id": PERSON_ID },
      },
    ],
  };
}

/** schema.org CreativeWork for a case study. */
export function projectJsonLd(project: Project) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  const live = project.links.live !== "coming-soon" ? project.links.live : undefined;
  const sameAs = [live, project.links.repo].filter((u): u is string => Boolean(u));
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#work`,
    name: project.title,
    headline: project.title,
    description: project.tagline,
    url,
    dateCreated: String(project.year),
    keywords: [...project.tags, ...project.stack].join(", "),
    image: `${url}/opengraph-image`,
    creator: { "@type": "Person", "@id": PERSON_ID, name: profile.name, url: absoluteUrl("/") },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
