"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "./useReducedMotionSafe";

type LenisInstance = InstanceType<typeof import("lenis").default>;

/**
 * Lenis smooth scroll, loaded after the page has loaded and gone idle so it
 * never competes with first paint. Never loaded under reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    let lenis: LenisInstance | null = null;
    let cancelled = false;
    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onReduceChange = () => {
      if (reduceQuery.matches) teardown();
    };

    const onClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      const href = link?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;

      event.preventDefault();
      const oldURL = window.location.href;
      history.pushState(null, "", href);
      // Listeners (e.g. the project filter reset) run before we measure.
      window.dispatchEvent(
        new HashChangeEvent("hashchange", { oldURL, newURL: window.location.href }),
      );
      const keyboard = event.detail === 0;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => scrollToHash(href, keyboard)),
      );
    };

    const scrollToHash = (hash: string, keyboard: boolean) => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target || !lenis) return;
      if (hash === "#top") lenis.scrollTo(0);
      // Lenis honours the target's scroll-margin-top (globals.css), which
      // already clears the sticky nav, as a native jump would.
      else lenis.scrollTo(target);
      // Keyboard users continue tabbing from the target, as with a native jump.
      if (keyboard) {
        if (!target.hasAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
          target.setAttribute("data-anchor-focus", "");
        }
        target.focus({ preventScroll: true });
      }
    };

    function teardown() {
      cancelled = true;
      document.removeEventListener("click", onClick);
      reduceQuery.removeEventListener("change", onReduceChange);
      lenis?.destroy();
      lenis = null;
    }

    const start = async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled || prefersReducedMotion()) return;
      lenis = new Lenis({ autoRaf: true, anchors: false });
      document.addEventListener("click", onClick);
    };

    // Safari has no requestIdleCallback.
    const idle = (cb: () => void) =>
      typeof window.requestIdleCallback === "function"
        ? window.requestIdleCallback(cb, { timeout: 2000 })
        : setTimeout(cb, 200);
    const schedule = () => idle(() => void start());

    reduceQuery.addEventListener("change", onReduceChange);
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      teardown();
    };
  }, []);

  return null;
}
