// ============================================
// Type Definitions - dileepa.dev
// ============================================

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

// Social Link Types
export interface SocialLink {
  name: string;
  href: string;
  icon: string;
  username?: string;
}

// Experience Types
export interface Experience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "freelance" | "internship";
  startDate: string;
  endDate: string | "Present";
  description: string;
  achievements?: string[];
  technologies?: string[];
  logo?: string;
}

// Education Types
export interface Education {
  id: string;
  degree: string;
  field: string;
  institution: string;
  institutionUrl?: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description?: string;
  achievements?: string[];
  logo?: string;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  role: string;
  description: string;
  url?: string;
  logo?: string;
  type: "speaking" | "organizing" | "mentoring" | "contributing" | "membership";
  startDate?: string;
  endDate?: string | "Present";
}

// Skill Types
export interface Skill {
  name: string;
  category:
    | "language"
    | "framework"
    | "tool"
    | "platform"
    | "database"
    | "other";
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  icon?: string;
}

// About Section Types
export interface AboutWhatIDoItem {
  icon: string;
  title: string;
  desc: string;
}

export interface AboutSectionConfig {
  subtitle: string;
  title: string;
  description: string;
}

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  category: string;
  date: string;
}

// Blog Post Types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  coverImage?: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  published: boolean;
}

// Media Types
export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "podcast" | "article" | "presentation";
  url: string;
  thumbnailUrl?: string;
  date: string;
  platform?: string;
}

// Video Types
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  date: string;
  platform: "YouTube" | "Vimeo" | "Other";
  duration?: string;
  views?: string;
  category?: string;
}

// Event Types
export interface EventItem {
  id: string;
  title: string;
  event: string;
  description: string;
  date: string;
  location: string;
  type: "conference" | "workshop" | "meetup" | "webinar" | "podcast";
  url?: string;
  slides?: string;
  recording?: string;
  thumbnailUrl?: string;
  audience?: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Theme Types
export type Theme = "light" | "dark" | "system";

// Section Props
export interface SectionProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

// Button Variants
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

// Card Variants
export type CardVariant = "default" | "elevated" | "outlined" | "ghost";

// SEO Types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
}
