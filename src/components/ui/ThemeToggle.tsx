"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Both icons are server-rendered and swapped with the `light:` variant,
 * so there's no mounted-state flicker or hydration mismatch.
 */
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text hover:border-accent hover:text-accent"
    >
      <Sun className="size-5 light:hidden" aria-hidden="true" />
      <Moon className="hidden size-5 light:block" aria-hidden="true" />
    </button>
  );
}
