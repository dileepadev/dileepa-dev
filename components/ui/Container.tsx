import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page measure.
 *
 * One width for the content of every panel - `width: min(100% - 2.5rem,
 * 1200px)`, in `.container`. Every page shares it: a wider page beside a
 * narrower one reads as two sites.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container", className)}>{children}</div>;
}
