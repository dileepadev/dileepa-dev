"use client";

import { useState, useMemo } from "react";
import { Briefcase, Calendar } from "lucide-react";
import {
  Button,
  Chip,
  EmptyState,
  FilterSelect,
  type FilterOption,
  Item,
  ItemList,
  ListingControls,
  type ActiveFilterItem,
  LoadMore,
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
 * Search -> Filter -> Sort pipeline across projects using universal ListingControls.
 */
export function ProjectSearch({ projects }: { projects: Project[] }) {
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

  // Filter options
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

  // Step 1: Search
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

  // Step 2: Filter
  const filteredProjects = useMemo(() => {
    return searchedProjects.filter((project) => {
      if (selectedStatus && project.status !== selectedStatus) {
        return false;
      }

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

      if (selectedStack) {
        const hasTech = (project.stack ?? []).some(
          (tech) => tech.toLowerCase() === selectedStack.toLowerCase(),
        );
        if (!hasTech) return false;
      }

      return true;
    });
  }, [searchedProjects, selectedStatus, selectedYear, selectedStack]);

  // Step 3: Sort
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
        return list;
    }
  }, [filteredProjects, sortBy]);

  // Step 4: Paginate
  const visibleProjects = sortedProjects.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProjects.length;

  const hasActiveFilters = Boolean(
    query || selectedStatus || selectedYear || selectedStack,
  );

  const clearAllFilters = () => {
    setQuery("");
    setSelectedStatus(null);
    setSelectedYear(null);
    setSelectedStack(null);
  };

  const activeFilters: ActiveFilterItem[] = useMemo(() => {
    const list: ActiveFilterItem[] = [];
    if (selectedStatus) {
      list.push({
        key: "status",
        label: `Status: ${humanise(selectedStatus)}`,
        onRemove: () => setSelectedStatus(null),
      });
    }
    if (selectedYear) {
      list.push({
        key: "year",
        label: `Date: ${selectedYear === "ongoing" ? "Ongoing" : selectedYear}`,
        onRemove: () => setSelectedYear(null),
      });
    }
    if (selectedStack) {
      list.push({
        key: "stack",
        label: `Tech: ${selectedStack}`,
        onRemove: () => setSelectedStack(null),
      });
    }
    return list;
  }, [selectedStatus, selectedYear, selectedStack]);

  return (
    <div className="space-y-6">
      <ListingControls
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search projects by name, description, stack, role…"
        filters={
          <>
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
          </>
        }
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOptions={SORT_OPTIONS}
        sortLabel="Sort projects"
        activeFilters={activeFilters}
        onClearAll={clearAllFilters}
        filteredCount={sortedProjects.length}
        totalCount={projects.length}
        itemNoun="Project"
        itemPlural="Projects"
      />

      {sortedProjects.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No projects match your criteria"
            hint={
              hasActiveFilters
                ? "Try adjusting your search or filters to see more projects."
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
                    {project.status === "active" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border border-brand/30 bg-brand/10 text-brand transition-colors duration-150 hover:border-brand hover:bg-brand/20 cursor-default">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" aria-hidden="true" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono text-fg-muted border border-border-strong bg-bg-surface transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
                        {humanise(project.status)}
                      </span>
                    )}
                    {project.role && (
                      <span className="inline-flex items-center gap-1.5 text-fg font-medium">
                        <Briefcase className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                        <span>{project.role}</span>
                      </span>
                    )}
                    {project.period?.start && (
                      <span className="inline-flex items-center gap-1.5 text-fg-muted font-mono text-xs">
                        <Calendar className="h-3 w-3 shrink-0 text-fg-muted" aria-hidden="true" />
                        <span>{formatPeriod(project.period.start, project.period.end)}</span>
                      </span>
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
