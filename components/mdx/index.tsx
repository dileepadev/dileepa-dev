import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "./CodeBlock";

/**
 * The components MDX renders into.
 *
 * Most elements are styled by `.prose` in globals.css rather than overridden
 * here — a component per tag would put the blog's styling in two places. These
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

  /*
   * A plain `<img>`, deliberately.
   *
   * Posts embed images by absolute URL from whatever host they happen to be
   * on, and `next/image` only accepts hosts listed in `next.config.ts` — which
   * is Cloudinary and nothing else. Routing post images through it would make
   * a post fail the build for citing a screenshot from someone else's docs.
   *
   * The intrinsic size is unknown in Markdown, so the ratio is not constrained
   * and the image lays out at its natural aspect. `loading` and `decoding` do
   * the work `next/image` would otherwise have done here.
   */
  img: ({ src, alt }) => {
    if (typeof src !== "string") return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className="h-auto w-full rounded-lg border border-border-strong bg-bg-surface"
      />
    );
  },

  // Enhanced code block with syntax highlighting, language badge, and copy button.
  pre: (props) => <CodeBlock {...props} />,
};

export { CodeBlock } from "./CodeBlock";
