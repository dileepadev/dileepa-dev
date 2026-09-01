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
        "inline-flex flex-wrap items-center gap-1.5 font-mono text-label normal-case tracking-normal text-fg-muted",
        className,
      )}
    >
      {/* Root link to home */}
      <Link
        href="/"
        className="transition-colors duration-150 hover:text-brand hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
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
            className="inline-flex items-center gap-1.5 break-all"
          >
            <span className="text-fg-muted/40 select-none" aria-hidden="true">
              /
            </span>
            <Link
              href={href}
              {...(isLast ? { "aria-current": "page" as const } : {})}
              className="transition-colors duration-150 hover:text-brand hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
            >
              {segment}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
