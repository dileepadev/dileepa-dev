"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopProps {
  /** Scroll threshold in pixels before the button appears. Defaults to 400. */
  threshold?: number;
  className?: string;
}

/**
 * Floating "Back to Top" button, with a ring that shows how far down the
 * page the reader is (v2.1.0 draft).
 *
 * It appears once the reader is past `threshold` and stays until they are
 * back above it, whichever way they are scrolling. The ring fills clockwise
 * from twelve o'clock as the page is read and is full at the bottom, so it
 * doubles as a reading-progress meter on long pages like a post or /brand.
 *
 * The ring is driven straight from the scroll position, not through React
 * state: one `requestAnimationFrame` per scroll burst writes the arc's dash
 * offset, so scrolling never re-renders the component. Only crossing the
 * threshold does. The page's height is watched too, since images and late
 * content change how far "the bottom" is after the first paint.
 */
export function BackToTop({ threshold = 400, className }: BackToTopProps) {
  const [visible, setVisible] = useState(false);
  const arc = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const scrolled = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;
      arc.current?.style.setProperty(
        "stroke-dashoffset",
        String(RING_LENGTH * (1 - progress)),
      );
      setVisible(scrolled > threshold);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cn(
        "back-to-top",
        visible ? "is-visible" : "is-hidden",
        className,
      )}
      aria-label="Back to top"
      title="Back to top"
    >
      <svg className="back-to-top-ring" viewBox="0 0 40 40" aria-hidden="true">
        <circle className="back-to-top-track" cx="20" cy="20" r={RING_R} />
        <circle
          ref={arc}
          className="back-to-top-progress"
          cx="20"
          cy="20"
          r={RING_R}
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH}
        />
      </svg>
      <ArrowUp className="h-4 w-4 shrink-0" aria-hidden="true" />
    </button>
  );
}

/** The ring sits just inside the button's 40-unit box, its stroke on the edge. */
const RING_R = 19;
const RING_LENGTH = 2 * Math.PI * RING_R;
