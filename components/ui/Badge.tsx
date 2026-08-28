import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  /**
   * `filled` is the one emerald variant and is reserved — one per surface.
   * Everything else shares a single treatment, because with a single accent
   * colour badges are told apart by their label, not by hue.
   */
  variant?: "default" | "filled";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "badge inline-block rounded-sm border px-3 py-1 text-label font-medium tracking-[0.01em]",
        "transition-[background-color,border-color,color] duration-[160ms] ease-brand",
        variant === "filled"
          ? "badge-filled border-transparent bg-brand-fill text-on-brand"
          : "border-border-strong bg-bg-surface text-fg-muted hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A stack chip: mono, hovering to a `--brand` border. */
export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "chip inline-block rounded-sm border border-border-strong bg-bg-surface",
        "px-3 py-1 font-mono text-label/[1] tracking-[0.01em] text-fg-muted",
        "transition-[background-color,border-color,color] duration-[160ms] ease-brand",
        "hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default",
        className,
      )}
    >
      {children}
    </span>
  );
}
