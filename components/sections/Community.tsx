"use client";

import {
  Container,
  Section,
  SectionHeader,
  CommunityCard,
  EventCard,
  VideoCard,
  BlogCard,
  Button,
} from "@/components/ui";
import { CommunityDto, EventDto, VideoDto, BlogDto } from "@/lib/api-types";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export function Community({
  communities,
  events,
  videos,
  blogs,
}: {
  communities?: CommunityDto[];
  events?: EventDto[];
  videos?: VideoDto[];
  blogs?: BlogDto[];
}) {
  const latestCommunities = communities?.slice(0, 4) || [];
  const latestEvents = events?.slice(0, 4) || [];
  const latestVideos = videos?.slice(0, 4) || [];
  const latestBlogs = blogs?.slice(0, 4) || [];

  return (
    <Section id="community" background="primary">
      <Container>
        <SectionHeader
          subtitle="Community"
          title="Giving Back"
          description="My contributions to the community through volunteering, speaking, and contents."
        />

        <div className="space-y-32">
          {/* Communities Section */}
          {latestCommunities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center mb-12">
                <div className="mb-4">
                  <h2 className="text-3xl font-bold text-text-primary">
                    Communities
                  </h2>
                  <p className="text-text-secondary">
                    Organizations I&apos;ve had the pleasure to support and
                    volunteer with
                  </p>
                </div>
              </div>

              {/* Communities */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 mb-16">
                {latestCommunities.map((community, index) => (
                  <motion.div
                    key={community._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CommunityCard
                      community={community}
                      className="h-full flex flex-col p-6"
                    />
                  </motion.div>
                ))}
              </div>

              {communities && communities.length > 4 && (
                <div className="flex justify-center">
                  <Button
                    href="/communities"
                    variant="outline"
                    rightIcon={<FaArrowRight />}
                  >
                    View All Communities
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Events */}
          {latestEvents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Events
                  </h2>
                  <p className="text-text-secondary">
                    Conference talks, workshops, and events
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-6">
                {latestEvents.map((event, index) => (
                  <motion.div
                    key={event._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EventCard event={event} className="h-full" />
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  href="/events"
                  variant="outline"
                  rightIcon={<FaArrowRight />}
                >
                  View All Events
                </Button>
              </div>
            </motion.div>
          )}

          {/* Videos */}
          {latestVideos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Video Content
                  </h2>
                  <p className="text-text-secondary">
                    Tutorials and tech insights
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-6">
                {latestVideos.map((video, index) => (
                  <motion.div
                    key={video._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <VideoCard video={video} className="h-full" />
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  href="/videos"
                  variant="outline"
                  rightIcon={<FaArrowRight />}
                >
                  Watch More Videos
                </Button>
              </div>
            </motion.div>
          )}

          {/* Blog */}
          {latestBlogs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Blog Content
                  </h2>
                  <p className="text-text-secondary">
                    Thoughts on tech and development
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 mb-6">
                {latestBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <BlogCard blog={blog} className="h-full" />
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  href="/blog"
                  variant="outline"
                  rightIcon={<FaArrowRight />}
                >
                  Read More Articles
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Container>
    </Section>
  );
}
