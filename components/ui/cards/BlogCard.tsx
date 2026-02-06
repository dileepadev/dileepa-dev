"use client";

import { BlogDto } from "@/lib/api-types";
import { Card } from "./Card";
import { FaPen } from "react-icons/fa";
import Link from "next/link";

interface BlogCardProps {
  blog: BlogDto;
  className?: string;
}

export function BlogCard({ blog, className }: BlogCardProps) {
  return (
    <Link
      href={blog.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group h-full"
    >
      <Card
        variant="elevated"
        hover
        className={`h-full flex flex-col ${className}`}
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

          {/* Excerpt */}
          <p className="text-text-secondary text-base mb-4 line-clamp-3 flex-1">
            {blog.excerpt}
          </p>

          {/* Date */}
          <div className="flex items-center justify-between pt-3 border-t border-border-light text-base text-text-muted">
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
  );
}
