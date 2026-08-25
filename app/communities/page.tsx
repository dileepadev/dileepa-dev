import type { Metadata } from "next";
import { Container, EmptyState, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { CommunitySearch } from "./_components/CommunitySearch";

export const metadata: Metadata = {
  title: "Communities",
  description: "Tech communities I organise with or contribute to.",
  alternates: { canonical: "/communities" },
};

export default async function CommunitiesPage() {
  const communities = await api.getCommunities();

  return (
    <Section>
      <Container>
        <div className="section-label">Communities</div>
        <h1>Communities</h1>
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
