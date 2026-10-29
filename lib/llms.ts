import { api } from "@/lib/api";
import type {
  BlogPost,
  Community,
  Education,
  EventRecord,
  Experience,
  Project,
  Video,
} from "@/lib/api-types";
import { SITE_CONFIG } from "@/lib/constants";
import { formatDate, formatMonth, paragraphs, postUrl } from "@/lib/format";
import { SOCIAL_ICONS } from "@/lib/social-icons";

/**
 * `/llms.txt` and `/llms-full.txt`, in the format llmstxt.org sets out: an H1,
 * a one-paragraph summary in a blockquote, a few lines of context, then H2
 * sections of links, each with a line saying what is behind it.
 *
 * Two files, the convention most sites follow. `llms.txt` stays small - the
 * newest posts and talks, every project, the index pages - because the spec
 * asks for a file that fits an assistant's context with the detail behind the
 * links. `llms-full.txt` is everything: every post, talk, project, video and
 * community, the work history and the education, for an assistant that wants
 * the whole picture in one read.
 *
 * Both are built from the records the pages render, so an assistant gets the
 * owner's own words and the current lists. Every call degrades to empty, so
 * with the API down each is still a valid file: the summary falls back to
 * `SITE_CONFIG` and the lists to their index pages.
 */

const url = (path: string) => `${SITE_CONFIG.url}${path}`;

/** One list line: `- [name](url): note`, the note on one line. */
function link(name: string, href: string, note?: string | null): string {
  const clean = note?.replace(/\s+/g, " ").trim();
  return `- [${name}](${href})${clean ? `: ${clean}` : ""}`;
}

/** A plain list line, for records that have no page of their own. */
function item(text: string, note?: string | null): string {
  const clean = note?.replace(/\s+/g, " ").trim();
  return `- ${text}${clean ? `: ${clean}` : ""}`;
}

const joined = (...parts: (string | null | undefined)[]) =>
  parts.filter(Boolean).join(" - ");

/** `period` is free text on older records and a start/end pair on newer. */
function period(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "start" in value) {
    const { start, end } = value as { start: string; end?: string | null };
    return `${formatMonth(start)} - ${end ? formatMonth(end) : "Present"}`;
  }
  return "";
}

const postLine = (post: BlogPost) =>
  link(
    post.title,
    postUrl(post),
    joined(formatDate(post.publishedDate), post.description),
  );

const projectLine = (project: Project) =>
  link(
    project.name,
    url(`/projects/${project.slug}`),
    project.tagline || project.description,
  );

const eventLine = (event: EventRecord) =>
  link(
    event.title,
    url(`/events/${event.slug}`),
    joined(formatDate(event.startAt, event.timezone), event.summary),
  );

const videoLine = (video: Video) =>
  link(
    video.title,
    video.link,
    joined(formatDate(video.date), video.description),
  );

const communityLine = (community: Community) =>
  community.communityUrl
    ? link(
        community.name,
        community.communityUrl,
        joined(community.role, period(community.period), community.description),
      )
    : item(
        community.name,
        joined(community.role, period(community.period), community.description),
      );

const experienceLine = (role: Experience) =>
  item(
    `${role.title}, ${role.company}`,
    joined(period(role.period), role.description),
  );

const educationLine = (course: Education) =>
  item(
    `${course.course}, ${course.institution}`,
    joined(period(course.period), course.description),
  );

const newestFirst = <T>(items: T[], date: (item: T) => unknown) =>
  [...items].sort((a, b) =>
    String(date(b) ?? "").localeCompare(String(date(a) ?? "")),
  );

export async function buildLlmsTxt({ full }: { full: boolean }) {
  const [about, posts, projects, upcoming, completed] = await Promise.all([
    api.getAbout(),
    api.getAllBlogs().catch(() => [] as BlogPost[]),
    api.getProjects({ limit: 100 }),
    api.getEvents({ status: "upcoming", limit: full ? 100 : 5 }),
    api.getEvents({ status: "completed", limit: full ? 200 : 6 }),
  ]);
  const [experiences, educations, communities, videos] = full
    ? await Promise.all([
        api.getExperiences(),
        api.getEducations(),
        api.getCommunities(),
        api.getVideos(),
      ])
    : [[], [], [], []];

  const name = about?.name || SITE_CONFIG.name;
  const role = about?.title || "AI Engineer";
  const summary =
    about?.taglineDescription?.trim() || SITE_CONFIG.metaDescription;
  const bio = full
    ? paragraphs(about?.fullBio).join("\n\n") || paragraphs(about?.shortBio)[0]
    : paragraphs(about?.shortBio)[0];
  const socials = SOCIAL_ICONS.map(({ label, key }) => ({
    label,
    href: about?.links?.[key],
  })).filter((s): s is { label: string; href: string } => Boolean(s.href));

  const allPosts = newestFirst(posts ?? [], (p) => p.publishedDate);
  const listedPosts = full ? allPosts : allPosts.slice(0, 10);
  const events = [...(upcoming ?? []), ...(completed ?? [])];

  const lines: string[] = [
    `# ${name}`,
    "",
    `> ${role}${about?.location ? ` in ${about.location}` : ""}. ${summary}`,
    "",
  ];
  if (bio) lines.push(bio, "");
  lines.push(
    full
      ? `This is the full version of ${name}'s llms.txt: every post, talk, project, video and community on the site, with his work history and education. The short version is at ${url("/llms.txt")}. Every link is a public HTML page.`
      : `This is ${name}'s personal site (handle @dileepadev). The homepage covers who he is, his work history, education, community roles and how to get in touch; the pages below hold the full lists. Every list in full, with work history and education, is at ${url("/llms-full.txt")}. Every link is a public HTML page.`,
    "",
    `- Contact: ${SITE_CONFIG.email}`,
  );
  if (socials.length) {
    lines.push(
      `- Elsewhere: ${socials.map((s) => `[${s.label}](${s.href})`).join(", ")}`,
    );
  }
  lines.push("");

  lines.push(
    "## Profile",
    "",
    link(
      "Home",
      url("/"),
      "About, work history, education, community roles and contact, on one page.",
    ),
    link(
      "Media kit",
      url("/profile"),
      "Biographies in two lengths, official headshots, speaking topics and links - for organisers and press.",
    ),
    "",
  );

  if (full && (experiences ?? []).length > 0) {
    lines.push("## Work history", "", ...experiences.map(experienceLine), "");
  }
  if (full && (educations ?? []).length > 0) {
    lines.push("## Education", "", ...educations.map(educationLine), "");
  }

  lines.push(
    "## Writing",
    "",
    link(
      "Blog",
      url("/blog"),
      full
        ? `All ${allPosts.length} posts, searchable by tag, year and series.`
        : `All ${allPosts.length} posts, searchable by tag, year and series; the ten most recent follow.`,
    ),
    link("RSS feed", url("/blog/rss.xml"), "The posts as RSS."),
    ...listedPosts.map(postLine),
    "",
  );

  if ((projects ?? []).length > 0) {
    lines.push(
      "## Projects",
      "",
      link(
        "Projects",
        url("/projects"),
        "Open-source tools, workshops and experiments.",
      ),
      ...(projects ?? []).map(projectLine),
      "",
    );
  }

  lines.push(
    "## Talks and events",
    "",
    link(
      "Events",
      url("/events"),
      full
        ? `All ${events.length} talks, workshops and conference sessions, upcoming first, with slides and recordings where they exist.`
        : "Talks, workshops and conference sessions, upcoming and past, with slides and recordings where they exist; the latest follow.",
    ),
    ...events.map(eventLine),
    "",
  );

  if (full && (videos ?? []).length > 0) {
    lines.push(
      "## Videos",
      "",
      link(
        "Videos",
        url("/videos"),
        "Technical walkthroughs and demos, hosted on YouTube.",
      ),
      ...newestFirst(videos, (v) => v.date).map(videoLine),
      "",
    );
  }
  if (full && (communities ?? []).length > 0) {
    lines.push(
      "## Communities",
      "",
      link(
        "Communities",
        url("/communities"),
        "Developer communities he organises with, contributes to or volunteers for.",
      ),
      ...communities.map(communityLine),
      "",
    );
  }

  lines.push(
    "## Optional",
    "",
    ...(full
      ? []
      : [
          link(
            "Videos",
            url("/videos"),
            "Technical walkthroughs and demos, hosted on YouTube.",
          ),
          link(
            "Communities",
            url("/communities"),
            "Developer communities he organises with, contributes to or volunteers for.",
          ),
        ]),
    link("Gallery", url("/gallery"), "Photos from events."),
    link(
      "Brand and design reference",
      url("/brand"),
      "The design system the site is built on: mark, palette, type, corners, components, icons and tokens.",
    ),
    link("Site directory", url("/sitemap"), "Every page, as a browsable tree."),
    link("XML sitemap", url("/sitemap.xml"), "Every page, for crawlers."),
    link(
      "Terminal profile",
      url("/terminal"),
      "The profile as styled plain text for `curl -L dileepa.dev` - it carries ANSI colour codes, so the homepage reads better.",
    ),
    link("Privacy", url("/privacy")),
    link("Terms", url("/terms")),
    "",
  );

  return lines.join("\n");
}

/** The response both routes send. */
export function llmsResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
