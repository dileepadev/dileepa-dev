import type { Metadata } from "next";
import {
  ApiOfflinePage,
  Container,
  EmptyState,
  PagePath,
  Section,
} from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import { EMPTY_STATES, PAGES } from "@/lib/constants";
import { BlogSearch } from "./_components/BlogSearch";

export const metadata: Metadata = {
  title: PAGES.blog.meta.title,
  description: PAGES.blog.meta.description,
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default async function BlogPage() {
  const posts = (await api.getAllBlogs()) ?? [];

  if (posts.length === 0) {
    const health = await checkApiHealth();
    if (!health.ok) {
      return <ApiOfflinePage path="/blog" />;
    }
  }

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/blog" />
            </div>
            <div className="section-label">{PAGES.blog.label}</div>
            <h1>{PAGES.blog.title}</h1>
          </div>
          {posts.length > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
              <span className="font-medium text-fg">{posts.length}</span>
              <span>{posts.length === 1 ? "Post" : "Posts"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">
          {PAGES.blog.intro}{" "}
          <a href="/blog/rss.xml" className="text-brand underline hover:text-brand-hover">
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
