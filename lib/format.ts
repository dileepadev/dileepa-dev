/**
 * Formatting helpers.
 *
 * Dates arrive as ISO 8601 strings from the API — events and blog posts use
 * real datetimes in v2.0.0. A few v1 fields are still free text (`period` on
 * experience, education and communities), and those are passed through
 * untouched rather than guessed at.
 *
 * Everything renders in a fixed locale and timezone. `toLocaleDateString` with
 * the server's defaults produces a different string on the server than in the
 * browser, which React reports as a hydration mismatch.
 */

import type { About } from "./api-types";
import { SITE_CONFIG } from "./constants";

const LOCALE = "en-GB";
const TIME_ZONE = "UTC";

function parse(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "6 August 2026". Returns an empty string rather than "Invalid Date". */
export function formatDate(value: string | null | undefined): string {
  const date = parse(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

/**
 * The canonical URL for a post — always on this site.
 *
 * `canonicalUrl` is a stored field rather than a computed one: the API returns
 * whatever the row holds, and rows written before the v2.0.0 URL rewrite still
 * carry `blog.dileepa.dev`. That host is retired rather than redirected
 * (`dileepadev/docs/architecture/redirects.md` §1), so a URL pointing at it is
 * a dead link — and putting one in `rel=canonical`, the sitemap or the feed
 * asks search engines to prefer the dead host over this one.
 *
 * So a stored value is honoured only when it is already on this site's origin.
 * Anything else is composed from the slug, which is what §6 requires: every
 * post's canonical names its own `dileepa.dev` URL. This holds whether or not
 * the production rewrite has run, which is the point — the correctness of the
 * tag should not depend on the state of a migration.
 */
export function postUrl(post: {
  slug: string;
  canonicalUrl?: string | null;
}): string {
  const own = `${SITE_CONFIG.url.replace(/\/$/, "")}/blog/${post.slug}`;
  const stored = post.canonicalUrl?.trim();
  if (!stored) return own;
  try {
    if (new URL(stored).origin === new URL(SITE_CONFIG.url).origin)
      return stored;
  } catch {
    // A stored value that is not a parseable absolute URL is not usable as a
    // canonical either. Fall through to the composed one.
  }
  return own;
}

/** "Aug 2026" — for a metadata column where the day is noise. */
export function formatMonth(value: string | null | undefined): string {
  const date = parse(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(LOCALE, {
    month: "short",
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
}

/** "2026-08-06" — for `<time datetime>`, which wants a machine-readable value. */
export function toDateAttribute(value: string | null | undefined): string {
  const date = parse(value);
  return date ? date.toISOString().slice(0, 10) : "";
}

export function year(value: string | null | undefined): number | null {
  const date = parse(value);
  return date ? date.getUTCFullYear() : null;
}

/** "7 min read". Below a minute reads as one, because "0 min read" is absurd. */
export function readingTime(minutes: number | null | undefined): string {
  const value = Math.max(1, Math.round(minutes ?? 0));
  return `${value} min read`;
}

/** "1h 30m" from a duration in seconds. Used for event recordings. */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours && minutes) return `${hours}h ${minutes}m`;
  if (hours) return `${hours}h`;
  return `${minutes}m`;
}

/** "11 min watch" or "1h 10m watch". Mirrors `readingTime` on blog posts. */
export function videoDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return "";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours && minutes) return `${hours}h ${minutes}m watch`;
  if (hours) return `${hours}h watch`;
  return `${Math.max(1, minutes)} min watch`;
}

/** Sentence-cases an enum value: `in_person` → "In person". */
export function humanise(value: string | null | undefined): string {
  if (!value) return "";
  const words = value.replace(/[_-]+/g, " ").trim().toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Flattens a prose field into paragraphs.
 *
 * `description` is an array of paragraphs in the API contract, but a record
 * can legitimately hold one entry carrying several paragraphs separated by
 * blank lines — that is what a textarea in the admin produces. Splitting here
 * means the page renders the same structure either way, instead of a heading
 * that has swallowed the whole body.
 */
export function paragraphs(value: string[] | null | undefined): string[] {
  return (value ?? [])
    .flatMap((entry) => entry.split(/\n\s*\n/))
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/**
 * The portrait, from whichever formats the about record actually carries.
 *
 * Three fields rather than one, because the admin uploads whatever it has:
 * WebP is the smallest, JPEG is what a camera and most exports produce, PNG is
 * the lossless original. Preference is smallest first, so a record that has
 * only ever had a WebP still resolves to that WebP — adding JPEG changed
 * nothing for the records that predate it.
 *
 * No conversion happens anywhere. Every one of these is a Cloudinary URL and
 * goes through `next/image`, which re-encodes whatever it is handed; the file
 * extension on the stored URL is not something this site reads.
 *
 * Typed against the generated `About` rather than a local shape on purpose: if
 * one of these names stops resolving, the API changed and this is where it
 * should break.
 */
export function portrait(
  images: About["images"] | null | undefined,
): string | null {
  if (!images) return null;
  return images.profileWebp || images.profileJpg || images.profilePng || null;
}
