"use client";

import { Container, Section } from "@/components/ui";
import { AboutDto } from "@/lib/api-types";
import { motion } from "framer-motion";
import Image from "next/image";

export function ThankYou({ about }: { about?: AboutDto | null }) {
  return (
    <Section id="thank-you" background="primary" className="py-12 md:py-16">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-text-primary mb-4">
            Thanks for checking in
          </h3>
          <p className="text-xl text-text-secondary mb-8">
            🧠 Think deeply. Build wisely. Keep your intelligence sharp!
          </p>
          <Image
            src={about?.images.bannerWebp || "/placeholder.webp"}
            alt="Thank You"
            width={1200}
            height={600}
            className="mx-auto mb-6 rounded-lg shadow-lg object-cover"
          />
        </motion.div>
      </Container>
    </Section>
  );
}
