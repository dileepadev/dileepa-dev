/**
 * The API client.
 *
 * Two things worth knowing before changing anything here.
 *
 * **Failure is a decision, not a default.** v1 resolved every call to `null`
 * or `[]` on error, so a broken endpoint rendered an empty section and looked
 * like missing content. Each call now says which it wants: `degrade` returns a
 * fallback and logs, `require` throws so the route's `error.tsx` renders. The
 * homepage degrades — a missing videos section beats a blank page. A blog post
 * or a project detail page requires: a 404 is honest, an empty article is not.
 *
 * **Collections are enveloped.** `{ items, total, limit, offset }` on every
 * resource. `fetchPage` unwraps it; nothing else should reach into `.items`.
 */

import type {
  About,
  ApiErrorBody,
  BlogEngagement,
  BlogPost,
  CommentPosted,
  CommentThread,
  PublicComment,
  Community,
  ContactRequest,
  ContactResult,
  Education,
  EventRecord,
  Experience,
  GalleryPhoto,
  Page,
  Project,
  ReactionKind,
  Tool,
  Video,
} from "./api-types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** How long a resource may be served stale, in seconds. */
const REVALIDATE = {
  /** Rarely changes and is edited deliberately. */
  profile: 3600,
  /** Published from the admin; an hour of staleness is invisible. */
  content: 900,
  /** Events gain photos and recordings after the fact. */
  events: 900,
  /** The blog index is what a reader hits after a post goes out. */
  blog: 300,
} as const;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  revalidate?: number;
  /** Passed through as a query string; `undefined` values are dropped. */
  query?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(endpoint: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_URL}${endpoint}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  return url.toString();
}

async function readError(
  response: Response,
  endpoint: string,
): Promise<ApiError> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (body?.error?.code) {
      return new ApiError(
        response.status,
        body.error.code,
        body.error.message,
        body.error.details,
      );
    }
  } catch {
    // A non-JSON error body is still an error; fall through.
  }
  return new ApiError(
    response.status,
    "http_error",
    `${endpoint} returned ${response.status} ${response.statusText}`,
  );
}

/** Fetch, throwing `ApiError` on anything that is not a 2xx. */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(buildUrl(endpoint, options.query), {
    next: { revalidate: options.revalidate ?? REVALIDATE.content },
  });
  if (!response.ok) throw await readError(response, endpoint);
  return (await response.json()) as T;
}

/**
 * Fetch, falling back rather than throwing.
 *
 * The fallback is logged with the endpoint that produced it, because the whole
 * failure mode of the v1 client was that a blank section looked deliberate.
 */
async function degrade<T>(
  endpoint: string,
  fallback: T,
  options: RequestOptions = {},
): Promise<T> {
  try {
    return await request<T>(endpoint, options);
  } catch (error) {
    const reason =
      error instanceof ApiError ? `${error.code}: ${error.message}` : error;
    console.error(
      `[api] ${endpoint} failed, degrading to a fallback —`,
      reason,
    );
    return fallback;
  }
}

/**
 * A 200 is not proof the body is the right shape.
 *
 * v1 returned a bare array from its collection endpoints. Reading `.items` off
 * one yields `undefined`, and the crash lands wherever the caller first maps
 * over it — a stack trace pointing at a page component for a problem that is
 * two layers away. Checking here turns that into an `ApiError` naming the
 * endpoint, which `degrade` then handles like any other failure.
 */
function assertPage<T>(endpoint: string, body: unknown): Page<T> {
  const page = body as Page<T> | undefined;
  if (!page || !Array.isArray(page.items)) {
    throw new ApiError(
      200,
      "unexpected_shape",
      `${endpoint} did not return { items, total, limit, offset }. ` +
        `This is the v1 bare-array shape — check NEXT_PUBLIC_API_URL points at the v2 API.`,
    );
  }
  return page;
}

async function fetchPage<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<Page<T>> {
  return assertPage<T>(endpoint, await request<unknown>(endpoint, options));
}

async function degradePage<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T[]> {
  const empty: Page<T> = { items: [], total: 0, limit: 0, offset: 0 };
  const page = await degrade<Page<T>>(endpoint, empty, {
    ...options,
    // `degrade` catches whatever `request` throws, so the shape check has to
    // happen inside it rather than after.
  }).then((body) => {
    try {
      return assertPage<T>(endpoint, body);
    } catch (error) {
      console.error(`[api] ${endpoint} —`, (error as Error).message);
      return empty;
    }
  });
  return page.items;
}

/** `null` on a 404, rethrowing anything else. A missing record is not an outage. */
async function optional<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T | null> {
  try {
    return await request<T>(endpoint, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

// --- Profile ---------------------------------------------------------------

/**
 * A call that must never be cached, in either direction.
 *
 * `request` is built for build-time reads and defaults to a revalidate window.
 * Engagement is the opposite case: it runs in the browser, the numbers change
 * while the page is open, and a stale count is simply a wrong one. So this
 * skips `request` entirely rather than passing `revalidate: 0` through it and
 * hoping nothing upstream reinstates a default.
 */
async function engagement(
  method: "GET" | "POST",
  endpoint: string,
  body?: unknown,
): Promise<BlogEngagement> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    cache: "no-store",
    ...(body === undefined
      ? {}
      : {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }),
  });
  if (!response.ok) throw await readError(response, endpoint);
  return (await response.json()) as BlogEngagement;
}

export const api = {
  getAbout: () =>
    degrade<About | null>("/about", null, { revalidate: REVALIDATE.profile }),

  getExperiences: () =>
    degradePage<Experience>("/experiences", { revalidate: REVALIDATE.profile }),

  getEducations: () =>
    degradePage<Education>("/educations", { revalidate: REVALIDATE.profile }),

  getTools: () =>
    degradePage<Tool>("/tools", { revalidate: REVALIDATE.profile }),

  getCommunities: () => degradePage<Community>("/communities"),

  getVideos: () => degradePage<Video>("/videos"),

  // --- Projects ------------------------------------------------------------

  getProjects: (
    params: {
      featured?: boolean;
      status?: string;
      tag?: string;
      limit?: number;
    } = {},
  ) => degradePage<Project>("/projects", { query: params }),

  /** Throws on anything but a 404, so a detail route can 404 without hiding an outage. */
  getProject: (slug: string) => optional<Project>(`/projects/${slug}`),

  listProjects: (params: { limit?: number; offset?: number } = {}) =>
    fetchPage<Project>("/projects", { query: params }),

  // --- Events --------------------------------------------------------------

  getEvents: (
    params: {
      status?: string;
      type?: string;
      format?: string;
      year?: number;
      tag?: string;
      hasPhotos?: boolean;
      limit?: number;
    } = {},
  ) =>
    degradePage<EventRecord>("/events", {
      query: params,
      revalidate: REVALIDATE.events,
    }),

  getEvent: (slug: string) =>
    optional<EventRecord>(`/events/${slug}`, { revalidate: REVALIDATE.events }),

  listEvents: (params: { limit?: number; offset?: number } = {}) =>
    fetchPage<EventRecord>("/events", {
      query: params,
      revalidate: REVALIDATE.events,
    }),

  // --- Blog ----------------------------------------------------------------

  getBlogs: (
    params: {
      tag?: string;
      series?: string;
      featured?: boolean;
      limit?: number;
    } = {},
  ) =>
    degradePage<BlogPost>("/blogs", {
      query: params,
      revalidate: REVALIDATE.blog,
    }),

  getBlog: (slug: string) =>
    optional<BlogPost>(`/blogs/${slug}`, { revalidate: REVALIDATE.blog }),

  /** Every post, for the sitemap, the RSS feed and static params. */
  getAllBlogs: async (): Promise<BlogPost[]> => {
    const page = await degrade<Page<BlogPost>>(
      "/blogs",
      { items: [], total: 0, limit: 0, offset: 0 },
      { query: { limit: 200 }, revalidate: REVALIDATE.blog },
    );
    return page.items;
  },

  // --- Blog engagement -----------------------------------------------------
  //
  // These three run in the browser, not at build time. Post pages are static,
  // so views and reactions are the one part of a post that cannot be baked in.
  //
  // `cache: "no-store"` on all three, and no `next.revalidate`: a cached view
  // count is a wrong view count, and a cached POST is not a POST.

  getEngagement: (slug: string): Promise<BlogEngagement> =>
    engagement("GET", `/blogs/${encodeURIComponent(slug)}/engagement`),

  /**
   * Count a view. Safe to call on every mount.
   *
   * The API de-duplicates per reader per 24 hours, so a reload is a no-op
   * server-side rather than an inflated number. The client guards too, but only
   * as a courtesy — the guarantee is the API's.
   */
  recordView: (slug: string): Promise<BlogEngagement> =>
    engagement("POST", `/blogs/${encodeURIComponent(slug)}/views`),

  /** Set, change, or clear this reader's reaction. `null` clears it. */
  setReaction: (
    slug: string,
    reaction: ReactionKind | null,
  ): Promise<BlogEngagement> =>
    engagement("POST", `/blogs/${encodeURIComponent(slug)}/reactions`, {
      reaction,
    }),

  // --- Comments ------------------------------------------------------------
  //
  // Same reasoning as engagement: the post page is static, the thread is not.
  // Both calls run in the browser and neither may be cached.

  getComments: async (slug: string): Promise<CommentThread[]> => {
    const response = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(slug)}/comments`,
      { cache: "no-store" },
    );
    if (!response.ok) throw await readError(response, "/comments");
    return (await response.json()) as CommentThread[];
  },

  /**
   * Post a comment. Appears immediately — there is no approval step.
   *
   * `honeypot` is a field no human can see and therefore never fills in. It is
   * sent as an empty string on every real submission; a value in it marks the
   * caller as a bot, and the API answers 201 with `accepted: false` rather than
   * an error, because telling a bot which field caught it is how it learns.
   */
  postComment: async (
    slug: string,
    input: {
      author: string;
      email?: string;
      body: string;
      parentId?: string | null;
      honeypot?: string;
    },
  ): Promise<CommentPosted> => {
    const response = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(slug)}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          author: input.author,
          email: input.email || null,
          body: input.body,
          parentId: input.parentId ?? null,
          honeypot: input.honeypot ?? "",
        }),
      },
    );
    if (!response.ok) throw await readError(response, "/comments");
    return (await response.json()) as CommentPosted;
  },

  /** Set, change, or clear this reader's reaction to one comment. */
  reactToComment: async (
    slug: string,
    commentId: string,
    reaction: ReactionKind | null,
  ): Promise<PublicComment> => {
    const response = await fetch(
      `${API_URL}/blogs/${encodeURIComponent(slug)}/comments/${encodeURIComponent(commentId)}/reactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ reaction }),
      },
    );
    if (!response.ok) throw await readError(response, "/comments/reactions");
    return (await response.json()) as PublicComment;
  },

  // --- Contact -------------------------------------------------------------

  sendMessage: async (data: ContactRequest): Promise<ContactResult> => {
    const response = await fetch(`${API_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!response.ok) throw await readError(response, "/contact");
    return (await response.json()) as ContactResult;
  },
};

/**
 * Every event photo, newest event first, flattened into one list.
 *
 * The API has no `/photos` resource and should not grow one — a photo has no
 * life of its own away from the event it was taken at. So the gallery is
 * composed here from the events that have photos, which `?hasPhotos=true`
 * makes a single query rather than a fetch-and-filter.
 *
 * Within an event the photos keep their author-set `order`; across events the
 * ordering is the event list's, which is most recent first.
 */
export async function getGallery(limit = 24): Promise<GalleryPhoto[]> {
  const events = await api.getEvents({ hasPhotos: true, limit: 40 });

  return events
    .flatMap((event) =>
      [...(event.photos ?? [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((photo) => ({
          ...photo,
          eventSlug: event.slug,
          eventTitle: event.title,
          eventDate: event.startAt ?? null,
        })),
    )
    .slice(0, limit);
}

/**
 * Everything the homepage needs, in one round of requests.
 *
 * Every call here degrades, so one dead endpoint costs one section rather than
 * the page. The console will say which.
 */
export async function getHomepageData() {
  const [
    about,
    experiences,
    educations,
    tools,
    communities,
    projects,
    events,
    posts,
    videos,
    gallery,
  ] = await Promise.all([
    api.getAbout(),
    api.getExperiences(),
    api.getEducations(),
    api.getTools(),
    api.getCommunities(),
    api.getProjects({ featured: true, limit: 3 }),
    api.getEvents({ limit: 4 }),
    api.getBlogs({ limit: 4 }),
    api.getVideos(),
    getGallery(12),
  ]);

  return {
    about,
    experiences,
    educations,
    tools,
    communities,
    projects,
    events,
    posts,
    videos,
    gallery,
  };
}
