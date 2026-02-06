"use client";

import { useState, useMemo } from "react";
import { FaSearch, FaSortAmountDown, FaYoutube } from "react-icons/fa";
import { VideoCard } from "@/components/ui/cards";
import type { VideoDto } from "@/lib/api-types";
import { Button } from "@/components/ui";

interface VideoListProps {
  videos: VideoDto[];
}

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

export function VideoList({ videos }: VideoListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filteredAndSortedVideos = useMemo(() => {
    return [...videos]
      .filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case "oldest":
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          default:
            return 0;
        }
      });
  }, [videos, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 items-end justify-between bg-bg-secondary p-6 rounded-2xl border border-border-light shadow-sm">
        {/* Search */}
        <div className="w-full md:max-w-md space-y-2">
          <label
            htmlFor="search"
            className="text-sm font-semibold text-text-secondary ml-1"
          >
            Search Videos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
              <FaSearch className="h-4 w-4" />
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by title..."
              className="block w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue text-text-primary placeholder-text-muted transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Sort */}
        <div className="w-full md:w-auto space-y-2">
          <label
            htmlFor="sort"
            className="text-sm font-semibold text-text-secondary ml-1"
          >
            Sort by
          </label>
          <div className="relative w-full md:w-auto min-w-45">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
              <FaSortAmountDown className="h-4 w-4" />
            </div>
            <select
              id="sort"
              className="block w-full pl-11 pr-10 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue text-text-primary appearance-none transition-all cursor-pointer shadow-sm font-medium"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-text-muted">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        {searchQuery && (
          <p className="text-text-secondary animate-in fade-in slide-in-from-left-4 duration-300">
            Found{" "}
            <span className="text-text-primary font-bold">
              {filteredAndSortedVideos.length}
            </span>{" "}
            videos matching &quot;
            <span className="text-accent-blue font-medium">{searchQuery}</span>
            &quot;
          </p>
        )}
      </div>

      {/* Videos List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto">
        {filteredAndSortedVideos.map((video: VideoDto) => (
          <VideoCard
            key={video._id ?? video.link}
            video={video}
            className="h-full"
          />
        ))}
      </div>

      {/* Empty States */}
      {filteredAndSortedVideos.length === 0 && (
        <div className="text-center py-20 bg-bg-secondary rounded-3xl border border-dashed border-border-light shadow-inner">
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-bg-primary text-text-muted shadow-sm">
              <FaYoutube className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            {searchQuery ? "No matching videos found" : "No videos available"}
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto px-4">
            {searchQuery
              ? `We couldn't find any videos matching "${searchQuery}". Please try different keywords or browse all our content.`
              : "There are no videos to display at the moment. Please check back later!"}
          </p>
          {searchQuery && (
            <Button
              onClick={() => setSearchQuery("")}
              variant="outline"
              className="min-w-40"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
