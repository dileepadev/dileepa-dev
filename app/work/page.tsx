import type { Metadata } from "next";
import { WorkContent } from "@/components/sections";
import { ApiOfflinePage, Container, PagePath, Section } from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import { PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: PAGES.work.meta.title,
  description: PAGES.work.meta.description,
  path: "/work",
});

/**
 * Work - roles and the tools behind them (v2.1.0 draft). The projects are
 * at /projects, not repeated here.
 *
 * This was the homepage's Work section. The homepage now keeps the hero,
 * About and Contact and sends a reader here, so the roles get a page of their
 * own instead of sharing one long scroll with everything else. The heading
 * follows the index pages - path, label, title, count - and the body is the
 * section it was, from `WorkContent`.
 */
export default async function WorkPage() {
  const [experiences, tools] = await Promise.all([
    api.getExperiences(),
    api.getTools(),
  ]);
  const roles = experiences.length;

  if (roles === 0 && tools.length === 0) {
    const health = await checkApiHealth();
    if (!health.ok) {
      return <ApiOfflinePage path="/work" />;
    }
  }

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/work" />
            </div>
            <h1>{PAGES.work.title}</h1>
          </div>
          {roles > 0 && (
            <div className="count-badge inline-flex items-center gap-1.5 font-mono text-small text-fg-muted px-2.5 py-1 shrink-0 mt-1">
              <span className="font-medium text-fg">{roles}</span>
              <span>{roles === 1 ? "Role" : "Roles"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">{PAGES.work.intro}</p>

        <WorkContent experiences={experiences} tools={tools} />
      </Container>
    </Section>
  );
}
