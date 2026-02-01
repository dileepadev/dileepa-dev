'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeToggle, Button } from '@/components/ui';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { FiMenu, FiX } from 'react-icons/fi';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracking (scroll-spy)
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const sectionIds = NAV_LINKS.filter((l) => l.href.startsWith('#')).map((l) => l.href.slice(1));
    if (sectionIds.length === 0) return;

    // IntersectionObserver to handle most cases
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          visible.sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
          const id = visible[0].target.id;
          setActiveSection(id);
        }
      },
      { root: null, rootMargin: '0px 0px -40% 0px', threshold: [0.25, 0.5, 0.75] }
    );

    // Observe existing elements
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Scroll-based fallback & initial check (handles cases where IntersectionObserver may miss)
    let rafId: number | null = null;
    const checkActiveOnScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        let closestId: string | null = null;
        let closestDistance = Infinity;

        sectionIds.forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;
          const rect = el.getBoundingClientRect();

          // reference point slightly below the top to account for the fixed header
          const referencePoint = 80; // px from top

          // Prefer sections that contain the reference point (distance = 0)
          let distance: number;
          if (rect.top <= referencePoint && rect.bottom >= referencePoint) {
            distance = 0;
          } else {
            distance = Math.min(Math.abs(rect.top - referencePoint), Math.abs(rect.bottom - referencePoint));
          }

          if (distance < closestDistance) {
            closestDistance = distance;
            closestId = id;
          }
        });

        if (closestId) {
          setActiveSection((prev) => (prev === closestId ? prev : closestId));
        }
      });
    };

    // Run an initial check and attach listeners
    checkActiveOnScroll();
    window.addEventListener('scroll', checkActiveOnScroll, { passive: true });
    window.addEventListener('resize', checkActiveOnScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', checkActiveOnScroll);
      window.removeEventListener('resize', checkActiveOnScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push('/' + href);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-5xl rounded-2xl',
        isScrolled
          ? 'bg-bg-elevated/80 backdrop-blur-xl border border-white/10 shadow-sm shadow-brand-primary/50'
          : 'bg-transparent border border-transparent'
      )}
    >
      <div className="px-4 md:px-6">
        <nav className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo - Minimal */}
          <Link 
            href="/" 
            className="text-lg font-bold text-text-primary hover:text-accent-blue transition-colors tracking-tight"
          >
            /<span className="text-accent-blue">.</span>
          </Link>

          {/* Desktop Navigation - Pill Design */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/5 backdrop-blur-sm">
            {NAV_LINKS.map((link) => {
              const isHash = link.href.startsWith('#');
              const id = isHash ? link.href.slice(1) : link.href;
              const isActive = isHash && activeSection === id;

              const baseClass = `px-4 py-1.5 text-xs font-medium transition-all duration-300 rounded-full`;
              const activeClass = isActive 
                ? 'bg-accent-blue text-on-accent shadow-lg shadow-accent-blue/25' 
                : 'text-text-muted hover:text-text-primary hover:bg-white/5';

              if (isHash) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`${baseClass} ${activeClass}`}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${baseClass} ${activeClass}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="scale-90">
                <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-bg-tertiary text-text-primary border border-white/10"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="h-4 w-4" />
              ) : (
                <FiMenu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isMobileMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-1 pt-4 border-t border-border-light">
            {NAV_LINKS.map((link) => {
              const isHash = link.href.startsWith('#');
              const id = isHash ? link.href.slice(1) : link.href;
              const isActive = isHash && activeSection === id;

              if (isHash) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full text-left px-4 py-3 text-base font-medium transition-colors rounded-lg ${isActive ? 'bg-accent-blue text-on-accent' : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'}`}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`w-full text-left px-4 py-3 text-base font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-bg-secondary rounded-lg`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button
              href="#connect"
              size="md"
              className="mt-2 w-full"
            >
              Contact Me
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
