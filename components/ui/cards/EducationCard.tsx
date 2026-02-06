"use client";

import { FaGraduationCap, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EducationDto } from "@/lib/api-types";
import { Card } from "./Card";

interface EducationCardProps {
  education: EducationDto;
  className?: string;
}

function InstitutionLogo({
  logo,
  alt,
}: {
  logo?: { light: string; dark: string } | null;
  alt: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(rafId);
  }, []);

  if (!logo) return <FaGraduationCap className="h-6 w-6" />;

  if (!mounted) {
    return <div className="w-full h-full relative" />;
  }

  return (
    <>
      <div className="dark:hidden w-full h-full relative">
        <Image src={logo.light} alt={alt} fill className="object-contain p-2" />
      </div>
      <div className="hidden dark:block w-full h-full relative">
        <Image src={logo.dark} alt={alt} fill className="object-contain p-2" />
      </div>
    </>
  );
}

export function EducationCard({ education, className }: EducationCardProps) {
  return (
    <Card variant="elevated" hover className={className}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue overflow-hidden">
          <InstitutionLogo logo={education.logo} alt={education.institution} />
        </div>

        {/* Course */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-text-primary mb-1">
            {education.course}
          </h3>

          {/* Institution */}
          <div className="flex items-center gap-2 mb-2">
            {education.url ? (
              <a
                href={education.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-primary hover:text-accent-blue transition-colors font-medium inline-flex items-center gap-1"
              >
                {education.institution}
                <FaExternalLinkAlt className="h-3 w-3" />
              </a>
            ) : (
              <span className="text-text-primary font-medium">
                {education.institution}
              </span>
            )}
          </div>

          {/* Period */}
          <p className="text-base text-text-muted mb-3">{education.period}</p>

          {/* Description */}
          <p className="text-text-secondary whitespace-pre-line">
            {education.description}
          </p>
        </div>
      </div>
    </Card>
  );
}
