import { NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";

export function GET() {
  const content = `# ${SITE_CONFIG.name}

> ${SITE_CONFIG.description}

## About
Dileepa Bandara is an AI engineer building agentic systems, LLM orchestration workflows, and developer communities.

## Core Navigation
- [Homepage](${SITE_CONFIG.url}/)
- [Projects](${SITE_CONFIG.url}/projects)
- [Blog](${SITE_CONFIG.url}/blog)
- [Events](${SITE_CONFIG.url}/events)
- [Communities](${SITE_CONFIG.url}/communities)
- [Videos](${SITE_CONFIG.url}/videos)
- [Event Gallery](${SITE_CONFIG.url}/gallery)
- [Site Directory](${SITE_CONFIG.url}/sitemap)

## Feeds
- [RSS Feed](${SITE_CONFIG.url}/blog/rss.xml)
- [Sitemap](${SITE_CONFIG.url}/sitemap.xml)
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
