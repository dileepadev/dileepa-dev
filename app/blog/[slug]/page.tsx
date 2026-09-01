import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Calendar, Clock } from "lucide-react";
import {
  pickReadNext,
  PostInteractions,
  ReadNext,
  SeriesNav,
  TableOfContents,
} from "@/components/blog";
import { mdxComponents } from "@/components/mdx";
import {
  ApiOfflinePage,
  Badge,
  Container,
  PagePath,
  Section,
} from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import type { BlogPost } from "@/lib/api-types";
import { getPostContent } from "@/lib/content";
import { SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { jsonLd } from "@/lib/utils";
import { extractHeadings, mdxOptions } from "@/lib/mdx";
import {
  formatDate,
  postUrl,
  readingTime,
  toDateAttribute,
} from "@/lib/format";

interface Params {
  params: Promise<{ slug: string }>;
}

/**
 * A slug that was not built still resolves.
 *
 * This route was closed (`dynamicParams = false`) for as long as post bodies
 * could only come from the pinned ref: a slug missing at build time had no
 * body to fetch at runtime either, so rejecting it at the router was both
 * honest and better-rendered - an on-demand `notFound()` is served as a
 * client-rendered shell, correct status and empty `<body>`, while a slug the
 * router rejects renders `not-found.tsx` on the server like any other page.
 *
 * `getPostContent` now falls back to reading the file directly from the
 * content repo when the built map does not have it, so that premise no longer
 * holds and a post published after the last build resolves without a redeploy.
 * The empty-shell 404 is the price, and it is paid only by a genuinely unknown
 * slug.
 *
 * The trade to keep in mind: an unknown slug now costs a live API call and a
 * content lookup before it 404s. See `content-pipeline.md` §8.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await api.getAllBlogs();
  return (posts ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await api.getBlog(slug);
  if (!post) return { title: "Post not found" };

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.description;
  // Posts carry no banner of their own any more - an image is either set
  // deliberately in `seo.ogImage` or the site's default card is used. Passing
  // it through `pageMetadata` is what makes the second half of that sentence
  // true: an `undefined` here used to mean the post shipped with no card
  // image at all, because a page-level `openGraph` replaces the layout's
  // rather than filling in around it.
  const image = post.seo?.ogImage;

  // Every post points at its own dileepa.dev URL. `postUrl` refuses a stored
  // canonical on the retired host, which is why this is not just
  // `post.canonicalUrl`. `pageMetadata` takes a site-relative path, and the
  // slug is the whole of it.
  return pageMetadata({
    title,
    description,
    path: new URL(postUrl(post)).pathname,
    image,
    type: "article",
    generatedImage: true,
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    tags: post.tags ?? [],
  });
}

function articleJsonLd(post: BlogPost, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate ?? post.publishedDate,
    image: post.seo?.ogImage ? [post.seo.ogImage] : undefined,
    keywords: (post.tags ?? []).join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Person",
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.url,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;

  // Metadata comes from the API, the body from Git. A post that has one but
  // not the other is a pipeline fault, and a 404 is the honest answer.
  const [post, content] = await Promise.all([
    api.getBlog(slug),
    getPostContent(slug),
  ]);
  if (!post || !content) {
    if (!post) {
      const health = await checkApiHealth();
      if (!health.ok) {
        return <ApiOfflinePage path={`/blog/${slug}`} />;
      }
    }
    notFound();
  }

  const url = postUrl(post);
  const headings = extractHeadings(content.body);

  const allPosts = (await api.getAllBlogs()) ?? [];
  const seriesPosts = post.series
    ? allPosts.filter((other) => other.series?.name === post.series?.name)
    : [];
  const readNext = pickReadNext(post, allPosts);

  return (
    <Section>
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(articleJsonLd(post, url)),
          }}
        />

        <header className="max-w-3xl">
          <div className="mb-2">
            <PagePath path={`/blog/${post.slug}`} />
          </div>
          <div className="section-label">Blog</div>

          <h1>{post.title}</h1>
          {post.description && (
            <p className="section-intro mb-3!">{post.description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-small text-fg">
            <span className="inline-flex items-center gap-1.5">
              <Calendar
                className="h-3.5 w-3.5 shrink-0 text-fg-muted"
                aria-hidden="true"
              />
              <time dateTime={toDateAttribute(post.publishedDate)}>
                {formatDate(post.publishedDate)}
              </time>
            </span>
            <span className="text-fg-muted select-none" aria-hidden="true">
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-fg-muted"
                aria-hidden="true"
              />
              <span>
                {readingTime(
                  post.readingTimeMinutes || content.readingTimeMinutes,
                )}
              </span>
            </span>
            {post.updatedDate && post.updatedDate !== post.publishedDate && (
              <>
                <span className="text-fg-muted select-none" aria-hidden="true">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5 text-fg-muted">
                  <span>
                    Updated{" "}
                    <time dateTime={toDateAttribute(post.updatedDate)}>
                      {formatDate(post.updatedDate)}
                    </time>
                  </span>
                </span>
              </>
            )}
          </div>
        </header>

        <div className="mt-8 sm:mt-10 gap-12 lg:grid lg:grid-cols-[1fr_220px]">
          {/* `min-w-0`: a grid track's automatic minimum is its content's
              min-content width, so a wide table or code block in the article
              pushed this column - and the rail beside it - past the container
              rather than scrolling inside itself. */}
          <article className="w-full max-w-3xl min-w-0">
            <div className="mb-8 lg:hidden">
              <TableOfContents headings={headings} />
            </div>

            {seriesPosts.length > 1 && (
              <div className="mb-10">
                <SeriesNav posts={seriesPosts} currentSlug={post.slug} />
              </div>
            )}

            <div className="prose">
              <MDXRemote
                source={content.body}
                components={mdxComponents}
                options={mdxOptions}
              />
            </div>

            {(post.tags ?? []).length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2">
                {(post.tags ?? []).map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/blog/tags/${encodeURIComponent(tag)}`}
                      className="no-underline"
                    >
                      <Badge interactive>{tag}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {seriesPosts.length > 1 && (
              <div className="mt-12">
                <SeriesNav posts={seriesPosts} currentSlug={post.slug} />
              </div>
            )}

            {/* React, comment and share, then the thread - one client component
                because the action bar's comment count and the comment list are
                the same data, fetched once. */}
            <PostInteractions slug={post.slug} url={url} title={post.title} />

            <div className="mt-16">
              <ReadNext posts={readNext} />
            </div>
          </article>

          <aside className="hidden lg:block">
            <TableOfContents headings={headings} />
          </aside>
        </div>
      </Container>
    </Section>
  );
}
