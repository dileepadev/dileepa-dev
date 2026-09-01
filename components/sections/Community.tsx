import {
  Calendar,
  Clock,
  MapPin,
  Mic,
  PenLine,
  Users,
  Video as VideoIcon,
} from "lucide-react";
import {
  Chip,
  Container,
  Item,
  ItemList,
  Section,
  SectionHeading,
  StatusBadge,
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
    <Section id="community">
      <Container>
        <SectionHeading {...SECTIONS.community} />

        {communities.length > 0 && (
          <Subsection
            {...SUBSECTIONS.communities}
            icon={<Users className="h-4 w-4" />}
          >
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
                        <StatusBadge>Current</StatusBadge>
                      ) : (
                        <Chip>Past role</Chip>
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
          <Subsection
            {...SUBSECTIONS.events}
            icon={<Mic className="h-4 w-4" />}
          >
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
                        <StatusBadge>Upcoming</StatusBadge>
                      ) : event.status === "cancelled" ? (
                        <Chip className="text-error border-error/30 bg-error/10">
                          Cancelled
                        </Chip>
                      ) : (
                        <Chip>Past event</Chip>
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
          <Subsection
            {...SUBSECTIONS.blogs}
            icon={<PenLine className="h-4 w-4" />}
          >
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
          <Subsection
            {...SUBSECTIONS.videos}
            icon={<VideoIcon className="h-4 w-4" />}
          >
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
