"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cx } from "@/lib/utils";

const SHOW_MS = 2500;
/** Matches the `.toast-card` transition, so the text clears after the fade. */
const FADE_MS = 200;

/**
 * Shows a short message in a toast, then hides it. The returned `toast`
 * element is a polite live region that is always mounted, so screen readers
 * announce each message.
 */
export function useToast() {
  const [state, setState] = useState<{ message: string; open: boolean }>({
    message: "",
    open: false,
  });
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);

  const show = useCallback((message: string) => {
    clear();
    // Empty first, so the same message twice is announced twice.
    setState({ message: "", open: false });
    timers.current.push(
      window.setTimeout(() => setState({ message, open: true }), 30),
      window.setTimeout(() => setState((s) => ({ ...s, open: false })), 30 + SHOW_MS),
      window.setTimeout(() => setState({ message: "", open: false }), 30 + SHOW_MS + FADE_MS),
    );
  }, []);

  const toast = <Toast message={state.message} open={state.open} />;
  return { show, toast };
}

export function Toast({ message, open }: { message: string; open: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <p
        data-open={open ? "" : undefined}
        className={cx(
          "toast-card rounded-full border border-border bg-surface-2 px-5 py-3 text-sm font-medium text-text shadow-lg",
          !message && "invisible",
        )}
      >
        {message}
      </p>
    </div>
  );
}
