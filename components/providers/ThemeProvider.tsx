"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode } from "react";

// React 19 warns when next-themes injects its inline FOUC-prevention script during
// client-side rendering. Filter this known false positive to prevent the dev overlay from triggering.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes(
        "Encountered a script tag while rendering React component",
      )
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      // The token sheet keys its light overrides off [data-theme="light"] and
      // leaves :root as the dark default, so the attribute has to be
      // data-theme rather than next-themes' default class.
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      // One key across every surface, so the theme follows a visitor from the
      // main site to links and back. Design system §7.
      storageKey="dileepa-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
