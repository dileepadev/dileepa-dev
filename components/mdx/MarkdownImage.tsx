"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
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

interface MarkdownImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
}

/**
 * Enhanced Markdown image renderer with URL resolution, graceful error handling,
 * responsive scaling, and optional caption support.
 */
export function MarkdownImage({
  src,
  alt,
  className,
  ...props
}: MarkdownImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || typeof src !== "string") {
    return null;
  }

  const resolvedSrc = resolveImageUrl(src);

  if (hasError) {
    return (
      <figure className="my-6 overflow-hidden rounded-lg border border-border-strong bg-bg-surface p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-fg-muted">
          <ImageIcon className="h-7 w-7 text-fg-muted/50" aria-hidden="true" />
          <span className="font-mono text-small text-fg-muted">
            {alt || "Image could not be loaded"}
          </span>
        </div>
      </figure>
    );
  }

  return (
    <figure className="my-6 overflow-hidden rounded-lg border border-border-strong bg-bg-surface">
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
      {alt && (
        <figcaption className="border-t border-border-strong bg-bg-surface px-4 py-2 text-center font-mono text-label text-fg-muted">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
