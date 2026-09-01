/**
 * Page metadata, composed in one place.
 *
 * Next merges metadata per key, not per field: a page that declares
 * `openGraph` replaces the layout's `openGraph` object outright rather than
 * filling in around it. Every page that set only `title` and `description`
 * therefore inherited the homepage's card — same `og:title`, same
 * `og:description`, same `og:url` — while every page that *did* declare an
 * `openGraph` lost `siteName`, `locale` and the default image along with it.
 * Both failures are silent: the page renders, the tags are present, and only
 * the card a reader sees is wrong.
 *
 * So the composition happens here instead of being restated per route. A page
 * says what it is; this decides what the tags are.
 */

import type { Metadata } from "next";
import { SITE_CONFIG } from "./constants";

/**
 * The default social card — 1200×630, the one aspect ratio every platform
 * crops to predictably. A page without an image of its own gets this rather
 * than nothing, which is what "no image" resolved to before.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  type: "image/png",
} as const;

export interface PageImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface PageMetadataInput {
  /** Page title. The layout's `%s · Dileepa Bandara` template wraps it. */
  title: string;
  description: string;
  /** Site-relative, leading slash. Becomes both `canonical` and `og:url`. */
  path: string;
  /**
   * The card image. `undefined` falls back to the site default; a value that
   * is present but empty (an unset `seo.ogImage`) does the same.
   */
  image?: PageImage | string | null;
  type?: "website" | "article";
  /** `article:*`, for posts, projects and events. */
  publishedTime?: string | null;
  modifiedTime?: string | null;
  tags?: string[];
  /**
   * Keep the page out of the index. The system preview routes (`/404`,
   * `/500`, `/503`) are reachable and useful, and belong in no search result.
   */
  noindex?: boolean;
}

function toImage(image: PageMetadataInput["image"]): PageImage {
  if (!image) return { ...DEFAULT_OG_IMAGE };
  if (typeof image === "string") {
    return image.trim() ? { url: image } : { ...DEFAULT_OG_IMAGE };
  }
  return image.url?.trim() ? image : { ...DEFAULT_OG_IMAGE };
}

/** The absolute form of a site-relative path. */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_CONFIG.url : `${SITE_CONFIG.url}${path}`;
}

export function pageMetadata(input: PageMetadataInput): Metadata {
  const {
    title,
    description,
    path,
    type = "website",
    publishedTime,
    modifiedTime,
    tags,
    noindex,
  } = input;

  const url = absoluteUrl(path);
  const image = toImage(input.image);
  // `og:title` stays the bare page title. `og:site_name` already carries the
  // attribution and every platform renders it beside the title, so repeating
  // the name inside the title spends card width saying it twice.
  const imageAlt = image.alt ?? title;

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex
      ? {
          // Overrides the layout's `index, follow`. Without this the system
          // routes carry two contradictory robots directives at once.
          robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
        }
      : {}),
    openGraph: {
      type,
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      images: [{ ...image, alt: imageAlt }],
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? publishedTime ?? undefined,
            authors: [SITE_CONFIG.url],
            tags: tags ?? undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: SITE_CONFIG.twitterHandle,
      creator: SITE_CONFIG.twitterHandle,
      images: [{ url: image.url, alt: imageAlt }],
    },
  };
}
