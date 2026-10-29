import type { LucideIcon } from "lucide-react";

/**
 * A section's mark as a tile (v2.1.0 draft): the section's Lucide icon, drawn
 * crisp at a fine stroke on a raised rounded-square tile, like an app icon.
 * Nothing on it fades or overlaps, so every edge is sharp - the dotted and
 * extruded drafts before it read as soft against the dot grid.
 */
export function SectionTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="section-tile" aria-hidden="true">
      <Icon />
    </span>
  );
}

/**
 * A homepage section's mark (v2.1.0 draft): the section's icon tile on the
 * hero's dot grid, in the panel's top-right corner.
 *
 * The hero sits on engineering paper; each section below keeps a corner of
 * it, with its own subject set there - so the scroll reads as one sheet
 * rather than the hero and then a run of plain panels. It is the same Lucide
 * icon the rest of the site draws, so the mark and the icons stay one set.
 * Decoration only: hidden from assistive technology, and hidden where the
 * section is too narrow to keep it clear of the heading.
 */
export function SectionArt({ icon }: { icon: LucideIcon }) {
  return (
    <div className="section-art" aria-hidden="true">
      <SectionTile icon={icon} />
    </div>
  );
}
