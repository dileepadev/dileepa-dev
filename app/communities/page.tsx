import type { Metadata } from "next";
import { Container, EmptyState, PagePath, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { CommunitySearch } from "./_components/CommunitySearch";

export const metadata: Metadata = {
  title: "Communities",
  description: "Tech communities I organise with or contribute to.",
  alternates: { canonical: "/communities" },
};

export default async function CommunitiesPage() {
  const communities = await api.getCommunities();
  const total = communities.length;

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/communities" />
            </div>
            <div className="section-label">Communities</div>
            <h1>Communities</h1>
          </div>
          {total > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
              <span className="font-medium text-fg">{total}</span>
              <span>{total === 1 ? "Community" : "Communities"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">
          Groups I organise with or contribute to, and what I do in each.
        </p>

        {communities.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No communities are listed yet."
              hint="They appear here once they are added in the admin."
            />
          </div>
        ) : (
          <CommunitySearch communities={communities} />
        )}
      </Container>
    </Section>
  );
}
