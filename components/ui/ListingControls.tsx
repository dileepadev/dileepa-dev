"use client";

import React from "react";
import { X } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { SortSelect, type SortOption } from "./SortSelect";
import { cn } from "@/lib/utils";

export interface ActiveFilterItem {
  key: string;
  label: string;
  onRemove: () => void;
}

export interface ListingControlsProps<TSort extends string> {
  /** Current text search query */
  query: string;
  /** Callback to update search query */
  onQueryChange: (q: string) => void;
  /** Placeholder for search bar */
  searchPlaceholder?: string;

  /** Slots for FilterSelect dropdowns */
  filters?: React.ReactNode;

  /** Current sort key */
  sortBy: TSort;
  /** Callback to change sort key */
  onSortChange: (sort: TSort) => void;
  /** Available sort options */
  sortOptions: SortOption<TSort>[];
  /** Accessible label for sort dropdown */
  sortLabel?: string;

  /** Active criteria items for removable filter tags */
  activeFilters?: ActiveFilterItem[];
  /** Callback to reset all search & filters */
  onClearAll: () => void;
  /** Number of items matching current search and filters */
  filteredCount: number;
  /** Total items before search and filters */
  totalCount: number;
  /** Singular noun, e.g. "Project", "Post", "Event" */
  itemNoun: string;
  /** Plural noun, e.g. "Projects", "Posts", "Events" */
  itemPlural?: string;

  /** Optional header section (e.g. series view tabs) */
  extraHeader?: React.ReactNode;
  className?: string;
}

/**
 * ListingControls
 *
 * Universal search, filter, and sort toolbar for collection pages.
 * Enforces the site-wide Search -> Filter -> Sort UX pattern:
 * 1. Search bar at top.
 * 2. Dedicated Filter controls on the left, Sort controls on the right.
 * 3. Removable active criteria pills and live count summary.
 */
export function ListingControls<TSort extends string>({
  query,
  onQueryChange,
  searchPlaceholder = "Search…",
  filters,
  sortBy,
  onSortChange,
  sortOptions,
  sortLabel = "Sort",
  activeFilters = [],
  onClearAll,
  filteredCount,
  totalCount,
  itemNoun,
  itemPlural = `${itemNoun}s`,
  extraHeader,
  className,
}: ListingControlsProps<TSort>) {
  const hasActiveFilters = Boolean(
    query.trim() || (activeFilters && activeFilters.length > 0),
  );

  return (
    <div className={cn("space-y-6", className)}>
      {extraHeader}

      {/* 1. Search Bar */}
      <div className="w-full">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>

      {/* 2. Controls Toolbar: Filters on left, Sort on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Filters group */}
        <div className="flex flex-wrap items-center gap-2">{filters}</div>

        {/* Sort group */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <SortSelect
            value={sortBy}
            options={sortOptions}
            onChange={onSortChange}
            label={sortLabel}
            aria-label={sortLabel}
          />
        </div>
      </div>

      {/* 3. Active Filters Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 font-mono text-small text-fg-muted">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-fg-muted/80 mr-1">Active:</span>

            {query.trim() && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border-strong bg-bg-surface text-fg text-label hover:border-brand hover:bg-surface-hover transition-colors cursor-pointer"
                title="Clear search query"
              >
                <span>&ldquo;{query.trim()}&rdquo;</span>
                <X className="h-3 w-3 text-fg-muted hover:text-fg" />
              </button>
            )}

            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.onRemove}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border-strong bg-bg-surface text-fg text-label hover:border-brand hover:bg-surface-hover transition-colors cursor-pointer"
                title={`Remove ${filter.label}`}
              >
                <span>{filter.label}</span>
                <X className="h-3 w-3 text-fg-muted hover:text-fg" />
              </button>
            ))}

            <button
              type="button"
              onClick={onClearAll}
              className="text-brand text-label underline underline-offset-4 hover:text-fg transition-colors cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>

          <span className="text-fg-muted text-label shrink-0">
            Showing <strong className="text-fg">{filteredCount}</strong> of{" "}
            {totalCount} {filteredCount === 1 ? itemNoun : itemPlural}
          </span>
        </div>
      )}
    </div>
  );
}
