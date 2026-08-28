import Image from "next/image";
import { Briefcase, Mail, MapPin } from "lucide-react";
import { Container, LinkButton, StatusBadge } from "@/components/ui";
import type { About } from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import { paragraphs, portrait as portraitUrl } from "@/lib/format";
import { SOCIAL_ICONS } from "@/lib/social-icons";

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
  const portrait = portraitUrl(about?.images) || "/profile/v2.webp";

  const links = about?.links;
  const socials = SOCIAL_ICONS.map((icon) => ({
    ...icon,
    href: links?.[icon.key],
  })).filter((icon): icon is typeof icon & { href: string } =>
    Boolean(icon.href),
  );

  return (
    <Container>
      <div className="hero">
        <div className="hero-inner">
          <div className="min-w-0">
            {about?.status && (
              <div className="hero-meta">
                <StatusBadge>{about.status}</StatusBadge>
              </div>
            )}
            <h1 className="display">{tagline}</h1>
            {lead && <p className="hero-lead">{lead}</p>}

            <div className="hero-actions">
              <LinkButton href="/#contact">
                <Mail
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>Get in touch</span>
              </LinkButton>
              <LinkButton href="/#work" variant="secondary">
                <Briefcase
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>See the work</span>
              </LinkButton>
            </div>

            {socials.length > 0 && (
              <div className="mt-8 flex items-center gap-3">
                <span className="font-mono text-small text-fg-muted">
                  Find me on
                </span>
                <span className="text-border-strong select-none" aria-hidden="true">
                  —
                </span>
                <div className="socials !mt-0 flex items-center gap-3">
                  {socials.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                      >
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {portrait && (
            <aside className="hero-side w-full flex justify-center">
              <div className="hero-id mx-auto">
                <Image
                  className="portrait"
                  src={portrait}
                  alt={name}
                  width={260}
                  height={260}
                  sizes="260px"
                  priority
                  fetchPriority="high"
                />
                <div className="mt-4">
                  <div className="hero-name">{name}</div>
                  {role && (
                    <div className="hero-role mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                      <span>{role}</span>
                      {about?.location && (
                        <>
                          <span className="text-fg-muted">·</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin
                              className="h-3.5 w-3.5 text-fg-muted"
                              strokeWidth={1.75}
                              aria-hidden="true"
                            />
                            <span>{about.location}</span>
                          </span>
                        </>
                      )}
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
