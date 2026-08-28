import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * The entry list — experience and education.
 *
 * A 160px mono date column, then the content. Each row takes a hairline top
 * border and the last also takes a bottom one, so the list reads as a set of
 * rules rather than a stack of boxes. Collapses to one column below 720px.
 *
 * The wrapper exists so `.entry:last-child` resolves against the list rather
 * than against whatever happens to follow it in the section.
 */
export function EntryList({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function Entry({
  date,
  title,
  org,
  orgUrl,
  description,
  children,
}: {
  /** Mono, and deliberately not a heading — it is metadata. */
  date: string;
  title: string;
  /** The organisation. Rendered in `--brand`, which is this row's one accent. */
  org: string;
  orgUrl?: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="entry">
      <div className="entry-date">{date}</div>
      <div className="min-w-0">
        <div className="entry-org">
          {orgUrl ? (
            <a
              href={orgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 hover:text-brand"
            >
              <span>{org}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 shrink-0 text-brand/70 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                aria-hidden="true"
              />
            </a>
          ) : (
            org
          )}
        </div>
        <div className="entry-title">{title}</div>
        {description && <p className="entry-body">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}
