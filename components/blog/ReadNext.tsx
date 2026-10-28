import { PostCard, TileGrid } from "@/components/ui";
import type { BlogPost } from "@/lib/api-types";

/**
 * "Read next" - posts sharing a tag first, then the most recent.
 *
 * Related-by-tag beats newest-first on its own: a reader who finished a post
 * about Foundry is more likely to want another one than whatever went out
 * last week.
 */
export function pickReadNext(
  current: BlogPost,
  all: BlogPost[],
  count = 3,
): BlogPost[] {
  const others = all.filter((post) => post.slug !== current.slug);
  const tags = new Set(current.tags ?? []);

  const scored = others.map((post) => ({
    post,
    shared: (post.tags ?? []).filter((tag) => tags.has(tag)).length,
    published: new Date(post.publishedDate ?? 0).getTime(),
  }));

  scored.sort((a, b) => b.shared - a.shared || b.published - a.published);
  return scored.slice(0, count).map((entry) => entry.post);
}

export function ReadNext({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  // The same post card the homepage and the hero use, so a post looks the
  // same wherever it is suggested.
  return (
    <section>
      <h2>Read next</h2>
      <div className="mt-6">
        <TileGrid count={posts.length === 3 ? 3 : undefined}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </TileGrid>
      </div>
    </section>
  );
}
