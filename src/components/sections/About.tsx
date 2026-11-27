import { Check, MapPin } from "lucide-react";
import Image from "next/image";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

export function About() {
  const ui = site.ui.about;
  const { availability } = profile;
  const flags = [
    { on: availability.fullTime, label: ui.fullTime },
    { on: availability.freelance, label: ui.freelance },
    { on: availability.remote, label: ui.remote },
  ].filter((f) => f.on);

  return (
    <Section id="about">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        <Reveal className="md:col-span-4">
          <Portrait />
        </Reveal>

        <Reveal index={1} className="md:col-span-8">
          <div className="max-w-[65ch] space-y-5 text-pretty">
            {profile.bio.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {ui.locationLabel}
              </dt>
              <dd className="mt-2 flex items-start gap-2">
                <MapPin className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  {profile.location}
                  <span className="block text-muted">{profile.timezone}</span>
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {ui.availabilityLabel}
              </dt>
              <dd className="mt-2">
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {flags.map((f) => (
                    <li key={f.label} className="flex items-center gap-1.5">
                      <Check className="size-4 text-accent" aria-hidden="true" />
                      {f.label}
                    </li>
                  ))}
                </ul>
                {availability.note && (
                  <p className="mt-1 text-muted">{availability.note}</p>
                )}
              </dd>
            </div>
            {profile.lookingFor && (
              <div className="sm:col-span-2">
                <dt className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                  {ui.lookingForLabel}
                </dt>
                <dd className="mt-2 max-w-[65ch] text-pretty">
                  {profile.lookingFor}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </div>

      {profile.facts.length > 0 && (
        <div className="mt-14">
          <h3 className="sr-only">{ui.factsLabel}</h3>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {profile.facts.map((fact, i) => (
              <Reveal as="li" index={i} key={fact.label} className="bg-surface p-5 md:p-7">
                <p className="font-mono text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-none tracking-tight text-text">
                  <Counter value={fact.value} prefix={fact.prefix} suffix={fact.suffix} />
                </p>
                <p className="mt-3 text-sm text-muted text-pretty">{fact.label}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

/** Photo when one is set; otherwise the "VM" monogram tile (handoff §6). */
function Portrait() {
  if (profile.photo) {
    return (
      <Image
        src={profile.photo.src}
        alt={profile.photo.alt}
        width={800}
        height={1000}
        sizes="(min-width: 768px) 33vw, 100vw"
        className="aspect-[4/5] w-full max-w-sm rounded-2xl border border-border object-cover"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${site.ui.about.photoFallbackLabel}: ${profile.name}`}
      className="dot-grid grid aspect-[4/5] w-full max-w-sm place-items-center rounded-2xl border-2 border-accent/70 bg-surface"
    >
      <span
        aria-hidden="true"
        className="font-mono text-[clamp(4rem,12vw,7rem)] font-medium tracking-[0.08em] text-text"
      >
        {profile.shortName}
      </span>
    </div>
  );
}
