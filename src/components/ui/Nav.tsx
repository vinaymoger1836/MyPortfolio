"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { cx } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export type NavLink = { id: string; label: string };

export type NavLabels = {
  primaryNav: string;
  hireMe: string;
  themeToggle: string;
  menuOpen: string;
  menuClose: string;
};

/**
 * Sticky header with anchor links. An IntersectionObserver marks the section
 * in the middle of the viewport as current, and an accent bar slides to it.
 * After a little scroll the bar turns to glass; it slides away while
 * scrolling down and comes back on scroll up or when it holds focus.
 */
export function Nav({
  name,
  shortName,
  links,
  labels,
}: {
  name: string;
  shortName: string;
  links: NavLink[];
  labels: NavLabels;
}) {
  const active = useActiveSection(links.map((l) => l.id));
  const headerRef = useRef<HTMLElement>(null);
  useScrollState(headerRef);

  return (
    <header ref={headerRef} id="top" className="site-header sticky top-0 z-40 border-b">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="flex min-h-11 items-center gap-3 rounded-md"
        >
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-lg border border-accent/60 font-mono text-sm font-medium tracking-[0.12em] text-text"
          >
            {shortName}
          </span>
          <span className="sr-only text-[0.9375rem] font-medium sm:not-sr-only">
            {name}
          </span>
        </a>

        <nav aria-label={labels.primaryNav} className="relative hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={active === link.id ? "location" : undefined}
                  className={cx(
                    "inline-flex min-h-11 items-center rounded-full px-3 text-[0.9375rem] transition-colors",
                    active === link.id
                      ? "text-accent"
                      : "text-muted hover:text-text",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <ActiveBar active={active} />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle label={labels.themeToggle} />
          <a
            href="#contact"
            className="hidden min-h-11 items-center rounded-full bg-accent px-4 text-[0.9375rem] font-medium text-accent-ink hover:bg-accent/90 sm:inline-flex"
          >
            {labels.hireMe}
          </a>
          <MobileMenu links={links} active={active} labels={labels} />
        </div>
      </div>
    </header>
  );
}

/**
 * Accent bar under the current link. It replaces Motion's `layoutId`: it reads
 * the link's box once per change and moves with transform only, on a spring
 * easing shared through CSS (`--ease-spring`). Instant under reduced motion.
 */
function ActiveBar({ active }: { active: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(false);

  useLayoutEffect(() => {
    const bar = ref.current;
    const nav = bar?.parentElement;
    if (!bar || !nav) return;

    const place = (animate: boolean) => {
      const link = active
        ? nav.querySelector<HTMLElement>(`a[href="#${CSS.escape(active)}"]`)
        : null;
      if (!link) {
        bar.style.opacity = "0";
        shown.current = false;
        return;
      }
      // Base width is 100px; scaleX stretches it to the link's text box.
      const inset = 12;
      const width = Math.max(link.offsetWidth - inset * 2, 0);
      bar.classList.toggle("no-transition", !animate || !shown.current);
      bar.style.transform = `translateX(${link.offsetLeft + inset}px) scaleX(${width / 100})`;
      bar.style.opacity = "1";
      shown.current = true;
    };

    place(true);
    // Fonts swapping in or a resize change link widths.
    const ro = new ResizeObserver(() => place(false));
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active]);

  return <span ref={ref} aria-hidden="true" className="nav-bar" />;
}

/** Glass after 8px of scroll; hide on the way down, show on the way up. */
function useScrollState(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      header.toggleAttribute("data-scrolled", y > 8);
      if (y > lastY + 4 && y > 120) header.setAttribute("data-hidden", "");
      else if (y < lastY - 4 || y <= 120) header.removeAttribute("data-hidden");
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
}

/** Id of the section crossing the middle band of the viewport, if any. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    const targets = key
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band around 40% from the top: one section at a time.
      { rootMargin: "-40% 0px -55% 0px" },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [key]);

  return active;
}
