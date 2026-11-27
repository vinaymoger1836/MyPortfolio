/**
 * Cross-document View Transitions (handoff §5 "Page transition").
 *
 * globals.css opts every same-origin navigation into a crossfade
 * (`@view-transition`) and names the case-study hero cover `project-cover`.
 * This inline script (no framework JS) names the matching card cover on the
 * home page so it morphs into that hero, and back:
 *  - `pageswap` on the home page, when leaving for /projects/<slug>;
 *  - `pagereveal` on the home page, when arriving from /projects/<slug>.
 * Only cards on screen take part; under reduced motion nothing is named and
 * the plain crossfade remains. Unsupported browsers ignore it all.
 */
const source = () => {
  const NAME = "project-cover";
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slugOf = (url: string | null | undefined) => {
    try {
      return url ? (new URL(url).pathname.match(/^\/projects\/([a-z0-9-]+)\/?$/)?.[1] ?? null) : null;
    } catch {
      return null;
    }
  };
  const clear = () =>
    document.querySelectorAll<HTMLElement>("[data-vt-cover]").forEach((el) => {
      el.style.removeProperty("view-transition-name");
    });
  const card = (slug: string) => {
    const el = document.querySelector<HTMLElement>(`#projects [data-vt-cover="${slug}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight ? el : null;
  };
  type VT = { finished: Promise<unknown> } | null;
  type Activation = { entry?: { url?: string }; from?: { url?: string } | null } | null;

  addEventListener("pageswap", (e) => {
    const ev = e as Event & { viewTransition: VT; activation: Activation };
    clear();
    if (!ev.viewTransition || reduced() || slugOf(location.href)) return;
    const to = slugOf(ev.activation?.entry?.url);
    const el = to && card(to);
    if (el) el.style.setProperty("view-transition-name", NAME);
  });

  addEventListener("pagereveal", (e) => {
    const ev = e as Event & { viewTransition: VT };
    clear();
    if (!ev.viewTransition || reduced() || slugOf(location.href)) return;
    const nav = (window as Window & { navigation?: { activation?: Activation } }).navigation;
    const from = slugOf(nav?.activation?.from?.url);
    const el = from && card(from);
    if (!el) return;
    el.style.setProperty("view-transition-name", NAME);
    ev.viewTransition.finished.finally(clear);
  });
};

export const viewTransitionScript = `(${source.toString()})();`;

/** Prefetch case studies and the home page on hover (Chrome); no JS cost. */
export const speculationRules = JSON.stringify({
  prefetch: [
    { where: { href_matches: ["/projects/*", "/"] }, eagerness: "moderate" },
  ],
});
