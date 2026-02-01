// ============================================
// Constants and Site Data - dileepa.dev
// ============================================

import type { 
  NavLink, 
  SocialLink, 
  Experience, 
  Education, 
  Community,
  Skill,
  AboutWhatIDoItem,
  AboutSectionConfig,
  VideoItem,
  SpeakingEngagement,
  BlogPost
} from './types';

// Site Configuration
export const SITE_CONFIG = {
  name: 'Dileepa Bandara',
  title: 'Dileepa Bandara | Software Engineer & Developer',
  description: 'Personal website of Dileepa Bandara - Software Engineer, Developer, and Tech Enthusiast. Explore my portfolio, experience, and connect with me.',
  url: 'https://dileepa.dev',
  email: 'contact@dileepa.dev',
  author: 'Dileepa Bandara',
  locale: 'en_US',
  twitterHandle: '@dileepadev',
} as const;

// Navigation Links
export const NAV_LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Community', href: '#community' },
  { label: 'Connect', href: '#connect' },
];

// External Links (for future pages)
export const EXTERNAL_LINKS: NavLink[] = [
  { label: 'Blog', href: '/blog', isExternal: false },
  { label: 'Projects', href: '/projects', isExternal: false },
  { label: 'Videos', href: '/videos', isExternal: false },
  { label: 'Speaking', href: '/public-speaking', isExternal: false },
];

// Social Links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    href: 'https://github.com/dileepadev',
    icon: 'FaGithub',
    username: '@dileepadev',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/dileepadev',
    icon: 'FaLinkedin',
    username: 'dileepadev',
  },
  {
    name: 'X (Twitter)',
    href: 'https://twitter.com/dileepadev',
    icon: 'FaXTwitter',
    username: '@dileepadev',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@dileepadev',
    icon: 'FaYoutube',
    username: '@dileepadev',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/dileepadev',
    icon: 'FaInstagram',
    username: '@dileepadev',
  },
  {
    name: 'Email',
    href: 'mailto:contact@dileepa.dev',
    icon: 'FaEnvelope',
    username: 'contact@dileepa.dev',
  },
];

// Experience Data (Sample - Replace with actual data)
export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    role: 'Software Engineer',
    company: 'Tech Company',
    companyUrl: 'https://example.com',
    location: 'Remote',
    type: 'full-time',
    startDate: 'Jan 2024',
    endDate: 'Present',
    description: 'Building scalable web applications and contributing to open-source projects.',
    achievements: [
      'Led development of key product features',
      'Improved application performance by 40%',
      'Mentored junior developers',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Azure'],
  },
  {
    id: 'exp-2',
    role: 'Full Stack Developer',
    company: 'Another Company',
    companyUrl: 'https://example.com',
    location: 'Colombo, Sri Lanka',
    type: 'full-time',
    startDate: 'Jun 2022',
    endDate: 'Dec 2023',
    description: 'Developed and maintained web applications using modern technologies.',
    achievements: [
      'Built REST APIs serving 10k+ daily requests',
      'Implemented CI/CD pipelines',
      'Collaborated with cross-functional teams',
    ],
    technologies: ['Next.js', 'Python', 'PostgreSQL', 'Docker'],
  },
];

// Education Data (Sample - Replace with actual data)
export const EDUCATION: Education[] = [
  {
    id: 'edu-1',
    degree: 'Master of Science',
    field: 'Computer Science',
    institution: 'University Name',
    institutionUrl: 'https://example.edu',
    location: 'Sri Lanka',
    startDate: '2024',
    endDate: 'Present',
    description: 'Focusing on AI/ML and distributed systems.',
    achievements: ['Research in machine learning applications'],
  },
  {
    id: 'edu-2',
    degree: 'Bachelor of Science',
    field: 'Information Technology',
    institution: 'Another University',
    institutionUrl: 'https://example.edu',
    location: 'Sri Lanka',
    startDate: '2018',
    endDate: '2022',
    description: 'Specialized in software engineering and web development.',
    achievements: [
      'First Class Honours',
      'Led university tech club',
    ],
  },
];

// Community Data (Sample - Replace with actual data)
export const COMMUNITIES: Community[] = [
  {
    id: 'com-1',
    name: 'Microsoft Learn Student Ambassadors',
    role: 'Gold Ambassador',
    description: 'Organizing workshops, creating content, and mentoring students in technology.',
    url: 'https://studentambassadors.microsoft.com',
    type: 'organizing',
    startDate: '2021',
    endDate: 'Present',
  },
  {
    id: 'com-2',
    name: 'AI Community Sri Lanka',
    role: 'Community Organizer',
    description: 'Hosting tech events and fostering the AI community.',
    url: 'https://aicommunity.lk',
    type: 'organizing',
    startDate: '2022',
    endDate: 'Present',
  },
  {
    id: 'com-3',
    name: 'Tech Conference',
    role: 'Speaker',
    description: 'Sharing knowledge on web development and cloud technologies.',
    type: 'speaking',
    startDate: '2023',
  },
];

// Skills Data
export const SKILLS: Skill[] = [
  // Languages
  { name: 'TypeScript', category: 'language', level: 'advanced' },
  { name: 'JavaScript', category: 'language', level: 'advanced' },
  { name: 'Python', category: 'language', level: 'advanced' },
  { name: 'C#', category: 'language', level: 'intermediate' },
  { name: 'Dart', category: 'language', level: 'intermediate' },
  
  // Frameworks
  { name: 'React', category: 'framework', level: 'advanced' },
  { name: 'Next.js', category: 'framework', level: 'advanced' },
  { name: 'Node.js', category: 'framework', level: 'advanced' },
  { name: 'Flutter', category: 'framework', level: 'intermediate' },
  { name: '.NET', category: 'framework', level: 'intermediate' },
  
  // Tools
  { name: 'Git', category: 'tool', level: 'advanced' },
  { name: 'Docker', category: 'tool', level: 'intermediate' },
  { name: 'VS Code', category: 'tool', level: 'expert' },
  
  // Platforms
  { name: 'Azure', category: 'platform', level: 'advanced' },
  { name: 'Vercel', category: 'platform', level: 'advanced' },
  { name: 'GitHub', category: 'platform', level: 'expert' },
  
  // Databases
  { name: 'PostgreSQL', category: 'database', level: 'intermediate' },
  { name: 'MongoDB', category: 'database', level: 'intermediate' },
  { name: 'Azure Cosmos DB', category: 'database', level: 'intermediate' },
];

// Personal Info for About Section
export const ABOUT_INFO = {
  greeting: 'Hello, I\'m',
  name: 'Dileepa Bandara',
  tagline: 'Software Engineer & Developer',
  bio: `I'm a passionate software engineer with expertise in building modern web applications 
  and cloud solutions. I love creating elegant, efficient, and user-friendly software that 
  makes a difference. When I'm not coding, you'll find me contributing to open-source 
  projects, speaking at tech events, or mentoring aspiring developers.`,
  shortBio: `Software engineer passionate about web development, cloud technologies, and open-source.`,
  location: 'Sri Lanka',
  availability: 'Open to opportunities',
  resumeUrl: '/resume.pdf',
  profileImage: '/profile.webp',
};

// About Section – centralized content (header + what I do)
export const ABOUT_SECTION: AboutSectionConfig = {
  subtitle: 'About',
  title: 'Who I Am',
  description: 'Get to know me better and discover what drives my passion for technology.',
};

export const ABOUT_WHAT_I_DO: AboutWhatIDoItem[] = [
  { icon: 'FaGlobe', title: 'Web Development', desc: 'React, Next.js & modern stacks' },
  { icon: 'FaServer', title: 'Cloud & Backend', desc: 'Azure, serverless, APIs' },
  { icon: 'FaCodeBranch', title: 'Open Source', desc: 'Contributing & mentoring' },
  { icon: 'FaMicrophone', title: 'Speaking', desc: 'Tech events & community' },
];

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  language: 'Languages',
  framework: 'Frameworks',
  platform: 'Platforms',
  database: 'Databases',
  tool: 'Tools',
  other: 'Other',
};

// Videos Data
export const VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Building Modern Web Apps with Next.js 15',
    description: 'A comprehensive guide to building production-ready applications with Next.js 15, covering server components, app router, and best practices.',
    url: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    date: '2025-12-15',
    platform: 'YouTube',
    duration: '45:23',
    views: '12.5K',
    category: 'Web Development',
  },
  {
    id: 'vid-2',
    title: 'Azure Cosmos DB: A Complete Guide',
    description: 'Deep dive into Azure Cosmos DB, exploring partition strategies, consistency levels, and real-world use cases.',
    url: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    date: '2025-11-20',
    platform: 'YouTube',
    duration: '38:17',
    views: '8.2K',
    category: 'Cloud & Database',
  },
  {
    id: 'vid-3',
    title: 'TypeScript Advanced Patterns',
    description: 'Master advanced TypeScript patterns including utility types, generics, and type-safe APIs.',
    url: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    date: '2025-10-05',
    platform: 'YouTube',
    duration: '52:40',
    views: '15.8K',
    category: 'TypeScript',
  },
  {
    id: 'vid-4',
    title: 'GitHub Copilot Tips & Tricks',
    description: 'Learn how to maximize your productivity with GitHub Copilot and AI-assisted development.',
    url: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    date: '2025-09-18',
    platform: 'YouTube',
    duration: '28:45',
    views: '9.3K',
    category: 'Developer Tools',
  },
  {
    id: 'vid-5',
    title: 'React Server Components Explained',
    description: 'Understanding React Server Components and how they revolutionize data fetching in modern React applications.',
    url: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    date: '2025-08-22',
    platform: 'YouTube',
    duration: '41:12',
    views: '18.7K',
    category: 'React',
  },
];

// Speaking Engagements Data
export const SPEAKING_ENGAGEMENTS: SpeakingEngagement[] = [
  {
    id: 'speak-1',
    title: 'The Future of Web Development',
    event: 'DevFest 2025',
    description: 'Exploring emerging trends in web development, from server components to edge computing, and what they mean for developers.',
    date: '2025-11-15',
    location: 'Colombo, Sri Lanka',
    type: 'conference',
    url: '#',
    slides: '/slides/future-web-dev.pdf',
    recording: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    audience: '500+',
  },
  {
    id: 'speak-2',
    title: 'Building Scalable APIs with Azure',
    event: 'Azure Community Day',
    description: 'A hands-on workshop on designing and deploying scalable, production-ready APIs using Azure Functions and Cosmos DB.',
    date: '2025-10-08',
    location: 'Virtual',
    type: 'workshop',
    url: '#',
    slides: '/slides/azure-apis.pdf',
    recording: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    audience: '200+',
  },
  {
    id: 'speak-3',
    title: 'AI-Powered Development with GitHub Copilot',
    event: 'GitHub Universe 2025',
    description: 'Demonstrating how AI tools like GitHub Copilot are transforming the developer workflow and improving productivity.',
    date: '2025-09-22',
    location: 'San Francisco, USA',
    type: 'conference',
    url: '#',
    slides: '/slides/ai-dev-copilot.pdf',
    thumbnailUrl: '/placeholder.webp',
    audience: '1000+',
  },
  {
    id: 'speak-4',
    title: 'TypeScript Best Practices',
    event: 'TypeScript Meetup',
    description: 'Sharing battle-tested TypeScript patterns and best practices for building maintainable applications.',
    date: '2025-08-14',
    location: 'Colombo, Sri Lanka',
    type: 'meetup',
    slides: '/slides/typescript-best-practices.pdf',
    recording: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    audience: '80+',
  },
  {
    id: 'speak-5',
    title: 'Tech Career Growth & Mentorship',
    event: 'Developer Stories Podcast',
    description: 'Discussing career growth strategies, mentorship, and navigating the tech industry as a software engineer.',
    date: '2025-07-30',
    location: 'Virtual',
    type: 'podcast',
    url: '#',
    recording: 'https://youtube.com/@dileepadev',
    thumbnailUrl: '/placeholder.webp',
    audience: 'Podcast',
  },
];

// Blog Posts Data
export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Mastering Next.js 15: A Deep Dive',
    excerpt: 'Explore the powerful new features in Next.js 15 and learn how to leverage them to build faster, more efficient web applications.',
    coverImage: '/placeholder.webp',
    date: '2025-12-20',
    readTime: '12 min read',
    tags: ['Next.js', 'React', 'Web Development'],
    slug: 'mastering-nextjs-15',
    published: true,
  },
  {
    id: 'blog-2',
    title: 'Azure Cosmos DB: Choosing the Right Partition Key',
    excerpt: 'Learn how to select the optimal partition key for your Azure Cosmos DB containers to maximize performance and minimize costs.',
    coverImage: '/placeholder.webp',
    date: '2025-11-28',
    readTime: '8 min read',
    tags: ['Azure', 'Cosmos DB', 'Database', 'Cloud'],
    slug: 'azure-cosmosdb-partition-key',
    published: true,
  },
  {
    id: 'blog-3',
    title: 'TypeScript Generic Patterns for Real-World Apps',
    excerpt: 'Discover practical TypeScript generic patterns that will make your code more reusable, type-safe, and maintainable.',
    coverImage: '/placeholder.webp',
    date: '2025-10-15',
    readTime: '10 min read',
    tags: ['TypeScript', 'Programming', 'Best Practices'],
    slug: 'typescript-generic-patterns',
    published: true,
  },
  {
    id: 'blog-4',
    title: 'Building a Developer Portfolio That Stands Out',
    excerpt: 'Tips and strategies for creating a compelling developer portfolio that showcases your skills and attracts opportunities.',
    coverImage: '/placeholder.webp',
    date: '2025-09-10',
    readTime: '7 min read',
    tags: ['Career', 'Portfolio', 'Personal Branding'],
    slug: 'developer-portfolio-guide',
    published: true,
  },
  {
    id: 'blog-5',
    title: 'The Art of Code Review: Best Practices',
    excerpt: 'A comprehensive guide to conducting effective code reviews that improve code quality and foster team collaboration.',
    coverImage: '/placeholder.webp',
    date: '2025-08-05',
    readTime: '9 min read',
    tags: ['Code Review', 'Best Practices', 'Team Collaboration'],
    slug: 'art-of-code-review',
    published: true,
  },
];

