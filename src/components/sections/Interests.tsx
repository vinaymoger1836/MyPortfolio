import { interests } from "@/content/interests";
import { icons } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function Interests() {
  return (
    <Section id="interests">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest, i) => {
          const Icon = icons[interest.icon];
          return (
            <Reveal as="li" index={i} key={interest.title}>
              <div className="card-lift interest h-full rounded-2xl border border-border bg-surface p-5 md:p-6">
                <span className="interest-icon grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
                  <Icon className="interest-glyph size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {interest.title}
                </h3>
                {interest.line && (
                  <p className="mt-2 text-muted text-pretty">{interest.line}</p>
                )}
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
