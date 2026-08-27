import {
  ArrowUpRight,
  BookOpen,
  Code2,
  Cpu,
  Presentation,
  Users,
  Video,
} from "lucide-react";
import { Card, Container, Section, SectionHeading } from "@/components/ui";
import type { About as AboutData } from "@/lib/api-types";
import { PILLARS, SECTIONS } from "@/lib/constants";
import { paragraphs as splitParagraphs } from "@/lib/format";

const PILLAR_ICONS = {
  "ai-engineering": Cpu,
  "open-source": Code2,
  "public-speaking": Presentation,
  blogs: BookOpen,
  videos: Video,
  "community-volunteering": Users,
} as const;

/**
 * About.
 *
 * `description[0]` is the section heading and the rest is the prose beneath it,
 * so the whole block is one field in the admin rather than a heading and a body
 * that can drift apart. The six cards represent the core areas of work and
 * activity across engineering, open source, speaking, writing, video, and community.
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
              <Card
                key={pillar.key}
                href={pillar.href}
                className="card group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-bg text-brand transition-colors group-hover:border-brand/40 group-hover:bg-bg-raised">
                      <Icon
                        className="h-4.5 w-4.5"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="font-mono text-label text-fg-muted">
                      {pillar.kicker}
                    </span>
                  </div>

                  <h3 className="mt-4 transition-colors group-hover:text-brand">
                    {pillar.title}
                  </h3>
                  <p>{pillar.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border-hairline pt-4 font-mono text-label text-fg-muted transition-colors group-hover:text-brand">
                  <span>{pillar.linkText}</span>
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
