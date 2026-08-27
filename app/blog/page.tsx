import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Container,
  EmptyState,
  PagePath,
  Section,
} from "@/components/ui";
import { api } from "@/lib/api";
import { EMPTY_STATES } from "@/lib/constants";
import { BlogSearch } from "./_components/BlogSearch";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on what I build, and what went wrong on the way.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default async function BlogPage() {
  const posts = (await api.getAllBlogs()) ?? [];

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
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/blog" />
            </div>
            <div className="section-label">Blog</div>
            <h1>Writing</h1>
          </div>
          {posts.length > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1">
              <span className="font-medium text-fg">{posts.length}</span>
              <span>{posts.length === 1 ? "Post" : "Posts"}</span>
            </div>
          )}
        </div>

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

        {posts.length === 0 ? (
          <div className="mt-10">
            <EmptyState {...EMPTY_STATES.posts} />
          </div>
        ) : (
          <BlogSearch posts={posts} />
        )}
      </Container>
    </Section>
  );
}
