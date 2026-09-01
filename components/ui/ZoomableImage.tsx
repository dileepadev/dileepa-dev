"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";

interface ZoomableImageProps {
  src: string;
  alt?: string | null;
  aspectRatio?: string;
  sizes?: string;
  /** Preload the image — for a cover that is the page's LCP element. */
  preload?: boolean;
  className?: string;
}

/**
 * Image container with smooth scale on hover, "Click to zoom" badge overlay,
 * and keyboard-accessible fullscreen lightbox on click.
 */
export function ZoomableImage({
  src,
  alt,
  aspectRatio = "aspect-16/9",
  sizes = "(max-width: 768px) 100vw, 768px",
  preload = false,
  className = "",
}: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const altText = alt ?? "";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="Click to zoom"
        aria-label={altText ? `Click to zoom: ${altText}` : "Click to zoom image"}
        className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-border-strong bg-bg-surface text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
      >
        <div className={`relative w-full ${aspectRatio} overflow-hidden`}>
          <Image
            src={src}
            alt={altText}
            fill
            sizes={sizes}
            preload={preload}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Hover Zoom Overlay */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-bg px-3 py-1.5 font-mono text-xs font-medium text-fg shadow-md">
              <ZoomIn className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
              <span>Click to zoom</span>
            </div>
          </div>
        </div>
      </button>

      <ImageLightbox
        src={src}
        alt={altText}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
