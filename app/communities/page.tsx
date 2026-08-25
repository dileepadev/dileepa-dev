import type { Metadata } from "next";
import {
  Container,
  EmptyState,
  Item,
  ItemList,
  Section,
} from "@/components/ui";
import { api } from "@/lib/api";

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

        <div className="mt-10">
          {communities.length === 0 ? (
            <EmptyState
              title="No communities are listed yet."
              hint="They appear here once they are added in the admin."
            />
          ) : (
            <ItemList>
              {communities.map((community) => (
                <Item
                  key={community.id}
                  title={community.name}
                  href={community.communityUrl || undefined}
                  description={community.description}
                  meta={
                    <>
                      <span className="block">{community.role}</span>
                      <span className="block">{community.period}</span>
                      {community.current && (
                        <span className="block text-brand">Current</span>
                      )}
                    </>
                  }
                />
              ))}
            </ItemList>
          )}
        </div>
      </Container>
    </Section>
  );
}
