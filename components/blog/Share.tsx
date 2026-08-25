"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
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
        <FaXTwitter className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>X</span>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
      >
        <FaLinkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>LinkedIn</span>
      </a>
      <button type="button" onClick={copy} className={linkClasses}>
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Link2 className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        )}
        <span>{copied ? "Link copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
