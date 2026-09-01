"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Terminal } from "lucide-react";
import toast from "react-hot-toast";
import { TERMINAL } from "@/lib/constants";

/**
 * Tells a developer the site answers `curl`, and hands them the command.
 *
 * It sits beside the copyright rather than in the footer's link row: the row is
 * navigation, and this is not a seventh place to go. An easter egg nobody finds
 * is a feature nobody has, but the discovery should cost the page one dim line
 * - which is why this is mono, muted, and the same size as the line it shares.
 *
 * The command is `TERMINAL.command`, not a string typed here. That constant
 * carries the `-L` and the reason it is not optional, and the site advertising
 * something different to what works is the one failure this feature cannot
 * survive.
 */
export function CurlHint() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The tick is a timeout, and a reader who clicks and then navigates would
  // otherwise leave it to fire against an unmounted component.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      // `navigator.clipboard` is undefined outside a secure context, so this is
      // a real branch on plain HTTP, not defensive noise.
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(TERMINAL.command);

      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);

      toast.success("Command copied. Paste it into a terminal.");
    } catch {
      // Nothing was copied, so the reader still needs the text. Saying so and
      // showing it again is more use than an apology.
      toast.error(`Copy failed. The command is: ${TERMINAL.command}`);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="curl-hint"
      title="This site renders in a terminal too. Click to copy the command."
      aria-label={`Copy the command ${TERMINAL.command}`}
    >
      {copied ? (
        <Check
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      ) : (
        <Terminal
          className="h-3.5 w-3.5 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      )}
      <span>{TERMINAL.command}</span>
    </button>
  );
}
