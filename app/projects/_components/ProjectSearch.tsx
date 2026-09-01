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
  StatusBadge,
  type SortOption,
} from "@/components/ui";
import type { Project } from "@/lib/api-types";
import { formatMonth, humanise, year } from "@/lib/format";
import {
  buildFacets,
  compareDate,
  compareText,
  type FacetSpec,
  matchesTokens,
  searchTokens,
  toOptions,
} from "@/lib/listing";

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

/** The synthetic date value for a project that has not finished. */
const ONGOING = "ongoing";

/** A project with no end, or one still marked active, is still running. */
function isOngoing(project: Project): boolean {
  return !project.period?.end || project.status === "active";
}

/**
 * The filterable dimensions, and how a project is filed under each.
 *
 * A project spanning 2023–2025 is filed under all three years so a searcher
 * looking for work active in 2024 finds it, rather than only matching the
 * boundary endpoints.
 */
const FACETS: FacetSpec<Project>[] = [
  { key: "status", values: (project) => [project.status] },
  {
    key: "date",
    values: (project) => {
      const startYear = year(project.period?.start);
      const endYear =
        year(project.period?.end) ??
        (isOngoing(project) ? new Date().getUTCFullYear() : startYear);
      const result: (string | null)[] = [isOngoing(project) ? ONGOING : null];
      if (startYear !== null) {
        const end = endYear ?? startYear;
        for (let y = startYear; y <= end; y++) {
          result.push(String(y));
        }
      }
      return result;
    },
  },
  { key: "stack", values: (project) => project.stack ?? [] },
];

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

  // Step 1: Search
  const searchedProjects = useMemo(() => {
    const tokens = searchTokens(query);
    if (tokens.length === 0) return projects;

    return projects.filter((project) =>
      matchesTokens(
        [
          project.name,
          project.tagline,
          project.description,
          project.role,
          // Both forms of the status: the row shows "In progress" while the
          // record holds `in_progress`, and a reader types what they can see.
          project.status,
          humanise(project.status),
          ...(project.stack ?? []),
        ],
        tokens,
      ),
    );
  }, [projects, query]);

  // Step 2: Filter, counting each dimension against the rest
  const { counts, matched: filteredProjects } = useMemo(
    () =>
      buildFacets(searchedProjects, FACETS, {
        status: selectedStatus,
        date: selectedYear,
        stack: selectedStack,
      }),
    [searchedProjects, selectedStatus, selectedYear, selectedStack],
  );

  const statusOptions: FilterOption[] = useMemo(
    () => toOptions(counts.status, { label: humanise, keep: selectedStatus }),
    [counts.status, selectedStatus],
  );

  const yearOptions: FilterOption[] = useMemo(
    () =>
      toOptions(counts.date, {
        label: (value) => (value === ONGOING ? "Ongoing" : value),
        order: "year",
        keep: selectedYear,
      }),
    [counts.date, selectedYear],
  );

  const stackOptions: FilterOption[] = useMemo(
    () => toOptions(counts.stack, { limit: 20, keep: selectedStack }),
    [counts.stack, selectedStack],
  );

  // Step 3: Sort
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];

    switch (sortBy) {
      case "newest":
        return list.sort((a, b) =>
          compareDate(a.period?.start, b.period?.start, "newest"),
        );
      case "oldest":
        return list.sort((a, b) =>
          compareDate(a.period?.start, b.period?.start, "oldest"),
        );
      case "name-asc":
        return list.sort((a, b) => compareText(a.name, b.name));
      case "name-desc":
        return list.sort((a, b) => compareText(b.name, a.name));
      case "default":
      default:
        return list;
    }
  }, [filteredProjects, sortBy]);

  // Step 4: Paginate
  const visibleProjects = sortedProjects.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProjects.length;

  const hasActiveFilters = Boolean(
    query.trim() || selectedStatus || selectedYear || selectedStack,
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
        label: `Date: ${selectedYear === ONGOING ? "Ongoing" : selectedYear}`,
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
                headingLevel={2}
                title={project.name}
                href={`/projects/${project.slug}`}
                description={project.tagline || project.description}
                meta={
                  <>
                    {project.status === "active" ? (
                      <StatusBadge>Active</StatusBadge>
                    ) : (
                      <Chip>{humanise(project.status)}</Chip>
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
