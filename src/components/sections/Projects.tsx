import { featuredProjects, gridProjects } from "@/content/projects";
import { projectTags } from "@/content/schema";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { toCardData } from "./ProjectCard";
import { ProjectsExplorer } from "./ProjectsExplorer";

export function Projects() {
  const all = [...featuredProjects, ...gridProjects];
  // Only offer tags that at least one project uses, in the content-model order.
  const tags = projectTags.filter((t) => all.some((p) => p.tags.includes(t)));

  return (
    <Section id="projects">
      <ProjectsExplorer
        featured={featuredProjects.map(toCardData)}
        rest={gridProjects.map(toCardData)}
        tags={tags}
        labels={site.ui.projects}
      />
    </Section>
  );
}
