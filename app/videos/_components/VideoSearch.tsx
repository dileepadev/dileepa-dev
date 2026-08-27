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
import type { Video } from "@/lib/api-types";
import { formatDate } from "@/lib/format";

type VideoSortKey = "newest" | "oldest" | "title-asc" | "title-desc";

const SORT_OPTIONS: SortOption<VideoSortKey>[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

const VIDEOS_PER_PAGE = 10;

/** Client-side search, filtering, sorting, and progressive pagination across videos. */
export function VideoSearch({ videos }: { videos: Video[] }) {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<VideoSortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(VIDEOS_PER_PAGE);

  // Reset pagination when search, filter or sort changes
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${selectedYear}|${sortBy}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(VIDEOS_PER_PAGE);
  }

  // Filter options: unique years
  const yearOptions: FilterOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of videos) {
      if (v.date) {
        const year = new Date(v.date).getFullYear().toString();
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
  }, [videos]);

  // Step 1: Search
  const searchedVideos = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return videos;

    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        (v.description ?? "").toLowerCase().includes(q),
    );
  }, [videos, query]);

  // Step 2: Filter
  const filteredVideos = useMemo(() => {
    return searchedVideos.filter((v) => {
      if (selectedYear) {
        const year = v.date ? new Date(v.date).getFullYear().toString() : null;
        if (year !== selectedYear) return false;
      }
      return true;
    });
  }, [searchedVideos, selectedYear]);

  // Step 3: Sort
  const sortedVideos = useMemo(() => {
    const list = [...filteredVideos];

    return list.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
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
  }, [filteredVideos, sortBy]);

  // Step 4: Paginate
  const paginatedVideos = sortedVideos.slice(0, visibleCount);
  const hasMore = visibleCount < sortedVideos.length;

  const hasActiveFilters = Boolean(query || selectedYear);

  const clearAllFilters = () => {
    setQuery("");
    setSelectedYear(null);
  };

  const activeFilters: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (selectedYear) {
      list.push({
        key: "year",
        label: `Year: ${selectedYear}`,
        onRemove: () => setSelectedYear(null),
      });
    }
    return list;
  }, [selectedYear]);

  return (
    <div className="space-y-6">
      <ListingControls
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search walkthroughs, topics, descriptions…"
        filters={
          yearOptions.length > 0 && (
            <FilterSelect
              label="Year"
              value={selectedYear}
              options={yearOptions}
              onChange={setSelectedYear}
              allLabel="All years"
            />
          )
        }
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={SORT_OPTIONS}
        sortLabel="Sort videos"
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
        filteredCount={sortedVideos.length}
        totalCount={videos.length}
        itemNoun="Video"
        itemPlural="Videos"
      />

      {sortedVideos.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No videos match your criteria"
            hint={
              hasActiveFilters
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No videos are currently listed."
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
            {paginatedVideos.map((video) => (
              <Item
                key={video.id}
                title={video.title}
                href={video.link}
                description={video.description || undefined}
                meta={formatDate(video.date)}
              />
            ))}
          </ItemList>

          {hasMore && (
            <LoadMore
              shown={paginatedVideos.length}
              total={sortedVideos.length}
              batchSize={VIDEOS_PER_PAGE}
              onLoadMore={() =>
                setVisibleCount((prev) => prev + VIDEOS_PER_PAGE)
              }
              onShowAll={() => setVisibleCount(sortedVideos.length)}
            />
          )}
        </div>
      )}
    </div>
  );
}
