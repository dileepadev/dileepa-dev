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
  Chip,
  EmptyState,
  FilterSelect,
  type FilterOption,
  Item,
  ItemList,
  ListingControls,
  type ActiveFilterItem,
  LoadMore,
  StatusBadge,
  Subsection,
  type SortOption,
} from "@/components/ui";
import type { EventRecord } from "@/lib/api-types";
import { formatDate, humanise } from "@/lib/format";
import {
  buildFacets,
  compareDate,
  compareText,
  type FacetSpec,
  matchesTokens,
  searchTokens,
  toOptions,
  yearOf,
} from "@/lib/listing";

type EventSortKey =
  "default" | "newest" | "oldest" | "title-asc" | "title-desc";

const SORT_OPTIONS: SortOption<EventSortKey>[] = [
  { value: "default", label: "Default order" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

const EVENTS_PER_PAGE = 10;

/** The filterable dimensions, and how an event is filed under each. */
const FACETS: FacetSpec<EventRecord>[] = [
  { key: "type", values: (e) => [e.type] },
  { key: "format", values: (e) => [e.format] },
  { key: "status", values: (e) => [e.status] },
  { key: "year", values: (e) => [yearOf(e.startAt)] },
];

/** Client-side search, filtering, sorting, and progressive pagination across events. */
export function EventSearch({
  upcoming,
  completed,
}: {
  upcoming: EventRecord[];
  completed: EventRecord[];
}) {
  const allEvents = useMemo(
    () => [...upcoming, ...completed],
    [upcoming, completed],
  );

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

  // Step 1: Search
  const searchedEvents = useMemo(() => {
    const tokens = searchTokens(query);
    if (tokens.length === 0) return allEvents;

    return allEvents.filter((e) =>
      matchesTokens(
        [
          e.title,
          e.summary,
          e.description,
          e.type,
          humanise(e.type),
          e.format,
          humanise(e.format),
          e.status,
          humanise(e.status),
          e.location?.venue,
          e.location?.city,
          e.location?.country,
          yearOf(e.startAt),
        ],
        tokens,
      ),
    );
  }, [allEvents, query]);

  // Step 2: Filter, counting each dimension against the rest
  const { counts, matched: filteredEvents } = useMemo(
    () =>
      buildFacets(searchedEvents, FACETS, {
        type: selectedType,
        format: selectedFormat,
        status: selectedStatus,
        year: selectedYear,
      }),
    [
      searchedEvents,
      selectedType,
      selectedFormat,
      selectedStatus,
      selectedYear,
    ],
  );

  const typeOptions: FilterOption[] = useMemo(
    () => toOptions(counts.type, { label: humanise, keep: selectedType }),
    [counts.type, selectedType],
  );

  const formatOptions: FilterOption[] = useMemo(
    () => toOptions(counts.format, { label: humanise, keep: selectedFormat }),
    [counts.format, selectedFormat],
  );

  const statusOptions: FilterOption[] = useMemo(
    () => toOptions(counts.status, { label: humanise, keep: selectedStatus }),
    [counts.status, selectedStatus],
  );

  const yearOptions: FilterOption[] = useMemo(
    () => toOptions(counts.year, { order: "year", keep: selectedYear }),
    [counts.year, selectedYear],
  );

  // Step 3: Sort
  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];

    if (sortBy === "default") {
      // Default: Upcoming soonest first, then completed most recent first
      return list.sort((a, b) => {
        if (a.status === "upcoming" && b.status !== "upcoming") return -1;
        if (b.status === "upcoming" && a.status !== "upcoming") return 1;

        if (a.status === "upcoming") {
          return compareDate(a.startAt, b.startAt, "oldest");
        }
        return compareDate(a.startAt, b.startAt, "newest");
      });
    }

    switch (sortBy) {
      case "newest":
        return list.sort((a, b) => compareDate(a.startAt, b.startAt, "newest"));
      case "oldest":
        return list.sort((a, b) => compareDate(a.startAt, b.startAt, "oldest"));
      case "title-asc":
        return list.sort((a, b) => compareText(a.title, b.title));
      case "title-desc":
        return list.sort((a, b) => compareText(b.title, a.title));
      default:
        return list;
    }
  }, [filteredEvents, sortBy]);

  // Step 4: Paginate
  const hasActiveFilters = Boolean(
    query.trim() ||
    selectedType ||
    selectedFormat ||
    selectedStatus ||
    selectedYear,
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
          headingLevel={2}
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
                <Calendar
                  className="h-3 w-3 shrink-0 text-fg-muted"
                  aria-hidden="true"
                />
                <span>{formatDate(event.startAt)}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-fg-muted">
                {event.format === "in_person" ? (
                  <MapPin
                    className="h-3 w-3 shrink-0 text-fg-muted"
                    aria-hidden="true"
                  />
                ) : event.format === "online" ? (
                  <Globe
                    className="h-3 w-3 shrink-0 text-fg-muted"
                    aria-hidden="true"
                  />
                ) : (
                  <Layers
                    className="h-3 w-3 shrink-0 text-fg-muted"
                    aria-hidden="true"
                  />
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
                <MapPin
                  className="h-3 w-3 shrink-0 text-fg-muted"
                  aria-hidden="true"
                />
                <span>{event.location.venue}</span>
              </Badge>
            )}
          </div>
        </Item>
      ))}
    </ItemList>
  );
}
