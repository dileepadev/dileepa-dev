"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackToTopProps {
  /** Scroll threshold in pixels before the button appears. Defaults to 400. */
  threshold?: number;
  className?: string;
}

/**
 * Floating "Back to Top" button.
 *
 * Appears subtly when the user scrolls down past the threshold.
 * Smoothly scrolls back to the top of the viewport when clicked.
 */
export function BackToTop({ threshold = 400, className }: BackToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > threshold);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
      <ArrowUp
        className="h-4 w-4 shrink-0"
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  );
}
