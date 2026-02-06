"use client";

import {
  Container,
  Section,
  SectionHeader,
  EducationCard,
} from "@/components/ui";
import { EducationDto } from "@/lib/api-types";
import { motion } from "framer-motion";

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
              <EducationCard education={edu} className="h-full" />
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
