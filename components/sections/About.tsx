"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Container, Section, SectionHeader } from "@/components/ui";
import { ABOUT_WHAT_I_DO } from "@/lib/constants";
import { AboutDto, ToolDto } from "@/lib/api-types";
import { motion } from "framer-motion";
import {
  FaCode,
  FaCodeBranch,
  FaMicrophone,
  FaServer,
  FaGlobe,
  FaRobot,
} from "react-icons/fa";

function ToolLogo({
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

  if (!logo) return null;

  if (!mounted) {
    return <div className="w-full h-full relative" />;
  }

  const theme = resolvedTheme ?? "light";
  const src = theme === "dark" ? logo.light : logo.dark;

  return (
    <div className="w-full h-full relative">
      <Image key={src} src={src} alt={alt} fill className="object-contain" />
    </div>
  );
}

const whatIDoIconMap: Record<string, React.ElementType> = {
  FaGlobe: FaGlobe,
  FaServer: FaServer,
  FaCodeBranch: FaCodeBranch,
  FaMicrophone: FaMicrophone,
  FaRobot: FaRobot,
};

export function About({
  about,
  tools,
}: {
  about?: AboutDto | null;
  tools?: ToolDto[];
}) {
  return (
    <Section id="about" background="secondary">
      <Container>
        <SectionHeader
          subtitle="About"
          title="Who I Am"
          description="Get to know me better and discover what drives my passion for technology."
        />

        <div className="mt-12 md:mt-16 space-y-24">
          {/* Bio Section */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: 0 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              animate={{ rotate: 0 }}
              whileHover={{ rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative shrink-0 w-64 h-64 md:w-80 md:h-100 rounded-2xl overflow-hidden bg-bg-tertiary shadow-2xl ring-4 ring-white/10 dark:ring-white/5 order-start lg:order-first"
            >
              {about?.images.profilePng && (
                <Image
                  src={about.images.profilePng}
                  alt={about.name}
                  fill
                  sizes="(max-width: 768px) 256px, 320px"
                  className="object-cover"
                />
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center lg:text-left space-y-6 max-w-2xl"
            >
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Building intelligent experiences that matter.
                </h3>
                {about?.description &&
                  about.description.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-lg text-text-secondary leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* What I Usually Do Grid */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="font-mono text-lg uppercase tracking-widest text-accent-blue">
                What I Usually Do
              </h3>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {ABOUT_WHAT_I_DO.map((item, i) => {
                const IconComponent = whatIDoIconMap[item.icon] || FaCode;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative p-6 bg-bg-primary rounded-2xl border border-border-light dark:border-white/5 hover:border-accent-blue/30 transition-all duration-300 hover:shadow-xl hover:shadow-accent-blue/5 hover:-translate-y-1 ring-2 ring-white/10 dark:ring-white/5"
                  >
                    <div className="h-12 w-12 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-500 text-accent-blue">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      {item.title}
                    </h4>
                    <p className="text-base text-text-tertiary leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tech I Regularly Use Grid */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="font-mono text-lg uppercase tracking-widest text-accent-blue">
                Tech I Regularly Use
              </h3>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {tools &&
                tools.map((tool, i) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex flex-col items-center justify-center p-4 bg-bg-primary rounded-xl border border-border-light dark:border-white/5 hover:border-accent-blue/30 transition-all duration-300 w-28 h-28"
                  >
                    <div className="relative w-10 h-10 mb-3 transition-all duration-300">
                      <ToolLogo logo={tool.logo} alt={tool.name} />
                    </div>
                    <span className="text-base font-medium text-text-secondary group-hover:text-accent-blue transition-colors text-center">
                      {tool.name}
                    </span>
                  </motion.div>
                ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
