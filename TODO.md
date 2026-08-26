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

### Post interactions ✅

Post pages are static; these three are the only parts that change after a build, so they are
fetched in the browser. `PostInteractions` owns the thread, because the action bar's comment count
and the comment list are the same data and fetching it twice would be waste nobody notices.

- [x] **Action bar** — React · Comment · Share in one row, counts summarised above it
- [x] **Reactions** — four kinds, one per reader, toggled by pressing the same one again
- [x] **Views**, shown subtly. De-duplication is the API's; the client guard only avoids a request
      already known to be a no-op
- [x] **Comments** — one level of replies, matching LinkedIn's depth. A reply to a reply is
      re-parented rather than rejected
- [x] **Reactions on comments and replies**, the same four, sharing one picker component
- [x] **Emoji rather than a custom icon set.** The brand guide allows one accent hue and no
      second; emoji carry colour as *content*, like a photograph, without entering the palette
- [x] Colour only appears once a reader has reacted — the trigger is a neutral line icon until
      then, which is what keeps a page of comments calm
- [x] Verified in a browser, both themes: the compact picker opens **downward** so it does not
      cover the comment being reacted to, and 🎓 was replaced with 📚 because most platforms draw
      the graduation cap near-black and it vanished on the dark theme
- [x] Share never withholds itself — it needs nothing from the API, so an outage does not stop a
      reader passing the article on

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

### Redirects — same-site only

> [!NOTE]
> **`blog.dileepa.dev` is retired, not redirected.** The links that pointed at it were updated at
> their source, so there is no redirect layer to build and nothing gating the decommission. What
> that costs — indexed and third-party links to the old host now 404 — is recorded in
> `dileepadev/docs/architecture/redirects.md` §1, which remains the source of truth, not this list.

Two same-site rules survive, and neither is optional:

- [ ] **Legacy slug:** `dileepa.dev/blog/2026-08-06-zero-to-agent-microsoft-foundry-series-kickoff`
      → `2026-08-06-part-1-kicking-off-the-series`. It lived in the blog's deleted
      `astro.config.mjs` and is easy to lose with it
- [ ] **Welcome slug:** `dileepa.dev/blog/2026-02-11-welcome` → `2026-02-10-welcome`. The content
      move renamed that post and changed its `publishedDate`; the corrected date is kept
- [ ] The sitemap lists neither old slug
- [x] `remotePatterns` is Cloudinary and nothing else — `blog.dileepa.dev` is gone from it

### SEO

- [ ] `rel=canonical` on every post pointing at the `dileepa.dev` URL
- [x] Carry over titles, descriptions, published and updated dates, OG and Twitter cards
- [x] JSON-LD: `BlogPosting` on posts, `schema.org/Event` on event pages
- [ ] Submit the sitemap for `dileepa.dev` in Search Console
- [ ] Remove the `blog.dileepa.dev` property. **Not a change of address** — that tool requires the
      old URLs to 301, and they do not

### Testing

- [x] `npm run lint`, `npm run typecheck` and `npm run build` all clean
- [ ] Both themes, on every new surface — a component that passes contrast in one can fail in the other
- [ ] 375px width
- [ ] API-backed pages verified against a real API response, not a mock
- [ ] **All 18 posts return a direct 200 at `dileepa.dev/blog/{slug}` — against production, not localhost**
- [ ] The two same-site slug redirects each return a single hop to a live 200
- [ ] No broken image in any migrated post
- [ ] Social preview cards render on LinkedIn and X
- [ ] Lighthouse ≥ 95 on all four categories — homepage, a blog post, an event detail page
- [ ] Keyboard navigation and visible focus rings on every interactive element
- [ ] Analytics reporting continuously through the rebuild

### Documentation and release

- [x] Update `README.md` — routes, sections, stack, and what a post page does at runtime
- [x] `CHANGELOG.md` entries under Added, Changed, Fixed, Removed
- [x] Version → `2.0.0` in `package.json`
- [ ] Merge `feat/v2.0.0`; tag `v2.0.0`
- [ ] Close [issue #15](https://github.com/dileepadev/dileepa-dev/issues/15)

## Later

- [ ] Keep the two same-site slug redirects indefinitely — the cost of a redirect rule is nothing;
      removing one is what costs
- [ ] Consider a comment count on the blog index, once the API carries one without fetching every
      thread
