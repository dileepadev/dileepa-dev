import {
  BookOpen,
  Code2,
  Cpu,
  Globe,
  GraduationCap,
  Mic,
  PenTool,
  Rocket,
  Sparkles,
  Terminal,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Card, Container, Section, SectionHeading } from "@/components/ui";
import type { About as AboutData, Pillar, PillarIcon } from "@/lib/api-types";
import { PILLARS, SECTIONS } from "@/lib/constants";
import { paragraphs as splitParagraphs } from "@/lib/format";

/**
 * The icon names the API serves, resolved to components.
 *
 * `PillarIcon` is a closed set in the spec, so this map is exhaustive by
 * construction - dropping a name here stops compiling rather than rendering a
 * blank card. `??` in the lookup covers the other direction: an API newer than
 * this build draws `Cpu` rather than nothing.
 */
const PILLAR_ICONS: Record<PillarIcon, LucideIcon> = {
  cpu: Cpu,
  code: Code2,
  mic: Mic,
  book: BookOpen,
  video: Video,
  users: Users,
  sparkles: Sparkles,
  rocket: Rocket,
  terminal: Terminal,
  pen: PenTool,
  globe: Globe,
  "graduation-cap": GraduationCap,
};

/**
 * About.
 *
 * `description[0]` is the section heading and the rest is the prose beneath it,
 * so the whole block is one field in the admin rather than a heading and a body
 * that can drift apart. The six cards show what Dileepa does across AI engineering,
 * open source, speaking, writing, videos, and community volunteering.
 *
 * The cards come from `GET /pillars`, so rewording one is a save in the admin
 * rather than a deploy. `PILLARS` in `lib/constants.ts` is what renders when
 * that call returns nothing - an API outage should cost the section its
 * editability, not its content.
 */
export function About({
  about,
  pillars = [],
}: {
  about: AboutData | null;
  pillars?: Pillar[];
}) {
  const copy = splitParagraphs(about?.description);
  const paragraphs = copy.slice(1);

  const cards =
    pillars.length > 0
      ? pillars.map((pillar) => ({
          key: pillar.id,
          title: pillar.title,
          description: pillar.description,
          icon: PILLAR_ICONS[pillar.icon] ?? Cpu,
        }))
      : PILLARS.map((pillar) => ({
          key: pillar.key,
          title: pillar.title,
          description: pillar.description,
          icon: PILLAR_ICONS[pillar.icon] ?? Cpu,
        }));

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
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.key} className="card flex flex-col">
                <div>
                  <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong bg-bg text-brand">
                    <Icon
                      className="h-4.5 w-4.5"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
