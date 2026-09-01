import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * The item list — communities, events, posts, videos.
 *
 * Content on the left, a 180px right-aligned mono metadata column on the right.
 * Collapses to one column below 720px with the metadata left-aligned.
 */
export function ItemList({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

/**
 * The heading level an item title renders at.
 *
 * An item title is a heading, and which one depends on what is above it. On
 * the homepage a list sits inside a section, so its items are the third level
 * down: `h1` hero, `h2` section, `h3` item. On an index page the list *is* the
 * page — there is no section heading between the `h1` and the items — so an
 * `h3` there skips a level and the outline reads as though two headings went
 * missing. The visual weight is the same either way; only the level moves.
 */
export type ItemHeadingLevel = 2 | 3;

export function Item({
  title,
  href,
  external,
  description,
  meta,
  icon,
  headingLevel = 3,
  children,
}: {
  title: string;
  href?: string;
  external?: boolean;
  description?: string;
  /** Mono, right-aligned on wide screens. Dates, formats, counts. */
  meta?: ReactNode;
  icon?: ReactNode;
  /** See `ItemHeadingLevel`. `3` under a section heading, `2` on an index. */
  headingLevel?: ItemHeadingLevel;
  children?: ReactNode;
}) {
  const isExternal = external ?? href?.startsWith("http");
  // `h3` keeps its own type step; an `h2` here would take the section
  // heading's, which is a size the item titles are not.
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="item">
      <div className="min-w-0">
        <Heading className="item-title flex items-center gap-2 flex-wrap">
          {icon && <span className="shrink-0">{icon}</span>}
          {href ? (
            isExternal ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5"
              >
                <span>{title}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 text-fg-muted transition-all duration-150 group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            ) : (
              <Link
                href={href}
                className="group inline-flex items-center gap-1.5"
              >
                <span>{title}</span>
                <ArrowRight
                  className="h-3.5 w-3.5 shrink-0 text-fg-muted transition-all duration-150 group-hover:text-brand group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            )
          ) : (
            title
          )}
        </Heading>
        {description && <p>{description}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
      {meta && <div className="item-meta">{meta}</div>}
    </article>
  );
}

/** The arrow link that closes a subsection. */
export function ViewAll({
  href,
  children,
  external,
}: {
  href: string;
  children: string;
  external?: boolean;
}) {
  const isExternal = external ?? href.startsWith("http");
  const body = (
    <>
      <span>{children}</span>
      {isExternal ? (
        <ArrowUpRight
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <ArrowRight
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        className="view-all"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    );
  }

  return (
    <Link className="view-all" href={href}>
      {body}
    </Link>
  );
}
