"use client";

import { VideoDto } from "@/lib/api-types";
import { Card } from "./Card";
import { FaPlay, FaYoutube } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  video: VideoDto;
  className?: string;
}

export function VideoCard({ video, className }: VideoCardProps) {
  return (
    <Link
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full"
    >
      <Card
        variant="elevated"
        hover
        className={`h-full flex flex-col ${className}`}
      >
        {/* Thumbnail */}
        <div
          className="relative aspect-video overflow-hidden rounded-t-lg"
          style={{
            backgroundImage:
              "linear-gradient(135deg, var(--brand-primary), var(--accent-blue-light))",
          }}
        >
          {video.thumbnail ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaPlay
                className="h-10 w-10 opacity-50"
                style={{ color: "var(--brand-primary)" }}
              />
            </div>
          )}

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full p-3"
              style={{ backgroundColor: "var(--accent-blue)" }}
            >
              <FaPlay
                className="h-5 w-5"
                style={{ color: "var(--brand-primary-dark)" }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center justify-between pt-3 border-t border-border-light text-base text-text-muted mt-auto">
            <span>
              {new Date(video.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>

            <span className="flex items-center gap-1">
              {(() => {
                const platform =
                  video.link &&
                  (video.link.includes("youtube.com") ||
                    video.link.includes("youtu.be"))
                    ? "YouTube"
                    : "Video";
                return (
                  <>
                    {platform === "YouTube" ? (
                      <FaYoutube className="h-5 w-5 text-red-500 mr-1" />
                    ) : (
                      <FaPlay className="h-3 w-3" />
                    )}
                    {platform}
                  </>
                );
              })()}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
