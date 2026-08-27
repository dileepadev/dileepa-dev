"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import {
  Button,
  Chip,
  EmptyState,
  FilterSelect,
  type FilterOption,
  Item,
  ItemList,
  LoadMore,
  SearchInput,
  SortSelect,
  type SortOption,
} from "@/components/ui";
import type { Project } from "@/lib/api-types";
import { formatMonth, humanise } from "@/lib/format";

type ProjectSortKey =
  | "default"
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc";

const SORT_OPTIONS: SortOption<ProjectSortKey>[] = [
  { value: "default", label: "Default order" },
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

const PROJECTS_PER_PAGE = 10;

function formatPeriod(start?: string | null, end?: string | null): string {
  const from = formatMonth(start);
  if (!from) return "";
  return end ? `${from} – ${formatMonth(end)}` : `${from} – present`;
}

/**
 * ProjectSearch
 *
 * Implements an explicit, decoupled Search → Filter → Sort pipeline:
 * 1. Search: Queries relevant content (name, tagline, description, stack, role, status).
 * 2. Filter: Reduces results by criteria (Status, Date/Year, Tech stack) with independent removal and restoration.
 * 3. Sort: Reorders the filtered results without removing or adding items.
 */
export function ProjectSearch({ projects }: { projects: Project[] }) {
  // --- State ---
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<ProjectSortKey>("default");
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

  // Reset pagination when search, filters or sort change
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${selectedStatus}|${selectedYear}|${selectedStack}|${sortBy}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(PROJECTS_PER_PAGE);
  }

  // --- Dynamic Filter Options ---
  const statusOptions: FilterOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      if (project.status) {
        counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([status, count]) => ({
        value: status,
        label: humanise(status),
        count,
      }));
  }, [projects]);

  const yearOptions: FilterOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    let ongoingCount = 0;

    for (const project of projects) {
      if (!project.period?.end || project.status === "active") {
        ongoingCount++;
      }
      if (project.period?.start) {
        const startYear = new Date(project.period.start).getFullYear().toString();
        if (!isNaN(Number(startYear))) {
          counts.set(startYear, (counts.get(startYear) ?? 0) + 1);
        }
      }
    }

    const sortedYears = [...counts.entries()]
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([year, count]) => ({
        value: year,
        label: year,
        count,
      }));

    if (ongoingCount > 0) {
      return [{ value: "ongoing", label: "Ongoing", count: ongoingCount }, ...sortedYears];
    }
    return sortedYears;
  }, [projects]);

  const stackOptions: FilterOption[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tech of project.stack ?? []) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 20)
      .map(([tech, count]) => ({
        value: tech,
        label: tech,
        count,
      }));
  }, [projects]);

  // --- Step 1: Search ---
  const searchedProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((project) => {
      return (
        project.name.toLowerCase().includes(q) ||
        project.tagline?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.role?.toLowerCase().includes(q) ||
        project.status?.toLowerCase().includes(q) ||
        (project.stack ?? []).some((tech) => tech.toLowerCase().includes(q))
      );
    });
  }, [projects, query]);

  // --- Step 2: Filter ---
  const filteredProjects = useMemo(() => {
    return searchedProjects.filter((project) => {
      // Status criteria
      if (selectedStatus && project.status !== selectedStatus) {
        return false;
      }

      // Year/Date criteria
      if (selectedYear) {
        if (selectedYear === "ongoing") {
          if (project.period?.end && project.status !== "active") return false;
        } else {
          const startYear = project.period?.start
            ? new Date(project.period.start).getFullYear().toString()
            : null;
          const endYear = project.period?.end
            ? new Date(project.period.end).getFullYear().toString()
            : null;
          if (startYear !== selectedYear && endYear !== selectedYear) {
            return false;
          }
        }
      }

      // Tech stack criteria
      if (selectedStack) {
        const hasTech = (project.stack ?? []).some(
          (tech) => tech.toLowerCase() === selectedStack.toLowerCase(),
        );
        if (!hasTech) return false;
      }

      return true;
    });
  }, [searchedProjects, selectedStatus, selectedYear, selectedStack]);

  // --- Step 3: Sort ---
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];

    switch (sortBy) {
      case "newest": {
        return list.sort((a, b) => {
          const dateA = a.period?.start ? new Date(a.period.start).getTime() : 0;
          const dateB = b.period?.start ? new Date(b.period.start).getTime() : 0;
          return dateB - dateA;
        });
      }
      case "oldest": {
        return list.sort((a, b) => {
          const dateA = a.period?.start ? new Date(a.period.start).getTime() : 0;
          const dateB = b.period?.start ? new Date(b.period.start).getTime() : 0;
          return dateA - dateB;
        });
      }
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "default":
      default:
        // Preserves original order from filtering
        return list;
    }
  }, [filteredProjects, sortBy]);

  // --- Step 4: Paginate ---
  const visibleProjects = sortedProjects.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProjects.length;

  // Active filter state tracking
  const hasActiveFilters = Boolean(
    query || selectedStatus || selectedYear || selectedStack,
  );

  const clearAllFilters = () => {
    setQuery("");
    setSelectedStatus(null);
    setSelectedYear(null);
    setSelectedStack(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Search Bar */}
      <div className="w-full">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects by name, description, stack, role…"
          aria-label="Search projects"
        />
      </div>

      {/* 2. Controls Toolbar: Filters on left, Sort on right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.length > 0 && (
            <FilterSelect
              label="Status"
              value={selectedStatus}
              options={statusOptions}
              onChange={setSelectedStatus}
              allLabel="All status"
            />
          )}

          {yearOptions.length > 0 && (
            <FilterSelect
              label="Date"
              value={selectedYear}
              options={yearOptions}
              onChange={setSelectedYear}
              allLabel="All dates"
            />
          )}

          {stackOptions.length > 0 && (
            <FilterSelect
              label="Tech"
              value={selectedStack}
              options={stackOptions}
              onChange={setSelectedStack}
              allLabel="All stack"
            />
          )}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <SortSelect
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={setSortBy}
            label="Sort projects"
            aria-label="Sort projects"
          />
        </div>
      </div>

      {/* 3. Active Filters Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 font-mono text-small text-fg-muted">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-fg-muted/80 mr-1">Active:</span>

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border-strong bg-bg-surface text-fg text-label hover:border-brand transition-colors cursor-pointer"
                title="Clear search query"
              >
                <span>&ldquo;{query}&rdquo;</span>
                <X className="h-3 w-3 text-fg-muted hover:text-fg" />
              </button>
            )}

            {selectedStatus && (
              <button
                type="button"
                onClick={() => setSelectedStatus(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border-strong bg-bg-surface text-fg text-label hover:border-brand transition-colors cursor-pointer"
                title="Remove status filter"
              >
                <span>Status: {humanise(selectedStatus)}</span>
                <X className="h-3 w-3 text-fg-muted hover:text-fg" />
              </button>
            )}

            {selectedYear && (
              <button
                type="button"
                onClick={() => setSelectedYear(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border-strong bg-bg-surface text-fg text-label hover:border-brand transition-colors cursor-pointer"
                title="Remove date filter"
              >
                <span>
                  Date: {selectedYear === "ongoing" ? "Ongoing" : selectedYear}
                </span>
                <X className="h-3 w-3 text-fg-muted hover:text-fg" />
              </button>
            )}

            {selectedStack && (
              <button
                type="button"
                onClick={() => setSelectedStack(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border border-border-strong bg-bg-surface text-fg text-label hover:border-brand transition-colors cursor-pointer"
                title="Remove tech stack filter"
              >
                <span>Tech: {selectedStack}</span>
                <X className="h-3 w-3 text-fg-muted hover:text-fg" />
              </button>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-brand text-label underline underline-offset-4 hover:text-fg transition-colors cursor-pointer ml-1"
            >
              Clear all
            </button>
          </div>

          <span className="text-fg-muted text-label shrink-0">
            Showing <strong className="text-fg">{sortedProjects.length}</strong> of{" "}
            {projects.length} Projects
          </span>
        </div>
      )}

      {/* 4. Results List or Graceful Empty State */}
      {sortedProjects.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No projects match your criteria"
            hint={
              hasActiveFilters
                ? "Try removing some filters or clearing your search to see more projects."
                : "No projects are currently listed."
            }
          >
            {hasActiveFilters && (
              <div className="mt-4 flex justify-center">
                <Button variant="secondary" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            )}
          </EmptyState>
        </div>
      ) : (
        <div className="mt-6">
          <ItemList>
            {visibleProjects.map((project) => (
              <Item
                key={project.id}
                title={project.name}
                href={`/projects/${project.slug}`}
                description={project.tagline || project.description}
                meta={
                  <>
                    <span className="block">{humanise(project.status)}</span>
                    {project.period?.start && (
                      <span className="block font-mono text-small text-fg-muted">
                        {formatPeriod(project.period.start, project.period.end)}
                      </span>
                    )}
                    {project.role && (
                      <span className="block">{project.role}</span>
                    )}
                  </>
                }
              >
                {(project.stack ?? []).length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {(project.stack ?? []).slice(0, 6).map((tech) => (
                      <li key={tech}>
                        <Chip>{tech}</Chip>
                      </li>
                    ))}
                  </ul>
                )}
              </Item>
            ))}
          </ItemList>

          {hasMore && (
            <LoadMore
              shown={visibleProjects.length}
              total={sortedProjects.length}
              onLoadMore={() =>
                setVisibleCount((prev) => prev + PROJECTS_PER_PAGE)
              }
              batchSize={PROJECTS_PER_PAGE}
            />
          )}
        </div>
      )}
    </div>
  );
}
