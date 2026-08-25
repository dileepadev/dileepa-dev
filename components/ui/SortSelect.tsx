"use client";

import { ArrowUpDown, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortOption<T extends string = string> {
  value: T;
  label: string;
}

/**
 * A styled select dropdown for list sorting.
 *
 * Maintains the exact same 40px baseline height (`--control-h`), border tokens,
 * hover warmth, and emerald focus ring as buttons and search inputs.
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
  return (
    <div className={cn("sort-select-wrap", className)}>
      <ArrowUpDown
        className="sort-select-icon"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-label={label}
        className="sort-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="sort-select-chevron"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}
