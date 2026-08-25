import { Card, Container, Section, SectionHeading } from "@/components/ui";
import type { About as AboutData } from "@/lib/api-types";
import { PILLARS, SECTIONS } from "@/lib/constants";
import { paragraphs as splitParagraphs } from "@/lib/format";

/**
 * About.
 *
 * `description[0]` is the section heading and the rest is the prose beneath it,
 * so the whole block is one field in the admin rather than a heading and a body
 * that can drift apart. The four pillar cards are static: they describe what
 * the work *is*, which is not something the CMS should be able to change by
 * accident.
 */
export function About({ about }: { about: AboutData | null }) {
  const copy = splitParagraphs(about?.description);
  const paragraphs = copy.slice(1);

  return (
    <Section id="about">
      <Container>
        <SectionHeading
          label={SECTIONS.about.label}
          title={copy[0] ?? SECTIONS.about.title}
        />

        {paragraphs.length > 0 && (
          <div className="section-copy section-intro">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        <div className="grid-2">
          {PILLARS.map((pillar) => (
            <Card key={pillar.title} className="card">
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
