"use client";

import { useEffect } from "react";
import { REVEAL } from "./variants";

/**
 * One shared IntersectionObserver for every `[data-reveal]` element.
 *
 * Content is server-rendered visible. Only after this runs does
 * `html.reveal-ready` hide what is still below the fold, so the page reads
 * fine with JS off or failing. Anything already on screen (or above it)
 * is marked shown first and never flashes.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"),
    );
    const vh = window.innerHeight;
    const pending: HTMLElement[] = [];
    for (const el of els) {
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-in");
      else pending.push(el);
    }
    root.classList.add("reveal-ready");
    if (pending.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // Tall elements may never reach 20% of their own height.
          const enough =
            entry.intersectionRatio >= REVEAL.threshold ||
            entry.intersectionRect.height >=
              (entry.rootBounds?.height ?? vh) * REVEAL.threshold;
          if (!enough) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { threshold: [0, REVEAL.threshold] },
    );
    pending.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
