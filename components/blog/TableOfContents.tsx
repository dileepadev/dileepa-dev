"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, List } from "lucide-react";
import type { Heading } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * The table of contents.
 *
 * Two placements share one list (v2.1.0 draft). On a wide screen the profile
 * rail becomes the contents (`ProfileRail`, through `RailContents`) - the
 * rail is already the sticky column beside the article, so the contents take
 * its place rather than adding a third column that narrows the reading width.
 * Below that width the rail is hidden and this collapses into a `details`
 * above the article.
 */

/** How far below the top of the window the reader's eye is taken to be. */
const READING_LINE = 120;

/**
 * The heading the reader is in, and a way to jump to one.
 *
 * Current is the last heading above the reading line, recomputed once a
 * frame while the page scrolls - exact where an IntersectionObserver only
 * reports the headings that changed. At the very bottom the last heading
 * wins, since a short final section never reaches the line.
 *
 * `jumpTo` highlights the target at once and holds it until the scroll
 * settles; without the hold, a long glide lit up every heading it passed.
 * A jump further than two screens cuts to a screen short of the target and
 * glides the rest, so it reads as one short, smooth move rather than a blur.
 */
export function useActiveHeading(headings: Heading[]) {
  const [active, setActive] = useState<string | null>(null);
  const holdRef = useRef(false);

  useEffect(() => {
    if (headings.length === 0) return;
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);
    let frame = 0;

    const update = () => {
      frame = 0;
      if (holdRef.current) return;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      let current: string | null = null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top > READING_LINE) break;
        current = element.id;
      }
      if (atBottom && elements.length > 0) {
        current = elements[elements.length - 1].id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [headings]);

  const jumpTo = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    setActive(id);
    holdRef.current = true;
    window.history.pushState(null, "", `#${id}`);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
    const target = Math.max(
      0,
      element.getBoundingClientRect().top + window.scrollY - margin,
    );
    const distance = target - window.scrollY;

    if (reduceMotion) {
      window.scrollTo({ top: target, behavior: "instant" });
    } else {
      if (Math.abs(distance) > window.innerHeight * 2) {
        window.scrollTo({
          top: target - Math.sign(distance) * window.innerHeight,
          behavior: "instant",
        });
      }
      window.scrollTo({ top: target, behavior: "smooth" });
    }

    // Release once the page has been still for a moment - after one last
    // look at where the heading actually is. Content above it that changed
    // height during the glide (an image without a known size, an embed)
    // moves the target; a short glide puts it back.
    let corrections = 0;
    let timer = window.setTimeout(release, 200);
    function onScroll() {
      window.clearTimeout(timer);
      timer = window.setTimeout(release, 160);
    }
    function release() {
      const offset = element!.getBoundingClientRect().top - margin;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (Math.abs(offset) > 4 && !atBottom && corrections < 3) {
        corrections += 1;
        window.scrollBy({
          top: offset,
          behavior: reduceMotion ? "instant" : "smooth",
        });
        timer = window.setTimeout(release, 200);
        return;
      }
      window.removeEventListener("scroll", onScroll);
      holdRef.current = false;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
  };

  return [active, jumpTo] as const;
}

/** The list itself. `rail` is the ruled list in the rail; `inline` sits in the collapsed box. */
export function TocList({
  headings,
  variant,
}: {
  headings: Heading[];
  variant: "rail" | "inline";
}) {
  const [active, jumpTo] = useActiveHeading(headings);
  const listRef = useRef<HTMLUListElement>(null);

  // In the rail a long list scrolls inside its own band; keep the current
  // heading in view there as the reader moves through the post. Only that
  // band scrolls - `scrollIntoView` would move the page as well.
  useEffect(() => {
    if (variant !== "rail" || !active) return;
    const band = listRef.current?.closest<HTMLElement>(".rail-toc");
    const link = listRef.current?.querySelector<HTMLElement>(
      `a[href="#${CSS.escape(active)}"]`,
    );
    if (!band || !link) return;
    const bandBox = band.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    if (linkBox.top < bandBox.top || linkBox.bottom > bandBox.bottom) {
      band.scrollBy({
        top: linkBox.top - bandBox.top - bandBox.height / 3,
        behavior: "smooth",
      });
    }
  }, [active, variant]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    // In the collapsed box, fold it away so the reader lands on the heading
    // rather than on an open list.
    if (variant === "inline") {
      e.currentTarget.closest("details")?.removeAttribute("open");
    }
    jumpTo(id);
  };

  return (
    <ul
      ref={listRef}
      className={cn(
        "space-y-1.5 font-mono text-small",
        variant === "rail" && "border-l border-border-hairline",
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
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "block py-1 transition-colors no-underline leading-snug",
                variant === "inline"
                  ? cn(
                      "pl-2 rounded-row",
                      isActive
                        ? "text-brand font-medium bg-bg-surface"
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
}

/** The collapsed contents above the article, below the rail's width. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  return (
    <details className="tile group p-4 lg:hidden">
      <summary className="flex cursor-pointer items-center justify-between font-mono text-small text-fg">
        <span className="inline-flex items-center gap-2">
          <List className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
          <span className="font-medium">On this page</span>
          <span className="text-label text-fg-muted font-normal">
            ({headings.length})
          </span>
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-fg-muted transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="mt-3.5 border-t border-border-hairline pt-3">
        <TocList headings={headings} variant="inline" />
      </div>
    </details>
  );
}
