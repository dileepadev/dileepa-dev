"use client";

import { EventDto } from "@/lib/api-types";
import { Badge } from "@/components/ui";
import { Card } from "./Card";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface EventCardProps {
  event: EventDto;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  return (
    <Card variant="elevated" hover className={className}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col flex-1 p-5">
          {event.format && (
            // Format
            <Badge
              variant="primary"
              size="base"
              className="mb-3 self-start capitalize"
            >
              {event.format}
            </Badge>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-text-secondary text-base mb-4 line-clamp-2 flex-1">
            {event.description}
          </p>

          {/* Date and Location */}
          <div className="flex items-center gap-4 pt-3 border-t border-border-light text-base text-text-muted">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="h-3 w-3" />
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1">
              <FaMapMarkerAlt className="h-3 w-3" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
