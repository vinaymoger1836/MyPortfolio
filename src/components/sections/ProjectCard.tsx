import type { Project, Site } from "@/content/schema";
import { StatusBadge } from "@/components/ui/Chip";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { cx } from "@/lib/utils";

export type ProjectLabels = Site["ui"]["projects"];

/** Only what a card shows, so the client payload stays small. */
export type ProjectCardData = Pick<
  Project,
  "slug" | "title" | "tagline" | "year" | "status" | "tags" | "stack" | "links" | "cover"
>;

export const toCardData = ({
  slug, title, tagline, year, status, tags, stack, links, cover,
}: Project): ProjectCardData => ({
  slug, title, tagline, year, status, tags, stack, links, cover,
});

const STACK_PREVIEW = 5;

/**
 * Hook-free card shared by the featured list and the grid. Imported by a
 * client component, so it only takes plain data (no content-file imports).
 * The title links to the case study and its hit area stretches over the
 * whole card; the external links sit above it.
 */
export function ProjectCard({
  project,
  labels,
  featured = false,
}: {
  project: ProjectCardData;
  labels: ProjectLabels;
  featured?: boolean;
}) {
  const extraStack = project.stack.length - STACK_PREVIEW;
  const titleId = `project-${project.slug}-title`;

  return (
    <TiltCard>
      <SpotlightCard>
        <article
          id={`project-${project.slug}`}
          aria-labelledby={titleId}
          className="group tap-press relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
        >
          <div className="relative">
            <ProjectCover project={project} variant={featured ? "featured" : "card"} />
            <div className="absolute top-3 left-3">
              <StatusBadge status={project.status} label={labels.status[project.status]} />
            </div>
          </div>

          <div className={cx("flex flex-1 flex-col", featured ? "p-6 md:p-7" : "p-5")}>
            <div className="flex items-baseline justify-between gap-4">
              <h4
                id={titleId}
                className={cx(
                  "font-semibold tracking-tight",
                  featured ? "text-2xl" : "text-xl",
                )}
              >
                <a
                  href={`/projects/${project.slug}`}
                  className="rounded-sm after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:text-accent focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
                >
                  {project.title}
                </a>
              </h4>
              <span className="font-mono text-xs text-muted">{project.year}</span>
            </div>
            <p className="mt-2 text-muted text-pretty">{project.tagline}</p>

            <ul aria-label={labels.stackLabel} className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.slice(0, STACK_PREVIEW).map((s) => (
                <li
                  key={s}
                  className="rounded-lg border border-border bg-surface-2 px-2.5 py-1 font-mono text-xs leading-tight"
                >
                  {s}
                </li>
              ))}
              {extraStack > 0 && (
                <li className="rounded-lg border border-border px-2.5 py-1 font-mono text-xs leading-tight text-muted">
                  +{extraStack}
                </li>
              )}
            </ul>

            <ProjectLinks links={project.links} labels={labels} className="mt-auto pt-6" />
          </div>
        </article>
      </SpotlightCard>
    </TiltCard>
  );
}
