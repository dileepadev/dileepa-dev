import type { Metadata } from "next";
import { Container, EmptyState, Gallery, PagePath, Section } from "@/components/ui";
import { getGallery } from "@/lib/api";
import { EMPTY_STATES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Event gallery",
  description:
    "Photographs from the talks and workshops I have delivered, newest first.",
  alternates: { canonical: "/gallery" },
};

/**
 * The full gallery.
 *
 * The homepage shows the first twelve; this is all of them. Both read the same
 * composed list, so a photo added to an event in the admin appears in both
 * without anything else being touched.
 */
export default async function GalleryPage() {
  const photos = await getGallery(200);
  const total = photos.length;

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/gallery" />
            </div>
            <div className="section-label">Gallery</div>
            <h1>Event photographs</h1>
          </div>
          {total > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1">
              <span className="font-medium text-fg">{total}</span>
              <span>{total === 1 ? "Photograph" : "Photographs"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">
          Photographs from the rooms these talks and workshops were delivered
          in, newest first. Each one links to the event it came from.
        </p>

        {photos.length === 0 ? (
          <EmptyState {...EMPTY_STATES.gallery} />
        ) : (
          <Gallery photos={photos} />
        )}
      </Container>
    </Section>
  );
}
