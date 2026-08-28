import { Calendar, Clock, MapPin } from "lucide-react";
import {
  Container,
  Item,
  ItemList,
  Section,
  SectionHeading,
  Subsection,
  ViewAll,
} from "@/components/ui";
import type {
  BlogPost,
  Community,
  EventRecord,
  Video,
} from "@/lib/api-types";
import { SECTIONS, SUBSECTIONS } from "@/lib/constants";
import {
  formatDate,
  formatMonth,
  humanise,
  readingTime,
  videoDuration,
} from "@/lib/format";

/**
 * Community — communities, events, writing, videos.
 *
 * Four subsections rather than four sections. They are all the same activity
 * seen from different angles, and giving each one a full section heading would
 * make the page claim four topics where there is one.
 *
 * Each subsection renders the first few records and links to its full index. An
 * empty one returns nothing rather than an empty state: on the homepage a
 * missing block is quieter than a box explaining its own absence, and the index
 * pages carry the empty states instead.
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
  return (
    <Section id="community">
      <Container>
        <SectionHeading {...SECTIONS.community} />

        {communities.length > 0 && (
          <Subsection {...SUBSECTIONS.communities}>
            <ItemList>
              {communities.slice(0, 4).map((community) => (
                <Item
                  key={community.id}
                  title={community.name}
                  href={community.communityUrl || undefined}
                  description={community.description}
                  meta={
                    <>
                      {community.current ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border border-brand/30 bg-brand/10 text-brand">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
                          <span>Current</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono text-fg-muted border border-border-strong bg-bg-surface">
                          Past role
                        </span>
                      )}
                      {community.role && (
                        <span className="font-medium text-fg">{community.role}</span>
                      )}
                      {community.period && (
                        <span className="inline-flex items-center gap-1.5 text-fg-muted">
                          <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                          <span>{community.period}</span>
                        </span>
                      )}
                    </>
                  }
                />
              ))}
            </ItemList>
            <ViewAll href="/communities">All communities</ViewAll>
          </Subsection>
        )}

        {events.length > 0 && (
          <Subsection {...SUBSECTIONS.events}>
            <ItemList>
              {events.map((event) => (
                <Item
                  key={event.id}
                  title={event.title}
                  href={`/events/${event.slug}`}
                  description={event.summary}
                  meta={
                    <>
                      {event.status === "upcoming" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border border-brand/30 bg-brand/10 text-brand">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
                          <span>Upcoming</span>
                        </span>
                      ) : event.status === "cancelled" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono text-error border border-error/30 bg-error/10">
                          Cancelled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono text-fg-muted border border-border-strong bg-bg-surface">
                          Past event
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                        <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                        <span>{formatDate(event.startAt)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-fg-muted">
                        <MapPin className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                        <span>{event.location?.venue ?? humanise(event.format)}</span>
                      </span>
                    </>
                  }
                />
              ))}
            </ItemList>
            <ViewAll href="/events">All events</ViewAll>
          </Subsection>
        )}

        {posts.length > 0 && (
          <Subsection {...SUBSECTIONS.blogs}>
            <ItemList>
              {posts.map((post) => (
                <Item
                  key={post.id}
                  title={post.title}
                  href={post.path || `/blog/${post.slug}`}
                  description={post.description}
                  meta={
                    <>
                      {post.publishedDate && (
                        <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                          <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                          <span>{formatDate(post.publishedDate)}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-fg-muted">
                        <Clock className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                        <span>{readingTime(post.readingTimeMinutes)}</span>
                      </span>
                    </>
                  }
                />
              ))}
            </ItemList>
            <ViewAll href="/blog">All posts</ViewAll>
          </Subsection>
        )}

        {videos.length > 0 && (
          <Subsection {...SUBSECTIONS.videos}>
            <ItemList>
              {videos.slice(0, 4).map((video) => (
                <Item
                  key={video.id}
                  title={video.title}
                  href={video.link}
                  description={video.description || undefined}
                  meta={
                    <>
                      {video.date && (
                        <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                          <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                          <span>{formatMonth(video.date)}</span>
                        </span>
                      )}
                      {video.durationSeconds && (
                        <span className="inline-flex items-center gap-1.5 text-fg-muted">
                          <Clock className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                          <span>{videoDuration(video.durationSeconds)}</span>
                        </span>
                      )}
                    </>
                  }
                />
              ))}
            </ItemList>
            <ViewAll href="/videos">All videos</ViewAll>
          </Subsection>
        )}
      </Container>
    </Section>
  );
}
