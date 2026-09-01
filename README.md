# dileepa.dev

Welcome to my personal website project, hosted at [dileepa.dev](https://dileepa.dev/). This site showcases my portfolio, shares information about me, and serves as a platform for my thoughts, work, and experiences.

## Table of Contents

- [dileepa.dev](#dileepadev)
  - [Table of Contents](#table-of-contents)
  - [Tools and Technologies](#tools-and-technologies)
  - [Sections](#sections)
    - [Blog posts](#blog-posts)
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
- **Markdown:** [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) with
  [remark-gfm](https://github.com/remarkjs/remark-gfm) and
  [rehype](https://github.com/rehypejs/rehype), highlighted at build time by
  [Shiki](https://shiki.style/)
- **Notifications:** [react-hot-toast](https://react-hot-toast.com/)

## Sections

- **Hero:** Introduction and call to action.
- **About:** General profile information and biography.
- **Work:** Roles, the tools behind them, and open-source projects.
- **Education:** Academic background and qualifications.
- **Community:**
  - **Communities:** Tech communities I am part of.
  - **Events:** Events I have attended or spoken at.
  - **Videos:** Walkthroughs and talks, each with a short description, linking out to YouTube.
  - **Blog:** Articles and thoughts on technology.
- **Connect:** Social media links and contact information.

### Blog posts

Post pages are static - built from the API's metadata index and the Markdown in
[`blog-dileepa-dev`](https://github.com/dileepadev/blog-dileepa-dev), read from Git at build time
against a **pinned commit SHA** (`BLOG_CONTENT_REF`). Publishing therefore takes two steps: merge
the post in the blog repo, then bump that ref here and rebuild.

Three things on a post are not static, and are fetched in the browser instead:

- **Reactions** - four of them (liked, insightful, useful, learned), one per reader, changeable by
  pressing the same one again. Rendered as emoji rather than a custom icon set, deliberately: the
  brand guide allows one accent hue and no second, and emoji carry colour as *content* without
  entering the palette.
- **Views** - counted once per reader per 24 hours. The de-duplication is the API's, not the
  browser's; the client guard only avoids a request already known to be a no-op.
- **Comments** - one level of replies, each comment and reply carrying the same four reactions.
  Comments go live the moment they are posted.

React, Comment and Share sit in one action bar under the article, with the counts summarised above
it. If the API is unreachable the counts and the React button do not render - but **Share still
does**, because it needs nothing from the API.

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

The masthead is the wordmark drawn large in block characters by
[`lib/wordmark.ts`](lib/wordmark.ts), and the brand rule survives the change of scale: the wordmark
takes the neutral foreground, the `/.` takes emerald, and the two never swap - which is why
`renderWordmark` returns the two halves separately rather than one joined string. The font is
hand-built on a 6-row body at proportional widths rather than borrowed from ANSI Shadow, for two
reasons. Its 8-to-9-column glyphs put "dileepadev" past 75 columns before the mark, and widening
the document to fit a banner would be letting the decoration set the measure for the content. And
it is an uppercase font: the six rows here are an ascender zone for `d`, `l` and the dot of the
`i`, four rows of x-height, and a descender for the `p`, because the lockup is lowercase everywhere
else on the platform and setting it in caps would render the wrong word.

Glyphs are proportional rather than monospaced, and that is load-bearing. `i` is one column of ink
and `d` is four, so padding both into a fixed cell leaves the `i` with dead columns on its right
and the word renders as `di leepadev` - two blank columns between `d` and `i`, four between `i` and
`l`, from a glyph table that looks perfectly regular in the source. Each glyph is now exactly as
wide as its own ink and `GAP` is the only space between letters, so all nine inter-letter gaps are
two columns by construction. The `/.` is one glyph rather than two,
because composing it from a slash and a full stop puts the inter-letter gap between them and it
reads `/ .` - one of the six conflicts the brand repo calls out in the reference HTML.

The content is composed in [`lib/terminal.ts`](lib/terminal.ts) from the same `api.*` calls the
homepage uses, through the same data cache - there is no second copy of the profile to keep in
sync. [`lib/ansi.ts`](lib/ansi.ts) holds the colour and the fixed-width layout, and keeps the one
brand rule that survives the trip: emerald is the only accent, at the Emerald Bright stop, because
a terminal is a dark surface and its background cannot be detected over HTTP.

| URL | What it does |
| --- | --- |
| `/` with a terminal User-Agent | The profile, as `text/plain` with ANSI colour |
| `/terminal` | The same, at a stable address, for any client |
| `?static` | Skips the boot sequence. Also `?fast`, `?now`, `?nointro` |
| `?nocolor` | Drops every escape code, and implies `?static`. Also `?plain`, `?raw` |
| `?intro` | Forces the boot sequence on. Also `?boot`, `?animate` |
| `?terminal` | Forces the terminal rendering in a browser |
| `?html` | Forces the website in a terminal. Also `?browser`, `?web` |

Quote the query string in a shell - `?` is a glob character:

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
