import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { FaArrowLeft, FaPen } from "react-icons/fa";
import { api } from "@/lib/api";
import { BlogList } from "./_components/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read my thoughts on software development, technology, and more.",
};

export default async function BlogPage() {
  const blogs = (await api.getBlogs()) || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaPen className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Blog
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              I share my thoughts on software development, technology trends,
              and personal experiences through articles and guides.
            </p>
            <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
              Back to Home
            </Button>
          </div>

          {/* Blog Content */}
          <BlogList initialBlogs={blogs} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
