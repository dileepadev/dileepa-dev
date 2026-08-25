"use client";

import { useState, useMemo } from "react";
import {
  Button,
  EmptyState,
  Item,
  ItemList,
  SearchInput,
  SortSelect,
  type SortOption,
} from "@/components/ui";
import { formatDate, readingTime, toDateAttribute } from "@/lib/format";

interface BlogPostSummary {
  slug: string;
  title: string;
  description: string | null;
  publishedDate?: string | null | undefined;
  readingTimeMinutes: number | null;
  series?: { name: string } | null;
  tags?: string[] | null;
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

/** Client-side search and sorting across blog posts. */
export function BlogSearch({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<BlogSortKey>("newest");

  const q = query.toLowerCase().trim();

  const filteredAndSorted = useMemo(() => {
    const result = q ? posts.filter((p) => matches(p, q)) : [...posts];

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
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

  const hasFilter = query.trim().length > 0;

  return (
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
            Showing {filteredAndSorted.length} of {posts.length} {posts.length === 1 ? "post" : "posts"}
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
        {filteredAndSorted.length === 0 ? (
          <EmptyState
            title="No posts match your search."
            hint="Try a different keyword or clear the search filter."
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
        ) : (
          <ItemList>
            {filteredAndSorted.map((post) => (
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
        )}
      </div>
    </>
  );
}

function matches(post: BlogPostSummary, q: string): boolean {
  return (
    post.title.toLowerCase().includes(q) ||
    (post.description ?? "").toLowerCase().includes(q) ||
    (post.tags ?? []).some((tag) => tag.toLowerCase().includes(q)) ||
    (post.series?.name ?? "").toLowerCase().includes(q)
  );
}
