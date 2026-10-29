import { ZoomIn } from "lucide-react";

/**
 * The hint on an image that opens full size (v2.1.0 draft).
 *
 * One affordance for every such image - a post figure, a profile photo, a
 * zoomable image: a small pill in the corner that appears on hover or
 * keyboard focus. The image itself does not darken or zoom; in v2.1 nothing
 * moves on hover. Place it inside the `group` that holds the image.
 */
export function ZoomHint({ label = "View full size" }: { label?: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-bg-surface/90 px-2.5 py-1 font-mono text-label text-fg backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      <ZoomIn className="h-3.5 w-3.5" />
      <span>{label}</span>
    </span>
  );
}
