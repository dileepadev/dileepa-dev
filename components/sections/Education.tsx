'use client';

import { Container, Section, SectionHeader, Card, Badge } from '@/components/ui';
import { EDUCATION } from '@/lib/constants';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaExternalLinkAlt, FaTrophy } from 'react-icons/fa';

export function Education() {
  return (
    <Section id="education" background="secondary">
      <Container>
        <SectionHeader
          subtitle="Education"
          title="Academic Background"
          description="My educational journey and academic achievements."
        />

        <div className="grid gap-8 md:grid-cols-2">
          {EDUCATION.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="elevated" hover className="h-full">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                    <FaGraduationCap className="h-6 w-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Degree */}
                    <h3 className="text-xl font-bold text-text-primary mb-1">
                      {edu.degree}
                    </h3>
                    
                    {/* Field */}
                    <p className="text-lg text-accent-blue font-medium mb-2">
                      {edu.field}
                    </p>

                    {/* Institution */}
                    <div className="flex items-center gap-2 mb-2">
                      {edu.institutionUrl ? (
                        <a
                          href={edu.institutionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-primary hover:text-accent-blue transition-colors inline-flex items-center gap-1"
                        >
                          {edu.institution}
                          <FaExternalLinkAlt className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-text-primary">{edu.institution}</span>
                      )}
                    </div>

                    {/* Location & Duration */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-text-tertiary mb-4">
                      <span>{edu.location}</span>
                      <span>•</span>
                      <span>{edu.startDate} — {edu.endDate}</span>
                    </div>

                    {/* Description */}
                    {edu.description && (
                      <p className="text-text-secondary mb-4">
                        {edu.description}
                      </p>
                    )}

                    {/* Achievements */}
                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="space-y-2">
                        {edu.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <FaTrophy className="h-4 w-4 text-accent-blue shrink-0" />
                            <span className="text-sm text-text-secondary">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status Badge */}
                    {edu.endDate === 'Present' && (
                      <div className="mt-4">
                        <Badge variant="success">Currently Enrolled</Badge>
                      </div>
                    )}
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
