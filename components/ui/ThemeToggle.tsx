"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

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
      <Moon
        className="moon"
        size={16}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <Sun
        className="sun"
        size={16}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  );
}
