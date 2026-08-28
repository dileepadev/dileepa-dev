"use client";

import { Button, Container, ErrorVisual, LinkButton, Section } from "@/components/ui";

const MOCK_ERROR = {
  name: "Error",
  message: "Sample SSR render pipeline fault for telemetry preview",
  digest: "0x500_TELEMETRY_DEMO",
};

export default function Error500PreviewPage() {
  const handleReset = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

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
                href={`mailto:contact@dileepa.dev?subject=Page%20Error%20Report&body=Error%20Digest:%20${MOCK_ERROR.digest}`}
                className="text-brand hover:underline font-mono text-small"
              >
                contact@dileepa.dev
              </a>{" "}
              and say which page.
            </p>
            <div className="mt-4 p-3 rounded-md border border-border-strong bg-bg-surface font-mono text-xs text-fg-muted inline-flex items-center gap-2">
              <span className="text-brand font-bold">Reference:</span>
              <span>{MOCK_ERROR.digest}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={handleReset}>Try again</Button>
              <LinkButton href="/" variant="secondary">
                Go to the homepage
              </LinkButton>
              <LinkButton href="/sitemap" variant="secondary">
                Explore sitemap
              </LinkButton>
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-5 min-w-0">
            <ErrorVisual error={MOCK_ERROR} reset={handleReset} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
