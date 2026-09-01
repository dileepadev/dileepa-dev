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
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 xl:col-span-7 min-w-0">
            <div className="mb-4">
              <PagePath path="/500" />
            </div>
            <div className="section-label">500 / Error</div>
            <h1>This page did not load</h1>
            <p className="mt-4 text-fg-muted leading-relaxed">
              Something on the way to rendering this page failed. Trying again
              often works; if it keeps happening, email{" "}
              <a
                href={`mailto:contact@dileepa.dev?subject=Page%20Error%20Report&body=Error%20Digest:%20${digest || "none"}`}
                className="text-brand hover:underline font-mono text-small"
              >
                contact@dileepa.dev
              </a>{" "}
              and say which page.
            </p>
            {digest && (
              <div className="mt-4 p-3 rounded-md border border-border-strong bg-bg-surface font-mono text-xs text-fg-muted inline-flex items-center gap-2">
                <span className="text-brand font-bold">Reference:</span>
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

          <div className="lg:col-span-6 xl:col-span-5 min-w-0">
            <ErrorVisual error={error} reset={retry} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
