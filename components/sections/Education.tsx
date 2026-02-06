"use client";

import { Container, Section, SectionHeader, Card } from "@/components/ui";
import { EducationDto } from "@/lib/api-types";
import { motion } from "framer-motion";
import { FaGraduationCap, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

export function Education({ educations }: { educations?: EducationDto[] }) {
  return (
    <Section id="education" background="secondary">
      <Container>
        <SectionHeader
          subtitle="Education"
          title="Academic Background"
          description="My educational journey and academic achievements."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {educations?.map((edu, index) => (
            <motion.div
              key={edu._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="elevated" hover className="h-full">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue overflow-hidden">
                    {edu.logo ? (
                      <>
                        <div className="dark:hidden w-full h-full relative">
                          <Image
                            src={edu.logo.light}
                            alt={edu.institution}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="hidden dark:block w-full h-full relative">
                          <Image
                            src={edu.logo.dark}
                            alt={edu.institution}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      </>
                    ) : (
                      <FaGraduationCap className="h-6 w-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Degree/Course */}
                    <h3 className="text-xl font-bold text-text-primary mb-1">
                      {edu.course}
                    </h3>

                    {/* Field removed as not available separately */}

                    {/* Institution */}
                    <div className="flex items-center gap-2 mb-2">
                      {edu.url ? (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-primary hover:text-accent-blue transition-colors inline-flex items-center gap-1"
                        >
                          {edu.institution}
                          <FaExternalLinkAlt className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-text-primary">
                          {edu.institution}
                        </span>
                      )}
                    </div>

                    {/* Duration (Location not available) */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary mb-4">
                      <span>{edu.period}</span>
                    </div>

                    {/* Description */}
                    {edu.description && (
                      <p className="text-text-secondary mb-4 whitespace-pre-line">
                        {edu.description}
                      </p>
                    )}

                    {/* Achievements removed */}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
