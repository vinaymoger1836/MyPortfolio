import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /** Position in a staggered group: delay = index × 60ms. */
  index?: number;
  /** Rise from below (default) or slide in from the left. */
  dir?: "up" | "left";
  children: ReactNode;
};

/**
 * Scroll reveal (handoff §5): opacity 0 → 1 and a 16px rise, once, at 20%
 * in view. Server component: it only adds `data-reveal`; the shared
 * RevealObserver and globals.css do the rest. Rendered visible, so it reads
 * without JS. Keep hover transforms on an inner element, not on this one.
 */
export function Reveal({
  as: Tag = "div",
  index = 0,
  dir = "up",
  style,
  children,
  ...rest
}: RevealProps) {
  return (
    <Tag
      data-reveal={dir}
      style={{ "--i": index, ...style } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
