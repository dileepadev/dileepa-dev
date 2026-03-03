"use client";

import { CommunityDto } from "@/lib/api-types";
import { Badge } from "@/components/ui";
import { Card } from "./Card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUsers, FaExternalLinkAlt } from "react-icons/fa";

interface CommunityListCardProps {
  community: CommunityDto;
  className?: string;
}

export function CommunityListCard({
  community,
  className,
}: CommunityListCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Card variant="elevated" hover className={`h-full ${className}`}>
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6">
        {/* Left: Logo */}
        <div className="shrink-0">
          <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-2xl bg-accent-blue/10 text-accent-blue overflow-hidden relative shadow-inner">
            {community.logo ? (
              mounted ? (
                <>
                  <div className="dark:hidden w-full h-full relative">
                    <Image
                      src={community.logo.light}
                      alt={community.name}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="hidden dark:block w-full h-full relative">
                    <Image
                      src={community.logo.dark}
                      alt={community.name}
                      fill
                      className="object-contain p-3"
                    />
                  </div>
                </>
              ) : (
                <div className="w-full h-full relative" />
              )
            ) : (
              <FaUsers className="h-10 w-10 sm:h-12 sm:w-12" />
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0 text-center sm:text-left w-full">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-text-primary">
                {community.communityUrl ? (
                  <a
                    href={community.communityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-blue transition-colors"
                  >
                    {community.name}
                    <FaExternalLinkAlt className="inline-block h-3 w-3 ml-1 mb-0.5" />
                  </a>
                ) : (
                  community.name
                )}
              </h3>
              <p className="text-lg text-accent-blue font-semibold mt-1">
                {community.role}
              </p>
            </div>
            <div className="flex justify-center sm:justify-start shrink-0">
              <Badge
                variant={community.current ? "active" : "inactive"}
                size="base"
                className="uppercase tracking-wider"
              >
                {community.current ? "Current" : "Past"}
              </Badge>
            </div>
          </div>

          {community.description && (
            <p className="text-text-secondary mt-4 text-base line-clamp-3 leading-relaxed">
              {community.description}
            </p>
          )}

          <div className="mt-6 pt-4 border-t border-border-light text-base text-text-muted flex items-center justify-center sm:justify-between font-medium">
            <span>{community.period}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
