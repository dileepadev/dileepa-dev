"use client";

import { useState, useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
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

/** The filterable dimensions, and how a blog post is filed under each. */
const FACETS: FacetSpec<BlogPostSummary>[] = [
  { key: "tag", values: (p) => p.tags ?? [] },
  { key: "year", values: (p) => [yearOf(p.publishedDate)] },
  { key: "series", values: (p) => [p.series?.name] },
];

/** Client-side search, filtering, sorting, and progressive pagination across blog posts. */
export function BlogSearch({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<BlogSortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Reset pagination when filter/sort state changes
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${selectedTag}|${selectedYear}|${selectedSeriesFilter}|${sortBy}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(POSTS_PER_PAGE);
  }

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
    () => toOptions(counts.tag, { keep: selectedTag }),
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

  const paginatedPosts = sortedPosts.slice(0, visibleCount);

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

  return (
    <div className="mt-8 space-y-6">
      <ListingControls
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
                      <Chip className="max-w-[200px] truncate">
                        {post.series.name}
                      </Chip>
                    )}
                  </>
                }
              >
                {(post.tags ?? []).length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 mt-2">
                    {(post.tags ?? []).slice(0, 4).map((tag) => (
                      <li key={tag}>
                        <Chip>{tag}</Chip>
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
    </div>
  );
}
