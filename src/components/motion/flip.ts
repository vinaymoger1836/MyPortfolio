"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import { prefersReducedMotion } from "./useReducedMotionSafe";
import { DUR, EASE_OUT_CSS } from "./variants";

const KEY = "data-flip-key";

type Rects = Map<string, DOMRect>;

function items(container: HTMLElement | null) {
  return container
    ? Array.from(container.querySelectorAll<HTMLElement>(`[${KEY}]`))
    : [];
}

/**
 * Animated list reflow without a layout library (stands in for Motion's
 * AnimatePresence + `layout`). Items carry `data-flip-key`.
 *
 * 1. `transition(leaving, commit)` fades the leaving items out (150ms),
 *    records every item's position, then calls `commit` (the state update).
 * 2. After React commits (`dep` changes), staying items slide from their old
 *    spot to the new one (FLIP, 300ms) and new items fade/scale in.
 *
 * Only transform and opacity animate. Under reduced motion it's a plain fade.
 */
export function useFlipList(
  containerRef: RefObject<HTMLElement | null>,
  dep: unknown,
) {
  const first = useRef<Rects | null>(null);
  const token = useRef(0);

  const transition = useCallback(
    (leaving: Set<string>, commit: () => void) => {
      const run = ++token.current;
      const els = items(containerRef.current);
      // A quick second click: reset anything still mid-animation first.
      els.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));
      const reduce = prefersReducedMotion();
      const out = els
        .filter((el) => leaving.has(el.getAttribute(KEY) ?? ""))
        .map((el) =>
          el.animate(
            reduce
              ? [{ opacity: 1 }, { opacity: 0 }]
              : [
                  { opacity: 1, transform: "scale(1)" },
                  { opacity: 0, transform: "scale(0.96)" },
                ],
            { duration: DUR.exit, easing: EASE_OUT_CSS, fill: "forwards" },
          ).finished,
        );

      void Promise.allSettled(out).then(() => {
        if (run !== token.current) return; // a newer choice superseded this one
        const rects: Rects = new Map();
        for (const el of items(containerRef.current)) {
          rects.set(el.getAttribute(KEY) ?? "", el.getBoundingClientRect());
        }
        first.current = rects;
        commit();
      });
    },
    [containerRef],
  );

  useLayoutEffect(() => {
    const before = first.current;
    if (!before) return;
    first.current = null;
    const reduce = prefersReducedMotion();
    const timing = { duration: DUR.reflow, easing: EASE_OUT_CSS };

    for (const el of items(containerRef.current)) {
      // Drop any exit animation left on a reused node.
      el.getAnimations().forEach((a) => a.cancel());
      const old = before.get(el.getAttribute(KEY) ?? "");
      if (!old) {
        el.animate(
          reduce
            ? [{ opacity: 0 }, { opacity: 1 }]
            : [
                { opacity: 0, transform: "scale(0.96)" },
                { opacity: 1, transform: "scale(1)" },
              ],
          { ...timing, fill: "backwards" },
        );
        continue;
      }
      if (reduce) continue;
      const now = el.getBoundingClientRect();
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)` },
          { transform: "translate(0, 0)" },
        ],
        timing,
      );
    }
  }, [dep, containerRef]);

  return transition;
}
