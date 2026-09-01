/**
 * Shared search, facet and sort primitives for the listing pages.
 *
 * Blog, projects, events, videos and communities all run the same pipeline -
 * search, then filter, then sort, then paginate - and each page had grown its
 * own copy of it. The copies drifted: some compared dates in local time while
 * the row beside them rendered in UTC, some counted a facet with a different
 * rule than the one the filter applied, and every one of them treated a
 * missing date as 1970 so undated entries surfaced first under "oldest".
 *
 * The rules those pages share live here so a fix lands once. What stays in the
 * page is what is genuinely per-collection: which fields are searchable, which
 * dimensions are offered, and what the sort keys mean.
 */

import type { FilterOption } from "@/components/ui";
import { year } from "./format";

/**
 * Numeric, case- and accent-insensitive.
 *
 * Plain `localeCompare` puts "Part 10" before "Part 2" and sorts "Éclair"
 * after "Zebra", both of which read as a bug to anyone scanning the list.
 */
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export type SortDirection = "newest" | "oldest";

/** A–Z the way a reader expects it. */
export function compareText(a: string, b: string): number {
  return collator.compare(a, b);
}

function timestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

/**
 * Date ordering with undated entries pinned last in *both* directions.
 *
 * Coercing a missing date to 0 makes it the oldest thing in the collection,
 * so "Oldest first" opened on the entries that have no date at all. An entry
 * nobody dated is not the oldest one; it is the one with the least to say
 * about where it belongs, and it belongs at the end either way.
 */
export function compareDate(
  a: string | null | undefined,
  b: string | null | undefined,
  direction: SortDirection,
): number {
  const timeA = timestamp(a);
  const timeB = timestamp(b);
  if (timeA === null || timeB === null) {
    if (timeA === timeB) return 0;
    return timeA === null ? 1 : -1;
  }
  return direction === "newest" ? timeB - timeA : timeA - timeB;
}

/** Numeric ordering with unknown values last, for the same reason as dates. */
export function compareNumber(
  a: number | null | undefined,
  b: number | null | undefined,
  direction: "asc" | "desc",
): number {
  const hasA = typeof a === "number" && Number.isFinite(a);
  const hasB = typeof b === "number" && Number.isFinite(b);
  if (!hasA || !hasB) {
    if (hasA === hasB) return 0;
    return hasA ? -1 : 1;
  }
  return direction === "asc" ? a - b : b - a;
}

/**
 * The year a row is filed under, as a string, or null if it has no usable date.
 *
 * UTC, via `year()`, because that is the timezone `formatDate` renders in. Read
 * with `getFullYear()` the facet is computed in the visitor's timezone, so a
 * post published at 00:30 UTC on 1 January is listed under 2026 and filed under
 * 2025 for anyone west of Greenwich - the row is then missing from the year its
 * own date column shows.
 */
export function yearOf(value: string | null | undefined): string | null {
  const parsed = year(value);
  return parsed === null ? null : String(parsed);
}

/**
 * Splits a query into tokens.
 *
 * Matching every token separately rather than the raw string means word order
 * stops mattering: "react hooks" finds "Hooks in React", which a single
 * `includes` cannot. Tokens carry no whitespace, which is what lets
 * `matchesTokens` join fields safely.
 */
export function searchTokens(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

/**
 * True when every token appears somewhere in the given fields.
 *
 * Fields are joined with a newline - a separator no token can contain - so a
 * token cannot match across the seam between two unrelated fields.
 */
export function matchesTokens(
  fields: (string | null | undefined)[],
  tokens: string[],
): boolean {
  if (tokens.length === 0) return true;
  const haystack = fields
    .filter((field): field is string => Boolean(field))
    .join("\n")
    .toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

/** One filterable dimension: how a row contributes to it, and what it matches. */
export interface FacetSpec<T> {
  /** Stable key, used to look the dimension's counts back up. */
  key: string;
  /** Values this row is filed under. Several for tags, one or none otherwise. */
  values: (item: T) => (string | null | undefined)[];
  /**
   * Whether a row matches a chosen value, when membership is not simply
   * "the row is filed under it" - a project's "Ongoing" is one such rule.
   */
  matches?: (item: T, selected: string) => boolean;
}

export type FacetCounts = Map<string, number>;

function itemValues<T>(spec: FacetSpec<T>, item: T): string[] {
  return [
    ...new Set(
      spec.values(item).filter((value): value is string => Boolean(value)),
    ),
  ];
}

function itemMatches<T>(spec: FacetSpec<T>, item: T, selected: string): boolean {
  return spec.matches
    ? spec.matches(item, selected)
    : itemValues(spec, item).includes(selected);
}

/**
 * Applies the selected filters, and counts each dimension's options.
 *
 * A dimension is counted against the search results and every *other* active
 * filter, but never against itself - which is what makes the number beside an
 * option the number of rows that selecting it actually leaves. Counting
 * against the raw collection instead, as these pages used to, produces a
 * "Tech: Rust (7)" that lands on three rows because a status filter is also
 * on; counting against the fully filtered set collapses every option in the
 * dimension you are currently browsing to zero.
 */
export function buildFacets<T>(
  items: T[],
  specs: FacetSpec<T>[],
  selected: Record<string, string | null>,
): { counts: Record<string, FacetCounts>; matched: T[] } {
  const passes = (item: T, exceptKey: string | null) =>
    specs.every((spec) => {
      if (spec.key === exceptKey) return true;
      const value = selected[spec.key];
      return !value || itemMatches(spec, item, value);
    });

  const counts: Record<string, FacetCounts> = {};
  for (const spec of specs) {
    const map: FacetCounts = new Map();
    for (const item of items) {
      if (!passes(item, spec.key)) continue;
      for (const value of itemValues(spec, item)) {
        map.set(value, (map.get(value) ?? 0) + 1);
      }
    }
    counts[spec.key] = map;
  }

  return { counts, matched: items.filter((item) => passes(item, null)) };
}

export interface OptionsConfig {
  /** Display label for a raw value. Defaults to the value itself. */
  label?: (value: string) => string;
  /** "count" is frequency-first; "year" is newest-first; "label" is A–Z. */
  order?: "count" | "year" | "label";
  /** Cap on how many options are offered, for open-ended dimensions like tags. */
  limit?: number;
  /**
   * The currently selected value, always kept in the list.
   *
   * Without this a selection can fall out of its own dropdown - past the limit,
   * or down to zero once another filter narrows the set - and `FilterSelect`
   * then has nothing to render but "All tags" while the filter is still on.
   */
  keep?: string | null;
  /** Values to pin above the counted ones, e.g. a synthetic "Ongoing". */
  leading?: FilterOption[];
}

/** Turns raw facet counts into the options a `FilterSelect` renders. */
export function toOptions(
  counts: FacetCounts,
  config: OptionsConfig = {},
): FilterOption[] {
  const { label = (value: string) => value, order = "count", keep } = config;

  const entries = [...counts.entries()];
  entries.sort(([valueA, countA], [valueB, countB]) => {
    if (order === "year") {
      // A year dimension can carry a synthetic value that is not a year -
      // projects file an open-ended period under "Ongoing". Those sort above
      // the years rather than through `Number()`, which would compare them all
      // as NaN and leave the order down to the engine.
      const yearA = Number(valueA);
      const yearB = Number(valueB);
      const numericA = Number.isFinite(yearA);
      const numericB = Number.isFinite(yearB);
      if (numericA !== numericB) return numericA ? 1 : -1;
      if (!numericA) return compareText(label(valueA), label(valueB));
      return yearB - yearA;
    }
    if (order === "label") return compareText(label(valueA), label(valueB));
    return countB - countA || compareText(label(valueA), label(valueB));
  });

  let options = entries.map(([value, count]) => ({
    value,
    label: label(value),
    count,
  }));

  if (config.limit !== undefined) {
    options = options.slice(0, config.limit);
  }

  if (keep && !options.some((option) => option.value === keep)) {
    options = [
      ...options,
      { value: keep, label: label(keep), count: counts.get(keep) ?? 0 },
    ];
  }

  return [...(config.leading ?? []), ...options];
}
