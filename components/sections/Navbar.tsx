"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Lockup, ThemeToggle } from "@/components/ui";
import { NAV_LINKS } from "@/lib/constants";

/**
 * The floating navigation bar.
 *
 * It sits 1rem below the top of the viewport as a translucent pill rather than
 * a full-width bar pinned to the edge — the reference's shape, and the reason
 * the page reads as content on a surface rather than content under a toolbar.
 *
 * The links are all hashes into the homepage. On any other route they still
 * work, because they are absolute (`/#work`), so the browser navigates home and
 * then scrolls.
 *
 * There is no hamburger. The reference gives `.nav-links` `overflow-x: auto`
 * with the scrollbar hidden, so on a narrow screen the five links scroll
 * sideways inside the pill and stay one tap away instead of one tap plus a
 * menu — which is also why the bar keeps the same height and shape at every
 * width.
 */
export function Navbar() {
  const pathname = usePathname();
  const active = useScrollSpy(pathname === "/");

  return (
    <header className="site-header">
      <Container>
        <div className="nav">
          <Lockup href="/#top" />

          <div className="nav-right">
            <nav className="nav-links" aria-label="Sections">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={
                    hashOf(link.href) === active ? "true" : undefined
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}

/** `/#work` → `work`. */
function hashOf(href: string): string {
  return href.slice(href.indexOf("#") + 1);
}

/**
 * Marks the section currently in view.
 *
 * The band is the middle 5% of the viewport — `-45%` from the top and `-50%`
 * from the bottom — so exactly one section is ever the answer, and it changes
 * as that section crosses the middle of the screen rather than as it appears
 * at the edge.
 */
function useScrollSpy(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sections = NAV_LINKS.map((link) =>
      document.getElementById(hashOf(link.href)),
    ).filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  // Derived rather than cleared in the effect: off a route with sections there
  // is no active link, and computing that here keeps the effect a subscription
  // instead of a second thing that writes state.
  return enabled ? active : null;
}
