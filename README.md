# dileepa.dev

Welcome to my personal website project, hosted at [dileepa.dev](https://dileepa.dev/). This site showcases my portfolio, shares information about me, and serves as a platform for my thoughts, work, and experiences.

## Table of Contents

- [dileepa.dev](#dileepadev)
  - [Table of Contents](#table-of-contents)
  - [Tools and Technologies](#tools-and-technologies)
  - [Captured Media](#captured-media)
  - [Sections](#sections)
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
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Theming:** [Next Themes](https://github.com/pacocoursey/next-themes)
- **Deployment:** [Vercel](https://vercel.com/)
- **Analytics:**
  - [Vercel Analytics](https://vercel.com/analytics)
  - [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
  - [Google Analytics](https://analytics.google.com/)
  - [Microsoft Clarity](https://clarity.microsoft.com/)
- **Image Optimization:** [Next.js Image](https://nextjs.org/docs/api-reference/next/image)
- **API Communication:** [api.dileepa.dev](https://api.dileepa.dev/)
- **Icons:** [React Icons](https://react-icons.github.io/react-icons)

## Captured Media

![Dileepa Bandara](https://dileepadev.github.io/images/dileepa-dev/preview-1.3.0.png)

## Sections

- **Hero:** Introduction and call to action.
- **About:** General profile information and biography.
- **Experience:** Professional journey, skills, and technologies.
- **Education:** Academic background and qualifications.
- **Community:**
  - **Communities:** Tech communities I am part of.
  - **Events:** Events I have attended or spoken at.
  - **Videos:** Walkthroughs and talks, each with a short description, linking out to YouTube.
  - **Blog:** Articles and thoughts on technology.
- **Connect:** Social media links and contact information.

### Blog posts

Post pages are static — built from the API's metadata index and the Markdown in
[`blog-dileepa-dev`](https://github.com/dileepadev/blog-dileepa-dev), read from Git at build time.
Three things on a post are not static, and are fetched in the browser instead:

- **Reactions** — four of them (liked, insightful, useful, learned), one per reader, changeable by
  pressing the same one again. Rendered as emoji rather than a custom icon set, deliberately: the
  brand guide allows one accent hue and no second, and emoji carry colour as *content* without
  entering the palette.
- **Views** — counted once per reader per 24 hours. The de-duplication is the API's, not the
  browser's; the client guard only avoids a request already known to be a no-op.
- **Comments** — one level of replies, each comment and reply carrying the same four reactions.
  Comments go live the moment they are posted.

React, Comment and Share sit in one action bar under the article, with the counts summarised above
it. If the API is unreachable the counts and the React button do not render — but **Share still
does**, because it needs nothing from the API.

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

   Each file is complete on its own — there is no shared base file and no
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
