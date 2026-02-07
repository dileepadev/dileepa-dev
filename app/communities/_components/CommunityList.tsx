"use client";

import { useState, useMemo } from "react";
import {
  FaSearch,
  FaSortAmountDown,
  FaUsers,
  FaThLarge,
  FaList,
} from "react-icons/fa";
import { CommunityListCard } from "@/components/ui/cards";
import type { CommunityDto } from "@/lib/api-types";
import { Button, Badge } from "@/components/ui";

interface CommunityListProps {
  communities: CommunityDto[];
}

type SortOption = "current-first" | "past-first" | "name-asc" | "name-desc";
type ViewOption = "card" | "table";

export function CommunityList({ communities }: CommunityListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("current-first");
  const [view, setView] = useState<ViewOption>("card");

  const filteredAndSortedCommunities = useMemo(() => {
    return [...communities]
      .filter(
        (community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "current-first":
            if (a.current !== b.current) return a.current ? -1 : 1;
            return a.name.localeCompare(b.name);
          case "past-first":
            if (a.current !== b.current) return a.current ? 1 : -1;
            return a.name.localeCompare(b.name);
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [communities, searchQuery, sortBy]);

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
            Search Communities
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
              <FaSearch className="h-4 w-4" />
            </div>
            <input
              id="search"
              type="text"
              placeholder="Search by name, role, or description..."
              className="block w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue text-text-primary placeholder-text-muted transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          {/* View Toggle */}
          <div className="w-full sm:w-auto space-y-2">
            <span className="block text-sm font-semibold text-text-secondary ml-1">
              View
            </span>
            <div className="flex bg-bg-primary p-1 rounded-xl border border-border-light shadow-sm h-12">
              <button
                onClick={() => setView("card")}
                className={`flex-1 sm:flex-none w-12 flex items-center justify-center rounded-lg transition-all ${
                  view === "card"
                    ? "bg-accent-blue/10 text-accent-blue shadow-sm"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                }`}
                title="Card View"
                aria-label="Card View"
              >
                <FaThLarge className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("table")}
                className={`flex-1 sm:flex-none w-12 flex items-center justify-center rounded-lg transition-all ${
                  view === "table"
                    ? "bg-accent-blue/10 text-accent-blue shadow-sm"
                    : "text-text-muted hover:text-text-primary hover:bg-bg-secondary"
                }`}
                title="Table View"
                aria-label="Table View"
              >
                <FaList className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className="w-full sm:w-auto space-y-2">
            <label
              htmlFor="sort"
              className="block text-sm font-semibold text-text-secondary ml-1"
            >
              Sort by
            </label>
            <div className="relative w-full md:w-auto min-w-48">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                <FaSortAmountDown className="h-4 w-4" />
              </div>
              <select
                id="sort"
                className="block w-full pl-11 pr-10 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue text-text-primary appearance-none transition-all cursor-pointer shadow-sm font-medium h-12"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="current-first">Current First</option>
                <option value="past-first">Past First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
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
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        {searchQuery && (
          <p className="text-text-secondary animate-in fade-in slide-in-from-left-4 duration-300">
            Found{" "}
            <span className="text-text-primary font-bold">
              {filteredAndSortedCommunities.length}
            </span>{" "}
            communities matching &quot;
            <span className="text-accent-blue font-medium">{searchQuery}</span>
            &quot;
          </p>
        )}
      </div>

      {/* Communities List */}
      {view === "card" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 max-w-6xl mx-auto animate-in fade-in duration-500">
          {filteredAndSortedCommunities.map((community) => (
            <CommunityListCard
              key={community._id}
              community={community}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="bg-bg-secondary rounded-2xl border border-border-light overflow-hidden shadow-sm animate-in fade-in duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg-tertiary border-b border-border-light">
                <tr>
                  <th className="py-4 px-6 text-sm font-semibold text-text-secondary">
                    Community & Role
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-text-secondary w-48">
                    Period
                  </th>
                  <th className="py-4 px-6 text-sm font-semibold text-text-secondary w-32 text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredAndSortedCommunities.map((community) => (
                  <tr
                    key={community._id}
                    className="hover:bg-bg-primary/50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={community.logo.light}
                          alt={community.name}
                          className="w-10 h-10 rounded-lg object-contain bg-white dark:hidden"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={community.logo.dark}
                          alt={community.name}
                          className="w-10 h-10 rounded-lg object-contain bg-black hidden dark:block"
                        />
                        <div>
                          <h3 className="font-semibold text-text-primary group-hover:text-accent-blue transition-colors">
                            {community.name}
                          </h3>
                          <p className="text-sm text-text-muted">
                            {community.role}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-text-secondary">
                        {community.period}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge
                        variant={community.current ? "active" : "inactive"}
                        size="sm"
                        className="uppercase"
                      >
                        {community.current ? "Current" : "Past"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty States */}
      {filteredAndSortedCommunities.length === 0 && (
        <div className="text-center py-20 bg-bg-secondary rounded-3xl border border-dashed border-border-light shadow-inner">
          <div className="flex justify-center mb-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-bg-primary text-text-muted shadow-sm">
              <FaUsers className="h-12 w-12" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            {searchQuery
              ? "No matching communities found"
              : "No communities available"}
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto px-4">
            {searchQuery
              ? `We couldn't find any communities matching "${searchQuery}". Please try different keywords.`
              : "There are no communities to display at the moment."}
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
