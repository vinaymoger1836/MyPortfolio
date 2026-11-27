import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { CaseStudy } from "@/components/sections/CaseStudy";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { getProject, projects } from "@/content/projects";
import { projectJsonLd, projectMetadata } from "@/lib/seo";

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
  return projectMetadata(project);
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
      <JsonLd data={projectJsonLd(project)} />
    </>
  );
}
