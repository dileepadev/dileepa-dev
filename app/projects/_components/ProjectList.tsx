"use client";

import { useState, useMemo } from "react";
import { Card, Badge } from "@/components/ui";
import {
  FaSearch,
  FaSortAmountDown,
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaFilter,
} from "react-icons/fa";

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  image?: string;
  featured?: boolean;
}

// Dummy data for projects until API is ready
const DUMMY_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Personal Portfolio v2",
    description:
      "My modern personal portfolio website built with Next.js 15, Tailwind CSS, and NestJS API.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "TypeScript",
      "NestJS",
      "MongoDB",
    ],
    category: "Web Development",
    githubUrl: "https://github.com/dileepadev/dileepa-dev",
    demoUrl: "https://dileepa.dev",
    featured: true,
  },
  {
    id: "2",
    title: "Azure Cosmos DB Explorer",
    description:
      "A VS Code extension to explore and manage Azure Cosmos DB resources with ease.",
    technologies: ["VS Code API", "TypeScript", "Azure SDK"],
    category: "Developer Tools",
    githubUrl: "https://github.com/dileepadev/cosmos-explorer",
    featured: true,
  },
  {
    id: "3",
    title: "AI Chat Assistant",
    description:
      "An intelligent chat application using OpenAI's GPT models and vector search for context-aware responses.",
    technologies: ["React", "Python", "OpenAI", "Pinecone"],
    category: "AI / Machine Learning",
    demoUrl: "https://ai-chat.dileepa.dev",
  },
  {
    id: "4",
    title: "E-commerce API",
    description:
      "A robust and scalable backend API for e-commerce platforms with authentication and order management.",
    technologies: ["Node.js", "Express", "PostgreSQL", "Redis"],
    category: "APIs & Backend",
    githubUrl: "https://github.com/dileepadev/shop-api",
  },
];

type SortOption = "featured" | "newest" | "title";

export function ProjectList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = DUMMY_PROJECTS.map((p) => p.category);
    return ["All", ...Array.from(new Set(cats))];
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...DUMMY_PROJECTS];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(query),
          ),
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "featured":
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        case "newest":
          return b.id.localeCompare(a.id); // Assuming higher ID is newer for dummy data
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, sortBy, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search and Sort Controls */}
      <div className="mb-12 p-8 rounded-3xl bg-bg-secondary border border-border-light shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Search */}
          <div className="lg:col-span-5 space-y-2">
            <label
              htmlFor="search"
              className="text-sm font-semibold text-text-secondary ml-1"
            >
              Find Projects
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
                <FaSearch className="h-4 w-4" />
              </div>
              <input
                id="search"
                type="text"
                placeholder="Search by name, tech, or desc..."
                className="block w-full pl-11 pr-4 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue text-text-primary placeholder-text-muted transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-4 space-y-2">
            <label
              htmlFor="category"
              className="text-sm font-semibold text-text-secondary ml-1"
            >
              Category
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
                <FaFilter className="h-4 w-4" />
              </div>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full pl-11 pr-10 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue text-text-primary appearance-none transition-all cursor-pointer shadow-sm font-medium"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Sort */}
          <div className="lg:col-span-3 space-y-2">
            <label
              htmlFor="sort"
              className="text-sm font-semibold text-text-secondary ml-1"
            >
              Sort by
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
                <FaSortAmountDown className="h-4 w-4" />
              </div>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="block w-full pl-11 pr-10 py-3 bg-bg-primary border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue text-text-primary appearance-none transition-all cursor-pointer shadow-sm font-medium"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="title">Alphabetical</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-muted">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-1 text-sm">
          <p className="text-text-muted">
            Filtered{" "}
            <span className="text-text-primary font-bold">
              {filteredAndSortedProjects.length}
            </span>{" "}
            projects from portfolio
          </p>
          {(searchQuery || selectedCategory !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors font-semibold"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredAndSortedProjects.map((project) => (
            <Card
              key={project.id}
              variant="elevated"
              hover
              className="flex flex-col h-full overflow-hidden group"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-bg-secondary relative overflow-hidden flex items-center justify-center border-b border-border-light">
                <div className="absolute inset-0 bg-linear-to-br from-accent-blue/5 to-transparent transition-opacity group-hover:opacity-0" />
                <FaCode className="h-16 w-16 text-accent-blue/20" />

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 group-hover:scale-110 transition-transform">
                    <Badge
                      variant="default"
                      className="bg-accent-blue text-white border-0 shadow-lg"
                    >
                      Featured
                    </Badge>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="default"
                    className="backdrop-blur-md bg-white/50 dark:bg-black/50 border-border-light"
                  >
                    {project.category}
                  </Badge>
                </div>
              </div>

              <div className="p-8 flex flex-col h-full">
                {/* Title and Tech */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-text-primary group-hover:text-accent-blue transition-colors mb-2">
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-medium text-text-muted px-2 py-1 bg-bg-secondary rounded-lg border border-border-light"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs font-medium text-text-muted px-2 py-1 bg-bg-secondary rounded-lg border border-border-light">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-text-secondary line-clamp-3 mb-8 grow text-lg leading-relaxed">
                  {project.description}
                </p>

                {/* Footer Action */}
                <div className="flex items-center gap-4 mt-auto">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-bg-secondary text-text-primary font-bold border border-border-light hover:bg-border-light transition-all shadow-sm"
                    >
                      <FaGithub className="h-5 w-5" />
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-blue text-white font-bold hover:bg-accent-blue/90 shadow-md shadow-accent-blue/20 transition-all"
                    >
                      <FaExternalLinkAlt className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-bg-secondary rounded-3xl border border-dashed border-border-light">
          <div className="flex justify-center mb-6 text-text-muted opacity-20">
            <FaCode className="h-20 w-20" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-3">
            Project not found
          </h2>
          <p className="text-text-secondary text-lg">
            I couldn&apos;t find any project matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
