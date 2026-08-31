import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  Calendar,
  ExternalLink,
  FileText,
  MapPin,
  Megaphone,
  Presentation,
  Sparkles,
  Ticket,
  Users,
  Video,
} from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
} from "@/components/icons/SocialIcons";
import {
  ApiOfflinePage,
  Badge,
  Chip,
  Container,
  LinkButton,
  PagePath,
  Section,
  ZoomableImage,
} from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import type { EventRecord } from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import { jsonLd } from "@/lib/utils";
import {
  formatDate,
  formatDuration,
  formatTimeRange,
  humanise,
  paragraphs,
  toDateAttribute,
} from "@/lib/format";

function normalizeAvatarUrl(url?: string | null): string | null {
  if (!url) return null;
  return url.replace(/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?/, "");
}

function linkIcon(url: string, kind: string) {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("facebook.com")) return FaFacebook;
  if (lowerUrl.includes("github.com")) return FaGithub;
  if (lowerUrl.includes("linkedin.com")) return FaLinkedin;
  if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be"))
    return FaYoutube;
  if (lowerUrl.includes("x.com") || lowerUrl.includes("twitter.com"))
    return FaXTwitter;

  switch (kind) {
    case "registration":
      return Ticket;
    case "announcement":
      return Megaphone;
    case "recap":
      return Sparkles;
    case "repo":
      return FaGithub;
    case "resource":
      return FileText;
    default:
      return ExternalLink;
  }
}

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await api.getEvents({ limit: 200 });
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const event = await api.getEvent(slug);
  if (!event) return { title: "Event not found" };

  const title = event.seo?.metaTitle || event.title;
  const description = event.seo?.metaDescription || event.summary;
  const image = event.seo?.ogImage || event.cover?.url;

  return {
    title,
    description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_CONFIG.url}/events/${event.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

/** schema.org/Event, so an event can surface as one in search results. */
function eventJsonLd(event: EventRecord) {
  const attendanceMode = {
    online: "https://schema.org/OnlineEventAttendanceMode",
    in_person: "https://schema.org/OfflineEventAttendanceMode",
    hybrid: "https://schema.org/MixedEventAttendanceMode",
  }[event.format];

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary || event.description,
    startDate: event.startAt,
    endDate: event.endAt ?? undefined,
    eventAttendanceMode: attendanceMode,
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    url: `${SITE_CONFIG.url}/events/${event.slug}`,
    image: event.cover?.url ? [event.cover.url] : undefined,
    location: event.location
      ? {
          "@type": "Place",
          name: event.location.venue ?? event.location.city ?? "",
          address: [event.location.city, event.location.country]
            .filter(Boolean)
            .join(", "),
        }
      : {
          "@type": "VirtualLocation",
          url: `${SITE_CONFIG.url}/events/${event.slug}`,
        },
    performer: (event.speakers ?? []).map((speaker) => ({
      "@type": "Person",
      name: speaker.name,
      url: speaker.profileUrl ?? undefined,
    })),
    organizer: event.host
      ? {
          "@type": "Organization",
          name: event.host.organizer ?? event.host.name,
        }
      : undefined,
  };
}

export default async function EventPage({ params }: Params) {
  const { slug } = await params;
  const event = await api.getEvent(slug);
  if (!event) {
    const health = await checkApiHealth();
    if (!health.ok) {
      return <ApiOfflinePage path={`/events/${slug}`} />;
    }
    notFound();
  }

  const photos = [...(event.photos ?? [])].sort((a, b) => a.order - b.order);
  const timeRange = formatTimeRange(
    event.startAt,
    event.endAt,
    event.timezone,
  );
  const locationPlace = [event.location?.city, event.location?.country]
    .filter(Boolean)
    .join(", ");
  const registrationLink = (event.links ?? []).find(
    (link) => link.kind === "registration",
  );

  const hasBadges = Boolean(
    event.series || event.status === "upcoming" || event.status === "cancelled",
  );

  return (
    <Section>
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(eventJsonLd(event)),
          }}
        />

        <div className="mb-2">
          <PagePath path={`/events/${event.slug}`} />
        </div>
        <div className="section-label">Events</div>

        <h1>{event.title}</h1>
        {event.summary && (
          <p className="section-intro">{event.summary}</p>
        )}

        <div className={`overflow-hidden rounded-lg border border-border-strong bg-bg-surface ${event.summary ? "" : "mt-6 sm:mt-8"}`}>
          {hasBadges && (
            <div className="flex flex-wrap items-center gap-2 border-b border-border-hairline p-4 sm:p-5">
              {event.series && <Badge>Part of {event.series.name}</Badge>}
              {event.status === "upcoming" && (
                <Badge variant="filled">Upcoming</Badge>
              )}
              {event.status === "cancelled" && <Badge>Cancelled</Badge>}
            </div>
          )}
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            {/* 1. Date & Time */}
            <div className="flex items-start gap-3.5 border-b sm:border-r border-border-hairline p-4 sm:p-5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border-strong bg-bg text-fg-muted"
                aria-hidden="true"
              >
                <Calendar className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-label tracking-[0.01em] text-fg-muted">Date &amp; time</dt>
                <dd className="mt-1">
                  <time
                    dateTime={toDateAttribute(event.startAt)}
                    className="block font-mono text-small font-medium text-fg break-words"
                  >
                    {formatDate(event.startAt, event.timezone)}
                  </time>
                  {timeRange && (
                    <span className="mt-0.5 block font-mono text-small text-fg-muted break-words">
                      {timeRange}
                    </span>
                  )}
                </dd>
              </div>
            </div>

            {/* 2. Venue & Location */}
            <div className="flex items-start gap-3.5 border-b border-border-hairline p-4 sm:p-5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border-strong bg-bg text-fg-muted"
                aria-hidden="true"
              >
                {event.format === "online" && !event.location?.venue ? (
                  <Video className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <MapPin className="h-4 w-4" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-label tracking-[0.01em] text-fg-muted">Location</dt>
                <dd className="mt-1">
                  {event.location?.venue ? (
                    event.location.mapUrl ? (
                      <a
                        href={event.location.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-fg transition-colors hover:text-brand"
                      >
                        {event.location.venue}
                      </a>
                    ) : (
                      <span className="block font-medium text-fg break-words">
                        {event.location.venue}
                      </span>
                    )
                  ) : (
                    <span className="block font-medium text-fg break-words">
                      {locationPlace ||
                        (event.format === "online" ? "Online" : humanise(event.format))}
                    </span>
                  )}
                  {event.location?.venue && locationPlace ? (
                    <span className="mt-0.5 block font-mono text-small text-fg-muted break-words">
                      {locationPlace}
                    </span>
                  ) : event.format === "online" ? (
                    <span className="mt-0.5 block font-mono text-small text-fg-muted">
                      Virtual event
                    </span>
                  ) : (
                    <span className="mt-0.5 block font-mono text-small text-fg-muted break-words">
                      {humanise(event.format)}
                    </span>
                  )}
                </dd>
              </div>
            </div>

            {/* 3. Organiser */}
            <div className="flex items-start gap-3.5 border-b sm:border-b-0 sm:border-r border-border-hairline p-4 sm:p-5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border-strong bg-bg text-fg-muted"
                aria-hidden="true"
              >
                {event.host ? (
                  <Building2 className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Sparkles className="h-4 w-4" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-label tracking-[0.01em] text-fg-muted">
                  {event.host
                    ? "Organiser"
                    : event.series
                      ? "Series"
                      : "Event type"}
                </dt>
                <dd className="mt-1">
                  {event.host ? (
                    event.host.organizerUrl ? (
                      <a
                        href={event.host.organizerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-fg transition-colors hover:text-brand"
                      >
                        {event.host.organizer ?? event.host.name}
                      </a>
                    ) : (
                      <span className="block font-medium text-fg break-words">
                        {event.host.organizer ?? event.host.name}
                      </span>
                    )
                  ) : event.series ? (
                    <span className="block font-medium text-fg break-words">
                      {event.series.name}
                    </span>
                  ) : (
                    <span className="block font-medium text-fg break-words">
                      {humanise(event.type)}
                    </span>
                  )}
                  {event.host ? (
                    <span className="mt-0.5 block font-mono text-small text-fg-muted break-words">
                      {event.series ? `Part of ${event.series.name}` : "Host"}
                    </span>
                  ) : event.series ? (
                    <span className="mt-0.5 block font-mono text-small text-fg-muted break-words">
                      {humanise(event.type)}
                    </span>
                  ) : (
                    <span className="mt-0.5 block font-mono text-small text-fg-muted">
                      Community session
                    </span>
                  )}
                </dd>
              </div>
            </div>

            {/* 4. Audience & Format */}
            <div className="flex items-start gap-3.5 p-4 sm:p-5">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border-strong bg-bg text-fg-muted"
                aria-hidden="true"
              >
                {event.audienceSize ? (
                  <Users className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Presentation className="h-4 w-4" strokeWidth={1.75} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <dt className="text-label tracking-[0.01em] text-fg-muted">
                  {event.audienceSize ? "Audience" : "Format"}
                </dt>
                <dd className="mt-1">
                  {event.audienceSize ? (
                    <span className="block font-mono text-small font-medium text-fg break-words">
                      {event.audienceSize} attendees
                    </span>
                  ) : (
                    <span className="block font-medium text-fg break-words">
                      {humanise(event.format)}
                    </span>
                  )}
                  <span className="mt-0.5 block font-mono text-small text-fg-muted break-words">
                    {event.audienceSize
                      ? `${humanise(event.format)} · ${humanise(event.type)}`
                      : event.format === "online"
                        ? "Virtual attendance"
                        : "In-person attendance"}
                  </span>
                </dd>
              </div>
            </div>
          </dl>

          {registrationLink && event.status === "upcoming" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-hairline bg-surface-hover/20 px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-2 text-small font-mono text-fg-muted">
                <Ticket className="h-4 w-4 text-fg-muted shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="break-words">Registration is open for this event</span>
              </div>
              <LinkButton
                href={registrationLink.url}
                variant="primary"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto shrink-0"
              >
                <Ticket className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{registrationLink.label}</span>
              </LinkButton>
            </div>
          )}
        </div>

        {event.cover && (
          <div className="mt-10">
            <ZoomableImage
              src={event.cover.url}
              alt={event.cover.alt}
              aspectRatio="aspect-16/9"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        {event.description && (
          <div className="prose mt-10">
            {paragraphs(event.description).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {(event.speakers ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Speakers</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(event.speakers ?? []).map((speaker) => {
                const avatarSrc = normalizeAvatarUrl(speaker.avatarUrl);
                const isCloudinary = avatarSrc?.includes("res.cloudinary.com");
                const isLocal = avatarSrc?.startsWith("/");

                return (
                  <div
                    key={speaker.name}
                    className="flex items-center gap-3.5 rounded-lg border border-border-strong bg-bg-surface p-4 transition-colors hover:border-brand"
                  >
                    {avatarSrc ? (
                      <Image
                        src={avatarSrc}
                        alt={speaker.name}
                        width={48}
                        height={48}
                        unoptimized={!isLocal && !isCloudinary}
                        className="h-12 w-12 shrink-0 rounded-full border border-border-strong object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg text-fg-muted font-mono text-small font-medium"
                        aria-hidden="true"
                      >
                        {speaker.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-fg">
                        {speaker.profileUrl ? (
                          <a
                            href={speaker.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-brand"
                          >
                            {speaker.name}
                          </a>
                        ) : (
                          speaker.name
                        )}
                        {speaker.isHost && (
                          <span className="ml-2 inline-flex items-center rounded-xs border border-brand/40 bg-brand/10 px-1.5 py-0.5 font-mono text-[0.6875rem] font-medium text-brand">
                            Host
                          </span>
                        )}
                      </p>
                      {speaker.role && (
                        <p className="mt-0.5 truncate font-mono text-small text-fg-muted">
                          {speaker.role}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Recordings and photos are both optional and often empty — an
            in-person event with no photos yet and an online one before its
            recording is published are normal states, not degraded ones. */}
        {(event.recordings ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Recordings</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {(event.recordings ?? []).map((recording) => (
                <LinkButton
                  key={recording.url}
                  href={recording.url}
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                >
                  <Video
                    className="h-4 w-4 shrink-0 text-brand"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span>Watch on {humanise(recording.platform)}</span>
                  {recording.durationSeconds && (
                    <span className="font-mono text-small text-fg-muted">
                      · {formatDuration(recording.durationSeconds)}
                    </span>
                  )}
                </LinkButton>
              ))}
            </div>
          </section>
        )}

        {event.slides && (
          <section className="mt-12">
            <h2>Slides</h2>
            <div className="mt-4">
              <LinkButton
                href={event.slides.url}
                variant="secondary"
                className="inline-flex items-center gap-2"
              >
                <Presentation
                  className="h-4 w-4 shrink-0 text-brand"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>
                  View slides
                  {event.slides.provider ? ` on ${event.slides.provider}` : ""}
                </span>
              </LinkButton>
            </div>
          </section>
        )}

        {(event.links ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Links</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {(event.links ?? []).map((link) => {
                const Icon = linkIcon(link.url, link.kind);
                return (
                  <LinkButton
                    key={link.url}
                    href={link.url}
                    variant={link.kind === "registration" ? "primary" : "secondary"}
                    className="inline-flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{link.label}</span>
                  </LinkButton>
                );
              })}
            </div>
          </section>
        )}

        {photos.length > 0 && (
          <section className="mt-12">
            <h2>Photos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {photos.map((photo) => (
                <figure key={photo.url}>
                  <ZoomableImage
                    src={photo.url}
                    alt={photo.alt}
                    aspectRatio="aspect-4/3"
                    sizes="(max-width: 640px) 100vw, 380px"
                  />
                  {(photo.caption || photo.credit) && (
                    <figcaption className="mt-2 font-mono text-small text-fg-muted">
                      {photo.caption}
                      {photo.credit && ` · ${photo.credit}`}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {(event.tags ?? []).length > 0 && (
          <div className="mt-12">
            <div className="flex flex-wrap gap-2">
              {(event.tags ?? []).map((tag) => (
                <Chip key={tag}>{tag}</Chip>
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
