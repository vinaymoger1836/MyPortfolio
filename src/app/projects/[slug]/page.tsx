import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { fill } from "@/lib/utils";

// Every slug is prerendered at build; anything else is the custom 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = fill(site.ui.caseStudy.metaTitle, {
    title: project.title,
    name: profile.name,
  });
  const url = `/projects/${project.slug}`;
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
    },
    twitter: { card: "summary_large_image", title, description: project.tagline },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <SiteHeader base="/" />
      <main id="main" tabIndex={-1} className="page-fade focus:outline-none">
        <CaseStudy project={project} />
      </main>
      <Footer />
    </>
  );
}
