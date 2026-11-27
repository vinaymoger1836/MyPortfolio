import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/utils";

/**
 * Infinite logo row, pure CSS: the list is drawn twice and the track slides
 * by half its width, so the loop is seamless. The copy is hidden from
 * assistive tech. Pauses on hover, focus and tap; under reduced motion it
 * stops and wraps into a static row.
 */
export function Marquee({
  items,
  label,
  className,
}: {
  items: Array<{ key: string; node: ReactNode }>;
  label?: string;
  className?: string;
}) {
  const list = (copy: boolean) => (
    <ul
      aria-label={copy ? undefined : label}
      aria-hidden={copy || undefined}
      className={cx("marquee-list", copy && "marquee-copy")}
    >
      {items.map((item) => (
        <li key={item.key} className="flex shrink-0 items-center">
          {item.node}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={cx("marquee", className)}
      style={{ "--marquee-dur": `${Math.max(items.length * 3, 20)}s` } as CSSProperties}
    >
      <div className="marquee-track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
