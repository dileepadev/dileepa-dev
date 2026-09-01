"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import {
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
  type SortOption,
} from "@/components/ui";
import type { Community } from "@/lib/api-types";
import {
  buildFacets,
  compareNumber,
  compareText,
  type FacetSpec,
  matchesTokens,
  searchTokens,
  toOptions,
} from "@/lib/listing";

type CommunitySortKey = "default" | "current-first" | "name-asc" | "name-desc";

const SORT_OPTIONS: SortOption<CommunitySortKey>[] = [
  { value: "default", label: "Default order" },
  { value: "current-first", label: "Current roles first" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

const COMMUNITIES_PER_PAGE = 10;

const STATUS_LABELS: Record<string, string> = {
  current: "Current roles",
  past: "Past roles",
};

/**
 * The filterable dimensions, and how a community is filed under each.
 *
 * `current` is a boolean on the record rather than a string, so it is projected
 * onto the two values the dropdown offers - which keeps the count beside an
 * option and the rows it yields on one rule instead of two.
 */
const FACETS: FacetSpec<Community>[] = [
  {
    key: "status",
    values: (community) => [community.current ? "current" : "past"],
  },
];

/** Client-side search, filtering, sorting, and progressive pagination across communities. */
export function CommunitySearch({ communities }: { communities: Community[] }) {
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<CommunitySortKey>("default");
  const [visibleCount, setVisibleCount] = useState(COMMUNITIES_PER_PAGE);

  // Reset pagination when search, filter or sort changes
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${selectedStatus}|${sortBy}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(COMMUNITIES_PER_PAGE);
  }

  // Step 1: Search
  const searchedCommunities = useMemo(() => {
    const tokens = searchTokens(query);
    if (tokens.length === 0) return communities;

    return communities.filter((c) =>
      matchesTokens(
        [
          c.name,
          c.role,
          c.description,
          c.period,
          STATUS_LABELS[c.current ? "current" : "past"],
        ],
        tokens,
      ),
    );
  }, [communities, query]);

  // Step 2: Filter, counting each dimension against the rest
  const { counts, matched: filteredCommunities } = useMemo(
    () => buildFacets(searchedCommunities, FACETS, { status: selectedStatus }),
    [searchedCommunities, selectedStatus],
  );

  const statusOptions: FilterOption[] = useMemo(
    () =>
      toOptions(counts.status, {
        label: (value) => STATUS_LABELS[value] ?? value,
        // "Current roles" before "Past roles" - the order a reader expects, and
        // one a count-first ordering would flip as soon as the past outnumbers
        // the present.
        order: "label",
        keep: selectedStatus,
      }),
    [counts.status, selectedStatus],
  );

  // Step 3: Sort
  const sortedCommunities = useMemo(() => {
    const list = [...filteredCommunities];

    return list.sort((a, b) => {
      switch (sortBy) {
        case "current-first":
          if (a.current !== b.current) return a.current ? -1 : 1;
          return (
            compareNumber(a.order, b.order, "desc") ||
            compareText(a.name, b.name)
          );
        case "name-asc":
          return compareText(a.name, b.name);
        case "name-desc":
          return compareText(b.name, a.name);
        case "default":
        default:
          return (
            compareNumber(a.order, b.order, "desc") ||
            compareText(a.name, b.name)
          );
      }
    });
  }, [filteredCommunities, sortBy]);

  // Step 4: Paginate
  const paginatedCommunities = sortedCommunities.slice(0, visibleCount);
  const hasMore = visibleCount < sortedCommunities.length;

  const hasActiveFilters = Boolean(query.trim() || selectedStatus);

  const clearAllFilters = () => {
    setQuery("");
    setSelectedStatus(null);
  };

  const activeFilters: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (selectedStatus) {
      list.push({
        key: "status",
        label: STATUS_LABELS[selectedStatus] ?? selectedStatus,
        onRemove: () => setSelectedStatus(null),
      });
    }
    return list;
  }, [selectedStatus]);

  return (
    <div className="space-y-6">
      <ListingControls
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search communities, roles, topics, periods…"
        filters={
          statusOptions.length > 0 && (
            <FilterSelect
              label="Status"
              value={selectedStatus}
              options={statusOptions}
              onChange={setSelectedStatus}
              allLabel="All roles"
            />
          )
        }
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={SORT_OPTIONS}
        sortLabel="Sort communities"
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
        filteredCount={sortedCommunities.length}
        totalCount={communities.length}
        itemNoun="Community"
        itemPlural="Communities"
      />

      {sortedCommunities.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No communities match your criteria"
            hint={
              hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No communities are currently listed."
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
          <ItemList>
            {paginatedCommunities.map((community) => (
              <Item
                key={community.id}
                headingLevel={2}
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
                      <span className="font-medium text-fg">
                        {community.role}
                      </span>
                    )}
                    {community.period && (
                      <span className="inline-flex items-center gap-1.5 text-fg-muted">
                        <Calendar
                          className="h-3 w-3 shrink-0 text-fg-muted"
                          aria-hidden="true"
                        />
                        <span>{community.period}</span>
                      </span>
                    )}
                  </>
                }
              />
            ))}
          </ItemList>

          {hasMore && (
            <LoadMore
              shown={paginatedCommunities.length}
              total={sortedCommunities.length}
              batchSize={COMMUNITIES_PER_PAGE}
              onLoadMore={() =>
                setVisibleCount((prev) => prev + COMMUNITIES_PER_PAGE)
              }
              onShowAll={() => setVisibleCount(sortedCommunities.length)}
            />
          )}
        </div>
      )}
    </div>
  );
}
