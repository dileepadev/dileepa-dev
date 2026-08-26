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
  const total = videos.length;

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="section-label">Videos</div>
            <h1>Walkthroughs and talks</h1>
          </div>
          {total > 0 && (
            <div className="font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1">
              <span className="font-medium text-fg">{total}</span>{" "}
              {total === 1 ? "video" : "videos"}
            </div>
          )}
        </div>

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
