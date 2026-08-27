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

export function Item({
  title,
  href,
  external,
  description,
  meta,
  icon,
  children,
}: {
  title: string;
  href?: string;
  external?: boolean;
  description?: string;
  /** Mono, right-aligned on wide screens. Dates, formats, counts. */
  meta?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  const isExternal = external ?? href?.startsWith("http");

  return (
    <article className="item">
      <div className="min-w-0">
        <h3 className="flex items-center gap-2 flex-wrap">
          {icon && <span className="shrink-0">{icon}</span>}
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
