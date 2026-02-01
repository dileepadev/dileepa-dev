# Changelog

All notable changes to this project are documented in this file.

Changes are organized into the following categories:

- **Added:** New features or functionality introduced to the project.
- **Changed:** Modifications to existing functionality that do not add new features.
- **Fixed:** Bug fixes that resolve issues or correct unintended behavior.
- **Removed:** Features or components that have been removed from the project.

## [Unreleased]

- Changes for the next release are available in development branches.

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
[v1.0.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v1.0.0
[v1.1.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v1.1.0
[v1.2.0]: https://github.com/dileepadev/dileepa-dev/releases/tag/v1.2.0
