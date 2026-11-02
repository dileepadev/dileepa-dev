import { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionArt } from "./SectionArt";

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
 * A homepage section: its own sentence as the H2, set large, an optional intro,
 * and an optional corner mark - the section's icon on an app-icon tile.
 */
export function IndexSection({
  id,
  title,
  intro,
  art,
  children,
}: {
  id: string;
  title?: string;
  intro?: string;
  /** The section's icon, drawn as its corner mark. */
  art?: LucideIcon;
  children?: ReactNode;
}) {
  return (
    <Section id={id}>
      <div className="container">
        {art && <SectionArt icon={art} />}
        <header className="section-head">
          {title && <h2 className="section-title">{title}</h2>}
          {intro && <p className="section-intro">{intro}</p>}
        </header>
        {children}
      </div>
    </Section>
  );
}

/**
 * A mono label in `--fg-muted`, an H2, and an intro in `--fg-muted`. The label
 * is the least important text over the heading, so it takes the muted step.
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
 * The title is set at the H3 size, weight 500, in `--fg`, with an optional
 * 16px icon before it.
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
