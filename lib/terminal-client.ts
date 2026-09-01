/**
 * Recognising a person at a prompt.
 *
 * Two places need this answer and they must not disagree. `proxy.ts` asks it to
 * decide whether `/` serves the profile or the website; `app/terminal/route.ts`
 * asks it to decide whether to play the boot sequence, because a browser
 * pointed at `/terminal` should get the document immediately rather than watch
 * a spinner it cannot render. Two copies of a User-Agent regex is two copies
 * that drift, and the failure is silent in both directions.
 *
 * Kept dependency-free on purpose: Proxy is bundled separately from the app and
 * runs ahead of it, so anything reachable from here travels into that bundle.
 */

/**
 * The clients that want text.
 *
 * Matched as whole words against the User-Agent, which is the only signal a
 * bare `curl` sends that says anything about itself. Two properties matter:
 *
 * - **A browser never matches.** Not because "Mozilla" is excluded - Windows
 *   PowerShell sends a UA that starts with `Mozilla/5.0` and is very much a
 *   terminal - but because no browser's UA contains any of these tokens.
 * - **A crawler never matches.** Googlebot, Bingbot, Slack's unfurler and the
 *   rest send browser-shaped agents, so they index and preview the real page.
 *   That is the point of listing clients rather than excluding browsers: an
 *   allowlist fails closed, and the failure is "someone gets the website".
 *
 * Deliberately absent are the HTTP *libraries* - `python-requests`, `okhttp`,
 * `node-fetch`, `Go-http-client`. Those are scripts and scrapers rather than a
 * person at a prompt, they are what unknown bots use, and handing them a
 * different body than a browser gets is how a site ends up accused of
 * cloaking. They get the page.
 *
 * `powershell` is the one token matched without a leading word boundary, and
 * that is not an oversight. Windows PowerShell 5.1 sends
 * `…en-US) WindowsPowerShell/5.1.19041.4046`, where the token is welded to the
 * word before it and `\bpowershell` cannot match; PowerShell 7 sends a
 * free-standing `PowerShell/7.4.1`. One rule has to cover both.
 */
const TERMINAL_CLIENT =
  /(?:\b(?:curl|libcurl|wget2?|httpie|xh|lwp-request|libwww-perl)\b|powershell\b)/i;

/**
 * Whether the request came from a terminal client rather than a browser.
 *
 * Takes `Headers` rather than a request so both a `NextRequest` in Proxy and a
 * plain `Request` in a route handler can ask the same question.
 */
export function isTerminalClient(headers: Headers): boolean {
  const agent = headers.get("user-agent") ?? "";
  if (!TERMINAL_CLIENT.test(agent)) return false;

  // `curl` sends `Accept: */*`; every browser asks for `text/html` by name. A
  // terminal client that asks for HTML anyway is asking on purpose.
  return !(headers.get("accept") ?? "").includes("text/html");
}
