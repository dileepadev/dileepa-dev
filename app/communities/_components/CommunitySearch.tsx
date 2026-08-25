"use client";

import { useState, useMemo } from "react";
import {
  Button,
  EmptyState,
  Item,
  ItemList,
  SearchInput,
  SortSelect,
  type SortOption,
} from "@/components/ui";
import type { Community } from "@/lib/api-types";

type CommunitySortKey = "default" | "current-first" | "name-asc" | "name-desc";

const SORT_OPTIONS: SortOption<CommunitySortKey>[] = [
  { value: "default", label: "Default order" },
  { value: "current-first", label: "Current roles first" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

/** Client-side search and sorting across communities. */
export function CommunitySearch({
  communities,
}: {
  communities: Community[];
}) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<CommunitySortKey>("default");

  const q = query.toLowerCase().trim();

  const filteredAndSorted = useMemo(() => {
    const result = q
      ? communities.filter((c) => matches(c, q))
      : [...communities];

    result.sort((a, b) => {
      switch (sortBy) {
        case "current-first":
          if (a.current !== b.current) return a.current ? -1 : 1;
          return (b.order ?? 0) - (a.order ?? 0);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "default":
        default:
          return (b.order ?? 0) - (a.order ?? 0);
      }
    });

    return result;
  }, [communities, q, sortBy]);

  const hasFilter = query.trim().length > 0;

  return (
    <>
      <div className="list-toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search communities, roles, topics…"
        />
        <SortSelect
          value={sortBy}
          onChange={setSortBy}
          options={SORT_OPTIONS}
          label="Sort communities"
        />
      </div>

      {hasFilter && (
        <div className="filter-status">
          <span>
            Showing {filteredAndSorted.length} of {communities.length}{" "}
            {communities.length === 1 ? "community" : "communities"}
          </span>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="filter-reset-btn"
          >
            Clear filter
          </button>
        </div>
      )}

      {filteredAndSorted.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No communities match your search."
            hint="Try a different keyword or clear the search filter."
          >
            {hasFilter && (
              <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={() => setQuery("")}>
                  Clear filter
                </Button>
              </div>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8">
          <ItemList>
            {filteredAndSorted.map((community) => (
              <Item
                key={community.id}
                title={community.name}
                href={community.communityUrl || undefined}
                description={community.description}
                meta={
                  <>
                    <span className="block">{community.role}</span>
                    <span className="block">{community.period}</span>
                    {community.current && (
                      <span className="block text-brand">Current</span>
                    )}
                  </>
                }
              />
            ))}
          </ItemList>
        </div>
      )}
    </>
  );
}

function matches(community: Community, q: string): boolean {
  return (
    community.name.toLowerCase().includes(q) ||
    (community.role ?? "").toLowerCase().includes(q) ||
    (community.description ?? "").toLowerCase().includes(q) ||
    (community.period ?? "").toLowerCase().includes(q)
  );
}
