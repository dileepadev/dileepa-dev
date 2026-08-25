"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "./Button";

interface LoadMoreProps {
  /** Number of items currently shown */
  shown: number;
  /** Total number of items in the current filtered list */
  total: number;
  /** Callback to load the next batch */
  onLoadMore: () => void;
  /** Number of items that will be loaded in the next batch */
  batchSize?: number;
  /** Optional callback to show all items at once */
  onShowAll?: () => void;
  className?: string;
}

/**
 * Reusable progressive "Load more" control with visual progress bar and count.
 */
export function LoadMore({
  shown,
  total,
  onLoadMore,
  batchSize = 10,
  onShowAll,
  className,
}: LoadMoreProps) {
  if (shown >= total) return null;

  const remaining = total - shown;
  const nextBatch = Math.min(remaining, batchSize);
  const percentage = Math.min(100, Math.round((shown / total) * 100));

  return (
    <div className={`mt-10 flex flex-col items-center gap-3 ${className ?? ""}`}>
      {/* Progress count & bar */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="font-mono text-small text-fg-muted">
          Showing <span className="font-medium text-fg">{shown}</span> of{" "}
          <span className="font-medium text-fg">{total}</span>
        </p>
        <div
          className="h-1 w-36 overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-brand transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-1 flex items-center gap-3">
        <Button
          variant="secondary"
          onClick={onLoadMore}
          className="inline-flex items-center gap-2"
        >
          <span>Load more ({nextBatch})</span>
          <ArrowDown
            className="h-3.5 w-3.5 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>

        {onShowAll && remaining > nextBatch && (
          <button
            type="button"
            onClick={onShowAll}
            className="cursor-pointer border-none bg-transparent px-2 py-1 font-mono text-small text-fg-muted transition-colors hover:text-brand"
          >
            Show all
          </button>
        )}
      </div>
    </div>
  );
}
