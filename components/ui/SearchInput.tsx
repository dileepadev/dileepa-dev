"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A filter-as-you-type search input with keyboard shortcut and clear action.
 *
 * Controlled: the parent owns the query string and passes the setter.
 * Supports a global '/' hotkey to quickly jump focus to the search bar.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  autoFocusHotkey = true,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** When true, pressing '/' focuses this input if not already typing elsewhere. */
  autoFocusHotkey?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!autoFocusHotkey) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (document.activeElement?.tagName || "").toUpperCase(),
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (value) {
          onChange("");
        } else {
          inputRef.current?.blur();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [autoFocusHotkey, value, onChange]);

  return (
    <div className={cn("search-input-wrap", className)}>
      <Search
        className="search-input-icon"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="search-input-clear"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      ) : (
        autoFocusHotkey && (
          <kbd className="search-kbd" aria-hidden="true" title="Press / to focus">
            /
          </kbd>
        )
      )}
    </div>
  );
}
