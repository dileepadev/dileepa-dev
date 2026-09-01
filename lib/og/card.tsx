import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The social card, generated per record.
 *
 * Every post, project and event shared the same `/og.png` before this: 29
 * records, one picture. The tag was valid, so no audit tool flagged it, and it
 * cost more real click-through than anything an audit tool did flag.
 *
 * Satori, not a browser. Flexbox and a subset of CSS only - no grid, no
 * `gap` shorthand quirks, and every element that contains more than one child
 * needs an explicit `display: flex`. Colours are literal here rather than
 * `var(--bg)`: this renders outside the document, so there is no cascade to
 * read them from. They are the v2.1 token values, and the comment beside each
 * one names the token it must track.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const CARBON = "#050505"; // --ink-900 / --bg
const EDGE = "#1f1f1f"; // --ink-600 / --border
const TEXT = "#f1f1f1"; // --ink-100 / --fg
const MUTED = "#8d8d8d"; // --ink-400 / --fg-muted
const EMERALD = "#23b888"; // --emerald-bright / --brand on Carbon

/**
 * Manrope, vendored beside this file. Satori reads ttf, not the woff2 that
 * next/font serves, which is why these are here rather than reused from there.
 *
 * Read from disk, not `fetch(new URL(..., import.meta.url))`. That form is the
 * one the examples use and it throws `not implemented... yet...` here: the URL
 * resolves to `file:`, and this runtime's fetch does not do `file:`. It fails
 * at request time rather than build time, because an `opengraph-image` in a
 * dynamic segment renders on demand - so the build stays green and every card
 * 500s. `outputFileTracingIncludes` in next.config.ts is what puts the two
 * files in the deployed bundle for this read to find.
 */
async function fonts() {
  const dir = join(process.cwd(), "lib", "og");
  const [medium, bold] = await Promise.all([
    readFile(join(dir, "Manrope-Medium.ttf")),
    readFile(join(dir, "Manrope-Bold.ttf")),
  ]);
  return [
    {
      name: "Manrope",
      data: medium,
      weight: 500 as const,
      style: "normal" as const,
    },
    {
      name: "Manrope",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * Long titles have to fit rather than overflow.
 *
 * Satori will not shrink text to fit, so the step comes from the length. The
 * breakpoints are where a title stops fitting three lines at the size above.
 */
function titleSize(title: string): number {
  if (title.length > 95) return 46;
  if (title.length > 65) return 56;
  if (title.length > 40) return 66;
  return 76;
}

export interface OgCard {
  /** The emerald kicker: "Blog", "Project", "Event". */
  label: string;
  title: string;
  /** Date, reading time, status - whatever the record has. Mono-ish metadata. */
  meta?: string;
}

export function ogCard({ label, title, meta }: OgCard) {
  return fonts().then(
    (loaded) =>
      new ImageResponse(
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: CARBON,
            padding: "72px 80px",
            fontFamily: "Manrope",
            // The one emerald element on the surface is the rule down the
            // left edge, the kicker and the mark. Brand guide section 1:
            // emerald appears once per surface as a deliberate accent.
            borderLeft: `10px solid ${EMERALD}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.01em",
                color: EMERALD,
                textTransform: "none",
              }}
            >
              {label}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: titleSize(title),
                lineHeight: 1.12,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: TEXT,
                // Satori has no line clamp; the width cap plus the size step
                // above is what keeps a long title inside the card.
                maxWidth: 960,
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              borderTop: `2px solid ${EDGE}`,
              paddingTop: 28,
            }}
          >
            {/* The lockup: neutral wordmark, emerald "/." - never the reverse. */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 500,
                  color: TEXT,
                }}
              >
                dileepadev
              </div>
              <div
                style={{
                  display: "flex",
                  // 0.34em at this size, matching `.lockup`'s gap. The dot
                  // that follows gets almost none: the brand guide has it
                  // "flush against its base" so the pair reads as one
                  // character, "/.", not two with daylight between them.
                  marginLeft: 10,
                  fontSize: 30,
                  fontWeight: 700,
                  color: EMERALD,
                }}
              >
                /
              </div>
              <div
                style={{
                  width: 7,
                  height: 7,
                  marginLeft: 2,
                  // The row is centred, and a dot centred against a 30px
                  // glyph floats at its middle. This drops it to the
                  // baseline, which is where the lockup puts it.
                  marginTop: 13,
                  borderRadius: 999,
                  background: EMERALD,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 500,
                color: MUTED,
              }}
            >
              {meta ?? "dileepa.dev"}
            </div>
          </div>
        </div>,
        {
          ...OG_SIZE,
          fonts: loaded,
        },
      ),
  );
}
