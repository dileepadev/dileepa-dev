/**
 * The boot sequence — what `curl -L "dileepa.dev?intro"` plays before the profile.
 *
 * A normal response arrives as one body and prints at once. This one arrives as
 * a chunked stream with pauses between the chunks, and `curl` prints bytes as
 * they land rather than waiting for the end, so the pauses become timing and
 * the timing becomes animation. Nothing here is a trick of the client: it is
 * ordinary HTTP, written slowly.
 *
 * **Why it is opt-in.** The server cannot tell whether the reader's `stdout` is
 * a terminal or a file — `isatty` is answered on the client, and curl sends
 * nothing about it. So an animation on the default response would also be an
 * animation inside `curl -L dileepa.dev > profile.txt`: spinner frames, partial
 * lines and carriage returns, saved to disk. The plain command stays the clean,
 * pipeable document; the animation is asked for by name.
 *
 * **Why it ends.** The obvious reference point loops until the reader presses
 * Ctrl+C. That is fine for a novelty and wrong for a profile — a command that
 * does not terminate cannot be put in a script, a README, or a demo without a
 * caveat. This one runs about two and a half seconds — see `TIMING` — resolves into the
 * same document the static route serves, and exits 0.
 */

import {
  hideCursor,
  progressBar,
  resetLine,
  showCursor,
  SPINNER,
  palette,
  type ColorMode,
} from "./ansi";
import { renderTerminalMasthead, renderTerminalProfile } from "./terminal";

const GUTTER = "  ";

/**
 * The frame budget, in milliseconds.
 *
 * These multiply, and it is easy to write a sequence that reads as "a moment"
 * and runs for ten seconds — four steps at four spinner turns of eight frames
 * is nine seconds of spinner alone. The numbers below are chosen against a
 * total, not against how each phase feels on its own:
 *
 *     masthead   14 x 55   =  770   (one row of the panel per frame)
 *     settle          180  =  180
 *     steps       4 x 360  = 1440   (one spinner turn each)
 *     bar         20 x 18  =  360
 *     settle          180  =  180
 *                            ----
 *                            2930ms
 *
 * Anyone changing one of these should re-add the column. Two and a half seconds
 * is already the ceiling for something standing between a reader and the answer
 * they asked for.
 */
const TIMING = {
  /** Per row of the masthead as it wipes down. */
  reveal: 55,
  /** Per spinner frame. `SPINNER.length` frames make one full turn. */
  spin: 45,
  /** Spinner turns per boot step before it resolves. One is enough to read. */
  spinsPerStep: 1,
  /** Per progress-bar frame. */
  tick: 18,
  /** The pause between phases. */
  settle: 180,
} as const;

/** The bar is 40 cells wide but advances in 20 frames — two cells at a time. */
const BAR = { cells: 40, frames: 20 } as const;

/**
 * The boot steps.
 *
 * Each names something the response genuinely does. The data really is fetched
 * from `api.dileepa.dev`, the document really is composed at this width, and
 * writing "decrypting" or "bypassing firewall" over a portfolio would be the
 * kind of copy the voice guide exists to prevent.
 */
const STEPS = [
  "resolving dileepa.dev",
  "fetching profile",
  "composing document",
  "rendering 72 columns",
] as const;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Streams the boot sequence, then the profile.
 *
 * `signal` is the request's. A reader who presses Ctrl+C aborts it, and every
 * loop checks it — without that, the sequence keeps sleeping and enqueuing into
 * a stream nobody is reading, holding a function invocation open for the rest
 * of its budget.
 */
export function streamTerminalIntro(
  mode: ColorMode,
  signal: AbortSignal,
): ReadableStream<Uint8Array> {
  const p = palette(mode);
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (text: string) => controller.enqueue(encoder.encode(text));
      const aborted = () => signal.aborted;

      // Every frame loop below is a redraw, and a redraw needs somewhere to
      // redraw *to*. Plain mode has no cursor control — `resetLine` degrades to
      // a newline — so an animation played in it is not an animation, it is
      // sixty consecutive lines of spinner saved to a file. Plain mode gets the
      // outcome of each step and nothing else, which is what someone piping
      // this asked for when they turned the escape codes off.
      const animated = mode !== "plain";

      try {
        write(hideCursor(mode));

        // 1. The masthead, revealed a row at a time.
        //
        //    A wipe down rather than a left-to-right fill: filling by column
        //    means repainting all five rows every frame, which needs cursor-up
        //    and brings back every problem `resetLine` exists to avoid. A row
        //    is written once and never touched again, so the block builds
        //    itself in place and nothing can land in the wrong line.
        for (const row of await renderTerminalMasthead(mode)) {
          if (aborted()) return;
          write(`${row}\n`);
          if (animated) await sleep(TIMING.reveal);
        }
        write("\n");
        if (animated) await sleep(TIMING.settle);

        // 2. The boot steps. Each spins in place on its own line, then is
        //    overwritten by its resolved form — one line, one final state.
        for (const step of STEPS) {
          const label = step.padEnd(24, " ");

          if (animated) {
            for (
              let frame = 0;
              frame < SPINNER.length * TIMING.spinsPerStep;
              frame++
            ) {
              if (aborted()) return;
              const glyph = SPINNER[frame % SPINNER.length];
              write(
                `${resetLine(mode)}${GUTTER}${p.brand(glyph)} ${p.muted(label)}`,
              );
              await sleep(TIMING.spin);
            }
          }

          if (aborted()) return;
          write(
            `${animated ? resetLine(mode) : ""}${GUTTER}${p.brand("✓")} ${p.muted(label)}${p.strong("ok")}\n`,
          );
        }

        write("\n");

        // 3. The bar. It is honest about being decorative — everything it
        //    reports has already happened by the time it draws.
        const barLine = (ratio: number) =>
          `${GUTTER}${p.brand(progressBar(ratio, BAR.cells))} ${p.strong(
            `${String(Math.round(ratio * 100)).padStart(3, " ")}%`,
          )}`;

        if (animated) {
          for (let step = 0; step <= BAR.frames; step++) {
            if (aborted()) return;
            write(`${resetLine(mode)}${barLine(step / BAR.frames)}`);
            await sleep(TIMING.tick);
          }
        } else {
          write(barLine(1));
        }
        write("\n");
        if (animated) await sleep(TIMING.settle);

        if (aborted()) return;

        // 4. The document, unchanged. Whatever the animation did, what the
        //    reader is left holding is the same profile the plain command
        //    prints — so the two can never drift into different content.
        write(await renderTerminalProfile(mode, { masthead: false }));
      } catch {
        // A disconnected reader makes `enqueue` throw. That is the normal end
        // of this stream, not an error worth logging or reporting.
      } finally {
        try {
          write(showCursor(mode));
        } catch {
          // The stream is already gone; the reader's terminal restores its own
          // cursor when the connection closes.
        }
        try {
          controller.close();
        } catch {
          // Already closed or errored by the disconnect. Nothing to do.
        }
      }
    },

    cancel() {
      // Nothing to release. The loops above exit on the abort signal.
    },
  });
}
