import type { Metadata } from "next";
import { Container, EmptyState, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { VideoSearch } from "./_components/VideoSearch";

export const metadata: Metadata = {
  title: "Videos",
  description: "Short walkthroughs and recorded talks, hosted on YouTube.",
  alternates: { canonical: "/videos" },
};

/**
 * Videos, as a list rather than a grid of thumbnails.
 *
 * Photographs appear in two places on this site — the hero portrait and the
 * event gallery — and a wall of YouTube thumbnails is not either of them. The
 * title and the date are what a reader is choosing between anyway.
 */
export default async function VideosPage() {
  const videos = await api.getVideos();

  return (
    <Section>
      <Container>
        <div className="section-label">Videos</div>
        <h1>Walkthroughs and talks</h1>
        <p className="section-intro">
          Short walkthroughs, mostly Azure setup and OpenAI basics. Each one
          opens on YouTube.
        </p>

        {videos.length === 0 ? (
          <EmptyState
            title="No videos are listed yet."
            hint="Recordings appear here once they are added in the admin."
          />
        ) : (
          <VideoSearch videos={videos} />
        )}
      </Container>
    </Section>
  );
}
