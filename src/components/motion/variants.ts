/**
 * Shared motion constants (handoff §5). CSS reads the same numbers through
 * the custom properties in `cssVars.ts`, so JS and CSS never drift apart.
 */

/** §5 ease: cubic-bezier(0.22, 1, 0.36, 1). */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_CSS = `cubic-bezier(${EASE_OUT.join(", ")})`;

/** Durations in ms. */
export const DUR = {
  reveal: 500,
  hover: 200,
  reflow: 300,
  exit: 150,
  counter: 1200,
  rotator: 2500,
  heroTotal: 1200,
} as const;

/** Stagger steps in ms. */
export const STAGGER = { children: 60, words: 40 } as const;

/** Scroll reveal: 16px rise, fires once at 20% in view. */
export const REVEAL = { y: 16, threshold: 0.2 } as const;

/** Card tilt: max 6°, spring stiffness 150, damping 15 (mass 1). */
export const TILT = { max: 6, stiffness: 150, damping: 15 } as const;

/** Magnetic CTA: pulls ≤ 10px toward the pointer within an 80px radius. */
export const MAGNET = { max: 10, radius: 80 } as const;
