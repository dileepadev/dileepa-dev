"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageLightbox } from "./ImageLightbox";
import { ZoomHint } from "./ZoomHint";

interface ZoomableImageProps {
  src: string;
  alt?: string | null;
  aspectRatio?: string;
  sizes?: string;
  /** Preload the image - for a cover that is the page's LCP element. */
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
        aria-label={
          altText ? `Click to zoom: ${altText}` : "Click to zoom image"
        }
        className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-block bg-bg text-left ${className}`}
      >
        <div className={`relative w-full ${aspectRatio} overflow-hidden`}>
          <Image
            src={src}
            alt={altText}
            fill
            sizes={sizes}
            preload={preload}
            className="object-cover"
          />
          <ZoomHint />
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
