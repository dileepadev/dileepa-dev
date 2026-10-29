import { Mic, Network, PenLine, Users, Video as VideoIcon } from "lucide-react";
import {
  CommunityCard,
  EventCard,
  IndexSection,
  PostCard,
  Subsection,
  TileGrid,
  ViewAll,
} from "@/components/ui";
import type { BlogPost, Community, EventRecord, Video } from "@/lib/api-types";
import { SECTIONS, SUBSECTIONS } from "@/lib/constants";
import Link from "next/link";
import {
  formatDate,
  formatMonth,
  readingTime,
  videoDuration,
} from "@/lib/format";

/**
 * Community - communities, events, writing, videos.
 *
 * Each subsection is an `ItemList` with up to four items and a `ViewAll`
 * link pointing at the collection route. The events subsection uses the
 * next three events from the list, which comes pre-sorted from the API.
 */
export function CommunitySection({
  communities,
  events,
  posts,
  videos,
}: {
  communities: Community[];
  events: EventRecord[];
  posts: BlogPost[];
  videos: Video[];
}) {
  const hasContent =
    communities.length > 0 ||
    events.length > 0 ||
    posts.length > 0 ||
    videos.length > 0;

  if (!hasContent) return null;

  return (
    <IndexSection id="community" art={Network} {...SECTIONS.community}>
      {communities.length > 0 && (
        <Subsection
          {...SUBSECTIONS.communities}
          icon={<Users className="h-4 w-4" />}
        >
          <TileGrid>
            {communities.slice(0, 4).map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </TileGrid>
          <ViewAll href="/communities">All communities</ViewAll>
        </Subsection>
      )}

      {events.length > 0 && (
        <Subsection {...SUBSECTIONS.events} icon={<Mic className="h-4 w-4" />}>
          <TileGrid>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </TileGrid>
          <ViewAll href="/events">All events</ViewAll>
        </Subsection>
      )}

      {posts.length > 0 && (
        <Subsection
          {...SUBSECTIONS.blogs}
          icon={<PenLine className="h-4 w-4" />}
        >
          <div className="post-feature">
            {posts.slice(0, 1).map((post) => (
              <article key={post.id} className="post-featured">
                <span className="post-kicker">Latest post</span>
                <h3 className="post-featured-title">
                  <Link
                    href={post.path || `/blog/${post.slug}`}
                    className="text-link"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.description && <p>{post.description}</p>}
                <span className="post-meta">
                  {post.publishedDate && (
                    <span>{formatDate(post.publishedDate)}</span>
                  )}
                  <span>{readingTime(post.readingTimeMinutes)}</span>
                </span>
              </article>
            ))}
            <ul className="post-rest">
              {posts.slice(1).map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </ul>
          </div>
          <ViewAll href="/blog">All posts</ViewAll>
        </Subsection>
      )}

      {videos.length > 0 && (
        <Subsection
          {...SUBSECTIONS.videos}
          icon={<VideoIcon className="h-4 w-4" />}
        >
          <ul className="tile-grid">
            {videos.slice(0, 4).map((video) => (
              <li key={video.id} className="tile-card">
                <div className="tile-meta">
                  <span>{formatMonth(video.date)}</span>
                  {video.durationSeconds && (
                    <span className="tile-pill">
                      {videoDuration(video.durationSeconds)}
                    </span>
                  )}
                </div>
                <h3 className="tile-title">
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-link"
                  >
                    {video.title}
                  </a>
                </h3>
                {video.description && (
                  <p className="tile-desc">{video.description}</p>
                )}
              </li>
            ))}
          </ul>
          <ViewAll href="/videos">All videos</ViewAll>
        </Subsection>
      )}
    </IndexSection>
  );
}
