"use client";

import { useEffect, useCallback, useRef, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

/** How long the close animation runs, in step with `.lightbox` in globals.css. */
const CLOSE_MS = 200;

/**
 * Accessible, keyboard-navigable full-screen image viewer (lightbox).
 *
 * It opens and closes at the pace of the page transitions (v2.1.0 draft): the
 * backdrop fades, and the photo fades in a beat later while it eases up from
 * 96% to full size; closing plays the same, a little quicker. Every way out -
 * Escape, the close button, a click on the backdrop - runs the close, and the
 * parent's `onClose` fires once it has finished. With reduced motion it opens
 * and closes at once.
 */
export function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [closing, setClosing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestClose = useCallback(() => {
    if (timer.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      onClose();
      return;
    }
    setClosing(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setClosing(false);
      onClose();
    }, CLOSE_MS);
  }, [onClose]);

  // A close still running when the viewer unmounts does not fire later.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        requestClose();
      }
    },
    [requestClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scroll while open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const content: ReactNode = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt || "Full screen image view"}
      // The viewer is always dark, whatever the site theme, so it takes the
      // dark tokens - and with them the site's own buttons, which would
      // otherwise draw light-theme ink on a black backdrop.
      data-theme="dark"
      data-state={closing ? "closing" : "open"}
      className="lightbox fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 p-4 text-fg backdrop-blur-md sm:p-6"
      onClick={requestClose}
    >
      {/* Top Header Bar */}
      <div
        className="flex w-full max-w-6xl items-center justify-between gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 truncate font-mono text-small text-fg-muted">
          <ZoomIn className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{alt || "Image preview"}</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original image"
            aria-label="Open original image in new tab"
            className="btn btn--secondary btn--sm"
          >
            <ExternalLink aria-hidden="true" />
            <span className="hidden sm:inline">Original</span>
          </a>

          <button
            type="button"
            onClick={requestClose}
            title="Close (Esc)"
            aria-label="Close full screen image"
            className="btn btn--secondary btn--sm btn--icon"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Main Full-Screen Image */}
      <div
        className="relative my-auto flex max-h-[82vh] max-w-full items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          className="lightbox-image max-h-[82vh] max-w-[94vw] select-none rounded-block object-contain shadow-2xl"
        />
      </div>

      {/* Bottom Caption Bar */}
      <div
        className="w-full max-w-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {alt ? (
          <p className="font-mono text-small text-fg-muted">{alt}</p>
        ) : (
          <p className="font-mono text-label text-fg-muted">
            Press{" "}
            <kbd className="rounded-inline bg-bg-raised px-1.5 py-0.5">Esc</kbd>{" "}
            or click anywhere to close
          </p>
        )}
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
