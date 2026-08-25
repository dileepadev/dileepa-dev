import type { Metadata } from "next";
import {
  Badge,
  Container,
  EmptyState,
  Item,
  ItemList,
  Section,
  Subsection,
} from "@/components/ui";
import { api } from "@/lib/api";
import type { EventRecord } from "@/lib/api-types";
import { EMPTY_STATES } from "@/lib/constants";
import { formatDate, humanise } from "@/lib/format";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Talks, workshops and webinars, with slides and recordings where they exist.",
  alternates: { canonical: "/events" },
};

function EventItems({ events }: { events: EventRecord[] }) {
  return (
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
              <span className="block">{humanise(event.format)}</span>
              {(event.recordings ?? []).length > 0 && (
                <span className="block">Recording</span>
              )}
            </>
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{humanise(event.type)}</Badge>
            {event.status === "cancelled" && <Badge>Cancelled</Badge>}
            {event.location?.venue && <Badge>{event.location.venue}</Badge>}
          </div>
        </Item>
      ))}
    </ItemList>
  );
}

export default async function EventsPage() {
  // Two queries rather than one filtered in the browser: upcoming sorts
  // soonest-first and completed sorts most-recent-first, which is two opposite
  // orders and cannot be one query.
  const [upcoming, completed] = await Promise.all([
    api.getEvents({ status: "upcoming", limit: 50 }),
    api.getEvents({ status: "completed", limit: 100 }),
  ]);

  const empty = upcoming.length === 0 && completed.length === 0;

  return (
    <Section>
      <Container>
        <div className="section-label">Events</div>
        <h1>Talks and workshops</h1>
        <p className="section-intro">
          Events I have delivered at meetups, conferences and online. Slides and
          recordings are linked where they exist.
        </p>

        {empty ? (
          <EmptyState {...EMPTY_STATES.events} />
        ) : (
          <>
            {upcoming.length > 0 && (
              <Subsection title="Upcoming" note="Soonest first.">
                <EventItems events={upcoming} />
              </Subsection>
            )}

            {completed.length > 0 && (
              <Subsection title="Past" note="Most recent first.">
                <EventItems events={completed} />
              </Subsection>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
