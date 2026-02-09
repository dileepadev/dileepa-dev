export interface ImageDto {
  bannerWebp: string;
  profilePng: string;
  profileWebp: string;
}

export interface LinksDto {
  website: string;
  email: string;
  github: string;
  linkedin: string;
  xtwitter: string;
  instagram: string;
  youtube: string;
  facebook?: string;
}

export interface AboutDto {
  name: string;
  title: string;
  tagline: string;
  description: string[];
  images: ImageDto;
  links: LinksDto;
  connect: string[];
}

export interface LogoDto {
  light: string;
  dark: string;
}

export interface ExperienceDto {
  _id?: string;
  title: string;
  company: string;
  url: string;
  period: string;
  description: string;
  technologies: string[];
  logo: LogoDto;
  index?: number;
}

export interface EducationDto {
  _id?: string;
  course: string;
  institution: string;
  period: string;
  description: string;
  url: string;
  logo: LogoDto;
  index?: number;
}

export interface EventDto {
  _id?: string;
  title: string;
  date: string;
  location: string;
  format: string;
  description: string;
  event?: string; // Optional field for UI mapping
  type?: string; // Optional field for UI mapping
  url?: string;
  slides?: string;
  recording?: string;
  audience?: string;
  index?: number;
}

export interface VideoDto {
  _id?: string;
  title: string;
  date: string;
  link: string;
  thumbnail: string;
  index?: number;
}

export interface BlogDto {
  _id?: string;
  title: string;
  date: string;
  excerpt: string;
  link: string;
  index?: number;
}

export interface CommunityDto {
  _id?: string;
  name: string;
  role: string;
  period: string;
  communityUrl?: string;
  description: string;
  logo: LogoDto;
  current: boolean;
  index?: number;
}

export interface ToolDto {
  _id?: string;
  name: string;
  logo: LogoDto;
  index?: number;
}
