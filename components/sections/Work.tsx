import Link from "next/link";
import { FolderGit2, Terminal } from "lucide-react";
import {
  Chip,
  Entry,
  EntryList,
  IndexSection,
  Subsection,
  ViewAll,
} from "@/components/ui";
import type { Education, Experience, Project, Tool } from "@/lib/api-types";
import { SECTIONS, SUBSECTIONS } from "@/lib/constants";
import { humanise } from "@/lib/format";

/**
 * Work - roles, then the stack, then the open source.
 *
 * All three are the same question ("what does this person actually do?") asked
 * at three scales, so they share a section rather than each claiming one.
 */
export function Work({
  experiences,
  tools,
  projects,
}: {
  experiences: Experience[];
  tools: Tool[];
  projects: Project[];
}) {
  const hasContent =
    experiences.length > 0 || tools.length > 0 || projects.length > 0;

  if (!hasContent) return null;

  return (
    <IndexSection
      id="work"
      {...SECTIONS.work}
      meta={
        experiences.length > 0
          ? `${experiences.length} ${experiences.length === 1 ? "role" : "roles"}`
          : undefined
      }
    >
      <div className="work-grid">
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
              <h3 id="tools-title">{SUBSECTIONS.tools.title}</h3>
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

      {projects.length > 0 && (
        <div className="mt-20">
          <Subsection
            {...SUBSECTIONS.projects}
            icon={<FolderGit2 className="h-4 w-4" />}
          >
            <ul className="tile-grid">
              {projects.map((project) => (
                <li key={project.id} className="tile-card">
                  <div className="tile-meta">
                    <span>{project.role}</span>
                    <span className="tile-pill">
                      {project.status === "active" && (
                        <span className="hero-status-dot" aria-hidden="true" />
                      )}
                      {humanise(project.status)}
                    </span>
                  </div>
                  <h3 className="tile-title">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-link"
                    >
                      {project.name}
                    </Link>
                  </h3>
                  {(project.tagline || project.description) && (
                    <p className="tile-desc">
                      {project.tagline || project.description}
                    </p>
                  )}
                  {(project.stack ?? []).length > 0 && (
                    <div className="tile-foot">
                      {(project.stack ?? []).slice(0, 5).map((tech) => (
                        <Chip key={tech}>{tech}</Chip>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <ViewAll href="/projects">All projects</ViewAll>
          </Subsection>
        </div>
      )}
    </IndexSection>
  );
}

export function EducationSection({ educations }: { educations: Education[] }) {
  if (educations.length === 0) return null;

  return (
    <IndexSection id="education" {...SECTIONS.education}>
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
    </IndexSection>
  );
}
