"use client";

import { useEffect, useState } from "react";
import type { ProjectTag } from "@/content/schema";
import { cx, fill } from "@/lib/utils";
import {
  ProjectCard,
  type ProjectCardData,
  type ProjectLabels,
} from "./ProjectCard";

/**
 * Tag filter over the featured list and the grid. Static filtering for now;
 * P2 adds the animated reflow. Without JS every project is shown.
 */
export function ProjectsExplorer({
  featured,
  rest,
  tags,
  labels,
}: {
  featured: ProjectCardData[];
  rest: ProjectCardData[];
  tags: ProjectTag[];
  labels: ProjectLabels;
}) {
  const [tag, setTag] = useState<ProjectTag | null>(null);
  const matches = (p: ProjectCardData) => tag === null || p.tags.includes(tag);
  const shownFeatured = featured.filter(matches);
  const shownRest = rest.filter(matches);
  const count = shownFeatured.length + shownRest.length;

  // A link to a project hidden by the filter (e.g. a Services proof link) resets it.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith("#project-")) setTag(null);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const chips: Array<{ value: ProjectTag | null; label: string }> = [
    { value: null, label: labels.all },
    ...tags.map((t) => ({ value: t, label: t })),
  ];

  return (
    <>
      <div
        role="group"
        aria-label={labels.filterLabel}
        className="flex flex-wrap gap-2"
      >
        {chips.map((chip) => {
          const pressed = tag === chip.value;
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={pressed}
              onClick={() => setTag(chip.value)}
              className={cx(
                "inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 font-mono text-sm transition-colors",
                pressed
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border bg-surface text-muted hover:border-accent hover:text-text",
              )}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
      <p aria-live="polite" className="mt-4 font-mono text-xs text-muted">
        {fill(labels.showing, { count })}
      </p>

      {count === 0 && <p className="mt-10 text-muted">{labels.empty}</p>}

      {shownFeatured.length > 0 && (
        <div className="mt-10">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {labels.featuredLabel}
          </h3>
          <ul className="mt-5 grid gap-6 lg:grid-cols-2">
            {shownFeatured.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} labels={labels} featured />
              </li>
            ))}
          </ul>
        </div>
      )}

      {shownRest.length > 0 && (
        <div className="mt-14">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {labels.moreLabel}
          </h3>
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shownRest.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} labels={labels} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
