import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * `allow: "/"` with three exceptions.
 *
 * `/404`, `/500` and `/503` are the system screens at stable addresses so the
 * sitemap page can link to them and they can be checked without breaking
 * something first. They carry `noindex` in their own metadata; this keeps a
 * crawler from spending a fetch discovering that. `/api/` is the proxy route
 * and answers JSON to the browser, not pages to a reader.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/404", "/500", "/503"],
    },
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
