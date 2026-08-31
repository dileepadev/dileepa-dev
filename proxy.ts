import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TERMINAL } from "@/lib/constants";
// Shared with `app/terminal/route.ts`, which asks the same question to decide
// whether to play the boot sequence. One regex, one answer.
import { isTerminalClient } from "@/lib/terminal-client";

/**
 * Serves `curl dileepa.dev` a terminal rendering instead of 56KB of markup.
 *
 * This is the whole of the feature's routing. It is deliberately the smallest
 * thing that can work: one matched path, one header sniff, one rewrite.
 *
 * **The browser path is untouched.** A request that is not a terminal client
 * falls through `NextResponse.next()` to the prerendered homepage, with no
 * added header and no modified response. Nothing about the site a browser sees
 * changed when this file was added.
 *
 * **Why a rewrite and not a redirect.** A redirect would put `/terminal` in the
 * reader's address bar and cost a second round trip; `curl` without `-L` would
 * not follow it at all, which is the exact failure this feature exists to
 * avoid. A rewrite serves the other route's body under the requested URL.
 *
 * **Why this is safe to cache.** The response for `/` now depends on the
 * request's User-Agent, which is normally how a CDN gets poisoned. It cannot
 * happen here: Proxy runs ahead of the filesystem and cache layers on every
 * request to a matched path (see the routing order in the Next.js Proxy
 * reference), and the two audiences resolve to two different paths — `/` and
 * `TERMINAL.path` — which are two different cache entries. Neither audience can
 * be served the other's body, so no `Vary` is needed on the pass-through, and
 * none is set: `Vary: User-Agent` on a static homepage is a cache key with a
 * near-unbounded value space, and the hit rate is worth more than a header that
 * is defending against nothing.
 */

/** Forces the website, for a terminal client that wants the markup. */
const FORCE_BROWSER = ["html", "browser", "web"];

/** Forces the terminal rendering, so the URL can be shared and previewed. */
const FORCE_TERMINAL = ["terminal", "curl", "text"];

export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  if (FORCE_BROWSER.some((key) => searchParams.has(key))) {
    return NextResponse.next();
  }

  const wanted =
    FORCE_TERMINAL.some((key) => searchParams.has(key)) ||
    isTerminalClient(request.headers);

  if (!wanted) return NextResponse.next();

  // The query string travels with the rewrite so `?nocolor` reaches the route
  // that reads it.
  const destination = new URL(request.nextUrl);
  destination.pathname = TERMINAL.path;

  return NextResponse.rewrite(destination);
}

/**
 * The homepage and nothing else.
 *
 * `curl dileepa.dev/blog` should return the blog, not a profile — every other
 * route on this site already has an answer that makes sense in a terminal or
 * does not, and neither case is improved by intercepting it. Narrowing the
 * matcher to one literal path also means Proxy never runs for a static asset,
 * an image or an API route, so nothing else on the site pays for this.
 */
export const config = {
  matcher: ["/"],
};
