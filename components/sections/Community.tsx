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
import { formatDate, formatMonth, readingTime } from "@/lib/format";

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
                      <span className="block">{community.role}</span>
                      <span className="block">{community.period}</span>
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
                      <span className="block">{formatDate(event.startAt)}</span>
                      <span className="block">
                        {event.location?.venue ?? "Online"}
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
                      <span className="block">
                        {formatDate(post.publishedDate)}
                      </span>
                      <span className="block">
                        {readingTime(post.readingTimeMinutes)}
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
                  meta={formatMonth(video.date)}
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
