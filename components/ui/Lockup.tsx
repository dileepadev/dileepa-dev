import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The brand lockup: `dileepadev /.`
 *
 * The wordmark stays neutral and only the `/.` is emerald — the two are never
 * swapped. The mark is decorative, so the accessible name comes from the
 * anchor's `aria-label` and the mark itself is hidden from assistive tech.
 *
 * The dot is an `::after` on `.mark` so the pair reads as `/.` and not `/ .`.
 * The `.lockup` wrapper is what carries the reference's spacing and upright
 * 600 mark; without it the token sheet's italic 700 variant applies.
 */
export function Lockup({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
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
