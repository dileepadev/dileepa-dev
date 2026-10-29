import Link from "next/link";
import type { BlogPost, Community, EventRecord } from "@/lib/api-types";
import { dateParts, formatDate, humanise, readingTime } from "@/lib/format";

/**
 * The tile cards (v2.1.0 draft).
 *
 * One card shape for records in a grid: a meta row (dates or status on the
 * left, one pill on the right), the title as the card's only link, then a
 * line or two. The homepage and the index pages render the same component,
 * so a community or an event looks the same wherever it is listed.
 *
 * `headingLevel` follows the rule `Item` uses: `3` under a section heading,
 * `2` on an index page where the list is the page.
 */

type HeadingLevel = 2 | 3;

/** `count={3}` lays three cards out in one row, or stacked, never two-and-one. */
export function TileGrid({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: 3;
}) {
  return (
    <ul className={count === 3 ? "tile-grid tile-grid--3" : "tile-grid"}>
      {children}
    </ul>
  );
}

export function CommunityCard({
  community,
  headingLevel = 3,
}: {
  community: Community;
  headingLevel?: HeadingLevel;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <li className="tile-card">
      <div className="tile-meta">
        {community.period && (
          <span className="entry-date">{community.period}</span>
        )}
        <span className="tile-pill">
          {community.current && (
            <span className="hero-status-dot" aria-hidden="true" />
          )}
          {community.current ? "Current" : "Past role"}
        </span>
      </div>
      <Heading className="tile-title">
        {community.communityUrl ? (
          <a
            href={community.communityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            {community.name}
          </a>
        ) : (
          community.name
        )}
      </Heading>
      {community.role && <p className="tile-sub">{community.role}</p>}
      {community.description && (
        <p className="tile-desc">{community.description}</p>
      )}
    </li>
  );
}

export function EventCard({
  event,
  headingLevel = 3,
  showDetails = false,
}: {
  event: EventRecord;
  headingLevel?: HeadingLevel;
  /** The index page adds the event type and a recording marker. */
  showDetails?: boolean;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const date = dateParts(event.startAt, event.timezone);
  const where = event.location?.venue ?? humanise(event.format);
  const hasRecording = (event.recordings ?? []).length > 0;

  return (
    <li className="tile-card">
      <div className="tile-meta">
        {date && (
          // A calendar leaf: the month on an ink band, the day large, the
          // year under it - read at a glance, like the page of a desk
          // calendar, where a bare number over a muted caption was not.
          <span className="date-leaf">
            <span className="date-leaf-month" aria-hidden="true">
              {date.month}
            </span>
            <span className="date-leaf-day" aria-hidden="true">
              {date.day}
            </span>
            <span className="date-leaf-year" aria-hidden="true">
              {date.year}
            </span>
            <span className="sr-only">
              {formatDate(event.startAt, event.timezone)}
            </span>
          </span>
        )}
        <span className="tile-pill">
          {event.status === "upcoming" && (
            <span className="hero-status-dot" aria-hidden="true" />
          )}
          {event.status === "upcoming"
            ? "Upcoming"
            : event.status === "cancelled"
              ? "Cancelled"
              : where}
        </span>
      </div>
      <Heading className="tile-title">
        <Link href={`/events/${event.slug}`} className="text-link">
          {event.title}
        </Link>
      </Heading>
      {event.summary && <p className="tile-desc">{event.summary}</p>}
      {showDetails && (
        <div className="tile-foot">
          <span className="chip">{humanise(event.type)}</span>
          {event.location?.venue && (
            <span className="chip">{humanise(event.format)}</span>
          )}
          {hasRecording && <span className="chip">Recording</span>}
        </div>
      )}
    </li>
  );
}

export function PostCard({
  post,
  headingLevel = 3,
}: {
  post: BlogPost;
  headingLevel?: HeadingLevel;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <li className="tile-card">
      <div className="tile-meta">
        <span>{formatDate(post.publishedDate)}</span>
        <span className="tile-pill">
          {readingTime(post.readingTimeMinutes)}
        </span>
      </div>
      <Heading className="tile-title">
        <Link href={post.path || `/blog/${post.slug}`} className="text-link">
          {post.title}
        </Link>
      </Heading>
    </li>
  );
}
