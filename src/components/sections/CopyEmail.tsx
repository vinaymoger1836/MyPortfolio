"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

/** Copies the email address and confirms it in a toast. */
export function CopyEmail({
  email,
  labels,
}: {
  email: string;
  labels: { copy: string; copied: string; failed: string };
}) {
  const [copied, setCopied] = useState(false);
  const { show, toast } = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      show(labels.copied);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      show(labels.failed);
    }
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
        {copied ? (
          <Check className="size-4 text-accent" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
      </button>
      {toast}
    </>
  );
}
