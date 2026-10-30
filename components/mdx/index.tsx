import { isValidElement, type ReactNode } from "react";
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
  // The language is settled here, on the server, and handed over as
  // `data-language` - see `fenceLanguage`.
  pre: (props) => (
    <CodeBlock
      {...props}
      data-language={
        (props as { "data-language"?: string })["data-language"] ??
        fenceLanguage(props.children)
      }
    />
  ),

  // A table wider than the column scrolls inside its own box, rather than
  // pushing the whole page sideways on a phone.
  table: (props) => (
    <div className="prose-table">
      <table {...props} />
    </div>
  ),
};

/**
 * The language of a fence Shiki left unhighlighted (v2.1.0 draft).
 *
 * Shiki stamps `data-language` on the blocks it highlights (lib/mdx.ts). A
 * fence in a language it has no grammar for - ```git - is left as plain
 * text, and the language survives only as `language-…` on the inner
 * <code>. `CodeBlock` used to read that class off its own children, but it
 * is a client component: on the server its children are elements whose
 * props it can read ("Git"), in the browser they arrive as server-rendered
 * output it cannot see into ("Code"), and the label differed between the
 * two - a hydration error on every post with such a fence. Read here, on
 * the server, the label is one value on both sides.
 */
function fenceLanguage(children: ReactNode): string | undefined {
  if (!isValidElement<{ className?: string }>(children)) return undefined;
  return children.props.className?.match(/language-([a-zA-Z0-9_+#-]+)/)?.[1];
}

export { CodeBlock } from "./CodeBlock";
export { MarkdownImage, resolveImageUrl } from "./MarkdownImage";
