# TODO

This file tracks tasks, improvements, and features planned for upcoming updates or releases of
this repository.

> [!NOTE]
> Release work - objectives, release steps, tagging - is tracked in each release's GitHub issue,
> where a checkbox can be ticked without a commit. What shipped is in [CHANGELOG.md](CHANGELOG.md).
> This file holds only code-level work that no issue tracks yet, and the standing rules. The
> cross-repository roadmap lives in
> [`dileepadev/TODO.md`](https://github.com/dileepadev/dileepadev/blob/main/TODO.md).

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
