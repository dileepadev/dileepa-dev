import { UserRound } from "lucide-react";
import { IndexSection } from "@/components/ui";
import type { About as AboutData } from "@/lib/api-types";
import { SECTIONS } from "@/lib/constants";
import { paragraphs as splitParagraphs } from "@/lib/format";

/**
 * About.
 *
 * `description[0]` is the section heading and the rest is the prose beneath it,
 * so the whole block is one field in the admin rather than a heading and a body
 * that can drift apart.
 *
 * The heading and the paragraphs are the whole section (v2.1.0 draft). Six
 * cards used to follow - AI engineering, open source, speaking, writing,
 * videos, community - each an icon, a title and three generic lines. They
 * restated the paragraphs above them and the pages the rail already links,
 * and were the one part of the site that read as a template. The pillar
 * marks stay in `components/icons/PillarIcons`, shown on /brand.
 */
export function About({ about }: { about: AboutData | null }) {
  const copy = splitParagraphs(about?.description);
  const paragraphs = copy.slice(1);

  return (
    <IndexSection
      id="about"
      art={UserRound}
      label={SECTIONS.about.label}
      title={copy[0] ?? SECTIONS.about.title}
    >
      {paragraphs.length > 0 && (
        <div className="section-copy section-intro !mb-0">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
    </IndexSection>
  );
}
