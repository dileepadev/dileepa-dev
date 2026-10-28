"use client";

import { cn } from "@/lib/utils";

/**
 * A row of mutually exclusive options - a view switch, a preview variant.
 *
 * v2.1.0 draft: the one switch the site uses, in the action size, so the
 * sitemap's "Tree view / Pages list" and the brand page's card variants are
 * the same control. Each option is a real button with `aria-pressed`.
 */
export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Names the group for assistive tech. */
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("toggle-group", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className="toggle-group-option"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
