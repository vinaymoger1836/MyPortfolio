import { ArrowUpRight, CodeXml, CirclePlay } from "lucide-react";
import type { ReactNode } from "react";
import type { Project } from "@/content/schema";
import { cx } from "@/lib/utils";

export type ProjectLinkLabels = {
  liveDemo: string;
  comingSoon: string;
  code: string;
  opensInNewTab: string;
  /** Only needed where `demoVideo` links are shown. */
  demoVideo?: string;
};

/**
 * Live demo / "coming soon" chip / code (and demo video) links. A
 * 'coming-soon' live link is a muted chip, never a dead link. Hook-free.
 */
export function ProjectLinks({
  links,
  labels,
  className,
}: {
  links: Project["links"];
  labels: ProjectLinkLabels;
  className?: string;
}) {
  return (
    <div className={cx("flex flex-wrap items-center gap-2", className)}>
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
      {links.demoVideo && labels.demoVideo && (
        <ExternalLink href={links.demoVideo} newTab={labels.opensInNewTab}>
          <CirclePlay className="size-4" aria-hidden="true" />
          {labels.demoVideo}
        </ExternalLink>
      )}
    </div>
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
        "relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
        primary
          ? "bg-accent text-accent-ink hover:bg-accent/90"
          : "border border-border bg-surface text-text hover:border-accent hover:text-accent",
      )}
    >
      {children}
      <span className="sr-only">{newTab}</span>
    </a>
  );
}
