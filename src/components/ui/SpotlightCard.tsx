"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePointerEffects } from "@/components/motion/useReducedMotionSafe";
import { cx } from "@/lib/utils";

/**
 * Cursor-tracked spotlight on the card border. A soft accent glow is moved
 * with `transform` (no repaint of a gradient) inside a 1px ring cut out with
 * a CSS mask; the ring fades in on hover. Pointer coordinates are written in
 * rAF, never through React state. Mouse/trackpad only.
 */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);
  const enabled = usePointerEffects();

  useEffect(() => {
    const el = ref.current;
    const glow = glowRef.current;
    if (!enabled || !el || !glow) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let rect: DOMRect | null = null;

    const paint = () => {
      frame = 0;
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e: PointerEvent) => {
      rect ??= el.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      rect = null;
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return (
    <div ref={ref} className={cx("spotlight relative h-full rounded-2xl", className)}>
      {children}
      <span aria-hidden="true" className="spotlight-ring">
        <span ref={glowRef} className="spotlight-glow" />
      </span>
    </div>
  );
}
