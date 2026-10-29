import type { LucideIcon } from "lucide-react";

/**
 * A homepage section's mark (v2.1.0 draft): the section's icon, drawn large
 * as a dotted line on the hero's dot grid, in the panel's top-right corner.
 *
 * The hero sits on engineering paper; each section below keeps a corner of
 * it, with its own subject plotted there - so the scroll reads as one sheet
 * rather than the hero and then a run of plain panels. It is the same Lucide
 * icon the rest of the site draws, so the mark and the icons stay one set.
 * Decoration only: hidden from assistive technology, and hidden where the
 * section is too narrow to keep it clear of the heading.
 */
export function SectionArt({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="section-art" aria-hidden="true">
      <Icon className="section-art-icon" />
    </div>
  );
}
