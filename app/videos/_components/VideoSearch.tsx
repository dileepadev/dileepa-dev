"use client";

import { useState, useMemo } from "react";
import { EmptyState, Item, ItemList, SearchInput } from "@/components/ui";
import { formatDate } from "@/lib/format";

interface VideoSummary {
  id: string;
  title: string;
  link: string;
  date: string;
}

/** Client-side search across videos. */
export function VideoSearch({ videos }: { videos: VideoSummary[] }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const filtered = useMemo(
    () =>
      q ? videos.filter((v) => v.title.toLowerCase().includes(q)) : videos,
    [videos, q],
  );

  return (
    <>
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Search videos…"
        resultCount={filtered.length}
        totalCount={videos.length}
      />

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No videos match your search."
            hint="Try a different keyword or clear the search."
          />
        </div>
      ) : (
        <ItemList>
          {filtered.map((video) => (
            <Item
              key={video.id}
              title={video.title}
              href={video.link}
              meta={formatDate(video.date)}
            />
          ))}
        </ItemList>
      )}
    </>
  );
}
