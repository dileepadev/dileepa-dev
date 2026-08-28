"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * The brand lockup: `dileepadev /.`
 *
 * The wordmark stays neutral and only the `/.` is emerald — the two are never
 * swapped. The mark is decorative, so the accessible name comes from the
 * anchor's `aria-label` and the mark itself is hidden from assistive tech.
 *
 * The dot is an `::after` on `.mark` so the pair reads as `/.` and not `/ .`.
 * The `.lockup` wrapper carries the reference's spacing and upright 700 mark
 * conforming strictly to the brand weight scale (400, 500, 700 only).
 */
export function Lockup({
  className,
  href = "/#top",
}: {
  className?: string;
  href?: string;
}) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      pathname === "/" &&
      (href === "/" || href === "/#top" || href === "#top")
    ) {
      e.preventDefault();
      const topEl = document.getElementById("top");
      if (topEl) {
        topEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-label="dileepadev — home"
      className={cn("lockup", className)}
    >
      <span className="wordmark">dileepadev</span>
      <span className="mark" aria-hidden="true">
        /
      </span>
    </Link>
  );
}
