"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * ThemeToggle
 *
 * Implements Concept 2 - Radial Spotlight Theme Transition:
 * An aperture circle of the target theme expands radially from the center of the
 * toggle button across the entire viewport using the View Transitions API.
 *
 * If the browser does not support startViewTransition or if the user prefers reduced
 * motion, it switches theme immediately with zero delay.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  function handleToggle() {
    const currentTheme =
      (typeof document !== "undefined"
        ? document.documentElement.getAttribute("data-theme")
        : null) ||
      resolvedTheme ||
      "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    // Immediate fallback if View Transitions is unsupported or reduced motion is preferred
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      document.documentElement.setAttribute("data-theme", nextTheme);
      setTheme(nextTheme);
      return;
    }

    // Origin coordinates: Center of the clicked toggle button
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;

    // Radius required to reach the furthest corner of the viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // Execute View Transition
    const transition = (
      document as unknown as {
        startViewTransition: (callback: () => void) => {
          ready: Promise<void>;
        };
      }
    ).startViewTransition(() => {
      document.documentElement.setAttribute("data-theme", nextTheme);
      setTheme(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 2000,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        } as KeyframeAnimationOptions,
      );
    });
  }

  return (
    <button
      ref={buttonRef}
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
