"use client";

import {
  Container,
  Section,
  SectionHeader,
  Card,
  Badge,
  Button,
} from "@/components/ui";
import { CommunityDto, EventDto, VideoDto, BlogDto } from "@/lib/api-types";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaPlay,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPen,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface CommunityProps {
  communities?: CommunityDto[];
  events?: EventDto[];
  videos?: VideoDto[];
  blogs?: BlogDto[];
}

export function Community({
  communities,
  events,
  videos,
  blogs,
}: CommunityProps) {
  // Get latest 3 items
  const latestVideos = videos?.slice(0, 3) || [];
  const latestEvents = events?.slice(0, 3) || [];
  const latestBlogs = blogs?.slice(0, 3) || [];
  const latestCommunities = communities?.slice(0, 3) || [];

  return (
    <Section id="community" background="primary">
      <Container>
        <SectionHeader
          subtitle="Community"
          title="Giving Back"
          description="My involvement in tech communities, events, and content creation."
        />

        {/* Sub Sections */}
        <div className="space-y-16">
          {/* Tech Communities Section */}
          {latestCommunities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Tech Communities
                  </h2>
                  <p className="text-text-secondary">
                    Meetups, organizing, mentorship, and community contributions
                  </p>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                {latestCommunities.map((community, index) => {
                  const IconComponent = FaUsers;
                  const colorClass = "bg-accent-blue/10 text-accent-blue";

                  return (
                    <motion.div
                      key={community._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card
                        variant="elevated"
                        hover
                        className="h-full flex flex-col"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass} relative overflow-hidden`}
                          >
                            {community.logo ? (
                              <>
                                <div className="dark:hidden w-full h-full relative">
                                  <Image
                                    src={community.logo.light}
                                    alt={community.name}
                                    fill
                                    className="object-contain p-2"
                                  />
                                </div>
                                <div className="hidden dark:block w-full h-full relative">
                                  <Image
                                    src={community.logo.dark}
                                    alt={community.name}
                                    fill
                                    className="object-contain p-2"
                                  />
                                </div>
                              </>
                            ) : (
                              <IconComponent className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-text-primary line-clamp-2">
                              {community.name}
                            </h3>
                            <p className="text-accent-blue font-medium">
                              {community.role}
                            </p>
                          </div>
                        </div>

                        <p className="text-text-secondary flex-1 mb-4">
                          {community.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border-light">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                community.current ? "success" : "default"
                              }
                              size="sm"
                            >
                              {community.current ? "Current" : "Past"}
                            </Badge>
                            {community.period && (
                              <span className="text-xs text-text-muted">
                                {community.period}
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {communities && communities.length > 3 && (
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

          {/* Events Section */}
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

              <div className="grid gap-6 md:grid-cols-3 mb-6">
                {latestEvents.map((event, index) => (
                  <motion.div
                    key={event._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card
                      variant="elevated"
                      hover
                      className="h-full flex flex-col"
                    >
                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        {event.format && (
                          <Badge
                            variant="default"
                            size="sm"
                            className="mb-3 self-start capitalize"
                          >
                            {event.format}
                          </Badge>
                        )}

                        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2">
                          {event.title}
                        </h3>

                        <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-1">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-4 pt-3 border-t border-border-light text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="h-3 w-3" />
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="h-3 w-3" />
                            <span className="line-clamp-1">
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
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

          {/* Videos Section */}
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

              <div className="grid gap-6 md:grid-cols-3 mb-6">
                {latestVideos.map((video, index) => (
                  <motion.div
                    key={video._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={video.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group h-full"
                    >
                      <Card
                        variant="elevated"
                        hover
                        className="h-full flex flex-col"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-linear-to-br from-red-500/20 to-orange-500/20 overflow-hidden rounded-t-lg">
                          {video.thumbnail ? (
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaPlay className="h-10 w-10 text-red-500 opacity-50" />
                            </div>
                          )}

                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-red-500 rounded-full p-3">
                              <FaPlay className="h-5 w-5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                            {video.title}
                          </h3>

                          <div className="flex items-center justify-between pt-3 border-t border-border-light text-xs text-text-muted">
                            <span>
                              {new Date(video.date).toLocaleDateString(
                                "en-US",
                                { month: "short", year: "numeric" },
                              )}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
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

          {/* Blog Section */}
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
                    Latest Articles
                  </h2>
                  <p className="text-text-secondary">
                    Thoughts on tech and development
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3 mb-6">
                {latestBlogs.map((blog, index) => (
                  <motion.div
                    key={blog._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group h-full"
                    >
                      <Card
                        variant="elevated"
                        hover
                        className="h-full flex flex-col"
                      >
                        {/* Cover Image Placeholder - DTO doesn't have image */}
                        <div className="relative aspect-video bg-linear-to-br from-blue-500/20 to-cyan-500/20 overflow-hidden rounded-t-lg">
                          <div className="w-full h-full flex items-center justify-center">
                            <FaPen className="h-10 w-10 text-blue-500 opacity-50" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                            {blog.title}
                          </h3>

                          <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
                            {blog.excerpt}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-border-light text-xs text-text-muted">
                            <span>
                              {new Date(blog.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
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
