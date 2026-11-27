import type { Metadata } from "next";
import { Footer } from "@/components/sections/Footer";
import { buttonClass } from "@/components/ui/Button";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

const ui = site.ui.notFound;

export const metadata: Metadata = {
  title: `${ui.metaTitle} · ${profile.name}`,
  robots: { index: false },
};

/** Custom 404, also used for unknown /projects/[slug] (dynamicParams = false). */
export default function NotFound() {
  return (
    <>
      <SiteHeader base="/" />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <section
          aria-labelledby="not-found-title"
          className="dot-grid container-page flex min-h-[70dvh] flex-col justify-center py-20"
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{ui.label}</p>
          <h1
            id="not-found-title"
            className="mt-4 max-w-[18ch] text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1] tracking-[-0.04em] text-balance"
          >
            {ui.title}
          </h1>
          <p className="mt-6 max-w-[55ch] text-lg text-muted text-pretty">{ui.body}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/" className={buttonClass("primary")}>
              {ui.home}
            </a>
            <a href="/#projects" className={buttonClass("outline")}>
              {ui.projects}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
