import { NextResponse } from "next/server";
import type { ColorMode } from "@/lib/ansi";
import { TERMINAL } from "@/lib/constants";
import { renderTerminalProfile } from "@/lib/terminal";
import { isTerminalClient } from "@/lib/terminal-client";
import { streamTerminalIntro } from "@/lib/terminal-intro";

/**
 * The terminal rendering, as a route of its own.
 *
 * `proxy.ts` rewrites terminal clients on `/` to here, but this URL is not an
 * implementation detail of that rewrite — it is the stable address of the
 * thing. Someone who wants the plain-text profile from a client the sniffer
 * does not know about, or wants to link it, or wants to read it in a browser,
 * asks for it by name and gets it.
 *
 * `text/plain` rather than `text/plain; format=flowed` or anything cleverer:
 * the body is pre-wrapped to a fixed column count and must not be re-flowed by
 * whatever is reading it.
 */

/**
 * Fifteen minutes, matching `REVALIDATE.content` in `lib/api.ts`.
 *
 * The route itself is dynamic — it reads the query string — but every fetch
 * underneath it goes through the same Next data cache the homepage uses, so a
 * request that misses the CDN still does not hit the API.
 */
export const revalidate = 900;

/**
 * Seconds the platform may let this route run.
 *
 * Stated rather than left to the default because this is the one route on the
 * site that holds a connection open on purpose: the boot sequence sleeps
 * between chunks for roughly three seconds, and a host whose default execution
 * limit sat below that would cut the stream mid-animation. Fifteen is generous
 * against a ~3s budget and still low enough that a wedged request cannot sit
 * there burning an invocation.
 */
export const maxDuration = 15;

/**
 * Whether the reader asked for escape codes to be left out.
 *
 * `NO_COLOR` is the convention, but it is an environment variable and this is
 * an HTTP request — the server never sees it. A query parameter is the closest
 * equivalent that survives the gap, and all four spellings people actually try
 * are accepted because guessing wrong here just looks broken.
 *
 * Presence is enough: `?nocolor` and `?nocolor=1` mean the same thing, and
 * `?nocolor=` — which is what a shell produces from a bare flag — is the one
 * that a value check would miss.
 */
function wantsPlainText(params: URLSearchParams): boolean {
  return ["nocolor", "no-color", "plain", "raw"].some((key) => params.has(key));
}

/**
 * Whether to play the boot sequence before the document.
 *
 * The default for a terminal client is yes. The rules, in order:
 *
 * 1. **An explicit skip wins.** `?static`, `?fast`, `?now`, `?nointro`.
 * 2. **Plain text implies a skip.** Someone who turned the escape codes off is
 *    piping or saving, and a redraw with no cursor control is not an animation
 *    — it is sixty lines of spinner in a file. They should not have to pass two
 *    flags to say one thing.
 * 3. **An explicit request wins next.** `?intro` lets a browser, or a client
 *    the User-Agent matcher does not know, ask for it anyway.
 * 4. **Otherwise, animate for a terminal and not for anything else.** A browser
 *    pointed at `/terminal` gets the document immediately: it cannot render a
 *    carriage-return redraw, so streaming one at it is 2.6 seconds spent making
 *    the page worse.
 */
function wantsIntro(request: Request, params: URLSearchParams): boolean {
  if (TERMINAL.staticKeys.some((key) => params.has(key))) return false;
  if (wantsPlainText(params)) return false;
  if (TERMINAL.introKeys.some((key) => params.has(key))) return true;
  return isTerminalClient(request.headers);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode: ColorMode = wantsPlainText(searchParams) ? "plain" : "ansi";

  // The animated form. Returned as a stream so the pauses between chunks reach
  // the reader as timing rather than being flattened into one body — which is
  // the whole mechanism, and the reason this branch cannot share the response
  // construction below.
  if (wantsIntro(request, searchParams)) {
    return new NextResponse(streamTerminalIntro(mode, request.signal), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        // Never store a stream whose entire point is when its bytes arrive. A
        // cached copy would replay as one instant dump of every frame.
        "Cache-Control": "no-store",
        // nginx and some reverse proxies buffer a response until it completes
        // unless told not to, which would hold every frame back and then
        // release them together. Vercel does not, but this response is the one
        // thing on the site that cannot survive being buffered, so it says so.
        "X-Accel-Buffering": "no",
        Vary: "Accept, User-Agent",
        "X-Terminal-Command": TERMINAL.command,
      },
    });
  }

  const body = await renderTerminalProfile(mode);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Deliberately not `s-maxage`, and the reasoning is worth keeping.
      //
      // This body is reachable at two URLs: here, and at `/` for a terminal
      // client that Proxy rewrote. A shared cache that stored it under `/` —
      // because it keyed the entry on the requested path rather than the
      // rewritten one — would then serve plain text to the next browser that
      // asked for the homepage. That is the one failure this feature must not
      // have, and it is not worth a single round trip to risk it.
      //
      // Declining to be cached at the edge costs almost nothing here: every
      // `api.*` call underneath goes through Next's data cache with its own
      // 15-minute window, so a request that reaches this function does no
      // network I/O and spends its time concatenating strings. This is the same
      // `Cache-Control` Vercel already serves the prerendered homepage with.
      "Cache-Control": "public, max-age=0, must-revalidate",
      // The colour mode comes from the query string, which is part of the cache
      // key already. Declared for intermediaries between the edge and the
      // reader, which see the response and not the routing that produced it.
      Vary: "Accept, User-Agent",
      // A terminal client will not run it, but this response is reachable from
      // a browser and is not markup. Belt and braces alongside the `nosniff`
      // that `next.config.ts` already puts on every path.
      "Content-Disposition": "inline",
      // Names the shorter address for anyone who arrived here via the rewrite
      // and wants to know what to type next time.
      "X-Terminal-Command": TERMINAL.command,
    },
  });
}
