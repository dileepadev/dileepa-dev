/**
 * The terminal rendering of the homepage.
 *
 * Same record, same voice, no CSS. `app/terminal/route.ts` serves this and
 * `proxy.ts` rewrites `curl` on `/` to that route, so a reader gets the site
 * they can actually use in the client they actually opened.
 *
 * Three decisions worth keeping:
 *
 * **It reads the API, not a copy of it.** Every section here resolves from the
 * same `api.*` calls the homepage uses, through the same Next data cache. There
 * is no second source of truth to update when a project ships or a role
 * changes, and no fixture that can quietly go stale. The consequence is that
 * the terminal output degrades exactly the way the homepage does - `degrade`
 * returns the fallback and logs the endpoint - so a dead collection costs one
 * section rather than the response.
 *
 * **It is composed, not templated.** The layout is built from the primitives in
 * `lib/ansi.ts`, which measure width against visible columns rather than string
 * length. Interpolating escape codes into a template literal and hoping the
 * columns line up is the one thing that reliably breaks this kind of output.
 *
 * **Every section names its own URL.** The point of the whole surface is to be
 * a door into the site, not a replacement for it. A reader who wants the full
 * list should never have to guess where it lives.
 */

import {
  padEnd,
  palette,
  strip,
  truncate,
  wrap,
  type ColorMode,
  type Palette,
} from "./ansi";
import { api } from "./api";
import type { About, Period } from "./api-types";
import { SITE_CONFIG, TERMINAL } from "./constants";
import { formatMonth, humanise, paragraphs } from "./format";
import {
  PORTRAIT_COLOUR,
  PORTRAIT_PLAIN,
  PORTRAIT_WIDTH,
} from "./portrait-ascii";

const INNER = TERMINAL.columns;
const GUTTER = "  ";
const INDENT = 4;

/** The site, with any trailing slash removed, for composing absolute URLs. */
const ORIGIN = SITE_CONFIG.url.replace(/\/$/, "");

// --- Layout primitives -----------------------------------------------------

function indent(depth: number): string {
  return " ".repeat(depth);
}

/** A full-width horizontal rule, dimmed. The `<hr>` of this surface. */
function rule(p: Palette): string {
  return GUTTER + p.muted("\u2500".repeat(INNER));
}

/**
 * A section heading, ruled out to the right edge.
 *
 * `▍` is the escape-code translation of `.subsection-title::before` - the
 * accent bar the design system puts ahead of a subsection title. It is the one
 * accented mark in a section, which is the rule the site follows too:
 * the accent is a marker, not a highlight.
 *
 * The rule that follows the title is what makes a long document scannable: it
 * gives every section the same right edge as the header panel and the colophon,
 * so the eye has a column to run down instead of a ragged list of labels.
 */
function heading(p: Palette, title: string): string[] {
  const label = strip(title);
  // bar + space + label + space, then the rule takes whatever is left.
  const fill = Math.max(0, INNER - 3 - label.length);
  return [
    "",
    `${GUTTER}${p.brand("\u258d")} ${p.strong(label)} ${p.muted("\u2500".repeat(fill))}`,
    "",
  ];
}

/**
 * A left value and a right value on one line, filled with spaces between.
 *
 * The left side is truncated to whatever the right side leaves it. Both are
 * styled after measuring, never before - `truncate` on a string that already
 * carries escape codes would cut one in half and leave the rest of the document
 * wearing it.
 */
function twoCol(
  left: string,
  right: string,
  styleLeft: (text: string) => string,
  styleRight: (text: string) => string,
  depth = INDENT,
): string {
  const available = INNER - depth;
  const rightText = strip(right).trim();
  const budget = available - (rightText ? rightText.length + 2 : 0);
  const leftText = truncate(clean(left), Math.max(12, budget));
  const gap = Math.max(2, available - leftText.length - rightText.length);

  return (
    indent(depth) +
    styleLeft(leftText) +
    (rightText ? indent(gap) + styleRight(rightText) : "")
  );
}

/** Wrapped prose at `depth`, every line carrying the same style. */
function prose(
  text: string,
  style: (line: string) => string,
  depth = INDENT,
): string[] {
  return wrap(text, INNER - depth).map((line) => indent(depth) + style(line));
}

/**
 * A `label   value` pair on one line, with the labels aligned into a column.
 *
 * Twelve, because the longest label in either block that uses this is "Skip
 * intro" at ten characters, and eleven left it one space from its value while
 * every other row had three or four. The column is what makes these scannable;
 * one row pressed against its value is what makes it look broken.
 */
function field(
  p: Palette,
  label: string,
  value: string,
  labelWidth = 12,
): string {
  return (
    indent(INDENT) + p.muted(padEnd(label, labelWidth)) + p.link(strip(value))
  );
}

// --- Content helpers -------------------------------------------------------

/** `Period` is `{ start, end }` on projects and free text everywhere else. */
function periodText(period: Period | string | null | undefined): string {
  if (!period) return "";
  if (typeof period === "string") return period.trim();

  const start = formatMonth(period.start);
  const end = period.end ? formatMonth(period.end) : "Present";
  if (!start) return end === "Present" ? "" : end;
  return `${start} - ${end}`;
}

/** The first non-empty string, trimmed. Keeps the fallback chains readable. */
function first(...values: (string | null | undefined)[]): string {
  for (const value of values) {
    const trimmed = value?.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

/**
 * Text as it should print: escape codes removed and runs of whitespace
 * collapsed. The API's records are hand-typed, and a double space in a name
 * ("Microsoft  Student Ambassadors") shows in a monospaced column where a
 * browser would have hidden it.
 */
function clean(text: string | null | undefined): string {
  return strip(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * A title that wraps rather than truncates, the first line carrying `right`
 * (a date, a status) in the right-hand column.
 *
 * `twoCol` cuts a long title with an ellipsis, which lost the end of half the
 * post titles ("…in Long-Running…"). A title is the thing being listed; it
 * keeps every word and takes a second line instead. With a `url`, every line
 * of it is a hyperlink where the terminal supports one.
 */
function titled(
  p: Palette,
  title: string,
  right: string,
  url?: string,
  depth = INDENT,
): string[] {
  const available = INNER - depth;
  const rightText = clean(right);
  const width = available - (rightText ? rightText.length + 2 : 0);
  const rows = wrap(clean(title), width);
  return rows.map((row, index) => {
    const text = url ? p.href(p.strong(row), url) : p.strong(row);
    if (index > 0 || !rightText) return indent(depth) + text;
    const gap = Math.max(2, available - row.length - rightText.length);
    return indent(depth) + text + indent(gap) + p.muted(rightText);
  });
}

/** A URL on its own line, dimmed-underlined and clickable. */
function urlLine(p: Palette, url: string, depth = INDENT): string {
  return indent(depth) + p.href(p.link(url), url);
}

/** A closing "All posts   dileepa.dev/blog" row, its link clickable. */
function allRow(p: Palette, label: string, path: string): string {
  const url = `${ORIGIN}${path}`;
  return twoCol(label, short(url), p.muted, (text) =>
    p.href(p.link(text), url),
  );
}

/** `https://dileepa.dev/blog` -> `dileepa.dev/blog`. A terminal has no chrome. */
function short(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// --- Sections --------------------------------------------------------------

type TerminalData = Awaited<ReturnType<typeof getTerminalData>>;

/** Columns the masthead's info panel gives a label. "Community" is nine. */
const INFO_LABEL = 10;

/**
 * The info panel beside the portrait: `neofetch`, describing a person.
 *
 * `neofetch` prints a machine's logo beside `user@host` and a column of facts
 * about it, and it is the thing developers screenshot to show off a setup.
 * This is the same shape about the person who built the site - the handle,
 * then what they do and how much of it - and every figure is counted from the
 * API on render, so it cannot drift the way a typed "30+ talks" would.
 */
function info(p: Palette, data: TerminalData, width: number): string[] {
  const about = data.aboutRecord;
  const valueWidth = width - INFO_LABEL;

  const years = data.experiences
    .flatMap((role) => role.period.match(/\d{4}/g) ?? [])
    .map(Number);
  const since = years.length > 0 ? Math.min(...years) : null;
  const span = since ? new Date().getFullYear() - since : 0;

  const latest = (value: string | null | undefined) =>
    value ? ` · latest ${formatMonth(value)}` : "";
  const newestVideo = [...data.videos].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  )[0];
  const active = data.projects.filter((x) => x.status === "active").length;
  const current = data.communities.filter((x) => x.current).length;

  // As many tools as fit the value column, in the API's order.
  let stack = "";
  for (const tool of data.tools) {
    const name = clean(tool.name);
    if (!name) continue;
    const next = stack ? `${stack} · ${name}` : name;
    if (next.length > valueWidth) break;
    stack = next;
  }

  const status = clean(about?.status);
  const rows: [string, string][] = [
    ["Name", clean(first(about?.name, SITE_CONFIG.name))],
    ["Role", clean(first(about?.title, "AI Engineer"))],
    ["Location", clean(about?.location)],
    ["Status", status],
    [
      "Building",
      since ? `since ${since} · ${span} ${span === 1 ? "year" : "years"}` : "",
    ],
    [
      "Talks",
      data.events.length > 0
        ? `${data.events.length}${latest(data.events[0]?.startAt)}`
        : "",
    ],
    [
      "Writing",
      data.posts.length > 0
        ? `${data.posts.length}${latest(data.posts[0]?.publishedDate)}`
        : "",
    ],
    [
      "Projects",
      data.projects.length > 0
        ? `${data.projects.length}${active ? ` · ${active} active` : ""}`
        : "",
    ],
    [
      "Videos",
      data.videos.length > 0
        ? `${data.videos.length}${latest(newestVideo?.date)}`
        : "",
    ],
    [
      "Community",
      data.communities.length > 0
        ? `${data.communities.length}${current ? ` · ${current} current` : ""}`
        : "",
    ],
    ["Stack", stack],
  ];

  // The handle the lockup shows, as the `user` of `user@host`.
  const handle = SITE_CONFIG.twitterHandle.replace(/^@/, "");
  const host = short(ORIGIN);
  const lines = [
    p.strong(handle) + p.muted("@") + p.strong(host),
    p.muted("─".repeat(handle.length + 1 + host.length)),
  ];

  for (const [label, value] of rows) {
    if (!value) continue;
    const text = truncate(value, valueWidth);
    const shown =
      label === "Status"
        ? `${p.brand("●")} ${p.strong(truncate(status, valueWidth - 2))}`
        : text;
    lines.push(p.muted(padEnd(label, INFO_LABEL)) + shown);
  }

  // `neofetch` closes on a row of colour swatches. The palette here is black
  // to white, so the swatches are its greys - and they say, quietly, that the
  // terminal is drawing in colour. Plain mode has nothing to show.
  if (p.colour) {
    const greys = [255, 251, 247, 243, 239, 235];
    lines.push("", greys.map((n) => `\u001b[38;5;${n}m███\u001b[0m`).join(""));
  }
  return lines;
}

/**
 * The masthead: the portrait beside the info panel, in the double-ruled box.
 *
 * The portrait replaced the `@dileepadev` block letters (v2.1.0 draft). A
 * face is what the rest of the site leads with - the rail, the phone hero -
 * and it is the one thing a terminal is not expected to be able to show. It
 * is drawn in quadrant blocks on the 256-colour grey ramp, background cut out, by
 * `scripts/portrait-ascii.mjs`, and committed as `lib/portrait-ascii.ts`, so
 * no request pays for the image work. Plain mode gets the same picture shaded
 * in characters.
 *
 * The box border is double-ruled rather than the light rule everything else
 * uses: the one block on the page that is allowed to be loud.
 */
function banner(p: Palette, data: TerminalData): string[] {
  const boxInner = INNER - 2;
  const line = (content: string) =>
    `${GUTTER}${p.muted("║")}${padEnd(content, boxInner)}${p.muted("║")}`;
  const top = `${GUTTER}${p.muted(`╔${"═".repeat(boxInner)}╗`)}`;
  const bottom = `${GUTTER}${p.muted(`╚${"═".repeat(boxInner)}╝`)}`;

  const leftPad = 2;
  const between = 2;
  const portrait = p.colour ? PORTRAIT_COLOUR : PORTRAIT_PLAIN;
  const panel = info(
    p,
    data,
    boxInner - leftPad - PORTRAIT_WIDTH - between - 1,
  );

  // The portrait is taller than the panel (22 rows to 15), so the panel sits
  // centred against it rather than hanging from its top.
  const rows = Math.max(portrait.length, panel.length);
  const offset = Math.max(0, Math.floor((rows - panel.length) / 2));
  const lines = ["", top, line("")];
  for (let row = 0; row < rows; row++) {
    const picture = portrait[row] ?? indent(PORTRAIT_WIDTH);
    lines.push(
      line(
        indent(leftPad) +
          picture +
          indent(between) +
          (panel[row - offset] ?? ""),
      ),
    );
  }
  lines.push(line(""), bottom);
  return lines;
}

/**
 * The hero's display line and its supporting sentence.
 *
 * Same fallback chain as `components/sections/Hero.tsx`: the tagline
 * description, then the second paragraph of the description for records
 * written before that field existed.
 */
function lead(p: Palette, about: About | null): string[] {
  const tagline = first(about?.tagline, SITE_CONFIG.description);
  const supporting = first(
    about?.taglineDescription,
    paragraphs(about?.description)[1],
  );

  const lines = ["", ...prose(tagline, p.strong, 2)];
  if (supporting) lines.push("", ...prose(supporting, p.muted, 2));
  return lines;
}

function bio(p: Palette, record: About | null): string[] {
  const body = first(record?.shortBio, paragraphs(record?.description)[0]);
  if (!body) return [];
  return [...heading(p, "About"), ...prose(body, (line) => line)];
}

function work(p: Palette, experiences: TerminalData["experiences"]): string[] {
  if (experiences.length === 0) return [];

  const lines = heading(p, "Work");
  for (const role of experiences.slice(0, TERMINAL.limits.experiences)) {
    // `period` is free text; "Present" is the only signal.
    const now = /present/i.test(role.period);
    lines.push(
      ...titled(p, role.title, periodText(role.period)),
      indent(INDENT) +
        p.muted(clean(role.company)) +
        (now ? ` ${p.brand("●")} ${p.strong("current")}` : ""),
      "",
    );
  }
  lines.push(allRow(p, "Full history", "/work"));
  return lines;
}

function education(
  p: Palette,
  educations: TerminalData["educations"],
): string[] {
  if (educations.length === 0) return [];

  const lines = heading(p, "Education");
  for (const entry of educations.slice(0, TERMINAL.limits.educations)) {
    // The result - "First Class Honours", "4.0 GPA" - beside the school.
    const detail = [clean(entry.institution), clean(entry.description)]
      .filter(Boolean)
      .join(" · ");
    lines.push(
      ...titled(p, entry.course, periodText(entry.period)),
      ...prose(detail, p.muted),
      "",
    );
  }
  lines.push(allRow(p, "All education", "/education"));
  return lines;
}

/**
 * The tool list, as prose rather than a grid.
 *
 * A column layout would need a terminal width nobody sends, and a one-per-line
 * list would spend thirty rows on thirty words. Separated by middots and
 * wrapped by item, not by word - half these names contain a space, and word
 * wrapping would split "Claude Code" across two lines. Two columns are held
 * back so a continued line can carry its trailing separator.
 */
function skills(p: Palette, tools: TerminalData["tools"]): string[] {
  const names = tools
    .map((tool) => clean(tool.name))
    .filter(Boolean)
    .slice(0, TERMINAL.limits.tools);

  if (names.length === 0) return [];

  const columns = INNER - INDENT - 2;
  const lines: string[] = [];
  let current = "";

  for (const name of names) {
    const candidate = current ? `${current} · ${name}` : name;
    if (candidate.length <= columns) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = name;
    }
  }
  if (current) lines.push(current);

  return [
    ...heading(p, "Tools I reach for"),
    ...lines.map(
      (line, index) =>
        indent(INDENT) + line + (index < lines.length - 1 ? " ·" : ""),
    ),
  ];
}

function projects(p: Palette, records: TerminalData["projects"]): string[] {
  if (records.length === 0) return [];

  const lines = heading(p, "Projects");
  for (const project of records.slice(0, TERMINAL.limits.projects)) {
    const url = `${ORIGIN}/projects/${project.slug}`;
    const stack = (project.stack ?? []).slice(0, 4).join(", ");
    lines.push(
      ...titled(p, project.name, project.status ?? "", url),
      ...prose(first(project.tagline), p.muted),
    );
    if (stack) lines.push(indent(INDENT) + p.muted(stack));
    lines.push(urlLine(p, url), "");
  }
  lines.push(allRow(p, "All projects", "/projects"));
  return lines;
}

/** Talks and workshops: what, when, where, and the page for each. */
function talks(p: Palette, events: TerminalData["events"]): string[] {
  if (events.length === 0) return [];

  const lines = heading(p, "Talks and workshops");
  for (const event of events.slice(0, TERMINAL.limits.events)) {
    const url = `${ORIGIN}/events/${event.slug}`;
    const where = [
      event.status === "upcoming" ? "Upcoming" : "",
      humanise(event.type),
      clean(event.location?.venue) || humanise(event.format),
    ]
      .filter(Boolean)
      .join(" · ");
    lines.push(...titled(p, event.title, formatMonth(event.startAt), url));
    if (where) lines.push(indent(INDENT) + p.muted(where));
    lines.push(urlLine(p, url), "");
  }
  lines.push(allRow(p, "All events", "/events"));
  return lines;
}

/**
 * What he speaks on - the list an organiser reads first - and where the bios
 * and headshots are.
 */
function topics(p: Palette, records: TerminalData["topics"]): string[] {
  const titles = records.map((topic) => clean(topic.title)).filter(Boolean);
  if (titles.length === 0) return [];

  const lines = heading(p, "Speaking topics");
  for (const title of titles) {
    // A hanging indent: wrapped lines line up under the text, not the bullet.
    wrap(title, INNER - INDENT - 2).forEach((row, index) =>
      lines.push(indent(INDENT) + (index === 0 ? p.muted("· ") : "  ") + row),
    );
  }
  lines.push("", allRow(p, "Media kit", "/profile"));
  return lines;
}

function writing(p: Palette, posts: TerminalData["posts"]): string[] {
  if (posts.length === 0) return [];

  const lines = heading(p, "Writing");
  for (const post of posts.slice(0, TERMINAL.limits.posts)) {
    const url = `${ORIGIN}/blog/${post.slug}`;
    lines.push(
      ...titled(p, post.title, formatMonth(post.publishedDate), url),
      urlLine(p, url),
      "",
    );
  }
  lines.push(
    allRow(p, "All writing", "/blog"),
    allRow(p, "RSS", "/blog/rss.xml"),
  );
  return lines;
}

function videos(p: Palette, records: TerminalData["videos"]): string[] {
  if (records.length === 0) return [];

  const newest = [...records].sort((a, b) =>
    (b.date ?? "").localeCompare(a.date ?? ""),
  );
  const lines = heading(p, "Videos");
  for (const video of newest.slice(0, TERMINAL.limits.videos)) {
    lines.push(
      ...titled(p, video.title, formatMonth(video.date), video.link),
      urlLine(p, video.link),
      "",
    );
  }
  lines.push(allRow(p, "All videos", "/videos"));
  return lines;
}

function communities(
  p: Palette,
  records: TerminalData["communities"],
): string[] {
  if (records.length === 0) return [];

  const lines = heading(p, "Communities");
  for (const entry of records.slice(0, TERMINAL.limits.communities)) {
    lines.push(
      ...titled(p, entry.name, clean(entry.period)),
      indent(INDENT) +
        p.muted(clean(entry.role)) +
        (entry.current ? ` ${p.brand("●")} ${p.strong("current")}` : ""),
      "",
    );
  }
  lines.push(allRow(p, "All communities", "/communities"));
  return lines;
}

/**
 * Where to find the person, not the site.
 *
 * Driven off `about.links`, so a channel that is not configured is simply not
 * printed rather than rendered as an empty row - the same rule the footer's
 * social icons follow. Each is a hyperlink where the terminal supports one.
 */
function links(p: Palette, record: About | null): string[] {
  const configured = record?.links;
  const email = first(configured?.email, SITE_CONFIG.email);
  const rows: [string, string, string][] = (
    [
      ["Email", email, `mailto:${email}`],
      ["GitHub", first(configured?.github), ""],
      ["LinkedIn", first(configured?.linkedin), ""],
      ["X", first(configured?.xtwitter), ""],
      ["YouTube", first(configured?.youtube), ""],
      ["Instagram", first(configured?.instagram), ""],
      ["Facebook", first(configured?.facebook), ""],
      ["Links", SITE_CONFIG.linksUrl, ""],
    ] as [string, string, string][]
  ).filter((row) => Boolean(row[1]));

  if (rows.length === 0) return [];

  const lines = heading(p, "Elsewhere");
  for (const [label, value, target] of rows) {
    const text = label === "Email" ? value : short(value);
    lines.push(
      indent(INDENT) +
        p.muted(padEnd(label, 12)) +
        p.href(p.link(text), target || value),
    );
  }
  return lines;
}

/** The contact invitation, in the words the Contact section uses. */
function contact(p: Palette, record: About | null): string[] {
  const intro = first(paragraphs(record?.connect)[0]);
  if (!intro) return [];
  return [...heading(p, "Get in touch"), ...prose(intro, p.muted)];
}

/**
 * The closing block: where else this goes, and what else to try.
 *
 * It names the browser version first - this surface is a door, not a walled
 * garden - then the commands worth knowing: this page, without colour, without
 * the boot sequence (the flag a reader about to pipe this needs and will not
 * guess), and the same site written for AI tools.
 */
function colophon(p: Palette): string[] {
  return [
    "",
    rule(p),
    "",
    field(p, "Browser", short(ORIGIN)),
    field(p, "Source", short(SITE_CONFIG.repository)),
    field(p, "This page", TERMINAL.command),
    field(p, "No colour", `curl -L "${short(ORIGIN)}?nocolor"`),
    field(p, "Skip intro", `curl -L "${short(ORIGIN)}?static"`),
    field(p, "For AI", `curl -L ${short(ORIGIN)}/llms.txt`),
    "",
    GUTTER +
      p.muted(
        `${SITE_CONFIG.name} · v${SITE_CONFIG.version} · rendered for the terminal`,
      ),
    "",
  ];
}

// --- Assembly --------------------------------------------------------------

/**
 * Everything the terminal rendering needs, in one round of requests.
 *
 * The masthead counts talks, posts, projects, videos and communities, so those
 * lists are fetched whole (the API caps a page at 100) and each section prints
 * only its first few. They are the same cached calls the site's pages make.
 * Videos come without `getVideos`' YouTube duration lookups - nothing here
 * prints a duration.
 */
async function getTerminalData() {
  const [
    aboutRecord,
    experiences,
    educations,
    tools,
    communities,
    projects,
    events,
    posts,
    videos,
    topics,
  ] = await Promise.all([
    api.getAbout(),
    api.getExperiences(),
    api.getEducations(),
    api.getTools(),
    api.getCommunities(),
    api.getProjects({ limit: 100 }),
    api.getEvents({ limit: 100 }),
    api.getBlogs({ limit: 100 }),
    api.getVideoRecords(),
    api.getSpeakingTopics(),
  ]);

  return {
    aboutRecord,
    experiences,
    educations,
    tools,
    communities,
    projects,
    events,
    posts,
    videos,
    topics,
  };
}

/**
 * The masthead alone, as lines, for the boot sequence to reveal one at a time.
 *
 * It shares `banner()` with the document rather than drawing its own, so the
 * animated and static forms can never show different mastheads. The data is
 * the same cached set the document asks for next, so this costs nothing extra.
 */
export async function renderTerminalMasthead(
  mode: ColorMode,
): Promise<string[]> {
  return banner(palette(mode), await getTerminalData());
}

/**
 * Builds the document.
 *
 * Sections that resolve to nothing contribute nothing - no heading, no blank
 * run - so an API that is half down produces a shorter page rather than a
 * skeleton of empty labels.
 */
export async function renderTerminalProfile(
  mode: ColorMode,
  options: { masthead?: boolean } = {},
): Promise<string> {
  const p = palette(mode);
  const data = await getTerminalData();

  // The boot sequence draws the masthead itself, a row at a time, and then asks
  // for the rest of the document. Without this it would be drawn twice.
  const masthead = options.masthead ?? true;

  const document = [
    ...(masthead ? banner(p, data) : []),
    ...lead(p, data.aboutRecord),
    ...bio(p, data.aboutRecord),
    ...work(p, data.experiences),
    ...skills(p, data.tools),
    ...education(p, data.educations),
    ...projects(p, data.projects),
    ...talks(p, data.events),
    ...topics(p, data.topics),
    ...writing(p, data.posts),
    ...videos(p, data.videos),
    ...communities(p, data.communities),
    ...contact(p, data.aboutRecord),
    ...links(p, data.aboutRecord),
    ...colophon(p),
  ];

  return `${document.join("\n")}\n`;
}
