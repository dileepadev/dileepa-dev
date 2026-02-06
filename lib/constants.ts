// ============================================
// Constants and Site Data - dileepa.dev
// ============================================

import type { NavLink, AboutWhatIDoItem } from "./types";

// Site Configuration
export const SITE_CONFIG = {
  name: "Dileepa Bandara",
  title: "Dileepa Bandara | AI Engineer",
  description:
    "Personal website of Dileepa Bandara - AI Engineer, Developer, and Tech Enthusiast. Explore my portfolio, experience, and connect with me.",
  url: "https://dileepa.dev",
  email: "contact@dileepa.dev",
  author: "Dileepa Bandara",
  locale: "en_US",
  twitterHandle: "@dileepadev",
} as const;

// Navigation Links
export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Community", href: "#community" },
  { label: "Connect", href: "#connect" },
];

// External Links (for future pages)
export const EXTERNAL_LINKS: NavLink[] = [
  { label: "Blog", href: "/blog", isExternal: false },
  { label: "Projects", href: "/projects", isExternal: false },
  { label: "Videos", href: "/videos", isExternal: false },
  { label: "Events", href: "/events", isExternal: false },
];

export const ABOUT_WHAT_I_DO: AboutWhatIDoItem[] = [
  {
    icon: "FaRobot",
    title: "AI Engineering",
    desc: "Design, build, and deploy AI solutions",
  },
  {
    icon: "FaServer",
    title: "Cloud & Backend",
    desc: "Build APIs, serverless systems, and infrastructure",
  },
  {
    icon: "FaCodeBranch",
    title: "Open Source",
    desc: "Contribute to open-source projects and mentor others",
  },
  {
    icon: "FaMicrophone",
    title: "Events",
    desc: "Speak at tech events and foster community",
  },
];
