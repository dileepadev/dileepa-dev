"use client";

import { CommunityDto } from "@/lib/api-types";
import { Badge } from "@/components/ui";
import { Card } from "./Card";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";

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
      <div className="flex items-start gap-6 p-5">
        {/* Left: Logo */}
        <div className="shrink-0">
          <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue overflow-hidden relative">
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
              <FaUsers className="h-6 w-6" />
            )}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-text-primary line-clamp-2">
                {community.name}
              </h3>
              <p className="text-base text-accent-blue font-medium mt-1">
                {community.role}
              </p>
            </div>
            <div className="shrink-0">
              <Badge
                variant={community.current ? "success" : "warning"}
                size="base"
              >
                {community.current ? "Current" : "Past"}
              </Badge>
            </div>
          </div>

          {community.description && (
            <p className="text-text-secondary mt-3 text-base line-clamp-3">
              {community.description}
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-border-light text-base text-text-muted flex items-center justify-between">
            <span>{community.period}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
