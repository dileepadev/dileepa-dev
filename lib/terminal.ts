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
 * the terminal output degrades exactly the way the homepage does — `degrade`
 * returns the fallback and logs the endpoint — so a dead collection costs one
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
import { formatMonth, paragraphs } from "./format";
import { renderWordmark, WORDMARK_WIDTH } from "./wordmark";

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
 * `▍` is the escape-code translation of `.subsection-title::before` — the
 * emerald bar the design system puts ahead of a subsection title. It is the one
 * place emerald appears in a section, which is the rule the site follows too:
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
 * styled after measuring, never before — `truncate` on a string that already
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
  const leftText = truncate(strip(left).trim(), Math.max(12, budget));
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

/** `https://dileepa.dev/blog` -> `dileepa.dev/blog`. A terminal has no chrome. */
function short(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// --- Sections --------------------------------------------------------------

/**
 * The masthead.
 *
 * The wordmark is drawn large in block characters by `lib/wordmark.ts`, and the
 * brand rule survives the change of scale intact: the wordmark takes the
 * neutral foreground, the `/.` takes emerald, and the two never swap. That is
 * the whole reason `renderWordmark` hands back the two halves separately
 * instead of one pre-joined string — a banner with the colours reversed is a
 * brand failure visible from across a room.
 *
 * The border is double-ruled rather than the light rule everything else uses.
 * This is the one block on the page that is allowed to be loud, and a heavier
 * border is how it says so without spending a second colour to do it.
 */
function banner(p: Palette, about: About | null): string[] {
  const boxInner = INNER - 2;
  const line = (content: string) =>
    `${GUTTER}${p.muted("\u2551")}${padEnd(content, boxInner)}${p.muted("\u2551")}`;
  const top = `${GUTTER}${p.muted(`\u2554${"\u2550".repeat(boxInner)}\u2557`)}`;
  const bottom = `${GUTTER}${p.muted(`\u255a${"\u2550".repeat(boxInner)}\u255d`)}`;

  const name = first(about?.name, SITE_CONFIG.name);
  const role = first(about?.title, "AI Engineer");
  const location = first(about?.location);
  const meta = [role, location].filter(Boolean).join(" \u00b7 ");

  /**
   * Centres a row inside the box.
   *
   * Takes the plain text to measure and the already-styled text to place, which
   * looks redundant and is not: an escape code costs bytes and no columns, so
   * centring on the styled string pushes every coloured row left by however
   * many bytes its colour happens to cost.
   */
  const centred = (plainText: string, styled: string) =>
    line(
      indent(Math.max(0, Math.floor((boxInner - plainText.length) / 2))) +
        styled,
    );

  // The block is the thing the eye lands on first, and an off-centre one reads
  // as a mistake. Everything under it follows the same axis.
  // Every row of the block is the same width by construction, so they centre on
  // one measurement rather than each finding its own — which would let a row
  // whose trailing spaces got trimmed drift out of the column.
  const pad = indent(Math.max(0, Math.floor((boxInner - WORDMARK_WIDTH) / 2)));
  const art = renderWordmark().map((row) =>
    line(pad + p.strong(row.wordmark) + p.brand(row.mark)),
  );

  const lines = ["", top, line(""), ...art, line("")];

  if (name) lines.push(centred(name, p.strong(name)));
  if (meta) lines.push(centred(meta, p.muted(meta)));

  // The availability line, carried by a filled dot rather than a word like
  // "status:". The dot is the second and last emerald in the panel — a third
  // would be scattering the accent rather than spending it.
  if (about?.status) {
    lines.push(
      line(""),
      centred(
        `\u25cf ${about.status}`,
        `${p.brand("\u25cf")} ${p.strong(about.status)}`,
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

function work(
  p: Palette,
  experiences: Awaited<ReturnType<typeof api.getExperiences>>,
): string[] {
  if (experiences.length === 0) return [];

  const lines = heading(p, "Work");
  for (const role of experiences.slice(0, TERMINAL.limits.experiences)) {
    lines.push(
      twoCol(role.title, periodText(role.period), p.strong, p.muted),
      indent(INDENT) + p.muted(strip(role.company)),
      "",
    );
  }
  lines.pop();
  return lines;
}

function education(
  p: Palette,
  educations: Awaited<ReturnType<typeof api.getEducations>>,
): string[] {
  if (educations.length === 0) return [];

  const lines = heading(p, "Education");
  for (const entry of educations.slice(0, TERMINAL.limits.educations)) {
    lines.push(
      twoCol(entry.course, periodText(entry.period), p.strong, p.muted),
      indent(INDENT) + p.muted(strip(entry.institution)),
      "",
    );
  }
  lines.pop();
  return lines;
}

/**
 * The tool list, as prose rather than a grid.
 *
 * A column layout would need a terminal width nobody sends, and a one-per-line
 * list would spend thirty rows on thirty words. Comma-separated and wrapped is
 * what fits and what reads.
 */
function skills(
  p: Palette,
  tools: Awaited<ReturnType<typeof api.getTools>>,
): string[] {
  const names = tools
    .map((tool) => tool.name?.trim())
    .filter((name): name is string => Boolean(name))
    .slice(0, TERMINAL.limits.tools);

  if (names.length === 0) return [];

  // Separated by middots rather than commas. A comma list reads as a sentence
  // and invites being read; this is a set to be scanned, and the separator
  // should disappear rather than punctuate.
  //
  // Wrapped by item rather than by word, which `prose` cannot do: it breaks on
  // spaces, and half these names contain one. Word wrapping "Claude Code" and
  // "React (Vite)" splits them across lines and strands a bare middot at the
  // start of the next one.
  // Two columns are held back so a continued line can carry a trailing
  // separator without overrunning. Without it a wrap reads as a break between
  // groups, and "Angular" over "NestJS" looks like two categories rather than
  // two adjacent items in one list.
  const columns = INNER - INDENT - 2;
  const lines: string[] = [];
  let current = "";

  for (const name of names) {
    const candidate = current ? `${current} \u00b7 ${name}` : name;
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
        indent(INDENT) + line + (index < lines.length - 1 ? " \u00b7" : ""),
    ),
  ];
}

function projects(
  p: Palette,
  records: Awaited<ReturnType<typeof api.getProjects>>,
): string[] {
  if (records.length === 0) return [];

  const lines = heading(p, "Projects");
  for (const project of records.slice(0, TERMINAL.limits.projects)) {
    const stack = (project.stack ?? []).slice(0, 4).join(", ");
    lines.push(
      twoCol(project.name, project.status ?? "", p.strong, p.muted),
      ...prose(first(project.tagline), p.muted, INDENT),
    );
    if (stack) lines.push(indent(INDENT) + p.muted(stack));
    lines.push(
      indent(INDENT) + p.link(`${ORIGIN}/projects/${project.slug}`),
      "",
    );
  }
  lines.push(
    twoCol("All projects", `${short(ORIGIN)}/projects`, p.muted, p.link),
  );
  return lines;
}

function writing(
  p: Palette,
  posts: Awaited<ReturnType<typeof api.getBlogs>>,
): string[] {
  if (posts.length === 0) return [];

  const lines = heading(p, "Writing");
  for (const post of posts.slice(0, TERMINAL.limits.posts)) {
    lines.push(
      twoCol(post.title, formatMonth(post.publishedDate), p.strong, p.muted),
      indent(INDENT) + p.link(`${ORIGIN}/blog/${post.slug}`),
      "",
    );
  }
  lines.push(
    twoCol("All writing", `${short(ORIGIN)}/blog`, p.muted, p.link),
    twoCol("RSS", `${short(ORIGIN)}/blog/rss.xml`, p.muted, p.link),
  );
  return lines;
}

function community(
  p: Palette,
  communities: Awaited<ReturnType<typeof api.getCommunities>>,
  events: Awaited<ReturnType<typeof api.getEvents>>,
): string[] {
  if (communities.length === 0 && events.length === 0) return [];

  const lines = heading(p, "Community");

  for (const entry of communities.slice(0, TERMINAL.limits.communities)) {
    lines.push(twoCol(entry.name, first(entry.role), p.strong, p.muted));
  }

  if (events.length > 0) {
    if (communities.length > 0) lines.push("");
    for (const event of events.slice(0, TERMINAL.limits.events)) {
      lines.push(
        twoCol(event.title, formatMonth(event.startAt), p.strong, p.muted),
        indent(INDENT) + p.link(`${ORIGIN}/events/${event.slug}`),
        "",
      );
    }
    lines.pop();
  }

  lines.push(
    "",
    twoCol("All events", `${short(ORIGIN)}/events`, p.muted, p.link),
  );
  return lines;
}

/**
 * Where to find the person, not the site.
 *
 * Driven off `about.links`, so a channel that is not configured is simply not
 * printed rather than rendered as an empty row — the same rule the footer's
 * social icons follow.
 */
function links(p: Palette, record: About | null): string[] {
  const configured = record?.links;
  const rows: [string, string][] = [
    ["Email", first(configured?.email, SITE_CONFIG.email)],
    ["GitHub", first(configured?.github)],
    ["LinkedIn", first(configured?.linkedin)],
    ["X", first(configured?.xtwitter)],
    ["YouTube", first(configured?.youtube)],
    ["Instagram", first(configured?.instagram)],
    ["Links", SITE_CONFIG.linksUrl],
  ].filter((row): row is [string, string] => Boolean(row[1]));

  if (rows.length === 0) return [];

  const lines = heading(p, "Elsewhere");
  for (const [label, value] of rows) {
    lines.push(field(p, label, label === "Email" ? value : short(value)));
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
 * The closing block.
 *
 * It names the browser version first. This surface is a door, not a walled
 * garden, and a reader who wants the photographs, the gallery or the comment
 * threads should be told plainly where they are.
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
    // The boot sequence plays by default, so what the reader needs from this
    // block is not how to see it — they just did — but how to turn it off. The
    // reader most likely to want that is the one about to pipe this somewhere,
    // and they will not find the flag by guessing.
    field(p, "Skip intro", `curl -L "${short(ORIGIN)}?static"`),
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
 * Deliberately not `getHomepageData()`: that one also resolves every video's
 * duration against the YouTube API, and this surface prints no durations. The
 * rest of the calls are the same ones, so Next's data cache serves both.
 */
async function getTerminalData() {
  const [
    aboutRecord,
    experiences,
    educations,
    tools,
    communities,
    projectRecords,
    events,
    posts,
  ] = await Promise.all([
    api.getAbout(),
    api.getExperiences(),
    api.getEducations(),
    api.getTools(),
    api.getCommunities(),
    api.getProjects({ limit: TERMINAL.limits.projects }),
    api.getEvents({ limit: TERMINAL.limits.events }),
    api.getBlogs({ limit: TERMINAL.limits.posts }),
  ]);

  return {
    aboutRecord,
    experiences,
    educations,
    tools,
    communities,
    projectRecords,
    events,
    posts,
  };
}

/**
 * The masthead alone, as lines, for the boot sequence to reveal one at a time.
 *
 * It shares `banner()` with the document rather than drawing its own, so the
 * animated and static forms can never show different mastheads. `getAbout` is
 * the same cached call the document makes, so asking for this first costs
 * nothing.
 */
export async function renderTerminalMasthead(
  mode: ColorMode,
): Promise<string[]> {
  return banner(palette(mode), await api.getAbout());
}

/**
 * Builds the document.
 *
 * Sections that resolve to nothing contribute nothing — no heading, no blank
 * run — so an API that is half down produces a shorter page rather than a
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
    ...(masthead ? banner(p, data.aboutRecord) : []),
    ...lead(p, data.aboutRecord),
    ...bio(p, data.aboutRecord),
    ...work(p, data.experiences),
    ...skills(p, data.tools),
    ...projects(p, data.projectRecords),
    ...education(p, data.educations),
    ...community(p, data.communities, data.events),
    ...writing(p, data.posts),
    ...contact(p, data.aboutRecord),
    ...links(p, data.aboutRecord),
    ...colophon(p),
  ];

  return `${document.join("\n")}\n`;
}
