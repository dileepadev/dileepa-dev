import { cn } from "@/lib/utils";

/**
 * An empty state says what would appear here and how to make it appear —
 * design system §8. "No results" on its own tells a reader nothing.
 */
export function EmptyState({
  title,
  hint,
  className,
}: {
  title: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-strong bg-bg-surface px-6 py-12 text-center",
        className,
      )}
    >
      <p className="max-w-none text-fg">{title}</p>
      {hint && (
        <p className="mt-2 max-w-none text-small text-fg-muted">{hint}</p>
      )}
    </div>
  );
}
