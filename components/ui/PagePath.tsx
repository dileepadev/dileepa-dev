import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PagePathProps {
  path: string;
  className?: string;
}

/**
 * PagePath
 *
 * Displays a relative page route (e.g. `./events/2025-12-13-microsoft-foundry...`)
 * as a terminal-style breadcrumb where each segment (`./`, section, slug) is an
 * independently clickable link.
 */
export function PagePath({ path, className }: PagePathProps) {
  if (!path) return null;

  // Normalize: strip leading `./` or `/` and trailing slashes
  const cleanPath = path
    .trim()
    .replace(/^\.\//, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
  const segments = cleanPath ? cleanPath.split("/").filter(Boolean) : [];

  return (
    <nav
      aria-label="Breadcrumb path"
      className={cn(
        // One line: the last segment (a post's slug can run to sixty
        // characters) gives way with an ellipsis instead of wrapping.
        "flex max-w-full min-w-0 items-center gap-1.5 font-mono text-label normal-case tracking-normal text-fg-muted",
        className,
      )}
    >
      {/* Root link to home */}
      <Link
        href="/"
        className="shrink-0 transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
      >
        home
      </Link>

      {segments.map((segment, index) => {
        let href = "/" + segments.slice(0, index + 1).join("/");
        // If route is /blog/tags, route to /blog since tags does not have an index page
        if (href === "/blog/tags") {
          href = "/blog";
        }
        const isLast = index === segments.length - 1;

        return (
          <span
            key={index}
            className={cn(
              "inline-flex items-center gap-1.5",
              isLast ? "min-w-0" : "shrink-0",
            )}
          >
            <span className="text-fg-muted/40 select-none" aria-hidden="true">
              /
            </span>
            <Link
              href={href}
              {...(isLast ? { "aria-current": "page" as const } : {})}
              title={isLast ? segment : undefined}
              className="min-w-0 truncate transition-colors duration-150 hover:text-brand focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              {segment}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
