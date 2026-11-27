"use client";

import { useEffect, useState } from "react";
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
 * in the middle of the viewport as current (P2 adds the sliding indicator).
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

  return (
    <header
      id="top"
      className="sticky top-0 z-40 border-b border-border/70 bg-bg/95"
    >
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

        <nav aria-label={labels.primaryNav} className="hidden lg:block">
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
