# TODO

This file tracks tasks, improvements, and features planned for upcoming updates or releases of
this repository.

> [!NOTE]
> The v2.0.0 migration is shipped, tagged and closed - see
> [issue #15](https://github.com/dileepadev/dileepa-dev/issues/15) and the `v2.0.0` entry in
> [CHANGELOG.md](CHANGELOG.md) for what it covered. The cross-repository roadmap lives in
> [`dileepadev/TODO.md`](https://github.com/dileepadev/dileepadev/blob/main/TODO.md).

## v2.0.2 - the CPU the ISR fix did not touch

v2.0.1 took every ISR window to an hour and the render count fell with it, but Active CPU kept
climbing. Production logs found why: the remaining cost was not page rendering at all.

- [x] **Every social card was being drawn per request.** A metadata route always attempts
      build-time prerendering, but in a dynamic segment it has no slugs to prerender for, so all
      three `opengraph-image` routes bailed to on-demand - `ƒ` in the v2.0.1 build output, and
      caught in production at `cache=MISS`. Each card is a Satori layout pass and a resvg PNG
      encode, the most CPU-expensive thing this site can be asked for, and a crawler asks for one
      per post. `generateStaticParams` moves all 59 to once per deploy; the build now reports `●`
- [x] **The blog card loaded every post to print one integer.** `readingTimeMinutes` comes off
      the API record now, not out of the Git body via `getPostContent`
- [x] **The v2.0.1 junk-slug gate was placed after the content load rather than before it** - so
      it stopped the second full listing and left the first standing. `/blog/robots.txt` on a cold
      instance still pulled a GitHub tree, 22 raw files and 22 `gray-matter` parses before
      returning null; the logs show a 404 invocation printing `[content] 22 posts`. Verified
      after the fix: four junk-slug shapes, two cards and a post render produce **zero**
      `[content]` loads
- [x] `npm run lint`, `npm run typecheck`, `npm run format:check` and `npm run build` all clean

### Still to confirm

- [ ] Active CPU growth per day, measured against the dashboard rather than inferred. Hobby
      retains **one hour** of runtime logs - a `24h` query returns the same rows as a `1h` one,
      and asking for anything older fails with `ExceedsBillingLimitError` - so the daily rate
      cannot be read from logs and has to come from the usage page
- [ ] **Cold instances still parse all 22 posts to render one post page.** `getPostContent` calls
      `getAllContent()` before trying the single file it needs. Reordering would make it one
      parse, but `getAllContent` is the only caller of `assertNotEmpty`, and AGENTS.md says that
      guard must not be softened - so this needs the guard moved to an explicit build-time check
      first, not a reorder

## v2.0.1 - the Fluid Active CPU overage

`dileepa.dev` is over its Vercel Hobby Fluid Active CPU allowance - **4h 49m against 4h** - while
serving roughly **four real pageviews a day**. Full write-up in
[issue #21](https://github.com/dileepadev/dileepa-dev/issues/21).

Every ISR revalidate window on the site is shorter than the gap between visits, so essentially
every request finds an expired entry, serves stale HTML **and** spawns a background regeneration.
The site pays a full server render per request while also serving a stale body - the worst of
both. ~1,500 renders a day to serve ~4 human pageviews.

The failure mode is not a bill. Hobby has no overage billing, so the risk is Vercel pausing the
project and `dileepa.dev` going dark - which is the one thing that cannot happen while the site is
being handed to recruiters.

### The fix

- [x] **Raise every revalidate window to an hour.** `REVALIDATE` in `lib/api.ts` - `blog` 300,
      `content` 900 and `events` 900 all become 3600; `profile` was already there. This is the
      whole of the urgent fix and it is a constant change, nothing more
- [x] **Raise the route segments that pin their own shorter windows.** `app/sitemap/page.tsx` at
      300, and `app/brand/page.tsx`, `app/profile/page.tsx` and `app/terminal/route.ts` at 900.
      The logs show them regenerating 65-77 times a day for pages that change a few times a year
- [x] **`checkApiHealth` no longer de-opts the page that calls it.** `next: { revalidate: 0 }`
      is an uncached fetch, and an uncached fetch inside a prerendered route flips it static →
      dynamic at runtime, which Next answers with a 500. A short cached window detects an outage
      just as well without taking the page down with it
- [x] **Drop the health probe from the three slug routes.** `optional()` rethrows anything that
      is not a 404, so an outage never reaches that branch on `/blog/[slug]`,
      `/events/[slug]` or `/projects/[slug]` - the record is simply missing. All the probe did
      there was turn every 404 into a 500. The index pages keep it, because `degradePage`
      swallows the failure and an empty list genuinely is ambiguous there
- [x] **A slug that cannot be a post costs no network.** `getPostContent` fell back to
      `listRemote()` - a tree listing, 22 raw file fetches and 22 `gray-matter` parses - for
      anything it could not resolve, including `/blog/robots.txt` and `/blog/${1}`. Post slugs
      are date-prefixed by the content contract, so a slug that is not is answered from memory
- [x] `npm run lint`, `npm run typecheck`, `npm run format:check` and `npm run build` all clean

### Verified on the preview deployment

`dpl_7BLZAybcP1nYYGoALfYNp4NSbLMP` (`883aab9`), built clean with no warnings.

- [x] **Vercel's own build log reports `1h` on every route** - the table previously ran from `5m`
      to `15m`. This is the authoritative check; a local build is not
- [x] All four previously-500ing slug shapes return **404** - `/blog/does-not-exist-xyz`,
      `/blog/robots.txt`, `/blog/${1}`, `/blog/2026-01-01-not-a-real-post` - as do
      `/events/nope`, `/projects/nope` and `/nonexistent-page`
- [x] **Runtime logs: 33× 200, 7× 404 (the probes above), zero 500s, zero errors, zero warnings**
- [x] 16 routes return 200 and prerendered; `/terminal`, `/blog/rss.xml`, `/sitemap.xml`,
      `/robots.txt`, `/llms.txt` and all three `opengraph-image` routes healthy
- [x] `x-nextjs-stale-time: 300` on responses is the **client router cache**, not ISR - production
      sends the same header while serving a `HIT` at `age` 2004, which a 300s ISR window could not
      do. Do not read it as a revalidate window

### Verify on production, after the merge

- [ ] `x-vercel-cache` returns `HIT` on `/`, `/blog` and a post within the hour after a warm-up
- [ ] `curl -o /dev/null -w '%{http_code}' https://dileepa.dev/blog/does-not-exist` returns **404**
- [ ] Fluid Active CPU falls back inside the 4h allowance over the following week

### At release

- [x] `package.json` and `package-lock.json` at `2.0.1`
- [x] `CHANGELOG.md` carries a `v2.0.1` section, dated **2026-09-08**
- [ ] Merge [PR #23](https://github.com/dileepadev/dileepa-dev/pull/23) into `dev`
- [ ] Open a PR from `dev` into `main` and merge it
- [ ] Tag `v2.0.1` on `main` and push the tag, per [VERSIONING.md](VERSIONING.md)
- [ ] Optionally create the GitHub release, pasting the `v2.0.1` changelog section
- [ ] Close [issue #21](https://github.com/dileepadev/dileepa-dev/issues/21)

### Not code

- [ ] **Enable Vercel's bot filter** for the project. It is the other large lever and needs no
      deploy - with ~4 real visitors a day, crawlers are effectively the entire bill. Keep
      Googlebot and Bingbot allowed; being deindexed is a worse trade than a few CPU-minutes

## Found while verifying v2.0.1, unrelated to it

- [ ] **The proxy rewrite drops the query string on Vercel, so `curl dileepa.dev?nocolor` is
      ignored.** `/terminal?nocolor` is correct - 8,112 bytes of plain text. The same request to
      `/`, which `proxy.ts` rewrites there, returns 15,521 bytes *byte-identical to `/terminal`
      with no query at all*, with `Cache-Control: no-store`, meaning it took the intro-stream
      branch: the route handler ran and saw an empty query. `proxy.ts` does read the query - a
      curl client asking for `/?html` correctly gets the markup - so the loss is at
      `NextResponse.rewrite`, and it does not reproduce under `next start`. Every flag README
      documents on `/` is affected: `?nocolor`, `?static`, `?plain`, `?raw`, `?fast`, `?now`,
      `?nointro`. **Pre-existing and identical on production**, so it is not a v2.0.1 regression -
      confirmed by running the same probes against `dileepa.dev`. Deliberately left out of the
      CPU patch: the fix needs iteration against preview deployments, which is not something to
      attach to an urgent release.

## Deferred to v2.1.0

Not needed to get back under the allowance, and each one carries more risk than a patch should.

- [ ] **On-demand revalidation.** A `revalidatePath` endpoint, called after a publish, so the
      hour-long windows can go to a day and freshness goes back to instant. Needs a caller in
      either `admin-dileepa-dev` (fires after a save) or `api-dileepa-dev` (fires on write) -
      the API-side version covers direct API writes too. **This is the only part of this work
      that touches another repository**, which is what makes it a MINOR rather than a PATCH
- [ ] **A degraded render can be cached for an hour.** If the API is down while an index page
      regenerates, `ApiOfflinePage` is what gets stored, and with hour-long windows it now
      sticks for an hour rather than five minutes. On-demand revalidation is the fix - purge on
      recovery - so this waits for the item above rather than being solved twice
- [ ] **Take the root layout's `getAbout()` off the pages that do not need it.**
      `app/layout.tsx` puts a revalidating fetch in every route's tree, so `/terms`, `/privacy`,
      `/brand` and the error screens are ISR functions rather than static files. Held back
      deliberately: it changes rendering behaviour on every route, which is more blast radius
      than a patch release should carry
- [ ] **Prerender post HTML at build time** so Shiki runs once per deploy rather than once per
      regeneration. `/blog/[slug]` is the busiest and most expensive route on the site

## Standing rules

Not tasks, and not to be "cleaned up" later.

- **Keep the two same-site slug redirects indefinitely.** A redirect rule costs nothing to keep;
  removing one costs a live link.
- **Keep the pinned content ref pinned.** `BLOG_CONTENT_REF` is a commit SHA on the blog repo's
  `main`, bumped deliberately when publishing. An unpinned ref makes a build's output depend on
  when it ran.
