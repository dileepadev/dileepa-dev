"use client";

import { BlogDto } from "@/lib/api-types";
import { Card } from "./Card";
import { FaCalendarAlt, FaArrowRight, FaExternalLinkAlt } from "react-icons/fa";

interface BlogListCardProps {
  blog: BlogDto;
  className?: string;
}

export function BlogListCard({ blog, className }: BlogListCardProps) {
  return (
    <Card
      key={blog._id}
      variant="elevated"
      hover
      className={`flex flex-col h-full group ${className}`}
    >
      <div className="p-8 flex flex-col h-full">
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <FaCalendarAlt className="h-3 w-3 text-accent-blue" />
          <span>
            {new Date(blog.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent-blue transition-colors line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-text-secondary mb-6 line-clamp-3 grow">
          {blog.excerpt}
        </p>

        {/* Footer Action */}
        <div className="pt-6 border-t border-border-light flex items-center justify-between">
          <a
            href={blog.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-accent-blue group"
          >
            Read More
            <FaArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={blog.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-bg-secondary text-text-muted hover:text-accent-blue transition-colors"
          >
            <FaExternalLinkAlt className="h-3 w-3" />
          </a>
        </div>
      </div>
    </Card>
  );
}
