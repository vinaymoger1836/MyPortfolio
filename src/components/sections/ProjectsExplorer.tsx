"use client";

import { useEffect, useRef, useState } from "react";
import { useFlipList } from "@/components/motion/flip";
import type { ProjectTag } from "@/content/schema";
import { cx, fill } from "@/lib/utils";
import {
  ProjectCard,
  type ProjectCardData,
  type ProjectLabels,
} from "./ProjectCard";

/**
 * Tag filter over the featured list and the grid, with an animated reflow:
 * leaving cards fade out, the rest slide to their new places and new ones
 * fade in (see `useFlipList`). Without JS every project is shown.
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
  // `selected` follows the chips at once; `tag` (what's rendered) follows
  // after the leaving cards have faded out.
  const [selected, setSelected] = useState<ProjectTag | null>(null);
  const [tag, setTag] = useState<ProjectTag | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const transition = useFlipList(listRef, tag);

  const filterBy = (t: ProjectTag | null) => (p: ProjectCardData) =>
    t === null || p.tags.includes(t);
  const shownFeatured = featured.filter(filterBy(tag));
  const shownRest = rest.filter(filterBy(tag));
  const count = shownFeatured.length + shownRest.length;

  const choose = (next: ProjectTag | null) => {
    if (next === selected) return;
    setSelected(next);
    const keep = new Set(
      [...featured, ...rest].filter(filterBy(next)).map((p) => p.slug),
    );
    const leaving = new Set(
      [...shownFeatured, ...shownRest]
        .map((p) => p.slug)
        .filter((slug) => !keep.has(slug)),
    );
    if (!featured.some(filterBy(next))) leaving.add(GROUP.featured);
    if (!rest.some(filterBy(next))) leaving.add(GROUP.more);
    transition(leaving, () => setTag(next));
  };

  // A link to a project hidden by the filter (e.g. a Services proof link) resets it.
  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith("#project-")) {
        setSelected(null);
        setTag(null);
      }
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
          const pressed = selected === chip.value;
          return (
            <button
              key={chip.label}
              type="button"
              aria-pressed={pressed}
              onClick={() => choose(chip.value)}
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

      <div ref={listRef}>
        {shownFeatured.length > 0 && (
          <div className="mt-10">
            <h3
              data-flip-key={GROUP.featured}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
            >
              {labels.featuredLabel}
            </h3>
            <ul className="mt-5 grid gap-6 lg:grid-cols-2">
              {shownFeatured.map((p) => (
                <li key={p.slug} data-flip-key={p.slug}>
                  <ProjectCard project={p} labels={labels} featured />
                </li>
              ))}
            </ul>
          </div>
        )}

        {shownRest.length > 0 && (
          <div className="mt-14">
            <h3
              data-flip-key={GROUP.more}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
            >
              {labels.moreLabel}
            </h3>
            <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shownRest.map((p) => (
                <li key={p.slug} data-flip-key={p.slug}>
                  <ProjectCard project={p} labels={labels} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

/** Flip keys for the two group headings (slugs never start with "~"). */
const GROUP = { featured: "~featured", more: "~more" } as const;
