# TODO

This file tracks tasks, improvements, and features planned for upcoming updates or releases of
this repository.

> [!NOTE]
> This is this repository's slice of the v2.0.0 migration. The cross-repository roadmap lives in
> [`dileepadev/TODO.md`](https://github.com/dileepadev/dileepadev/blob/main/TODO.md), and the full
> scope for this repo is in
> [issue #15](https://github.com/dileepadev/dileepa-dev/issues/15).

## v2.0.0 — the central platform

The site absorbs the blog from `blog.dileepa.dev`, gains Projects and an event gallery, and adopts the
v2.0.0 brand. Architecture and rules are in [AGENTS.md](AGENTS.md).

Whatever ships here is what `admin-dileepa-dev` and `links-dileepa-dev` follow. A shortcut taken
here propagates to three applications.

**Foundation and rebrand need nothing from the API.** Start there; the API-dependent sections
wait on `api-dileepa-dev` reaching parity.

### Foundation ✅

- [x] Next.js 16.1.6 → **16.3.x**, React → **19.2.x**, Tailwind CSS → **4.3.x**, `@types/node` → **^22**
- [ ] `admin-dileepa-dev` lands on the **same** Next and React versions — check before releasing
- [x] Vendor `brand-tokens.css` from `dileepadev/docs/brand/` into the repo, recording the source
- [x] Import the tokens into Tailwind 4 `@theme` in `app/globals.css`
- [x] Manrope + JetBrains Mono via `next/font`, weights 400/500/700 only
- [x] MDX pipeline with Shiki, `github-light` / `github-dark` — parity with the Astro blog's rendering
- [x] Generate `lib/api-types.ts` from the published OpenAPI spec, replacing the hand-maintained DTOs
- [x] **Split configuration by environment** — `.env.development` and `.env.production`, each
      complete on its own. No `.env.local`: it overrides both and puts back the question the
      split answers

### Rebrand ✅

- [x] Rebuild `components/ui/` against `dileepadev/docs/design/design-system.md`
- [x] **Implement the layout reference exactly** — the 760px measure, the floating nav pill, the
      section rhythm, entry and item grids, the subsection rule, the footer. Written into
      `app/globals.css` rather than approximated in utility classes, because "the same layout" has
      to keep being true after the next edit
- [x] `dileepadev /.` lockup — italic emerald slash, dot spaced with `margin-left`
- [x] Portrait-based favicon set (brand guide §3.2); portrait on `--bg-surface`
- [x] Sentence case everywhere; all copy in the v2.0.0 voice
- [x] **"passionate about" removed from `lib/constants.ts`** — it is on the banned list
- [x] Section labels are words, not `01 /` numbers
- [x] The hero display heading is the **tagline**, not the name
- [ ] Audit: emerald appears once per surface, never scattered
- [ ] Verify both themes against the guide's contrast pairings
- [ ] Re-evaluate Framer Motion against the new tone; honour `prefers-reduced-motion`
- [x] No hard-coded hex anywhere in `components/`

### Blog reader — net-new, not a port ✅

- [x] Build-time fetch of `blog-dileepa-dev` content, pinned to a ref
      (see `dileepadev/docs/architecture/content-pipeline.md`)
- [x] Read the posts **recursively** — they are grouped `content/posts/<year>/<month>/<slug>.md`,
      and the Git trees API with `recursive=1` is one request rather than one per month
- [x] `/blog` index — the real reader, replacing the link list
- [x] `/blog/[slug]` — table of contents, share, "Read next"
- [x] `/blog/tags/[tag]` and series navigation
- [x] RSS at `/blog/rss.xml`
- [x] Port the Astro components deliberately — `Pre`, `SeriesBox`, `TocFab`, `Share` equivalents
- [x] All 18 posts render with formatting and code highlighting intact
- [x] **No banner.** Posts carry no image of their own; a Markdown image renders as a plain
      `<img>`, because `next/image` accepts only the hosts in `next.config.ts`

### Projects, events and the gallery ✅

- [x] `/projects` and `/projects/[slug]`; featured block under Work on the homepage
- [x] `/events` and `/events/[slug]` — speakers, photos, recordings, links
- [x] `schema.org/Event` JSON-LD on event pages
- [x] Events with no photos and no recording still render as complete pages
- [x] **`/events` keeps its path.** The `sessions` rename is reverted; `/sessions` redirects, for
      links shared from a preview deployment
- [x] **The event gallery** — `/gallery` and a homepage section, composed from `events[].photos`
      across every event. One of only two places a photograph appears on this site
- [x] Sitemap covering blog, projects, and events

### API integration ✅

- [x] Point `lib/api.ts` at FastAPI; adopt the new list and error envelopes
- [x] Add `getProjects`, `getProject`, `getEvents`, `getEvent`, `getGallery`
- [x] Update `getBlogs` for the reshaped model — relative `path`, `tags`, `series`,
      `readingTimeMinutes`, real `publishedDate`, and no banner
- [x] Per-resource `revalidate`
- [x] Degrade-vs-fail decided per call — `degrade` logs which endpoint fell back, `optional`
      returns `null` on a 404 and rethrows anything else
- [x] **Reject a non-envelope response** rather than reading `.items` off it. v1 returned a bare
      array, and trusting the shape turns a wrong `NEXT_PUBLIC_API_URL` into
      `map is not a function` inside a page component

### Redirects — the highest-consequence work in v2.0.0

> [!WARNING]
> `blog.dileepa.dev` is on GitHub Pages, which cannot issue 301s. Its DNS moves to Vercel
> **before** anything is switched off. The map is
> `dileepadev/docs/architecture/redirects.md` — it is the source of truth, not this list.

- [ ] Repoint `blog.dileepa.dev` DNS to Vercel
- [ ] `next.config.ts` redirects with `has: [{ type: "host", value: "blog.dileepa.dev" }]`
- [ ] 18 post URLs → `dileepa.dev/blog/{slug}` (301)
- [ ] `blog.dileepa.dev/` and `/blog` → `dileepa.dev/blog`
- [ ] `blog.dileepa.dev/about` → `dileepa.dev/#about`
- [ ] `blog.dileepa.dev/images/**` → Cloudinary
- [ ] `blog.dileepa.dev/sitemap-index.xml` → `dileepa.dev/sitemap.xml`
- [ ] **Legacy slug, single hop, on both hosts:**
      `2026-08-06-zero-to-agent-microsoft-foundry-series-kickoff` →
      `2026-08-06-part-1-kicking-off-the-series`
- [x] `remotePatterns` is Cloudinary and nothing else — `blog.dileepa.dev` is gone from it

### SEO

- [ ] `rel=canonical` on every post pointing at the `dileepa.dev` URL
- [x] Carry over titles, descriptions, published and updated dates, OG and Twitter cards
- [x] JSON-LD: `BlogPosting` on posts, `schema.org/Event` on event pages
- [ ] Google Search Console change of address from the blog property
- [ ] Resubmit the sitemap; keep the old sitemap URL redirecting

### Testing

- [x] `npm run lint`, `npm run typecheck` and `npm run build` all clean
- [ ] Both themes, on every new surface — a component that passes contrast in one can fail in the other
- [ ] 375px width
- [ ] API-backed pages verified against a real API response, not a mock
- [ ] **All 19 old blog URLs return a single-hop 301 to a live 200 — against production, not localhost**
- [ ] No broken image in any migrated post
- [ ] Social preview cards render on LinkedIn and X
- [ ] Lighthouse ≥ 95 on all four categories — homepage, a blog post, an event detail page
- [ ] Keyboard navigation and visible focus rings on every interactive element
- [ ] Analytics reporting continuously through the rebuild

### Documentation and release

- [ ] Update `README.md` — routes, sections, stack
- [x] `CHANGELOG.md` entries under Added, Changed, Fixed, Removed
- [x] Version → `2.0.0` in `package.json`
- [ ] Merge `feat/v2.0.0`; tag `v2.0.0`
- [ ] Close [issue #15](https://github.com/dileepadev/dileepa-dev/issues/15)

## Later

- [ ] Keep the `blog.dileepa.dev` redirect layer live and monitored for **at least 12 months**
