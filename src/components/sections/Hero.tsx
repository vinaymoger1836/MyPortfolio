import { ArrowUpRight, Download } from "lucide-react";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Hero() {
  const ui = site.ui.hero;

  return (
    <section
      aria-labelledby="hero-name"
      className="relative isolate overflow-hidden"
    >
      {/* Static dot grid, faded toward the edges. The pointer spotlight lands in P2. */}
      <div
        aria-hidden="true"
        className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]"
      />

      <div className="container-page pt-16 pb-20 md:pt-24 lg:pt-32 lg:pb-28">
        <p className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          {profile.availability.label}
        </p>

        <h1
          id="hero-name"
          className="mt-8 text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance"
        >
          {profile.name}
        </h1>

        <p className="mt-6 text-[clamp(1.25rem,2.6vw,1.75rem)] leading-snug tracking-tight text-text">
          {profile.role}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-sm text-muted">
          {profile.roles.map((role, i) => (
            <li key={role} className="flex items-center gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-accent">
                  ·
                </span>
              )}
              {role}
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-[52ch] text-muted text-pretty md:text-[1.1875rem]">
          {profile.pitch}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <ButtonLink href="#projects">
            {ui.viewWork}
            <ArrowUpRight className="size-4 rotate-90" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href={profile.resumeUrl} download variant="outline">
            <Download className="size-4" aria-hidden="true" />
            {ui.downloadCv}
          </ButtonLink>
          <ButtonLink href="#contact" variant="ghost">
            {ui.contact}
          </ButtonLink>
        </div>

        <SocialLinks
          socials={profile.socials}
          label={ui.socialsLabel}
          className="mt-10"
        />
      </div>
    </section>
  );
}
