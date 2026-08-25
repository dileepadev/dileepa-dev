/**
 * The MDX pipeline.
 *
 * Shiki runs at build time and emits both themes into the same markup, keyed
 * by CSS variables, so highlighting follows the site theme without shipping a
 * second copy of every code block or a client-side highlighter. `github-light`
 * and `github-dark` are the themes the Astro blog used — same output, so the
 * migration is not a visible downgrade.
 */

import rehypeShiki from "@shikijs/rehype";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

export const mdxOptions: MDXRemoteProps["options"] = {
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: "heading-anchor" },
        },
      ],
      [
        rehypeShiki,
        {
          themes: { light: "github-light", dark: "github-dark" },
          defaultColor: false,
          cssVariablePrefix: "--shiki-",
        },
      ],
    ],
  },
};

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

/**
 * Pull h2 and h3 out of the raw markdown for the table of contents.
 *
 * Read from the source rather than the rendered output because the rendered
 * output is a React tree by the time we could inspect it. The id is derived
 * the same way `rehype-slug` derives it, so the anchors match.
 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let inCodeFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    // A `## comment` inside a fenced block is not a heading.
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = match[2]
      // Strip inline markdown so the ToC reads as text.
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

    headings.push({
      depth: match[1].length === 2 ? 2 : 3,
      text,
      id: slugify(text),
    });
  }

  return headings;
}

/** GitHub-style slugs, matching what `rehype-slug` produces. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}
