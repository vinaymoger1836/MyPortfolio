"use client";

import { useEffect, useRef } from "react";
import { usePointerEffects } from "@/components/motion/useReducedMotionSafe";

/** Diameter of the spotlight, in px. Matches `.hero-spot` in globals.css. */
const SIZE = 560;

/**
 * Cursor-following radial spotlight over the hero dot grid. The light is a
 * masked circle moved with `transform`; inside it an accent dot grid is
 * counter-moved so its dots stay aligned with the static grid beneath.
 * No React state per move, no repaint. Mouse/trackpad only.
 */
export function HeroSpotlight() {
  const enabled = usePointerEffects();
  const spotRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    const grid = gridRef.current;
    const section = spot?.closest("section");
    if (!enabled || !spot || !grid || !section) return;

    let frame = 0;
    let x = 0;
    let y = 0;
    let rect: DOMRect | null = null;

    const paint = () => {
      frame = 0;
      const tx = x - SIZE / 2;
      const ty = y - SIZE / 2;
      spot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      grid.style.transform = `translate3d(${-tx}px, ${-ty}px, 0)`;
    };
    const onEnter = () => {
      rect = section.getBoundingClientRect();
      grid.style.width = `${rect.width}px`;
      grid.style.height = `${rect.height}px`;
      spot.classList.add("is-on");
    };
    const onMove = (e: PointerEvent) => {
      if (!rect) onEnter();
      x = e.clientX - rect!.left;
      y = e.clientY - rect!.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onLeave = () => {
      rect = null;
      spot.classList.remove("is-on");
    };
    // The section moves under a still pointer while scrolling.
    const onScroll = () => {
      rect = null;
    };

    section.addEventListener("pointerenter", onEnter);
    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      section.removeEventListener("pointerenter", onEnter);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={spotRef} aria-hidden="true" className="hero-spot">
      <div ref={gridRef} className="hero-spot-grid dot-grid-accent" />
    </div>
  );
}
