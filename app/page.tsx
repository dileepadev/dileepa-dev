import {
  About,
  CommunitySection,
  Contact,
  EducationSection,
  Hero,
  Work,
} from "@/components/sections";
import { ApiOfflinePage } from "@/components/ui";
import { getHomepageData } from "@/lib/api";

/**
 * The homepage is the site.
 *
 * Everything lives here as a section, in the order the layout reference sets:
 * hero, about, work, education, community, contact. The index pages under
 * /projects, /events, /blog, /communities and /videos exist for the full lists;
 * this page is the whole picture in one scroll.
 */
export default async function HomePage() {
  const {
    about,
    experiences,
    educations,
    tools,
    communities,
    pillars,
    projects,
    events,
    posts,
    videos,
  } = await getHomepageData();

  if (!about) {
    return <ApiOfflinePage path="/" />;
  }

  return (
    <div id="top">
      <Hero about={about} />
      <About about={about} pillars={pillars} />
      <Work experiences={experiences} tools={tools} projects={projects} />
      <EducationSection educations={educations} />
      <CommunitySection
        communities={communities}
        events={events}
        posts={posts}
        videos={videos}
      />
      <Contact about={about} />
    </div>
  );
}
