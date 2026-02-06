import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { FaArrowLeft, FaCode } from "react-icons/fa";
import { ProjectList } from "./_components/ProjectList";

export const metadata: Metadata = {
  title: "Projects",
  description: "Explore my portfolio of projects and applications.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaCode className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Projects
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              A collection of my work in software development, ranging from
              full-stack applications to developer tools and open-source
              projects.
            </p>
            <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
              Back to Home
            </Button>
          </div>

          {/* Project List */}
          <ProjectList />
        </Container>
      </main>
      <Footer />
    </>
  );
}
