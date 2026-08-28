import type { Metadata } from "next";
import { Container, PagePath, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { PAGES, PAGES_LIST, SITE_CONFIG } from "@/lib/constants";
import { SiteTree, type TreeNode } from "./_components/SiteTree";

export const metadata: Metadata = {
  title: PAGES.sitemap.meta.title,
  description: PAGES.sitemap.meta.description,
  alternates: { canonical: `${SITE_CONFIG.url}/sitemap` },
};

export const revalidate = 300;

export default async function SitemapPage() {
  const [rawPosts, rawProjects, rawEvents] = await Promise.all([
    api.getAllBlogs(),
    api.getProjects({ limit: 200 }),
    api.getEvents({ limit: 200 }),
  ]);

  const posts = rawPosts ?? [];
  const projects = rawProjects ?? [];
  const events = rawEvents ?? [];

  const uniqueTags = Array.from(
    new Set(posts.flatMap((post) => post.tags ?? [])),
  ).sort();

  const tree: TreeNode = {
    id: "root",
    name: "/",
    path: "/",
    title: "dileepa.dev (Home)",
    type: "root",
    badge: "Root",
    children: [
      {
        id: "root/home-sections",
        name: "sections",
        path: "/#top",
        title: "Homepage on-page sections",
        type: "folder",
        badge: "5 sections",
        children: [
          {
            id: "root/home/about",
            name: "#about",
            path: "/#about",
            title: "About — Engineering background & focus pillars",
            type: "section",
            badge: "Section",
          },
          {
            id: "root/home/work",
            name: "#work",
            path: "/#work",
            title: "Work — Employment history, daily stack & projects",
            type: "section",
            badge: "Section",
          },
          {
            id: "root/home/education",
            name: "#education",
            path: "/#education",
            title: "Education — Qualifications & academic history",
            type: "section",
            badge: "Section",
          },
          {
            id: "root/home/community",
            name: "#community",
            path: "/#community",
            title: "Community — Leadership, talks, writing & videos",
            type: "section",
            badge: "Section",
          },
          {
            id: "root/home/contact",
            name: "#contact",
            path: "/#contact",
            title: "Contact — Direct inquiry form & communication channels",
            type: "section",
            badge: "Section",
          },
        ],
      },
      {
        id: "root/projects",
        name: "projects",
        path: "/projects",
        title: PAGES.projects.title,
        type: "folder",
        badge: `${projects.length} projects`,
        children: projects.map((proj) => ({
          id: `root/projects/${proj.slug}`,
          name: proj.slug,
          path: `/projects/${proj.slug}`,
          title: proj.name,
          type: "project" as const,
          badge: proj.status === "active" ? "Active" : "Project",
        })),
      },
      {
        id: "root/events",
        name: "events",
        path: "/events",
        title: PAGES.events.title,
        type: "folder",
        badge: `${events.length} events`,
        children: events.map((ev) => ({
          id: `root/events/${ev.slug}`,
          name: ev.slug,
          path: `/events/${ev.slug}`,
          title: ev.title,
          type: "event" as const,
          badge: ev.status === "upcoming" ? "Upcoming" : "Event",
        })),
      },
      {
        id: "root/blog",
        name: "blog",
        path: "/blog",
        title: PAGES.blog.title,
        type: "folder",
        badge: `${posts.length} posts`,
        children: [
          ...posts.map((post) => ({
            id: `root/blog/${post.slug}`,
            name: post.slug,
            path: post.path || `/blog/${post.slug}`,
            title: post.title,
            type: "post" as const,
            badge: `${post.readingTimeMinutes ?? 5} min read`,
          })),
          {
            id: "root/blog/tags",
            name: "tags",
            path: "/blog",
            title: "Topic & technology taxonomy",
            type: "folder",
            badge: `${uniqueTags.length} tags`,
            children: uniqueTags.map((tag) => ({
              id: `root/blog/tags/${tag}`,
              name: tag,
              path: `/blog/tags/${encodeURIComponent(tag)}`,
              title: `Posts tagged ${tag}`,
              type: "tag" as const,
              badge: "Tag",
            })),
          },
          {
            id: "root/blog/rss",
            name: "rss.xml",
            path: "/blog/rss.xml",
            title: "RSS 2.0 Syndication Feed",
            type: "feed",
            badge: "XML",
          },
        ],
      },
      {
        id: "root/communities",
        name: "communities",
        path: "/communities",
        title: PAGES.communities.title,
        type: "page",
        badge: "Page",
      },
      {
        id: "root/videos",
        name: "videos",
        path: "/videos",
        title: PAGES.videos.title,
        type: "page",
        badge: "Page",
      },
      {
        id: "root/gallery",
        name: "gallery",
        path: "/gallery",
        title: PAGES.gallery.title,
        type: "page",
        badge: "Page",
      },
      {
        id: "root/brand",
        name: "brand",
        path: "/brand",
        title: PAGES.brand.title,
        type: "page",
        badge: "Reference",
      },
      {
        id: "root/sitemap",
        name: "sitemap",
        path: "/sitemap",
        title: PAGES.sitemap.title,
        type: "page",
        badge: "Page",
      },
      {
        id: "root/privacy",
        name: "privacy",
        path: "/privacy",
        title: PAGES.privacy.title,
        type: "page",
        badge: "Legal",
      },
      {
        id: "root/terms",
        name: "terms",
        path: "/terms",
        title: PAGES.terms.title,
        type: "page",
        badge: "Legal",
      },
      {
        id: "root/sitemap-xml",
        name: "sitemap.xml",
        path: "/sitemap.xml",
        title: "Sitemap Protocol XML Feed",
        type: "feed",
        badge: "XML",
      },
      {
        id: "root/robots",
        name: "robots.txt",
        path: "/robots.txt",
        title: "Crawler & Search Engine Rules",
        type: "system",
        badge: "TXT",
      },
      {
        id: "root/llms",
        name: "llms.txt",
        path: "/llms.txt",
        title: "LLM & AI Agent Context File",
        type: "system",
        badge: "TXT",
      },
    ],
  };

  function countTotalRoutes(node: TreeNode): number {
    let count = 1;
    if (node.children) {
      for (const child of node.children) {
        count += countTotalRoutes(child);
      }
    }
    return count;
  }

  const totalRoutes = countTotalRoutes(tree);

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/sitemap" />
            </div>
            <div className="section-label">{PAGES.sitemap.label}</div>
            <h1>{PAGES.sitemap.title}</h1>
          </div>
          {totalRoutes > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
              <span className="font-medium text-fg">{totalRoutes}</span>
              <span>Routes</span>
            </div>
          )}
        </div>
        <p className="section-intro">{PAGES.sitemap.intro}</p>

        <div className="mt-8">
          <SiteTree
            tree={tree}
            totalRoutes={totalRoutes}
            pagesList={PAGES_LIST}
          />
        </div>
      </Container>
    </Section>
  );
}
