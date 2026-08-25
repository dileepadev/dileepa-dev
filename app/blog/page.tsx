import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Container,
  EmptyState,
  Item,
  ItemList,
  Section,
} from "@/components/ui";
import { api } from "@/lib/api";
import { EMPTY_STATES } from "@/lib/constants";
import { formatDate, readingTime, toDateAttribute } from "@/lib/format";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on what I build, and what went wrong on the way.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default async function BlogPage() {
  const posts = await api.getAllBlogs();

  // Tags, most used first, so the filter row leads with what there is most of.
  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags ?? [])
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  const tags = [...tagCounts.entries()].sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
  );

  return (
    <Section>
      <Container>
        <div className="section-label">Blog</div>
        <h1>Writing</h1>
        <p className="section-intro">
          Notes on what I build, and what went wrong on the way.{" "}
          <a href="/blog/rss.xml" className="text-brand">
            RSS
          </a>
        </p>

        {tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {tags.map(([tag, count]) => (
              <li key={tag}>
                <Link
                  href={`/blog/tags/${encodeURIComponent(tag)}`}
                  className="no-underline"
                >
                  <Badge>
                    {tag} <span className="text-fg-muted">{count}</span>
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          {posts.length === 0 ? (
            <EmptyState {...EMPTY_STATES.posts} />
          ) : (
            <ItemList>
              {posts.map((post) => (
                <Item
                  key={post.slug}
                  title={post.title}
                  href={`/blog/${post.slug}`}
                  description={post.description}
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
      </Container>
    </Section>
  );
}
