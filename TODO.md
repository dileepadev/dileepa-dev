# TODO

This file tracks tasks, improvements, and features planned for upcoming updates or releases of
this repository.

> [!NOTE]
> This is this repository's slice of the v2.0.0 migration. The cross-repository roadmap lives in
> [`dileepadev/TODO.md`](https://github.com/dileepadev/dileepadev/blob/main/TODO.md), and the full
> scope for this repo is in
> [issue #15](https://github.com/dileepadev/dileepa-dev/issues/15).

## v2.0.0 - the central platform

The site absorbs the blog from `blog.dileepa.dev`, gains Projects and an event gallery, and adopts the
v2.0.0 brand. Architecture and rules are in [AGENTS.md](AGENTS.md).

Whatever ships here is what `admin-dileepa-dev` and `links-dileepa-dev` follow. A shortcut taken
here propagates to three applications.

**Foundation and rebrand need nothing from the API.** Start there; the API-dependent sections
wait on `api-dileepa-dev` reaching parity.

### Foundation ✅

- [x] Next.js 16.1.6 → **16.3.x**, React → **19.2.x**, Tailwind CSS → **4.3.x**, `@types/node` → **^22**
- [x] `admin-dileepa-dev` lands on the **same** Next and React versions - verified: both are on
      Next 16.3.2, React 19.2.8 and Tailwind ^4.3.3, and both report version 2.0.0
- [x] Vendor `brand-tokens.css` from `dileepadev/docs/brand/` into the repo, recording the source
- [x] Import the tokens into Tailwind 4 `@theme` in `app/globals.css`
- [x] Manrope + JetBrains Mono via `next/font`, weights 400/500/700 only
- [x] MDX pipeline with Shiki, `github-light` / `github-dark` - parity with the Astro blog's rendering
- [x] Generate `lib/api-types.ts` from the published OpenAPI spec, replacing the hand-maintained DTOs
- [x] **Split configuration by environment** - `.env.development` and `.env.production`, each
      complete on its own. No `.env.local`: it overrides both and puts back the question the
      split answers

### Rebrand ✅

- [x] Rebuild `components/ui/` against `dileepadev/docs/design/design-system.md`
- [x] **Implement the layout reference exactly** - the 760px measure, the floating nav pill, the
      section rhythm, entry and item grids, the subsection rule, the footer. Written into
      `app/globals.css` rather than approximated in utility classes, because "the same layout" has
      to keep being true after the next edit
- [x] `dileepadev /.` lockup - italic emerald slash, dot spaced with `margin-left`
- [x] Portrait-based favicon set (brand guide §3.2). The icons ship with a **transparent**
      field rather than a filled one, so each surface draws its own background behind the
      portrait - brand-guide.md §5 records `portrait-field` as applying to the platform
      profile crops, not to this set
- [x] Sentence case everywhere; all copy in the v2.0.0 voice
- [x] **"passionate about" removed from `lib/constants.ts`** - it is on the banned list
- [x] Section labels are words, not `01 /` numbers
- [x] The hero display heading is the **tagline**, not the name
- [ ] Audit: emerald appears once per surface, never scattered. **Measured, not yet judged** -
      counting elements whose computed `color` resolves to `--brand` gives 2 on `/projects` and
      `/gallery`, 3–5 on `/events`, `/videos` and a post, 9 on `/blog` and 13 on `/`. Most are
      inline prose links, which are not what the rule is about, so the number cannot settle it.
      Needs an eye, not a script
- [x] Verify both themes against the guide's contrast pairings - computed from the token sheet's
      own values and every pairing meets or beats what §3 claims for it. Emerald Bright on Carbon
      is 8.04:1 (claimed 7.7, AAA); Emerald Deep on Paper is 4.67:1 (claimed 4.7, AA); the
      `--on-brand` fills are 6.03:1 and 4.67:1, both AA; body text is 18.04:1 and 17.34:1, AAA
      either way
- [x] Re-evaluate Framer Motion against the new tone - it was imported nowhere, so the answer was
      to drop the dependency rather than tune it. `prefers-reduced-motion` is honoured in
      `globals.css` and `brand-tokens.css`, which is where the motion actually lives
- [x] No hard-coded hex anywhere in `components/`

### Blog reader - net-new, not a port ✅

- [x] Build-time fetch of `blog-dileepa-dev` content, pinned to a ref
      (see `dileepadev/docs/architecture/content-pipeline.md`)
- [x] Read the posts **recursively** - they are grouped `posts/<year>/<month>/<slug>.md`,
      and the Git trees API with `recursive=1` is one request rather than one per month
- [x] `/blog` index - the real reader, replacing the link list
- [x] `/blog/[slug]` - table of contents, share, "Read next"
- [x] `/blog/tags/[tag]` and series navigation
- [x] RSS at `/blog/rss.xml`
- [x] Port the Astro components deliberately - `Pre`, `SeriesBox`, `TocFab`, `Share` equivalents
- [x] All 18 posts render with formatting and code highlighting intact
- [x] **No banner.** Posts carry no image of their own; a Markdown image renders as a plain
      `<img>`, because `next/image` accepts only the hosts in `next.config.ts`

### The content pipeline ✅

- [x] **Every post 404'd in a production build while `/blog` listed all eighteen.** `BLOG_CONTENT_REF`
      pointed at the blog repo's `main`, where the posts were still Astro content under
      `src/content/posts/*.mdx`; nothing matched `posts/`, so `getPostContent` returned `null` for
      every slug. The index was unaffected because its data comes from the API, which is what made
      it read as a rendering bug. Fixed at the source: the content move is merged to the blog
      repo's `main`
- [x] **An empty post set fails the build** rather than prerendering eighteen 404 pages and
      reporting success. The error names the repository, the ref and the posts directory
- [x] ~~`/blog/[slug]` sets `dynamicParams = false`~~ - **reopened.** The premise was that a body
      cannot be fetched for a slug that was not in the build's set. `getPostContent` now reads the
      file directly from the content repo when the built map misses, so a post published after the
      last build resolves without a redeploy, and the route is open like the other two. The 404
      there is an empty client shell again - the item below covers all three now, not two
- [x] A `not-found.tsx` beside `/blog/[slug]`, `/projects/[slug]` and `/events/[slug]`, sharing one
      `NotFoundPage` component with the root one
- [x] The blog repo's `API_BASE_URL` secret still named the retired v1 Vercel API, so the sync
      workflow failed with `DEPLOYMENT_NOT_FOUND` on every post. Repointed at `api.dileepa.dev`;
      18 synced, 0 failed
- [ ] **`/blog/[slug]`, `/projects/[slug]` and `/events/[slug]` serve their 404 as a client-rendered shell** -
      correct status, empty `<body>` until hydration. `dynamicParams` has to stay open there:
      both are published from the admin and must resolve without a rebuild. Revisit if Next
      changes how an on-demand `notFound()` is streamed. **Re-confirmed on Next 16.3.2**: with
      scripts and styles stripped, `/blog/<missing>` and the root 404 both render 460 characters
      of markup server-side, while `/projects/<missing>` and `/events/<missing>` render 0. The
      status is correct in all four cases; only the body differs

### Post interactions ✅

Post pages are static; these three are the only parts that change after a build, so they are
fetched in the browser. `PostInteractions` owns the thread, because the action bar's comment count
and the comment list are the same data and fetching it twice would be waste nobody notices.

- [x] **Action bar** - React · Comment · Share in one row, counts summarised above it
- [x] **Reactions** - four kinds, one per reader, toggled by pressing the same one again
- [x] **Views**, shown subtly. De-duplication is the API's; the client guard only avoids a request
      already known to be a no-op
- [x] **Comments** - one level of replies, matching LinkedIn's depth. A reply to a reply is
      re-parented rather than rejected
- [x] **Reactions on comments and replies**, the same four, sharing one picker component
- [x] **Emoji rather than a custom icon set.** The brand guide allows one accent hue and no
      second; emoji carry colour as _content_, like a photograph, without entering the palette
- [x] Colour only appears once a reader has reacted - the trigger is a neutral line icon until
      then, which is what keeps a page of comments calm
- [x] Verified in a browser, both themes: the compact picker opens **downward** so it does not
      cover the comment being reacted to, and 🎓 was replaced with 📚 because most platforms draw
      the graduation cap near-black and it vanished on the dark theme
- [x] Share never withholds itself - it needs nothing from the API, so an outage does not stop a
      reader passing the article on

### Projects, events and the gallery ✅

- [x] `/projects` and `/projects/[slug]`; featured block under Work on the homepage
- [x] `/events` and `/events/[slug]` - speakers, photos, recordings, links
- [x] `schema.org/Event` JSON-LD on event pages
- [x] Events with no photos and no recording still render as complete pages
- [x] **`/events` keeps its path.** The `sessions` rename is reverted; `/sessions` redirects, for
      links shared from a preview deployment
- [x] **The event gallery** - `/gallery` and a homepage section, composed from `events[].photos`
      across every event. One of only two places a photograph appears on this site
- [x] Sitemap covering blog, projects, and events

### API integration ✅

- [x] Point `lib/api.ts` at FastAPI; adopt the new list and error envelopes
- [x] Add `getProjects`, `getProject`, `getEvents`, `getEvent`, `getGallery`
- [x] Update `getBlogs` for the reshaped model - relative `path`, `tags`, `series`,
      `readingTimeMinutes`, real `publishedDate`, and no banner
- [x] Per-resource `revalidate`
- [x] Degrade-vs-fail decided per call - `degrade` logs which endpoint fell back, `optional`
      returns `null` on a 404 and rethrows anything else
- [x] **Reject a non-envelope response** rather than reading `.items` off it. v1 returned a bare
      array, and trusting the shape turns a wrong `NEXT_PUBLIC_API_URL` into
      `map is not a function` inside a page component

### Redirects - same-site only

> [!NOTE]
> **`blog.dileepa.dev` is retired, not redirected.** The links that pointed at it were updated at
> their source, so there is no redirect layer to build and nothing gating the decommission. What
> that costs - indexed and third-party links to the old host now 404 - is recorded in
> `dileepadev/docs/architecture/redirects.md` §1, which remains the source of truth, not this list.

Two same-site rules survive, and neither is optional:

- [x] **Legacy slug:** `dileepa.dev/blog/2026-08-06-zero-to-agent-microsoft-foundry-series-kickoff`
      → `2026-08-06-part-1-kicking-off-the-series`. It lived in the blog's deleted
      `astro.config.mjs` and is easy to lose with it. In `next.config.ts`; driven in a browser
      and returns a single hop to the new slug
- [x] **Welcome slug:** `dileepa.dev/blog/2026-02-11-welcome` → `2026-02-10-welcome`. The content
      move renamed that post and changed its `publishedDate`; the corrected date is kept. Same
      commit, same verification - one hop, correct target
- [x] The sitemap lists neither old slug - verified against a production build reading the live
      API: 102 entries, every one on `https://dileepa.dev`, 18 post URLs, and neither
      `2026-02-11-welcome` nor the legacy Part 1 slug among them
- [x] `remotePatterns` is Cloudinary and nothing else - `blog.dileepa.dev` is gone from it

### SEO

- [x] `rel=canonical` on every post pointing at the `dileepa.dev` URL. `lib/format.ts`'s
      `postUrl` composes it rather than trusting the stored `canonicalUrl`, which on an
      un-migrated row still names `blog.dileepa.dev` - a host that is retired rather than
      redirected, so a canonical pointing at it asks search engines to prefer a dead URL. A
      stored value is honoured only when it is already on this origin. The same helper now backs
      the canonical tag, the OG url, the JSON-LD, the feed and the sitemap, which were five
      copies of the same fallback
- [x] Carry over titles, descriptions, published and updated dates, OG and Twitter cards
- [x] JSON-LD: `BlogPosting` on posts, `schema.org/Event` on event pages
- [ ] Submit the sitemap for `dileepa.dev` in Search Console - **after the deployment**
- [ ] Remove the `blog.dileepa.dev` property, and the DNS record with it. **Not a change of
      address** - that tool requires the old URLs to 301, and they do not. The host currently
      resolves to a registrar forward and has no certificate. **After the deployment**

### Hardening

- [x] **Security headers.** The site sent none - no CSP, no `nosniff`, no framing, referrer or
      permissions policy - while the API has carried a full set since v2.0.0. They live in
      `next.config.ts` so the posture ships with the code rather than with the host.
      `Strict-Transport-Security` deliberately omits `includeSubDomains`: `blog.dileepa.dev` is
      retired and currently resolves to a registrar forward with no certificate, and the
      directive would be honoured for that host too, turning a forward into a connection failure.
- [x] **The CSP is verified in a browser, not reasoned about.** `script-src` has to keep
      `'unsafe-inline'` - Next inlines its hydration payload on every page and Clarity's loader
      is an inline bootstrap, and removing it needs a per-request nonce, which needs middleware
      on every route, which would make all 109 static pages dynamic. It still earns its place by
      naming the only three script origins. Driven in headless Chromium against a production
      build: `gtag/js`, `clarity.ms/tag`, `scripts.clarity.ms`, `google-analytics.com/g/collect`,
      `i.clarity.ms/collect`, `c.clarity.ms` and `c.bing.com` all load, `window.gtag` and
      `window.clarity` are both functions, and **no request is blocked**. `connect-src` names the
      API by reading `NEXT_PUBLIC_API_URL`, so repointing the site cannot leave the policy behind
- [x] `poweredByHeader: false` - `X-Powered-By: Next.js` was on every response and nothing reads it

### Testing

- [x] `npm run lint`, `npm run typecheck` and `npm run build` all clean
- [x] API-backed pages verified against a real API response, not a mock - the production build
      reads `api.dileepa.dev`, and `https://dileepa.dev` is in the API's CORS allowlist
- [x] **All 18 posts return a direct 200 with their body rendered** - verified against a local
      production build (`next build && next start`), not the dev server. 77 internal links across
      every section crawled, 0 non-200
- [x] The two same-site slug redirects each return a single 308 hop to a live 200, and `/sessions`
      does too
- [x] No broken image in any migrated post - the three Cloudinary URLs all return 200, and no post
      references a path this repository or the blog repository would have to serve
- [x] Both the dev server and the production build load content correctly - `local:../blog-dileepa-dev/posts`
      in development, the pinned SHA from GitHub in production, 18 posts either way
- [ ] Repeat the 18-post check against `dileepa.dev` itself, once deployed
- [x] Both themes, on every new surface - driven in headless Chromium over `/`, `/blog`, a post,
      `/events`, `/gallery`, `/projects`, `/videos` and `/communities`, at both 375px and 1280px,
      computing every text node's contrast against its own resolved background. **Zero failures
      in either theme.** The single flagged element is the `/` separator in the footer, which is
      `aria-hidden` and decorative, so WCAG does not ask it to pass
- [x] 375px width - same crawl. `document.scrollWidth` never exceeds `clientWidth` on any of the
      eight surfaces in either theme, so nothing overflows horizontally
- [x] Keyboard navigation and visible focus rings on every interactive element - tabbed through
      each surface in both themes, reading the computed outline and box-shadow off
      `document.activeElement` at every stop. 27–40 stops per page, **0 without a visible ring**
- [x] Lighthouse ≥ 95 on all four categories - measured across twelve routes on `next start`,
      desktop and mobile. **Accessibility and SEO are 100 everywhere** (accessibility was 96–98:
      heading order on the index pages, and contrast plus Label in Name on `/brand`). Performance
      is 100 on eleven of twelve desktop routes and 89–98 on mobile; `/gallery` sits lower on a
      cold run only, where `next start` optimises two hundred photographs on demand with no CDN
      in front of it. **Best practices is 96 and stops there**: Next's Node-builtin polyfill
      bundle feature-detects with `Function("return function*(){}")`, CSP blocks it, the
      surrounding `try/catch` swallows it, and Chrome logs one `kEvalViolation` per page load. It
      is framework code reachable from no import here, and the alternative is granting every
      third-party script `eval()`. The note in `next.config.ts` records it so it is not
      rediscovered. Analytics does **not** cost anything measurable - `third-party-cookies` did
      not fire, because both loaders are gated on `NODE_ENV === "production"` and neither ran
- [ ] Re-measure against `dileepa.dev` after the deployment - a CDN in front of the image
      optimiser is the one difference that matters, and it is the one `/gallery` is waiting on
- [ ] Social preview cards render on LinkedIn and X - **after the deployment.** The tags are now
      composed by `lib/metadata.ts` for every route; before that, every index and static page
      served the homepage's card and every post, project and event served no image at all
- [ ] Analytics reporting continuously through the rebuild - **after the deployment**

### Documentation and release

- [x] Update `README.md` - routes, sections, stack, and what a post page does at runtime.
      Re-checked in the pre-release pass: it still listed Framer Motion and React Icons, neither
      of which is installed or imported
- [x] `CHANGELOG.md` entries under Added, Changed, Fixed, Removed
- [x] Version → `2.0.0` in `package.json`
- [ ] Merge `feat/v2.0.0` into `dev`, then `dev` into `main`
- [ ] Tag `v2.0.0` - held until the deployment, which is deliberately not part of this work
- [ ] Deploy `main` and verify the post-deployment items above
- [ ] Close [issue #15](https://github.com/dileepadev/dileepa-dev/issues/15)

## Standing rules

Not tasks, and not to be "cleaned up" later.

- **Keep the two same-site slug redirects indefinitely.** A redirect rule costs nothing to keep;
  removing one costs a live link.
- **Keep the pinned content ref pinned.** `BLOG_CONTENT_REF` is a commit SHA on the blog repo's
  `main`, bumped deliberately when publishing. An unpinned ref makes a build's output depend on
  when it ran.
