"use client";

import { useEffect, useRef, type AnchorHTMLAttributes } from "react";
import { usePointerEffects } from "@/components/motion/useReducedMotionSafe";
import { MAGNET } from "@/components/motion/variants";
import { buttonClass } from "./Button";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "primary" | "outline" | "ghost";
};

/**
 * A ButtonLink that leans up to 10px toward the pointer once it comes within
 * 80px of the button's edge. Mouse/trackpad only; off under reduced motion.
 */
export function MagneticButton({ variant = "primary", className, ...props }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const enabled = usePointerEffects();

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const area: HTMLElement | Document = el.closest("section") ?? document;
    let frame = 0;
    let px = 0;
    let py = 0;

    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      // Distance from the pointer to the button's edge (0 when inside).
      const ex = Math.max(r.left - px, 0, px - r.right);
      const ey = Math.max(r.top - py, 0, py - r.bottom);
      const edge = Math.hypot(ex, ey);
      if (edge >= MAGNET.radius) {
        el.style.transform = "";
        return;
      }
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const pull = MAGNET.max * (1 - edge / MAGNET.radius);
      el.style.transform = `translate3d(${((dx / dist) * pull).toFixed(2)}px, ${((dy / dist) * pull).toFixed(2)}px, 0)`;
    };

    const onMove = (e: Event) => {
      const p = e as PointerEvent;
      px = p.clientX;
      py = p.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      el.style.transform = "";
    };

    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);
    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      onLeave();
    };
  }, [enabled]);

  return (
    <a ref={ref} className={buttonClass(variant, `magnetic ${className ?? ""}`)} {...props} />
  );
}
