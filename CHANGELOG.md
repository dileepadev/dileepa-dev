# Changelog

All notable changes to this project are documented in this file.

Changes are organized into the following categories:

- **Added:** New features or functionality introduced to the project.
- **Changed:** Modifications to existing functionality that do not add new features.
- **Fixed:** Bug fixes that resolve issues or correct unintended behavior.
- **Removed:** Features or components that have been removed from the project.

## [Unreleased]

> [!NOTE]
> A pre-release review pass over metadata, accessibility, branding and performance. No new
> features; the changes below are corrections to what v2.0.0 already ships.

### Added - Unreleased

- **One place that composes page metadata**, `lib/metadata.ts`. Next merges metadata per key
  rather than per field, which made hand-written page metadata fail in two directions at once: a
  page that declared no `openGraph` inherited the homepage's entire card, and a page that declared
  one replaced the layout's outright and lost `siteName`, `locale` and the default image with it.
  `pageMetadata()` takes what a page actually knows — a title, a description, a path, optionally an
  image and article dates — and returns the whole set.
- **`Item` takes a `headingLevel`.** An item title is `h3` under a section heading on the homepage
  and `h2` on an index page, where the list is the page and there is nothing between it and the
  `h1`. `.item-title` carries the H3 type step either way, so only the outline changes.
- **A bounded retry on `429`** in the API client, honouring `Retry-After`. The API allows sixty
  requests a minute; a build renders 150 pages across seven workers.

### Changed - Unreleased

- **The site title is sentence case**: `Dileepa Bandara — AI engineer`, which is the form
  `/brand` has documented all along while the site shipped `Dileepa Bandara - AI Engineer`.
- **Brand tokens re-vendored at v2.1** and `app/globals.css` trimmed to match. The override block
  restored the neutral ramp, the radius scale, the type steps, the control height, the hairline,
  both border weights, the button fill and every derived interaction token — about a hundred
  declarations that the reconciled sheet now sets identically. Four font variables, the two
  `--on-emerald-*` stops and `--track-wide` are what genuinely differ, and all that is left.
- **The 500 and 503 screens are components, not copies.** `app/error.tsx` carried its own inline
  version of both; the 503 there had already lost the gateway-host row the real one shows, and the
  two 500s disagreed on their button copy. Both now render the same components every other route
  renders, and "Go to the homepage" / "Explore the sitemap" read the same everywhere.
- The favicon previews on `/brand` are served as the files themselves rather than through the
  image optimizer — a re-encoded copy of an icon is not the icon on a page whose job is to show
  what ships.
- Tag pages filter the full post set instead of issuing a query per tag, which is sixty-eight
  fewer requests per cold build.
- `README.md` no longer lists Framer Motion or React Icons, neither of which is installed or used.

### Fixed - Unreleased

- **Twenty-nine of sixty-eight tag pages were empty.** `generateStaticParams` returned
  `encodeURIComponent(tag)` and Next encoded it again, so `"Advanced Git"` arrived as
  `"Advanced%20Git"` after one decode — a string no post carries. The page rendered that as its
  heading and reported that no posts carry the tag. Tags without spaces encode to themselves,
  which is why it looked like missing content rather than an encoding fault.
- **Every index and static page shared the homepage's social card** — same `og:title`, same
  `og:description`, same `og:url` — and **every blog post, project and event shipped with no card
  image at all**. `/profile` put an 800×800 portrait behind `summary_large_image`, which every
  platform crops to 1.91:1.
- **`/404`, `/500` and `/503` were indexable and canonicalised to the homepage.** All three now
  carry their own title, description and canonical, and `noindex` — `/404` excepted, where Next
  reserves the route name and supplies its own; the file records why rather than exporting
  metadata that does nothing.
- **Non-interactive chips showed a hover state.** The `Chip` component was right and the token
  sheet underneath it was not: an unscoped `.chip:hover` reached every chip regardless, and a
  `cursor: default` utility cancels the cursor and nothing else.
- **Heading order skipped a level on every index page** — `h1` straight to `h3`.
- **`/brand` failed contrast in two places and Label in Name in twenty.** The Error and Warning
  swatches set white on their fill (3.9:1 and 3.2:1); a metadata line used `--fg-muted` at 80%
  opacity at 11px (4.2:1). Sixteen ad-hoc type sizes on the page that documents the type scale are
  now `--text-label`. Each swatch's `aria-label` replaced its visible text rather than containing
  it, so the words a reader can see were not the words that activate the control.
- **The LCP image on `/gallery` had no priority hint** and `sizes` understated the tile by a third
  — a 240px variant in a 332px slot. `priority` is deprecated in Next 16 and does not do what
  `fetchPriority` does; both are now used where each belongs.
- Search and comment inputs had neither `id` nor `name`, and the sitemap filter had no accessible
  name at all.
- A cold build silently prerendered empty pages when the API rate-limited it — the exact failure
  `lib/api.ts` was rewritten to stop making silent.
- `"Leveraging"` in a speaking-topic summary, which the brand rules ban.
- `browserconfig.xml` used `#0D0D0D` — the surface stop, not the page foundation the tile shares
  with `theme-color` and the manifest.
- The web manifest's description was a third wording of a sentence that already exists once, and
  it declared no `id`, `scope`, `lang` or `orientation`.
- `robots.txt` allowed the system routes and the API proxy.
- Documentation that had drifted from the code: `AGENTS.md` still described `/blog/[slug]` as
  closed to unbuilt slugs, and the docstring above `dynamicParams = true` still argued for closing
  it; `Subsection`'s comment described an uppercase, accented title that the CSS does not draw.

### Removed - Unreleased

- `@next/third-parties`, which nothing imports, and a direct `shiki` dependency pinned a major
  version behind the copy `@shikijs/rehype` actually uses — two Shiki installs, one of them dead.

## [v2.0.0] - 2026-08-31

> [!NOTE]
> The site absorbs the blog, gains projects and an event gallery, and is rebuilt against the platform design system. Content comes from FastAPI; post bodies come from Git.

### Added - v2.0.0

- **The About cards, the speaker biographies and the speaking topics are served by the API.**
  Three blocks of copy that were constants in `lib/constants.ts` and
  `app/profile/_components/ProfileClient.tsx`: the six cards under the About section
  (`GET /pillars`), the two pre-approved bios on the speaker kit (`shortBio` and `fullBio` on the
  about record), and the sessions and talks beside them (`GET /speaking-topics`). Rewording any of
  them was a pull request and a deploy; it is a save in the admin now.
  **The constants stay, as the fallback.** Each block renders from the API where the API has
  anything and from the compiled-in copy where it does not — so the page reads the same before the
  collections are seeded as after, and an outage costs the section its editability rather than its
  content. A card's icon is a name from a closed set the spec declares, resolved to an imported
  component by an exhaustive map in `components/sections/About.tsx`; a name a newer API serves and
  this build does not know draws the default rather than nothing.
- **Security headers on every response**, set in `next.config.ts` so the posture ships with the
  code rather than with the host: a Content-Security-Policy, `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Strict-Transport-Security`.
  The site previously sent none of them, while the API has carried a full set since v2.0.0.
  `script-src` keeps `'unsafe-inline'` because Next inlines its hydration payload on every page
  and Microsoft Clarity's loader is an inline bootstrap; removing it needs a per-request nonce,
  which needs middleware on every route, which would make all 109 statically generated pages
  dynamic. It still earns its place by naming the only three script origins the site may load
  from. `connect-src` names the API by reading `NEXT_PUBLIC_API_URL`, so repointing the site
  cannot leave the policy naming the old one. `Strict-Transport-Security` deliberately omits
  `includeSubDomains` — `blog.dileepa.dev` is retired and resolves to a registrar forward with no
  certificate, and the directive would be honoured there too.
  **The policy differs in development, and only there.** React's development build calls `eval()`
  to rebuild callstacks and drive other debugging features, hot module replacement is a WebSocket,
  Turbopack serves some chunks from `blob:` URLs, and `@vercel/analytics` fetches a debug build
  from `va.vercel-scripts.com` rather than the `/_vercel/…` path it uses in production. So
  `'unsafe-eval'`, `blob:`, `ws:`/`wss:` and that one host are added when `NODE_ENV` is
  `development` and never otherwise. React never calls `eval()` in a production build, so
  production keeps the stricter policy and loses nothing by it.
  Both policies were driven in a browser rather than reasoned about. Production: analytics loads,
  `window.gtag` and `window.clarity` are both live, and nothing is blocked. Development: the
  homepage, `/projects`, a project page, `/blog`, a post, `/events` and `/gallery` all report a
  clean console.
- **Post interactions** — a React · Comment · Share action bar under every article, with the
  counts summarised above it. Reactions (four kinds, one per reader, toggled by pressing the same
  one again), a view count de-duplicated per reader per 24 hours by the API, and comments with one
  level of replies that carry the same four reactions. Post pages are static, so all of it is
  fetched in the browser; `PostInteractions` owns the thread because the bar's comment count and
  the comment list are the same data.
- Reactions render as **emoji** rather than a custom icon set. The brand guide allows one accent
  hue and no second, and emoji carry colour as content — like a photograph — without entering the
  palette. Colour appears only once a reader has reacted; until then the trigger is a neutral line
  icon, which is what keeps a page of comments calm.
- Video descriptions on `/videos` and on the homepage, and the search matches them.
- **`/projects` and `/projects/[slug]`** — the projects the API gained in v2.0.0. Featured ones
  appear under Work on the homepage.
- **The blog reader.** `/blog`, `/blog/[slug]`, `/blog/tags/[tag]` and `/blog/rss.xml`, with a
  table of contents, share links, series navigation and "Read next". Post metadata comes from
  the API and post bodies are read from `blog-dileepa-dev` at build time, joined by slug — see
  `content-pipeline.md`. Once a build ships, nothing at runtime can take the blog down.
- **The event gallery** — `/gallery`, and a section on the homepage. A flat grid of
  `events[].photos` across every event, newest first, each tile linking to the event it came
  from. There is no `/photos` resource behind it and there should not be one: a photograph has no
  life of its own away from the event it was taken at, and the caption needs the event's title
  and date to mean anything.
- Sitemap covering the blog, projects and events. JSON-LD `BlogPosting` on posts and
  `schema.org/Event` on event pages.
- The portrait-based favicon set, web manifest, and a 1200×630 Open Graph card, vendored from
  `dileepadev/docs/brand/`.
- `NEXT_PUBLIC_SITE_URL`, so canonical URLs, the sitemap and the RSS feed are composed from the
  origin the app is actually served from.
- **`curl -L dileepa.dev` renders the profile in a terminal.** `proxy.ts` matches `/` and nothing
  else, reads the User-Agent, and rewrites known terminal clients — curl, wget, HTTPie, xh,
  PowerShell — to `app/terminal/route.ts`, which serves `text/plain` with ANSI colour. The route is
  also a stable URL of its own at `/terminal`, for a client the sniffer does not recognise.
  **Nothing a browser sees changed.** An unmatched request falls through `NextResponse.next()` to
  the same prerendered homepage it got before, with no added header and no modified response.
  Crawlers are unmatched by construction: Googlebot, Bingbot and Slack's unfurler all send
  browser-shaped agents, so they index the real page. HTTP *libraries* — `python-requests`,
  `okhttp`, `node-fetch` — are deliberately excluded too. Those are scripts rather than a person at
  a prompt, and handing them a different body than a browser gets is indistinguishable from
  cloaking.
  The content is composed in `lib/terminal.ts` from the same `api.*` calls the homepage uses,
  through the same data cache, so there is no second copy of the profile to keep in sync and the
  output degrades exactly the way the page does — a dead collection costs one section, not the
  response. `lib/ansi.ts` holds the colour and the fixed-width layout; width is measured against
  visible columns rather than string length, because an escape code occupies bytes without
  occupying a column. Emerald stays the only accent, at the Emerald Bright stop: a terminal is a
  dark surface by overwhelming default and its background cannot be detected over HTTP. `?nocolor`
  drops every escape code for anyone that assumption is wrong for.
  **`-L` is part of the advertised command, and not for style.** `curl dileepa.dev` resolves to
  `http://dileepa.dev`, and Vercel answers plaintext HTTP on a custom domain with a `308` to the
  HTTPS origin — at the edge, before any code in this repository runs. curl does not follow
  redirects unless asked, so the bare command prints Vercel's `Redirecting...` body. There is no
  application-level fix; the redirect is not ours to remove. `curl https://dileepa.dev` reaches
  HTTPS directly and needs no flag.
- **A streamed boot sequence, played by default.** `curl -L dileepa.dev` writes its response down
  a chunked stream with pauses between the chunks; curl prints bytes as they land, so the pauses
  become timing. The wordmark types itself in, four boot steps spin and resolve, a bar fills, and
  it settles into the same document the static route serves — about two and a half seconds, then
  exit 0. `lib/terminal-intro.ts`.
  **The trade it makes, stated plainly.** The server cannot tell whether the reader's `stdout` is a
  terminal or a file: curl answers `isatty` locally and sends nothing about it, so
  `curl -L dileepa.dev > profile.txt` is indistinguishable on the wire from a person watching their
  screen, and the animation lands in the file. Playing by default trades that case for the common
  one, and `?static` (or `?fast`, `?now`, `?nointro`) skips it. `?nocolor` implies a skip, because
  someone who turned the escape codes off is piping and should not have to pass two flags to say
  one thing.
  Redraws use carriage returns rather than cursor-up sequences, so a redraw can only overwrite the
  line it is on. Only terminal clients are animated — a browser at `/terminal` gets the document
  at once, since it cannot render a redraw. `lib/terminal-client.ts` now answers "is this a
  terminal?" for both the proxy and the route, so the two cannot drift apart.
- **The masthead is the wordmark drawn large in block characters**, in a double-ruled box, with
  the name, role and status centred beneath it. `lib/wordmark.ts`.
  The brand rule survives the change of scale — the wordmark takes the neutral foreground, the
  `/.` takes emerald, and the two never swap — which is why `renderWordmark` hands back the two
  halves separately instead of one joined string. The font is hand-built on a 6-row body at
  proportional widths rather than borrowed from ANSI Shadow: its 8-to-9-column glyphs put "dileepadev" past
  75 columns before the mark, and widening the document to fit a banner would let the decoration
  set the measure for the content. The six rows are an ascender zone for `d`, `l` and the dot of
  the `i`, four rows of x-height, and a descender for the `p` — the lockup is lowercase everywhere
  else on the platform, and a 5-row block would set it in caps and render the wrong word.
  Glyphs are proportional, not monospaced. `i` is one column of ink and `d` is four, so a fixed
  cell width leaves the `i` with dead columns to its right and the word renders as `di leepadev`:
  two blank columns between `d` and `i`, four between `i` and `l`, from a table that looks regular
  in the source. Each glyph is exactly as wide as its ink and `GAP` is the only space between them,
  so every inter-letter gap is two columns by construction rather than by tuning each cell. The `/.` is a single glyph, because composing it from a slash and a full
  stop puts the inter-letter gap between them and it reads `/ .`.
  In the boot sequence the masthead wipes down one row per frame. A row is written once and never
  touched again, so the block builds itself in place — a left-to-right column fill would mean
  repainting all five rows every frame, which needs cursor-up and reintroduces everything the
  carriage-return-only rule exists to avoid.
- **The static rendering was reworked.** Section headings rule out to the right edge, so every
  section shares a column with the header panel and the colophon instead of trailing off ragged.
  The panel has rounded corners and now carries the name, role, location and an emerald status dot
  — it is the identity card rather than a box with a mark in it. The tool list is separated by
  middots and wrapped by item rather than by word, because word wrapping splits "Claude Code" and
  strands a bare middot at the start of the next line.
- **The footer says the site answers `curl`.** One dim mono line beside the copyright, in
  `components/ui/CurlHint.tsx`, that copies the command when clicked. It sits outside the footer's
  link row on purpose — that row is navigation, and this is not a seventh place to go.

### Changed - v2.0.0

- **The link-in-bio page moved from the footer to the Contact section.** `links.dileepa.dev` was
  a row in the footer's Elsewhere column; Projects now occupies that slot, and the link sits
  beside the contact address instead — which is where a reader is already looking for a way
  through. Deliberately not `--brand`: the email above it is that surface's single accent, and a
  second emerald link beside it is exactly the scattering the brand guide rules out. It takes the
  muted body colour and the external arrow every outbound link on the site already gets.
- **The layout reference is implemented, not approximated.** The 760px measure, the floating nav
  pill, the section rhythm, the entry and item grids, the subsection rule and the footer are
  reproduced in `app/globals.css` against the semantic tokens — because "the same layout" is a
  thing that has to keep being true after the next edit. Two deliberate departures, both from
  `design-system.md` §2: the reference's `<style>` block carries v1.0 tokens and a second accent
  hue, and it uses font weights 600 and 800.
- **The homepage is the site.** Everything is a section on it, in the reference's order: hero,
  about, work, education, community, contact. The index pages exist for the full lists.
- **The hero display heading is the tagline, not the name.** What someone does is the useful
  thing to read first; the name belongs beside the portrait, where it identifies the face.
- Section labels are words — "Work" — rather than `01 / work`. Numbering makes the page claim an
  order it does not have and breaks the moment a section is added in the middle.
- **`/sessions` is `/events` again.** The v2.0.0 branch briefly renamed the resource; `/events`
  was already the published URL and the rename bought nothing. `/sessions` redirects, for links
  shared from a preview deployment.
- **Configuration is split by environment** — `.env.development` and `.env.production`, each
  complete on its own, matching how `api-dileepa-dev` splits its. There is deliberately **no
  `.env.local`**: it would override both and reintroduce the "which file won?" question the split
  exists to answer.
- Brand tokens are imported through Tailwind 4 `@theme`; Manrope and JetBrains Mono load through
  `next/font` at weights 400, 500 and 700 only. No hard-coded hex in any component.
- Post bodies are read recursively. Posts are grouped `posts/<year>/<month>/<slug>.md`,
  and the Git trees API with `recursive=1` reads the whole tree in one request rather than one
  per month. The response's `truncated` flag is checked rather than assumed — a silently short
  list looks exactly like posts having been deleted.
- Markdown images render as a plain `<img>` rather than through `next/image`. Posts embed images
  by absolute URL from whatever host they are on, and `next/image` accepts only the hosts in
  `next.config.ts`, which is Cloudinary and nothing else. Routing them through it would make a
  post fail the build for citing a screenshot from someone else's documentation.

### Fixed - v2.0.0

- **`NEXT_PUBLIC_API_URL` was used verbatim, so two near-invisible dotenv mistakes would have
  broken every request.** A trailing slash builds `https://api.dileepa.dev//projects`, which the
  API 404s rather than collapsing — the site would render as though every collection were empty,
  with nothing in the console to say otherwise. And because this value is inlined into the browser
  bundle, an `http://` host is not merely a plaintext hop but mixed content on an HTTPS page,
  which browsers block outright: every client-side fetch on the blog — views, reactions, comments
  — would fail with no request sent. `normalizeApiUrl` in `lib/api.ts` strips trailing slashes and
  upgrades remote `http://` to `https://`, leaving `localhost` alone where plaintext is correct.
  The committed values were already right; this makes them not have to be.

- **A collection response is checked before it is unwrapped.** v1 returned a bare array from its
  collection endpoints, and reading `.items` off one yields `undefined` — with the crash landing
  wherever the caller first maps over it, which is a stack trace pointing at a page component for
  a problem two layers away. A wrong `NEXT_PUBLIC_API_URL` now produces an `ApiError` naming the
  endpoint and the likely cause.

- **The two same-site slug redirects are implemented.** Both posts were renamed after
  publication and both old slugs were live long enough to be shared, so
  `2026-08-06-zero-to-agent-microsoft-foundry-series-kickoff` and `2026-02-11-welcome` now
  redirect to their current slugs. The first lived in the blog's deleted `astro.config.mjs` and
  would have gone with it. Both were driven in a browser and return a single hop.
- **`rel=canonical` is composed rather than trusted.** The canonical tag, the Open Graph url, the
  `BlogPosting` JSON-LD, the RSS feed and the sitemap each read `post.canonicalUrl` and fell back
  to a composed URL — five copies of the same expression. That field is stored, and a row written
  before the v2.0.0 URL rewrite still names `blog.dileepa.dev`, a host that is retired rather than
  redirected: a canonical pointing at it asks search engines to prefer a dead URL over the live
  one. `lib/format.ts`'s `postUrl` honours a stored value only when it is already on this origin,
  so the tag is correct whether or not the production rewrite has run.
- **JSON-LD is escaped before it is embedded.** Both structured-data blocks went into the page
  through `JSON.stringify` and `dangerouslySetInnerHTML`. `JSON.stringify` does not escape `<`, so
  a `</script>` anywhere in a title, summary or speaker name would close the tag and let the rest
  parse as HTML. Those fields are admin-written today, which is why this is hardening rather than
  a fix, but the escape belongs in place before one of them is sourced from somewhere else.

- **Every blog post 404'd in a production build while `/blog` listed all eighteen.** Post bodies
  are read from `blog-dileepa-dev` at `BLOG_CONTENT_REF` under `posts/`, and that directory only
  existed on the blog repo's `feat/v2.0.0` branch — on `main` the posts were still Astro content
  at `src/content/posts/*.mdx`. The tree filter matched zero files, `getPostContent` returned
  `null` for every slug, and each post page fell through to `notFound()`. Because post *metadata*
  comes from the API rather than from Git, the index was unaffected, which is what made it look
  like a rendering bug rather than a configuration one. The content move is now on the blog
  repo's `main`.
- **An empty post set now fails the build.** `lib/content.ts` treated zero files as an empty blog
  and carried on, so the failure above shipped as eighteen prerendered 404 pages and a green
  build. It raises an error naming the repository, the ref and the posts directory instead, and
  logs the source and post count on a successful load.
- **`/blog/[slug]` closes `dynamicParams`.** A body cannot be fetched for a slug that was not in
  the set at build time, so an unknown slug cost a live API call and a content lookup before
  404ing — and Next served that 404 as a client-rendered shell with an empty `<body>`. The router
  now rejects the slug and `not-found.tsx` renders on the server.
- **404 pages sit beside the routes that raise them.** `app/blog/[slug]`, `app/projects/[slug]`
  and `app/events/[slug]` each have a `not-found.tsx` naming what is missing, sharing one
  `NotFoundPage` component with the root one so four copies cannot drift.

### Removed - v2.0.0

- **`X-Powered-By: Next.js`** — named the framework on every response, and nothing read it.
- **Blog banners.** Posts carry no image of their own; anything a post shows is an ordinary
  Markdown image in the body. Photographs appear in exactly two places on this site — the hero
  portrait and the event gallery — and keeping that budget small is what makes a page of
  photographs read as a deliberate section rather than decoration.
- **Video thumbnails.** `/videos` lists titles and dates and links out. A wall of YouTube
  thumbnails is neither of the two permitted places, and those images are not on an allowed host.

## [v1.3.0] - 2026-03-03

### Added - v1.3.0

- Redesigned personal website **from the ground up** with a stronger visual identity.
- Initialized base project with **Next.js 16**.
- Implemented API-driven content fetching.
- Developed comprehensive key sections: `Navbar`, `Hero`, `About`, `Experience`, `Education`, `Community` (Communities, Events, Video Content, Blog Content), `Connect`, and `Footer`.
- Created dedicated pages: `Home`, `404`, `Communities`, `Events`, `Videos`, and `Blog`.
- Defined and applied a consistent **design system** (spacing, typography, colors).
- Enhanced UI with subtle, performance-friendly animations and micro-interactions.
- Integrated analytics and monitoring suite:
  - **Vercel Web Analytics**
  - **Vercel Speed Insights**
  - **Microsoft Clarity**
  - **Google Analytics**

### Changed - v1.3.0

- Refactored component architecture for better reusability and maintainability.
- Improved visual hierarchy and content readability.
- Optimized responsiveness across all screen sizes.
- Enhanced accessibility with better contrast, focus states, and semantic markup.
- Ensured full parity between **dark** and **light** modes.
- Validated and optimized SEO metadata and social sharing previews.

### Removed - v1.3.0

- Cleaned up unused styles, components, and assets.

## [v1.2.0] - 2026-01-15

### Added - v1.2.0

- Initialized base project using **Next.js 15**.
- Implemented core layout sections: `Navbar`, `Hero`, `About`, `Experience`, `Education`, `Community`, `Connect`, and `Footer`.
- Added API data fetching for dynamic section content.
- Integrated contact form with **email configuration** via Resend.
- Added SEO metadata for improved search visibility.
- Introduced analytics and performance tools:
  - **Vercel Web Analytics**
  - **Vercel Speed Insights**
  - **Microsoft Clarity**
  - **Google Analytics**

### Changed - v1.2.0

- Refactored routing logic to use a **single-page scrollable layout**.
- Updated the **navbar** to support in-page scroll instead of navigation between routes.
- Redesigned **header** and **footer** for improved aesthetics and accessibility.
- Standardized and refined **theme styling** for consistency across components.
- Applied accessibility improvements and layout responsiveness across screen sizes.

### Fixed - v1.2.0

- Resolved layout issues related to **padding and margins** in multiple sections.
- Ensured compatibility and readability in both **dark** and **light** modes.
- chore: Upgrade to 1.1.1 - package.json
- Add Experience Page - Career Break & RSL
- Add Education Page - Postgraduate Education
- Add Media Page - Missing event details
- Add missing achievements
- Add MLSC - NIBM

## [v1.1.0] - 2026-01-15

### Added - v1.1.0

- New font to Inter
- Add pageHeaderTheme

### Changed - v1.1.0

- Update dependencies
  - version [1.0.1 -> 1.1.0]
  - next [13.5.4 -> 14.1.4]
  - react-icons [4.11.0 -> 5.0.1]
  - react-toastify [9.1.3 -> 10.0.5]
  - resend [2.0.0 -> 3.2.0]
  - next-themes [0.2.1 -> 0.3.0]
  - @vercel/analytics [1.1.1 -> 1.2.2]
  - autoprefixer [10 -> 10.0.1]
  - eslint-config-next [13.5.4 -> 14.1.4]
  - tailwindcss [3 -> 3.3.0]
- Update header and footer
- Update home page
- Update experience pag
  - Add Projects section
  - Add Tools & Technologies section
  - Update latest experience data
  - Add new 4 sections
  - Update theme details & ItemCards
  - Update interface & links
- Update about page
- Update about cards
- Add achievements section
- Add section for LinkedIn recommendations
- Update education page
  - Add new cards and layout design
- Update media page
  - Add event highlights
  - Remove banner and log details
- Update connect page
  - Change section layout format
- Update documents
  - Update README.md
  - Remove extra inputs from ISSUE_TEMPLATE/feature_request.md

### Fixed - v1.1.0

- Replace unsupported links
- Experience page missing items
  - Fix WingzDev dates
  - Add missing tools & technologies
  - Fix broken links in communities

## [v1.0.0] - 2026-01-14

### Added - v1.0.0

- Initial production release of the personal website (`v1.0.0`).
- Core layout components: Navigation Bar, Main Body layout, Footer, and Theme Switcher (light/dark mode).
- Primary website sections: Home, About, Education, Experience, Media, and Connect.
- Responsive design across devices and browsers.
- Optimizations for performance, accessibility, and loading speed.

<!-- e.g., -->
<!-- Unreleased -->
<!-- v2.0.0 -->
<!-- v1.1.0 -->
<!-- v1.0.0 -->
<!-- v0.0.1 -->

[Unreleased]: https://github.com/dileepadev/dileepa-dev/branches
[v2.0.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v2.0.0
[v1.3.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v1.3.0
[v1.2.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v1.2.0
[v1.1.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v1.1.0
[v1.0.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v1.0.0
