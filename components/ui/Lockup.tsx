"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * The brand lockup: `@dileepadev` (v2.1.0 draft - was `dileepadev /.`).
 *
 * The handle the owner uses everywhere else, as the logo. The wordmark stays
 * at full contrast and the `@` one step muted - the same two-part split the
 * `/.` had, carried by contrast now that the palette has no hue. The mark is
 * decorative, so the accessible name comes from the anchor's `aria-label`
 * and the mark itself is hidden from assistive tech.
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
      aria-label="dileepadev - home"
      className={cn("lockup", className)}
    >
      <span className="mark" aria-hidden="true">
        @
      </span>
      <span className="wordmark">dileepadev</span>
    </Link>
  );
}
