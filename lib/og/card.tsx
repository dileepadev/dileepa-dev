import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * The social card, generated per record, in the official design.
 *
 * There is one card design on this platform and this is it - the terminal
 * window from `docs/brand/covers/source-1584x396.svg`, which is also what
 * `public/og.png` and every uploaded profile cover carry. What varies here is
 * the record: the command line names the path, and the title is the record's.
 *
 * Satori, not a browser. Flexbox only, every multi-child node needs an explicit
 * `display: flex`, and the colours are literal because there is no cascade out
 * here to read tokens from - each names the token it tracks.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const CARBON = "#050505"; // --ink-900 / --bg
const SURFACE = "#0D0D0D"; // --ink-800 / --bg-surface
const EDGE = "#2E2E2E"; // --ink-500 / --border-strong
const TEXT = "#F1F1F1"; // --ink-100 / --fg
const MUTED = "#8D8D8D"; // --ink-400 / --fg-muted
const EMERALD = "#23B888"; // --emerald-bright / --brand on Carbon

/**
 * JetBrains Mono, vendored beside this file with its OFL licence.
 *
 * The whole card is mono, so Manrope is not loaded here at all - two faces
 * rather than four keeps the bundle well inside `@vercel/og`'s 500KB ceiling.
 *
 * Read from disk, not `fetch(new URL(..., import.meta.url))`. That form is what
 * the examples use and it throws `not implemented... yet...`: the URL resolves
 * to `file:` and this runtime's fetch does not do `file:`. It fails at request
 * time rather than build time, because an `opengraph-image` in a dynamic
 * segment renders on demand - so the build stays green and every card 500s.
 * `outputFileTracingIncludes` in next.config.ts puts the files in the bundle.
 */
async function fonts() {
  const dir = join(process.cwd(), "lib", "og");
  const [regular, bold] = await Promise.all([
    readFile(join(dir, "JetBrainsMono-Regular.ttf")),
    readFile(join(dir, "JetBrainsMono-Bold.ttf")),
  ]);
  return [
    {
      name: "JetBrains Mono",
      data: regular,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "JetBrains Mono",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

/**
 * Long titles have to fit rather than overflow.
 *
 * Satori will not shrink text to fit, so the step comes from the length. Mono
 * is the reason the breakpoints are tighter than they would be for Manrope:
 * every glyph is the same width, so a title's length predicts its rendered
 * width almost exactly.
 */
function titleSize(title: string): number {
  if (title.length > 90) return 34;
  if (title.length > 62) return 40;
  if (title.length > 38) return 48;
  return 56;
}

/**
 * The command line is one line, or it is nonsense.
 *
 * Satori wraps it otherwise, and a wrapped `curl -L` breaks across "curl -" and
 * "L" - a command that would not run, on a card whose whole idea is a terminal.
 * Mono makes the fix exact rather than approximate: every glyph is 0.6em, so at
 * 22px inside the card's 1024px of inner width the line holds 77 characters,
 * and `$ curl -L dileepa.dev` plus its two gaps spends 23 of them.
 */
const COMMAND_PATH_CHARS = 52;

function commandPath(path: string): string {
  return path.length <= COMMAND_PATH_CHARS
    ? path
    : `${path.slice(0, COMMAND_PATH_CHARS - 1)}\u2026`;
}

export interface OgCard {
  /** The emerald kicker: "Blog", "Project", "Event". */
  label: string;
  title: string;
  /** The site-relative path, echoed in the command line. */
  path: string;
  /** Date, reading time, status - whatever the record has. */
  meta?: string;
}

/** The three window dots, in the order the design draws them. */
function Dots() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: EDGE,
            marginRight: i < 2 ? 12 : 0,
          }}
        />
      ))}
    </div>
  );
}

export function ogCard({ label, title, path, meta }: OgCard) {
  return fonts().then(
    (loaded) =>
      new ImageResponse(
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: CARBON,
            padding: 48,
            fontFamily: "JetBrains Mono",
          }}
        >
          {/* The terminal window. Same chrome as the cover artwork. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              borderRadius: 20,
              border: `2px solid ${EDGE}`,
              background: SURFACE,
            }}
          >
            {/* Title bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: 58,
                paddingLeft: 26,
                paddingRight: 26,
                borderBottom: `1px solid ${EDGE}`,
              }}
            >
              <Dots />
              <div
                style={{
                  display: "flex",
                  marginLeft: 34,
                  fontSize: 17,
                  color: MUTED,
                }}
              >
                dileepadev - zsh
              </div>
            </div>

            {/* Body */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flex: 1,
                padding: "34px 40px 32px 40px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* The command that would fetch this very page. */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 22,
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ display: "flex", color: EMERALD }}>$</div>
                  <div
                    style={{ display: "flex", marginLeft: 12, color: MUTED }}
                  >
                    curl -L
                  </div>
                  <div
                    style={{ display: "flex", marginLeft: 12, color: EMERALD }}
                  >
                    dileepa.dev{commandPath(path)}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    marginTop: 30,
                    fontSize: 19,
                    fontWeight: 700,
                    color: EMERALD,
                  }}
                >
                  {label}
                </div>

                <div
                  style={{
                    display: "flex",
                    marginTop: 16,
                    fontSize: titleSize(title),
                    lineHeight: 1.22,
                    fontWeight: 700,
                    color: TEXT,
                    maxWidth: 1000,
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
                }}
              >
                {/* The lockup: neutral wordmark, emerald "/." flush at its base. */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", fontSize: 26, color: TEXT }}>
                    dileepadev
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginLeft: 9,
                      fontSize: 26,
                      fontWeight: 700,
                      color: EMERALD,
                    }}
                  >
                    /
                  </div>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      marginLeft: 2,
                      marginTop: 11,
                      borderRadius: 999,
                      background: EMERALD,
                    }}
                  />
                </div>

                {meta ? (
                  <div style={{ display: "flex", fontSize: 20, color: MUTED }}>
                    {meta}
                  </div>
                ) : (
                  <div style={{ display: "flex" }} />
                )}
              </div>
            </div>
          </div>
        </div>,
        { ...OG_SIZE, fonts: loaded },
      ),
  );
}
