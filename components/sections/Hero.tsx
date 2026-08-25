import Image from "next/image";
import { Container, LinkButton } from "@/components/ui";
import type { About } from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import { paragraphs, portrait as portraitUrl } from "@/lib/format";

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
  // The supporting line under the tagline, and its own field on the about
  // record. It used to be `description[1]` — the About section's second
  // paragraph, borrowed — which meant editing the About copy silently moved
  // the hero's lead, and the site had to know a coupling nothing declared.
  //
  // The old reading is kept as the fallback rather than removed: a record
  // written before the field existed still renders the sentence it always
  // did, and it comes from the same `/about` response either way. There is no
  // second request here and there never was one to save.
  const lead =
    about?.taglineDescription?.trim() ||
    paragraphs(about?.description)[1] ||
    "";
  const portrait = portraitUrl(about?.images);

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
            {about?.status && (
              <div className="hero-meta">
                <span className="hero-meta-value badge">{about.status}</span>
              </div>
            )}
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
