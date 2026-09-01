import type { Metadata } from "next";
import { ApiOfflinePage, Container, PagePath, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { ProfileClient } from "./_components/ProfileClient";

// The portrait is 800×800 and the card is `summary_large_image`, which every
// platform crops to 1.91:1 — so a square headshot arrives with the top and
// bottom of the face cut off. The site card is already built at that ratio.
export const metadata: Metadata = pageMetadata({
  title: PAGES.profile.meta.title,
  description: PAGES.profile.meta.description,
  path: "/profile",
});

export const revalidate = 900;

export default async function ProfilePage() {
  const [about, experiences, speakingTopics] = await Promise.all([
    api.getAbout(),
    api.getExperiences(),
    api.getSpeakingTopics(),
  ]);

  if (!about) {
    return <ApiOfflinePage path="/profile" />;
  }

  return (
    <Section>
      <Container>
        <div className="mb-10 sm:mb-12">
          <div className="mb-4">
            <PagePath path="/profile" />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="section-label">{PAGES.profile.label}</div>
            <span className="text-border-strong select-none">/</span>
            <span className="font-mono text-xs text-fg-muted">Media kit</span>
          </div>
          <h1 className="display">{PAGES.profile.title}</h1>
          <p className="section-intro mt-4 max-w-2xl">{PAGES.profile.intro}</p>
        </div>

        <ProfileClient
          about={about}
          experiences={experiences}
          speakingTopics={speakingTopics}
        />
      </Container>
    </Section>
  );
}
