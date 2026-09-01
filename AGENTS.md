# AGENTS.md

Canonical instructions for AI coding agents working in this repository.

> This file is the **single source of truth**. `CLAUDE.md` and
> `.github/copilot-instructions.md` intentionally contain only tool-specific notes and point
> back here. Add shared rules **here only** — duplicating them causes drift and contradictory
> guidance.

## What this is

`dileepa-dev` is the main website at **[dileepa.dev](https://dileepa.dev)** — a Next.js App
Router site that renders portfolio content pulled from `api.dileepa.dev`.

As of v2.0.0 it becomes the **central platform**. It absorbs the blog from `blog.dileepa.dev`,
gains Projects and an event gallery, and adopts the new brand. Whatever ships here is what
`admin-dileepa-dev` and `links-dileepa-dev` follow — this repo is the design reference for the
whole platform, so a shortcut taken here propagates to three applications.

Currently on branch `feat/v2.0.0`. `package.json` is at `2.0.0`; the release is what this
branch is being readied for.

[TODO.md](TODO.md) holds this repo's slice of the migration. Issue **#15** holds the full scope.
The cross-repository roadmap lives in `dileepadev/TODO.md`.

## Layout

Every row below is built. The table is a map of where things live, not a plan.

| Path | Status |
| --- | --- |
| `app/page.tsx` | **Built.** The homepage *is* the site — hero, about, work, education, community, contact |
| `app/globals.css` | **Built.** The layout reference, reproduced against the semantic tokens |
| `app/{communities,events,videos,projects,gallery}/` | **Built.** Index pages for the full lists |
| `app/blog/` | **Built.** A real reader — bodies from Git, metadata from the API, joined by slug |
| `components/sections/` | **Built.** Navbar, Hero, About, Work, Education, Community, Contact, Footer |
| `components/ui/` | **Built.** Container, Section, Card, Button, Badge, Chip, Lockup, ThemeToggle, EntryList, ItemList, Gallery, EmptyState |
| `lib/api.ts` | **Built.** The FastAPI client, plus `getHomepageData()` and `getGallery()` |
| `lib/api-schema.ts` | **Generated** from `openapi.json` by `npm run api:types`. Never edited by hand |
| `lib/api-types.ts` | **Built.** Names the generated shapes; the only file that reaches into `api-schema.ts` |
| `lib/content.ts` | **Built.** Post bodies, read from Git at build time against a pinned ref, with a direct per-slug read at runtime for anything published since. Fails the build on an empty post set |

## Toolchain

- Node + npm. `npm install`, then `npm run dev` (port 3000; `npm run dev -- -p 4000` to change).
- `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck` · `npm run format:check`.
- Next.js App Router with React Server Components. Default to server components; add
  `"use client"` only where a hook or a browser API actually requires it.
- Tailwind CSS 4 via `@tailwindcss/postcss` — configured in CSS, not in a `tailwind.config.js`.
- Deploys on Vercel: `main` → `dileepa.dev`, `dev` → `preview.dileepa.dev`. Pushing to either
  deploys immediately.
- Configuration is split by environment, the way `api-dileepa-dev` splits it:
  `.env.development` is what `next dev` loads and `.env.production` is what `next build` and
  `next start` load. Copy each from its `*.example`. There is deliberately **no `.env.local`** —
  it would override both and reintroduce the "which file won?" question the split exists to
  answer. `NEXT_PUBLIC_API_URL` is the API base.

Target versions for v2.0.0: Next.js **16.3.x**, React **19.2.x**, Tailwind **4.3.x**,
`@types/node` **^22**. `admin-dileepa-dev` must land on exactly the same Next and React
versions — version drift between the two apps is the thing v2.0.0 exists to end.

## Coding standards

- Match the style already in the file you're editing.
- TypeScript throughout. No `any` — if a shape is unknown, model it.
- Components are PascalCase files; barrel exports via `index.ts` per folder. Route-local
  components live in `_components/` inside the route.
- Comments explain *why*, not *what*.
- Site copy and config live in `lib/constants.ts`, not inline in components. Copy the owner
  edits — the About cards, the speaker bios, the speaking topics — comes from the API; what
  stays in `lib/constants.ts` is the fallback rendered when the API answers with nothing.
- Images go through `next/image`. A new remote host must be added to `remotePatterns` in
  `next.config.ts` or the image fails at runtime, not at build.
- **`priority` on an image is deprecated in Next 16.** Its replacements are not interchangeable:
  `loading` / `preload` / `priority` decide lazy-vs-eager, and `fetchPriority` only sets the
  hint. `fetchPriority="high"` on its own leaves the LCP image lazily loaded. Where `loading` is
  already set, pair it with `fetchPriority`; where it is not, `preload` is the replacement.
- **Page metadata is composed by `pageMetadata()` in `lib/metadata.ts`, not written per route.**
  Next replaces the layout's `openGraph` wholesale when a page declares one and inherits it
  wholesale when a page does not, so hand-written page metadata silently produces either the
  homepage's card or a card with no image. Add a route by calling the helper.
- **`SITE_CONFIG.url` and `METADATA_ORIGIN` are different values and are not interchangeable.**
  `SITE_CONFIG.url` is the site's identity — always `dileepa.dev` — and is what the media kit,
  the terminal profile, `llms.txt`, the sitemap and the feed print. `METADATA_ORIGIN` is the
  origin the running deployment is served from, and is what `metadataBase`, the canonical,
  `og:url` and `og:image` resolve against. A preview that describes itself with the production
  origin points its card at another site: that is how every preview shipped an `og:image` of
  `https://dileepa.dev/og.png` while production was still v1 and had no such file.
- **`SITE_CONFIG.description` is UI copy, `SITE_CONFIG.metaDescription` is the search snippet.**
  The short one is the hero's fallback heading, the footer line, the terminal profile and the web
  manifest; the long one is the only thing a `<meta name="description">` or a card should carry.
- **Every `meta.description` sits in 110-125 characters.** Two consumers, two limits: a search
  snippet runs to roughly 155, a social card truncates around 125. Write to the card — an
  ellipsis through the middle of a shared link reads worse than an unused half-line in a search
  result. Under about 100 and Google discards it and composes its own from the page.

## Brand rules — v2.0.0

Tokens come from `dileepadev/docs/brand/brand-tokens.css`, vendored here as
`app/brand-tokens.css` and mirrored for the doc set as `docs/brand-tokens.css`. Import them;
never re-declare values.

> [!IMPORTANT]
> The sheet is at **brand tokens v2.1**, which reconciled it against this site after the
> post-launch visual pass — where the draft and the shipped result disagreed, the shipped result
> won. `app/globals.css` therefore overrides only four font variables, the two `--on-emerald-*`
> stops and `--track-wide`; it used to restore around a hundred declarations that the v2.0 sheet
> had wrong, and every one of those is now a duplicate waiting to drift. If you find yourself
> re-declaring a token in `globals.css`, the sheet is the thing to change.
>
> The v1.0 HTML design reference (`index.html` in the `dileepadev` repo) no longer exists. Do
> not reintroduce a dependency on it.

- Emerald is the only accent. No second hue.
- Never Emerald Deep on Carbon. Never Emerald Bright on Paper.
- Manrope (display + UI) and JetBrains Mono (code, dates, metadata) via `next/font`.
- Weights **400, 500, 700 only**. No 600.
- Sentence case everywhere — headings, buttons, nav, labels.
- Emerald appears **once per surface** as a deliberate accent, not scattered.
- No hard-coded hex in components. If you're typing `#`, you're doing it wrong.
- Banned in copy, without exception: *passionate about, leveraging, cutting-edge, revolutionize,
  game-changing, unlock, seamless, AI enthusiast, thought leader, journey, humbled to announce,
  10x.* The list appears twice on purpose — as a comment in `lib/constants.ts` and rendered on
  `/brand` — so a grep for one of these words hits those two places and nothing else.
- Item titles in a list are headings, and which level depends on what is above them: `h3` under a
  section heading on the homepage, `h2` on an index page where the list *is* the page. `Item`
  takes `headingLevel` for this; the type step does not change either way.

## Testing

There is no test suite. Before calling a change done:

- `npm run lint` and `npm run build` both clean.
- Check the page in both light and dark themes — the brand has different accent stops per
  theme and a component that looks right in one can fail contrast in the other.
- Check mobile width. The site is content-first and most regressions show up at narrow widths.
- If the change touches API data, verify against a real API response, not a mock. Every fetch
  in `lib/api.ts` fails soft to `null`/`[]`, so a broken endpoint renders an empty section
  rather than an error — silence is not success.

## Docs

- Update `README.md` when routes, sections, or the stack change.
- `CHANGELOG.md` gets categorised entries (Added, Changed, Fixed, Removed) at release time.
- Keep [TODO.md](TODO.md) current — it is this repo's slice of the platform roadmap.

## Git workflow

- Branches: [BRANCH_NAMING_GUIDELINES.md](BRANCH_NAMING_GUIDELINES.md). `main` and `dev` are
  protected; never commit to them directly.
- Commits: [COMMIT_MESSAGE_GUIDELINES.md](COMMIT_MESSAGE_GUIDELINES.md) — if the work traces to
  a GitHub issue, reference it (`fixes #12`, `refs #12`); don't invent an issue number if none
  was given. v2.0.0 work traces to `refs #15`.
- PRs: [PULL_REQUEST_GUIDELINES.md](PULL_REQUEST_GUIDELINES.md)
- Versioning: [VERSIONING.md](VERSIONING.md) — SemVer, bumped in `package.json` at release.

## Secrets

- Real values live in `.env.development` and `.env.production` (both gitignored) — never in a
  `*.example` template, never committed.
- Anything prefixed `NEXT_PUBLIC_` ships to the browser. Do not put a secret behind that prefix.
- Analytics IDs (Google Analytics, Microsoft Clarity) are public by nature; API keys are not.

## Gotchas

- **`blog.dileepa.dev` is retired, not redirected.** The links pointing at it were updated at
  their source, so no redirect layer exists and none is planned. Two **same-site** slug rules do
  survive and are easy to lose: the legacy Part 1 slug, and `2026-02-11-welcome` →
  `2026-02-10-welcome`. The map is `dileepadev/docs/architecture/redirects.md`.
- **An empty post set fails the build, deliberately.** `lib/content.ts` filters a whole-repo tree
  down to `BLOG_CONTENT_POSTS_DIR`, so a ref that does not carry that directory yields zero files
  rather than an error — and because post *metadata* comes from the API, `/blog` goes on listing
  every post while every `/blog/[slug]` falls through to `notFound()`. That is a build which
  prerenders eighteen 404 pages and reports success, and it is what a ref pointing at the
  pre-v2.0.0 blog tree did. `assertNotEmpty` turns it into a failure that names the ref and the
  directory. **Do not soften it into a warning.**
- **Every dynamic route resolves an unbuilt slug, and that is recent.** `/blog/[slug]` was closed
  (`dynamicParams = false`) while post bodies could only come from the pinned ref: a slug missing
  at build time had no body to fetch at runtime either. `getPostContent` now falls back to reading
  the file directly from the content repo, so the route is open and a post published after the
  last build resolves without a redeploy. `/projects/[slug]` and `/events/[slug]` were never
  closed — they are published from the admin and must resolve without a rebuild. The cost, on all
  three, is that a genuinely unknown slug 404s from the client: Next serves an on-demand
  `notFound()` as a client-rendered shell, correct status and empty `<body>`, where a slug the
  router rejects would have rendered `not-found.tsx` on the server.
- **A post page is static; three things on it are not.** Reactions, views and comments are fetched
  in the browser by `PostInteractions`, which owns the comment thread — the action bar's count and
  the comment list are the same data, and fetching it twice is waste nobody notices. Anything else
  added to a post should be built, not fetched.
- **Engagement fails silently; comments do not.** A reader who loses a view counter has lost
  nothing, so the bar renders without it. A reader who typed a paragraph and pressed a button is
  owed an answer, so a failed comment says so and keeps the text. Share is never withheld — it
  needs nothing from the API.
- **Reaction glyphs are emoji, and that is a brand decision.** §1 of the brand guide allows one
  accent hue and no second. Emoji carry colour as *content*, like a photograph, without entering
  the palette; a custom colour icon set would mean inventing four brand hues and hard-coding hex.
  If you change one, check it on the **dark** theme — that is how 🎓 was caught rendering
  near-black and replaced with 📚.
- **`remotePatterns` is Cloudinary and nothing else.** Every image the platform serves goes
  through `POST /uploads`, so a second host would mean an image had bypassed the one path holding
  the credentials. The consequence is that anything *not* from Cloudinary — a Markdown image in a
  post, a preview of a URL someone just typed — must use a plain `<img>`, not `next/image`.
- **Photographs appear in exactly two places**: the hero portrait and the event gallery. That is
  the whole image budget. Adding a third is a design-system change, not a component change.
- **`/events`, not `/sessions`.** The resource was briefly renamed on this branch and the rename
  is reverted; `/sessions` redirects for links shared from a preview deployment.
- **Failure is a decision, not a default.** `degrade` returns a fallback and logs which endpoint
  produced it; `optional` returns `null` on a 404 and rethrows anything else. The v1 client
  resolved everything to `null` or `[]`, so a broken endpoint rendered an empty section and looked
  like missing content.
- **A 200 is not proof of shape.** v1 returned bare arrays from its collection endpoints;
  `assertPage` rejects one rather than letting `undefined.map` surface inside a page component.
- **`period` on experience, education and community is free text**, not a date. Nothing sorts on
  it, and nothing should start.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
