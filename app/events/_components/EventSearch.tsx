"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  Globe,
  History,
  Layers,
  MapPin,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  FilterSelect,
  type FilterOption,
  Item,
  ItemList,
  ListingControls,
  type ActiveFilterItem,
  LoadMore,
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

const EVENTS_PER_PAGE = 10;

/** Client-side search, filtering, sorting, and progressive pagination across events. */
export function EventSearch({
  upcoming,
  completed,
}: {
  upcoming: EventRecord[];
  completed: EventRecord[];
}) {
  const allEvents = useMemo(() => [...upcoming, ...completed], [upcoming, completed]);

  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<EventSortKey>("default");
  const [visibleCount, setVisibleCount] = useState(EVENTS_PER_PAGE);
  const [visiblePastCount, setVisiblePastCount] = useState(EVENTS_PER_PAGE);

  // Reset pagination when search, filter or sort changes
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${selectedType}|${selectedFormat}|${selectedStatus}|${selectedYear}|${sortBy}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(EVENTS_PER_PAGE);
    setVisiblePastCount(EVENTS_PER_PAGE);
  }

  // Dynamic filter options
  const typeOptions: FilterOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of allEvents) {
      if (e.type) {
        counts.set(e.type, (counts.get(e.type) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        value: type,
        label: humanise(type),
        count,
      }));
  }, [allEvents]);

  const formatOptions: FilterOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of allEvents) {
      if (e.format) {
        counts.set(e.format, (counts.get(e.format) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([format, count]) => ({
        value: format,
        label: humanise(format),
        count,
      }));
  }, [allEvents]);

  const statusOptions: FilterOption[] = useMemo(() => {
    let upcomingCount = 0;
    let completedCount = 0;
    for (const e of allEvents) {
      if (e.status === "upcoming") upcomingCount++;
      if (e.status === "completed") completedCount++;
    }
    const opts: FilterOption[] = [];
    if (upcomingCount > 0) {
      opts.push({ value: "upcoming", label: "Upcoming", count: upcomingCount });
    }
    if (completedCount > 0) {
      opts.push({ value: "completed", label: "Completed", count: completedCount });
    }
    return opts;
  }, [allEvents]);

  const yearOptions: FilterOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of allEvents) {
      if (e.startAt) {
        const year = new Date(e.startAt).getFullYear().toString();
        if (!isNaN(Number(year))) {
          counts.set(year, (counts.get(year) ?? 0) + 1);
        }
      }
    }
    return [...counts.entries()]
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([year, count]) => ({
        value: year,
        label: year,
        count,
      }));
  }, [allEvents]);

  // Step 1: Search
  const searchedEvents = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return allEvents;

    return allEvents.filter((e) => matches(e, q));
  }, [allEvents, query]);

  // Step 2: Filter
  const filteredEvents = useMemo(() => {
    return searchedEvents.filter((e) => {
      if (selectedType && e.type !== selectedType) return false;
      if (selectedFormat && e.format !== selectedFormat) return false;
      if (selectedStatus && e.status !== selectedStatus) return false;
      if (selectedYear) {
        const year = e.startAt ? new Date(e.startAt).getFullYear().toString() : null;
        if (year !== selectedYear) return false;
      }
      return true;
    });
  }, [searchedEvents, selectedType, selectedFormat, selectedStatus, selectedYear]);

  // Step 3: Sort
  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];

    if (sortBy === "default") {
      // Default: Upcoming soonest first, then completed most recent first
      return list.sort((a, b) => {
        if (a.status === "upcoming" && b.status !== "upcoming") return -1;
        if (b.status === "upcoming" && a.status !== "upcoming") return 1;

        const dateA = a.startAt ? new Date(a.startAt).getTime() : 0;
        const dateB = b.startAt ? new Date(b.startAt).getTime() : 0;

        if (a.status === "upcoming") {
          return dateA - dateB; // Soonest upcoming first
        }
        return dateB - dateA; // Most recent past first
      });
    }

    return list.sort((a, b) => {
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
  }, [filteredEvents, sortBy]);

  // Step 4: Paginate
  const hasActiveFilters = Boolean(
    query || selectedType || selectedFormat || selectedStatus || selectedYear,
  );

  const clearAllFilters = () => {
    setQuery("");
    setSelectedType(null);
    setSelectedFormat(null);
    setSelectedStatus(null);
    setSelectedYear(null);
  };

  const activeFilters: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (selectedStatus) {
      list.push({
        key: "status",
        label: `Status: ${humanise(selectedStatus)}`,
        onRemove: () => setSelectedStatus(null),
      });
    }
    if (selectedType) {
      list.push({
        key: "type",
        label: `Type: ${humanise(selectedType)}`,
        onRemove: () => setSelectedType(null),
      });
    }
    if (selectedFormat) {
      list.push({
        key: "format",
        label: `Format: ${humanise(selectedFormat)}`,
        onRemove: () => setSelectedFormat(null),
      });
    }
    if (selectedYear) {
      list.push({
        key: "year",
        label: `Year: ${selectedYear}`,
        onRemove: () => setSelectedYear(null),
      });
    }
    return list;
  }, [selectedStatus, selectedType, selectedFormat, selectedYear]);

  // If sorting is on default and no specific status filter was selected, we can preserve the clean Upcoming / Past section grouping!
  const isDefaultView = sortBy === "default" && !selectedStatus;
  const filteredUpcoming = useMemo(
    () => sortedEvents.filter((e) => e.status === "upcoming"),
    [sortedEvents],
  );
  const filteredCompleted = useMemo(
    () => sortedEvents.filter((e) => e.status === "completed"),
    [sortedEvents],
  );
  const paginatedCompleted = filteredCompleted.slice(0, visiblePastCount);

  const paginatedUnified = sortedEvents.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      <ListingControls
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search talks, workshops, venues, topics…"
        filters={
          <>
            {statusOptions.length > 0 && (
              <FilterSelect
                label="Status"
                value={selectedStatus}
                options={statusOptions}
                onChange={setSelectedStatus}
                allLabel="All events"
              />
            )}
            {typeOptions.length > 0 && (
              <FilterSelect
                label="Type"
                value={selectedType}
                options={typeOptions}
                onChange={setSelectedType}
                allLabel="All types"
              />
            )}
            {formatOptions.length > 0 && (
              <FilterSelect
                label="Format"
                value={selectedFormat}
                options={formatOptions}
                onChange={setSelectedFormat}
                allLabel="All formats"
              />
            )}
            {yearOptions.length > 0 && (
              <FilterSelect
                label="Year"
                value={selectedYear}
                options={yearOptions}
                onChange={setSelectedYear}
                allLabel="All years"
              />
            )}
          </>
        }
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={SORT_OPTIONS}
        sortLabel="Sort events"
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
        filteredCount={sortedEvents.length}
        totalCount={allEvents.length}
        itemNoun="Event"
        itemPlural="Events"
      />

      {sortedEvents.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No events match your criteria"
            hint={
              hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No events are currently listed."
            }
          >
            {hasActiveFilters && (
              <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6">
          {isDefaultView ? (
            <>
              {filteredUpcoming.length > 0 && (
                <Subsection
                  title="Upcoming"
                  note="Soonest first."
                  icon={<Sparkles className="h-4 w-4" />}
                >
                  <EventItems events={filteredUpcoming} />
                </Subsection>
              )}

              {filteredCompleted.length > 0 && (
                <Subsection
                  title="Past"
                  note="Most recent first."
                  icon={<History className="h-4 w-4" />}
                >
                  <EventItems events={paginatedCompleted} />
                  <LoadMore
                    shown={paginatedCompleted.length}
                    total={filteredCompleted.length}
                    batchSize={EVENTS_PER_PAGE}
                    onLoadMore={() =>
                      setVisiblePastCount((prev) => prev + EVENTS_PER_PAGE)
                    }
                    onShowAll={() =>
                      setVisiblePastCount(filteredCompleted.length)
                    }
                  />
                </Subsection>
              )}
            </>
          ) : (
            <>
              <EventItems events={paginatedUnified} />
              {visibleCount < sortedEvents.length && (
                <LoadMore
                  shown={paginatedUnified.length}
                  total={sortedEvents.length}
                  batchSize={EVENTS_PER_PAGE}
                  onLoadMore={() =>
                    setVisibleCount((prev) => prev + EVENTS_PER_PAGE)
                  }
                  onShowAll={() => setVisibleCount(sortedEvents.length)}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
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
              {event.status === "upcoming" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border border-brand/30 bg-brand/10 text-brand transition-colors duration-150 hover:border-brand hover:bg-brand/20 cursor-default">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
                  <span>Upcoming</span>
                </span>
              ) : event.status === "cancelled" ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono text-error border border-error/30 bg-error/10 transition-colors duration-150 hover:border-error/60 hover:bg-error/20 cursor-default">
                  Cancelled
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono text-fg-muted border border-border-strong bg-bg-surface transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
                  Past event
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                <span>{formatDate(event.startAt)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                {event.format === "in_person" ? (
                  <MapPin className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                ) : event.format === "online" ? (
                  <Globe className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                ) : (
                  <Layers className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                )}
                <span>{humanise(event.format)}</span>
              </span>
              {(event.recordings ?? []).length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-brand font-medium">
                  <PlayCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                  <span>Recording</span>
                </span>
              )}
            </>
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{humanise(event.type)}</Badge>
            {event.location?.venue && (
              <Badge className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                <span>{event.location.venue}</span>
              </Badge>
            )}
          </div>
        </Item>
      ))}
    </ItemList>
  );
}

function matches(event: EventRecord, q: string): boolean {
  return (
    event.title.toLowerCase().includes(q) ||
    (event.summary ?? "").toLowerCase().includes(q) ||
    (event.description ?? "").toLowerCase().includes(q) ||
    humanise(event.type).toLowerCase().includes(q) ||
    humanise(event.format).toLowerCase().includes(q) ||
    (event.location?.venue ?? "").toLowerCase().includes(q) ||
    (event.location?.city ?? "").toLowerCase().includes(q)
  );
}
