import type { Metadata } from "next";
import { EducationContent } from "@/components/sections";
import {
  ApiOfflinePage,
  Container,
  KeepExploring,
  PagePath,
  Section,
} from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import { PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: PAGES.education.meta.title,
  description: PAGES.education.meta.description,
  path: "/education",
});

/**
 * Education - one tile per course (v2.1.0 draft).
 *
 * Was the homepage's Education section; see `app/work/page.tsx` for why it
 * moved. Same heading as the index pages, same body as the section. Four
 * records make a short page, so it closes on `KeepExploring` rather than on
 * the footer a screen in.
 */
export default async function EducationPage() {
  const educations = await api.getEducations();
  const total = educations.length;

  if (total === 0) {
    const health = await checkApiHealth();
    if (!health.ok) {
      return <ApiOfflinePage path="/education" />;
    }
  }

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/education" />
            </div>
            <h1>{PAGES.education.title}</h1>
          </div>
          {total > 0 && (
            <div className="count-badge inline-flex items-center gap-1.5 font-mono text-small text-fg-muted px-2.5 py-1 shrink-0 mt-1">
              <span className="font-medium text-fg">{total}</span>
              <span>{total === 1 ? "Qualification" : "Qualifications"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">{PAGES.education.intro}</p>

        <EducationContent educations={educations} />

        <KeepExploring pages={["work", "projects", "communities"]} />
      </Container>
    </Section>
  );
}
