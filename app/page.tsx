import {
  Navbar,
  Hero,
  About,
  Experience,
  Education,
  Community,
  Connect,
  Footer,
} from "@/components/sections";
import { getPortfolioData } from "@/lib/api";

export const revalidate = 3600;

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Navbar />
      <main>
        <Hero about={data.about} />
        <About about={data.about} tools={data.tools} />
        <Experience experiences={data.experiences} />
        <Education educations={data.educations} />
        <Community
          communities={data.communities}
          events={data.events}
          videos={data.videos}
          blogs={data.blogs}
        />
        <Connect about={data.about} />
      </main>
      <Footer about={data.about} />
    </>
  );
}
