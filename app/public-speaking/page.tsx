import { Metadata } from "next";
import { Container, Button, Card, Badge } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { SPEAKING_ENGAGEMENTS } from "@/lib/constants";
import { FaArrowLeft, FaMicrophone, FaMapMarkerAlt, FaUsers, FaExternalLinkAlt, FaFileAlt, FaVideo } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Public Speaking | Dileepa Bandara",
  description: "Explore my speaking engagements, conference talks, workshops, and podcast appearances on web development and software engineering topics.",
};

const typeIcons = {
  conference: FaMicrophone,
  workshop: FaUsers,
  meetup: FaUsers,
  webinar: FaVideo,
  podcast: FaMicrophone,
};

const typeColors = {
  conference: 'bg-accent-blue/10 text-accent-blue',
  workshop: 'bg-accent-blue/10 text-accent-blue',
  meetup: 'bg-accent-blue/10 text-accent-blue',
  webinar: 'bg-accent-blue/10 text-accent-blue',
  podcast: 'bg-accent-blue/10 text-accent-blue',
};

export default function PublicSpeakingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaMicrophone className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Public Speaking
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              Conference talks, workshops, meetups, and podcast appearances where I share knowledge and insights with the tech community.
            </p>
            <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
              Back to Home
            </Button>
          </div>

          {/* Speaking Engagements Timeline */}
          <div className="max-w-5xl mx-auto">
            {SPEAKING_ENGAGEMENTS.map((speaking, index) => {
              const TypeIcon = typeIcons[speaking.type] || FaMicrophone;
              const colorClass = typeColors[speaking.type] || 'bg-accent-blue/10 text-accent-blue';
              
              return (
                <div key={speaking.id} className="relative">
                  {/* Timeline Line */}
                  {index < SPEAKING_ENGAGEMENTS.length - 1 && (
                    <div className="absolute left-10 top-24 bottom-0 w-0.5 bg-border-light hidden md:block" />
                  )}
                  
                  <div className="mb-12 last:mb-0">
                    <Card variant="elevated" hover className="overflow-hidden">
                      <div className="md:flex">
                        {/* Left Section - Icon & Date */}
                        <div className="md:w-48 p-6 bg-bg-secondary border-b md:border-b-0 md:border-r border-border-light flex md:flex-col items-center md:items-center md:justify-center gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                            <TypeIcon className="h-6 w-6" />
                          </div>
                          <div className="flex-1 md:flex-none md:text-center">
                            <div className="text-sm font-medium text-text-primary mb-1">
                              {new Date(speaking.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <Badge variant="default" size="sm">
                              {speaking.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Right Section - Content */}
                        <div className="flex-1 p-6">
                          {/* Title & Event */}
                          <h3 className="text-2xl font-bold text-text-primary mb-2">
                            {speaking.title}
                          </h3>
                          <div className="text-accent-blue font-semibold mb-4">
                            {speaking.event}
                          </div>

                          {/* Description */}
                          <p className="text-text-secondary mb-6">
                            {speaking.description}
                          </p>

                          {/* Meta Info */}
                          <div className="grid sm:grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                              <FaMapMarkerAlt className="h-4 w-4 text-accent-blue shrink-0" />
                              <span>{speaking.location}</span>
                            </div>
                            {speaking.audience && (
                              <div className="flex items-center gap-2 text-sm text-text-muted">
                                <FaUsers className="h-4 w-4 text-accent-blue shrink-0" />
                                <span>{speaking.audience} attendees</span>
                              </div>
                            )}
                          </div>

                          {/* Action Links */}
                          <div className="flex flex-wrap gap-3">
                            {speaking.url && (
                              <a
                                href={speaking.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors text-sm font-medium"
                              >
                                <FaExternalLinkAlt className="h-3 w-3" />
                                Event Page
                              </a>
                            )}
                            {speaking.slides && (
                              <a
                                href={speaking.slides}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary text-text-primary hover:bg-bg-secondary/80 transition-colors text-sm font-medium border border-border-light"
                              >
                                <FaFileAlt className="h-3 w-3" />
                                View Slides
                              </a>
                            )}
                            {speaking.recording && (
                              <a
                                href={speaking.recording}
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
          {SPEAKING_ENGAGEMENTS.length === 0 && (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-secondary text-text-muted">
                  <FaMicrophone className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                No speaking engagements yet
              </h2>
              <p className="text-text-secondary mb-6">
                Check back soon for upcoming talks and events!
              </p>
            </div>
          )}

          {/* Speaking Types Stats */}
          {SPEAKING_ENGAGEMENTS.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border-light">
              <h2 className="text-2xl font-bold text-text-primary mb-8 text-center">
                Speaking Experience
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
                {Object.entries(typeIcons).map(([type, Icon]) => {
                  const count = SPEAKING_ENGAGEMENTS.filter(s => s.type === type).length;
                  const colorClass = typeColors[type as keyof typeof typeColors];
                  
                  return (
                    <div
                      key={type}
                      className="p-6 rounded-lg bg-bg-secondary text-center"
                    >
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colorClass} mb-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-3xl font-bold text-text-primary mb-1">
                        {count}
                      </div>
                      <p className="text-sm font-medium text-text-secondary capitalize">
                        {type}{count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
