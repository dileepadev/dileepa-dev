# dileepa.dev

Welcome to my personal website project, hosted at [dileepa.dev](https://dileepa.dev/). This site showcases my portfolio, shares information about me, and serves as a platform for my thoughts, work, and experiences.

## Table of Contents

- [dileepa.dev](#dileepadev)
  - [Table of Contents](#table-of-contents)
  - [Tools and Technologies](#tools-and-technologies)
  - [Design system](#design-system)
  - [Pages](#pages)
    - [Blog posts](#blog-posts)
    - [Keeping pages fresh](#keeping-pages-fresh)
  - [The terminal rendering](#the-terminal-rendering)
    - [The boot sequence](#the-boot-sequence)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Deployment on Vercel](#deployment-on-vercel)
  - [Branches](#branches)
  - [Versioning](#versioning)
  - [Contributing](#contributing)
  - [Issues](#issues)
  - [Security](#security)
  - [License](#license)
  - [Contact](#contact)

## Tools and Technologies

- **Framework:** [Next.js 16](https://nextjs.org/)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Package Manager:** [npm](https://www.npmjs.com/)
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/), against the vendored brand token sheet
- **Theming:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Deployment:** [Vercel](https://vercel.com/)
- **Analytics:**
  - [Vercel Analytics](https://vercel.com/analytics)
  - [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
  - [Google Analytics](https://analytics.google.com/)
  - [Microsoft Clarity](https://clarity.microsoft.com/)
- **Image Optimization:** [Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)
- **API Communication:** [api.dileepa.dev](https://api.dileepa.dev/)
- **Icons:** [Lucide](https://lucide.dev/) for interface icons; hand-authored inline SVG for
  brand and social marks
- **Markdown:** [@mdx-js/mdx](https://mdxjs.com/) with
  [remark-gfm](https://github.com/remarkjs/remark-gfm) and
  [rehype](https://github.com/rehypejs/rehype), highlighted by [Shiki](https://shiki.style/) and
  compiled once per post (the compiled result is cached by a hash of the source)
- **Notifications:** [react-hot-toast](https://react-hot-toast.com/)

## Design system

The site follows **design system v2.1.0**, which it was designed on first. The written system -
the brand guide, the design system and the canonical token sheet - lives in
[`dileepadev`](https://github.com/dileepadev/dileepadev), and copies sit in [`docs/`](docs).
[`app/brand-tokens.css`](app/brand-tokens.css) is a vendored copy of that token sheet; re-copy it
from the source rather than editing it here. The live reference is [`/brand`](https://dileepa.dev/brand).

- **Black and white, no hue.** The accent is the text colour; green appears only as the success
  state, such as a copy tick.
- **The logo is `@dileepadev`** - the `@` one step muted, the wordmark at full contrast.
- **Manrope and JetBrains Mono**, type set by role, nothing smaller than 13px.
- **A profile rail and panels** from 1024px, and a floating nav below it.

## Pages

- **Home:** the hero (with the newest post, talk and video), About and Contact.
- **Work** and **Education:** roles and courses, newest first by date.
- **Projects, Blog, Events, Communities:** searchable, filterable index pages and detail pages.
- **Videos:** walkthroughs and talks, each with its thumbnail, length and description, linking out
  to YouTube.
- **Gallery:** event photographs.
- **Profile:** a speaker profile and media kit - bios, photos and contact details for organisers.
- **Brand:** the design system as it is built, from the tokens.

### Blog posts

Post pages are static - built from the API's metadata index and the Markdown in
[`blog-dileepa-dev`](https://github.com/dileepadev/blog-dileepa-dev), read from Git at build time
against a **pinned commit SHA** (`BLOG_CONTENT_REF`). Publishing therefore takes two steps: merge
the post in the blog repo, then bump that ref here and rebuild.

Three things on a post are not static, and are fetched in the browser instead:

- **Reactions** - four of them (liked, insightful, useful, learned), one per reader, changeable by
  pressing the same one again. Rendered as emoji rather than a custom icon set, deliberately: the
  palette has no hue, and emoji carry colour as *content* without entering it.
- **Views** - counted once per reader per 24 hours. The de-duplication is the API's, not the
  browser's; the client guard only avoids a request already known to be a no-op.
- **Comments** - one level of replies, each comment and reply carrying the same four reactions.
  Comments go live the moment they are posted.

React, Comment and Share sit in one action bar under the article, with the counts summarised above
it. If the API is unreachable the counts and the React button do not render - but **Share still
does**, because it needs nothing from the API.

### Keeping pages fresh

Pages regenerate on a day-long window, which keeps rendering inside the Vercel Hobby allowance.
To show an edit straight away, purge pages on demand:

```bash
curl -X POST https://dileepa.dev/api/revalidate \
  -H "Authorization: Bearer $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/blog"]}'
```

With no body it purges every page. `REVALIDATE_SECRET` is server-only; without it the endpoint is
off. If the API is down while a page regenerates, the last good page keeps being served.

## The terminal rendering

The site answers a terminal as well as a browser:

```bash
curl -L dileepa.dev
```

`-L` is required, and not for style. `curl dileepa.dev` resolves to `http://dileepa.dev`, and
Vercel answers plaintext HTTP on a custom domain with a `308` to the HTTPS origin - at the edge,
before any code in this repository runs. curl does not follow redirects unless asked, so the bare
command prints Vercel's `Redirecting...` body. Typing the scheme works just as well and needs no
flag:

```bash
curl https://dileepa.dev
```

**How it routes.** [`proxy.ts`](proxy.ts) matches `/` and nothing else. It reads the User-Agent,
and rewrites known terminal clients - curl, wget, HTTPie, xh, PowerShell - to
[`app/terminal/route.ts`](app/terminal/route.ts), which serves `text/plain`. Browsers and crawlers
fall through untouched to the prerendered homepage, so what a browser and a search engine get is
byte-for-byte what they got before the feature existed. HTTP libraries such as `python-requests`
are deliberately *not* matched: they are scripts rather than a person at a prompt, and serving them
a different body than a browser gets is indistinguishable from cloaking.

The masthead is a portrait beside a `neofetch`-style panel - name, role, location, work, links.
The portrait is the site's photo drawn in quadrant-block characters on the 256-colour grey ramp,
with the studio backdrop cut out so it sits on the reader's own terminal background. It is built
once by [`scripts/portrait-ascii.mjs`](scripts/portrait-ascii.mjs) into
[`lib/portrait-ascii.ts`](lib/portrait-ascii.ts) and committed, rather than computed per request;
run the script again when the photo changes. `?nocolor` shades the same picture in plain
characters.

The content is composed in [`lib/terminal.ts`](lib/terminal.ts) from the same `api.*` calls the
homepage uses, through the same data cache - there is no second copy of the profile to keep in
sync. [`lib/ansi.ts`](lib/ansi.ts) holds the colour, the fixed-width layout and the links (OSC 8, where
the terminal supports them), and keeps the brand rule across the trip: the palette is black and
white, so the accent is weight - bold in the terminal's own foreground, legible on a dark or a
light terminal, since its background cannot be detected over HTTP.

| URL | What it does |
| --- | --- |
| `/` with a terminal User-Agent | The profile, as `text/plain` with ANSI colour |
| `/terminal` | The same, at a stable address, for any client |
| `?static` | Skips the boot sequence. Also `?fast`, `?now`, `?nointro` |
| `?nocolor` | Drops every escape code, and implies `?static`. Also `?plain`, `?raw` |
| `?intro` | Forces the boot sequence on. Also `?boot`, `?animate` |
| `?terminal` | Forces the terminal rendering in a browser |
| `?html` | Forces the website in a terminal. Also `?browser`, `?web` |

The flags work on `/` as well as `/terminal`: `proxy.ts` carries the query across its rewrite in
a request header, because on Vercel the route behind a rewrite does not see it. Quote the query
string in a shell - `?` is a glob character:

```bash
curl -L "dileepa.dev?nocolor"
```

### The boot sequence

`curl -L dileepa.dev` plays a boot sequence before the profile. A normal response arrives as one
body and prints at once; this one arrives as a chunked stream with pauses between the chunks, and
curl prints bytes as they land rather than waiting for the end - so the pauses become timing, and
the timing becomes animation. The masthead wipes down a row at a time, four boot steps spin and resolve, a bar
fills, and it settles into the same document the static route serves. About three seconds,
then it exits 0.

To skip it:

```bash
curl -L "dileepa.dev?static"
```

**The one thing to know before scripting against this.** The server cannot tell whether the
reader's `stdout` is a terminal or a file - curl answers `isatty` locally and sends nothing about
it, so `curl -L dileepa.dev > profile.txt` looks identical on the wire to a person watching their
screen, and the animation lands in the file. Playing by default trades that case for the common
one. Anything that pipes, saves or parses should pass `?static`, or `?nocolor`, which implies it:

```bash
curl -L "dileepa.dev?nocolor" > profile.txt
```

Two further constraints shaped it:

- **It terminates.** The obvious reference point loops until Ctrl+C, which is fine for a novelty
  and wrong for a profile: a command that never exits cannot go in a script or a README without a
  caveat. The frame budget is in `TIMING` in [`lib/terminal-intro.ts`](lib/terminal-intro.ts), with
  the arithmetic written out - the numbers multiply, and it is easy to write a sequence that reads
  as "a moment" and runs for ten seconds.
- **Only a terminal gets it.** A browser pointed at `/terminal` gets the document immediately. It
  cannot render a carriage-return redraw, so streaming one at it spends two and a half seconds
  making the page worse. [`lib/terminal-client.ts`](lib/terminal-client.ts) answers that question
  for both the route and the proxy, so the two can never disagree about what a terminal is.

Redraws use carriage returns rather than cursor-up sequences, so a redraw can only ever overwrite
the line it is on - a cursor-up redraw lands mid-line and eats earlier output once the reader's
window is narrower than the line. `?nocolor` skips the frames and prints just the resolved steps,
because a redraw with no cursor control is not an animation, it is sixty lines of spinner in a
file.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/) or [Bun](https://bun.sh/)

### Installation

To get a copy of this project up and running on your local machine, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/dileepadev/dileepa-dev.git
   ```

2. Navigate to the project directory:

    ```bash
    cd dileepa-dev
    ```

3. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   # or
   npx next dev
   ```

   Note: The `next dev --turbopack` command can be used to start the development server with Turbopack. Click [here link](https://nextjs.org/docs/app/api-reference/turbopack) for more information.

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. To change the port, use the `-p` flag. For example, `npm run dev -- -p 4000`.

   Note: The `--` flag is required to pass arguments like `-p` to the development server script.

   ```bash
   npm run dev -- -p 4000
   # or
   yarn dev -- -p 4000
   # or
   pnpm dev -- -p 4000
   # or
   bun dev -- -p 4000
   # or
   npx next dev -- -p 4000
   ```

6. You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

7. Copy the environment template for the mode you are running and fill it in:

   ```bash
   cp .env.development.example .env.development   # what `next dev` loads
   cp .env.production.example .env.production     # what `next build`/`next start` load
   ```

   Each file is complete on its own - there is no shared base file and no
   `.env.local` override, so the value you read in a file is the value in
   effect. Both are gitignored; only the `*.example` templates are committed.
   Two variables are optional and server-only: `YOUTUBE_API_KEY` (video lengths on `/videos`)
   and `REVALIDATE_SECRET` (on-demand revalidation).

## Deployment on Vercel

- This website is hosted on [Vercel](https://vercel.com/), a cloud platform for static sites and Serverless Functions.
- Any changes pushed to the `main` branch will be automatically deployed to [dileepa.dev](https://dileepa.dev/).
- Any changes pushed to the `dev` branch will be automatically deployed to [preview.dileepa.dev](https://preview.dileepa.dev/).

## Branches

- Branches are an important part of this project. They are used to develop new features, fix bugs, and make changes to the source code. The following branches are used in this project:

  - `main` - The source code for the latest stable and production-ready release of the website.
  - `dev` - New features and bug fixes that are being worked on but not yet ready for production. Only for preview upcoming changes.
  - `feat/*` - Branches used to develop new features.
  - `fix/*` - Branches used to fix bugs.
  - ... and more.

- Check out the [branch naming guidelines](BRANCH_NAMING_GUIDELINES.md) for more information.

## Versioning

This project follows a versioning pattern similar to [Semantic Versioning](https://semver.org/) (SemVer) for managing releases. For detailed versioning information, see the [VERSIONING.md](VERSIONING.md) file.

## Contributing

Contributions are welcome! Please read the following before contributing:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [BRANCH_NAMING_GUIDELINES.md](BRANCH_NAMING_GUIDELINES.md)
- [COMMIT_MESSAGE_GUIDELINES.md](COMMIT_MESSAGE_GUIDELINES.md)
- [PULL_REQUEST_GUIDELINES.md](PULL_REQUEST_GUIDELINES.md)

## Issues

For any issues or feature requests, please use the [issue templates](.github/ISSUE_TEMPLATE) provided in the repository. You can also check the [CHANGELOG.md](CHANGELOG.md) for updates and changes.

## Security

If you discover any security vulnerabilities, please report them as described in [SECURITY.md](SECURITY.md).

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.

## Contact

For any inquiries or feedback, please reach out to me via [email](mailto:contact@dileepa.dev) or through my [website](https://dileepa.dev).
