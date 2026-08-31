"use client";

import { useEffect } from "react";
import {
  ApiOfflineVisual,
  Button,
  Container,
  ErrorVisual,
  LinkButton,
  PagePath,
  Section,
} from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error && error.digest !== "0x500_TELEMETRY_DEMO") {
      console.error(error);
    }
  }, [error]);

  const isApiOffline =
    error.name === "ApiConnectionError" ||
    error.digest === "API_CONNECTION_OFFLINE" ||
    error.digest?.includes("503") ||
    error.message?.includes("API connection offline") ||
    error.message?.includes("Failed to connect to API") ||
    error.message?.includes("fetch failed") ||
    error.message?.includes("ECONNREFUSED") ||
    error.message?.includes("ENOTFOUND") ||
    error.message?.includes("proxy_error");

  if (isApiOffline) {
    return (
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 xl:col-span-7 min-w-0">
              <div className="mb-4">
                <PagePath path="/503" />
              </div>
              <div className="section-label">503 / Service Unavailable</div>
              <h1>API connection offline</h1>
              <p className="mt-4 text-fg-muted leading-relaxed">
                The website is currently unable to establish a secure uplink with the
                upstream portfolio API. Dynamic collections and interactive
                comments are temporarily degraded, but all static pages,
                articles, and documentation remain fully functional.
              </p>

              <div className="mt-5 p-4 rounded-md border border-border-strong bg-bg-surface space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-fg-muted">
                  <span>UPLINK STATE:</span>
                  <span className="text-brand font-medium">CONNECTION_TIMEOUT</span>
                </div>
                <div className="flex items-center justify-between text-fg-muted">
                  <span>RESILIENCE MODE:</span>
                  <span className="text-fg font-medium">DEGRADED_STATIC_CACHE</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={reset}>Retry uplink</Button>
                <LinkButton href="/" variant="secondary">
                  Go to the homepage
                </LinkButton>
                <LinkButton href="/sitemap" variant="secondary">
                  Explore sitemap
                </LinkButton>
              </div>
            </div>

            <div className="lg:col-span-6 xl:col-span-5 min-w-0">
              <ApiOfflineVisual />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

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
