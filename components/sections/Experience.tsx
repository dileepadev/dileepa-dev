"use client";

import {
  Container,
  Section,
  SectionHeader,
  ExperienceCard,
} from "@/components/ui";
import { ExperienceDto } from "@/lib/api-types";
import { motion } from "framer-motion";

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

                <ExperienceCard experience={exp} className="md:ml-16" />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
