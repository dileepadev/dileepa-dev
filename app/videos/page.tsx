import { Metadata } from "next";
import { Container, Button, Card, Badge } from "@/components/ui";
import { Navbar, Footer } from "@/components/sections";
import { VIDEOS } from "@/lib/constants";
import { FaArrowLeft, FaYoutube, FaPlay, FaEye, FaClock } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Videos | Dileepa Bandara",
  description:
    "Watch my tutorials, talks, and tech content on web development, cloud technologies, and software engineering.",
};

export default function VideosPage() {
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

          {/* Videos Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {VIDEOS.map((video) => (
              <Link
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card
                  variant="elevated"
                  hover
                  className="h-full flex flex-col overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-bg-secondary overflow-hidden">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent-blue/20 to-accent-purple/20">
                        <FaPlay className="h-12 w-12 text-accent-blue opacity-50" />
                      </div>
                    )}

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-1">
                        <FaClock className="h-3 w-3" />
                        {video.duration}
                      </div>
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-accent-blue rounded-full p-4">
                        <FaPlay className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {/* Category & Views */}
                    <div className="flex items-center justify-between mb-3">
                      {video.category && (
                        <Badge variant="default" size="sm">
                          {video.category}
                        </Badge>
                      )}
                      {video.views && (
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <FaEye className="h-3 w-3" />
                          {video.views}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                      {video.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
                      {video.description}
                    </p>

                    {/* Date & Platform */}
                    <div className="flex items-center justify-between pt-4 border-t border-border-light text-xs text-text-muted">
                      <span>
                        {new Date(video.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaYoutube className="h-3 w-3 text-red-500" />
                        {video.platform}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {VIDEOS.length === 0 && (
            <div className="text-center py-16">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-secondary text-text-muted">
                  <FaYoutube className="h-10 w-10" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-4">
                No videos yet
              </h2>
              <p className="text-text-secondary mb-6">
                Check back soon for new content!
              </p>
              <Button
                href="https://youtube.com/@dileepadev"
                external
                leftIcon={<FaYoutube />}
              >
                Visit YouTube Channel
              </Button>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
