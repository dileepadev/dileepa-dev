import { About, Contact, Hero } from "@/components/sections";
import { ApiOfflinePage } from "@/components/ui";
import { getHomepageData } from "@/lib/api";
import { LegacyHashRedirect } from "./_components/LegacyHashRedirect";

/**
 * The homepage is the front door (v2.1.0 draft).
 *
 * It used to be the whole site - hero, about, work, education, community and
 * contact in one scroll past 9,000px, every section competing for the same
 * attention. Now it keeps the hero (with the newest post, talk and video),
 * About and Contact, and the rest are pages of their own: /work and
 * /education beside the index pages that already existed - /projects,
 * /events, /blog, /communities, /videos. `LegacyHashRedirect` sends the old
 * section links (`/#work` and the like) to the pages that replaced them.
 */
export default async function HomePage() {
  const { about, events, posts, videos } = await getHomepageData();

  if (!about) {
    return <ApiOfflinePage path="/" />;
  }

  return (
    <div id="top">
      <LegacyHashRedirect />
      <Hero
        about={about}
        now={{
          post: posts[0],
          event: events[0],
          video: videos[0],
        }}
      />
      <About about={about} />
      <Contact about={about} />
    </div>
  );
}
