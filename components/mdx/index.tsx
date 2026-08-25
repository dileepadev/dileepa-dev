import Link from "next/link";
import type { MDXComponents } from "mdx/types";

/**
 * The components MDX renders into.
 *
 * Most elements are styled by `.prose` in globals.css rather than overridden
 * here — a component per tag would put the blog's styling in two places. These
 * three exist because they need behaviour, not styling.
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

  // Shiki puts the language on the `pre`; the chrome shows it and gives the
  // block a header, matching the Astro blog's Pre component.
  pre: ({ children, ...props }) => {
    const language =
      typeof props["data-language"] === "string"
        ? props["data-language"]
        : undefined;
    return (
      <div className="overflow-hidden rounded-lg border border-border-strong">
        {language && (
          <div className="border-b border-border-strong bg-bg-surface px-4 py-2">
            <span className="font-mono text-small text-fg-muted">
              {language}
            </span>
          </div>
        )}
        <pre {...props} className="!m-0 !rounded-none !border-0 p-4">
          {children}
        </pre>
      </div>
    );
  },
};
