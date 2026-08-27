import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  BackToTop,
  pickReadNext,
  PostInteractions,
  ReadNext,
  SeriesNav,
  TableOfContents,
} from "@/components/blog";
import { mdxComponents } from "@/components/mdx";
import { Badge, Container, PagePath, Section } from "@/components/ui";
import { api } from "@/lib/api";
import type { BlogPost } from "@/lib/api-types";
import { getPostContent } from "@/lib/content";
import { SITE_CONFIG } from "@/lib/constants";
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
 * Only the slugs built here exist.
 *
 * Post bodies are read from a pinned content ref, so a post that was not in
 * the set at build time cannot render at runtime either — there is no body to
 * fetch for it. Leaving this open meant an unknown slug cost a live API call
 * and a content lookup before 404ing, and Next served that 404 as a
 * client-rendered shell: correct status, empty `<body>`. Closing it makes the
 * router answer from the route table, which renders `not-found.tsx` on the
 * server like any other page.
 *
 * The consequence to keep in mind: publishing a post needs a rebuild. That was
 * already true of the pinned ref — see `content-pipeline.md` §8.
 */
export const dynamicParams = false;

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
  // Posts carry no banner of their own any more — an image is either set
  // deliberately in `seo.ogImage` or the site's default card is used.
  const image = post.seo?.ogImage;

  return {
    title,
    description,
    // Every post points at its own dileepa.dev URL. `postUrl` refuses a
    // stored canonical on the retired host, which is why this is not just
    // `post.canonicalUrl`.
    alternates: {
      canonical: postUrl(post),
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: postUrl(post),
      publishedTime: post.publishedDate ?? undefined,
      modifiedTime: post.updatedDate ?? undefined,
      tags: post.tags ?? [],
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
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
  if (!post || !content) notFound();

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
          <div className="section-label">
            <Link
              href="/blog"
              className="text-brand no-underline hover:underline"
            >
              Blog
            </Link>
            {" · "}
            <time dateTime={toDateAttribute(post.publishedDate)}>
              {formatDate(post.publishedDate)}
            </time>
            {" · "}
            {readingTime(post.readingTimeMinutes || content.readingTimeMinutes)}
          </div>

          <h1 className="mt-3">{post.title}</h1>
          {post.description && (
            <p className="section-intro mt-4 text-h3 text-fg-muted">
              {post.description}
            </p>
          )}

          {post.updatedDate && post.updatedDate !== post.publishedDate && (
            <p className="mt-3 font-mono text-small text-fg-muted">
              Updated{" "}
              <time dateTime={toDateAttribute(post.updatedDate)}>
                {formatDate(post.updatedDate)}
              </time>
            </p>
          )}
        </header>

        <div className="mt-10 gap-12 lg:grid lg:grid-cols-[1fr_220px]">
          {/* `min-w-0`: a grid track's automatic minimum is its content's
              min-content width, so a wide table or code block in the article
              pushed this column — and the rail beside it — past the container
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
                      <Badge>{tag}</Badge>
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

            {/* React, comment and share, then the thread — one client component
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

        <BackToTop />
      </Container>
    </Section>
  );
}
