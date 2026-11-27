"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { fill } from "@/lib/utils";

export type LightboxImage = { src: string; alt: string; caption?: string };

export type LightboxLabels = {
  label: string;
  close: string;
  previous: string;
  next: string;
  position: string;
};

/**
 * Modal image viewer on the native <dialog> (loaded lazily on first open).
 * `showModal()` makes the page inert and Esc closes it; Tab and Shift+Tab
 * wrap among the controls, ←/→ step through the images (wrapping), Home/End
 * jump to the ends. The parent puts focus back on the thumbnail on close.
 * Images swap with an opacity fade only.
 */
export default function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  labels,
}: {
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  labels: LightboxLabels;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const count = images.length;
  const image = images[index];
  const many = count > 1;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const go = (i: number) => onIndexChange((i + count) % count);

  const onKeyDown = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight" && many) go(index + 1);
    else if (e.key === "ArrowLeft" && many) go(index - 1);
    else if (e.key === "Home" && many) go(0);
    else if (e.key === "End" && many) go(count - 1);
    else if (e.key === "Tab") {
      // Keep focus inside the dialog, wrapping at both ends.
      const focusable = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>("button:not([disabled])"),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) last.focus();
      else if (!e.shiftKey && document.activeElement === last) first.focus();
      else return;
    } else return;
    e.preventDefault();
  };

  if (!image) return null;

  return (
    <dialog
      ref={ref}
      aria-label={labels.label}
      data-lenis-prevent=""
      onKeyDown={onKeyDown}
      onClose={onClose}
      className="lightbox m-0 h-dvh max-h-none w-full max-w-none bg-bg/95 p-0 text-text backdrop:bg-black/60"
    >
      <div className="flex h-full flex-col">
        <div className="container-page flex h-16 shrink-0 items-center justify-between gap-4">
          <p aria-live="polite" className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {fill(labels.position, { n: index + 1, total: count })}
          </p>
          <button
            type="button"
            autoFocus
            onClick={() => ref.current?.close()}
            aria-label={labels.close}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text hover:border-accent hover:text-accent"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <figure className="container-page flex min-h-0 flex-1 flex-col items-center justify-center gap-4 pb-4">
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={1600}
            height={1000}
            sizes="(min-width: 1200px) 1136px, 100vw"
            className="lightbox-image h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full rounded-xl border border-border object-contain"
          />
          {image.caption && (
            <figcaption className="max-w-[65ch] text-center text-sm text-muted text-pretty">
              {image.caption}
            </figcaption>
          )}
        </figure>

        {many && (
          <div className="container-page flex shrink-0 items-center justify-center gap-3 pb-6">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={labels.previous}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text hover:border-accent hover:text-accent"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={labels.next}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-border bg-surface text-text hover:border-accent hover:text-accent"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
