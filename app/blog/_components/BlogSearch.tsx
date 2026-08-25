"use client";

import { useState, useMemo } from "react";
import { EmptyState, Item, ItemList, SearchInput } from "@/components/ui";
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

/** Client-side search across blog posts. */
export function BlogSearch({ posts }: { posts: BlogPostSummary[] }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const filtered = useMemo(
    () => (q ? posts.filter((p) => matches(p, q)) : posts),
    [posts, q],
  );

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search posts…"
        resultCount={filtered.length}
        totalCount={posts.length}
      />

      <div className="mt-10">
        {filtered.length === 0 ? (
          <EmptyState
            title="No posts match your search."
            hint="Try a different keyword or clear the search."
          />
        ) : (
          <ItemList>
            {filtered.map((post) => (
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
