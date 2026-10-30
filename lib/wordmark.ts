/**
 * The lockup, `@dileepadev`, drawn large in block characters.
 *
 * **This is a display treatment of the lockup, not a second lockup.** The guide
 * is strict about the mark - the wordmark at full contrast, the `@` one step
 * muted, and the two never swap. Drawing it bigger does not suspend that:
 * `renderWordmark()` returns the mark and the wordmark as separate strings per
 * row so the caller colours them the way the small lockup is coloured
 * everywhere else (`components/ui/Lockup.tsx`). A banner that got the contrast
 * backwards would be the one brand failure visible from across a room.
 *
 * v2.1.0 draft: the lockup was `dileepadev /.` - the wordmark, then the `/.` in
 * the accent - until the black-and-white palette made the handle the logo.
 *
 * **Why a hand-built font and not a figlet.** The obvious font for this is ANSI
 * Shadow, which is what most `curl`-a-résumé sites use. Its glyphs are eight to
 * nine columns wide, so "dileepadev" lands around 75 columns before the mark -
 * past the 72 this document is built to, and past the 80-column terminal the
 * whole layout is sized for once a gutter and a box border are added. Widening
 * the document to fit the banner would be letting the decoration set the
 * measure for the content. So the font is hand-drawn on a 6-row body at
 * proportional widths, which puts the mark and the full wordmark inside 60
 * columns with room to spare.
 *
 * Only the seven letters the wordmark uses and the `@` exist here. This is not
 * a font; it is one word.
 */

/**
 * Rows per glyph.
 *
 * Six, because the wordmark is lowercase and lowercase needs three zones: an
 * ascender for `d` and `l` and the dot of the `i`, four rows of x-height for
 * the body, and a descender for the `p`. Setting every letter on one 5-row
 * block is what turns `dileepadev` into `DILEEPADEV` - legible, but the wrong
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
 * the obvious way to build a block font and it is wrong for a lowercase one -
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
 * Every entry is `ROWS` strings of exactly `WIDTH` characters - space-padded,
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
 * The `@`, seven columns wide and the full six rows tall.
 *
 * An `@` is a wide character - a ring with a lowercase `a` inside it, the ring
 * left open at the lower right where the `a`'s stem runs out into it - and the
 * narrower drafts (five and six columns) closed the ring up into a blob that
 * read as a `G` or an `e`. At seven the inner `a` has a counter of its own and
 * the opening shows, which is what makes it an `@` rather than a circle. It
 * spans the ascender and the descender rows, as `@` does in a text face, so it
 * stands as tall as the `d` and reaches the `p`'s tail.
 */
const MARK = [" █████ ", "█     █", "█  ██ █", "█ █ █ █", "█  ███ ", " ████  "];

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
  // agree with any other glyph - that is the whole point - but a glyph whose
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
 * One row of the large lockup, split at the contrast boundary.
 *
 * `mark` - the `@` - is set one step muted and `wordmark` at full contrast,
 * the same division the small lockup makes in `components/ui/Lockup.tsx`. The
 * mark comes first, as it does in the handle. The gap between them belongs to
 * neither, so it travels with the mark, where it is invisible either way.
 */
export interface WordmarkRow {
  mark: string;
  wordmark: string;
}

/**
 * The large lockup, one entry per row.
 *
 * The `@` sits at letter spacing (`GAP`), not set apart: `@dileepadev` is one
 * handle, and a wider gap would split it into a symbol and a word.
 *
 * Trailing whitespace is kept: the caller pads these into a fixed-width box and
 * a trimmed row would shorten the line the box border sits on.
 */
export function renderWordmark(): WordmarkRow[] {
  return draw("dileepadev").map((row, index) => ({
    mark: MARK[index] + " ".repeat(GAP),
    wordmark: row,
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
  return row.mark.length + row.wordmark.length;
})();
