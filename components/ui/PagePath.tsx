import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PagePathProps {
  path: string;
  className?: string;
}

/**
 * PagePath
 *
 * Displays a relative page or item route (e.g. `./blog/2026-08-16-part-6-multi-agent-systems`)
 * as a subtle, clickable mono link navigating directly to the corresponding page.
 */
export function PagePath({ path, className }: PagePathProps) {
  if (!path) return null;

  // Normalize: strip leading `./` or `/` to get the clean relative path
  const cleanPath = path.trim().replace(/^\.\//, "").replace(/^\/+/, "");
  const href = `/${cleanPath}`;
  const display = `./${cleanPath}`;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-sm font-mono text-label normal-case tracking-normal",
        "text-fg-muted transition-colors duration-150",
        "hover:text-brand hover:underline underline-offset-4",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand",
        className,
      )}
      aria-label={`Path: ${display}`}
    >
      <span>{display}</span>
    </Link>
  );
}
