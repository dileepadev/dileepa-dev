import type { Metadata } from "next";
import {
  Chip,
  Container,
  EmptyState,
  Item,
  ItemList,
  PagePath,
  Section,
} from "@/components/ui";
import { api } from "@/lib/api";
import { EMPTY_STATES } from "@/lib/constants";
import { humanise } from "@/lib/format";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I have built and keep running, with a write-up for each.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await api.getProjects({ limit: 100 });

  return (
    <Section>
      <Container>
        <div className="mb-2">
          <PagePath path="/projects" />
        </div>
        <div className="section-label">Projects</div>
        <h1>Things I have built</h1>
        <p className="section-intro">
          Each one has a longer write-up: what it does, what it is made of, and
          what I would do differently.
        </p>

        <div className="mt-10">
          {projects.length === 0 ? (
            <EmptyState {...EMPTY_STATES.projects} />
          ) : (
            <ItemList>
              {projects.map((project) => (
                <Item
                  key={project.id}
                  title={project.name}
                  href={`/projects/${project.slug}`}
                  description={project.tagline || project.description}
                  meta={
                    <>
                      <span className="block">{humanise(project.status)}</span>
                      {project.role && (
                        <span className="block">{project.role}</span>
                      )}
                    </>
                  }
                >
                  {(project.stack ?? []).length > 0 && (
                    <ul className="flex flex-wrap gap-2">
                      {(project.stack ?? []).slice(0, 6).map((tech) => (
                        <li key={tech}>
                          <Chip>{tech}</Chip>
                        </li>
                      ))}
                    </ul>
                  )}
                </Item>
              ))}
            </ItemList>
          )}
        </div>
      </Container>
    </Section>
  );
}
