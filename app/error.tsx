"use client";

import { useEffect } from "react";
import { Button, Container, ErrorVisual, LinkButton, Section } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 xl:col-span-7 min-w-0">
            <div className="section-label">500 / Error</div>
            <h1>This page did not load</h1>
            <p className="mt-4 text-fg-muted leading-relaxed">
              Something on the way to rendering this page failed. Trying again often
              works; if it keeps happening, email{" "}
              <a
                href={`mailto:contact@dileepa.dev?subject=Page%20Error%20Report&body=Error%20Digest:%20${error.digest || "none"}`}
                className="text-brand hover:underline font-mono text-small"
              >
                contact@dileepa.dev
              </a>{" "}
              and say which page.
            </p>
            {error.digest && (
              <div className="mt-4 p-3 rounded-md border border-border-strong bg-bg-surface font-mono text-xs text-fg-muted inline-flex items-center gap-2">
                <span className="text-brand font-bold">Reference:</span>
                <span>{error.digest}</span>
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={reset}>Try again</Button>
              <LinkButton href="/" variant="secondary">
                Go to the homepage
              </LinkButton>
              <LinkButton href="/sitemap" variant="secondary">
                Explore sitemap
              </LinkButton>
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-5 min-w-0">
            <ErrorVisual error={error} reset={reset} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
