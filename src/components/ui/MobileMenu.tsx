"use client";

import { Menu, X } from "lucide-react";
import { useRef } from "react";
import { cx } from "@/lib/utils";
import type { NavLabels, NavLink } from "./Nav";

const MENU_ID = "mobile-menu";

/**
 * Full-screen mobile menu on the native Popover API: it opens without JS,
 * closes on Esc and sits in the top layer. JS only closes it after a link
 * is chosen.
 */
export function MobileMenu({
  links,
  active,
  labels,
}: {
  links: NavLink[];
  active: string | null;
  labels: NavLabels;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const close = () => ref.current?.hidePopover?.();

  return (
    <>
      <button
        type="button"
        popoverTarget={MENU_ID}
        popoverTargetAction="show"
        aria-label={labels.menuOpen}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text hover:border-accent hover:text-accent lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      <div
        ref={ref}
        id={MENU_ID}
        popover="auto"
        className="m-0 hidden h-dvh border-0 max-h-none w-full max-w-none flex-col overflow-y-auto bg-bg p-0 text-text open:flex lg:open:hidden"
      >
        <div className="container-page flex h-16 shrink-0 items-center justify-end">
          <button
            type="button"
            popoverTarget={MENU_ID}
            popoverTargetAction="hide"
            aria-label={labels.menuClose}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text hover:border-accent hover:text-accent"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label={labels.primaryNav} className="container-page flex-1 pt-6 pb-10">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={close}
                  aria-current={active === link.id ? "location" : undefined}
                  className={cx(
                    "flex min-h-14 items-center rounded-lg text-[2rem] font-semibold tracking-[-0.03em]",
                    active === link.id ? "text-accent" : "text-text",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            onClick={close}
            className="mt-10 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-medium text-accent-ink"
          >
            {labels.hireMe}
          </a>
        </nav>
      </div>
    </>
  );
}
