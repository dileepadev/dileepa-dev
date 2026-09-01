import type { SVGProps } from "react";

/**
 * The six About-card marks.
 *
 * A third icon convention, and a deliberate one. Lucide draws interface
 * controls, `SocialIcons.tsx` draws third-party brand marks, and these draw the
 * six things the About section says Dileepa does. They are brand assets rather
 * than UI furniture: the source of truth is `docs/brand/icons/`, where each one
 * also ships as a standalone `.svg`, a `-badge.svg` on a Carbon field, and a
 * `.png` for surfaces that cannot take a vector.
 *
 * These components are ported from the `-symbol.svg` variant, which is the one
 * that strokes `currentColor` rather than a literal `#23B888`. That matters:
 * the card colours the mark through `text-brand`, so it resolves to Emerald
 * Bright on Carbon and Emerald Deep on Paper. A hard-coded hex would be right
 * in one theme and a contrast failure in the other.
 *
 * Geometry stays identical to the files. If a mark changes, change it there and
 * re-port, rather than editing the path here and letting the two drift.
 */
export type PillarIconComponent = (
  props: SVGProps<SVGSVGElement>,
) => React.ReactNode;

function Frame({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Two brain hemispheres with node points - agentic systems. */
export function IconAiEngineering(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
      <circle cx="8" cy="9" r="0.9" fill="currentColor" />
      <circle cx="16" cy="9" r="0.9" fill="currentColor" />
      <circle cx="8" cy="15" r="0.9" fill="currentColor" />
      <circle cx="16" cy="15" r="0.9" fill="currentColor" />
    </Frame>
  );
}

/** Angle brackets around a slash - the code mark. */
export function IconOpenSource(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </Frame>
  );
}

/** A microphone on its stand. */
export function IconPublicSpeaking(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <rect x="8" y="2" width="8" height="12" rx="4" />
      <path d="M4 10v1a8 8 0 0 0 16 0v-1" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </Frame>
  );
}

/** A document with a folded corner and ruled lines. */
export function IconTechnicalWriting(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </Frame>
  );
}

/** A monitor with a play triangle. */
export function IconTechnicalVideos(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <rect x="2" y="4" width="20" height="16" rx="3.5" />
      <polygon
        points="10 8.5 16 12 10 15.5"
        fill="currentColor"
        stroke="none"
      />
      <line x1="8" y1="22" x2="16" y2="22" />
      <line x1="12" y1="20" x2="12" y2="22" />
    </Frame>
  );
}

/** Two figures, one behind the other. */
export function IconCommunityBuilding(props: SVGProps<SVGSVGElement>) {
  return (
    <Frame {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Frame>
  );
}
