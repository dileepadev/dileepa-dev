"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers, BookOpen } from "lucide-react";
import {
  Badge,
  Button,
  EmptyState,
  Item,
  ItemList,
  LoadMore,
  SearchInput,
  SortSelect,
  type SortOption,
} from "@/components/ui";
import { formatDate, readingTime, toDateAttribute } from "@/lib/format";
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

/** Client-side search, sorting, series, and progressive pagination across blog posts. */
export function BlogSearch({ posts }: { posts: BlogPostSummary[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [selectedSeriesName, setSelectedSeriesName] = useState<string | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<BlogSortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [visibleSeriesCount, setVisibleSeriesCount] = useState(SERIES_PER_PAGE);

  // Reset pagination when filter/sort/view state changes
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${sortBy}|${viewMode}`;
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
      // Sort posts in series by order if available, else date
      const sortedPosts = [...seriesPosts].sort((a, b) => {
        const orderA = a.series?.order ?? 0;
        const orderB = b.series?.order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
        const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
        return dateA - dateB;
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
      (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name),
    );
  }, [posts]);

  const q = query.toLowerCase().trim();

  // Filter & sort individual posts
  const filteredAndSortedPosts = useMemo(() => {
    const result = q ? posts.filter((p) => matchesPost(p, q)) : [...posts];

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = a.publishedDate
            ? new Date(a.publishedDate).getTime()
            : 0;
          const dateB = b.publishedDate
            ? new Date(b.publishedDate).getTime()
            : 0;
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = a.publishedDate
            ? new Date(a.publishedDate).getTime()
            : 0;
          const dateB = b.publishedDate
            ? new Date(b.publishedDate).getTime()
            : 0;
          return dateA - dateB;
        }
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "read-time-asc":
          return (a.readingTimeMinutes ?? 0) - (b.readingTimeMinutes ?? 0);
        case "read-time-desc":
          return (b.readingTimeMinutes ?? 0) - (a.readingTimeMinutes ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [posts, q, sortBy]);

  // Filter series
  const filteredSeries = useMemo(() => {
    if (!q) return allSeries;
    return allSeries.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q)) ||
        s.posts.some((p) => p.title.toLowerCase().includes(q)),
    );
  }, [allSeries, q]);

  // Selected series object (if in detailed series view)
  const selectedSeries = useMemo(() => {
    if (!selectedSeriesName) return null;
    return allSeries.find((s) => s.name === selectedSeriesName) ?? null;
  }, [allSeries, selectedSeriesName]);

  const hasFilter = query.trim().length > 0;
  const paginatedPosts = filteredAndSortedPosts.slice(0, visibleCount);
  const paginatedSeries = filteredSeries.slice(0, visibleSeriesCount);

  return (
    <div className="mt-8">
      {/* View Switcher Tabs */}
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

      {/* ALL POSTS VIEW */}
      {viewMode === "all" && (
        <>
          <div className="list-toolbar">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search writing, tags, series…"
            />
            <SortSelect
              value={sortBy}
              onChange={setSortBy}
              options={SORT_OPTIONS}
              label="Sort posts"
            />
          </div>

          {hasFilter && (
            <div className="filter-status">
              <span>
                Showing {filteredAndSortedPosts.length} of {posts.length}{" "}
                {posts.length === 1 ? "post" : "posts"}
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

          <div className="mt-10">
            {filteredAndSortedPosts.length === 0 ? (
              <EmptyState
                title="No posts match your search."
                hint="Try a different keyword or clear the search filter."
              >
                {hasFilter && (
                  <div className="mt-4 flex justify-center">
                    <Button variant="secondary" onClick={() => setQuery("")}>
                      Clear filter
                    </Button>
                  </div>
                )}
              </EmptyState>
            ) : (
              <>
                <ItemList>
                  {paginatedPosts.map((post) => (
                    <Item
                      key={post.slug}
                      title={post.title}
                      href={`/blog/${post.slug}`}
                      description={post.description ?? undefined}
                      meta={
                        <>
                          <time
                            dateTime={toDateAttribute(post.publishedDate)}
                            className="block"
                          >
                            {formatDate(post.publishedDate)}
                          </time>
                          <span className="block">
                            {readingTime(post.readingTimeMinutes)}
                          </span>
                          {post.series && (
                            <span className="block">{post.series.name}</span>
                          )}
                        </>
                      }
                    />
                  ))}
                </ItemList>

                <LoadMore
                  shown={paginatedPosts.length}
                  total={filteredAndSortedPosts.length}
                  batchSize={POSTS_PER_PAGE}
                  onLoadMore={() =>
                    setVisibleCount((prev) => prev + POSTS_PER_PAGE)
                  }
                  onShowAll={() =>
                    setVisibleCount(filteredAndSortedPosts.length)
                  }
                />
              </>
            )}
          </div>
        </>
      )}

      {/* BLOG SERIES VIEW */}
      {viewMode === "series" && (
        <>
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
                          <time
                            dateTime={toDateAttribute(post.publishedDate)}
                            className="block"
                          >
                            {formatDate(post.publishedDate)}
                          </time>
                          <span className="block">
                            {readingTime(post.readingTimeMinutes)}
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
              <div className="list-toolbar">
                <SearchInput
                  value={query}
                  onChange={setQuery}
                  placeholder="Search series by topic, title…"
                />
              </div>

              {hasFilter && (
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
                <div className="mt-10">
                  <EmptyState
                    title="No series match your search."
                    hint="Try searching for a different keyword or topic."
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
                <>
                  <div className="series-grid mt-8">
                    {paginatedSeries.map((series) => (
                      <article key={series.name} className="series-card">
                        <div className="series-card-header">
                          <div>
                            <span className="font-mono text-label uppercase tracking-label text-brand">
                              Series · {series.posts.length}{" "}
                              {series.posts.length === 1 ? "post" : "posts"}
                            </span>
                            <h2 className="series-card-title">{series.name}</h2>
                          </div>
                          <span className="font-mono text-small text-fg-muted">
                            {readingTime(series.totalReadingTime)} total
                          </span>
                        </div>

                        {series.description && (
                          <p className="series-card-desc">
                            {series.description}
                          </p>
                        )}

                        {/* Series Posts Preview */}
                        <div className="series-posts-list">
                          {series.posts.map((post, idx) => (
                            <div key={post.slug} className="series-post-row">
                              <span className="series-post-num">
                                {idx + 1}.
                              </span>
                              <Link
                                href={`/blog/${post.slug}`}
                                className="series-post-title"
                              >
                                {post.title}
                              </Link>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {series.tags.map((tag) => (
                              <Badge key={tag}>{tag}</Badge>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedSeriesName(series.name)}
                            className="view-all inline-flex items-center gap-1.5 font-mono text-small text-brand hover:underline cursor-pointer bg-transparent border-none p-0"
                          >
                            <span>View all {series.posts.length} parts</span>
                            <ArrowRight
                              className="h-3.5 w-3.5 shrink-0"
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </button>
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
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function matchesPost(post: BlogPostSummary, q: string): boolean {
  return (
    post.title.toLowerCase().includes(q) ||
    (post.description ?? "").toLowerCase().includes(q) ||
    (post.tags ?? []).some((tag) => tag.toLowerCase().includes(q)) ||
    (post.series?.name ?? "").toLowerCase().includes(q)
  );
}
