# TODO

This file tracks tasks, improvements, and features planned for upcoming updates or releases of
this repository.

> [!NOTE]
> v2.0.0, v2.0.1 and v2.0.2 are shipped, tagged and closed. What each covered is in
> [CHANGELOG.md](CHANGELOG.md). The cross-repository roadmap lives in
> [`dileepadev/TODO.md`](https://github.com/dileepadev/dileepadev/blob/main/TODO.md).

## v2.1.0 - design system v2.1.0

Tracking issue: [#27](https://github.com/dileepadev/dileepa-dev/issues/27). Pull request:
[#29](https://github.com/dileepadev/dileepa-dev/pull/29). The design was built here first;
`dileepadev` holds the written system
([dileepadev#4](https://github.com/dileepadev/dileepadev/issues/4)).

- [x] Monochrome palette, `--fg-body`, `--border-input`; green only as `--success`
- [x] `@dileepadev` lockup on the site, the brand page, the social cards and the terminal
- [x] Profile rail and panels; floating nav below 1024px; `/work` and `/education` pages
- [x] Type by role, the 13px floor, weight 700 only for the display line and `<strong>`
- [x] Fixed / capsule / concentric corners and the edge rule; the 2px field focus edge
- [x] Page cross-fades, the image viewer pace, one hover timing, pulsing status dots
- [x] The site's own form validation messages; one copy behaviour; the reading-progress ring
- [x] Blog: contents in the rail, heading ids from `github-slugger`, sized images, code labels
- [x] Terminal profile: quadrant-block portrait, neofetch panel, current data, OSC 8 links
- [x] `llms.txt` from the API and `llms-full.txt`
- [x] New `og.png` / `og2.png`: the flat split card with the colour portrait
- [x] Brand tokens and `docs/` re-vendored from `dileepadev` brand tokens v2.1.0
- [x] `package.json` at `2.1.0`, the footer linked to the v2.1.0 release, `CHANGELOG.md` section
- [x] `lint`, `typecheck`, `format:check` and `build` clean; reviewed on the preview deployment

### At release v2.1.0

- [ ] Mark PR #29 ready for review and merge it into `dev`
- [ ] Open a PR from `dev` into `main` and merge it
- [ ] Tag `v2.1.0` on `main` and push the tag, per [VERSIONING.md](VERSIONING.md)
- [ ] Create the GitHub release from the `v2.1.0` changelog section (the footer links to it)
- [ ] Close [issue #27](https://github.com/dileepadev/dileepa-dev/issues/27)
- [ ] Refresh link-preview caches for `https://dileepa.dev/` (LinkedIn Post Inspector, Facebook
      Sharing Debugger); the card file name is unchanged, so platforms may keep the old one

## Backlog

Real, open, and not scheduled to a release.

- [ ] **The proxy rewrite drops the query string on Vercel, so `curl dileepa.dev?nocolor` is
      ignored.** `/terminal?nocolor` is correct; the same request to `/`, which `proxy.ts`
      rewrites there, reaches the route handler with an empty query and takes the intro-stream
      branch. The loss is at `NextResponse.rewrite` on Vercel and does not reproduce under
      `next start`. Every flag documented on `/` is affected: `?nocolor`, `?static`, `?plain`,
      `?raw`, `?fast`, `?now`, `?nointro`. Still present on production as of 2026-11-01
- [ ] **On-demand revalidation.** A `revalidatePath` endpoint, called after a publish, so
      freshness is instant under the day-long windows. Needs a caller in `api-dileepa-dev` (fires
      on write, covering direct API writes too) or `admin-dileepa-dev` (fires after a save)
- [ ] **A degraded render can be cached for a day.** If the API is down while an index page
      regenerates, `ApiOfflinePage` is what gets stored. On-demand revalidation is the fix -
      purge on recovery - so this waits for the item above
- [ ] **Take the root layout's `getAbout()` off the pages that do not need it.**
      `app/layout.tsx` puts a revalidating fetch in every route's tree, so `/terms`, `/privacy`,
      `/brand` and the error screens are ISR functions rather than static files
- [ ] **Prerender post HTML at build time** so Shiki runs once per deploy rather than once per
      regeneration. `/blog/[slug]` is the busiest and most expensive route on the site
- [ ] **Cold instances still parse every post to render one post page.** `getPostContent` calls
      `getAllContent()` before trying the single file it needs. `getAllContent` is the only
      caller of `assertNotEmpty`, which AGENTS.md says must not be softened - so the guard has to
      move to an explicit build-time check first, not a reorder
- [ ] **Enable Vercel's bot filter** for the project (no deploy needed). Keep Googlebot, Bingbot
      and the link-preview bots allowed

## Standing rules

Not tasks, and not to be "cleaned up" later.

- **Keep the two same-site slug redirects indefinitely.** A redirect rule costs nothing to keep;
  removing one costs a live link.
- **Keep the pinned content ref pinned.** `BLOG_CONTENT_REF` is a commit SHA on the blog repo's
  `main`, bumped deliberately when publishing. An unpinned ref makes a build's output depend on
  when it ran.
