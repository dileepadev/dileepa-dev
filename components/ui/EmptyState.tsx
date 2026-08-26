import { ReactNode } from "react";
import { FolderSearch } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * An empty state says what would appear here and how to make it appear —
 * design system §8. "No results" on its own tells a reader nothing.
 */
export function EmptyState({
  title,
  hint,
  icon,
  children,
  className,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-strong bg-bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <div className="mb-3 flex justify-center text-fg-muted/60">
        {icon ?? (
          <FolderSearch
            className="h-8 w-8"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
      </div>
      <p className="max-w-none text-fg">{title}</p>
      {hint && (
        <p className="mt-2 max-w-none text-small text-fg-muted">{hint}</p>
      )}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
