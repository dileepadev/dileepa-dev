/**
 * Blog post bodies, read from Git at build time.
 *
 * Three stores, each holding what it is good at: Git holds the words,
 * Cloudinary holds the images, MongoDB holds the index. This module is the Git
 * half — see `content-pipeline.md`.
 *
 * **The ref is pinned.** Fetching `main` would make a build's output depend on
 * when it ran, so an in-progress edit could ship by accident and a rebuild
 * would not reproduce. `BLOG_CONTENT_REF` is a tag or a SHA, bumped
 * deliberately when publishing.
 *
 * **Reads are cached for the process.** A build pulling 18 files over the
 * network on every hot reload is unusable locally, and a pinned ref's content
 * cannot change, so caching by ref is safe.
 */

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTimeOf from "reading-time";

const REPO = process.env.BLOG_CONTENT_REPO || "dileepadev/blog-dileepa-dev";
const REF = process.env.BLOG_CONTENT_REF || "main";
const POSTS_DIR = process.env.BLOG_CONTENT_POSTS_DIR || "posts";
const TOKEN = process.env.GITHUB_TOKEN;

/**
 * A checkout to read from instead of GitHub. Set it locally to write and
 * preview a post without pushing; leave it unset everywhere else.
 */
const LOCAL_PATH = process.env.BLOG_CONTENT_LOCAL_PATH;

export interface PostFrontMatter {
  title: string;
  description: string;
  publishedDate: string;
  updatedDate?: string;
  tags?: string[];
  draft?: boolean;
  series?: string;
  seriesOrder?: number;
}

export interface PostContent {
  slug: string;
  frontMatter: PostFrontMatter;
  /** The body, with the Astro import stripped. See `sanitise`. */
  body: string;
  readingTimeMinutes: number;
}

/**
 * Remove the one MDX-only construct the posts use.
 *
 * Eight of the eighteen posts carry `import SeriesBox from
 * "../../components/SeriesBox.astro"` and a `<SeriesBox …/>` call. An Astro
 * component cannot compile here, and the series navigation is rendered from
 * the `series` and `seriesOrder` front matter instead — which is what
 * `content-pipeline.md` §7 specifies.
 *
 * The blog repo strips these during the content move. This runs anyway: a post
 * that has not been cleaned yet should render without its series box, not fail
 * the build.
 */
function sanitise(body: string): string {
  return body
    .replace(/^import\s+\w+\s+from\s+["'][^"']*\.astro["'];?\s*$/gm, "")
    .replace(/^<[A-Z]\w*\b[^>]*\/>\s*$/gm, "")
    .trim();
}

/**
 * The slug is the file name, not the path.
 *
 * Posts are grouped as `posts/<year>/<month>/<slug>.md`. The directories are
 * grouping and were never part of the URL — the slug is the URL and a
 * published one is never renamed. See `redirects.md`.
 */
function slugOf(filepath: string): string {
  const filename = filepath.split("/").pop() ?? filepath;
  return filename.replace(/\.mdx?$/, "");
}

function parse(filepath: string, raw: string): PostContent {
  const { data, content } = matter(raw);
  const body = sanitise(content);
  return {
    slug: slugOf(filepath),
    frontMatter: data as PostFrontMatter,
    body,
    readingTimeMinutes: Math.max(1, Math.round(readingTimeOf(body).minutes)),
  };
}

async function githubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      // The repo is public so this works unauthenticated, but the anonymous
      // rate limit is low enough that a build fetching 18 files plus a listing
      // can hit it — and the failure then looks like a content bug.
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
    next: { revalidate: false },
  });
  if (!response.ok) {
    throw new Error(
      `GitHub returned ${response.status} for ${url}. ` +
        `Check BLOG_CONTENT_REF (${REF}) and, in CI, GITHUB_TOKEN.`,
    );
  }
  return (await response.json()) as T;
}

/** Every Markdown file under a directory, at any depth. */
async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const found = await Promise.all(
    entries.map(async (entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return walk(full);
      return /\.mdx?$/.test(entry.name) ? [full] : [];
    }),
  );
  return found.flat();
}

async function listLocal(): Promise<PostContent[]> {
  const dir = path.resolve(LOCAL_PATH!, POSTS_DIR);
  const files = await walk(dir).catch((error: NodeJS.ErrnoException) => {
    // A wrong BLOG_CONTENT_LOCAL_PATH is the likeliest local misconfiguration,
    // and a bare ENOENT does not say which variable produced the path.
    if (error.code !== "ENOENT") throw error;
    throw new Error(
      `${dir} does not exist. BLOG_CONTENT_LOCAL_PATH is ${LOCAL_PATH} and ` +
        `BLOG_CONTENT_POSTS_DIR is ${POSTS_DIR}; unset the former to read from GitHub.`,
    );
  });
  return Promise.all(
    files.map(async (file) => parse(file, await fs.readFile(file, "utf8"))),
  );
}

async function listRemote(): Promise<PostContent[]> {
  // The Git trees API rather than the contents API: posts are nested under
  // year and month directories, and `recursive=1` returns the whole tree in one
  // request instead of one request per month. On a repo this size the tree is
  // never truncated, but the flag is checked rather than assumed — a silently
  // short list would look like posts had been deleted.
  const tree = await githubJson<{
    tree: { path: string; type: string }[];
    truncated: boolean;
  }>(`https://api.github.com/repos/${REPO}/git/trees/${REF}?recursive=1`);

  if (tree.truncated) {
    throw new Error(
      `The Git tree for ${REPO}@${REF} came back truncated, so the post list ` +
        `would be incomplete. Read ${POSTS_DIR} directory by directory instead.`,
    );
  }

  const files = tree.tree.filter(
    (entry) =>
      entry.type === "blob" &&
      entry.path.startsWith(`${POSTS_DIR}/`) &&
      /\.mdx?$/.test(entry.path),
  );

  return Promise.all(
    files.map(async (file) => {
      const response = await fetch(
        `https://raw.githubusercontent.com/${REPO}/${REF}/${file.path}`,
        { next: { revalidate: false } },
      );
      if (!response.ok) {
        throw new Error(`Could not read ${file.path} from ${REPO}@${REF}`);
      }
      return parse(file.path, await response.text());
    }),
  );
}

/** Where the content came from, for the build log. */
export const contentSource = LOCAL_PATH
  ? `local:${LOCAL_PATH}/${POSTS_DIR}`
  : `${REPO}@${REF}/${POSTS_DIR}`;

// Cached for the process. The ref is pinned, so the content cannot change
// underneath a running build.
let cache: Promise<Map<string, PostContent>> | null = null;

/**
 * An empty post set is a configuration fault, not an empty blog.
 *
 * `listRemote` filters a whole-repo tree down to `POSTS_DIR`, so a ref that
 * does not carry that directory yields zero files rather than an error. The
 * index is built from the API and goes on listing every post, so the only
 * symptom is that every `/blog/[slug]` falls through to `notFound()` — a build
 * that prerenders eighteen 404 pages and reports success.
 *
 * That is exactly what a ref pointing at the pre-v2.0.0 blog repo did, where
 * the posts were still under `src/content/posts/`. Fail here instead, naming
 * the values that can be wrong.
 */
function assertNotEmpty(posts: PostContent[]): PostContent[] {
  if (posts.length > 0) return posts;
  throw new Error(
    `No posts found in ${contentSource}. Post metadata comes from the API, so ` +
      `the blog index would still list every post while every post page 404s. ` +
      `Check that BLOG_CONTENT_REF (${REF}) carries BLOG_CONTENT_POSTS_DIR ` +
      `(${POSTS_DIR})` +
      (LOCAL_PATH
        ? `, and that BLOG_CONTENT_LOCAL_PATH (${LOCAL_PATH}) is a blog checkout.`
        : `.`),
  );
}

async function load(): Promise<Map<string, PostContent>> {
  const posts = assertNotEmpty(
    LOCAL_PATH ? await listLocal() : await listRemote(),
  );
  // Where the words came from, written into the build log. The failure this
  // guards against is reading the right repository at the wrong ref, and that
  // is invisible unless the ref is recorded.
  console.log(`[content] ${posts.length} posts from ${contentSource}`);
  return new Map(posts.map((post) => [post.slug, post]));
}

export function getAllContent(): Promise<Map<string, PostContent>> {
  cache ??= load().catch((error) => {
    // Clear the cache so a transient failure does not poison every later call.
    cache = null;
    throw error;
  });
  return cache;
}

export async function getPostContent(
  slug: string,
): Promise<PostContent | null> {
  const posts = await getAllContent();
  return posts.get(slug) ?? null;
}
