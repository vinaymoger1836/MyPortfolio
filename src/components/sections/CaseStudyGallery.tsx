"use client";

import Image from "next/image";
import { lazy, Suspense, useRef, useState, type MouseEvent } from "react";
import type { LightboxImage, LightboxLabels } from "@/components/ui/Lightbox";
import { cx, fill } from "@/lib/utils";

const loadLightbox = () => import("@/components/ui/Lightbox");
const Lightbox = lazy(loadLightbox);

/**
 * Gallery grid. Each thumbnail is a link to the full image, so it works
 * without JS; with JS it opens the lightbox, whose code is fetched on
 * hover/focus or on the first click (never with the page).
 */
export function CaseStudyGallery({
  images,
  labels,
}: {
  images: LightboxImage[];
  labels: LightboxLabels & { open: string };
}) {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<number>(0);
  const triggers = useRef<Array<HTMLAnchorElement | null>>([]);
  const preload = () => void loadLightbox();

  const show = (i: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    opener.current = i;
    setOpen(i);
  };

  const close = () => {
    setOpen(null);
    triggers.current[opener.current]?.focus();
  };

  // An odd count lets the first image span the full width.
  const wide = (i: number) => images.length === 1 || (i === 0 && images.length % 2 === 1);

  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2">
        {images.map((img, i) => (
          <li key={img.src} className={cx(wide(i) && "sm:col-span-2")}>
            <figure>
              <a
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                href={img.src}
                onClick={show(i)}
                onPointerEnter={preload}
                onFocus={preload}
                aria-label={fill(labels.open, { alt: img.alt })}
                className="group block overflow-hidden rounded-2xl border border-border bg-surface-2"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1600}
                  height={1000}
                  sizes={wide(i) ? "(min-width: 1200px) 760px, 100vw" : "(min-width: 1200px) 370px, (min-width: 640px) 50vw, 100vw"}
                  className="cover-zoom aspect-[16/10] w-full object-cover"
                />
              </a>
              {img.caption && (
                <figcaption className="mt-3 text-sm text-muted text-pretty">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Suspense fallback={null}>
          <Lightbox
            images={images}
            index={open}
            onIndexChange={setOpen}
            onClose={close}
            labels={labels}
          />
        </Suspense>
      )}
    </>
  );
}
