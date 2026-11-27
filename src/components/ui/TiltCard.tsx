"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePointerEffects } from "@/components/motion/useReducedMotionSafe";
import { TILT } from "@/components/motion/variants";
import { cx } from "@/lib/utils";

/**
 * Subtle 3D tilt (max 6°) that follows the pointer on a spring
 * (stiffness 150, damping 15) and settles back on leave. The spring runs in
 * rAF and writes `transform` directly, so React never re-renders.
 * Mouse/trackpad only; off on touch and under reduced motion.
 */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = usePointerEffects();

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    // [rotateX, rotateY] state, velocity and target, in degrees.
    const pos = [0, 0];
    const vel = [0, 0];
    const target = [0, 0];
    let frame = 0;
    let last = 0;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      let moving = false;
      for (let i = 0; i < 2; i++) {
        const force = -TILT.stiffness * (pos[i]! - target[i]!) - TILT.damping * vel[i]!;
        vel[i]! += force * dt;
        pos[i]! += vel[i]! * dt;
        if (Math.abs(vel[i]!) > 0.01 || Math.abs(pos[i]! - target[i]!) > 0.01) moving = true;
      }
      if (moving) {
        el.style.transform = `perspective(1000px) rotateX(${pos[0]!.toFixed(3)}deg) rotateY(${pos[1]!.toFixed(3)}deg)`;
        frame = requestAnimationFrame(step);
      } else {
        pos[0] = target[0]!;
        pos[1] = target[1]!;
        el.style.transform =
          target[0] === 0 && target[1] === 0
            ? ""
            : `perspective(1000px) rotateX(${pos[0]}deg) rotateY(${pos[1]}deg)`;
        frame = 0;
      }
    };
    const kick = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(step);
    };

    let rect: DOMRect | null = null;
    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e: PointerEvent) => {
      rect ??= el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 … 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      target[0] = -ny * 2 * TILT.max;
      target[1] = nx * 2 * TILT.max;
      kick();
    };
    const onLeave = () => {
      rect = null;
      target[0] = 0;
      target[1] = 0;
      kick();
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      el.style.transform = "";
    };
  }, [enabled]);

  return (
    <div ref={ref} className={cx("h-full will-change-transform", className)}>
      {children}
    </div>
  );
}
