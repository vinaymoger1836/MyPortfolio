import Image from "next/image";
import type { Project } from "@/content/schema";
import { cx } from "@/lib/utils";

export type CoverData = Pick<Project, "slug" | "title" | "stack" | "cover">;

type Variant = "featured" | "card" | "hero";

const sizes: Record<Variant, string> = {
  featured: "(min-width: 1024px) 50vw, 100vw",
  card: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  hero: "(min-width: 1200px) 1136px, 100vw",
};

const titleSize: Record<Variant, string> = {
  featured: "text-[clamp(2.25rem,6vw,4rem)]",
  card: "text-[clamp(2rem,5vw,2.75rem)]",
  hero: "text-[clamp(2.75rem,9vw,6.5rem)]",
};

/**
 * A project's 16:10 cover: the real image, or (until P5) a typographic cover
 * of title, stack and an accent stroke on the surface colour. Shared by the
 * cards and the case-study hero so the View Transition morph lines up;
 * `data-vt-cover` is the hook the navigation script names on the card.
 * Hook-free, so client components can render it too.
 */
export function ProjectCover({
  project,
  variant,
  className,
}: {
  project: CoverData;
  variant: Variant;
  className?: string;
}) {
  const hero = variant === "hero";
  return (
    <div
      data-vt-cover={project.slug}
      className={cx("relative overflow-hidden", hero && "case-cover", className)}
    >
      {project.cover ? (
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          width={1600}
          height={1000}
          sizes={sizes[variant]}
          preload={hero}
          className={cx("aspect-[16/10] w-full object-cover", !hero && "cover-zoom")}
        />
      ) : (
        <div
          aria-hidden="true"
          className={cx(
            "dot-grid relative flex aspect-[16/10] w-full flex-col justify-end overflow-hidden bg-surface-2",
            hero ? "p-6 md:p-10" : "cover-zoom border-b border-border p-5 md:p-6",
          )}
        >
          <span className="absolute top-0 right-6 h-full w-px bg-accent/50" />
          <span className="absolute right-0 bottom-10 h-px w-2/5 bg-accent/50" />
          <span
            className={cx(
              "font-semibold leading-none tracking-[-0.04em] text-text",
              titleSize[variant],
            )}
          >
            {project.title}
          </span>
          <span className="mt-3 line-clamp-1 font-mono text-xs text-muted">
            {project.stack.slice(0, hero ? 6 : 4).join(" · ")}
          </span>
        </div>
      )}
    </div>
  );
}
