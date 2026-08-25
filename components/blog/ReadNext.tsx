import { Item, ItemList } from "@/components/ui";
import type { BlogPost } from "@/lib/api-types";
import { formatMonth, readingTime } from "@/lib/format";

/**
 * "Read next" — posts sharing a tag first, then the most recent.
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

  return (
    <section>
      <h2>Read next</h2>
      <div className="mt-4">
        <ItemList>
          {posts.map((post) => (
            <Item
              key={post.slug}
              title={post.title}
              href={`/blog/${post.slug}`}
              description={post.description}
              meta={
                <>
                  <span className="block">
                    {formatMonth(post.publishedDate)}
                  </span>
                  <span className="block">
                    {readingTime(post.readingTimeMinutes)}
                  </span>
                </>
              }
            />
          ))}
        </ItemList>
      </div>
    </section>
  );
}
