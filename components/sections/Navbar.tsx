"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Container, Lockup, ThemeToggle } from "@/components/ui";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const MORE_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
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
  const active = useScrollSpy(pathname === "/");
  const navRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when pathname changes during render (React 19 pattern)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
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
 * Uses a dynamic IntersectionObserver with rootMargin tuned for smooth section detection.
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
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}
