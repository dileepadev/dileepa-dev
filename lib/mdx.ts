/**
 * The MDX pipeline.
 *
 * Shiki runs at build time and emits both themes into the same markup, keyed
 * by CSS variables, so highlighting follows the site theme without shipping a
 * second copy of every code block or a client-side highlighter. `github-light`
 * and `github-dark` are the themes the Astro blog used - same output, so the
 * migration is not a visible downgrade.
 */

import rehypeShiki, { type RehypeShikiOptions } from "@shikijs/rehype";
import GithubSlugger from "github-slugger";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import rehypeImageSize from "./rehype-image-size";

const shikiOptions: RehypeShikiOptions = {
  themes: { light: "github-light", dark: "github-dark" },
  defaultColor: false,
  cssVariablePrefix: "--shiki-",
  // Stamp the fence's language on the <pre>, which `CodeBlock` reads for its
  // header label. Shiki adds no marker of its own.
  transformers: [
    {
      name: "data-language",
      pre(node) {
        node.properties["data-language"] = this.options.lang;
      },
    },
  ],
};

export const mdxOptions: MDXRemoteProps["options"] = {
  parseFrontmatter: false,
  mdxOptions: {
    // Parse as Markdown, not MDX. The posts are plain Markdown by contract -
    // `blog-dileepa-dev/AGENTS.md` says so, and a post needing a component is
    // a missing feature here rather than JSX in prose. Left at the default
    // `mdx`, ordinary Markdown is a syntax error: `<` starts JSX, so a bare
    // `<https://…>` autolink or an `<!-- … -->` comment fails the whole build,
    // and `{` starts an expression. Under `md` those are Markdown again.
    format: "md",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeImageSize,
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: { className: "heading-anchor" },
        },
      ],
      [rehypeShiki, shikiOptions],
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
 * output is a React tree by the time we could inspect it. The id comes from
 * `github-slugger`, the library `rehype-slug` itself uses, and every heading
 * level goes through it in document order - that is how a repeated heading
 * gets its `-1` suffix there, so it has to happen the same way here. A
 * hand-rolled slug drifted: it folded "AI-103 — Developing" into one hyphen
 * where the page has two, and those contents links went nowhere.
 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();
  let inCodeFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inCodeFence = !inCodeFence;
      continue;
    }
    // A `## comment` inside a fenced block is not a heading.
    if (inCodeFence) continue;

    const match = /^(#{1,6})\s+(.+?)(?:\s+#+)?\s*$/.exec(line);
    if (!match) continue;

    const text = match[2]
      // Strip inline markdown so the ToC reads as text.
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");

    // Slug every level so the duplicate count matches; list only h2 and h3.
    const id = slugger.slug(text);
    const level = match[1].length;
    if (level === 2 || level === 3) {
      headings.push({ depth: level, text, id });
    }
  }

  return headings;
}
