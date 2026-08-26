import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A page section.
 *
 * Every section carries a hairline top border and `--space-16` of vertical
 * padding, so the page reads as a set of rules rather than a stack of boxes.
 * The hero is the exception and does not use this.
 */
export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("section", className)}>
      {children}
    </section>
  );
}

/**
 * A mono `--brand` label, an H2, and an intro in `--fg-muted`.
 *
 * The label carries the accent and the heading stays `--fg` — design system §6.
 * Colouring the heading too would put two emerald elements in one block, which
 * is what stops the accent reading as a signal.
 */
export function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <>
      <div className="section-label">{label}</div>
      <h2>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </>
  );
}

/**
 * A subsection inside a section — communities, events, posts, videos.
 *
 * The title is uppercase, tracked, and marked with a 3px emerald rule. It is
 * the only element in the block that carries the accent.
 */
export function Subsection({
  id,
  title,
  note,
  children,
}: {
  id?: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="subsection">
      <div className="subsection-title">{title}</div>
      {note && <p className="subsection-note">{note}</p>}
      {children}
    </div>
  );
}
