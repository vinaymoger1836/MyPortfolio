import type { ReactNode } from "react";
import type { SectionId } from "@/content/schema";
import { getSection } from "@/lib/sections";
import { cx } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

/**
 * A numbered home-page section. Renders nothing when the section is hidden
 * (its content array is empty), so callers don't need to check.
 */
export function Section({
  id,
  children,
  className,
}: {
  id: SectionId;
  children: ReactNode;
  className?: string;
}) {
  const section = getSection(id);
  if (!section) return null;

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-heading`}
      className={cx("section-y border-t border-border/70", className)}
    >
      <div className="container-page">
        <SectionHeading section={section} />
        {children}
      </div>
    </section>
  );
}
