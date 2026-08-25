import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Building2,
  Calendar,
  MapPin,
  Presentation,
  Users,
  Video,
} from "lucide-react";
import { Badge, Container, LinkButton, Section } from "@/components/ui";
import { api } from "@/lib/api";
import type { EventRecord } from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import {
  formatDate,
  formatDuration,
  humanise,
  toDateAttribute,
} from "@/lib/format";

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
  if (!event) notFound();

  const photos = [...(event.photos ?? [])].sort((a, b) => a.order - b.order);

  return (
    <Section>
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventJsonLd(event)),
          }}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge>{humanise(event.type)}</Badge>
          <Badge>{humanise(event.format)}</Badge>
          {event.status === "cancelled" && <Badge>Cancelled</Badge>}
        </div>

        <h1>{event.title}</h1>
        {event.summary && (
          <p className="mt-4 text-h3 text-fg-muted">{event.summary}</p>
        )}

        <dl className="mt-6 grid gap-x-6 gap-y-3 font-mono text-small text-fg-muted sm:grid-cols-2">
          <div>
            <dt className="sr-only">Date</dt>
            <dd className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-fg-muted" strokeWidth={1.75} aria-hidden="true" />
              <time dateTime={toDateAttribute(event.startAt)}>
                {formatDate(event.startAt)}
              </time>
            </dd>
          </div>
          {event.location && (
            <div>
              <dt className="sr-only">Location</dt>
              <dd className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-fg-muted" strokeWidth={1.75} aria-hidden="true" />
                <span>
                  {[
                    event.location.venue,
                    event.location.city,
                    event.location.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </dd>
            </div>
          )}
          {event.host?.name && (
            <div>
              <dt className="sr-only">Event</dt>
              <dd className="flex items-center gap-2">
                <Building2 className="h-4 w-4 shrink-0 text-fg-muted" strokeWidth={1.75} aria-hidden="true" />
                <span>{event.host.name}</span>
              </dd>
            </div>
          )}
          {event.audienceSize && (
            <div>
              <dt className="sr-only">Audience</dt>
              <dd className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0 text-fg-muted" strokeWidth={1.75} aria-hidden="true" />
                <span>{event.audienceSize} attendees</span>
              </dd>
            </div>
          )}
        </dl>

        {(event.links ?? []).length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {(event.links ?? []).map((link) => (
              <LinkButton
                key={link.url}
                href={link.url}
                variant={link.kind === "registration" ? "primary" : "secondary"}
              >
                {link.label}
              </LinkButton>
            ))}
          </div>
        )}

        {event.cover && (
          <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-lg border border-border-strong bg-bg-surface">
            <Image
              src={event.cover.url}
              alt={event.cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {event.description && (
          <div className="prose mt-10">
            {event.description.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        {(event.speakers ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Speakers</h2>
            <ul className="mt-4 space-y-3">
              {(event.speakers ?? []).map((speaker) => (
                <li key={speaker.name} className="flex items-center gap-3">
                  {speaker.avatarUrl && (
                    <Image
                      src={speaker.avatarUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-border-strong object-cover"
                    />
                  )}
                  <div>
                    <p className="text-fg">
                      {speaker.profileUrl ? (
                        <a
                          href={speaker.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {speaker.name}
                        </a>
                      ) : (
                        speaker.name
                      )}
                      {speaker.isHost && (
                        <span className="text-fg-muted"> · host</span>
                      )}
                    </p>
                    {speaker.role && (
                      <p className="font-mono text-small text-fg-muted">
                        {speaker.role}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Recordings and photos are both optional and often empty — an
            in-person event with no photos yet and an online one before its
            recording is published are normal states, not degraded ones. */}
        {(event.recordings ?? []).length > 0 && (
          <section className="mt-12">
            <h2>Recordings</h2>
            <ul className="mt-4 space-y-2">
              {(event.recordings ?? []).map((recording) => (
                <li key={recording.url} className="flex items-center gap-2 font-mono text-small">
                  <Video className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
                  <a
                    href={recording.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch on {humanise(recording.platform)}
                  </a>
                  {recording.durationSeconds && (
                    <span className="text-fg-muted">
                      {" "}
                      · {formatDuration(recording.durationSeconds)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {event.slides && (
          <section className="mt-12">
            <h2>Slides</h2>
            <p className="mt-4 flex items-center gap-2 font-mono text-small">
              <Presentation className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
              <a
                href={event.slides.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View the slides
                {event.slides.provider ? ` on ${event.slides.provider}` : ""}
              </a>
            </p>
          </section>
        )}

        {photos.length > 0 && (
          <section className="mt-12">
            <h2>Photos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {photos.map((photo) => (
                <figure key={photo.url}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border-strong bg-bg-surface">
                    <Image
                      src={photo.url}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 380px"
                      className="object-cover"
                    />
                  </div>
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
      </Container>
    </Section>
  );
}
