import type { MetadataRoute } from "next";
import { api } from "@/lib/api";
import { SITE_CONFIG } from "@/lib/constants";
import { postUrl } from "@/lib/format";

/**
 * The sitemap covers the blog, projects and events as well as the static
 * routes — the three sections v2.0.0 adds are the ones that most need
 * discovering.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [rawPosts, rawProjects, rawEvents] = await Promise.all([
    api.getAllBlogs(),
    api.getProjects({ limit: 200 }),
    api.getEvents({ limit: 200 }),
  ]);

  const posts = rawPosts ?? [];
  const projects = rawProjects ?? [];
  const events = rawEvents ?? [];

  // The static routes carry no `lastModified` of their own: they have no
  // record behind them to read a date from, and inventing `new Date()` on
  // every build would tell a crawler that all twelve changed every deploy,
  // which is the fastest way to have the field ignored. The dated entries
  // below are the ones where the date is real.
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_CONFIG.url, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_CONFIG.url}/projects`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/events`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_CONFIG.url}/communities`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.url}/videos`,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_CONFIG.url}/gallery`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.url}/brand`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_CONFIG.url}/profile`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_CONFIG.url}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_CONFIG.url}/sitemap`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const tags = new Set(posts.flatMap((post) => post.tags ?? []));

  return [
    ...staticRoutes,
    ...posts.map((post) => ({
      url: postUrl(post),
      lastModified: post.updatedDate ?? post.publishedDate ?? undefined,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...[...tags].map((tag) => ({
      url: `${SITE_CONFIG.url}/blog/tags/${encodeURIComponent(tag)}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...projects.map((project) => ({
      url: `${SITE_CONFIG.url}/projects/${project.slug}`,
      lastModified: project.updatedAt ?? undefined,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...events.map((event) => ({
      url: `${SITE_CONFIG.url}/events/${event.slug}`,
      lastModified: event.updatedAt ?? undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
