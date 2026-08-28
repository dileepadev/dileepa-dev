"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
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
import { formatDate, videoDuration } from "@/lib/format";
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

type VideoSortKey = "newest" | "oldest" | "title-asc" | "title-desc";

const SORT_OPTIONS: SortOption<VideoSortKey>[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

const VIDEOS_PER_PAGE = 10;

/** The filterable dimensions, and how a video is filed under each. */
const FACETS: FacetSpec<Video>[] = [
  { key: "year", values: (video) => [yearOf(video.date)] },
];

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

  // Step 1: Search
  const searchedVideos = useMemo(() => {
    const tokens = searchTokens(query);
    if (tokens.length === 0) return videos;

    return videos.filter((v) =>
      matchesTokens([v.title, v.description, formatDate(v.date)], tokens),
    );
  }, [videos, query]);

  // Step 2: Filter, counting each dimension against the rest
  const { counts, matched: filteredVideos } = useMemo(
    () => buildFacets(searchedVideos, FACETS, { year: selectedYear }),
    [searchedVideos, selectedYear],
  );

  const yearOptions: FilterOption[] = useMemo(
    () => toOptions(counts.year, { order: "year", keep: selectedYear }),
    [counts.year, selectedYear],
  );

  // Step 3: Sort
  const sortedVideos = useMemo(() => {
    const list = [...filteredVideos];

    return list.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return compareDate(a.date, b.date, "newest");
        case "oldest":
          return compareDate(a.date, b.date, "oldest");
        case "title-asc":
          return compareText(a.title, b.title);
        case "title-desc":
          return compareText(b.title, a.title);
        default:
          return 0;
      }
    });
  }, [filteredVideos, sortBy]);

  // Step 4: Paginate
  const paginatedVideos = sortedVideos.slice(0, visibleCount);
  const hasMore = visibleCount < sortedVideos.length;

  const hasActiveFilters = Boolean(query.trim() || selectedYear);

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
                meta={
                  <>
                    {video.date && (
                      <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                        <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                        <span>{formatDate(video.date)}</span>
                      </span>
                    )}
                    {video.durationSeconds && (
                      <span className="inline-flex items-center gap-1.5 text-fg-muted">
                        <Clock className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                        <span>{videoDuration(video.durationSeconds)}</span>
                      </span>
                    )}
                  </>
                }
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
