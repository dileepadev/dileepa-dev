"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import type { CommentThread, PublicComment } from "@/lib/api-types";
import { Comments } from "./Comments";
import { Engagement } from "./Engagement";

/**
 * Owns everything about a post that changes after it is published.
 *
 * The action bar shows a comment count and the comment section shows the
 * comments — one list, read by two components, so one of them has to own it and
 * neither of them is the right one. This is.
 *
 * It also means the thread is fetched **once**. Letting the bar count comments
 * for itself would fetch the same list twice on every post page, which is the
 * kind of waste that is invisible until it is in production.
 */
export function PostInteractions({
  slug,
  url,
  title,
}: {
  slug: string;
  url: string;
  title: string;
}) {
  const [threads, setThreads] = useState<CommentThread[] | null>(null);
  const composer = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getComments(slug)
      .then((result) => {
        if (!cancelled) setThreads(result);
      })
      .catch(() => {
        // A thread that will not load degrades to the form alone: someone can
        // still leave a comment even when the list is unavailable.
        if (!cancelled) setThreads([]);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const onPosted = useCallback((comment: PublicComment, parentId?: string) => {
    // Spliced in rather than refetched. Comments are live the moment they are
    // posted, so a reader should see their own words land without a round trip.
    setThreads((current) => {
      const list = current ?? [];
      if (!parentId) return [...list, { comment, replies: [] }];
      return list.map((entry) =>
        entry.comment.id === parentId
          ? { ...entry, replies: [...(entry.replies ?? []), comment] }
          : entry,
      );
    });
  }, []);

  /** A reaction can land on a top-level comment or on a reply; both live here. */
  const onReacted = useCallback((updated: PublicComment) => {
    setThreads((current) =>
      (current ?? []).map((entry) => {
        if (entry.comment.id === updated.id) {
          return { ...entry, comment: updated };
        }
        const replies = entry.replies ?? [];
        if (!replies.some((reply) => reply.id === updated.id)) return entry;
        return {
          ...entry,
          replies: replies.map((reply) =>
            reply.id === updated.id ? updated : reply,
          ),
        };
      }),
    );
  }, []);

  const total = useMemo(
    () =>
      (threads ?? []).reduce(
        (sum, entry) => sum + 1 + (entry.replies?.length ?? 0),
        0,
      ),
    [threads],
  );

  const focusComposer = useCallback(() => {
    const field = composer.current;
    if (!field) return;
    field.scrollIntoView({ behavior: "smooth", block: "center" });
    // Focus after the scroll starts, not before: focusing first makes the
    // browser jump to the field and then animate from there, which reads as a
    // flicker rather than a scroll.
    window.setTimeout(() => field.focus({ preventScroll: true }), 300);
  }, []);

  return (
    <>
      <div className="mt-8 border-t border-border-hairline pt-6">
        <Engagement
          slug={slug}
          url={url}
          title={title}
          commentCount={total}
          onComment={focusComposer}
        />
      </div>

      <div className="mt-16 border-t border-border-hairline pt-8">
        <Comments
          slug={slug}
          threads={threads}
          total={total}
          onPosted={onPosted}
          onReacted={onReacted}
          formRef={composer}
        />
      </div>
    </>
  );
}
