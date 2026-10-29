"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

/** How long a copy button shows "Copied" before it reverts. */
export const COPIED_MS = 2000;

/**
 * One copy behaviour for every copy button on the site (v2.1.0 draft).
 *
 * The buttons had drifted apart: the footer's curl hint raised a toast on
 * success, the error pages said "Copied" or "Copied trace", the share menu
 * "Link copied", the profile "Copied email!" or "Copied!" in a different
 * tick colour, the colour swatches reverted after 1.8s, and almost all of
 * them failed silently. Now:
 *
 * - Success shows on the button that was pressed - its icon becomes a tick
 *   in the success green, the palette's state-only green, and its label
 *   "Copied" - for two seconds, then it reverts. The tick carries
 *   `copy-tick` (the green, and a grow-in at the hover timing) and the icon
 *   it replaces `copy-icon` (a fade back in), both in globals.css. No toast:
 *   the feedback is already where the reader is looking.
 * - A screen reader hears "Copied to clipboard" from one polite live region,
 *   since a button's label changing is not announced on its own.
 * - Failure is said, once, in a toast, never swallowed. `failMessage` lets a
 *   caller hand the text over instead, as the curl hint does with its
 *   command.
 * - Where the Clipboard API is missing (a plain-HTTP preview, an older
 *   browser), it falls back to a hidden textarea and `execCommand`.
 *
 * `copied` is the key of the last successful copy, so one hook can drive
 * several buttons: `copy(text, "email")` and `copied === "email"`. Without a
 * key, `copied` is `"default"` while the tick shows.
 */
export function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A reset still pending when the button unmounts does not fire later.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (
      text: string,
      key = "default",
      failMessage = "Copy failed. Select the text and copy it instead.",
    ) => {
      try {
        await writeClipboard(text);
      } catch {
        toast.error(failMessage);
        return false;
      }
      setCopied(key);
      announce("Copied to clipboard");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), COPIED_MS);
      return true;
    },
    [],
  );

  return { copied, copy };
}

async function writeClipboard(text: string) {
  // `navigator.clipboard` is undefined outside a secure context, so this is a
  // real branch on plain HTTP, not defensive noise.
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(area);
  if (!ok) throw new Error("Copy command refused");
}

/** One shared, visually hidden live region for copy confirmations. */
function announce(message: string) {
  let region = document.getElementById("copy-status");
  if (!region) {
    region = document.createElement("div");
    region.id = "copy-status";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    region.className = "sr-only";
    document.body.appendChild(region);
  }
  // Cleared first, so a second copy of the same thing is announced again.
  region.textContent = "";
  window.setTimeout(() => {
    if (region) region.textContent = message;
  }, 50);
}
