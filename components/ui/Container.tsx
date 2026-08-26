import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The page measure.
 *
 * One width, 1020px, for every surface — `width: min(100% - 2rem, 1020px)`,
 * in `.container`. Nav, footer, and every page share it: a wider page beside
 * a narrower nav reads as two sites, which is what happened when the blog
 * reader alone used a wider variant for its table-of-contents rail.
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
