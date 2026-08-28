import type { Metadata } from "next";
import {
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
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
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
