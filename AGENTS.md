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

Currently on branch `feat/v2.0.0`. Version `1.3.0` in `package.json`; the target is `2.0.0`.

[TODO.md](TODO.md) holds this repo's slice of the migration. Issue **#15** holds the full scope.
The cross-repository roadmap lives in `dileepadev/TODO.md`.

## Layout

The v2.0.0 routes do not exist yet. Know which is which.

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
| `lib/content.ts` | **Built.** Post bodies, read from Git at build time against a pinned ref. Fails the build on an empty post set |

## Toolchain

- Node + npm. `npm install`, then `npm run dev` (port 3000; `npm run dev -- -p 4000` to change).
- `npm run build` · `npm run start` · `npm run lint`.
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
- Site copy and config live in `lib/constants.ts`, not inline in components.
- Images go through `next/image`. A new remote host must be added to `remotePatterns` in
  `next.config.ts` or the image fails at runtime, not at build.

## Brand rules — v2.0.0

Tokens come from `dileepadev/docs/brand/brand-tokens.css`. Import them; never re-declare values.

> [!IMPORTANT]
> The HTML design reference (`index.html` in the `dileepadev` repo) still carries **v1.0
> tokens** — `--cyan`, `--gold`, a different neutral ramp, Manrope aliased as the mono font,
> and weights 600/800. Use it for **layout and structure only**. Every colour, type, and token
> value comes from `brand-tokens.css`.

- Emerald is the only accent. No second hue.
- Never Emerald Deep on Carbon. Never Emerald Bright on Paper.
- Manrope (display + UI) and JetBrains Mono (code, dates, metadata) via `next/font`.
- Weights **400, 500, 700 only**. No 600.
- Sentence case everywhere — headings, buttons, nav, labels.
- Emerald appears **once per surface** as a deliberate accent, not scattered.
- No hard-coded hex in components. If you're typing `#`, you're doing it wrong.
- Banned in copy, without exception: *passionate about, leveraging, cutting-edge, revolutionize,
  game-changing, unlock, seamless, AI enthusiast, thought leader, journey, humbled to announce,
  10x.* Note `lib/constants.ts` currently contains "passionate about" — it goes in v2.0.0.

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
- **`/blog/[slug]` sets `dynamicParams = false`.** Post bodies come from a pinned ref, so a slug
  that was not in the set at build time has no body to fetch and cannot render at runtime either.
  Closing the route also fixes the 404 itself: an on-demand `notFound()` is served as a
  client-rendered shell — correct status, empty `<body>` — whereas a slug the router rejects
  renders `not-found.tsx` on the server like any other page. `/projects/[slug]` and
  `/events/[slug]` keep `dynamicParams` open on purpose: those are published from the admin and
  must resolve without a rebuild, and they still carry the empty-shell 404.
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
