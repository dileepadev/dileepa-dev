import { ViewTransition } from "react";

/**
 * Wraps every page in a view transition (v2.1.0 draft).
 *
 * A template remounts on each navigation where a layout does not, so the
 * page that leaves runs `page-exit` and the page that arrives runs
 * `page-enter`. It sits inside the layout's `<main>`, so only the page
 * content moves: the profile rail and the nav bar stay still. The motion is
 * defined in `globals.css` - a calm cross-fade with a small rise, nothing
 * that slides or scales. Transitions with no navigation behind them, the
 * theme switch's reveal among them, are left alone (`default="none"`).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
