import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * A clean, flat status badge featuring a solid dot indicator.
 */
export function StatusBadge({ children, className }: StatusBadgeProps) {
  return (
    <div className={cn("hero-status-pill", className)}>
      <span className="hero-status-dot" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
