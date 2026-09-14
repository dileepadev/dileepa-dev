import { api } from "@/lib/api";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { formatDate } from "@/lib/format";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blog post on dileepa.dev";

/**
 * The cards are drawn at build time, once per deploy.
 *
 * A metadata route always *attempts* build-time prerendering, but in a dynamic
 * segment it has no list of slugs to prerender for, so without this it bails to
 * on-demand rendering - which is what the v2.0.1 build output was saying with
 * `ƒ /blog/[slug]/opengraph-image`. Every card was then a Satori layout pass
 * and a resvg PNG encode *per request*, and production logs caught one at
 * `cache=MISS` doing exactly that. It is the most CPU-expensive thing this site
 * can be asked for, and crawlers ask for it once per post.
 *
 * The same list the page prerenders from, so the cards and the pages cannot
 * disagree about which posts exist. `dynamicParams` stays open on the page, so
 * a post published since the last build still renders its card on demand - the
 * rare case pays, rather than every case.
 */
export async function generateStaticParams() {
  const posts = await api.getAllBlogs();
  return (posts ?? []).map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await api.getBlog(slug);

  // `readingTimeMinutes` comes off the API record rather than out of the Git
  // body. It is the same number - the page already prefers the stored one and
  // falls back to the computed one - but reading it here used to mean calling
  // `getPostContent`, which loads and parses *every* post to produce a single
  // integer. On a cold instance that was a GitHub tree, 22 raw files and 22
  // `gray-matter` parses, spent on one line of a card.
  const meta = [
    post?.publishedDate ? formatDate(post.publishedDate) : null,
    post?.readingTimeMinutes ? `${post.readingTimeMinutes} min read` : null,
  ]
    .filter(Boolean)
    .join("  ·  ");

  return ogCard({
    path: `/blog/${slug}`,
    label: "Blog",
    title: post?.title ?? slug,
    meta: meta || undefined,
  });
}
