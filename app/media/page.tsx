import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { FaArrowLeft, FaYoutube } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Media",
  description: "Watch my talks, presentations, podcasts, and other media appearances.",
};

export default function MediaPage() {
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
              Media Coming Soon
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              I&apos;m compiling my talks, podcasts, and media appearances. 
              Check out my YouTube channel for existing content.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
                Back to Home
              </Button>
              <Button 
                href="https://youtube.com/@dileepadev" 
                external 
                leftIcon={<FaYoutube />}
              >
                Visit YouTube
              </Button>
            </div>

            {/* Media Types Preview */}
            <div className="mt-16 pt-16 border-t border-border-light">
              <h2 className="text-2xl font-bold text-text-primary mb-8">
                Media Types
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {[
                  { name: "Conference Talks", icon: "🎤" },
                  { name: "Workshop Videos", icon: "💻" },
                  { name: "Podcast Episodes", icon: "🎙️" },
                  { name: "Live Streams", icon: "📺" },
                ].map((type) => (
                  <div
                    key={type.name}
                    className="p-4 rounded-lg bg-bg-secondary"
                  >
                    <span className="text-3xl mb-2 block">{type.icon}</span>
                    <p className="font-medium text-text-primary">{type.name}</p>
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
