import Image from "next/image";
import Link from "next/link";
import { Briefcase, Mail } from "lucide-react";
import { Container, LinkButton } from "@/components/ui";
import type { About, BlogPost, EventRecord, Video } from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import { formatDate, paragraphs, portrait as portraitUrl } from "@/lib/format";
import { SOCIAL_ICONS } from "@/lib/social-icons";

/**
 * The hero.
 *
 * The display heading is the **tagline**, not the name. What someone does is
 * the useful thing to read first; the name belongs beside the portrait, where
 * it identifies the face rather than announcing itself.
 *
 * The portrait is one of only two places a photograph appears on this site -
 * the other is the event gallery.
 */
/**
 * The newest record of each kind the homepage already fetched - one post, one
 * event, one video - shown under the hero as proof of what is going on now.
 * Nothing extra is requested for it; it reads the head of lists the sections
 * below render in full.
 */
export interface HeroNow {
  post?: BlogPost;
  event?: EventRecord;
  video?: Video;
}

export function Hero({
  about,
  now = {},
}: {
  about: About | null;
  now?: HeroNow;
}) {
  const name = about?.name ?? SITE_CONFIG.name;
  const role = about?.title ?? "";
  const tagline = about?.tagline ?? SITE_CONFIG.description;
  // The supporting line under the tagline, and its own field on the about
  // record. It used to be `description[1]` - the About section's second
  // paragraph, borrowed - which meant editing the About copy silently moved
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

  const { post, event, video } = now;

  // Three records, one format: what kind it is, its title as the only link,
  // and its date. Every one is the newest of a list the page already holds.
  const latest = [
    post && {
      key: "post",
      label: "Latest writing",
      title: post.title,
      href: post.path || `/blog/${post.slug}`,
      external: false,
      date: formatDate(post.publishedDate),
    },
    event && {
      key: "event",
      label: event.status === "upcoming" ? "Next talk" : "Latest talk",
      title: event.title,
      href: `/events/${event.slug}`,
      external: false,
      date: formatDate(event.startAt, event.timezone),
    },
    video && {
      key: "video",
      label: "Latest video",
      title: video.title,
      href: video.link,
      external: true,
      date: formatDate(video.date),
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    title: string;
    href: string;
    external: boolean;
    date: string;
  }[];

  return (
    <div className="hero-wrap">
      <Container>
        <div className="hero">
          <div className="hero-copy">
            <h1 className="display hero-title">{tagline}</h1>
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
              <ul className="socials hero-socials" aria-label="Find me on">
                {socials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                      >
                        <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="hero-side">
            {/* A phone has no profile rail, so the hero carries the face and
                name there. Hidden at the width the rail appears. */}
            <div className="hero-mobile-id">
              {portrait && (
                <Image
                  className="portrait"
                  src={portrait}
                  alt={name}
                  width={240}
                  height={240}
                  sizes="88px"
                />
              )}
              <div className="min-w-0">
                <p className="hero-name">{name}</p>
                {role && (
                  <p className="hero-role">
                    {role}
                    {about?.location && <>, {about.location}</>}
                  </p>
                )}
              </div>
            </div>
            {latest.length > 0 && (
              <ul className="hero-latest" aria-label="Latest">
                {latest.map((item) => (
                  <li key={item.key} className="hero-latest-item">
                    <span className="hero-latest-label">{item.label}</span>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-latest-title text-link"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="hero-latest-title text-link"
                      >
                        {item.title}
                      </Link>
                    )}
                    {item.date && (
                      <span className="hero-latest-date">{item.date}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
