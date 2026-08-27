"use client";

import { useState, useMemo } from "react";
import {
  Button,
  EmptyState,
  FilterSelect,
  type FilterOption,
  Item,
  ItemList,
  ListingControls,
  type ActiveFilterItem,
  LoadMore,
  type SortOption,
} from "@/components/ui";
import type { Community } from "@/lib/api-types";

type CommunitySortKey = "default" | "current-first" | "name-asc" | "name-desc";

const SORT_OPTIONS: SortOption<CommunitySortKey>[] = [
  { value: "default", label: "Default order" },
  { value: "current-first", label: "Current roles first" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

const COMMUNITIES_PER_PAGE = 10;

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

  // Filter options
  const statusOptions: FilterOption[] = useMemo(() => {
    let currentCount = 0;
    let pastCount = 0;

    for (const c of communities) {
      if (c.current) {
        currentCount++;
      } else {
        pastCount++;
      }
    }

    const opts: FilterOption[] = [];
    if (currentCount > 0) {
      opts.push({ value: "current", label: "Current roles", count: currentCount });
    }
    if (pastCount > 0) {
      opts.push({ value: "past", label: "Past roles", count: pastCount });
    }
    return opts;
  }, [communities]);

  // Step 1: Search
  const searchedCommunities = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return communities;

    return communities.filter((c) => matches(c, q));
  }, [communities, query]);

  // Step 2: Filter
  const filteredCommunities = useMemo(() => {
    return searchedCommunities.filter((c) => {
      if (selectedStatus === "current" && !c.current) return false;
      if (selectedStatus === "past" && c.current) return false;
      return true;
    });
  }, [searchedCommunities, selectedStatus]);

  // Step 3: Sort
  const sortedCommunities = useMemo(() => {
    const list = [...filteredCommunities];

    return list.sort((a, b) => {
      switch (sortBy) {
        case "current-first":
          if (a.current !== b.current) return a.current ? -1 : 1;
          return (b.order ?? 0) - (a.order ?? 0);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "default":
        default:
          return (b.order ?? 0) - (a.order ?? 0);
      }
    });
  }, [filteredCommunities, sortBy]);

  // Step 4: Paginate
  const paginatedCommunities = sortedCommunities.slice(0, visibleCount);
  const hasMore = visibleCount < sortedCommunities.length;

  const hasActiveFilters = Boolean(query || selectedStatus);

  const clearAllFilters = () => {
    setQuery("");
    setSelectedStatus(null);
  };

  const activeFilters: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (selectedStatus) {
      list.push({
        key: "status",
        label: selectedStatus === "current" ? "Current roles" : "Past roles",
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
                title={community.name}
                href={community.communityUrl || undefined}
                description={community.description}
                meta={
                  <>
                    <span className="block">{community.role}</span>
                    <span className="block">{community.period}</span>
                    {community.current && (
                      <span className="block text-brand">Current</span>
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

function matches(community: Community, q: string): boolean {
  return (
    community.name.toLowerCase().includes(q) ||
    (community.role ?? "").toLowerCase().includes(q) ||
    (community.description ?? "").toLowerCase().includes(q) ||
    (community.period ?? "").toLowerCase().includes(q)
  );
}
