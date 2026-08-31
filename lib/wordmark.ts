/**
 * The wordmark, drawn large in block characters.
 *
 * **This is a display treatment of the lockup, not a second lockup.** The guide
 * is strict about the mark — the wordmark is never emerald, the `/.` is never
 * the neutral foreground, and the two never swap. Drawing it bigger does not
 * suspend that: `render()` returns the wordmark and the mark as separate
 * strings per row so the caller colours them the way it colours the small
 * lockup everywhere else. A banner that got the colours backwards would be the
 * one brand failure visible from across a room.
 *
 * **Why a hand-built font and not a figlet.** The obvious font for this is ANSI
 * Shadow, which is what most `curl`-a-résumé sites use. Its glyphs are eight to
 * nine columns wide, so "dileepadev" lands around 75 columns before the mark —
 * past the 72 this document is built to, and past the 80-column terminal the
 * whole layout is sized for once a gutter and a box border are added. Widening
 * the document to fit the banner would be letting the decoration set the
 * measure for the content. So the font is hand-drawn on a 6-row body at
 * proportional widths, which puts the full wordmark and the mark inside 60
 * columns with room to spare.
 *
 * Only the ten letters of the wordmark and the two mark characters exist here.
 * This is not a font; it is one word.
 */

/**
 * Rows per glyph.
 *
 * Six, because the wordmark is lowercase and lowercase needs three zones: an
 * ascender for `d` and `l` and the dot of the `i`, four rows of x-height for
 * the body, and a descender for the `p`. Setting every letter on one 5-row
 * block is what turns `dileepadev` into `DILEEPADEV` — legible, but the wrong
 * word. The lockup is lowercase everywhere else on the platform, and it is
 * lowercase here.
 *
 * The descender row is empty for nine of the ten letters and is kept anyway:
 * the grid stays rectangular, so every row of the assembled block is the same
 * width and the box it sits in can align on one measurement.
 */
const ROWS = 6;

/**
 * Columns between one glyph and the next.
 *
 * Glyphs are **proportional**, not monospaced: each is exactly as wide as its
 * own ink, and this gap is the only space between them. A fixed cell width is
 * the obvious way to build a block font and it is wrong for a lowercase one —
 * `i` is one column of ink and `d` is four, so padding both into a 4-column
 * cell leaves the `i` with three dead columns on its right. The result reads as
 * `di leepadev`: two blank columns between `d` and `i`, four between `i` and
 * `l`, from a table that looks perfectly regular in the source.
 *
 * With proportional glyphs every letter pair is separated by exactly this much
 * and nothing else, so the spacing is even by construction rather than by
 * hand-tuning each cell.
 */
const GAP = 2;

/**
 * The glyphs.
 *
 * Every entry is `ROWS` strings of exactly `WIDTH` characters — space-padded,
 * never trimmed, because the padding is what holds the columns together. The
 * assertion below enforces it rather than trusting the table to stay correct
 * through an edit.
 */
const GLYPHS: Record<string, string[]> = {
  //     ascender  x-height --------------------  descender
  d: ["   █", " ███", "█  █", "█  █", " ███", "    "],
  i: ["█", " ", "█", "█", "█", " "],
  // No foot on the `l`. A serifed foot makes the glyph two columns wide while
  // its stem stays one, so every row except the baseline gains a third blank
  // column to the right and `le` sits wider than every other pair. A bare stem
  // is also what a lowercase `l` is in a geometric face, which is what this is.
  l: ["█", "█", "█", "█", "█", " "],
  e: ["    ", " ██ ", "████", "█   ", " ███", "    "],
  p: ["    ", "███ ", "█  █", "█  █", "███ ", "█   "],
  a: ["    ", " ██ ", "█  █", "█  █", " ███", "    "],
  v: ["    ", "█  █", "█  █", "█  █", " ██ ", "    "],
};

/**
 * The `/.` — drawn as one glyph rather than two.
 *
 * Composing it from a slash and a full stop puts the shared inter-letter gap
 * between them, and the pair reads as `/ .` rather than `/.`. That is named in
 * the brand repo as one of the six conflicts the reference HTML got wrong, so
 * reproducing it here at eight times the size is not an option. The dot sits
 * tucked into the slash's baseline, which is what the small lockup does with a
 * negative-margin `::after`.
 */
const MARK = ["    █ ", "   █  ", "  █   ", " █    ", "█ ██  ", "      "];

// The mark is its own width, so the glyph loop below does not cover it.
if (MARK.length !== ROWS) {
  throw new Error(`The mark has ${MARK.length} rows, expected ${ROWS}`);
}

for (const [character, rows] of Object.entries(GLYPHS)) {
  if (rows.length !== ROWS) {
    throw new Error(
      `Glyph "${character}" has ${rows.length} rows, expected ${ROWS}`,
    );
  }
  // Rows within a glyph must agree with each other. They no longer have to
  // agree with any other glyph — that is the whole point — but a glyph whose
  // own rows differ would shear the block apart below the first bad row.
  const width = rows[0].length;
  for (const row of rows) {
    if (row.length !== width) {
      throw new Error(
        `Glyph "${character}" mixes ${width}- and ${row.length}-column rows`,
      );
    }
  }
}

function draw(text: string): string[] {
  const rows: string[] = [];
  for (let row = 0; row < ROWS; row++) {
    rows.push(
      [...text]
        .map((character) => {
          const glyph = GLYPHS[character];
          if (!glyph) throw new Error(`No glyph for "${character}"`);
          return glyph[row];
        })
        .join(" ".repeat(GAP)),
    );
  }
  return rows;
}

/**
 * One row of the large lockup, split at the colour boundary.
 *
 * `wordmark` takes the neutral foreground and `mark` takes emerald, which is
 * the same division the small lockup makes in `components/ui/Lockup.tsx`. The
 * gap between them belongs to neither, so it travels with the mark where it is
 * invisible either way.
 */
export interface WordmarkRow {
  wordmark: string;
  mark: string;
}

/**
 * The gap between the wordmark and the mark.
 *
 * Wider than `GAP`, because the mark is a separate element of the lockup rather
 * than an eleventh letter, and at letter spacing it reads as part of the word.
 */
const MARK_GAP = 4;

/**
 * The large lockup, one entry per row.
 *
 * Trailing whitespace is kept: the caller pads these into a fixed-width box and
 * a trimmed row would shorten the line the box border sits on.
 */
export function renderWordmark(): WordmarkRow[] {
  return draw("dileepadev").map((row, index) => ({
    wordmark: row,
    mark: " ".repeat(MARK_GAP) + MARK[index],
  }));
}

/**
 * Total columns the rendered lockup occupies.
 *
 * Measured off the render rather than recomputed from the glyph table. The two
 * would agree today and drift the first time a glyph changes width, and the
 * value is used to decide whether the banner fits its box.
 */
export const WORDMARK_WIDTH = (() => {
  const [row] = renderWordmark();
  return row.wordmark.length + row.mark.length;
})();
