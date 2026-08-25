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
import type { Video } from "@/lib/api-types";
import { formatDate } from "@/lib/format";

type VideoSortKey = "newest" | "oldest" | "title-asc" | "title-desc";

const SORT_OPTIONS: SortOption<VideoSortKey>[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A–Z)" },
  { value: "title-desc", label: "Title (Z–A)" },
];

/** Client-side search and sorting across videos. */
export function VideoSearch({ videos }: { videos: Video[] }) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<VideoSortKey>("newest");

  const q = query.toLowerCase().trim();

  const filteredAndSorted = useMemo(() => {
    // Search covers the description too. A reader searching "azure" means the
    // subject, and the subject is as likely to be in the sentence under the
    // title as in the title itself.
    const result = q
      ? videos.filter(
          (v) =>
            v.title.toLowerCase().includes(q) ||
            (v.description ?? "").toLowerCase().includes(q),
        )
      : [...videos];

    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateA - dateB;
        }
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [videos, q, sortBy]);

  const hasFilter = query.trim().length > 0;

  return (
    <>
      <div className="list-toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search walkthroughs, topics…"
        />
        <SortSelect
          value={sortBy}
          onChange={setSortBy}
          options={SORT_OPTIONS}
          label="Sort videos"
        />
      </div>

      {hasFilter && (
        <div className="filter-status">
          <span>
            Showing {filteredAndSorted.length} of {videos.length}{" "}
            {videos.length === 1 ? "video" : "videos"}
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
            title="No videos match your search."
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
            {filteredAndSorted.map((video) => (
              <Item
                key={video.id}
                title={video.title}
                href={video.link}
                description={video.description || undefined}
                meta={formatDate(video.date)}
              />
            ))}
          </ItemList>
        </div>
      )}
    </>
  );
}
