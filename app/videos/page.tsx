import type { Metadata } from "next";
import {
  ApiOfflinePage,
  Container,
  EmptyState,
  PagePath,
  Section,
} from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import { EMPTY_STATES, PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { VideoSearch } from "./_components/VideoSearch";

export const metadata: Metadata = pageMetadata({
  title: PAGES.videos.meta.title,
  description: PAGES.videos.meta.description,
  path: "/videos",
});

/**
 * Videos, as a list rather than a grid of thumbnails.
 *
 * Photographs appear in two places on this site - the hero portrait and the
 * event gallery - and a wall of YouTube thumbnails is not either of them. The
 * title and the date are what a reader is choosing between anyway.
 */
export default async function VideosPage() {
  const videos = await api.getVideos();
  const total = videos.length;

  if (total === 0) {
    const health = await checkApiHealth();
    if (!health.ok) {
      return <ApiOfflinePage path="/videos" />;
    }
  }

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/videos" />
            </div>
            <div className="section-label">{PAGES.videos.label}</div>
            <h1>{PAGES.videos.title}</h1>
          </div>
          {total > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
              <span className="font-medium text-fg">{total}</span>
              <span>{total === 1 ? "Video" : "Videos"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">{PAGES.videos.intro}</p>

        {videos.length === 0 ? (
          <EmptyState {...EMPTY_STATES.videos} />
        ) : (
          <VideoSearch videos={videos} />
        )}
      </Container>
    </Section>
  );
}
