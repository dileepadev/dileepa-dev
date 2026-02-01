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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Education />
        <Community />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
