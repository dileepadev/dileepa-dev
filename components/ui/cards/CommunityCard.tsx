"use client";

import { CommunityDto } from "@/lib/api-types";
import { Badge } from "@/components/ui";
import { Card } from "./Card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUsers, FaExternalLinkAlt } from "react-icons/fa";

interface CommunityCardProps {
  community: CommunityDto;
  className?: string;
}

const IconComponent = FaUsers;

export function CommunityCard({ community, className }: CommunityCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <Card variant="elevated" hover className={className}>
      <div className="flex items-start gap-4 mb-4">
        {/* Logo */}
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue overflow-hidden">
          {community.logo ? (
            mounted ? (
              <>
                <div className="dark:hidden w-full h-full relative">
                  <Image
                    src={community.logo.light}
                    alt={community.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="hidden dark:block w-full h-full relative">
                  <Image
                    src={community.logo.dark}
                    alt={community.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </>
            ) : (
              <div className="w-full h-full relative" />
            )
          ) : (
            <IconComponent className="h-5 w-5" />
          )}
        </div>
        {/* Name and Role */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-text-primary line-clamp-2 mb-1">
            {community.communityUrl ? (
              <a
                href={community.communityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-blue transition-colors inline-flex items-center gap-1"
              >
                {community.name}
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
            ) : (
              community.name
            )}
          </h3>
          <p className="text-base text-accent-blue font-medium">
            {community.role}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-base text-text-secondary flex-1 mb-4">
        {community.description}
      </p>

      {/* Footer - Status and Period */}
      <div className="flex items-center justify-between pt-4 border-t border-border-light">
        <div className="flex items-center gap-2">
          <Badge
            variant={community.current ? "active" : "inactive"}
            size="base"
          >
            {community.current ? "Current" : "Past"}
          </Badge>
          {community.period && (
            <span className="text-base text-text-muted">
              {community.period}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
