import { Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { ContactForm } from "./ContactForm";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  const ui = site.ui.contact;

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {ui.emailLabel}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center gap-2 break-all text-lg font-medium text-text underline decoration-accent/60 underline-offset-4 hover:text-accent md:text-xl"
            >
              <Mail className="size-5 shrink-0 text-accent" aria-hidden="true" />
              {profile.email}
            </a>
            <CopyEmail
              email={profile.email}
              labels={{ copy: ui.copyEmail, copied: ui.copied, failed: ui.copyFailed }}
            />
          </div>

          <h3 className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {ui.socialsLabel}
          </h3>
          <SocialLinks socials={profile.socials} label={ui.socialsLabel} className="mt-3" />
        </div>

        <div className="lg:col-span-7">
          <ContactForm
            email={profile.email}
            ownerName={profile.name}
            labels={ui}
            accessKey={site.contact.provider === "web3forms" ? site.contact.key : undefined}
            services={services.map((s) => s.title)}
          />
        </div>
      </div>
    </Section>
  );
}
