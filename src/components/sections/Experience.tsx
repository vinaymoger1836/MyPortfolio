import { ArrowUpRight } from "lucide-react";
import { experience } from "@/content/experience";
import type { Experience as Entry } from "@/content/schema";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";

export function Experience() {
  const ui = site.ui.experience;
  const { entries, certifications } = experience;

  return (
    <Section id="experience">
      {entries.length > 0 && (
        <ol className="timeline relative ml-4 space-y-12 border-l border-border pl-8 md:ml-[1.125rem] md:pl-10">
          {entries.map((entry) => (
            <TimelineEntry key={`${entry.org}-${entry.title}`} entry={entry} />
          ))}
        </ol>
      )}

      {certifications.length > 0 && (
        <div className="mt-16">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {ui.certificationsLabel}
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {certifications.map((cert, i) => (
              <Reveal as="li" index={i} key={cert.name}>
                <div className="card-lift flex h-full flex-col rounded-2xl border border-border bg-surface p-5">
                  <p className="font-semibold tracking-tight">{cert.name}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {cert.issuer} · {cert.year}
                  </p>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex min-h-11 w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                    >
                      {ui.verify}
                      <span className="sr-only">
                        {" "}
                        {cert.name} {site.ui.projects.opensInNewTab}
                      </span>
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

function TimelineEntry({ entry }: { entry: Entry }) {
  const ui = site.ui.experience;
  const shown = entry.mobileBullets ?? entry.bullets.length;
  const extra = entry.bullets.slice(shown);
  const end = entry.end === "present" ? ui.present : entry.end;
  const dates = [entry.start, end].filter(Boolean).join(" – ");
  const meta = [dates, entry.location].filter(Boolean).join(" · ");

  return (
    <Reveal as="li" dir="left" className="relative">
      <span
        aria-hidden="true"
        className="absolute top-1 -left-12 grid size-8 place-items-center rounded-lg border border-border bg-surface font-mono text-sm text-text md:-left-[3.625rem] md:size-9"
      >
        {entry.org.charAt(0)}
      </span>

      {entry.kind === "education" && (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {ui.educationLabel}
        </p>
      )}
      <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
        {entry.title}
      </h3>
      <p className="mt-1 text-text">{entry.org}</p>
      {meta && <p className="mt-1 font-mono text-xs text-muted">{meta}</p>}

      {entry.bullets.length > 0 && (
        <ul className="mt-5 max-w-[70ch] list-disc space-y-2.5 pl-5 marker:text-accent">
          {entry.bullets.map((b, i) => (
            <li key={b.slice(0, 40)} className={i >= shown ? "hidden md:list-item" : undefined}>
              {b}
            </li>
          ))}
        </ul>
      )}

      {extra.length > 0 && (
        <details className="mt-3 md:hidden">
          <summary className="inline-flex min-h-11 items-center text-sm font-medium text-accent">
            {ui.showMore}
          </summary>
          <ul className="mt-2 list-disc space-y-2.5 pl-5 marker:text-accent">
            {extra.map((b) => (
              <li key={b.slice(0, 40)}>{b}</li>
            ))}
          </ul>
        </details>
      )}

      {entry.stack && entry.stack.length > 0 && (
        <ul aria-label={ui.stackLabel} className="mt-5 flex flex-wrap gap-1.5">
          {entry.stack.map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
        </ul>
      )}
    </Reveal>
  );
}
