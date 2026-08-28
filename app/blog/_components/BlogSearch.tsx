"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Bookmark, BookOpen, Calendar, Clock, Layers } from "lucide-react";
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
  SearchInput,
  type SortOption,
} from "@/components/ui";
import { formatDate, readingTime, toDateAttribute } from "@/lib/format";
import {
  buildFacets,
  compareDate,
  compareNumber,
  compareText,
  type FacetSpec,
  matchesTokens,
  searchTokens,
  toOptions,
  yearOf,
} from "@/lib/listing";
import { cn } from "@/lib/utils";

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string | null;
  publishedDate?: string | null | undefined;
  readingTimeMinutes: number | null;
  series?: { name: string; order?: number } | null;
  tags?: string[] | null;
  banner?: { url: string; alt?: string | null } | null;
  seo?: { ogImage?: string | null } | null;
}

export interface SeriesGroup {
  name: string;
  description?: string;
  posts: BlogPostSummary[];
  totalReadingTime: number;
  coverImage?: string;
  tags: string[];
  firstDate?: string;
  lastDate?: string;
}

type ViewMode = "all" | "series";

type BlogSortKey =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "read-time-asc"
  | "read-time-desc";

const SORT_OPTIONS: SortOption<BlogSortKey>[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
  { value: "read-time-asc", label: "Shortest read" },
  { value: "read-time-desc", label: "Longest read" },
];

const POSTS_PER_PAGE = 10;
const SERIES_PER_PAGE = 6;

/** The filterable dimensions, and how a blog post is filed under each. */
const FACETS: FacetSpec<BlogPostSummary>[] = [
  { key: "tag", values: (p) => p.tags ?? [] },
  { key: "year", values: (p) => [yearOf(p.publishedDate)] },
  { key: "series", values: (p) => [p.series?.name] },
];

/** Client-side search, filtering, sorting, series, and progressive pagination across blog posts. */
export function BlogSearch({ posts }: { posts: BlogPostSummary[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedSeriesName, setSelectedSeriesName] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<BlogSortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [visibleSeriesCount, setVisibleSeriesCount] = useState(SERIES_PER_PAGE);

  // Reset pagination when filter/sort/view state changes
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${selectedTag}|${selectedYear}|${selectedSeriesFilter}|${sortBy}|${viewMode}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(POSTS_PER_PAGE);
    setVisibleSeriesCount(SERIES_PER_PAGE);
  }

  // Derive series groups from posts that have a series name
  const allSeries = useMemo<SeriesGroup[]>(() => {
    const map = new Map<string, BlogPostSummary[]>();

    for (const post of posts) {
      if (post.series?.name) {
        const list = map.get(post.series.name) ?? [];
        list.push(post);
        map.set(post.series.name, list);
      }
    }

    const groups: SeriesGroup[] = [];

    for (const [name, seriesPosts] of map.entries()) {
      const sortedPosts = [...seriesPosts].sort((a, b) => {
        const orderA = a.series?.order ?? 0;
        const orderB = b.series?.order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return compareDate(a.publishedDate, b.publishedDate, "oldest");
      });

      const totalReadingTime = sortedPosts.reduce(
        (sum, p) => sum + (p.readingTimeMinutes ?? 0),
        0,
      );

      const allTags = Array.from(
        new Set(sortedPosts.flatMap((p) => p.tags ?? [])),
      );

      const coverImage =
        sortedPosts.find((p) => p.banner?.url || p.seo?.ogImage)?.banner?.url ??
        sortedPosts.find((p) => p.seo?.ogImage)?.seo?.ogImage ??
        undefined;

      const description =
        sortedPosts[0]?.description ?? `A multi-part series covering ${name}.`;

      groups.push({
        name,
        description,
        posts: sortedPosts,
        totalReadingTime,
        coverImage,
        tags: allTags,
        firstDate: sortedPosts[0]?.publishedDate ?? undefined,
        lastDate:
          sortedPosts[sortedPosts.length - 1]?.publishedDate ?? undefined,
      });
    }

    return groups.sort(
      (a, b) => b.posts.length - a.posts.length || compareText(a.name, b.name),
    );
  }, [posts]);

  // Step 1: Search
  const searchedPosts = useMemo(() => {
    const tokens = searchTokens(query);
    if (tokens.length === 0) return posts;

    return posts.filter((p) =>
      matchesTokens(
        [
          p.title,
          p.description,
          p.series?.name,
          ...(p.tags ?? []),
          yearOf(p.publishedDate),
        ],
        tokens,
      ),
    );
  }, [posts, query]);

  // Step 2: Filter, counting each dimension against the rest
  const { counts, matched: filteredPosts } = useMemo(
    () =>
      buildFacets(searchedPosts, FACETS, {
        tag: selectedTag,
        year: selectedYear,
        series: selectedSeriesFilter,
      }),
    [searchedPosts, selectedTag, selectedYear, selectedSeriesFilter],
  );

  const tagOptions: FilterOption[] = useMemo(
    () => toOptions(counts.tag, { limit: 20, keep: selectedTag }),
    [counts.tag, selectedTag],
  );

  const yearOptions: FilterOption[] = useMemo(
    () => toOptions(counts.year, { order: "year", keep: selectedYear }),
    [counts.year, selectedYear],
  );

  const seriesFilterOptions: FilterOption[] = useMemo(
    () => toOptions(counts.series, { keep: selectedSeriesFilter }),
    [counts.series, selectedSeriesFilter],
  );

  // Step 3: Sort
  const sortedPosts = useMemo(() => {
    const list = [...filteredPosts];

    switch (sortBy) {
      case "newest":
        return list.sort((a, b) =>
          compareDate(a.publishedDate, b.publishedDate, "newest"),
        );
      case "oldest":
        return list.sort((a, b) =>
          compareDate(a.publishedDate, b.publishedDate, "oldest"),
        );
      case "title-asc":
        return list.sort((a, b) => compareText(a.title, b.title));
      case "title-desc":
        return list.sort((a, b) => compareText(b.title, a.title));
      case "read-time-asc":
        return list.sort((a, b) =>
          compareNumber(a.readingTimeMinutes, b.readingTimeMinutes, "asc"),
        );
      case "read-time-desc":
        return list.sort((a, b) =>
          compareNumber(a.readingTimeMinutes, b.readingTimeMinutes, "desc"),
        );
      default:
        return list;
    }
  }, [filteredPosts, sortBy]);

  // Filter series for series catalog
  const filteredSeries = useMemo(() => {
    const tokens = searchTokens(query);
    if (tokens.length === 0) return allSeries;
    return allSeries.filter((s) =>
      matchesTokens(
        [
          s.name,
          s.description,
          ...s.tags,
          ...s.posts.map((p) => p.title),
        ],
        tokens,
      ),
    );
  }, [allSeries, query]);

  const selectedSeries = useMemo(() => {
    if (!selectedSeriesName) return null;
    return allSeries.find((s) => s.name === selectedSeriesName) ?? null;
  }, [allSeries, selectedSeriesName]);

  const paginatedPosts = sortedPosts.slice(0, visibleCount);
  const paginatedSeries = filteredSeries.slice(0, visibleSeriesCount);

  const hasActiveFilters = Boolean(
    query.trim() || selectedTag || selectedYear || selectedSeriesFilter,
  );

  const clearAllFilters = () => {
    setQuery("");
    setSelectedTag(null);
    setSelectedYear(null);
    setSelectedSeriesFilter(null);
  };

  const activeFilters: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (selectedTag) {
      list.push({
        key: "tag",
        label: `Tag: ${selectedTag}`,
        onRemove: () => setSelectedTag(null),
      });
    }
    if (selectedYear) {
      list.push({
        key: "year",
        label: `Year: ${selectedYear}`,
        onRemove: () => setSelectedYear(null),
      });
    }
    if (selectedSeriesFilter) {
      list.push({
        key: "series",
        label: `Series: ${selectedSeriesFilter}`,
        onRemove: () => setSelectedSeriesFilter(null),
      });
    }
    return list;
  }, [selectedTag, selectedYear, selectedSeriesFilter]);

  const viewTabsHeader = (
    <div className="view-tabs" role="tablist" aria-label="Blog display mode">
      <button
        type="button"
        role="tab"
        aria-selected={viewMode === "all"}
        onClick={() => {
          setViewMode("all");
          setSelectedSeriesName(null);
        }}
        className={cn("view-tab", viewMode === "all" && "is-active")}
      >
        <BookOpen
          className="h-4 w-4 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span>All posts</span>
        <span className="view-tab-count">{posts.length}</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={viewMode === "series"}
        onClick={() => {
          setViewMode("series");
        }}
        className={cn("view-tab", viewMode === "series" && "is-active")}
      >
        <Layers
          className="h-4 w-4 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span>Series</span>
        <span className="view-tab-count">{allSeries.length}</span>
      </button>
    </div>
  );

  return (
    <div className="mt-8 space-y-6">
      {/* ALL POSTS VIEW */}
      {viewMode === "all" && (
        <>
          <ListingControls
            extraHeader={viewTabsHeader}
            query={query}
            onQueryChange={setQuery}
            searchPlaceholder="Search writing, tags, topics, series…"
            filters={
              <>
                {tagOptions.length > 0 && (
                  <FilterSelect
                    label="Tag"
                    value={selectedTag}
                    options={tagOptions}
                    onChange={setSelectedTag}
                    allLabel="All tags"
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
                {seriesFilterOptions.length > 0 && (
                  <FilterSelect
                    label="Series"
                    value={selectedSeriesFilter}
                    options={seriesFilterOptions}
                    onChange={setSelectedSeriesFilter}
                    allLabel="All series"
                  />
                )}
              </>
            }
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOptions={SORT_OPTIONS}
            sortLabel="Sort posts"
            activeFilters={activeFilters}
            onClearAll={clearAllFilters}
            filteredCount={sortedPosts.length}
            totalCount={posts.length}
            itemNoun="Post"
            itemPlural="Posts"
          />

          {sortedPosts.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="No posts match your criteria"
                hint={
                  hasActiveFilters
                    ? "Try adjusting your search or filters to see more posts."
                    : "No posts are currently published."
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
                {paginatedPosts.map((post) => (
                  <Item
                    key={post.slug}
                    title={post.title}
                    href={`/blog/${post.slug}`}
                    description={post.description ?? undefined}
                    meta={
                      <>
                        {post.publishedDate && (
                          <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                            <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                            <time dateTime={toDateAttribute(post.publishedDate)}>
                              {formatDate(post.publishedDate)}
                            </time>
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-fg-muted">
                          <Clock className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                          <span>{readingTime(post.readingTimeMinutes)}</span>
                        </span>
                        {post.series && (
                          <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded border border-brand/25 bg-brand/5 text-brand max-w-[200px] truncate transition-colors duration-150 hover:border-brand hover:bg-brand/15 cursor-default">
                            <Bookmark className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">{post.series.name}</span>
                          </span>
                        )}
                      </>
                    }
                  >
                    {(post.tags ?? []).length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 mt-2">
                        {(post.tags ?? []).slice(0, 4).map((tag) => (
                          <li key={tag}>
                            <Chip className="text-[0.75rem] py-0.5 px-2">{tag}</Chip>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Item>
                ))}
              </ItemList>

              <LoadMore
                shown={paginatedPosts.length}
                total={sortedPosts.length}
                batchSize={POSTS_PER_PAGE}
                onLoadMore={() =>
                  setVisibleCount((prev) => prev + POSTS_PER_PAGE)
                }
                onShowAll={() => setVisibleCount(sortedPosts.length)}
              />
            </div>
          )}
        </>
      )}

      {/* BLOG SERIES VIEW */}
      {viewMode === "series" && (
        <>
          {viewTabsHeader}

          {selectedSeries ? (
            /* Selected Series Drilldown View */
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSelectedSeriesName(null)}
                className="series-back-btn"
              >
                <ArrowLeft
                  className="h-4 w-4 shrink-0"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>All series</span>
              </button>

              <div className="series-detail-header">
                <div className="section-label">Series</div>
                <h2 className="text-h2 mt-1">{selectedSeries.name}</h2>
                {selectedSeries.description && (
                  <p className="series-card-desc mt-3">
                    {selectedSeries.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-small text-fg-muted">
                  <span>
                    {selectedSeries.posts.length}{" "}
                    {selectedSeries.posts.length === 1 ? "part" : "parts"}
                  </span>
                  <span>·</span>
                  <span>
                    {readingTime(selectedSeries.totalReadingTime)} total
                  </span>
                </div>

                {selectedSeries.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedSeries.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <ItemList>
                  {selectedSeries.posts.map((post, index) => (
                    <Item
                      key={post.slug}
                      title={`Part ${index + 1}: ${post.title}`}
                      href={`/blog/${post.slug}`}
                      description={post.description ?? undefined}
                      meta={
                        <>
                          {post.publishedDate && (
                            <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                              <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                              <time dateTime={toDateAttribute(post.publishedDate)}>
                                {formatDate(post.publishedDate)}
                              </time>
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 text-fg-muted">
                            <Clock className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                            <span>{readingTime(post.readingTimeMinutes)}</span>
                          </span>
                        </>
                      }
                    />
                  ))}
                </ItemList>
              </div>
            </div>
          ) : (
            /* All Series Catalog */
            <>
              <div className="w-full">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search series by topic, title…"
                />
              </div>

              {query.trim() && (
                <div className="filter-status">
                  <span>
                    Showing {filteredSeries.length} of {allSeries.length}{" "}
                    {allSeries.length === 1 ? "series" : "series"}
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

              {filteredSeries.length === 0 ? (
                <div className="mt-8">
                  <EmptyState
                    title="No series match your search."
                    hint="Try searching for a different keyword or topic."
                  >
                    {query && (
                      <div className="mt-4 flex justify-center">
                        <Button variant="secondary" onClick={() => setQuery("")}>
                          Clear search
                        </Button>
                      </div>
                    )}
                  </EmptyState>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="series-grid">
                    {paginatedSeries.map((series) => (
                      <article
                        key={series.name}
                        onClick={() => setSelectedSeriesName(series.name)}
                        className="series-card cursor-pointer"
                        tabIndex={0}
                        role="button"
                        aria-label={`View series: ${series.name}`}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedSeriesName(series.name);
                          }
                        }}
                      >
                        <div className="series-card-body">
                          <div className="series-card-meta">
                            <span className="series-card-count">
                              {series.posts.length}{" "}
                              {series.posts.length === 1 ? "part" : "parts"}
                            </span>
                            <span>·</span>
                            <span>{readingTime(series.totalReadingTime)}</span>
                          </div>

                          <h3 className="series-card-title">{series.name}</h3>

                          {series.description && (
                            <p className="series-card-desc line-clamp-2">
                              {series.description}
                            </p>
                          )}

                          {series.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {series.tags.slice(0, 3).map((tag) => (
                                <Chip key={tag} className="text-[0.75rem] py-0.5 px-2">
                                  {tag}
                                </Chip>
                              ))}
                            </div>
                          )}

                          <div className="series-card-footer">
                            <span className="series-card-link">
                              <span>Read series</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <LoadMore
                    shown={paginatedSeries.length}
                    total={filteredSeries.length}
                    batchSize={SERIES_PER_PAGE}
                    onLoadMore={() =>
                      setVisibleSeriesCount((prev) => prev + SERIES_PER_PAGE)
                    }
                    onShowAll={() =>
                      setVisibleSeriesCount(filteredSeries.length)
                    }
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
