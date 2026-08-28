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
} as const;
