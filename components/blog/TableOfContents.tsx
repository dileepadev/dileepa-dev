"use client";

import { useEffect, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import type { Heading } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * The table of contents.
 *
 * Sticky beside the article on wide screens and collapsed into a `details` on
 * narrow ones, where a fixed sidebar would eat the reading column. The active
 * heading is tracked with an IntersectionObserver rather than scroll maths.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // The top band only: a heading counts as current once it reaches the
      // upper third, which is where a reader's eye actually is.
      { rootMargin: "-80px 0px -66% 0px", threshold: 0 },
    );

    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActive(id);
    }
  };

  const renderList = (isMobile = false) => (
    <ul
      className={cn(
        "space-y-1.5 font-mono text-small",
        !isMobile && "border-l border-border-hairline",
      )}
    >
      {headings.map((heading) => {
        const isActive = active === heading.id;
        return (
          <li
            key={heading.id}
            className={cn(
              "relative",
              heading.depth === 3 ? "pl-3 text-label" : undefined,
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={cn(
                "block py-1 transition-colors duration-[160ms] ease-brand no-underline leading-snug",
                isMobile
                  ? cn(
                      "pl-2 rounded-xs",
                      isActive
                        ? "text-brand font-medium bg-brand/5"
                        : "text-fg-muted hover:text-fg",
                    )
                  : cn(
                      "-ml-px border-l-2 pl-3",
                      isActive
                        ? "border-brand font-medium text-brand"
                        : "border-transparent text-fg-muted hover:border-border-strong hover:text-fg",
                    ),
              )}
            >
              {heading.text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <nav
        aria-label="On this page"
        className="hidden lg:sticky lg:top-24 lg:block max-h-[calc(100vh-8rem)] overflow-y-auto pr-2"
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand"
            aria-hidden="true"
          />
          <p className="font-mono text-small font-medium text-fg">
            On this page
          </p>
        </div>
        {renderList(false)}
      </nav>

      <details className="group rounded-lg border border-border-strong bg-bg-surface p-4 lg:hidden">
        <summary className="flex cursor-pointer items-center justify-between font-mono text-small text-fg">
          <span className="inline-flex items-center gap-2">
            <List
              className="h-4 w-4 shrink-0 text-brand"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="font-medium">On this page</span>
            <span className="text-xs text-fg-muted font-normal">
              ({headings.length})
            </span>
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-fg-muted transition-transform duration-[160ms] ease-brand group-open:rotate-180"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </summary>
        <div className="mt-3.5 border-t border-border-hairline pt-3">
          {renderList(true)}
        </div>
      </details>
    </>
  );
}
