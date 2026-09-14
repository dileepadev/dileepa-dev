import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/**
 * Crawlers that may read the site, and the fleet that may not.
 *
 * **This file is a cost control, not a statement about AI.** Vercel bills
 * Active CPU, and roughly four humans a day read this site against thousands of
 * automated requests - so very nearly all of the compute the project has ever
 * been billed for was spent rendering pages for crawlers. Every ISR window is a
 * day (see `REVALIDATE` in `lib/api.ts`), which caps what a crawl can cost, but
 * the cap still scales with how many distinct pages get walked. Declining the
 * broadest crawlers is what turns a cap into headroom.
 *
 * The three groups below are deliberate, and the ordering of the reasoning
 * matters more than the list itself.
 */

/**
 * Bulk AI training and answer-engine crawlers.
 *
 * These walk entire sites repeatedly and return nothing a portfolio needs:
 * nobody arrives here from a model's training set. `Google-Extended` and
 * `Applebot-Extended` are the safe half of a pair - each governs **AI training
 * only** and has no effect on Google Search or Siri results, which is exactly
 * why they exist as separate tokens.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "FacebookBot",
  "Bytespider",
  "Amazonbot",
  "CCBot",
  "Diffbot",
  "omgili",
  "omgilibot",
  "ImagesiftBot",
  "Timpibot",
  "cohere-ai",
  "YouBot",
];

/**
 * SEO and backlink-index crawlers.
 *
 * They exist to sell competitive-analysis dashboards to other people. The site
 * gains nothing from being in their index, and they are among the most
 * aggressive walkers on the web.
 */
const SEO_CRAWLERS = [
  "AhrefsBot",
  "SemrushBot",
  "DotBot",
  "MJ12bot",
  "BLEXBot",
  "DataForSeoBot",
  "PetalBot",
  "SeekportBot",
  "serpstatbot",
  "MegaIndex",
  "ZoominfoBot",
];

/**
 * `allow: "/"` with three exceptions, for everyone not named above.
 *
 * `/404`, `/500` and `/503` are the system screens at stable addresses so the
 * sitemap page can link to them and they can be checked without breaking
 * something first. They carry `noindex` in their own metadata; this keeps a
 * crawler from spending a fetch discovering that. `/api/` is the proxy route
 * and answers JSON to the browser, not pages to a reader.
 *
 * **What is deliberately still welcome**, because the default rule is what they
 * match: Googlebot, Bingbot and DuckDuckBot, which are how anyone actually
 * finds this site; and `LinkedInBot`, `Twitterbot`, `Slackbot` and
 * `facebookexternalhit`, which fetch a page and its `opengraph-image` when a
 * link is shared. Blocking that group would strip the preview card off every
 * link handed to a recruiter, which is the opposite of what this site is for.
 *
 * `crawlDelay` applies to the catch-all rule. Google ignores it; Bing and
 * Yandex honour it, and so do most of the smaller crawlers that matter here.
 */
export default function robots(): MetadataRoute.Robots {
  const disallowAll = {
    userAgent: [...AI_CRAWLERS, ...SEO_CRAWLERS],
    disallow: "/",
  };

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/404", "/500", "/503"],
        crawlDelay: 10,
      },
      disallowAll,
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
