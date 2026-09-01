import { api } from "@/lib/api";
import { OG_CONTENT_TYPE, OG_SIZE, ogCard } from "@/lib/og/card";
import { formatDate } from "@/lib/format";
import { getPostContent } from "@/lib/content";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Blog post on dileepa.dev";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await api.getBlog(slug);
  const content = await getPostContent(slug);

  const meta = [
    post?.publishedDate ? formatDate(post.publishedDate) : null,
    content ? `${content.readingTimeMinutes} min read` : null,
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
