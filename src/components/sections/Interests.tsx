import { interests } from "@/content/interests";
import { icons } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";

export function Interests() {
  return (
    <Section id="interests">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest) => {
          const Icon = icons[interest.icon];
          return (
            <li
              key={interest.title}
              className="rounded-2xl border border-border bg-surface p-5 md:p-6"
            >
              <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {interest.title}
              </h3>
              {interest.line && (
                <p className="mt-2 text-muted text-pretty">{interest.line}</p>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
