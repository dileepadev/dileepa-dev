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

  const list = (
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={heading.depth === 3 ? "pl-4" : undefined}
        >
          <a
            href={`#${heading.id}`}
            className={cn(
              "block text-small no-underline transition-colors duration-[160ms] ease-brand",
              active === heading.id
                ? "text-brand"
                : "text-fg-muted hover:text-fg",
            )}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav
        aria-label="On this page"
        className="hidden lg:sticky lg:top-24 lg:block"
      >
        <p className="font-mono text-small text-fg-muted">On this page</p>
        <div className="mt-3">{list}</div>
      </nav>

      <details className="group rounded-lg border border-border-strong bg-bg-surface p-4 lg:hidden">
        <summary className="flex cursor-pointer items-center justify-between font-mono text-small text-fg-muted">
          <span className="inline-flex items-center gap-2">
            <List className="h-4 w-4 shrink-0 text-fg-muted" strokeWidth={1.75} aria-hidden="true" />
            <span>On this page</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-[160ms] ease-brand group-open:rotate-180" strokeWidth={1.75} aria-hidden="true" />
        </summary>
        <div className="mt-3">{list}</div>
      </details>
    </>
  );
}
