"use client";

import { useEffect, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, ZoomIn } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt?: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Accessible, keyboard-navigable full-screen image viewer (lightbox).
 */
export function ImageLightbox({
  src,
  alt,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
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
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/90 p-4 text-fg backdrop-blur-md transition-opacity duration-200 sm:p-6"
      onClick={onClose}
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
            onClick={onClose}
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
          className="max-h-[82vh] max-w-[94vw] select-none rounded-block object-contain shadow-2xl transition-transform duration-200"
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
