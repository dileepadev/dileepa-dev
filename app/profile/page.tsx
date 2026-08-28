import type { Metadata } from "next";
import { Container, PagePath, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { PAGES, SITE_CONFIG } from "@/lib/constants";
import { ProfileClient } from "./_components/ProfileClient";

export const metadata: Metadata = {
  title: PAGES.profile.meta.title,
  description: PAGES.profile.meta.description,
  alternates: { canonical: `${SITE_CONFIG.url}/profile` },
  openGraph: {
    title: `${PAGES.profile.title} · ${SITE_CONFIG.name}`,
    description: PAGES.profile.meta.description,
    images: [{ url: `${SITE_CONFIG.url}/profile/v2.webp` }],
  },
};

export const revalidate = 900;

export default async function ProfilePage() {
  const [about, experiences] = await Promise.all([
    api.getAbout(),
    api.getExperiences(),
  ]);

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

        <ProfileClient about={about} experiences={experiences} />
      </Container>
    </Section>
  );
}
