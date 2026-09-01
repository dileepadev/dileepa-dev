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
      <Container>
        <div
          className={
            aside
              ? "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
              : undefined
          }
        >
          <div className={aside ? "lg:col-span-6 xl:col-span-7 min-w-0" : undefined}>
            <div className="mb-4">
              <PagePath path={path} />
            </div>
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
          </div>
          {aside && (
            <div className="lg:col-span-6 xl:col-span-5 min-w-0">{aside}</div>
          )}
        </div>
      </Container>
    </Section>
  );
}
