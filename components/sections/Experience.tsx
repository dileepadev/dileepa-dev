"use client";

import {
  Container,
  Section,
  SectionHeader,
  Card,
  Badge,
} from "@/components/ui";
import { ExperienceDto } from "@/lib/api-types";
import { motion } from "framer-motion";
import { FaBriefcase, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
    // Defer setting mounted to avoid synchronous setState in effect body
    // and potential cascading renders. Using requestAnimationFrame schedules
    // the update after paint.
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

export function Experience({ experiences }: { experiences?: ExperienceDto[] }) {
  return (
    <Section id="experience" background="primary">
      <Container>
        <SectionHeader
          subtitle="Work Experience"
          title="Where I've Worked"
          description="My professional journey and the companies I've had the pleasure to work with."
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border-light hidden md:block" />

          <div className="space-y-8">
            {experiences?.map((exp, index) => (
              <motion.div
                key={exp._id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-8 w-5 h-5 rounded-full bg-accent-blue border-4 border-bg-primary hidden md:flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                <Card variant="elevated" hover className="md:ml-16">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Company Icon */}
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue overflow-hidden">
                      <CompanyLogo logo={exp.logo} alt={exp.company} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-text-primary">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {/* Type is not available in API, removed Badge */}
                        </div>
                      </div>

                      {/* Company & Location (Location not in API) */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {exp.url ? (
                          <a
                            href={exp.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-primary hover:text-accent-blue transition-colors inline-flex items-center gap-1"
                          >
                            {exp.company}
                            <FaExternalLinkAlt className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="font-medium text-text-primary">
                            {exp.company}
                          </span>
                        )}
                        {/* Location removed */}
                      </div>

                      {/* Date */}
                      <p className="text-sm text-text-muted mb-4">
                        {exp.period}
                      </p>

                      {/* Description */}
                      <p className="text-text-secondary mb-4 whitespace-pre-line">
                        {exp.description}
                      </p>

                      {/* Achievements removed as not in API */}

                      {/* Technologies */}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech) => (
                            <Badge key={tech} variant="primary" size="sm">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
