/** Joins class names, skipping falsy values. */
export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Replaces `{key}` placeholders in a content string. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Zero-padded section number: 1 → "01". */
export const pad2 = (n: number) => String(n).padStart(2, "0");
