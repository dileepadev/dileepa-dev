'use client';

import Image from 'next/image';
import { Container, Section, SectionHeader, Badge } from '@/components/ui';
import {
  ABOUT_INFO,
  ABOUT_SECTION,
  ABOUT_WHAT_I_DO,
  SKILLS,
  SKILL_CATEGORY_LABELS,
} from '@/lib/constants';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaCode,
  FaCloud,
  FaDatabase,
  FaTools,
  FaGlobe,
  FaServer,
  FaCodeBranch,
  FaMicrophone,
} from 'react-icons/fa';

const categoryIcons: Record<string, React.ElementType> = {
  language: FaCode,
  framework: FaCode,
  platform: FaCloud,
  database: FaDatabase,
  tool: FaTools,
  other: FaTools,
};

const whatIDoIconMap: Record<string, React.ElementType> = {
  FaGlobe,
  FaServer,
  FaCodeBranch,
  FaMicrophone,
};

export function About() {
  const skillsByCategory = SKILLS.reduce((acc, skill) => {
    const category = skill.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof SKILLS>);

  // Render order for skills to make grid look nice
  const skillOrder = ['language', 'framework', 'database', 'platform', 'tool', 'other'];

  return (
    <Section id="about" background="secondary">
      <Container>
        <SectionHeader
          subtitle={ABOUT_SECTION.subtitle}
          title={ABOUT_SECTION.title}
          description={ABOUT_SECTION.description}
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
              className="relative shrink-0 w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-bg-tertiary shadow-2xl ring-4 ring-white/10 dark:ring-white/5 order-start lg:order-first"
            >
              <Image
                src={ABOUT_INFO.profileImage}
                alt={ABOUT_INFO.name}
                fill
                sizes="(max-width: 768px) 256px, 320px"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex-1 text-center lg:text-left space-y-6 max-w-2xl"
            >
              <div className="flex justify-center lg:justify-start">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium border border-accent-blue/20">
                  <FaMapMarkerAlt className="h-3.5 w-3.5" />
                  Work from {ABOUT_INFO.location}
                </span>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary">
                  Building digital experiences that matter.
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {ABOUT_INFO.bio}
                </p>
                <p className="text-base text-text-tertiary leading-relaxed">
                  {ABOUT_INFO.shortBio}
                </p>
              </div>
            </motion.div>
          </div>

          {/* What I Do Grid */}
          <div className="space-y-10">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center"
            >
              <h3 className="font-mono text-sm uppercase tracking-widest text-accent-blue">What I Do</h3>
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
                    <div className="h-12 w-12 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-accent-blue group-hover:text-white transition-all duration-300 text-accent-blue">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-semibold text-text-primary mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-text-tertiary leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Skills Grid */}
          <div className="space-y-10">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center"
            >
              <h3 className="font-mono text-sm uppercase tracking-widest text-accent-blue">Tech Stack</h3>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {skillOrder.map((key, i) => {
                const skills = skillsByCategory[key];
                if (!skills) return null;
                const Icon = categoryIcons[key] || FaTools;
                const label = SKILL_CATEGORY_LABELS[key] || key;
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-bg-primary/50 rounded-2xl p-6 border border-border-light dark:border-white/5 backdrop-blur-sm hover:border-accent-blue/20 transition-colors ring-2 ring-white/10 dark:ring-white/5"
                  >
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-light dark:border-white/5">
                      <Icon className="h-5 w-5 text-accent-blue" />
                      <h4 className="font-semibold text-text-primary capitalize">{label}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {skills.map(skill => (
                          <Badge 
                            key={skill.name} 
                            variant="secondary"
                            className="bg-bg-tertiary hover:bg-accent-blue/10 hover:text-accent-blue transition-colors cursor-default ring-4 ring-white/10 dark:ring-white/5"
                          >
                            {skill.name}
                          </Badge>
                       ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
