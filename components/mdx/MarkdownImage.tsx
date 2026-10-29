"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { ZoomHint } from "@/components/ui/ZoomHint";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { cn } from "@/lib/utils";

const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${process.env.NEXT_PUBLIC_BLOG_CONTENT_REPO || "dileepadev/blog-dileepa-dev"}/${process.env.NEXT_PUBLIC_BLOG_CONTENT_REF || "main"}/public`;

/**
 * Resolves Markdown image paths to valid absolute or CDN URLs.
 * Handles relative paths (e.g. `../../../public/images/...`), root paths (`/images/...`),
 * and external URLs (`https://...`).
 */
export function resolveImageUrl(src: string): string {
  if (!src) return "";

  // 1. Fully qualified external URLs (http, https) and data URIs
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }

  // 2. Relative paths pointing to public/images or public/
  if (src.includes("public/")) {
    const relativePath = src.substring(
      src.indexOf("public/") + "public/".length,
    );
    return `${GITHUB_RAW_BASE}/${relativePath.replace(/^\//, "")}`;
  }

  // 3. Root-relative paths starting with /images/
  if (src.startsWith("/images/")) {
    return `${GITHUB_RAW_BASE}${src}`;
  }

  // 4. Relative paths starting with images/
  if (src.startsWith("images/")) {
    return `${GITHUB_RAW_BASE}/${src}`;
  }

  // 5. Clean up any other relative dots (e.g. `./`, `../`)
  const cleaned = src.replace(/^(\.\/|\.\.\/)+/, "").replace(/^\/+/, "");
  return `${GITHUB_RAW_BASE}/${cleaned}`;
}

interface MarkdownImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

/**
 * Enhanced Markdown image renderer with URL resolution, graceful error handling,
 * responsive scaling, optional caption support, and full-screen lightbox inspection.
 * Uses phrasing tags (span/button) to avoid invalid HTML nesting when rendered inside markdown `<p>` tags.
 */
export function MarkdownImage({
  src,
  alt,
  className,
  ...props
}: MarkdownImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!src || typeof src !== "string") {
    return null;
  }

  const resolvedSrc = resolveImageUrl(src);

  if (hasError) {
    return (
      <span
        role="img"
        aria-label={alt || "Image could not be loaded"}
        className="my-6 block overflow-hidden rounded-block border border-border-strong bg-bg-surface p-6 text-center"
      >
        <span className="flex flex-col items-center justify-center gap-2 text-fg-muted">
          <ImageIcon className="h-8 w-8 text-fg-muted" aria-hidden="true" />
          <span className="font-mono text-small text-fg-muted">
            {alt || "Image could not be loaded"}
          </span>
        </span>
      </span>
    );
  }

  return (
    <>
      <span
        role="figure"
        aria-label={alt || "Blog content image"}
        className="group my-6 block overflow-hidden rounded-block border border-border-strong bg-bg-surface transition-colors duration-200"
      >
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          title="Click to view full screen"
          aria-label={
            alt ? `View full screen image: ${alt}` : "View full screen image"
          }
          className="relative block w-full cursor-zoom-in border-none bg-transparent p-0 text-left"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolvedSrc}
            alt={alt ?? ""}
            loading="lazy"
            decoding="async"
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className={cn(
              "h-auto w-full max-w-full object-contain transition-opacity duration-200",
              isLoaded ? "opacity-100" : "opacity-90",
              className,
            )}
            {...props}
          />

          <ZoomHint />
        </button>

        {alt && (
          <span className="block border-t border-border-strong bg-bg-surface px-4 py-2 text-center font-mono text-label text-fg-muted">
            {alt}
          </span>
        )}
      </span>

      {/* Fullscreen Lightbox Modal (renders via React portal to document.body) */}
      <ImageLightbox
        src={resolvedSrc}
        alt={alt}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </>
  );
}
