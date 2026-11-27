import { site } from "@/content/site";
import { skills } from "@/content/skills";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Chip } from "@/components/ui/Chip";
import { icons } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { cx } from "@/lib/utils";

/** Bento layout on a 6-column grid: a wide first tile, then 2+2+2, then 3+3. */
const spans = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
];

export function Skills() {
  const ui = site.ui.skills;

  return (
    <Section id="skills">
      <ul aria-label={ui.legendLabel} className="mb-6 flex flex-wrap gap-3">
        <li>
          <Chip tone="core">{ui.core}</Chip>
        </li>
        <li>
          <Chip tone="familiar">{ui.familiar}</Chip>
        </li>
      </ul>

      <ul className="grid gap-4 md:grid-cols-6">
        {skills.groups.map((group, i) => {
          const Icon = icons[group.icon];
          return (
            <li
              key={group.title}
              className={cx(
                "rounded-2xl border border-border bg-surface p-5 md:p-6",
                spans[i] ?? "md:col-span-3",
              )}
            >
              <h3 className="flex items-center gap-3 text-lg font-semibold tracking-tight">
                <span className="grid size-9 place-items-center rounded-lg border border-border bg-surface-2 text-accent">
                  <Icon className="size-[1.125rem]" aria-hidden="true" />
                </span>
                {group.title}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill.name}>
                    <Chip tone={skill.level}>
                      {skill.name}
                      <span className="sr-only">
                        {" "}
                        ({skill.level === "core" ? ui.core : ui.familiar})
                      </span>
                    </Chip>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      {skills.marquee.length > 0 && (
        <div className="mt-12">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {ui.marqueeLabel}
          </h3>
          {/* Static row; P2 turns it into the paused-on-hover marquee. */}
          <ul className="mt-5 flex flex-wrap gap-x-7 gap-y-4">
            {skills.marquee.map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-2 text-muted"
              >
                {item.logo && (
                  <BrandIcon name={item.logo} className="size-5 shrink-0" />
                )}
                <span className="text-[0.9375rem]">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
