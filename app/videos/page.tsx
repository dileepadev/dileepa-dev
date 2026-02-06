import { Metadata } from "next";
import { Container, Button } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { FaArrowLeft, FaYoutube } from "react-icons/fa";
import { VideoList } from "./_components/VideoList";
import type { VideoDto } from "@/lib/api-types";

export const metadata: Metadata = {
  title: "Videos | Dileepa Bandara",
  description:
    "Watch my tutorials, talks, and tech content on web development, cloud technologies, and software engineering.",
};

const API_URL = process.env.API_URL || "http://localhost:3000";

async function getVideos(): Promise<VideoDto[]> {
  try {
    const res = await fetch(`${API_URL}/videos`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) as VideoDto[];
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-bg-primary">
        <Container>
          {/* Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-blue/10 text-accent-blue">
                <FaYoutube className="h-10 w-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Video Content
            </h1>
            <p className="text-xl text-text-secondary mb-6 max-w-2xl mx-auto">
              Tutorials, talks, and insights on web development, cloud
              technologies, and modern software engineering.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button href="/" variant="outline" leftIcon={<FaArrowLeft />}>
                Back to Home
              </Button>
              <Button
                href="https://youtube.com/@dileepadev"
                external
                leftIcon={<FaYoutube />}
              >
                Subscribe on YouTube
              </Button>
            </div>
          </div>

          {/* Video List (Search & Sort) */}
          <VideoList videos={videos} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
