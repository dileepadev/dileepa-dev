// ============================================
// Site configuration and copy
//
// Copy lives here, not inline in components, so the voice can be reviewed in
// one place. Voice rules: dileepadev/docs/brand/voice.md. Plain, specific,
// unhurried — and sentence case in every string a reader sees.
//
// Banned without exception: passionate about, leveraging, cutting-edge,
// revolutionize, game-changing, unlock, seamless, AI enthusiast, thought
// leader, journey, humbled to announce, 10x.
// ============================================

import type { NavLink } from "./types";

export const SITE_CONFIG = {
  name: "Dileepa Bandara",
  title: "Dileepa Bandara — AI engineer",
  // Says what is here and what the person does, without adjectives doing the
  // work. The v1 description opened with "passionate about" and closed on
  // "something amazing together"; both are gone.
  description:
    "AI engineer. Building AI systems and the community around them.",
  // The origin the site is actually served from. Canonical URLs, the sitemap
  // and the RSS feed are all composed from it, so a wrong value here points
  // every canonical tag at somewhere else.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dileepa.dev",
  email: "contact@dileepa.dev",
  author: "Dileepa Bandara",
  locale: "en_US",
  twitterHandle: "@dileepadev",
  // The link-in-bio page. It left the footer when Projects took its place
  // there, and is surfaced in the Contact section instead — a reader
  // looking for somewhere to follow rather than somewhere to read.
  linksUrl: "https://links.dileepa.dev",
  repository: "https://github.com/dileepadev/dileepa-dev",
  branch: "feat/v2.0.0",
  version: "2.0.0",
} as const;

/**
 * Primary navigation.
 *
 * The homepage is the site: everything is a section on it, and the index pages
 * exist for the full lists. So the nav points at sections, not routes — which
 * is what the layout reference does, and why the links are all hashes.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Work", href: "/#work" },
  { label: "Education", href: "/#education" },
  { label: "Community", href: "/#community" },
  { label: "Contact", href: "/#contact" },
];

export const FOOTER_LINKS: { title: string; links: NavLink[] }[] = [
  {
    title: "Site",
    links: [
      { label: "About", href: "/#about" },
      { label: "Work", href: "/#work" },
      { label: "Education", href: "/#education" },
      { label: "Community", href: "/#community" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "Projects", href: "/projects" },
      { label: "Communities", href: "/communities" },
      { label: "Events", href: "/events" },
      { label: "Videos", href: "/videos" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

/**
 * Section copy — one label, one heading, one intro. Design system §6.
 *
 * The label is a plain word rather than a numbered index: numbering sections
 * makes the page claim an order it does not have, and breaks the moment one is
 * added in the middle.
 */
export const SECTIONS = {
  about: {
    label: "About",
    title: "An engineer who builds systems and explains them to a room.",
  },
  work: {
    label: "Work",
    title: "Where I have worked",
    intro:
      "Roles spanning AI engineering, software development, and building production systems.",
  },
  education: {
    label: "Education",
    title: "Academic background",
    intro: "Where I studied and what I learned along the way.",
  },
  community: {
    label: "Community",
    title: "Speaking, writing, building",
    intro:
      "Sharing ideas, bringing developers together, and contributing to the tech community.",
  },
  contact: {
    label: "Contact",
    title: "Let us talk",
    intro:
      "Open to AI engineering roles, workshop invitations, and questions about anything above.",
  },
} as const;

/** Subsection copy, inside Work and Community. */
export const SUBSECTIONS = {
  tools: {
    title: "Tools I reach for",
    note: "The tools behind the systems, experiments, and products I build.",
  },
  projects: {
    title: "Open source projects",
    note: "Projects I build, maintain, and contribute to.",
  },
  communities: {
    title: "Communities",
    note: "Communities I organise with, contribute to, or volunteer for.",
  },
  events: {
    title: "Events",
    note: "Talks and workshops I've delivered, with the most recent first.",
  },
  gallery: {
    title: "Event gallery",
    note: "Moments from events, talks, and workshops I've joined.",
  },

  blogs: {
    title: "Blog",
    note: "Notes I write on AI systems, engineering, and production.",
  },
  videos: {
    title: "Videos",
    note: "Walkthroughs I create on AI systems and software engineering.",
  },
} as const;

/**
 * What the six cards under About say.
 *
 * These represent the core areas of work and activity: AI engineering,
 * open-source projects, public speaking, technical writing, videos,
 * and community volunteering.
 */
export const PILLARS = [
  {
    key: "ai-engineering",
    title: "AI engineering",
    description:
      "Building agentic systems, orchestrating LLM workflows, and designing evaluation pipelines for production applications.",
  },
  {
    key: "open-source",
    title: "Open source",
    description:
      "Developing tools, contributing to projects, and sharing technical implementations across AI and software engineering.",
  },
  {
    key: "public-speaking",
    title: "Public speaking",
    description:
      "Speaking at conferences and meetups, leading technical workshops, and sharing lessons from building AI systems.",
  },
  {
    key: "technical-writing",
    title: "Technical writing",
    description:
      "Writing about agentic systems, engineering practices, and lessons from building AI in production.",
  },
  {
    key: "technical-videos",
    title: "Technical videos",
    description:
      "Creating technical tutorials and walkthroughs on AI systems, software engineering, and cloud infrastructure.",
  },
  {
    key: "community-building",
    title: "Community building",
    description:
      "Organising technical meetups, mentoring engineers, and creating spaces for people and AI agents to learn and build.",
  },
] as const;

/** Copy for pages that can legitimately be empty. */
export const EMPTY_STATES = {
  projects: {
    title: "No projects are published yet.",
    hint: "They appear here once they are marked published in the admin.",
  },
  events: {
    title: "No events are published yet.",
    hint: "Talks and workshops appear here once they are added.",
  },
  posts: {
    title: "No posts are published yet.",
    hint: "New writing appears here as it goes out.",
  },
  tag: {
    title: "No posts carry this tag.",
    hint: "Try another tag, or read everything from the blog index.",
  },
  gallery: {
    title: "No event photographs yet.",
    hint: "They appear here once photos are attached to an event in the admin.",
  },
  communities: {
    title: "No communities are listed yet.",
    hint: "They appear here once they are added in the admin.",
  },
  videos: {
    title: "No videos are listed yet.",
    hint: "Recordings appear here once they are added in the admin.",
  },
} as const;

/**
 * Page copy and metadata for standalone and index routes.
 *
 * Keeping titles, headings, and descriptions in one place guarantees consistent
 * voice (sentence case, no banned buzzwords) and single-source maintainability.
 */
export const PAGES = {
  blog: {
    meta: {
      title: "Blog",
      description: "Notes I write on AI systems, engineering, and production.",
    },
    label: "Blog",
    title: "Writing",
    intro:
      "Notes I write on what I build, what I learn, and what breaks along the way.",
  },

  projects: {
    meta: {
      title: "Projects",
      description: "Things I have built, maintained, and contributed to.",
    },
    label: "Projects",
    title: "Things I have built",
    intro:
      "Projects I have built, with notes on what they do, how they're built, and what I'd change.",
  },

  events: {
    meta: {
      title: "Events",
      description:
        "Workshops and sessions I have delivered at meetups, conferences, and online.",
    },
    label: "Events",
    title: "Workshops and sessions",
    intro:
      "Workshops and sessions I've delivered at meetups, conferences, and online.",
  },

  communities: {
    meta: {
      title: "Communities",
      description:
        "Tech communities I organise with, contribute to, or volunteer for.",
    },
    label: "Communities",
    title: "Communities",
    intro: "Communities I organise with, contribute to, or volunteer for.",
  },

  videos: {
    meta: {
      title: "Videos",
      description:
        "Technical walkthroughs and demos on AI systems and software engineering.",
    },
    label: "Videos",
    title: "Walkthroughs and demos",
    intro:
      "Technical walkthroughs and demos I create on AI systems and software engineering.",
  },

  gallery: {
    meta: {
      title: "Event gallery",
      description:
        "Photos from events, sessions, and workshops I have been part of.",
    },
    label: "Gallery",
    title: "Event photographs",
    intro:
      "Photos from events, sessions, and workshops I've been part of, with the newest first.",
  },

  sitemap: {
    meta: {
      title: "Site tree & architecture",
      description:
        "Interactive directory of the pages, projects, articles, and resources across dileepa.dev.",
    },
    label: "Architecture",
    title: "Site tree & routes",
    intro:
      "A visual directory of every published page, post, project, and resource across dileepa.dev.",
  },

  privacy: {
    meta: {
      title: "Privacy policy",
      description:
        "How your information is collected, used, and protected when you visit dileepa.dev or interact with its forms and comments.",
    },
    label: "Legal",
    title: "Privacy policy",
    intro:
      "A clear, straightforward explanation of what data is collected, how it is handled, and why.",
  },

  terms: {
    meta: {
      title: "Terms of service",
      description:
        "Terms and conditions for using dileepa.dev, reading its articles, and participating in comments and interactive features.",
    },
    label: "Legal",
    title: "Terms of service",
    intro:
      "The rules and guidelines for using this website, its content, and interactive features.",
  },

  brand: {
    meta: {
      title: "Brand & design reference",
      description:
        "Living visual design system, color tokens, typography scale, logo mark, and portrait guidelines for dileepadev.",
    },
    label: "Identity",
    title: "Brand & design reference",
    intro:
      "A living visual reference for the dileepadev identity — colors, typography, mark, photography, and UI patterns.",
  },

  profile: {
    meta: {
      title: "Speaker profile & media kit",
      description:
        "Official speaker biographies, high-resolution headshots, current role, contact details, and keynote topics for event organizers.",
    },
    label: "Speaker kit",
    title: "Speaker profile & media kit",
    intro:
      "A dedicated reference for event organizers, conference committees, and podcast hosts. Includes official bios, photos with instant download, and credentials.",
  },
} as const;

export interface PageSummary {
  key: keyof typeof PAGES;
  path: string;
  label: string;
  title: string;
  intro: string;
  description: string;
  badge: string;
}

/**
 * Ordered list of all standalone pages across the site.
 */
export const PAGES_LIST: PageSummary[] = [
  {
    key: "projects",
    path: "/projects",
    label: PAGES.projects.label,
    title: PAGES.projects.title,
    intro: PAGES.projects.intro,
    description: PAGES.projects.meta.description,
    badge: "Projects",
  },
  {
    key: "events",
    path: "/events",
    label: PAGES.events.label,
    title: PAGES.events.title,
    intro: PAGES.events.intro,
    description: PAGES.events.meta.description,
    badge: "Events",
  },
  {
    key: "blog",
    path: "/blog",
    label: PAGES.blog.label,
    title: PAGES.blog.title,
    intro: PAGES.blog.intro,
    description: PAGES.blog.meta.description,
    badge: "Blog",
  },
  {
    key: "communities",
    path: "/communities",
    label: PAGES.communities.label,
    title: PAGES.communities.title,
    intro: PAGES.communities.intro,
    description: PAGES.communities.meta.description,
    badge: "Community",
  },
  {
    key: "videos",
    path: "/videos",
    label: PAGES.videos.label,
    title: PAGES.videos.title,
    intro: PAGES.videos.intro,
    description: PAGES.videos.meta.description,
    badge: "Videos",
  },
  {
    key: "gallery",
    path: "/gallery",
    label: PAGES.gallery.label,
    title: PAGES.gallery.title,
    intro: PAGES.gallery.intro,
    description: PAGES.gallery.meta.description,
    badge: "Gallery",
  },
  {
    key: "brand",
    path: "/brand",
    label: PAGES.brand.label,
    title: PAGES.brand.title,
    intro: PAGES.brand.intro,
    description: PAGES.brand.meta.description,
    badge: "Reference",
  },
  {
    key: "profile",
    path: "/profile",
    label: PAGES.profile.label,
    title: PAGES.profile.title,
    intro: PAGES.profile.intro,
    description: PAGES.profile.meta.description,
    badge: "Speaker kit",
  },
  {
    key: "sitemap",
    path: "/sitemap",
    label: PAGES.sitemap.label,
    title: PAGES.sitemap.title,
    intro: PAGES.sitemap.intro,
    description: PAGES.sitemap.meta.description,
    badge: "Architecture",
  },
  {
    key: "privacy",
    path: "/privacy",
    label: PAGES.privacy.label,
    title: PAGES.privacy.title,
    intro: PAGES.privacy.intro,
    description: PAGES.privacy.meta.description,
    badge: "Legal",
  },
  {
    key: "terms",
    path: "/terms",
    label: PAGES.terms.label,
    title: PAGES.terms.title,
    intro: PAGES.terms.intro,
    description: PAGES.terms.meta.description,
    badge: "Legal",
  },
];
