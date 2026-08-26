"use client";

import { useEffect } from "react";
import { Button, Container, Section } from "@/components/ui";

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
        <div className="section-label">Error</div>
        <h1>This page did not load</h1>
        <p className="mt-4 text-fg-muted">
          Something on the way to rendering this page failed. Trying again often
          works; if it keeps happening, email contact@dileepa.dev and say which
          page.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-small text-fg-muted">
            Reference: {error.digest}
          </p>
        )}
        <div className="mt-8">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Container>
    </Section>
  );
}
