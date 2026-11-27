"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

/** Copies the email address; the result is announced politely. P4 adds the toast. */
export function CopyEmail({
  email,
  labels,
}: {
  email: string;
  labels: { copy: string; copied: string; failed: string };
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={labels.copy}
        title={labels.copy}
        className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-muted transition-colors hover:border-accent hover:text-accent"
      >
        {status === "copied" ? (
          <Check className="size-4 text-accent" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </button>
      <span role="status" className="basis-full text-sm text-muted">
        {status === "copied" ? labels.copied : status === "failed" ? labels.failed : ""}
      </span>
    </>
  );
}
