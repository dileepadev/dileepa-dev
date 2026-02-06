"use client";

import { EventDto } from "@/lib/api-types";
import { Badge } from "@/components/ui";
import { Card } from "./Card";
import {
  FaMapMarkerAlt,
  FaUsers,
  FaMicrophone,
  FaVideo,
  FaExternalLinkAlt,
  FaFileAlt,
} from "react-icons/fa";

interface EventListCardProps {
  event: EventDto & {
    displayType: string;
    displayEvent: string;
  };
  isLast: boolean;
  className?: string;
}

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

export function EventListCard({
  event,
  isLast,
  className,
}: EventListCardProps) {
  const TypeIcon =
    typeIcons[event.displayType as keyof typeof typeIcons] || FaMicrophone;
  const colorClass =
    typeColors[event.displayType as keyof typeof typeColors] ||
    "bg-accent-blue/10 text-accent-blue";

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Line */}
      {!isLast && (
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
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <Badge variant="default" size="sm">
                  {event.displayType}
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
                {event.displayEvent}
              </div>

              {/* Description */}
              <p className="text-text-secondary mb-6">{event.description}</p>

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
}
