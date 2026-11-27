import type { CSSProperties } from "react";
import { DUR, EASE_OUT_CSS, REVEAL, STAGGER, TILT } from "./variants";

/**
 * Samples a damped spring (mass 1) into a CSS `linear()` easing, so a plain
 * CSS transition can move with the same spring feel as the JS tilt.
 * Runs at build time only (imported by the server layout).
 */
function springEasing(stiffness: number, damping: number, samples = 40) {
  const w0 = Math.sqrt(stiffness);
  const zeta = damping / (2 * w0);
  const wd = w0 * Math.sqrt(1 - zeta * zeta);
  // Settles to within ~0.1% after this many seconds.
  const duration = 7 / (zeta * w0);
  const points: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = (i / samples) * duration;
    const x =
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
    points.push(i === samples ? "1" : x.toFixed(3));
  }
  return {
    easing: `linear(${points.join(", ")})`,
    ms: Math.round(duration * 1000),
  };
}

const spring = springEasing(TILT.stiffness, TILT.damping);

/** Custom properties spread onto <html> so CSS shares the §5 numbers. */
export const motionCssVars = {
  "--ease-out": EASE_OUT_CSS,
  "--ease-spring": spring.easing,
  "--dur-spring": `${spring.ms}ms`,
  "--dur-reveal": `${DUR.reveal}ms`,
  "--dur-hover": `${DUR.hover}ms`,
  "--dur-reflow": `${DUR.reflow}ms`,
  "--dur-counter": `${DUR.counter}ms`,
  "--dur-rotator": `${DUR.rotator}ms`,
  "--stagger": `${STAGGER.children}ms`,
  "--stagger-words": `${STAGGER.words}ms`,
  "--reveal-y": `${REVEAL.y}px`,
} as CSSProperties;
