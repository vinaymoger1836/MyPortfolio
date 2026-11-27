import { ArrowUp } from "lucide-react";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

/** The year and "last updated" are taken at build time (the page is static). */
export function Footer() {
  const ui = site.ui.footer;
  const built = new Date();
  const updated = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(built);

  return (
    <footer className="border-t border-border/70">
      <div className="container-page flex flex-col gap-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p>
            © {built.getFullYear()} {profile.name}
          </p>
          <p>{ui.builtWith}</p>
          <p>
            {ui.lastUpdated}{" "}
            <time dateTime={built.toISOString().slice(0, 10)}>{updated}</time>
          </p>
        </div>
        <a
          href="#top"
          className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-border bg-surface px-4 text-text hover:border-accent hover:text-accent"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
          {ui.backToTop}
        </a>
      </div>
    </footer>
  );
}
