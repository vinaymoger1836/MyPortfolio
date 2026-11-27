import { ArrowRight, Check } from "lucide-react";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Services() {
  const ui = site.ui.services;

  return (
    <Section id="services">
      <ul className="grid gap-6 md:grid-cols-2">
        {services.map((service, i) => {
          const titleId = `service-${i}-title`;
          return (
            <Reveal as="li" index={i} key={service.title}>
              <div className="card-lift flex h-full flex-col rounded-2xl border border-border bg-surface p-6 md:p-7">
                <h3 id={titleId} className="text-xl font-semibold tracking-tight md:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-3 text-muted text-pretty">{service.summary}</p>

                <h4 className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {ui.includesLabel}
                </h4>
                <ul className="mt-3 space-y-2">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-1.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                {service.proof.length > 0 && (
                  <>
                    <h4 className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                      {ui.proofLabel}
                    </h4>
                    <ul className="mt-2 flex flex-wrap gap-x-4">
                      {service.proof.map((p) => (
                        <li key={p.label}>
                          <a
                            href={p.href}
                            className="inline-flex min-h-11 items-center text-sm text-text underline decoration-accent/60 underline-offset-4 hover:text-accent"
                          >
                            {p.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
                  <ul aria-label={ui.engagementLabel} className="flex flex-wrap gap-1.5">
                    {service.engagement.map((e) => (
                      <li key={e}>
                        <Chip tone="muted">{ui.engagement[e]}</Chip>
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href="#contact" variant="outline" aria-describedby={titleId}>
                    {ui.cta}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
