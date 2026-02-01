import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { FaArrowLeft, FaGithub } from "react-icons/fa";

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
          <div className="max-w-4xl mx-auto text-center py-16">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
              </div>
            </div>

            {/* Content */}
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Projects Coming Soon
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              I&apos;m curating my best projects to showcase here. In the meantime, 
              you can explore my work on GitHub.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
                Back to Home
              </Button>
              <Button 
                href="https://github.com/dileepadev" 
                external 
                leftIcon={<FaGithub />}
              >
                View on GitHub
              </Button>
            </div>

            {/* Categories Preview */}
            <div className="mt-16 pt-16 border-t border-border-light">
              <h2 className="text-2xl font-bold text-text-primary mb-8">
                Project Categories
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { name: "Web Apps", count: "5+" },
                  { name: "Open Source", count: "10+" },
                  { name: "Mobile Apps", count: "3+" },
                  { name: "APIs & Backend", count: "4+" },
                  { name: "VS Code Extensions", count: "2+" },
                  { name: "Experiments", count: "Many" },
                ].map((category) => (
                  <div
                    key={category.name}
                    className="p-4 rounded-lg bg-bg-secondary"
                  >
                    <p className="font-medium text-text-primary">{category.name}</p>
                    <p className="text-sm text-text-muted">{category.count} projects</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
