import { ArrowUpRight, CodeXml } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Project, Site } from "@/content/schema";
import { StatusBadge } from "@/components/ui/Chip";
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
  const { links } = project;
  const extraStack = project.stack.length - STACK_PREVIEW;
  const titleId = `project-${project.slug}-title`;

  return (
    <TiltCard>
      <SpotlightCard>
        <article
          id={`project-${project.slug}`}
          aria-labelledby={titleId}
          className="group tap-press flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
        >
          <div className="relative overflow-hidden">
            {project.cover ? (
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={1600}
                height={1000}
                sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                className="cover-zoom aspect-[16/10] w-full object-cover"
              />
            ) : (
              <TypeCover project={project} featured={featured} />
            )}
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
                {project.title}
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

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
              {links.live === "coming-soon" ? (
                <span className="inline-flex min-h-11 items-center rounded-full border border-dashed border-border px-4 text-sm text-muted">
                  {labels.comingSoon}
                </span>
              ) : links.live ? (
                <ExternalLink href={links.live} newTab={labels.opensInNewTab} primary>
                  {labels.liveDemo}
                  <ArrowUpRight className="arrow-nudge size-4" aria-hidden="true" />
                </ExternalLink>
              ) : null}
              {links.repo && (
                <ExternalLink href={links.repo} newTab={labels.opensInNewTab}>
                  <CodeXml className="size-4" aria-hidden="true" />
                  {labels.code}
                </ExternalLink>
              )}
            </div>
          </div>
        </article>
      </SpotlightCard>
    </TiltCard>
  );
}

function ExternalLink({
  href,
  newTab,
  primary = false,
  children,
}: {
  href: string;
  newTab: string;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
        primary
          ? "bg-accent text-accent-ink hover:bg-accent/90"
          : "border border-border text-text hover:border-accent hover:text-accent",
      )}
    >
      {children}
      <span className="sr-only">{newTab}</span>
    </a>
  );
}

/**
 * Typographic cover used until real covers land in P5: title, stack and an
 * accent stroke on the surface colour, one system for every card. Decorative.
 */
function TypeCover({
  project,
  featured,
}: {
  project: ProjectCardData;
  featured: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="cover-zoom dot-grid relative flex aspect-[16/10] w-full flex-col justify-end overflow-hidden border-b border-border bg-surface-2 p-5 md:p-6"
    >
      <span className="absolute top-0 right-6 h-full w-px bg-accent/50" />
      <span className="absolute right-0 bottom-10 h-px w-2/5 bg-accent/50" />
      <span
        className={cx(
          "font-semibold leading-none tracking-[-0.04em] text-text",
          featured ? "text-[clamp(2.25rem,6vw,4rem)]" : "text-[clamp(2rem,5vw,2.75rem)]",
        )}
      >
        {project.title}
      </span>
      <span className="mt-3 line-clamp-1 font-mono text-xs text-muted">
        {project.stack.slice(0, 4).join(" · ")}
      </span>
    </div>
  );
}
