"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container, Lockup, ThemeToggle } from "@/components/ui";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MORE_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Videos", href: "/videos" },
  { label: "Communities", href: "/communities" },
];

/**
 * The floating navigation bar.
 *
 * Sits as a floating translucent pill with frosted glass backdrop blur.
 * On desktop: renders the brand lockup, section navigation links, and theme toggle.
 * On mobile: replaces cramped horizontal scrolling with an accessible, animated dropdown menu.
 */
export function Navbar() {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const active = useScrollSpy(pathname === "/");
  const navRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  const isExploreActive = MORE_LINKS.some((link) =>
    pathname.startsWith(link.href),
  );

  // Close mobile and explore menus when pathname changes during render (React 19 pattern)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setExploreOpen(false);
  }

  // Close mobile menu on outside pointer click or Escape
  useEffect(() => {
    if (!mobileOpen) return;

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  // Close desktop explore menu on outside click or Escape
  useEffect(() => {
    if (!exploreOpen) return;

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setExploreOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [exploreOpen]);

  return (
    <header className="site-header">
      <Container>
        <div ref={navRef} className="nav-wrapper">
          <div className="nav">
            <Lockup href="/#top" />

            <div className="nav-right">
              {/* Desktop links */}
              <nav className="nav-links" aria-label="Sections">
                {NAV_LINKS.map((link) => {
                  const hash = hashOf(link.href);
                  const isCurrent = pathname === "/" && hash === active;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn("nav-link", isCurrent && "is-active")}
                      aria-current={isCurrent ? "true" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Desktop Explore Dropdown */}
                <div className="relative" ref={exploreRef}>
                  <button
                    type="button"
                    onClick={() => setExploreOpen((prev) => !prev)}
                    className={cn(
                      "nav-link inline-flex items-center gap-1 cursor-pointer",
                      (exploreOpen || isExploreActive) && "is-active",
                    )}
                    aria-expanded={exploreOpen}
                    aria-haspopup="menu"
                    aria-label="Explore pages"
                  >
                    <span>Explore</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-150",
                        exploreOpen && "rotate-180",
                      )}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </button>

                  {exploreOpen && (
                    <div
                      role="menu"
                      aria-label="Explore pages"
                      className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border-strong bg-bg-surface p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150"
                    >
                      {MORE_LINKS.map((item) => {
                        const isCurrent = pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            role="menuitem"
                            onClick={() => setExploreOpen(false)}
                            className={cn(
                              "flex items-center justify-between rounded-sm px-3 py-2 text-small font-medium text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg",
                              isCurrent && "text-brand bg-surface-hover font-medium",
                            )}
                            aria-current={isCurrent ? "page" : undefined}
                          >
                            <span>{item.label}</span>
                            {isCurrent && (
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-brand"
                                aria-hidden="true"
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </nav>

              <div className="nav-controls">
                <ThemeToggle />

                {/* Mobile menu toggle button */}
                <button
                  type="button"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  className={cn("nav-mobile-toggle", mobileOpen && "is-open")}
                  aria-expanded={mobileOpen}
                  aria-label={
                    mobileOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                >
                  {mobileOpen ? (
                    <X className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Menu
                      className="h-4 w-4"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileOpen && (
            <div className="nav-mobile-menu">
              <nav aria-label="Mobile navigation">
                <div className="nav-mobile-section-label">Sections</div>
                <div className="nav-mobile-links">
                  {NAV_LINKS.map((link) => {
                    const hash = hashOf(link.href);
                    const isCurrent = pathname === "/" && hash === active;

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "nav-mobile-link",
                          isCurrent && "is-active",
                        )}
                        aria-current={isCurrent ? "true" : undefined}
                      >
                        <span>{link.label}</span>
                        {isCurrent && (
                          <span className="nav-active-dot" aria-hidden="true" />
                        )}
                      </Link>
                    );
                  })}
                </div>

                <div className="nav-mobile-divider" />

                <div className="nav-mobile-section-label">Explore</div>
                <div className="nav-mobile-grid">
                  {MORE_LINKS.map((link) => {
                    const isCurrent = pathname.startsWith(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "nav-mobile-sublink",
                          isCurrent && "is-active",
                        )}
                        aria-current={isCurrent ? "page" : undefined}
                      >
                        <span>{link.label}</span>
                        {isCurrent && (
                          <span className="nav-active-dot" aria-hidden="true" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          )}
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
 * Tracks scroll position against each section boundary with a top offset to clear the sticky navbar.
 * When the user is at the top of the page (Hero / #top), clears all active section highlights.
 */
function useScrollSpy(enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const sectionIds = NAV_LINKS.map((link) => hashOf(link.href));

    function updateActiveSection() {
      const scrollY = window.scrollY;
      const headerOffset = 100;

      // When in Hero / #top or near the top of the page, clear all navbar highlights
      const firstSection = document.getElementById(sectionIds[0]);
      if (!firstSection || scrollY < firstSection.offsetTop - 200) {
        setActive((prev) => (prev !== null ? null : prev));
        return;
      }

      // Check if user is scrolled to the very bottom of the document
      if (
        window.innerHeight + Math.round(scrollY) >=
        document.documentElement.scrollHeight - 50
      ) {
        const lastId = sectionIds[sectionIds.length - 1];
        setActive((prev) => (prev !== lastId ? lastId : prev));
        return;
      }

      // Find the lowest section whose top is at or above the current scroll threshold
      let currentSection: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - headerOffset;
          if (scrollY >= top) {
            currentSection = id;
          }
        }
      }

      setActive((prev) => (prev !== currentSection ? currentSection : prev));
    }

    // Run shortly after initial mount and scroll restoration
    const rafInit = window.requestAnimationFrame(updateActiveSection);
    const timer1 = window.setTimeout(updateActiveSection, 50);
    const timer2 = window.setTimeout(updateActiveSection, 200);

    let rafId: number | null = null;
    function onScroll() {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        updateActiveSection();
        rafId = null;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafInit);
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  return enabled ? active : null;
}
