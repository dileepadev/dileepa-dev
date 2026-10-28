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
 * A homepage section (v2.1.0 draft).
 *
 * The header borrows the terminal profile's section rule - `▍ About ────` in
 * `curl -L dileepa.dev` - as a marker line: the section's name in mono, then a
 * hairline to the edge, then an optional count. Under it the section's own
 * sentence is the H2, set large. The marker is the same word the nav uses, so
 * "Work" in the nav lands on a line that says Work.
 */
export function IndexSection({
  id,
  label,
  title,
  intro,
  meta,
  children,
}: {
  id: string;
  label: string;
  title?: string;
  intro?: string;
  /** A count or note at the end of the marker rule, e.g. "4 roles". */
  meta?: string;
  children?: ReactNode;
}) {
  return (
    <Section id={id}>
      <div className="container">
        <header className="section-head">
          <p className="section-marker">
            <span className="section-marker-name">{label}</span>
            <span className="section-marker-rule" aria-hidden="true" />
            {meta && <span className="section-marker-meta">{meta}</span>}
          </p>
          {title && <h2 className="section-title">{title}</h2>}
          {intro && <p className="section-intro">{intro}</p>}
        </header>
        {children}
      </div>
    </Section>
  );
}

/**
 * A mono `--brand` label, an H2, and an intro in `--fg-muted`.
 *
 * The label carries the accent and the heading stays `--fg` - design system §6.
 * Accenting the heading too would put two accented elements in one block, which
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
 * A subsection inside a section - communities, events, posts, videos.
 *
 * The title is `--text-small` at weight 700, sentence case, marked with a 2px
 * rule in the accent, which is spent on the rule rather than the text - the words
 * stay `--fg`, so the block has one accented element and it is the rule.
 *
 * It is a `<span>`, not a heading, on purpose. A section that groups several
 * lists would otherwise put an `h3` between its `h2` and the item titles that
 * are already `h3`, and the outline would have to gain a level to describe
 * something the page does not treat as a level.
 */
export function Subsection({
  id,
  title,
  note,
  icon,
  children,
}: {
  id?: string;
  title: string;
  note?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div id={id} className="subsection">
      <div className={cn("subsection-title", icon && "has-icon")}>
        {icon && (
          <span
            className="subsection-icon shrink-0 text-brand"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        <span>{title}</span>
      </div>
      {note && <p className="subsection-note">{note}</p>}
      {children}
    </div>
  );
}
