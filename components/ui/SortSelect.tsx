"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortOption<T extends string = string> {
  value: T;
  label: string;
}

/**
 * A custom theme-aligned dropdown for list sorting.
 *
 * Replaces the unstyled native OS `<select>` with a bespoke menu styled
 * against the brand tokens (`--bg-surface`, `--border-strong`, `--brand`,
 * `--radius`, etc.), complete with keyboard navigation and focus management.
 */
export function SortSelect<T extends string>({
  value,
  onChange,
  options,
  label = "Sort by",
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: SortOption<T>[];
  label?: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const activeIndex = options.findIndex((opt) => opt.value === value);
  const [highlightedIndex, setHighlightedIndex] = useState(
    activeIndex >= 0 ? activeIndex : 0,
  );

  const selectedOption =
    options.find((opt) => opt.value === value) || options[0];

  function openMenu() {
    setHighlightedIndex(activeIndex >= 0 ? activeIndex : 0);
    setIsOpen(true);
  }

  function closeMenu() {
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  // Close on outside pointer click
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isOpen]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev - 1 + options.length) % options.length,
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (options[highlightedIndex]) {
          onChange(options[highlightedIndex].value);
          closeMenu();
        }
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn("sort-dropdown-wrap", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        className={cn("sort-dropdown-trigger", isOpen && "is-open")}
      >
        <ArrowUpDown
          className="sort-dropdown-icon"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className="sort-dropdown-label">{selectedOption.label}</span>
        <ChevronDown
          className={cn("sort-dropdown-chevron", isOpen && "rotate-180")}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          className="sort-dropdown-menu"
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  closeMenu();
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={cn(
                  "sort-dropdown-item",
                  isSelected && "is-selected",
                  isHighlighted && "is-highlighted",
                )}
              >
                <span className="sort-dropdown-item-text">{option.label}</span>
                {isSelected && (
                  <Check
                    className="sort-dropdown-check"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
