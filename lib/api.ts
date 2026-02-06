import {
  AboutDto,
  ExperienceDto,
  EducationDto,
  CommunityDto,
  ToolDto,
  EventDto,
  VideoDto,
  BlogDto,
} from "./api-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });
    if (!response.ok) {
      console.error(`Error fetching ${endpoint}: ${response.statusText}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export const api = {
  getAbout: () => fetchAPI<AboutDto>("/about"),
  getExperiences: () => fetchAPI<ExperienceDto[]>("/experiences"),
  getEducations: () => fetchAPI<EducationDto[]>("/educations"),
  getCommunities: () => fetchAPI<CommunityDto[]>("/communities"),
  getTools: () => fetchAPI<ToolDto[]>("/tools"),
  getEvents: () => fetchAPI<EventDto[]>("/events"),
  getVideos: () => fetchAPI<VideoDto[]>("/videos"),
  getBlogs: () => fetchAPI<BlogDto[]>("/blogs"),
};

export async function getPortfolioData() {
  const [
    about,
    experiences,
    educations,
    communities,
    tools,
    events,
    videos,
    blogs,
  ] = await Promise.all([
    api.getAbout(),
    api.getExperiences(),
    api.getEducations(),
    api.getCommunities(),
    api.getTools(),
    api.getEvents(),
    api.getVideos(),
    api.getBlogs(),
  ]);

  return {
    about: about || null,
    experiences: experiences || [],
    educations: educations || [],
    communities: communities || [],
    tools: tools || [],
    events: events || [],
    videos: videos || [],
    blogs: blogs || [],
  };
}
