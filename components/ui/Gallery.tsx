import Image from "next/image";
import Link from "next/link";
import type { GalleryPhoto } from "@/lib/api-types";
import { formatMonth } from "@/lib/format";

/**
 * The event gallery.
 *
 * Photographs appear in exactly two places on this site: the hero portrait and
 * here. That is the whole image budget, and keeping it that small is what makes
 * a page of photographs read as a deliberate section rather than decoration
 * sprayed across the site.
 *
 * Each tile links to the event the photo was taken at, because a photo of a
 * room full of people is only worth showing if a reader can find out what was
 * happening in it. The caption is revealed on hover and on keyboard focus —
 * hover alone would hide it from anyone not using a mouse.
 *
 * Every photo is Cloudinary-hosted. `next.config.ts` allows that host and no
 * other, so a photo from anywhere else fails the build rather than shipping an
 * unoptimised `<img>`.
 */
export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <div className="gallery">
      {photos.map((photo, index) => (
        <figure key={`${photo.eventSlug}-${photo.url}`}>
          <Link href={`/events/${photo.eventSlug}`}>
            <Image
              src={photo.url}
              alt={photo.alt || `${photo.eventTitle}`}
              width={photo.width ?? 800}
              height={photo.height ?? 600}
              sizes="(max-width: 720px) 50vw, 240px"
              // The first row is above the fold on most screens; the rest are
              // not, and eagerly loading a dozen photographs to render three
              // is the whole reason image budgets exist.
              loading={index < 3 ? "eager" : "lazy"}
            />
            <figcaption>
              {photo.caption || photo.eventTitle}
              {photo.eventDate && (
                <span className="block opacity-70">
                  {formatMonth(photo.eventDate)}
                </span>
              )}
            </figcaption>
          </Link>
        </figure>
      ))}
    </div>
  );
}
