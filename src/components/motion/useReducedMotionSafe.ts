"use client";

import { useSyncExternalStore } from "react";

const REDUCE = "(prefers-reduced-motion: reduce)";
const FINE = "(hover: hover) and (pointer: fine)";

function subscribeTo(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

const subscribeReduce = subscribeTo(REDUCE);
const subscribeFine = subscribeTo(FINE);

/** Non-hook check for event handlers and effects. */
export const prefersReducedMotion = () => window.matchMedia(REDUCE).matches;

/** True for a mouse or trackpad; false on touch-only devices. */
export const hasFinePointer = () => window.matchMedia(FINE).matches;

/**
 * True when the user asks for reduced motion. On the server and during
 * hydration it reports `true`, so nothing moves before the real value is known.
 */
export function useReducedMotionSafe() {
  return useSyncExternalStore(subscribeReduce, prefersReducedMotion, () => true);
}

/** True for a mouse or trackpad. `false` on the server (no pointer effects). */
export function useFinePointer() {
  return useSyncExternalStore(subscribeFine, hasFinePointer, () => false);
}

/** Pointer effects (tilt, magnet, spotlight) run only when both allow it. */
export function usePointerEffects() {
  const reduce = useReducedMotionSafe();
  const fine = useFinePointer();
  return fine && !reduce;
}
