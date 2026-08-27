"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSelectProps {
  /** The dimension name, e.g. "Status", "Date", "Tech" */
  label: string;
  /** Currently selected value, or null for all */
  value: string | null;
  /** Available filter options */
  options: FilterOption[];
  /** Callback when option changes */
  onChange: (value: string | null) => void;
  /** Label for the 'all' state, e.g. "All" or "All dates" */
  allLabel?: string;
  className?: string;
}

/**
 * FilterSelect
 *
 * Dedicated theme-aligned dropdown for list filtering.
 * Distinct from SortSelect: uses filter iconography, shows active indicator dots,
 * and handles criteria selection independently from sorting.
 */
export function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel = "All",
  className,
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const isActive = value !== null && value !== "";
  const selectedOption = options.find((opt) => opt.value === value);

  const displayValue = selectedOption ? selectedOption.label : allLabel;

  // Options with "All" prepended
  const allItems: FilterOption[] = [
    { value: "", label: allLabel },
    ...options,
  ];

  const activeIndex = allItems.findIndex((opt) =>
    value === null ? opt.value === "" : opt.value === value,
  );
  const [highlightedIndex, setHighlightedIndex] = useState(
    activeIndex >= 0 ? activeIndex : 0,
  );

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
        setHighlightedIndex((prev) => (prev + 1) % allItems.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev - 1 + allItems.length) % allItems.length,
        );
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (allItems[highlightedIndex]) {
          const val = allItems[highlightedIndex].value;
          onChange(val === "" ? null : val);
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
      className={cn("relative inline-flex flex-shrink-0", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-label={`Filter by ${label}`}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        className={cn(
          "inline-flex items-center gap-1.5 h-[36px] px-3 rounded-sm border text-small font-medium transition-colors cursor-pointer",
          isActive
            ? "border-brand/60 bg-surface-hover text-fg"
            : "border-border-strong bg-bg-surface text-fg-muted hover:text-fg hover:border-brand/40",
          isOpen && "border-brand ring-1 ring-brand",
        )}
      >
        <SlidersHorizontal
          className={cn(
            "h-3.5 w-3.5 shrink-0 transition-colors",
            isActive ? "text-brand" : "text-fg-muted",
          )}
          strokeWidth={1.75}
          aria-hidden="true"
        />

        <span className="font-mono text-label text-fg-muted">{label}:</span>
        <span className="font-sans font-medium text-fg">{displayValue}</span>

        {isActive && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand shrink-0"
            aria-hidden="true"
          />
        )}

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-fg-muted transition-transform duration-150 ml-0.5",
            isOpen && "rotate-180",
          )}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={`Filter options for ${label}`}
          className="absolute top-[calc(100%+6px)] left-0 z-50 min-w-[180px] max-h-[260px] overflow-y-auto p-1 bg-bg-surface border border-border-strong rounded-sm shadow-xl list-none m-0 animate-in fade-in zoom-in-95 duration-150"
        >
          {allItems.map((item, idx) => {
            const isSelected =
              value === null ? item.value === "" : item.value === value;
            const isHighlighted = idx === highlightedIndex;

            return (
              <li
                key={item.value || "all"}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(item.value === "" ? null : item.value);
                  closeMenu();
                }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                className={cn(
                  "flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-sm text-small font-medium cursor-pointer transition-colors",
                  isHighlighted ? "bg-surface-hover text-fg" : "text-fg-muted",
                  isSelected && "text-brand font-medium",
                )}
              >
                <span className="truncate">{item.label}</span>

                <div className="flex items-center gap-2 shrink-0">
                  {item.count !== undefined && (
                    <span className="font-mono text-label text-fg-muted/70">
                      {item.count}
                    </span>
                  )}
                  {isSelected && (
                    <Check
                      className="h-3.5 w-3.5 text-brand"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
