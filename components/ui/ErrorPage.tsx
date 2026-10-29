"use client";

import { Button, LinkButton } from "./Button";
import { Container } from "./Container";
import { ErrorVisual } from "./ErrorVisual";
import { PagePath } from "./PagePath";
import { Section } from "./Section";

interface ErrorPageProps {
  error: Error & { digest?: string };
  /**
   * Next's render-boundary retry. Omitted by `/500`, which is the page at a
   * stable address rather than a live boundary and has nothing to re-render,
   * so it reloads instead.
   */
  reset?: () => void;
}

/**
 * The 500 body, shared by the render boundary and the page at `/500`.
 *
 * The same rule `NotFoundPage` follows: one screen, one component. These were
 * two hand-maintained copies of the same markup and had already drifted apart
 * on their button copy.
 */
export function ErrorPage({ error, reset }: ErrorPageProps) {
  const retry = reset ?? (() => window.location.reload());
  const digest = error.digest;

  return (
    <Section>
      {/* The split is decided by the width this panel actually has (a
          container query), not the window: beside the profile rail a
          "large screen" left the window card about 300px wide. */}
      <Container className="@container">
        <div className="grid grid-cols-1 items-center gap-10 @3xl:grid-cols-[minmax(0,1fr)_23rem] @3xl:gap-12">
          <div className="min-w-0">
            <div className="mb-4">
              <PagePath path="/500" />
            </div>
            <div className="section-label">500 / Error</div>
            <h1>This page did not load</h1>
            <p className="mt-4 text-fg-body">
              Something on the way to rendering this page failed. Trying again
              often works; if it keeps happening, email{" "}
              <a
                href={`mailto:contact@dileepa.dev?subject=Page%20Error%20Report&body=Error%20Digest:%20${digest || "none"}`}
                className="text-link font-mono text-small"
              >
                contact@dileepa.dev
              </a>{" "}
              and say which page.
            </p>
            {digest && (
              <div className="chip mt-4 inline-flex items-center gap-2">
                <span className="text-brand font-medium">Reference:</span>
                <span>{digest}</span>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={retry}>Try again</Button>
              <LinkButton href="/" variant="secondary">
                Go to the homepage
              </LinkButton>
              <LinkButton href="/sitemap" variant="secondary">
                Explore the sitemap
              </LinkButton>
            </div>
          </div>

          <div className="w-full max-w-[26rem] min-w-0">
            <ErrorVisual error={error} reset={retry} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
