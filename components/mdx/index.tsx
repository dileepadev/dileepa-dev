import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./CodeBlock";
import { MarkdownImage } from "./MarkdownImage";

/**
 * The components MDX renders into.
 *
 * Most elements are styled by `.prose` in globals.css rather than overridden
 * here - a component per tag would put the blog's styling in two places. These
 * exist because they need behaviour, not styling.
 */
export const mdxComponents: MDXComponents = {
  // Internal links route client-side; external ones open safely.
  a: ({ href = "", children, ...props }) => {
    if (href.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    if (href.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },

  // Enhanced responsive Markdown image renderer with path resolution and error fallback.
  img: (props) => <MarkdownImage {...props} />,

  // Enhanced code block with syntax highlighting, language badge, and copy button.
  pre: (props) => <CodeBlock {...props} />,
};

export { CodeBlock } from "./CodeBlock";
export { MarkdownImage, resolveImageUrl } from "./MarkdownImage";
