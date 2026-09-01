import { ReactNode } from "react";
import { Chip } from "./Badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * A clean status badge conforming to the chip design specification,
 * featuring a solid emerald dot indicator.
 */
export function StatusBadge({ children, className }: StatusBadgeProps) {
  return (
    <Chip className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="h-1.5 w-1.5 rounded-full bg-brand shrink-0"
        aria-hidden="true"
      />
      <span>{children}</span>
    </Chip>
  );
}
