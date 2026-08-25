import { ReactNode } from "react";
import Link from "next/link";

/**
 * The item list — communities, events, posts, videos.
 *
 * Content on the left, a 180px right-aligned mono metadata column on the right.
 * Collapses to one column below 720px with the metadata left-aligned.
 */
export function ItemList({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function Item({
  title,
  href,
  external,
  description,
  meta,
  children,
}: {
  title: string;
  href?: string;
  external?: boolean;
  description?: string;
  /** Mono, right-aligned on wide screens. Dates, formats, counts. */
  meta?: ReactNode;
  children?: ReactNode;
}) {
  const isExternal = external ?? href?.startsWith("http");

  return (
    <article className="item">
      <div className="min-w-0">
        <h3>
          {href ? (
            isExternal ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            ) : (
              <Link href={href}>{title}</Link>
            )
          ) : (
            title
          )}
        </h3>
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
  const body = (
    <>
      {children}
      <svg viewBox="0 0 24 24" strokeLinecap="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  );

  if (external ?? href.startsWith("http")) {
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
