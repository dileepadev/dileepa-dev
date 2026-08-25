"use client";

import { useTheme } from "next-themes";

/**
 * No mounted flag and no effect.
 *
 * The usual pattern renders a placeholder until an effect sets `mounted`,
 * because the server does not know the visitor's theme. That costs a render
 * pass and trips React 19's set-state-in-effect rule. Instead both icons are
 * always in the markup and CSS shows the right one, so the server and client
 * render identical HTML and there is nothing to reconcile.
 *
 * `resolvedTheme` is only read inside the click handler, by which point the
 * component is hydrated and the value is correct.
 *
 * The marks are the reference's own paths at its 1.7 stroke rather than an
 * icon package's: at 16px the difference between a 1.7 and a 2.0 stroke is the
 * difference between this button and a slightly heavier one.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Switch colour theme"
    >
      <svg
        className="moon"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
      </svg>
      <svg
        className="sun"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.5M12 19v2.5M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2.5 12H5M19 12h2.5M4.2 19.8L6 18M18 6l1.8-1.8" />
      </svg>
    </button>
  );
}
