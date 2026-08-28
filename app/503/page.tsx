import type { Metadata } from "next";
import {
  Container,
  LinkButton,
  PagePath,
  Section,
} from "@/components/ui";
import { ApiOfflineVisual } from "@/components/ui/ApiOfflineVisual";

export const metadata: Metadata = {
  title: "API service unavailable (503)",
  description:
    "Upstream API connection status and fallback diagnostics on dileepa.dev.",
};

export default function ApiOfflinePage() {
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
              upstream portfolio API (<span className="font-mono text-fg text-xs">api.dileepa.dev</span>).
              Dynamic collections and interactive comments are temporarily degraded, but all
              static pages, articles, and documentation remain fully functional.
            </p>

            <div className="mt-5 p-4 rounded-md border border-border-strong bg-bg-surface space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-fg-muted">
                <span>GATEWAY HOST:</span>
                <span className="text-fg font-medium">api.dileepa.dev</span>
              </div>
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
              <LinkButton href="/">Go to homepage</LinkButton>
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
