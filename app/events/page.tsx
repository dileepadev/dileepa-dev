import { Metadata } from "next";
import { Container, Button, Card, Badge } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { api } from "@/lib/api";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaMicrophone,
  FaMapMarkerAlt,
  FaUsers,
  FaExternalLinkAlt,
  FaFileAlt,
  FaVideo,
} from "react-icons/fa";

export const metadata: Metadata = {
  title: "Events | Dileepa Bandara",
  description:
    "Explore my past and upcoming events, conference talks, workshops, and podcast appearances on web development and software engineering topics.",
};

const typeIcons = {
  conference: FaMicrophone,
  workshop: FaUsers,
  meetup: FaUsers,
  webinar: FaVideo,
  podcast: FaMicrophone,
};

const typeColors = {
  conference: "bg-accent-blue/10 text-accent-blue",
  workshop: "bg-accent-blue/10 text-accent-blue",
  meetup: "bg-accent-blue/10 text-accent-blue",
  webinar: "bg-accent-blue/10 text-accent-blue",
  podcast: "bg-accent-blue/10 text-accent-blue",
};

export default async function EventsPage() {
  const apiEvents = (await api.getEvents()) || [];

  // Normalize data from API to match UI expectations
  const events = apiEvents
    .map((e, index) => {
      // Map backend 'format' to frontend 'type'
      let type: keyof typeof typeIcons = "conference";
      const format = e.format.toLowerCase();
      if (format.includes("workshop")) type = "workshop";
      else if (format.includes("meetup")) type = "meetup";
      else if (format.includes("webinar")) type = "webinar";
      else if (format.includes("podcast")) type = "podcast";

      // Use 'type' from API if available
      if (e.type && e.type in typeIcons)
        type = e.type as keyof typeof typeIcons;

      return {
        id: e._id || `event-${index}`,
        title: e.title,
        event: e.event || e.location, // fallback to location if event is missing
        date: e.date,
        type,
        description: e.description,
        location: e.location,
        audience: e.audience,
        url: e.url,
        slides: e.slides,
        recording: e.recording,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaCalendarAlt className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Events
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              Conference talks, workshops, meetups, and podcast appearances
              where I share knowledge and insights with the tech community.
            </p>
            <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
              Back to Home
            </Button>
          </div>

          {/* Events Timeline */}
          <div className="max-w-5xl mx-auto">
            {events.map((event, index) => {
              const TypeIcon = typeIcons[event.type] || FaMicrophone;
              const colorClass =
                typeColors[event.type] || "bg-accent-blue/10 text-accent-blue";

              return (
                <div key={event.id} className="relative">
                  {/* Timeline Line */}
                  {index < events.length - 1 && (
                    <div className="absolute left-10 top-24 bottom-0 w-0.5 bg-border-light hidden md:block" />
                  )}

                  <div className="mb-12 last:mb-0">
                    <Card variant="elevated" hover className="overflow-hidden">
                      <div className="md:flex">
                        {/* Left Section - Icon & Date */}
                        <div className="md:w-48 p-6 bg-bg-secondary border-b md:border-b-0 md:border-r border-border-light flex md:flex-col items-center md:items-center md:justify-center gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
                          >
                            <TypeIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 md:flex-none md:text-center">
                            <div className="text-sm font-medium text-text-primary mb-1">
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </div>
                            <Badge variant="default" size="sm">
                              {event.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Right Section - Content */}
                        <div className="flex-1 p-6">
                          {/* Title & Event */}
                          <h3 className="text-2xl font-bold text-text-primary mb-2">
                            {event.title}
                          </h3>
                          <div className="text-accent-blue font-semibold mb-4">
                            {event.event}
                          </div>

                          {/* Description */}
                          <p className="text-text-secondary mb-6">
                            {event.description}
                          </p>

                          {/* Meta Info */}
                          <div className="grid sm:grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                              <FaMapMarkerAlt className="h-4 w-4 text-accent-blue shrink-0" />
                              <span>{event.location}</span>
                            </div>
                            {event.audience && (
                              <div className="flex items-center gap-2 text-sm text-text-muted">
                                <FaUsers className="h-4 w-4 text-accent-blue shrink-0" />
                                <span>{event.audience} attendees</span>
                              </div>
                            )}
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-wrap gap-3">
                            {event.url && (
                              <a
                                href={event.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm font-medium"
                              >
                                <FaExternalLinkAlt className="h-3 w-3" />
                                Event Page
                              </a>
                            )}
                            {event.slides && (
                              <a
                                href={event.slides}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary text-text-primary hover:bg-bg-secondary/80 transition-colors text-sm font-medium border border-border-light"
                              >
                                <FaFileAlt className="h-3 w-3" />
                                View Slides
                              </a>
                            )}
                            {event.recording && (
                              <a
                                href={event.recording}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary text-text-primary hover:bg-bg-secondary/80 transition-colors text-sm font-medium border border-border-light"
                              >
                                <FaVideo className="h-3 w-3" />
                                Watch Recording
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-secondary text-text-muted">
                  <FaCalendarAlt className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                No events yet
              </h2>
              <p className="text-text-secondary mb-6">
                Check back soon for upcoming talks and events!
              </p>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
