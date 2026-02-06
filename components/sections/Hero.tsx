"use client";

import Image from "next/image";
import { Container, IconButton, Tooltip } from "@/components/ui";
import { AboutDto } from "@/lib/api-types";
import {
  FaGithub,
  FaLinkedin,
  FaYoutube,
  FaInstagram,
  FaArrowDown,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ElementType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  xtwitter: FaXTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
};

export function Hero({ about }: { about?: AboutDto | null }) {
  const handleScrollDown = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-primary">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-bg-primary/50 to-bg-primary pointer-events-none"
        aria-hidden
      />

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-8 size-28 sm:size-32 md:size-36 rounded-full overflow-hidden ring-2 ring-border-light dark:ring-white/10 shadow-xl"
        >
          {about?.images.profileWebp && (
            <Image
              src={about.images.profileWebp}
              alt={about.name}
              fill
              sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
              className="object-cover"
              priority
            />
          )}
        </motion.div>

        {/* Terminal-style prompt line */}
        <Tooltip
          content={
            "You've opened my terminal. I'm a developer. Let me show you what I can do."
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 font-mono text-base sm:text-lg text-text-muted mb-6 cursor-default"
            tabIndex={0}
          >
            <span className="text-accent-blue select-none">$</span>
            <span className="text-text-tertiary">dileepadev</span>
            <span
              className="inline-flex h-4 w-0.5 bg-accent-blue ml-0.5 animate-pulse"
              aria-hidden
            />
          </motion.div>
        </Tooltip>

        {/* Name: single bold line */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-text-primary via-accent-blue to-accent-purple mb-8 animate-fade-in tracking-tight"
        >
          {about?.name}
        </motion.h1>

        {/* Tagline with monospace accent */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="font-mono font-semibold text-xl sm:text-2xl text-text-muted tracking-wide mb-6"
        >
          {about?.title}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-text-tertiary text-lg md:text-xl max-w-lg mb-10"
        >
          {about?.tagline}
        </motion.p>

        {/* Availability chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-elevated border border-border-light text-text-secondary text-xs font-medium uppercase tracking-wider">
            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            Open for opportunities
          </span>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="flex items-center gap-5 text-text-muted mt-8"
        >
          {about?.links &&
            Object.entries(about.links).map(([key, url]) => {
              if (key === "website" || key === "email") return null;
              if (!url) return null;

              const platformKey = key.toLowerCase();
              const IconComponent = iconMap[platformKey];

              if (!IconComponent) return null;

              return (
                <IconButton
                  key={key}
                  href={url}
                  external
                  variant="ghost"
                  className="hover:text-accent-blue hover:bg-transparent"
                  aria-label={key}
                >
                  <IconComponent className="size-5" />
                </IconButton>
              );
            })}
        </motion.div>
      </Container>

      {/* Scroll */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-text-muted hover:text-accent-blue transition-colors"
        aria-label="Scroll to content"
      >
        <FaArrowDown className="size-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
