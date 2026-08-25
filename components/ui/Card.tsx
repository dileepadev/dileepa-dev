import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** When set the whole card is a link and takes the hover treatment. */
  href?: string;
}

const base = "block rounded-lg border border-border-strong bg-bg-surface p-6";

// The one hover in the system: the surface lifts a step and the border warms
// to the accent. No shadow, no scale, no ring — a 1px brand ring sitting on a
// 1px brand border drew a 2px outline, which made a card the loudest hover on
// a page where a chip and a button used the same idea more quietly.
const interactive =
  "transition-[background-color,border-color] duration-[160ms] ease-brand " +
  "hover:border-brand hover:bg-surface-hover " +
  "focus-visible:border-brand focus-visible:bg-surface-hover";

export function Card({ children, className, href }: CardProps) {
  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(base, interactive, className)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(base, interactive, className)}>
        {children}
      </Link>
    );
  }

  return <div className={cn(base, className)}>{children}</div>;
}
