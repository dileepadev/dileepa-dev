'use client';

import { Container, Section, SectionHeader, Card, Badge, Button } from '@/components/ui';
import { COMMUNITIES, VIDEOS, SPEAKING_ENGAGEMENTS, BLOG_POSTS } from '@/lib/constants';
import { motion } from 'framer-motion';
import { FaUsers, FaMicrophone, FaHandsHelping, FaCode, FaUserFriends, FaExternalLinkAlt, FaPlay, FaCalendarAlt, FaMapMarkerAlt, FaPen, FaClock, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const typeIcons: Record<string, React.ElementType> = {
  speaking: FaMicrophone,
  organizing: FaUsers,
  mentoring: FaHandsHelping,
  contributing: FaCode,
  membership: FaUserFriends,
};

const typeColors: Record<string, string> = {
  speaking: 'bg-accent-blue/10 text-accent-blue',
  organizing: 'bg-accent-blue/10 text-accent-blue',
  mentoring: 'bg-accent-blue/10 text-accent-blue',
  contributing: 'bg-accent-blue/10 text-accent-blue',
  membership: 'bg-accent-blue/10 text-accent-blue',
};

export function Community() {
  // Get latest 3 items
  const latestVideos = VIDEOS.slice(0, 3);
  const latestSpeaking = SPEAKING_ENGAGEMENTS.slice(0, 3);
  const latestBlogs = BLOG_POSTS.slice(0, 3);

  return (
    <Section id="community" background="primary">
      <Container>
        <SectionHeader
          subtitle="Community"
          title="Giving Back"
          description="My involvement in tech communities, speaking engagements, and content creation."
        />

        {/* Communities Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {COMMUNITIES.map((community, index) => {
            const IconComponent = typeIcons[community.type] || FaUsers;
            const colorClass = typeColors[community.type] || 'bg-accent-blue/10 text-accent-blue';
            
            return (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card variant="elevated" hover className="h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                      <IconComponent className="h-5 w-5" />
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
                      <Badge variant="default" size="sm">
                        {community.type}
                      </Badge>
                      {community.startDate && (
                        <span className="text-xs text-text-muted">
                          Since {community.startDate}
                        </span>
                      )}
                    </div>

                    {community.url && (
                      <a
                        href={community.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-accent-blue transition-colors"
                        aria-label={`Visit ${community.name}`}
                      >
                        <FaExternalLinkAlt className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Public Speaking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center text-center mb-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-text-primary">
                  Public Speaking
                </h2>
                <p className="text-text-secondary">
                  Conference talks, workshops, and events
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-6">
              {latestSpeaking.map((speaking, index) => (
                <motion.div
                  key={speaking.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={speaking.url || '/public-speaking'} 
                    target={speaking.url ? "_blank" : "_self"}
                    rel={speaking.url ? "noopener noreferrer" : undefined}
                    className="block group h-full"
                  >
                    <Card variant="elevated" hover className="h-full flex flex-col">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-linear-to-br from-purple-500/20 to-pink-500/20 overflow-hidden rounded-t-lg">
                        {speaking.thumbnailUrl ? (
                          <Image 
                            src={speaking.thumbnailUrl} 
                            alt={speaking.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaMicrophone className="h-10 w-10 text-purple-500 opacity-50" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <Badge variant="default" size="sm" className="mb-3 self-start capitalize">
                          {speaking.type}
                        </Badge>

                        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                          {speaking.title}
                        </h3>

                        <p className="text-sm text-accent-blue font-medium mb-2">
                          {speaking.event}
                        </p>

                        <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-1">
                          {speaking.description}
                        </p>

                        <div className="flex items-center gap-4 pt-3 border-t border-border-light text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt className="h-3 w-3" />
                            {new Date(speaking.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="h-3 w-3" />
                            <span className="line-clamp-1">{speaking.location}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button href="/public-speaking" variant="outline" rightIcon={<FaArrowRight />}>
                View All Talks
              </Button>
            </div>
          </motion.div>

          {/* Videos Section */}
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
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={video.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group h-full"
                  >
                    <Card variant="elevated" hover className="h-full flex flex-col">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-linear-to-br from-red-500/20 to-orange-500/20 overflow-hidden rounded-t-lg">
                        {video.thumbnailUrl ? (
                          <Image 
                            src={video.thumbnailUrl} 
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
                        
                        {/* Duration Badge */}
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-1">
                            <FaClock className="h-3 w-3" />
                            {video.duration}
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
                        {video.category && (
                          <Badge variant="default" size="sm" className="mb-3 self-start">
                            {video.category}
                          </Badge>
                        )}

                        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                          {video.title}
                        </h3>

                        <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
                          {video.description}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-border-light text-xs text-text-muted">
                          <span>{new Date(video.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          {video.views && <span>{video.views} views</span>}
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button href="/videos" variant="outline" rightIcon={<FaArrowRight />}>
                Watch More Videos
              </Button>
            </div>
          </motion.div>

          {/* Blog Section */}
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
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={`/blog/${blog.slug}`}
                    className="block group h-full"
                  >
                    <Card variant="elevated" hover className="h-full flex flex-col">
                      {/* Cover Image */}
                      <div className="relative aspect-video bg-linear-to-br from-blue-500/20 to-cyan-500/20 overflow-hidden rounded-t-lg">
                        {blog.coverImage ? (
                          <Image 
                            src={blog.coverImage} 
                            alt={blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaPen className="h-10 w-10 text-blue-500 opacity-50" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="default" size="sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                          {blog.title}
                        </h3>

                        <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-border-light text-xs text-text-muted">
                          <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          <span>{blog.readTime}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button href="/blog" variant="outline" rightIcon={<FaArrowRight />}>
                Read More Articles
              </Button>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
