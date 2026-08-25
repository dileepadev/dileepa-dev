"use client";

import { useState, useMemo } from "react";
import {
  Badge,
  Button,
  EmptyState,
  Item,
  ItemList,
  SearchInput,
  SortSelect,
  Subsection,
  type SortOption,
} from "@/components/ui";
import type { EventRecord } from "@/lib/api-types";
import { formatDate, humanise } from "@/lib/format";

type EventSortKey =
  | "default"
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc";

const SORT_OPTIONS: SortOption<EventSortKey>[] = [
  { value: "default", label: "Default order" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

/** Client-side search and sorting across events. */
export function EventSearch({
  upcoming,
  completed,
}: {
  upcoming: EventRecord[];
  completed: EventRecord[];
}) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<EventSortKey>("default");

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
  const hasFilter = q.length > 0;

  // Custom unified sort across all matching events when not on default order
  const customSortedEvents = useMemo(() => {
    if (sortBy === "default") return null;

    const merged = [...filteredUpcoming, ...filteredCompleted];
    merged.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = a.startAt ? new Date(a.startAt).getTime() : 0;
          const dateB = b.startAt ? new Date(b.startAt).getTime() : 0;
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = a.startAt ? new Date(a.startAt).getTime() : 0;
          const dateB = b.startAt ? new Date(b.startAt).getTime() : 0;
          return dateA - dateB;
        }
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return merged;
  }, [filteredUpcoming, filteredCompleted, sortBy]);

  return (
    <>
      <div className="list-toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search talks, venues, topics…"
        />
        <SortSelect
          value={sortBy}
          onChange={setSortBy}
          options={SORT_OPTIONS}
          label="Sort events"
        />
      </div>

      {hasFilter && (
        <div className="filter-status">
          <span>
            Showing {shown} of {total} {total === 1 ? "event" : "events"}
          </span>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="filter-reset-btn"
          >
            Clear filter
          </button>
        </div>
      )}

      {shown === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No events match your search."
            hint="Try a different keyword or clear the search filter."
          >
            {hasFilter && (
              <div className="mt-4 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => setQuery("")}
                >
                  Clear filter
                </Button>
              </div>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8">
          {customSortedEvents ? (
            <EventItems events={customSortedEvents} />
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
        </div>
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
