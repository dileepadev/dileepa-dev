/**
 * ANSI colour and fixed-width layout.
 *
 * The terminal rendering is the one surface on this site that has no CSS, so
 * the brand has to survive as escape codes and spaces. Two rules carry over
 * unchanged from `app/brand-tokens.css`:
 *
 * - **Emerald is the only accent.** Nothing here emits a second hue. Everything
 *   that is not emerald is the terminal's own foreground, either at full
 *   strength or dimmed — which is the escape-code equivalent of `--fg` and
 *   `--fg-muted`, and means the output inherits whatever palette the reader has
 *   already chosen rather than fighting it.
 * - **Emerald Bright, not Emerald Deep.** The guide forbids Emerald Deep on
 *   Carbon and Emerald Bright on Paper. A terminal is a dark surface by
 *   overwhelming default and its background cannot be detected over HTTP, so
 *   Bright is the correct stop. Readers on a light terminal have `?nocolor`.
 *
 * Colour is emitted as 24-bit truecolor rather than a 256-colour approximation
 * because the token has an exact value and every terminal in current use
 * renders it. `plain` mode drops every code instead of approximating.
 */

/** `--emerald-bright`, `#23b888`, as the RGB triplet an SGR sequence wants. */
const EMERALD_BRIGHT = [35, 184, 136] as const;

/** U+001B. Written as an escape so the source file stays plain ASCII. */
const ESC = "\u001b";

/**
 * Matches an SGR escape sequence — the only kind this module emits.
 *
 * Width has to be measured against what a reader sees, and an escape code
 * occupies bytes without occupying a column. Every alignment helper below
 * strips with this first; measuring `String.length` instead is what makes a
 * coloured table look correct until the first coloured cell.
 */
const SGR = /\u001b\[[0-9;]*m/g;

export type ColorMode = "ansi" | "plain";

/** The styles the document composes from. Each is `(text) => text` in plain mode. */
export interface Palette {
  /** The accent. One per block, the way the site spends emerald. */
  brand: (text: string) => string;
  /** `--fg`: a heading or a value that carries the line. */
  strong: (text: string) => string;
  /** `--fg-muted`: labels, metadata, rules, anything supporting. */
  muted: (text: string) => string;
  /** A link. Underlined rather than coloured — emerald is spoken for. */
  link: (text: string) => string;
}

function code(...parts: (string | number)[]): string {
  return `${ESC}[${parts.join(";")}m`;
}

const RESET = code(0);

export function palette(mode: ColorMode): Palette {
  if (mode === "plain") {
    const asIs = (text: string) => text;
    return { brand: asIs, strong: asIs, muted: asIs, link: asIs };
  }

  const wrapIn = (open: string) => (text: string) =>
    text ? `${open}${text}${RESET}` : text;

  return {
    brand: wrapIn(code(38, 2, ...EMERALD_BRIGHT)),
    strong: wrapIn(code(1)),
    muted: wrapIn(code(2)),
    link: wrapIn(code(4)),
  };
}

/** The visible column count of a string, ignoring escape codes. */
export function width(text: string): number {
  return strip(text).length;
}

/** Removes every escape code. Used for width, wrapping and the plain mode. */
export function strip(text: string): string {
  return text.replace(SGR, "");
}

/** Pads to `columns` visible characters. A string already wider is returned as-is. */
export function padEnd(text: string, columns: number): string {
  return text + " ".repeat(Math.max(0, columns - width(text)));
}

/**
 * Greedy word wrap at `columns`.
 *
 * A token longer than the line — which in practice means a URL — is placed on
 * its own line and allowed to overflow rather than broken. A wrapped URL is a
 * URL that cannot be double-clicked or copied, and losing the alignment of one
 * line costs less than that.
 */
export function wrap(text: string, columns: number): string[] {
  const words = strip(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (!line) {
      line = word;
    } else if (line.length + 1 + word.length <= columns) {
      line += ` ${word}`;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);

  return lines;
}

/** `truncate("a very long title", 10)` -> `"a very l…"`. */
export function truncate(text: string, columns: number): string {
  const plain = strip(text);
  if (plain.length <= columns) return plain;
  return `${plain.slice(0, Math.max(0, columns - 1)).trimEnd()}…`;
}

// --- Stream control --------------------------------------------------------
//
// Everything above builds a document. What follows is for writing one *over
// time*, down a chunked HTTP response, which is the only way an animation
// reaches `curl` — it prints bytes as they arrive rather than waiting for the
// body to finish.
//
// These use carriage returns rather than cursor-up sequences on purpose. `\r`
// returns to the start of the current line and nothing else, so a redraw can
// only ever overwrite the line it is on. A cursor-up redraw is prettier and
// can repaint a whole block, but if the reader's window is narrower than the
// line, the line has already wrapped, and `up 1` lands in the middle of it and
// eats output that was never meant to move. The animation stays on one line at
// a time so it cannot corrupt what came before.

/** Returns to column 0 of the current line, then clears it. */
export function resetLine(mode: ColorMode): string {
  return mode === "plain" ? "\n" : `\r${ESC}[2K`;
}

/**
 * Hides and shows the cursor.
 *
 * A block cursor parked at the end of a spinner is the difference between a
 * progress indicator and a glitch. The show is not optional and must survive
 * the reader pressing Ctrl+C, so the caller emits it from a `finally`.
 */
export function hideCursor(mode: ColorMode): string {
  return mode === "plain" ? "" : `${ESC}[?25l`;
}

export function showCursor(mode: ColorMode): string {
  return mode === "plain" ? "" : `${ESC}[?25h`;
}

/** The braille spinner. Eight frames, no ASCII fallback needed — it is UTF-8. */
export const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧"] as const;

/**
 * A progress bar of `width` cells at `ratio` (0..1).
 *
 * Filled cells are full blocks and the remainder is a light shade rather than a
 * space, so the bar has a visible track at 0% instead of appearing not to exist
 * until it is half done.
 */
export function progressBar(ratio: number, cells: number): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(clamped * cells);
  return "█".repeat(filled) + "░".repeat(Math.max(0, cells - filled));
}
