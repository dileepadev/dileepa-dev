import { Terminal } from "lucide-react";
import { Entry, EntryList } from "@/components/ui";
import type { Education, Experience, Tool } from "@/lib/api-types";
import { SUBSECTIONS } from "@/lib/constants";

/**
 * The /work page's body - roles, then the stack beside them.
 *
 * The open source projects that used to close it have their own page at
 * /projects, so they are not repeated here. It was
 * the homepage's Work section until the homepage became the front door rather
 * than the whole site (v2.1.0 draft); `app/work/page.tsx` gives it its heading,
 * so the headings in here start at `h2`.
 */
export function WorkContent({
  experiences,
  tools,
}: {
  experiences: Experience[];
  tools: Tool[];
}) {
  const hasContent = experiences.length > 0 || tools.length > 0;

  if (!hasContent) return null;

  return (
    <>
      <div className="work-grid mt-10 sm:mt-12">
        {experiences.length > 0 && (
          <EntryList className="timeline">
            {experiences.map((item) => (
              <Entry
                key={item.id}
                date={item.period}
                title={item.title}
                org={item.company}
                orgUrl={item.url || undefined}
                description={item.description}
                // `period` is free text; "Present" is the only signal.
                current={/present/i.test(item.period)}
              />
            ))}
          </EntryList>
        )}

        {tools.length > 0 && (
          <aside className="tools-panel" aria-labelledby="tools-title">
            <div className="tools-panel-head">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              <h2 id="tools-title">{SUBSECTIONS.tools.title}</h2>
            </div>
            {SUBSECTIONS.tools.note && (
              <p className="tools-panel-note">{SUBSECTIONS.tools.note}</p>
            )}
            <ul className="tools-list">
              {tools.map((tool) => (
                <li key={tool.id}>{tool.name}</li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </>
  );
}

/** The /education page's body: one tile per course. Was the homepage section. */
export function EducationContent({ educations }: { educations: Education[] }) {
  if (educations.length === 0) return null;

  return (
    <div className="mt-10 sm:mt-12">
      <EntryList className="entry-grid">
        {educations.map((item) => (
          <Entry
            key={item.id}
            date={item.period}
            title={item.course}
            org={item.institution}
            orgUrl={item.url || undefined}
            description={item.description}
          />
        ))}
      </EntryList>
    </div>
  );
}
