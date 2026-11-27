import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const base =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-[0.9375rem] font-medium leading-none transition-colors";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent/90",
  outline:
    "border border-border bg-surface text-text hover:border-accent hover:text-accent",
  ghost: "text-muted hover:text-accent",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return cx(base, variants[variant], className);
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={buttonClass(variant, className)} {...props} />;
}

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button type={type} className={buttonClass(variant, className)} {...props} />
  );
}
