import type { Metadata } from "next";
import {
  ApiOfflinePage,
  Container,
  EmptyState,
  PagePath,
  Section,
} from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import { EMPTY_STATES, PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { CommunitySearch } from "./_components/CommunitySearch";

export const metadata: Metadata = pageMetadata({
  title: PAGES.communities.meta.title,
  description: PAGES.communities.meta.description,
  path: "/communities",
});

export default async function CommunitiesPage() {
  const communities = await api.getCommunities();
  const total = communities.length;

  if (total === 0) {
    const health = await checkApiHealth();
    if (!health.ok) {
      return <ApiOfflinePage path="/communities" />;
    }
  }

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/communities" />
            </div>
            <div className="section-label">{PAGES.communities.label}</div>
            <h1>{PAGES.communities.title}</h1>
          </div>
          {total > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
              <span className="font-medium text-fg">{total}</span>
              <span>{total === 1 ? "Community" : "Communities"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">{PAGES.communities.intro}</p>

        {communities.length === 0 ? (
          <div className="mt-10">
            <EmptyState {...EMPTY_STATES.communities} />
          </div>
        ) : (
          <CommunitySearch communities={communities} />
        )}
      </Container>
    </Section>
  );
}
