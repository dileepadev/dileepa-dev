import { ReactNode } from "react";
import { Chip } from "./Badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * A clean status badge conforming to the chip design specification,
 * featuring the shared status dot, which pulses like every live status.
 */
export function StatusBadge({ children, className }: StatusBadgeProps) {
  return (
    <Chip className={cn("inline-flex items-center gap-2", className)}>
      <span className="hero-status-dot" aria-hidden="true" />
      <span>{children}</span>
    </Chip>
  );
}
