import { Metadata } from "next";
import Link from "next/link";
import { Navbar, Footer } from "@/components/sections";
import { Container, Section, Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <Section className="min-h-[70vh] flex items-center justify-center text-center">
          <Container size="md">
            <div className="space-y-6">
              <h1 className="text-8xl md:text-9xl font-bold text-accent-blue animate-pulse">
                404
              </h1>
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-semibold text-text-primary">
                  Page Not Found
                </h2>
                <p className="text-lg text-text-secondary">
                  Oops! The page you are looking for does not exist or has been moved.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button href="/" variant="primary" size="lg">
                  Back to Home
                </Button>
                <Button href="/#connect" variant="outline" size="lg">
                  Contact Me
                </Button>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
