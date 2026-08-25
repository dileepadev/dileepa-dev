"use client";

import { useState, useMemo } from "react";
import {
  Badge,
  EmptyState,
  Item,
  ItemList,
  SearchInput,
  Subsection,
} from "@/components/ui";
import type { EventRecord } from "@/lib/api-types";
import { formatDate, humanise } from "@/lib/format";

/** Client-side search across both event groups. */
export function EventSearch({
  upcoming,
  completed,
}: {
  upcoming: EventRecord[];
  completed: EventRecord[];
}) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const filteredUpcoming = useMemo(
    () => (q ? upcoming.filter((e) => matches(e, q)) : upcoming),
    [upcoming, q],
  );
  const filteredCompleted = useMemo(
    () => (q ? completed.filter((e) => matches(e, q)) : completed),
    [completed, q],
  );

  const total = upcoming.length + completed.length;
  const shown = filteredUpcoming.length + filteredCompleted.length;

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search events…"
        resultCount={shown}
        totalCount={total}
      />

      {shown === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No events match your search."
            hint="Try a different keyword or clear the search."
          />
        </div>
      ) : (
        <>
          {filteredUpcoming.length > 0 && (
            <Subsection title="Upcoming" note="Soonest first.">
              <EventItems events={filteredUpcoming} />
            </Subsection>
          )}

          {filteredCompleted.length > 0 && (
            <Subsection title="Past" note="Most recent first.">
              <EventItems events={filteredCompleted} />
            </Subsection>
          )}
        </>
      )}
    </>
  );
}

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

/** Case-insensitive match against the fields a reader would search. */
function matches(event: EventRecord, q: string): boolean {
  return (
    event.title.toLowerCase().includes(q) ||
    (event.summary ?? "").toLowerCase().includes(q) ||
    humanise(event.type).toLowerCase().includes(q) ||
    humanise(event.format).toLowerCase().includes(q) ||
    (event.location?.venue ?? "").toLowerCase().includes(q) ||
    (event.location?.city ?? "").toLowerCase().includes(q)
  );
}
