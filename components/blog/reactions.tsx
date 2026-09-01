"use client";

import { useEffect, useRef, useState } from "react";
import { SmilePlus } from "lucide-react";
import type { ReactionCounts, ReactionKind } from "@/lib/api-types";

/**
 * The reaction vocabulary, and the two pieces of UI that render it.
 *
 * One definition, three surfaces - posts, comments and replies all import this,
 * so they cannot drift into teaching two vocabularies.
 *
 * **Why emoji rather than a custom icon set.** §1 of the brand guide is that
 * emerald is the only accent and there is no second hue; the only other hues in
 * the system are `--error` and `--warning`, both annotated "UI state only,
 * never a brand accent". Four hand-drawn colour icons would mean inventing four
 * brand hues and hard-coding them in a component, against that rule and against
 * "colours come from tokens".
 *
 * Emoji sidestep it honestly rather than by loophole: they are *content*, the
 * way a photograph is content, and they introduce no token, no hex and nothing
 * the palette has to absorb. They also come from the reader's own platform, so
 * they read as familiar instead of invented - and they cost nothing to ship.
 *
 * The trade is that each platform draws them slightly differently. The four
 * below were picked because they are unambiguous in every major set; the more
 * expressive candidates (🛠️, 🙌) are exactly the ones that differ most.
 */

export const REACTIONS: {
  kind: ReactionKind;
  label: string;
  emoji: string;
}[] = [
  { kind: "liked", label: "Liked it", emoji: "❤️" },
  { kind: "insightful", label: "Insightful", emoji: "💡" },
  { kind: "useful", label: "Useful", emoji: "🔧" },
  // 📚 rather than 🎓: the graduation cap is drawn near-black in most sets and
  // disappears against the dark theme's Carbon surface. Checked on both themes.
  { kind: "learned", label: "Learned something", emoji: "📚" },
];

export function totalReactions(counts?: ReactionCounts | null): number {
  if (!counts) return 0;
  return REACTIONS.reduce((sum, { kind }) => sum + (counts[kind] ?? 0), 0);
}

/** The reactions actually used, most-used first - for the summary row. */
function present(counts?: ReactionCounts | null) {
  if (!counts) return [];
  return REACTIONS.filter(({ kind }) => (counts[kind] ?? 0) > 0).sort(
    (a, b) => (counts[b.kind] ?? 0) - (counts[a.kind] ?? 0),
  );
}

/**
 * Overlapping glyphs and a total - what a thread shows at a glance.
 *
 * Only reactions that were actually used appear. Four zeroes tell a reader
 * nothing and take the same space as something worth reading.
 */
export function ReactionSummary({
  counts,
  onClick,
  className = "",
}: {
  counts?: ReactionCounts | null;
  onClick?: () => void;
  className?: string;
}) {
  const used = present(counts);
  const total = totalReactions(counts);
  if (total === 0) return null;

  const label = used.map(({ label }) => label).join(", ");

  const content = (
    <>
      <span className="flex items-center -space-x-1.5">
        {used.map(({ kind, emoji }) => (
          <span
            key={kind}
            className="inline-flex h-[20px] w-[20px] items-center justify-center rounded-full border border-border-hairline bg-bg-surface text-[0.6875rem]"
          >
            <span className="emoji" aria-hidden="true">
              {emoji}
            </span>
          </span>
        ))}
      </span>
      <span className="tabular-nums">{total}</span>
    </>
  );

  const classes = `inline-flex items-center gap-1.5 font-mono text-small text-fg-muted ${className}`;

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={`${classes} transition-colors hover:text-brand`}
      aria-label={`${total} ${total === 1 ? "reaction" : "reactions"}: ${label}`}
    >
      {content}
    </button>
  ) : (
    <span
      className={classes}
      aria-label={`${total} ${total === 1 ? "reaction" : "reactions"}: ${label}`}
    >
      {content}
    </span>
  );
}

/**
 * A single React button that opens the four choices.
 *
 * Opens on hover on a pointer device and on click everywhere - a hover-only
 * picker is unreachable on a phone, which is where most of this will be read.
 * Escape closes it, a click outside closes it, and the trigger keeps focus so
 * the keyboard path is the same as the mouse one.
 *
 * **The trigger is a line icon until you have reacted**, and the chosen emoji
 * afterwards. An unreacted row is chrome and stays neutral; colour arrives only
 * once a reader has actually done something, which is what keeps a page of
 * comments calm rather than confetti.
 */
export function ReactionPicker({
  current,
  onPick,
  disabled,
  size = "default",
}: {
  current: ReactionKind | null;
  onPick: (kind: ReactionKind) => void;
  disabled?: boolean;
  size?: "default" | "compact";
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Cleared on unmount: a pending close firing after the component is gone is a
  // state update on nothing.
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function openNow() {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  }

  // A small delay on leave, so crossing the gap between the button and the
  // popover does not dismiss it.
  function closeSoon() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 240);
  }

  const active = current
    ? REACTIONS.find((r) => r.kind === current)
    : undefined;
  const compact = size === "compact";

  return (
    <div
      ref={wrapper}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
    >
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
        data-selected={active ? "true" : "false"}
        onClick={() => (open ? setOpen(false) : openNow())}
        className={
          "emoji-btn inline-flex items-center gap-2 rounded-sm font-mono transition-colors " +
          "disabled:cursor-not-allowed disabled:opacity-60 " +
          (compact
            ? "text-small "
            : "min-h-[var(--control-h)] px-2 text-small ") +
          (active ? "text-brand" : "text-fg-muted hover:text-brand")
        }
      >
        {active ? (
          <span className="emoji text-[1.05rem]" aria-hidden="true">
            {active.emoji}
          </span>
        ) : (
          <SmilePlus
            className="h-4 w-4 shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
        <span>{active ? active.label : "React"}</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Choose a reaction"
          className={
            "absolute left-0 z-20 flex gap-0.5 rounded-full border border-border-strong " +
            "bg-bg-surface p-1 shadow-lg " +
            // Direction is not cosmetic. On a comment the trigger sits at the
            // bottom of the card, so opening upward covers the comment being
            // reacted to - you cannot see what you are rating. Below it is the
            // reply row, which is cheap to cover. On the post bar the opposite
            // holds: above is the count summary, below is the whole thread.
            (compact ? "top-full mt-1" : "bottom-full mb-2")
          }
        >
          {REACTIONS.map(({ kind, label, emoji }) => {
            const selected = current === kind;
            return (
              <button
                key={kind}
                type="button"
                // `menuitemradio`, not `menuitem`: the four are one choice, and
                // `aria-pressed` is not valid on a plain menu item.
                role="menuitemradio"
                title={label}
                aria-label={
                  selected ? `${label} - press again to remove` : label
                }
                aria-checked={selected}
                disabled={disabled}
                onClick={() => {
                  onPick(kind);
                  setOpen(false);
                }}
                className={
                  "emoji-btn inline-flex h-9 w-9 items-center justify-center rounded-full " +
                  "text-[1.15rem] transition-[background-color] duration-[160ms] ease-brand " +
                  "disabled:cursor-not-allowed disabled:opacity-60 " +
                  (selected
                    ? "bg-surface-hover ring-1 ring-brand"
                    : "hover:bg-surface-hover")
                }
              >
                <span className="emoji" aria-hidden="true">
                  {emoji}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
