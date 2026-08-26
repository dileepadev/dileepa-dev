import type { ReactNode } from "react";
import { Container } from "./Container";
import { LinkButton } from "./Button";
import { Section } from "./Section";

interface NotFoundPageProps {
  heading: string;
  /** Why the reader is here and what to do about it. */
  children: ReactNode;
  /** The section this page belongs to, offered alongside the homepage. */
  back?: { href: string; label: string };
}

/**
 * The 404 body, shared by `app/not-found.tsx` and the per-segment ones.
 *
 * There are four of these — one for unmatched routes and one beside each
 * dynamic segment that calls `notFound()`. They exist separately because a
 * segment-level `not-found.tsx` is what makes Next render the 404 **on the
 * server**; without one the render unwinds to the root boundary and the whole
 * page bails to the client, which ships a 404 with an empty `<body>`. They
 * share this component so four copies of the same markup cannot drift.
 */
export function NotFoundPage({ heading, children, back }: NotFoundPageProps) {
  return (
    <Section>
      <Container>
        <div className="section-label">404</div>
        <h1>{heading}</h1>
        <p className="mt-4 text-fg-muted">{children}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/">Go to the homepage</LinkButton>
          {back && (
            <LinkButton href={back.href} variant="secondary">
              {back.label}
            </LinkButton>
          )}
        </div>
      </Container>
    </Section>
  );
}
