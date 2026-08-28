import { BookOpen, Code2, Cpu, Mic, Users, Video } from "lucide-react";
import { Card, Container, Section, SectionHeading } from "@/components/ui";
import type { About as AboutData } from "@/lib/api-types";
import { PILLARS, SECTIONS } from "@/lib/constants";
import { paragraphs as splitParagraphs } from "@/lib/format";

const PILLAR_ICONS = {
  "ai-engineering": Cpu,
  "open-source": Code2,
  "public-speaking": Mic,
  "technical-writing": BookOpen,
  "technical-videos": Video,
  "community-building": Users,
} as const;

/**
 * About.
 *
 * `description[0]` is the section heading and the rest is the prose beneath it,
 * so the whole block is one field in the admin rather than a heading and a body
 * that can drift apart. The six cards show what Dileepa does across AI engineering,
 * open source, speaking, writing, videos, and community volunteering.
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

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar) => {
            const Icon =
              PILLAR_ICONS[pillar.key as keyof typeof PILLAR_ICONS] ?? Cpu;
            return (
              <Card key={pillar.key} className="card flex flex-col">
                <div>
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-bg text-brand">
                    <Icon
                      className="h-4.5 w-4.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
