import Link from "next/link";
import type { BlogPost } from "@/lib/api-types";
import { cn } from "@/lib/utils";

/**
 * Series navigation, rendered from front matter.
 *
 * The Astro blog did this with a `SeriesBox.astro` component imported into the
 * post body. That import cannot compile here and, more to the point, put
 * navigation inside the content - so a reordered series meant editing eight
 * posts. This derives the same box from `series.name` and `series.order`.
 */
export function SeriesNav({
  posts,
  currentSlug,
}: {
  posts: BlogPost[];
  currentSlug: string;
}) {
  if (posts.length < 2) return null;

  const ordered = [...posts].sort(
    (a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0),
  );
  const name = ordered[0]?.series?.name;

  return (
    <nav
      aria-label="Posts in this series"
      className="rounded-lg border border-border-strong bg-bg-surface p-6"
    >
      <p className="font-mono text-small font-medium text-brand">Series</p>
      <p className="mt-1 text-h3 font-medium tracking-[-0.02em] text-fg">
        {name}
      </p>
      <ol className="mt-4 space-y-2">
        {ordered.map((post, index) => {
          const current = post.slug === currentSlug;
          return (
            <li key={post.slug} className="flex gap-3">
              <span className="font-mono text-small text-fg-muted">
                {index + 1}.
              </span>
              {current ? (
                <span aria-current="true" className={cn("text-small text-fg")}>
                  {post.title}
                </span>
              ) : (
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-small text-fg-muted no-underline hover:text-brand"
                >
                  {post.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
