import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { getNeighbours } from "@/content/projects";
import type { Project } from "@/content/schema";
import { site } from "@/content/site";
import { Chip, StatusBadge } from "@/components/ui/Chip";
import { ProjectCover } from "@/components/ui/ProjectCover";
import { ProjectLinks } from "@/components/ui/ProjectLinks";
import { Reveal } from "@/components/ui/Reveal";
import { cx, pad2 } from "@/lib/utils";
import { CaseStudyGallery } from "./CaseStudyGallery";

type SectionKey = keyof typeof site.ui.caseStudy.sections;

/** Values up to this length read as a metric; longer ones as a sentence. */
const METRIC_MAX = 24;

/**
 * One case study (handoff §3): hero, then Problem → Approach → Architecture
 * → Key features → Outcomes → Gallery → Stack, then previous/next. Sections
 * without content are left out and the rest are numbered in order.
 */
export function CaseStudy({ project }: { project: Project }) {
  const ui = site.ui.caseStudy;
  const outcomesFirst = project.outcomes.length > 0;

  const note = project.note && (
    <aside
      aria-label={ui.noteLabel}
      className="rounded-2xl border border-border border-l-2 border-l-accent bg-surface p-5 text-[0.9375rem] text-muted text-pretty"
    >
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-text">{ui.noteLabel}</p>
      <p className="mt-2">{project.note}</p>
    </aside>
  );

  const sections: Array<{ key: SectionKey; body: ReactNode } | null> = [
    project.problem
      ? { key: "problem", body: <p className="max-w-[65ch] text-pretty">{project.problem}</p> }
      : null,
    project.approach.length > 0
      ? {
          key: "approach",
          body: (
            <ol className="space-y-5">
              {project.approach.map((step, i) => (
                <li key={step} className="flex gap-5">
                  <span className="pt-1 font-mono text-xs text-accent">{pad2(i + 1)}</span>
                  <p className="max-w-[65ch] text-pretty">{step}</p>
                </li>
              ))}
            </ol>
          ),
        }
      : null,
    project.architecture || project.architectureNote
      ? {
          key: "architecture",
          body: (
            <div className="space-y-5">
              {project.architecture && (
                <figure>
                  <Image
                    src={project.architecture.src}
                    alt={project.architecture.alt}
                    width={1600}
                    height={1000}
                    sizes="(min-width: 1200px) 760px, 100vw"
                    className="w-full rounded-2xl border border-border bg-surface-2"
                  />
                  {project.architecture.caption && (
                    <figcaption className="mt-3 text-sm text-muted">
                      {project.architecture.caption}
                    </figcaption>
                  )}
                </figure>
              )}
              {project.architectureNote && (
                <p className="dot-grid rounded-2xl border border-border bg-surface-2 p-5 font-mono text-sm leading-relaxed text-pretty md:p-6">
                  {project.architectureNote}
                </p>
              )}
            </div>
          ),
        }
      : null,
    project.features.length > 0
      ? {
          key: "features",
          body: (
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.features.map((f) => (
                <li
                  key={f}
                  className="flex gap-3 rounded-xl border border-border bg-surface p-4 text-[0.9375rem] text-pretty"
                >
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {f}
                </li>
              ))}
            </ul>
          ),
        }
      : null,
    outcomesFirst
      ? {
          key: "outcomes",
          body: (
            <div className="space-y-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                {project.outcomes.map((o, i) => {
                  const metric = o.value.length <= METRIC_MAX;
                  return (
                    <Reveal
                      key={o.label}
                      index={i}
                      className={cx(
                        "flex flex-col-reverse justify-end gap-3 rounded-2xl border border-border bg-surface p-6",
                        !metric && project.outcomes.length % 2 === 1 && i === project.outcomes.length - 1 && "sm:col-span-2",
                      )}
                    >
                      <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                        {o.label}
                      </dt>
                      <dd
                        className={cx(
                          metric
                            ? "font-mono text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-accent"
                            : "text-[0.9375rem] text-pretty",
                        )}
                      >
                        {o.value}
                      </dd>
                    </Reveal>
                  );
                })}
              </dl>
              {note}
            </div>
          ),
        }
      : null,
    project.gallery && project.gallery.length > 0
      ? {
          key: "gallery",
          body: (
            <CaseStudyGallery
              images={project.gallery}
              labels={ui.lightbox}
            />
          ),
        }
      : null,
    {
      key: "stack",
      body: (
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
        </ul>
      ),
    },
  ];
  const shown = sections.filter((s) => s !== null);

  return (
    <article aria-labelledby="case-title">
      <Hero project={project} note={outcomesFirst ? null : note} />

      {shown.map((s, i) => (
        <section
          key={s.key}
          id={s.key}
          aria-labelledby={`${s.key}-heading`}
          className="border-t border-border/70 py-16 md:py-24"
        >
          <div className="container-page grid gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-4">
              <p aria-hidden="true" className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                {pad2(i + 1)} /
              </p>
              <h2
                id={`${s.key}-heading`}
                className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]"
              >
                {ui.sections[s.key]}
              </h2>
            </Reveal>
            <Reveal index={1} className="lg:col-span-8">
              {s.body}
            </Reveal>
          </div>
        </section>
      ))}

      <MoreProjects slug={project.slug} />
    </article>
  );
}

/** Hero: status, title, tagline, honest labels, links, facts and cover. */
function Hero({ project, note }: { project: Project; note: ReactNode }) {
  const ui = site.ui.caseStudy;
  const labels = site.ui.projects;
  const timeline = [String(project.year), project.duration].filter(Boolean).join(" · ");
  const meta = [
    { label: ui.meta.role, value: project.role },
    { label: ui.meta.timeline, value: timeline },
    { label: ui.meta.team, value: project.team },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  return (
    <header className="container-page pt-8 pb-16 md:pt-12 md:pb-24">
      <a
        href="/#projects"
        className="group inline-flex min-h-11 items-center gap-2 rounded-full text-sm text-muted hover:text-accent"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
        {ui.backToProjects}
      </a>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="hero-in" style={{ "--d": "0ms" } as CSSProperties}>
            <StatusBadge status={project.status} label={labels.status[project.status]} />
          </div>
          <h1
            id="case-title"
            className="hero-in mt-5 text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-balance"
            style={{ "--d": "80ms" } as CSSProperties}
          >
            {project.title}
          </h1>
          <p
            className="hero-in mt-6 max-w-[55ch] text-lg text-muted text-pretty md:text-xl"
            style={{ "--d": "160ms" } as CSSProperties}
          >
            {project.tagline}
          </p>
          {project.status === "design-case-study" && (
            <p
              data-design-note=""
              className="hero-in mt-6 inline-flex rounded-xl border border-dashed border-border px-4 py-3 font-mono text-sm text-text"
              style={{ "--d": "200ms" } as CSSProperties}
            >
              {ui.designNote}
            </p>
          )}
          <div className="hero-in mt-8" style={{ "--d": "240ms" } as CSSProperties}>
            <ProjectLinks
              links={project.links}
              labels={{ ...labels, demoVideo: ui.demoVideo }}
            />
          </div>
        </div>

        <div className="hero-in space-y-5 lg:col-span-5" style={{ "--d": "320ms" } as CSSProperties}>
          <dl className="divide-y divide-border rounded-2xl border border-border bg-surface">
            {meta.map((m) => (
              <div key={m.label} className="grid gap-1 p-5 sm:grid-cols-[7rem_1fr] sm:gap-4">
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted sm:pt-1">
                  {m.label}
                </dt>
                <dd className="text-[0.9375rem] text-pretty">{m.value}</dd>
              </div>
            ))}
          </dl>
          {note}
        </div>
      </div>

      <ProjectCover
        project={project}
        variant="hero"
        className="mt-12 rounded-2xl border border-border md:mt-16"
      />
    </header>
  );
}

/** Previous / next project, in home display order, wrapping around. */
function MoreProjects({ slug }: { slug: string }) {
  const ui = site.ui.caseStudy;
  const pair = getNeighbours(slug);
  if (!pair) return null;
  const items = [
    { dir: "previous" as const, project: pair.previous, label: ui.previous },
    { dir: "next" as const, project: pair.next, label: ui.next },
  ];

  return (
    <nav aria-label={ui.moreProjects} className="border-t border-border/70 py-16 md:py-24">
      <ul className="container-page grid gap-5 md:grid-cols-2">
        {items.map(({ dir, project, label }) => (
          <li key={dir}>
            <a
              href={`/projects/${project.slug}`}
              rel={dir === "previous" ? "prev" : "next"}
              className={cx(
                "card-lift group flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-6 md:p-8",
                dir === "next" && "md:items-end md:text-right",
              )}
            >
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {dir === "previous" && <ArrowLeft className="size-4" aria-hidden="true" />}
                {label}
                {dir === "next" && <ArrowRight className="arrow-nudge size-4" aria-hidden="true" />}
              </span>
              <span className="text-2xl font-semibold tracking-tight group-hover:text-accent md:text-3xl">
                {project.title}
              </span>
              <span className="line-clamp-2 text-[0.9375rem] text-muted text-pretty">
                {project.tagline}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
