"use client";

import { useState } from "react";
import { MessageSquare, Reply } from "lucide-react";
import { api } from "@/lib/api";
import type {
  CommentThread,
  PublicComment,
  ReactionKind,
} from "@/lib/api-types";
import { formatDate } from "@/lib/format";
import { ReactionPicker, ReactionSummary } from "./reactions";

/**
 * The comment thread.
 *
 * **Controlled.** The thread lives in `PostInteractions`, because the action bar
 * above the article shows the comment count and the count is derived from this
 * list — two components reading the same thing means one of them owns it.
 *
 * Unlike the action bar, posting does **not** fail silently. A reader who typed
 * a paragraph and pressed a button is owed an answer, so a failed post says so
 * and keeps what they wrote in the textarea.
 */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "?";
}

function CommentCard({
  comment,
  slug,
  onReact,
  onReply,
}: {
  comment: PublicComment;
  slug: string;
  onReact: (updated: PublicComment) => void;
  onReply?: () => void;
}) {
  const [pending, setPending] = useState(false);

  async function react(kind: ReactionKind) {
    if (pending) return;
    setPending(true);
    try {
      onReact(await api.reactToComment(slug, comment.id, kind));
    } catch {
      // Leave the previous counts on screen; they were true a moment ago.
    } finally {
      setPending(false);
    }
  }

  return (
    <article className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg-surface font-mono text-[0.6875rem] text-fg-muted"
        >
          {initials(comment.author)}
        </span>
        <span className="font-medium">{comment.author}</span>
        {comment.authorIsOwner && (
          <span className="rounded-sm border border-brand px-1.5 font-mono text-[0.6875rem] text-brand">
            Author
          </span>
        )}
        {comment.createdAt && (
          <time
            dateTime={comment.createdAt}
            className="font-mono text-small text-fg-muted"
          >
            {formatDate(comment.createdAt)}
          </time>
        )}
      </div>

      {/* `whitespace-pre-wrap`: comments are plain text, and a reader's line
          breaks are the only formatting they have. Rendering Markdown here
          would mean rendering untrusted input. */}
      <p className="mt-2 whitespace-pre-wrap break-words">{comment.body}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <ReactionPicker
          current={comment.viewerReaction ?? null}
          onPick={react}
          disabled={pending}
          size="compact"
        />
        {onReply && (
          <button
            type="button"
            onClick={onReply}
            className="inline-flex items-center gap-2 font-mono text-small text-fg-muted transition-colors hover:text-brand"
          >
            <Reply
              className="h-4 w-4 shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Reply
          </button>
        )}
        <ReactionSummary counts={comment.reactions} className="ml-auto" />
      </div>
    </article>
  );
}

function CommentForm({
  slug,
  parentId,
  onPosted,
  onCancel,
  compact,
  formRef,
}: {
  slug: string;
  parentId?: string;
  onPosted: (comment: PublicComment, parentId?: string) => void;
  onCancel?: () => void;
  compact?: boolean;
  formRef?: React.Ref<HTMLTextAreaElement>;
}) {
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const result = await api.postComment(slug, {
        author,
        email: email || undefined,
        body,
        parentId: parentId ?? null,
        honeypot,
      });
      // `accepted: false` is the honeypot path. It cannot happen to a person,
      // and saying nothing is the point — a bot that learns it was caught is a
      // bot that comes back working.
      if (result.comment) onPosted(result.comment, parentId);
      setBody("");
      setHoneypot("");
      onCancel?.();
    } catch {
      setError("That didn't send. Try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  const nameField = (
    <label>
      <span>Name</span>
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Jane Doe"
        maxLength={80}
        autoComplete="name"
        disabled={sending}
        required
      />
    </label>
  );

  return (
    <form className="field flex flex-col gap-4" onSubmit={submit}>
      {compact ? (
        nameField
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {nameField}
          <label>
            <span className="flex items-center gap-2">
              Email
              <span className="font-normal text-fg-muted">
                optional, never shown
              </span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              maxLength={254}
              autoComplete="email"
              disabled={sending}
            />
          </label>
        </div>
      )}

      <label>
        <span>{parentId ? "Reply" : "Comment"}</span>
        <textarea
          ref={formRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={compact ? 3 : 4}
          maxLength={4000}
          placeholder={
            parentId ? "Write a reply…" : "Thoughts, corrections, questions…"
          }
          disabled={sending}
          required
        />
      </label>

      {/* The honeypot. Hidden from sight and from assistive technology, and
          skipped by the tab order — a person cannot reach it, so anything that
          fills it is not a person. Not `display: none`: some bots skip those. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="font-mono text-small text-error">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          className="btn btn--primary inline-flex items-center gap-2"
          disabled={sending}
        >
          <MessageSquare
            className="h-4 w-4 shrink-0"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span>
            {sending ? "Posting…" : parentId ? "Post reply" : "Post comment"}
          </span>
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={sending}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function Comments({
  slug,
  threads,
  total,
  onPosted,
  onReacted,
  formRef,
}: {
  slug: string;
  threads: CommentThread[] | null;
  total: number;
  onPosted: (comment: PublicComment, parentId?: string) => void;
  onReacted: (comment: PublicComment) => void;
  formRef?: React.Ref<HTMLTextAreaElement>;
}) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  return (
    <section aria-labelledby="comments-heading" className="flex flex-col gap-8">
      <h2 id="comments-heading" className="flex items-center gap-2 text-h3">
        <MessageSquare
          className="h-5 w-5 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        {total === 0
          ? "Comments"
          : `${total} ${total === 1 ? "comment" : "comments"}`}
      </h2>

      {threads === null ? null : threads.length === 0 ? (
        <p className="text-fg-muted">
          No comments yet. Yours would be the first.
        </p>
      ) : (
        <ol className="flex flex-col gap-8">
          {threads.map((entry) => (
            <li key={entry.comment.id} className="flex flex-col gap-4">
              <CommentCard
                comment={entry.comment}
                slug={slug}
                onReact={onReacted}
                onReply={() => setReplyingTo(entry.comment.id)}
              />

              {(entry.replies?.length ?? 0) > 0 && (
                // One level, and one level only — the same depth LinkedIn uses.
                // The indent is a border rather than padding so it still reads
                // as nesting on a narrow screen.
                <ol className="ml-3 flex flex-col gap-4 border-l border-border-hairline pl-4 sm:ml-4 sm:pl-6">
                  {(entry.replies ?? []).map((reply) => (
                    <li key={reply.id}>
                      <CommentCard
                        comment={reply}
                        slug={slug}
                        onReact={onReacted}
                      />
                    </li>
                  ))}
                </ol>
              )}

              {replyingTo === entry.comment.id && (
                <div className="ml-3 border-l border-border-hairline pl-4 sm:ml-4 sm:pl-6">
                  <CommentForm
                    slug={slug}
                    parentId={entry.comment.id}
                    onPosted={onPosted}
                    onCancel={() => setReplyingTo(null)}
                    compact
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      )}

      <div className="border-t border-border-hairline pt-8">
        <h3 className="mb-4 font-mono text-small text-fg-muted">
          Leave a comment
        </h3>
        <CommentForm slug={slug} onPosted={onPosted} formRef={formRef} />
      </div>
    </section>
  );
}
