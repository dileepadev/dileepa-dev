'use client';

import { Container, Section, SectionHeader, Card, Badge } from '@/components/ui';
import { EXPERIENCES } from '@/lib/constants';
import { motion } from 'framer-motion';
import { FaBriefcase, FaExternalLinkAlt } from 'react-icons/fa';

export function Experience() {
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
            {EXPERIENCES.map((exp, index) => (
              <motion.div
                key={exp.id}
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

                <Card 
                  variant="elevated" 
                  hover 
                  className="md:ml-16"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Company Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue">
                      <FaBriefcase className="h-6 w-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-text-primary">
                          {exp.role}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={exp.endDate === 'Present' ? 'success' : 'default'}>
                            {exp.type}
                          </Badge>
                        </div>
                      </div>

                      {/* Company & Location */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent-blue hover:underline font-medium inline-flex items-center gap-1"
                          >
                            {exp.company}
                            <FaExternalLinkAlt className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="font-medium text-text-primary">{exp.company}</span>
                        )}
                        <span className="text-text-muted">•</span>
                        <span className="text-text-tertiary">{exp.location}</span>
                      </div>

                      {/* Date */}
                      <p className="text-sm text-text-muted mb-4">
                        {exp.startDate} — {exp.endDate}
                      </p>

                      {/* Description */}
                      <p className="text-text-secondary mb-4">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul className="space-y-2 mb-4">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-text-secondary">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      )}

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
