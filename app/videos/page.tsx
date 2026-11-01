import type { Metadata } from "next";
import {
  ApiOfflinePage,
  Container,
  EmptyState,
  PagePath,
  Section,
} from "@/components/ui";
import { api, checkApiHealth, keepLastGoodRender } from "@/lib/api";
import { EMPTY_STATES, PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { VideoSearch } from "./_components/VideoSearch";

export const metadata: Metadata = pageMetadata({
  title: PAGES.videos.meta.title,
  description: PAGES.videos.meta.description,
  path: "/videos",
});

/**
 * Videos, as a list of rows: a thumbnail beside the title, date and
 * description. A list rather than a wall of thumbnails, so the title and date
 * still lead, and the picture says what the video looks like.
 */
export default async function VideosPage() {
  const videos = await api.getVideos();
  const total = videos.length;

  if (total === 0) {
    const health = await checkApiHealth();
    if (!health.ok) {
      keepLastGoodRender("/videos");
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
            <h1>{PAGES.videos.title}</h1>
          </div>
          {total > 0 && (
            <div className="count-badge inline-flex items-center gap-1.5 font-mono text-small text-fg-muted px-2.5 py-1 shrink-0 mt-1">
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
