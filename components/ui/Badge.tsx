import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  /**
   * `filled` is the one emerald variant and is reserved - one per surface.
   * Everything else shares a single treatment, because with a single accent
   * colour badges are told apart by their label, not by hue.
   */
  variant?: "default" | "filled";
  /**
   * Only interactive badges (e.g. navigation links, filter triggers)
   * get cursor-pointer and hover styling. Static badges remain calm.
   */
  interactive?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  interactive = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge inline-block rounded-sm border px-3 py-1 text-label font-medium tracking-[0.01em]",
        interactive
          ? "cursor-pointer transition-[background-color,border-color,color] duration-[160ms] ease-brand hover:border-brand hover:bg-surface-hover hover:text-fg"
          : "cursor-default",
        variant === "filled"
          ? "badge-filled border-transparent bg-brand-fill text-on-brand"
          : "border-border-strong bg-bg-surface text-fg-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface ChipProps {
  children: ReactNode;
  /**
   * Only interactive chips (e.g. clickable tags, filter buttons)
   * get cursor-pointer and hover styling. Static chips (tech stack, status) remain calm.
   */
  interactive?: boolean;
  className?: string;
}

/** A stack chip: mono, with hover reserved strictly for interactive targets. */
export function Chip({
  children,
  interactive = false,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "chip inline-block rounded-sm border border-border-strong bg-bg-surface",
        "px-3 py-1 font-mono text-label/[1] tracking-[0.01em] text-fg-muted",
        interactive
          ? "cursor-pointer transition-[background-color,border-color,color] duration-[160ms] ease-brand hover:border-brand hover:bg-surface-hover hover:text-fg"
          : "cursor-default",
        className,
      )}
    >
      {children}
    </span>
  );
}
