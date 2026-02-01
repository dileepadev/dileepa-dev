'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    // Defer setting mounted to avoid synchronous setState in effect body
    // and potential cascading renders. Using requestAnimationFrame schedules
    // the update after paint.
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!mounted) {
    // Render a neutral placeholder to avoid hydration mismatch on SSR
    return (
      <button
        className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg bg-bg-secondary transition-colors hover:bg-bg-tertiary"
        aria-label="Toggle theme"
        aria-pressed={false}
      >
        <FiMonitor className="h-5 w-5" />
      </button>
    );
  }

  // Cycle through themes: light <-> dark
  const cycleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={cycleTheme}
      className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg bg-bg-secondary text-text-primary transition-all hover:bg-bg-tertiary hover:scale-105"
      aria-label={`Current theme: ${resolvedTheme}. Click to toggle.`}
      aria-pressed={resolvedTheme === 'dark'}
    >
      {resolvedTheme === 'dark' ? (
        <FiMoon className="h-5 w-5" />
      ) : (
        <FiSun className="h-5 w-5" />
      )}
    </button>
  );
}
