import type { Metadata } from "next";
import Link from "next/link";
import {
  Container,
  EmptyState,
  Item,
  ItemList,
  PagePath,
  Section,
} from "@/components/ui";
import { api } from "@/lib/api";
import { EMPTY_STATES } from "@/lib/constants";
import { formatDate, readingTime, toDateAttribute } from "@/lib/format";

interface Params {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const posts = await api.getAllBlogs();
  const tags = new Set((posts ?? []).flatMap((post) => post.tags ?? []));
  return [...tags].map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  return {
    title: `Posts tagged ${name}`,
    description: `Everything I have written about ${name}.`,
    alternates: { canonical: `/blog/tags/${tag}` },
  };
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  const posts = await api.getBlogs({ tag: name, limit: 200 });

  return (
    <Section>
      <Container>
        <div className="mb-2">
          <PagePath path={`/blog/tags/${tag}`} />
        </div>
        <div className="section-label">Tag</div>
        <h1>{name}</h1>
        <p className="mt-4 text-fg-muted">
          {posts.length} {posts.length === 1 ? "Post" : "Posts"}.{" "}
          <Link href="/blog" className="text-brand">
            All posts
          </Link>
        </p>

        <div className="mt-10">
          {posts.length === 0 ? (
            <EmptyState {...EMPTY_STATES.tag} />
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
