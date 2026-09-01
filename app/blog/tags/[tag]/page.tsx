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
import { pageMetadata } from "@/lib/metadata";
import { formatDate, readingTime, toDateAttribute } from "@/lib/format";

interface Params {
  params: Promise<{ tag: string }>;
}

/**
 * Raw tags out, decoded params in. Both halves matter, and they were mismatched.
 *
 * Next percent-encodes a dynamic segment on the way out and hands the page the
 * **encoded** segment on the way back, so a reader always decodes. What
 * `generateStaticParams` must not do is encode as well: `"Advanced Git"`
 * returned as `Advanced%20Git` was encoded a second time into the URL, arrived
 * as `Advanced%2520Git`, and decoded once to `"Advanced%20Git"` — a string no
 * post carries. Every tag with a space in it, twenty-nine of sixty-eight, was
 * a page headed `Advanced%20Git` reporting that no posts carry the tag.
 *
 * Tags without spaces encode to themselves, which is why the bug looked like a
 * content problem rather than an encoding one.
 */
export async function generateStaticParams() {
  const posts = await api.getAllBlogs();
  const tags = new Set((posts ?? []).flatMap((post) => post.tags ?? []));
  return [...tags].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  return pageMetadata({
    title: `Posts tagged ${name}`,
    description: `Everything I have written about ${name}.`,
    path: `/blog/tags/${tag}`,
  });
}

export default async function TagPage({ params }: Params) {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  // Filtered from the full set rather than fetched per tag. `getBlogs({ tag })`
  // is a distinct URL for every tag, so sixty-eight tag pages were sixty-eight
  // requests that Next's fetch cache could not collapse — on their own more
  // than the API's sixty-per-minute allowance, which is how a cold build ended
  // up prerendering "No posts carry this tag" onto pages that have posts.
  // `getAllBlogs()` is one URL, already fetched by `generateStaticParams`, and
  // the tag set is derived from these same `tags` arrays — so the filter here
  // and the query it replaces cannot disagree.
  const posts = (await api.getAllBlogs()).filter((post) =>
    (post.tags ?? []).includes(name),
  );

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
                  headingLevel={2}
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
