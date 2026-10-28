import type { ReactNode } from "react";
import { Container, LinkButton, PagePath, Section } from "@/components/ui";
import { ApiOfflineVisual } from "@/components/ui/ApiOfflineVisual";
import { TerminalReadout } from "@/components/ui/TerminalCard";
import { getApiHost } from "@/lib/api";

interface ApiOfflinePageProps {
  path?: string;
  host?: string;
  /**
   * An extra control shown before the links - the render boundary's retry.
   * Passed in as an element rather than a handler so this stays a server
   * component for the dozen routes that render it during a degraded fetch.
   */
  action?: ReactNode;
}

export function ApiOfflinePage({
  path = "/503",
  host: customHost,
  action,
}: ApiOfflinePageProps = {}) {
  const host = customHost ?? getApiHost();

  return (
    <Section>
      {/* The split is decided by the width this panel actually has (a
          container query), not the window: beside the profile rail a
          "large screen" left the window card about 300px wide. */}
      <Container className="@container">
        <div className="grid grid-cols-1 items-center gap-10 @3xl:grid-cols-[minmax(0,1fr)_23rem] @3xl:gap-12">
          <div className="min-w-0">
            <div className="mb-4">
              <PagePath path={path} />
            </div>
            <div className="section-label">503 / Service unavailable</div>
            <h1>API connection offline</h1>
            <p className="mt-4 text-fg-muted leading-relaxed">
              The website is currently unable to establish a secure uplink with
              the upstream portfolio API (
              <span className="font-mono text-fg text-xs">{host}</span>).
              Dynamic collections and interactive comments are temporarily
              degraded, but all static pages, articles, and documentation remain
              fully functional.
            </p>

            {/* The same readout as the window beside it, so the two read
                as one console rather than two styles. */}
            <div className="terminal-readout-box mt-5">
              <TerminalReadout
                rows={[
                  { label: "GATEWAY HOST", value: host },
                  {
                    label: "UPLINK STATE",
                    value: "CONNECTION_TIMEOUT",
                    strong: true,
                  },
                  { label: "RESILIENCE MODE", value: "DEGRADED_STATIC_CACHE" },
                ]}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {action}
              <LinkButton href="/" variant={action ? "secondary" : "primary"}>
                Go to the homepage
              </LinkButton>
              <LinkButton href="/sitemap" variant="secondary">
                Explore the sitemap
              </LinkButton>
            </div>
          </div>

          <div className="w-full max-w-[26rem] min-w-0">
            <ApiOfflineVisual targetHost={host} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
