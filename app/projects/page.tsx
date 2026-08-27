import type { Metadata } from "next";
import { Container, EmptyState, PagePath, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { EMPTY_STATES } from "@/lib/constants";
import { ProjectSearch } from "./_components/ProjectSearch";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I have built and keep running, with a write-up for each.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await api.getProjects({ limit: 100 });
  const total = projects.length;

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/projects" />
            </div>
            <div className="section-label">Projects</div>
            <h1>Things I have built</h1>
          </div>
          {total > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1">
              <span className="font-medium text-fg">{total}</span>
              <span>{total === 1 ? "Project" : "Projects"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">
          Each one has a longer write-up: what it does, what it is made of, and
          what I would do differently.
        </p>

        {total === 0 ? (
          <div className="mt-10">
            <EmptyState {...EMPTY_STATES.projects} />
          </div>
        ) : (
          <ProjectSearch projects={projects} />
        )}
      </Container>
    </Section>
  );
}
