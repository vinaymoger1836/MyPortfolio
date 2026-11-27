import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { STAGGER } from "@/components/motion/variants";
import { ButtonLink } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { visibleSections } from "@/lib/sections";
import { HeroSpotlight } from "./HeroSpotlight";
import { RoleRotator } from "./RoleRotator";

/**
 * Load sequence (handoff §5), in ms: pill → name word by word → role →
 * pitch → CTAs → socials, all done by ~1.2s. Pure CSS (`.hero-in`), so it
 * runs and ends visible even without JS.
 */
const T = { pill: 0, name: 80, role: 260, rotator: 320, pitch: 380, ctas: 460, socials: 640, cue: 700 };

const at = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const ui = site.ui.hero;
  const words = profile.name.split(" ");
  const next = visibleSections[0];

  return (
    <section
      aria-labelledby="hero-name"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_30%_40%,black,transparent_70%)]"
      />
      <HeroSpotlight />

      <div className="container-page pt-16 pb-20 md:pt-24 lg:pt-32 lg:pb-28">
        <p
          className="hero-in inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text"
          style={at(T.pill)}
        >
          <span aria-hidden="true" className="pulse-dot size-2 rounded-full bg-accent" />
          {profile.availability.label}
        </p>

        <h1
          id="hero-name"
          className="mt-8 text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance"
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`}>
              <span className="hero-word" style={at(T.name + i * STAGGER.words)}>
                {word}
              </span>
              {i < words.length - 1 && " "}
            </span>
          ))}
        </h1>

        <p
          className="hero-in mt-6 text-[clamp(1.25rem,2.6vw,1.75rem)] leading-snug tracking-tight text-text"
          style={at(T.role)}
        >
          {profile.role}
        </p>

        <div className="hero-in mt-4 font-mono text-sm text-muted md:text-base" style={at(T.rotator)}>
          <RoleRotator roles={profile.roles} delay={T.rotator} />
          <ul className="roles-static flex flex-wrap gap-x-3 gap-y-1">
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
        </div>

        <p
          className="hero-in mt-8 max-w-[52ch] text-muted text-pretty md:text-[1.1875rem]"
          style={at(T.pitch)}
        >
          {profile.pitch}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="hero-in inline-block" style={at(T.ctas)}>
            <MagneticButton href="#projects">
              {ui.viewWork}
              <ArrowUpRight className="size-4 rotate-90" aria-hidden="true" />
            </MagneticButton>
          </span>
          <span className="hero-in inline-block" style={at(T.ctas + STAGGER.children)}>
            <ButtonLink href={profile.resumeUrl} download variant="outline">
              <Download className="size-4" aria-hidden="true" />
              {ui.downloadCv}
            </ButtonLink>
          </span>
          <span className="hero-in inline-block" style={at(T.ctas + STAGGER.children * 2)}>
            <ButtonLink href="#contact" variant="ghost">
              {ui.contact}
            </ButtonLink>
          </span>
        </div>

        <div className="mt-10 flex items-end justify-between gap-6">
          <div className="hero-in" style={at(T.socials)}>
            <SocialLinks socials={profile.socials} label={ui.socialsLabel} />
          </div>
          {next && (
            <a
              href={`#${next.id}`}
              className="hero-in hidden size-11 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent md:inline-flex"
              style={at(T.cue)}
            >
              <ArrowDown className="scroll-cue size-4" aria-hidden="true" />
              <span className="sr-only">{ui.scrollCue}</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
