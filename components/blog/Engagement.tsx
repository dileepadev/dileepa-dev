"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Eye, Link2, MessageSquare, Share2 } from "lucide-react";
import { FaLinkedin, FaXTwitter } from "@/components/icons/SocialIcons";
import { api } from "@/lib/api";
import type { BlogEngagement, ReactionKind } from "@/lib/api-types";
import { ReactionPicker, ReactionSummary, totalReactions } from "./reactions";

/**
 * The post's action bar: react, comment, share — plus the counts above it.
 *
 * Everything else on a post page is built once, from Git and the API. These
 * numbers cannot be: they change while the page is open. So this is a client
 * component that fetches on mount.
 *
 * **It fails quietly.** If the API is unreachable the counts and the react
 * button do not render — but *share still does*, because sharing needs nothing
 * from the API and a reader who wanted to send the article on should not be
 * stopped by a counter being down.
 */

const actionClasses =
  "inline-flex min-h-[var(--control-h)] items-center gap-2 rounded-sm px-2 " +
  "font-mono text-small text-fg-muted no-underline transition-colors " +
  "hover:text-brand";

function ShareActions({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
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
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="true"
        className={actionClasses}
      >
        <Share2
          className="h-4 w-4 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span>Share</span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Share this post"
          className="absolute right-0 bottom-full z-20 mb-2 flex flex-col gap-1 rounded-sm border border-border-strong bg-bg-surface p-1 shadow-lg"
        >
          <a
            href={`https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="inline-flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-small text-fg-muted no-underline transition-colors hover:bg-surface-hover hover:text-fg"
          >
            <FaXTwitter className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>X</span>
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className="inline-flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-small text-fg-muted no-underline transition-colors hover:bg-surface-hover hover:text-fg"
          >
            <FaLinkedin className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>LinkedIn</span>
          </a>
          <button
            type="button"
            role="menuitem"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-sm px-3 py-2 font-mono text-small text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg"
          >
            {copied ? (
              <Check
                className="h-4 w-4 shrink-0 text-brand"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            ) : (
              <Link2
                className="h-4 w-4 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
            <span>{copied ? "Link copied" : "Copy link"}</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Don't count the same reader twice in one browsing session.
 *
 * A courtesy, not the guarantee — the API de-duplicates per reader per 24 hours
 * and is what keeps the number honest. This avoids a request already known to
 * be a no-op, including the second one StrictMode fires in development.
 */
function alreadyViewed(slug: string): boolean {
  try {
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) return true;
    sessionStorage.setItem(key, "1");
    return false;
  } catch {
    // Private windows and blocked site data both throw. Falling through to a
    // request is correct: the API will de-duplicate it anyway.
    return false;
  }
}

export function Engagement({
  slug,
  url,
  title,
  commentCount,
  onComment,
}: {
  slug: string;
  url: string;
  title: string;
  commentCount?: number;
  onComment?: () => void;
}) {
  const [data, setData] = useState<BlogEngagement | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Recording a view returns the same shape as reading it, so the common
    // case is one request rather than two.
    const load = alreadyViewed(slug)
      ? api.getEngagement(slug)
      : api.recordView(slug);

    load
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        // Quietly. See the note at the top.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const react = useCallback(
    async (kind: ReactionKind) => {
      if (!data || pending) return;
      setPending(true);
      try {
        setData(await api.setReaction(slug, kind));
      } catch {
        // Leave the previous counts on screen. They were true a moment ago,
        // which beats a zeroed or half-applied widget.
      } finally {
        setPending(false);
      }
    },
    [data, pending, slug],
  );

  const reactionTotal = totalReactions(data?.reactions);
  const hasSummary =
    reactionTotal > 0 || (commentCount ?? 0) > 0 || !!data?.views;

  return (
    <div className="flex flex-col gap-3">
      {/* The counts, above the bar and separated from it — LinkedIn's shape,
          and the reason it works: the numbers are a summary of what happened,
          the bar is what you can do next. */}
      {hasSummary && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <ReactionSummary counts={data?.reactions} />
          <div className="flex items-center gap-4 font-mono text-small text-fg-muted">
            {(commentCount ?? 0) > 0 && (
              <button
                type="button"
                onClick={onComment}
                className="tabular-nums transition-colors hover:text-brand"
              >
                {commentCount} {commentCount === 1 ? "comment" : "comments"}
              </button>
            )}
            {data && data.views > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Eye
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="tabular-nums">
                  {data.views.toLocaleString()}
                </span>
                <span>{data.views === 1 ? "view" : "views"}</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1 border-t border-border-hairline pt-2">
        {/* Only rendered once the counts are known: a React button that cannot
            report what it did is worse than no button. Share does not depend on
            the API, so it is never withheld. */}
        {data && (
          <ReactionPicker
            current={data.viewerReaction ?? null}
            onPick={react}
            disabled={pending}
          />
        )}

        {onComment && (
          <button type="button" onClick={onComment} className={actionClasses}>
            <MessageSquare
              className="h-4 w-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span>Comment</span>
          </button>
        )}

        <div className="ml-auto">
          <ShareActions url={url} title={title} />
        </div>
      </div>
    </div>
  );
}
