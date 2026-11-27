import type { ReactNode } from "react";
import type { ProjectStatus } from "@/content/schema";
import { cx } from "@/lib/utils";

type Tone = "default" | "core" | "familiar" | "muted";

const tones: Record<Tone, string> = {
  default: "border-border bg-surface-2 text-text",
  core: "border-accent/45 bg-accent/10 text-text",
  familiar: "border-dashed border-border text-muted",
  muted: "border-border text-muted",
};

/** Small mono label for stack items, skills and tags. */
export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-xs leading-tight",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusDot: Record<ProjectStatus, string> = {
  live: "bg-accent",
  "in-progress": "border border-muted",
  "design-case-study": "border border-dashed border-muted",
};

/** Project status badge: Live / In progress / Design case study. */
export function StatusBadge({
  status,
  label,
}: {
  status: ProjectStatus;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg/80 px-2.5 py-1 font-mono text-xs uppercase tracking-[0.12em] text-text">
      <span
        aria-hidden="true"
        className={cx("size-2 rounded-full", statusDot[status])}
      />
      {label}
    </span>
  );
}
