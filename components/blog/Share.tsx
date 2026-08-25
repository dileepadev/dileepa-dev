"use client";

import { useState } from "react";
import { FiCheck, FiLink } from "react-icons/fi";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";

const linkClasses =
  "inline-flex min-h-[var(--control-h)] items-center gap-2 rounded-sm " +
  "border border-border-strong bg-bg-surface px-3 font-mono text-small " +
  "text-fg-muted no-underline transition-[background-color,border-color,color] " +
  "duration-[160ms] ease-brand hover:border-brand hover:bg-surface-hover hover:text-fg";

export function Share({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the two share links still work, so
      // there is nothing useful to say here.
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-small text-fg-muted">Share</span>
      <a
        href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        <FaXTwitter className="h-4 w-4" aria-hidden="true" />X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        <FaLinkedin className="h-4 w-4" aria-hidden="true" />
        LinkedIn
      </a>
      <button type="button" onClick={copy} className={linkClasses}>
        {copied ? (
          <FiCheck className="h-4 w-4 text-brand" aria-hidden="true" />
        ) : (
          <FiLink className="h-4 w-4" aria-hidden="true" />
        )}
        {copied ? "Link copied" : "Copy link"}
      </button>
    </div>
  );
}
