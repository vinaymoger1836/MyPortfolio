import { profile } from "@/content/profile";
import { site } from "@/content/site";
import { visibleSections } from "@/lib/sections";
import { Nav } from "./Nav";

/**
 * Skip link + sticky nav, shared by every page. On the home page links are
 * in-page anchors ("#about"); elsewhere `base="/"` points them home ("/#about").
 */
export function SiteHeader({ base = "" }: { base?: "" | "/" }) {
  const { ui } = site;
  const links = visibleSections
    .filter((s) => s.navLabel)
    .map((s) => ({ id: s.id, label: s.navLabel ?? s.label }));

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-accent px-4 py-2 font-medium text-accent-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {ui.skipToContent}
      </a>
      <Nav
        name={profile.name}
        shortName={profile.shortName}
        links={links}
        base={base}
        labels={{
          primaryNav: ui.primaryNav,
          hireMe: ui.hireMe,
          themeToggle: ui.themeToggle,
          menuOpen: ui.menuOpen,
          menuClose: ui.menuClose,
        }}
      />
    </>
  );
}
