import type { ReactNode } from "react";
import { Container } from "./Container";
import { LinkButton } from "./Button";
import { PagePath } from "./PagePath";
import { Section } from "./Section";

interface NotFoundPageProps {
  heading: string;
  /** Why the reader is here and what to do about it. */
  children: ReactNode;
  /** The section this page belongs to, offered alongside the homepage. */
  back?: { href: string; label: string };
  /** An optional visual or interactive panel beside the message. */
  aside?: ReactNode;
  /** The route path for the breadcrumb, defaults to /404 */
  path?: string;
}

/**
 * The 404 body, shared by `app/not-found.tsx` and the per-segment ones.
 *
 * There are four of these - one for unmatched routes and one beside each
 * dynamic segment that calls `notFound()`. They exist separately because a
 * segment-level `not-found.tsx` is what makes Next render the 404 **on the
 * server**; without one the render unwinds to the root boundary and the whole
 * page bails to the client, which ships a 404 with an empty `<body>`. They
 * share this component so four copies of the same markup cannot drift.
 */
export function NotFoundPage({
  heading,
  children,
  back,
  aside,
  path = "/404",
}: NotFoundPageProps) {
  return (
    <Section>
      {/* The split is decided by the width this panel actually has (a
          container query), not the window: beside the profile rail a
          "large screen" left the window card about 300px wide. */}
      <Container className="@container">
        <div
          className={
            aside
              ? "grid grid-cols-1 items-center gap-10 @3xl:grid-cols-[minmax(0,1fr)_23rem] @3xl:gap-12"
              : undefined
          }
        >
          <div className={aside ? "min-w-0" : undefined}>
            <div className="mb-4">
              <PagePath path={path} />
            </div>
            <div className="section-label">404</div>
            <h1>{heading}</h1>
            <p className="mt-4 text-fg-body">{children}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/">Go to the homepage</LinkButton>
              {back && (
                <LinkButton href={back.href} variant="secondary">
                  {back.label}
                </LinkButton>
              )}
            </div>
          </div>
          {aside && <div className="w-full max-w-[26rem] min-w-0">{aside}</div>}
        </div>
      </Container>
    </Section>
  );
}
