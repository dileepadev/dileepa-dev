"use client";

import { Search, X } from "lucide-react";

/**
 * A filter-as-you-type search input with a clear button.
 *
 * Controlled: the parent owns the query string and passes the setter. This
 * keeps the component pure — it never fetches, it just tells the parent what
 * the reader typed so the parent can filter its own list.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  resultCount,
  totalCount,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** How many items survived the filter. Omit to hide the count chip. */
  resultCount?: number;
  /** The unfiltered total, shown as "N of M". */
  totalCount?: number;
}) {
  return (
    <div className="search-input-wrap">
      <Search
        className="search-input-icon"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="search-input-clear"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      )}
      {resultCount !== undefined && totalCount !== undefined && value && (
        <span className="search-input-count">
          {resultCount} of {totalCount}
        </span>
      )}
    </div>
  );
}
