import { Link as LinkIcon } from "lucide-react";
import type { BrandKey, Social } from "@/content/schema";
import { site } from "@/content/site";
import { cx } from "@/lib/utils";
import { BrandIcon } from "./BrandIcon";

const brandFor: Partial<Record<Social["platform"], BrandKey>> = {
  github: "github",
  linkedin: "linkedin",
  huggingface: "huggingface",
};

/** Icon links to social profiles; the platform label is the accessible name. */
export function SocialLinks({
  socials,
  label,
  className,
}: {
  socials: Social[];
  label: string;
  className?: string;
}) {
  if (socials.length === 0) return null;

  return (
    <ul aria-label={label} className={cx("flex flex-wrap gap-2", className)}>
      {socials.map((s) => {
        const brand = brandFor[s.platform];
        return (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
            >
              {brand ? (
                <BrandIcon name={brand} className="size-[1.125rem]" />
              ) : (
                <LinkIcon className="size-[1.125rem]" aria-hidden="true" />
              )}
              <span className="sr-only">
                {s.label} {site.ui.projects.opensInNewTab}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
