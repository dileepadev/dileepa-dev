import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { FaArrowLeft, FaPen } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read my thoughts on software development, technology, and more.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-16">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaPen className="h-10 w-10" />
              </div>
            </div>

            {/* Content */}
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Blog Coming Soon
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              I&apos;m working on creating meaningful content to share my thoughts on 
              software development, technology trends, and personal experiences.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
                Back to Home
              </Button>
            </div>

            {/* Topics Preview */}
            <div className="mt-16 pt-16 border-t border-border-light">
              <h2 className="text-2xl font-bold text-text-primary mb-8">
                Topics I&apos;ll Cover
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {[
                  "Web Development",
                  "Cloud & Azure",
                  "Open Source",
                  "Developer Tools",
                  "Career Growth",
                  "Tech Community",
                ].map((topic) => (
                  <div
                    key={topic}
                    className="p-4 rounded-lg bg-bg-secondary text-text-secondary"
                  >
                    {topic}
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
