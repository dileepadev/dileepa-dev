import Image from "next/image";
import { Container, LinkButton } from "@/components/ui";
import type { About } from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import { paragraphs } from "@/lib/format";

/**
 * The hero.
 *
 * The display heading is the **tagline**, not the name. What someone does is
 * the useful thing to read first; the name belongs beside the portrait, where
 * it identifies the face rather than announcing itself.
 *
 * The portrait is one of only two places a photograph appears on this site —
 * the other is the event gallery.
 */
export function Hero({ about }: { about: About | null }) {
  const name = about?.name ?? SITE_CONFIG.name;
  const role = about?.title ?? "";
  const tagline = about?.tagline ?? SITE_CONFIG.description;
  // `description[0]` is the About section's heading, so the lead here is the
  // paragraph after it rather than a second copy of the same sentence.
  const lead = paragraphs(about?.description)[1] ?? "";
  const portrait = about?.images?.profileWebp || about?.images?.profilePng;

  return (
    <Container>
      <div className="hero">
        <div className="hero-inner">
          <div className="min-w-0">
            <h1 className="display">{tagline}</h1>
            {lead && <p className="hero-lead">{lead}</p>}

            <div className="hero-actions">
              <LinkButton href="/#contact">Get in touch</LinkButton>
              <LinkButton href="/#work" variant="secondary">
                See the work
              </LinkButton>
            </div>
          </div>

          {portrait && (
            <aside className="hero-side">
              <div className="hero-id">
                <Image
                  className="portrait"
                  src={portrait}
                  alt={name}
                  width={260}
                  height={260}
                  sizes="260px"
                  priority
                />
                <div>
                  <div className="hero-name">{name}</div>
                  {role && (
                    <div className="hero-role">
                      {role}
                      {about?.location ? ` · ${about.location}` : ""}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </Container>
  );
}
