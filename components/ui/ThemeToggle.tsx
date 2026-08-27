"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle
 *
 * Provides instant, stutter-free theme switching with smooth View Transitions
 * and synchronous fallback transitions.
 *
 * Eliminates the frame-delay stutter of React 19 / next-themes by mutating
 * the data-theme attribute on <html> synchronously during the transition,
 * avoiding deferred useEffect rendering lag while keeping next-themes and
 * localStorage fully synchronized.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  function handleToggle() {
    const currentTheme =
      (typeof document !== "undefined"
        ? document.documentElement.getAttribute("data-theme")
        : null) ||
      resolvedTheme ||
      "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    // 1. If View Transitions API is supported and reduced motion is not preferred,
    // execute a compositor-driven cross-fade snapshot transition (60/120fps).
    if (
      typeof document !== "undefined" &&
      "startViewTransition" in document &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.startViewTransition(() => {
        document.documentElement.setAttribute("data-theme", nextTheme);
        setTheme(nextTheme);
      });
      return;
    }

    // 2. Synchronous fallback for browsers without View Transitions:
    // Applies temporary .theme-transitioning class to synchronize all surface,
    // text, and border changes smoothly across the DOM.
    if (typeof document !== "undefined") {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!prefersReduced) {
        document.documentElement.classList.add("theme-transitioning");
      }

      document.documentElement.setAttribute("data-theme", nextTheme);
      setTheme(nextTheme);

      if (!prefersReduced) {
        window.setTimeout(() => {
          document.documentElement.classList.remove("theme-transitioning");
        }, 240);
      }
      return;
    }

    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleToggle}
      aria-label="Switch colour theme"
    >
      <Moon className="moon" size={16} strokeWidth={1.75} aria-hidden="true" />
      <Sun className="sun" size={16} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
