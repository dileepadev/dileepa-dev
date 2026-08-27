"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Chip,
  EmptyState,
  Item,
  ItemList,
  LoadMore,
  SearchInput,
  SortSelect,
  type SortOption,
} from "@/components/ui";
import type { Project } from "@/lib/api-types";
import { formatMonth, humanise } from "@/lib/format";
import { cn } from "@/lib/utils";

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

/** Client-side search, date/status/stack filtering, sorting, and progressive pagination across projects. */
export function ProjectSearch({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [selectedStack, setSelectedStack] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<ProjectSortKey>("default");
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

  // Reset pagination when search, filters or sort changes
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${query}|${selectedStack}|${selectedStatus}|${selectedYear}|${sortBy}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setVisibleCount(PROJECTS_PER_PAGE);
  }

  // Extract all unique stack technologies, ordered by frequency
  const stackCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      for (const tech of project.stack ?? []) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
    );
  }, [projects]);

  // Extract unique statuses with counts
  const statusCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      if (project.status) {
        counts.set(project.status, (counts.get(project.status) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);

  // Extract unique years from project start and end dates
  const yearCounts = useMemo(() => {
    const counts = new Map<string, number>();
    let ongoingCount = 0;

    for (const project of projects) {
      if (!project.period?.end) {
        ongoingCount++;
      }
      if (project.period?.start) {
        const startYear = new Date(project.period.start).getFullYear().toString();
        if (!isNaN(Number(startYear))) {
          counts.set(startYear, (counts.get(startYear) ?? 0) + 1);
        }
      }
    }

    const sortedYears = [...counts.entries()].sort(
      (a, b) => Number(b[0]) - Number(a[0]),
    );

    if (ongoingCount > 0) {
      return [["ongoing", ongoingCount], ...sortedYears] as [string, number][];
    }
    return sortedYears;
  }, [projects]);

  // Filter projects by search query, tech stack, status, and date/year
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      // Status filter
      if (selectedStatus && project.status !== selectedStatus) {
        return false;
      }

      // Year filter (started in year or ongoing)
      if (selectedYear) {
        if (selectedYear === "ongoing") {
          if (project.period?.end) return false;
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

      // Stack filter
      if (
        selectedStack &&
        !(project.stack ?? []).some(
          (tech) => tech.toLowerCase() === selectedStack.toLowerCase(),
        )
      ) {
        return false;
      }

      // Search query filter
      if (!q) return true;
      return (
        project.name.toLowerCase().includes(q) ||
        project.tagline?.toLowerCase().includes(q) ||
        project.description?.toLowerCase().includes(q) ||
        project.role?.toLowerCase().includes(q) ||
        (project.stack ?? []).some((tech) => tech.toLowerCase().includes(q))
      );
    });
  }, [projects, query, selectedStack, selectedStatus, selectedYear]);

  // Sort filtered projects
  const sorted = useMemo(() => {
    const list = [...filtered];
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
        return list;
    }
  }, [filtered, sortBy]);

  const visibleProjects = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  const hasActiveFilters = Boolean(
    query || selectedStack || selectedStatus || selectedYear,
  );

  const clearFilters = () => {
    setQuery("");
    setSelectedStack(null);
    setSelectedStatus(null);
    setSelectedYear(null);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Sort */}
      <div className="list-toolbar">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects, stack, role…"
          aria-label="Search projects"
        />

        <div className="flex items-center gap-2">
          <SortSelect
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={setSortBy}
            label="Sort"
            aria-label="Sort projects"
          />
        </div>
      </div>

      {/* Filter Row: Clean Status tabs on left, Date & Stack dropdowns on right */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-hairline pb-4">
        {/* Status segmented pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedStatus(null)}
            className={cn(
              "px-3 py-1 text-small font-medium rounded-sm transition-colors cursor-pointer",
              selectedStatus === null
                ? "bg-brand text-on-brand"
                : "text-fg-muted hover:text-fg hover:bg-surface-hover",
            )}
          >
            All <span className="font-mono text-label opacity-75">{projects.length}</span>
          </button>
          {statusCounts.map(([status, count]) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                setSelectedStatus(selectedStatus === status ? null : status)
              }
              className={cn(
                "px-3 py-1 text-small font-medium rounded-sm transition-colors cursor-pointer",
                selectedStatus === status
                  ? "bg-brand text-on-brand"
                  : "text-fg-muted hover:text-fg hover:bg-surface-hover",
              )}
            >
              {humanise(status)}{" "}
              <span className="font-mono text-label opacity-75">{count}</span>
            </button>
          ))}
        </div>

        {/* Date & Stack Selects */}
        <div className="flex items-center gap-2">
          {yearCounts.length > 0 && (
            <SortSelect
              value={selectedYear ?? "all"}
              options={[
                { value: "all", label: "All dates" },
                ...yearCounts.map(([year, count]) => ({
                  value: year,
                  label: year === "ongoing" ? `Ongoing (${count})` : `${year} (${count})`,
                })),
              ]}
              onChange={(val) => setSelectedYear(val === "all" ? null : val)}
              label="Date"
              aria-label="Filter by date"
            />
          )}

          {stackCounts.length > 0 && (
            <SortSelect
              value={selectedStack ?? "all"}
              options={[
                { value: "all", label: "All stack" },
                ...stackCounts.slice(0, 15).map(([tech, count]) => ({
                  value: tech,
                  label: `${tech} (${count})`,
                })),
              ]}
              onChange={(val) => setSelectedStack(val === "all" ? null : val)}
              label="Tech"
              aria-label="Filter by technology"
            />
          )}
        </div>
      </div>

      {/* Active Filter Bar (shown only when filters or query exist) */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-4 font-mono text-small text-fg-muted">
          <span>
            Showing <strong className="text-fg">{sorted.length}</strong> of{" "}
            {projects.length} Projects
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="text-brand hover:underline cursor-pointer"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Results or Empty State */}
      {sorted.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No projects match your search"
            hint={
              query
                ? `No projects matched "${query}". Try adjusting your filters.`
                : "No projects match the selected criteria."
            }
          >
            {hasActiveFilters && (
              <div className="mt-4">
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
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
              total={sorted.length}
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
