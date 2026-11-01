"use client";

import { useState, useMemo } from "react";
import { Calendar, Play } from "lucide-react";
import {
  Button,
  EmptyState,
  FilterSelect,
  type FilterOption,
  ItemList,
  ListingControls,
  type ActiveFilterItem,
  LoadMore,
  type SortOption,
} from "@/components/ui";
import type { Video } from "@/lib/api-types";
import { formatDate, videoDuration, videoThumbnail } from "@/lib/format";
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
              <VideoRow key={video.id} video={video} />
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

/**
 * One video: its thumbnail, then the title, date and description.
 *
 * The title is the link, as on every list. The thumbnail opens the same
 * video, but it is hidden from assistive technology and the tab order, so a
 * keyboard or screen reader meets each video once. The length sits on the
 * picture, where video players put it.
 */
function VideoRow({ video }: { video: Video }) {
  const duration = videoDuration(video.durationSeconds);
  // "11 min watch" reads as a sentence; on the picture the length alone does.
  const length = duration.replace(/ watch$/, "");
  const thumbnail = videoThumbnail(video.link, video.thumbnail);

  return (
    <article className="video-item">
      <a
        href={video.link}
        target="_blank"
        rel="noopener noreferrer"
        className="video-thumb"
        tabIndex={-1}
        aria-hidden="true"
      >
        {thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element -- YouTube's own CDN already serves this size; next/image would proxy it through the optimiser for nothing.
          <img
            src={thumbnail}
            alt=""
            width={480}
            height={270}
            loading="lazy"
            decoding="async"
          />
        )}
        <span className="video-play">
          <Play className="h-5 w-5" aria-hidden="true" />
        </span>
        {length && <span className="video-duration">{length}</span>}
      </a>
      <div className="min-w-0">
        <h2 className="item-title">
          <a
            href={video.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            {video.title}
          </a>
        </h2>
        {video.date && (
          <p className="video-date">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{formatDate(video.date)}</span>
            {duration && <span className="sr-only">, {duration}</span>}
          </p>
        )}
        {video.description && (
          <p className="video-description">{video.description}</p>
        )}
      </div>
    </article>
  );
}
