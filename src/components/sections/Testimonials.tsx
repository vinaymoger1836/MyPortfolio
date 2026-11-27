import Image from "next/image";
import { testimonials } from "@/content/testimonials";
import { Section } from "@/components/ui/Section";

/** Hidden while testimonials.ts is empty. P2 adds the slow carousel. */
export function Testimonials() {
  return (
    <Section id="testimonials">
      <ul className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t) => (
          <li key={`${t.name}-${t.quote.slice(0, 24)}`}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 md:p-7">
              <blockquote className="text-lg text-pretty">
                <p>{t.quote}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {t.avatar && (
                  <Image
                    src={t.avatar.src}
                    alt={t.avatar.alt}
                    width={48}
                    height={48}
                    className="size-12 rounded-full object-cover"
                  />
                )}
                <span>
                  {t.url ? (
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-accent">
                      {t.name}
                    </a>
                  ) : (
                    <span className="font-medium">{t.name}</span>
                  )}
                  <span className="block text-sm text-muted">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
