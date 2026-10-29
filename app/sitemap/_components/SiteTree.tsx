"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Code2,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Hash,
  Rss,
  Tag,
} from "lucide-react";
import { Button, SearchInput, ToggleGroup } from "@/components/ui";
import { cn } from "@/lib/utils";
import { matchesTokens, searchTokens } from "@/lib/listing";
import type { PageSummary } from "@/lib/constants";

export interface TreeNode {
  id: string;
  name: string;
  path: string;
  title?: string;
  type:
    | "root"
    | "folder"
    | "section"
    | "page"
    | "post"
    | "project"
    | "event"
    | "tag"
    | "feed"
    | "system"
    | "error";
  badge?: string;
  children?: TreeNode[];
  isExternal?: boolean;
}

interface SiteTreeProps {
  tree: TreeNode;
  pagesList?: PageSummary[];
}

function getNodeIcon(node: TreeNode, isOpen: boolean) {
  if (node.children && node.children.length > 0) {
    return isOpen ? (
      <FolderOpen className="h-4 w-4 text-brand shrink-0" aria-hidden="true" />
    ) : (
      <Folder className="h-4 w-4 text-brand shrink-0" aria-hidden="true" />
    );
  }

  switch (node.type) {
    case "section":
      return (
        <Hash
          className="h-3.5 w-3.5 text-fg-muted shrink-0"
          aria-hidden="true"
        />
      );
    case "post":
      return (
        <FileText
          className="h-3.5 w-3.5 text-fg-muted shrink-0"
          aria-hidden="true"
        />
      );
    case "project":
      return (
        <Code2
          className="h-3.5 w-3.5 text-fg-muted shrink-0"
          aria-hidden="true"
        />
      );
    case "event":
      return (
        <Calendar
          className="h-3.5 w-3.5 text-fg-muted shrink-0"
          aria-hidden="true"
        />
      );
    case "tag":
      return (
        <Tag
          className="h-3.5 w-3.5 text-fg-muted shrink-0"
          aria-hidden="true"
        />
      );
    case "feed":
      return (
        <Rss className="h-3.5 w-3.5 text-brand shrink-0" aria-hidden="true" />
      );
    case "system":
      return (
        <FileCode
          className="h-3.5 w-3.5 text-fg-muted shrink-0"
          aria-hidden="true"
        />
      );
    case "error":
      return (
        <AlertCircle
          className="h-3.5 w-3.5 text-error shrink-0"
          aria-hidden="true"
        />
      );
    default:
      return (
        <FileText
          className="h-3.5 w-3.5 text-fg-muted shrink-0"
          aria-hidden="true"
        />
      );
  }
}

function filterNode(node: TreeNode, tokens: string[]): TreeNode | null {
  if (tokens.length === 0) return node;

  const isSelfMatch = matchesTokens(
    [node.name, node.path, node.title, node.badge],
    tokens,
  );

  if (!node.children || node.children.length === 0) {
    return isSelfMatch ? node : null;
  }

  const matchingChildren: TreeNode[] = [];
  for (const child of node.children) {
    const matched = filterNode(child, tokens);
    if (matched) matchingChildren.push(matched);
  }

  if (isSelfMatch || matchingChildren.length > 0) {
    return {
      ...node,
      children:
        isSelfMatch && matchingChildren.length === 0
          ? node.children
          : matchingChildren,
    };
  }

  return null;
}

function countNodes(node: TreeNode): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

function TreeBranch({
  node,
  openMap,
  toggleOpen,
  searchActive,
}: {
  node: TreeNode;
  openMap: Record<string, boolean>;
  toggleOpen: (id: string) => void;
  searchActive: boolean;
}) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isOpen = searchActive ? true : Boolean(openMap[node.id]);

  return (
    <div className="relative font-mono text-small">
      {/* Branch line item */}
      <div
        className={cn(
          "group flex items-center gap-2 py-1.5 px-2 rounded-row transition-colors duration-150",
          "hover:bg-surface-hover",
        )}
      >
        {/* Toggle chevron or leaf indent */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggleOpen(node.id)}
            className="p-0.5 -ml-1 text-fg-muted hover:text-brand cursor-pointer rounded-full transition-colors"
            aria-label={isOpen ? "Collapse branch" : "Expand branch"}
          >
            {isOpen ? (
              <ChevronDown
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            ) : (
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
            )}
          </button>
        ) : (
          <span className="w-3.5 shrink-0" aria-hidden="true" />
        )}

        {/* Node Icon */}
        <span className="shrink-0">{getNodeIcon(node, isOpen)}</span>

        {/* Path / Name Link */}
        <Link
          href={node.path}
          className="inline-flex items-baseline gap-2 flex-wrap min-w-0 text-fg hover:text-fg-muted transition-colors"
        >
          <span className="font-medium text-fg group-hover:text-fg-muted transition-colors [overflow-wrap:anywhere]">
            {node.name}
          </span>
          {node.title && (
            <span className="text-fg-muted text-label font-normal min-w-0">
              {node.title}
            </span>
          )}
        </Link>

        {/* Badge / Type tag */}
        {node.badge && (
          <span className="chip ml-auto shrink-0 hidden sm:inline-block">
            {node.badge}
          </span>
        )}
      </div>

      {/* Children branches */}
      {hasChildren && isOpen && (
        <div className="pl-4 sm:pl-6 ml-3 sm:ml-4 border-l border-border-strong/70 mt-0.5 space-y-0.5">
          {node.children!.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              openMap={openMap}
              toggleOpen={toggleOpen}
              searchActive={searchActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteTree({ tree, pagesList }: SiteTreeProps) {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "pages">("tree");
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({
    root: true,
    "root/projects": true,
    "root/events": true,
    "root/blog": true,
    "root/blog/tags": false,
  });

  const tokens = useMemo(() => searchTokens(query), [query]);
  const searchActive = tokens.length > 0;

  const filteredTree = useMemo(() => {
    if (!searchActive) return tree;
    return filterNode(tree, tokens) ?? { ...tree, children: [] };
  }, [tree, tokens, searchActive]);

  const visibleCount = useMemo(() => {
    return countNodes(filteredTree);
  }, [filteredTree]);

  const filteredPages = useMemo(() => {
    if (!pagesList) return [];
    if (!searchActive) return pagesList;
    return pagesList.filter((page) =>
      matchesTokens(
        [
          page.path,
          page.label,
          page.title,
          page.intro,
          page.description,
          page.badge,
        ],
        tokens,
      ),
    );
  }, [pagesList, tokens, searchActive]);

  function toggleOpen(id: string) {
    setOpenMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function expandAll() {
    const next: Record<string, boolean> = {};
    function collect(node: TreeNode) {
      if (node.children && node.children.length > 0) {
        next[node.id] = true;
        node.children.forEach(collect);
      }
    }
    collect(tree);
    setOpenMap(next);
  }

  function collapseAll() {
    setOpenMap({ root: true });
  }

  return (
    <div className="space-y-6">
      {/* Controls: the same search field and action buttons as every other
          listing page, then the view switch and the tree actions. */}
      <SearchInput
        value={query}
        onChange={setQuery}
        name="filter"
        placeholder={
          viewMode === "pages"
            ? "Filter pages… (e.g. blog, projects, legal)"
            : "Filter routes or slugs… (e.g. agent, blog, projects)"
        }
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {pagesList && pagesList.length > 0 && (
            <ToggleGroup
              label="View"
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: "tree", label: "Tree view" },
                { value: "pages", label: "Pages list" },
              ]}
            />
          )}
          {searchActive && (
            <span className="count-badge inline-flex items-center gap-1.5 font-mono text-small text-fg-muted px-2.5 py-1 shrink-0">
              <span className="font-medium text-fg">
                {viewMode === "pages" ? filteredPages.length : visibleCount}
              </span>
              <span>matched</span>
            </span>
          )}
        </div>
        {viewMode === "tree" && (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={expandAll}>
              Expand all
            </Button>
            <Button variant="secondary" size="sm" onClick={collapseAll}>
              Collapse all
            </Button>
          </div>
        )}
      </div>

      {/* Content container styled like a developer console */}
      <div className="tile p-4 sm:p-6 overflow-x-auto">
        <div className="mb-4 pb-3 border-b border-border-strong/60 flex items-center justify-between font-mono text-label text-fg-muted">
          <span className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-brand animate-pulse"
              aria-hidden="true"
            />
            <span>
              {viewMode === "pages"
                ? "dileepa.dev standalone pages"
                : "dileepa.dev route tree"}
            </span>
          </span>
          <span>
            {viewMode === "pages"
              ? `${filteredPages.length} pages`
              : "HTTP GET / App Router"}
          </span>
        </div>

        {viewMode === "pages" ? (
          <ul className="tile-grid">
            {filteredPages.map((page) => (
              <li key={page.key} className="tile-card">
                <div className="tile-meta">
                  <span>{page.path}</span>
                  <span className="tile-pill">{page.badge}</span>
                </div>
                <h3 className="tile-title">
                  <Link href={page.path} className="text-link">
                    {page.title}
                  </Link>
                </h3>
                <p className="tile-desc">{page.intro || page.description}</p>
              </li>
            ))}
            {filteredPages.length === 0 && (
              <li className="col-span-full py-8 text-center font-mono text-small text-fg-muted">
                No pages matched &ldquo;{query}&rdquo;
              </li>
            )}
          </ul>
        ) : (
          /* The interactive tree */
          <div>
            <TreeBranch
              node={filteredTree}
              openMap={openMap}
              toggleOpen={toggleOpen}
              searchActive={searchActive}
            />
          </div>
        )}
      </div>
    </div>
  );
}
