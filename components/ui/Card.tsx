import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** When set the whole card is a link and takes the hover treatment. */
  href?: string;
}

// A tile (v2.1.0 draft): a card on a panel is borderless, on the page
// ground, at the tile radius. It does not change on hover - in v2.1 a card
// is not a button, and the one thing that reacts is its link.
const base = "tile block p-6";

export function Card({ children, className, href }: CardProps) {
  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(base, className)}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cn(base, className)}>
        {children}
      </Link>
    );
  }

  return <div className={cn(base, className)}>{children}</div>;
}
