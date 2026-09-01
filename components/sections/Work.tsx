import { FolderGit2, Terminal } from "lucide-react";
import {
  Chip,
  Container,
  Entry,
  EntryList,
  Item,
  ItemList,
  Section,
  SectionHeading,
  StatusBadge,
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
    <Section id="work">
      <Container>
        <SectionHeading {...SECTIONS.work} />

        {experiences.length > 0 && (
          <EntryList>
            {experiences.map((item) => (
              <Entry
                key={item.id}
                date={item.period}
                title={item.title}
                org={item.company}
                orgUrl={item.url || undefined}
                description={item.description}
              />
            ))}
          </EntryList>
        )}

        {tools.length > 0 && (
          <div className="mt-12">
            <Subsection
              {...SUBSECTIONS.tools}
              icon={<Terminal className="h-4 w-4" />}
            >
              <div className="stack">
                {tools.map((tool) => (
                  <Chip key={tool.id}>{tool.name}</Chip>
                ))}
              </div>
            </Subsection>
          </div>
        )}

        {projects.length > 0 && (
          <div className="mt-12">
            <Subsection
              {...SUBSECTIONS.projects}
              icon={<FolderGit2 className="h-4 w-4" />}
            >
              <ItemList>
                {projects.map((project) => (
                  <Item
                    key={project.id}
                    title={project.name}
                    href={`/projects/${project.slug}`}
                    description={project.tagline || project.description}
                    meta={
                      <>
                        {project.status === "active" ? (
                          <StatusBadge>Active</StatusBadge>
                        ) : (
                          <Chip>{humanise(project.status)}</Chip>
                        )}
                        {project.role && (
                          <span className="font-medium text-fg">
                            {project.role}
                          </span>
                        )}
                      </>
                    }
                  >
                    {(project.stack ?? []).length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 mt-2">
                        {(project.stack ?? []).slice(0, 4).map((tech) => (
                          <li key={tech}>
                            <Chip>{tech}</Chip>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Item>
                ))}
              </ItemList>
              <ViewAll href="/projects">All projects</ViewAll>
            </Subsection>
          </div>
        )}
      </Container>
    </Section>
  );
}

export function EducationSection({ educations }: { educations: Education[] }) {
  if (educations.length === 0) return null;

  return (
    <Section id="education">
      <Container>
        <SectionHeading {...SECTIONS.education} />
        <EntryList>
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
      </Container>
    </Section>
  );
}
