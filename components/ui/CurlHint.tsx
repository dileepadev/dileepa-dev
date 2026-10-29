"use client";

import { Check, Copy } from "lucide-react";
import { TERMINAL } from "@/lib/constants";
import { useCopy } from "./useCopy";

/**
 * Tells a developer the site answers `curl`, and hands them the command.
 *
 * It sits beside the copyright rather than in the footer's link row: the row is
 * navigation, and this is not a seventh place to go. An easter egg nobody finds
 * is a feature nobody has, so it is drawn as what it is - a command you copy
 * (v2.1.0 draft): a small capsule with the shell prompt, the command in mono
 * and a copy icon that turns to a tick once it is on the clipboard. It read
 * as plain text before, and nothing said it could be clicked.
 *
 * The command is `TERMINAL.command`, not a string typed here. That constant
 * carries the `-L` and the reason it is not optional, and the site advertising
 * something different to what works is the one failure this feature cannot
 * survive.
 */
export function CurlHint() {
  // The site's one copy behaviour: the copy icon turns to a tick for two
  // seconds. On failure the toast hands over the command itself, so the
  // reader can still type it.
  const { copied, copy } = useCopy();
  const onCopy = () =>
    copy(
      TERMINAL.command,
      "default",
      `Copy failed. The command is: ${TERMINAL.command}`,
    );

  return (
    <button
      type="button"
      onClick={onCopy}
      className="curl-hint"
      title="This site renders in a terminal too. Click to copy the command."
      aria-label={`Copy the command ${TERMINAL.command}`}
    >
      <span className="curl-hint-prompt" aria-hidden="true">
        $
      </span>
      <span>{TERMINAL.command}</span>
      <span className="curl-hint-icon" aria-hidden="true">
        {copied ? (
          <Check className="h-3.5 w-3.5 copy-tick" />
        ) : (
          <Copy className="copy-icon h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}
