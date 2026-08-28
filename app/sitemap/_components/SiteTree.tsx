"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ChevronDown,
  ChevronRight,
  Code2,
  FileCode,
  FileText,
  Folder,
  FolderOpen,
  Hash,
  Layers,
  Rss,
  Search,
  Tag,
  X,
} from "lucide-react";
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
    | "system";
  badge?: string;
  children?: TreeNode[];
  isExternal?: boolean;
}

interface SiteTreeProps {
  tree: TreeNode;
  totalRoutes: number;
  pagesList?: PageSummary[];
}

function getNodeIcon(node: TreeNode, isOpen: boolean) {
  if (node.children && node.children.length > 0) {
    return isOpen ? (
      <FolderOpen className="h-4 w-4 text-brand shrink-0" aria-hidden="true" />
    ) : (
      <Folder className="h-4 w-4 text-brand/80 shrink-0" aria-hidden="true" />
    );
  }

  switch (node.type) {
    case "section":
      return <Hash className="h-3.5 w-3.5 text-fg-muted shrink-0" aria-hidden="true" />;
    case "post":
      return <FileText className="h-3.5 w-3.5 text-fg-muted shrink-0" aria-hidden="true" />;
    case "project":
      return <Code2 className="h-3.5 w-3.5 text-fg-muted shrink-0" aria-hidden="true" />;
    case "event":
      return <Calendar className="h-3.5 w-3.5 text-fg-muted shrink-0" aria-hidden="true" />;
    case "tag":
      return <Tag className="h-3.5 w-3.5 text-fg-muted shrink-0" aria-hidden="true" />;
    case "feed":
      return <Rss className="h-3.5 w-3.5 text-brand shrink-0" aria-hidden="true" />;
    case "system":
      return <FileCode className="h-3.5 w-3.5 text-fg-muted shrink-0" aria-hidden="true" />;
    default:
      return <FileText className="h-3.5 w-3.5 text-fg-muted shrink-0" aria-hidden="true" />;
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
      children: isSelfMatch && matchingChildren.length === 0 ? node.children : matchingChildren,
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
          "group flex items-center gap-2 py-1.5 px-2 rounded-sm transition-colors duration-150",
          "hover:bg-surface-hover",
        )}
      >
        {/* Toggle chevron or leaf indent */}
        {hasChildren ? (
          <button
            type="button"
            onClick={() => toggleOpen(node.id)}
            className="p-0.5 -ml-1 text-fg-muted hover:text-brand cursor-pointer rounded transition-colors"
            aria-label={isOpen ? "Collapse branch" : "Expand branch"}
          >
            {isOpen ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
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
          className="inline-flex items-baseline gap-2 flex-wrap min-w-0 text-fg hover:text-brand transition-colors"
        >
          <span className="font-medium text-fg group-hover:text-brand transition-colors">
            {node.name}
          </span>
          {node.title && (
            <span className="text-fg-muted text-xs font-normal truncate max-w-[280px] sm:max-w-md">
              {node.title}
            </span>
          )}
        </Link>

        {/* Badge / Type tag */}
        {node.badge && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-mono text-fg-muted border border-border-strong bg-bg shrink-0 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
            {node.badge}
          </span>
        )}

        {/* Hover arrow cue */}
        <ArrowRight
          className="h-3 w-3 shrink-0 text-brand opacity-0 -translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0"
          aria-hidden="true"
        />
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

export function SiteTree({ tree, totalRoutes, pagesList }: SiteTreeProps) {
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
      {/* Controls: Search, view mode, stats & expand/collapse */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              viewMode === "pages"
                ? "Filter pages… (e.g. blog, projects, legal)"
                : "Filter routes or slugs… (e.g. agent, blog, projects)"
            }
            className="w-full pl-9 pr-8 py-2 font-mono text-small rounded-sm border border-border-strong bg-bg-surface text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-fg-muted hover:text-fg rounded cursor-pointer"
              aria-label="Clear filter"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Actions & counter */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View mode switcher */}
          {pagesList && pagesList.length > 0 && (
            <div className="inline-flex items-center rounded-sm border border-border-strong overflow-hidden text-xs font-mono">
              <button
                type="button"
                onClick={() => setViewMode("tree")}
                className={cn(
                  "px-2.5 py-1.5 transition-colors cursor-pointer border-r border-border-strong",
                  viewMode === "tree"
                    ? "bg-brand text-bg font-medium"
                    : "bg-bg-surface hover:bg-surface-hover hover:text-brand text-fg-muted",
                )}
              >
                Tree view
              </button>
              <button
                type="button"
                onClick={() => setViewMode("pages")}
                className={cn(
                  "px-2.5 py-1.5 transition-colors cursor-pointer",
                  viewMode === "pages"
                    ? "bg-brand text-bg font-medium"
                    : "bg-bg-surface hover:bg-surface-hover hover:text-brand text-fg-muted",
                )}
              >
                Pages list
              </button>
            </div>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border border-border-strong bg-bg-surface font-mono text-xs text-fg-muted">
            <Layers className="h-3.5 w-3.5 text-brand" aria-hidden="true" />
            <span className="font-medium text-fg">
              {viewMode === "pages"
                ? searchActive
                  ? filteredPages.length
                  : (pagesList?.length ?? 0)
                : searchActive
                  ? visibleCount
                  : totalRoutes}
            </span>
            <span>
              {viewMode === "pages"
                ? searchActive
                  ? "matched"
                  : "pages"
                : searchActive
                  ? "matched"
                  : "routes"}
            </span>
          </div>

          {viewMode === "tree" && (
            <div className="inline-flex items-center rounded-sm border border-border-strong overflow-hidden text-xs font-mono">
              <button
                type="button"
                onClick={expandAll}
                className="px-2.5 py-1.5 bg-bg-surface hover:bg-surface-hover hover:text-brand text-fg-muted transition-colors cursor-pointer border-r border-border-strong"
              >
                Expand all
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-2.5 py-1.5 bg-bg-surface hover:bg-surface-hover hover:text-brand text-fg-muted transition-colors cursor-pointer"
              >
                Collapse all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content container styled like a developer console */}
      <div className="rounded-lg border border-border-strong bg-bg-surface p-4 sm:p-6 overflow-x-auto shadow-sm">
        <div className="mb-4 pb-3 border-b border-border-strong/60 flex items-center justify-between font-mono text-xs text-fg-muted">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPages.map((page) => (
              <Link
                key={page.key}
                href={page.path}
                className="group flex flex-col justify-between p-4 rounded-sm border border-border-strong bg-bg hover:border-brand transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-medium text-brand">
                      {page.path}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6875rem] font-mono text-fg-muted border border-border-strong bg-bg-surface shrink-0">
                      {page.badge}
                    </span>
                  </div>
                  <h3 className="font-medium text-fg group-hover:text-brand transition-colors text-sm">
                    {page.title}
                  </h3>
                  <p className="mt-1 text-fg-muted text-xs line-clamp-2">
                    {page.intro || page.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-border-strong/40 flex items-center justify-between text-xs font-mono text-fg-muted group-hover:text-brand">
                  <span>Visit page</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
            {filteredPages.length === 0 && (
              <div className="col-span-full py-8 text-center font-mono text-xs text-fg-muted">
                No pages matched &ldquo;{query}&rdquo;
              </div>
            )}
          </div>
        ) : (
          /* The interactive tree */
          <div className="min-w-[480px]">
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
