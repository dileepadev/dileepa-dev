"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * Wraps every page in a view transition (v2.1.0 draft).
 *
 * Keyed by the path, so every change of page runs the transition: the page
 * that leaves runs `page-exit` and the page that arrives runs `page-enter`.
 * A template on its own remounts only when the segment at its level changes,
 * which covered `/` to `/blog` but not `/blog` to a post, a post to another
 * post, or an event list to an event. Query strings and anchors are not part
 * of the path, so filtering a list or jumping to a heading does not fade.
 *
 * It sits inside the layout's `<main>`, so only the page content moves: the
 * profile rail and the nav bar stay still. The motion is defined in
 * `globals.css` - a calm cross-fade with a small rise, nothing that slides or
 * scales. Transitions with no navigation behind them, the theme switch's
 * reveal among them, are left alone (`default="none"`).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition
      key={pathname}
      enter="page-enter"
      exit="page-exit"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
