#!/usr/bin/env node
/**
 * Builds `lib/portrait-ascii.ts`: the portrait the terminal profile prints.
 *
 *   node scripts/portrait-ascii.mjs [columns] [rows]
 *
 * Run it again when the portrait changes. The result is committed rather than
 * computed per request, because `curl -L dileepa.dev` is a dynamic route on a
 * CPU-metered plan and the photo changes about once a year.
 *
 * - The photo comes from the API (`about.images`), the one the site shows.
 * - **Quadrant blocks.** Each character cell holds a 2x2 grid of pixels drawn
 *   with one of the sixteen quadrant characters (`▘▝▖▗▀▄▌▐▚▞▛▜▙▟█`), the
 *   lighter pixels in the foreground colour and the darker in the background
 *   - what `chafa` does. Half-blocks (`▀`), the first version, hold 1x2, so at
 *   the same width this doubles the detail across: 34 columns are 68 pixels.
 * - **Taller than wide.** A head and shoulders is a portrait-shaped picture,
 *   and the masthead can grow down where it cannot grow across (72 columns,
 *   with the info panel beside it). 34 x 22 cells is 68 x 44 pixels - about
 *   three times the 32 x 32 of the square half-block version, which read as a
 *   face but not as anyone in particular.
 * - **No sharpening.** On a picture this small it turned skin texture into
 *   speckle. Lanczos for the shrink keeps the edges that matter.
 * - Colour is the 256-colour grey ramp (232-255), which every terminal that
 *   shows colour at all can draw - truecolor would lose older macOS Terminal,
 *   and side by side it looked no different.
 * - The flat studio backdrop is cut out by a flood fill from the edges, so
 *   the face sits on the reader's own terminal, light or dark.
 * - The plain rows (`?nocolor`) shade each cell by character, dark ink dense,
 *   as text on paper reads.
 *
 * `sharp` is Next's own image dependency, so nothing is added to install.
 */
import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.dileepa.dev";
const COLUMNS = Number(process.argv[2] || 34);
const ROWS = Number(process.argv[3] || 22);
const OUT = new URL("../lib/portrait-ascii.ts", import.meta.url);

const about = await (await fetch(`${API}/about`)).json();
const images = about.images ?? {};
const source = images.profileJpg || images.profilePng || images.profileWebp;
if (!source) throw new Error("The /about record has no portrait image");

const input = Buffer.from(await (await fetch(source)).arrayBuffer());

// Two pixels across and two down per cell. A cell is about twice as tall as
// it is wide, so its 2x2 pixels are square and the crop keeps the picture's
// proportions: COLUMNS wide by ROWS * 2 tall, in cell widths.
const width = COLUMNS * 2;
const height = ROWS * 2;
const meta = await sharp(input).metadata();
const side = Math.round(Math.min(meta.width, meta.height) * 0.95);
const cropWidth = Math.round(side * Math.min(1, COLUMNS / (ROWS * 2)));
const { data } = await sharp(input)
  .extract({
    left: Math.round((meta.width - cropWidth) / 2),
    top: 0,
    width: cropWidth,
    height: side,
  })
  .grayscale()
  .resize(width, height, { kernel: "lanczos3", fit: "fill" })
  .normalise()
  .raw()
  .toBuffer({ resolveWithObject: true });

const at = (x, y) => data[y * width + x];
const inside = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

// The background: everything joined to an edge pixel within `TOLERANCE` of
// the top corners' tone. A flood fill, not a threshold, so a highlight on the
// face that happens to match the backdrop is not punched out. The tolerance
// is tight because the lit side of the face sits close to the backdrop's grey.
const TOLERANCE = 10;
const backdrop = Math.round((at(0, 0) + at(width - 1, 0)) / 2);
const isBackground = new Uint8Array(width * height);
const queue = [];
for (let x = 0; x < width; x++) queue.push([x, 0]);
for (let y = 0; y < height; y++) queue.push([0, y], [width - 1, y]);
while (queue.length > 0) {
  const [x, y] = queue.pop();
  if (!inside(x, y)) continue;
  const index = y * width + x;
  if (isBackground[index]) continue;
  if (Math.abs(at(x, y) - backdrop) > TOLERANCE) continue;
  isBackground[index] = 1;
  queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// What the tight fill leaves is a halo of backdrop a shade brighter than the
// corner it was sampled from. A pixel touching the cut-out that is at least
// as light as the backdrop is backdrop too; skin and hair are darker.
const halo = [];
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (isBackground[y * width + x] || at(x, y) < backdrop - 4) continue;
    const touches = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(
      ([dx, dy]) =>
        inside(x + dx, y + dy) && isBackground[(y + dy) * width + x + dx] === 1,
    );
    if (touches) halo.push(y * width + x);
  }
}
for (const index of halo) isBackground[index] = 1;

const ink = (x, y) => (isBackground[y * width + x] ? null : at(x, y));

/** A luminance (0-255) as one of the 256-colour palette's greys. */
function grey(value) {
  if (value < 4) return 16;
  if (value > 246) return 231;
  return 232 + Math.min(23, Math.max(0, Math.round((value - 8) / 10)));
}

/**
 * The quadrant characters, indexed by which pixels are foreground:
 * top-left 1, top-right 2, bottom-left 4, bottom-right 8.
 */
const QUADRANTS = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█";
const ESC = "\u001b[";
const RAMP = " .:-=+*#%@"; // light to dark: dark ink is dense, as on paper
const mean = (values) => values.reduce((a, b) => a + b, 0) / values.length;

const colour = [];
const plain = [];

for (let row = 0; row < ROWS; row++) {
  let line = "";
  let text = "";
  for (let column = 0; column < COLUMNS; column++) {
    const x = column * 2;
    const y = row * 2;
    const cell = [ink(x, y), ink(x + 1, y), ink(x, y + 1), ink(x + 1, y + 1)];
    const shown = cell.filter((value) => value !== null);

    if (shown.length === 0) {
      line += " ";
      text += " ";
      continue;
    }

    // Two tones per cell: the foreground and the background colour of the
    // character. Where the cell touches the cut-out, the backdrop is the
    // terminal's own background and the pixels that remain are one tone.
    // Otherwise the pixels split at their mean, lighter ones in front.
    let mask = 0;
    let front;
    let back = null;
    if (shown.length < 4) {
      cell.forEach((value, i) => {
        if (value !== null) mask |= 1 << i;
      });
      front = mean(shown);
    } else {
      const middle = mean(cell);
      const light = cell.filter((value) => value >= middle);
      const dark = cell.filter((value) => value < middle);
      if (dark.length === 0) {
        mask = 15;
        front = middle;
      } else {
        cell.forEach((value, i) => {
          if (value >= middle) mask |= 1 << i;
        });
        front = mean(light);
        back = mean(dark);
      }
    }

    const codes =
      back === null
        ? `38;5;${grey(front)}`
        : `38;5;${grey(front)};48;5;${grey(back)}`;
    line += `${ESC}${codes}m${QUADRANTS[mask]}${ESC}0m`;

    const level = Math.round(((255 - mean(shown)) / 255) * (RAMP.length - 1));
    text += RAMP[Math.max(1, level)];
  }
  colour.push(line);
  plain.push(text);
}

const quote = (rows) => rows.map((r) => `  ${JSON.stringify(r)},`).join("\n");

writeFileSync(
  OUT,
  `// Generated by scripts/portrait-ascii.mjs from the API portrait - do not edit.
// Regenerate with \`node scripts/portrait-ascii.mjs\` when the photo changes.
// prettier-ignore

/** Columns the portrait occupies. Every row is this wide, visibly. */
export const PORTRAIT_WIDTH = ${COLUMNS};

/** Quadrant-block rows in the 256-colour grey ramp, background cut out. */
export const PORTRAIT_COLOUR: readonly string[] = [
${quote(colour)}
];

/** The same picture shaded in characters, for \`?nocolor\`. */
export const PORTRAIT_PLAIN: readonly string[] = [
${quote(plain)}
];
`,
);

console.log(
  `Wrote a ${COLUMNS}x${ROWS} portrait (${width}x${height} pixels) from ${source}`,
);
