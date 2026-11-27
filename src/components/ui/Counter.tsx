"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/components/motion/useReducedMotionSafe";
import { DUR, REVEAL } from "@/components/motion/variants";

/**
 * A fact number that counts up over 1.2s the first time it comes into view.
 * The final value is server-rendered and also reserves the width (an
 * invisible copy in the same grid cell), so counting never shifts layout.
 * Digits are written to the DOM in rAF; screen readers get the final value.
 */
export function Counter({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || value <= 0) return;
    const decimals = Number.isInteger(value) ? 0 : 1;
    let frame = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DUR.counter, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (value * eased).toFixed(decimals);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: REVEAL.threshold },
    );
    el.textContent = (0).toFixed(decimals);
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = String(value);
    };
  }, [value]);

  const full = `${prefix}${value}${suffix}`;
  return (
    <>
      <span className="sr-only">{full}</span>
      <span aria-hidden="true" className="inline-grid tabular-nums">
        <span className="invisible [grid-area:1/1]">{full}</span>
        <span className="[grid-area:1/1]">
          {prefix}
          <span ref={ref}>{value}</span>
          {suffix}
        </span>
      </span>
    </>
  );
}
