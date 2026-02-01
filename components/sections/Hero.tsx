'use client';

import Image from 'next/image';
import { Container, IconButton } from '@/components/ui';
import { ABOUT_INFO, SOCIAL_LINKS } from '@/lib/constants';
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram, FaArrowDown } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaYoutube,
  FaInstagram,
};

export function Hero() {
  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-bg-primary">
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-bg-primary/50 to-bg-primary pointer-events-none" aria-hidden />

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Profile photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-8 size-28 sm:size-32 md:size-36 rounded-full overflow-hidden ring-2 ring-border-light dark:ring-white/10 shadow-xl"
        >
          <Image
            src={ABOUT_INFO.profileImage}
            alt={ABOUT_INFO.name}
            fill
            sizes="(max-width: 640px) 128px, (max-width: 768px) 144px, 160px"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Terminal-style prompt line */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 font-mono text-sm sm:text-base text-text-muted mb-6"
        >
          <span className="text-accent-blue select-none">@</span>
          <span className="text-text-tertiary">dileepadev</span>
          <span className="inline-flex h-4 w-0.5 bg-accent-blue ml-0.5 animate-pulse" aria-hidden />
        </motion.div>

        {/* Name: single bold line */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-text-primary mb-4"
        >
          {ABOUT_INFO.name}
        </motion.h1>

        {/* Tagline with monospace accent */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="font-mono text-sm sm:text-base text-text-muted tracking-wide mb-2"
        >
          {ABOUT_INFO.tagline}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="text-text-tertiary text-base md:text-lg max-w-md mb-10"
        >
          {ABOUT_INFO.shortBio}
        </motion.p>

        {/* Availability chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.45 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg-elevated border border-border-light text-text-secondary text-xs font-medium uppercase tracking-wider">
            <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            {ABOUT_INFO.availability}
          </span>
        </motion.div>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="flex items-center gap-5 text-text-muted mt-8"
        >
          {SOCIAL_LINKS.slice(0, 5).map((social) => {
            const IconComponent = iconMap[social.icon];
            return (
              <IconButton
                key={social.name}
                href={social.href}
                external
                variant="ghost"
                className="hover:text-accent-blue hover:bg-transparent"
                aria-label={social.name}
              >
                {IconComponent && <IconComponent className="size-5" />}
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
