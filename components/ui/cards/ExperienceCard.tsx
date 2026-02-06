"use client";

import { FaBriefcase, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ExperienceDto } from "@/lib/api-types";
import { Badge } from "@/components/ui";
import { Card } from "./Card";

interface ExperienceCardProps {
  experience: ExperienceDto;
  className?: string;
}

function CompanyLogo({
  logo,
  alt,
}: {
  logo?: { light: string; dark: string } | null;
  alt: string;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!logo) return <FaBriefcase className="h-6 w-6" />;

  if (!mounted) {
    return <div className="w-full h-full relative" />;
  }

  const theme = resolvedTheme ?? "light";
  const src = theme === "dark" ? logo.light : logo.dark;

  return (
    <div className="w-full h-full relative">
      <Image
        key={src}
        src={src}
        alt={alt}
        fill
        className="object-contain p-2"
      />
    </div>
  );
}

export function ExperienceCard({ experience, className }: ExperienceCardProps) {
  return (
    <Card variant="elevated" hover className={className}>
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Icon */}
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue overflow-hidden">
          <CompanyLogo logo={experience.logo} alt={experience.company} />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
            <h3 className="text-xl font-bold text-text-primary">
              {experience.title}
            </h3>
          </div>

          {/* Company */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {experience.url ? (
              <a
                href={experience.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-accent-blue transition-colors inline-flex items-center gap-1 font-medium"
              >
                {experience.company}
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
            ) : (
              <span className="font-medium text-text-primary">
                {experience.company}
              </span>
            )}
          </div>

          {/* Date */}
          <p className="text-base text-text-muted mb-3">{experience.period}</p>

          {/* Description */}
          <p className="text-base text-text-secondary mb-4 whitespace-pre-line">
            {experience.description}
          </p>

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <Badge key={tech} variant="primary" size="base">
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
