import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { profile } from "@/content/profile";
import { site } from "@/content/site";

export default function Home() {
  const { label, lead, emphasis } = site.placeholder;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-5 sm:px-6 md:px-8">
        <span className="font-mono text-sm font-medium tracking-[0.2em] text-text">
          {profile.shortName}
        </span>
        <ThemeToggle label={site.ui.themeToggle} />
      </header>

      <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center px-4 pt-10 pb-24 sm:px-6 md:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
        <h1 className="mt-6 text-[clamp(3rem,9vw,8rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-balance">
          {profile.name}
        </h1>
        <p className="mt-6 max-w-[65ch] text-muted">{profile.role}</p>
        <p className="mt-12 text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-tight">
          {lead}{" "}
          <em className="font-serif font-normal text-accent">{emphasis}</em>
        </p>
      </main>
    </div>
  );
}
