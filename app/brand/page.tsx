import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Search,
  Send,
  Share2,
  X,
  XCircle,
} from "lucide-react";
import {
  Container,
  PagePath,
  Section,
  SectionHeading,
  Subsection,
  Lockup,
  Button,
  LinkButton,
  Badge,
  Chip,
  StatusBadge,
  buttonClasses,
} from "@/components/ui";
import { api, getGallery } from "@/lib/api";
import { PAGES, SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";
import { portrait as getPortraitUrl } from "@/lib/format";
import {
  ColorSwatch,
  CopySnippetButton,
  SocialCardPreview,
} from "./_components/BrandInteractive";
import { IconCatalog, INTERFACE_ICON_COUNT } from "./_components/IconCatalog";
import { RailContents } from "@/components/providers/RailContents";
import type { Heading } from "@/lib/mdx";

/**
 * The page's contents, shown in the profile rail on a wide screen. Short
 * labels rather than the section titles: a contents list is scanned, and
 * "Favicons, Open Graph, and metadata" does not scan.
 */
const CONTENTS: Heading[] = [
  { depth: 2, id: "mark", text: "Mark and lockup" },
  { depth: 2, id: "colors", text: "Color" },
  { depth: 2, id: "typography", text: "Typography" },
  { depth: 2, id: "portrait", text: "Portrait and media" },
  { depth: 2, id: "metadata", text: "Metadata and assets" },
  { depth: 2, id: "components", text: "UI components" },
  { depth: 2, id: "icons", text: "Icons" },
  { depth: 2, id: "voice", text: "Voice and copy" },
  { depth: 2, id: "tokens", text: "Tokens" },
];

export const metadata: Metadata = pageMetadata({
  title: PAGES.brand.meta.title,
  description: PAGES.brand.meta.description,
  path: "/brand",
});

// A day, matching `REVALIDATE` in `lib/api.ts`. See the note beside that
// constant for why the number is arithmetic against the CPU allowance
// rather than a judgement about freshness.
export const revalidate = 86400;

const FAVICONS = [
  {
    label: "Browser tab (default)",
    dimensions: "16 × 16 px",
    filename: "favicon-16x16.png",
    src: "/favicon-16x16.png",
    size: 16,
    target: "Standard browser tab icon for Chrome, Safari, and Edge.",
  },
  {
    label: "Browser tab (retina)",
    dimensions: "32 × 32 px",
    filename: "favicon-32x32.png",
    src: "/favicon-32x32.png",
    size: 32,
    target: "High-DPI retina display browser tabs.",
  },
  {
    label: "Desktop shortcut",
    dimensions: "96 × 96 px",
    filename: "favicon-96x96.png",
    src: "/favicon-96x96.png",
    size: 96,
    target: "OS desktop bookmark shortcut and browser favorites.",
  },
  {
    label: "Apple touch icon",
    dimensions: "180 × 180 px",
    filename: "apple-icon-180x180.png",
    src: "/apple-icon-180x180.png",
    size: 180,
    target: "iOS home screen web clip on iPhone and iPad.",
  },
  {
    label: "Android PWA icon",
    dimensions: "192 × 192 px",
    filename: "android-icon-192x192.png",
    src: "/android-icon-192x192.png",
    size: 192,
    target: "Android Chrome home screen and progressive web app install.",
  },
  {
    label: "PWA splash & maskable",
    dimensions: "512 × 512 px",
    filename: "android-icon-512x512.png",
    src: "/android-icon-512x512.png",
    size: 512,
    target: "PWA splash screen launch icon and adaptive maskable icon.",
  },
  {
    label: "Legacy ICO",
    dimensions: "Multi-size",
    filename: "favicon.ico",
    src: "/favicon.ico",
    size: 32,
    target: "Root fallback for legacy browsers and web crawlers.",
  },
];

const METADATA_ENDPOINTS = [
  {
    path: "/manifest.json",
    type: "Web manifest",
    description:
      "PWA configuration declaring application name, standalone display mode, and icon manifest.",
  },
  {
    path: "/browserconfig.xml",
    type: "Windows tile",
    description:
      "Windows 8/10/11 Start screen pin tiles and brand accent configuration.",
  },
  {
    path: "/sitemap.xml",
    type: "XML sitemap",
    description:
      "Machine-readable index of all static pages, articles, projects, and events with lastmod timestamps.",
  },
  {
    path: "/robots.txt",
    type: "Robots",
    description:
      "Search crawler directives permitting indexation and declaring sitemap location.",
  },
  {
    path: "/llms.txt",
    type: "AI context index",
    description:
      "The site in the llmstxt.org format for AI assistants: who he is, every section, and the latest posts, projects and talks - rebuilt daily from the API.",
  },
  {
    path: "/llms-full.txt",
    type: "AI context index, in full",
    description:
      "Everything llms.txt lists, in full: every post, talk, project, video and community, with the work history and education.",
  },
  {
    path: "/blog/rss.xml",
    type: "RSS 2.0 feed",
    description:
      "Full-text syndication feed of published engineering articles for RSS readers.",
  },
];

const metadataSnippet = `export const metadata: Metadata = {
  // The origin this deployment is served from, not the site's identity: on a
  // preview, absolute URLs must resolve on the preview or every card points at
  // a different site and the og:image 404s.
  metadataBase: new URL(METADATA_ORIGIN),
  title: {
    default: "${SITE_CONFIG.title}",
    template: "%s · Dileepa Bandara",
  },
  // The long form. SITE_CONFIG.description is the short line the hero, the
  // footer and the terminal profile use; a search snippet gets ~155 characters
  // and Google writes its own when the supplied one is too thin.
  description: "${SITE_CONFIG.metaDescription}",
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/android-icon-512x512.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: METADATA_ORIGIN,
    title: "${SITE_CONFIG.title}",
    description: "${SITE_CONFIG.metaDescription}",
    siteName: "Dileepa Bandara",
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "${SITE_CONFIG.title}",
    description: "${SITE_CONFIG.metaDescription}",
    site: "@dileepadev",
    creator: "@dileepadev",
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png" }],
  },
};`;

// Every other route composes its tags through one helper rather than writing
// them out. Next merges metadata per key, not per field: a page that declares
// `openGraph` replaces the layout's outright, and a page that declares none
// inherits the homepage's whole card - so hand-written page metadata produces
// either a card with no image or the homepage's card under another page's URL.
const pageMetadataSnippet = `// lib/metadata.ts
export const metadata: Metadata = pageMetadata({
  title: PAGES.projects.meta.title,
  description: PAGES.projects.meta.description,
  path: "/projects",
});

// …and, for a record that carries its own card image and dates:
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await api.getBlog((await params).slug);
  return pageMetadata({
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.description,
    path: \`/blog/\${post.slug}\`,
    image: post.seo?.ogImage,     // falls back to /og.png
    type: "article",
    publishedTime: post.publishedDate,
    modifiedTime: post.updatedDate,
    tags: post.tags ?? [],
  });
}`;

type RadiusRole = {
  name: string;
  value: string;
  token: string;
  /** Classes for the specimen; omitted for the nested specimen. */
  specimen?: string;
  use: string;
};

/**
 * The corner radius scale (v2.1.0 draft), after Apple's shape system: three
 * kinds of corner, each specimen drawn at the size it is used at.
 */
const RADIUS_KINDS: { kind: string; rule: string; roles: RadiusRole[] }[] = [
  {
    kind: "Fixed",
    rule: "A constant radius, for containers and the marks inside them.",
    roles: [
      {
        name: "Panel",
        value: "32px",
        token: "--radius-panel",
        specimen: "h-24 w-full rounded-panel",
        use: "Page panels, the profile rail, the footer, the mobile menu.",
      },
      {
        name: "Tile",
        value: "22px",
        token: "--radius-tile",
        specimen: "h-24 w-full rounded-tile",
        use: "A card on a panel, a menu, a toast.",
      },
      {
        name: "Block",
        value: "12px",
        token: "--radius-block",
        specimen: "h-24 w-full rounded-block",
        use: "Media and blocks inside a card: images, code, icon wells.",
      },
      {
        name: "Inline",
        value: "6px",
        token: "--radius-inline",
        specimen: "h-6 w-14 rounded-inline",
        use: "Marks inside text: inline code, keys.",
      },
    ],
  },
  {
    kind: "Capsule",
    rule: "Half the height, for every control. An icon alone is a circle.",
    roles: [
      {
        name: "Capsule",
        value: "height ÷ 2",
        token: "--radius-pill",
        specimen: "h-10 w-3/4 rounded-full",
        use: "Buttons, icon buttons, selects, search, toggles, nav items, chips, badges.",
      },
      {
        name: "Field",
        value: "20px",
        token: "--radius-field",
        specimen: "h-20 w-full rounded-field",
        use: "Every text field. On one line it is a capsule; a textarea keeps the same ends as it grows.",
      },
    ],
  },
  {
    kind: "Concentric",
    rule: "The parent's radius less the inset, for anything nested tight inside another shape, so the two curves run parallel.",
    roles: [
      {
        name: "Row",
        value: "22 − 6 = 16px",
        token: "--radius-row",
        use: "A row inside a menu, 6px in from the menu's tile corner.",
      },
    ],
  },
];

export default async function BrandPage() {
  const [about, galleryPhotos] = await Promise.all([
    api.getAbout(),
    getGallery(4),
  ]);

  const portraitUrl = getPortraitUrl(about?.images) || "/profile/v2.webp";
  const transparentPortrait = "/profile/v2-transparent.png";
  const name = about?.name || SITE_CONFIG.name;
  const role = about?.title || "AI Engineer";

  const fullLockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 136 32" height="32" fill="none">
  <text x="0" y="24" font-family="Manrope, system-ui, sans-serif" font-size="20" font-weight="500" letter-spacing="-0.02em"><tspan fill="#8d8d8d">@</tspan><tspan fill="#f1f1f1">dileepadev</tspan></text>
</svg>`;

  const reducedMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <rect width="32" height="32" rx="6" fill="#0d0d0d" stroke="#1f1f1f" stroke-width="1" />
  <text x="16" y="22" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-size="20" font-weight="500" fill="#f1f1f1">@</text>
</svg>`;

  const cssTokensSnippet = `:root {
  /* Accent: the text colour itself (v2.1.0 draft) */
  --brand: var(--ink-100);   /* on Carbon, 18.0:1 */
  /* light theme: --brand: var(--paper-900), 17.3:1 on Paper */

  /* Dark foundation */
  --carbon: #050505;
  --ink-900: #050505;
  --ink-800: #0d0d0d;
  --ink-700: #141414;
  --ink-600: #1f1f1f;
  --ink-500: #2e2e2e;
  --ink-400: #8d8d8d;
  --ink-100: #f1f1f1;

  /* Light foundation */
  --paper: #f7f7f7;
  --paper-0: #ffffff;
  --paper-50: #f7f7f7;
  --paper-200: #e3e3e3;
  --paper-300: #d2d2d2;
  --paper-400: #6a6a6a;
  --paper-900: #131313;

  /* Text roles (v2.1.0 draft) - dark values; light in comments */
  --fg: var(--ink-100);       /* titles, 18.0:1 - light #131313, 17.3:1 */
  --fg-body: #a8a8a8;         /* paragraphs, 8.6:1 - light #4f4f4f, 7.6:1 */
  --fg-muted: var(--ink-400); /* dates, names, labels, 6.1:1 - light #6a6a6a, 5.1:1 */

  /* Typography */
  --font-sans: "Manrope", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", monospace;
  --font-weights: 400, 500, 700; /* 400 and 500 in the interface, every heading 500; 700 only for bold in running text; no 600 */

  /* Corners (v2.1.0 draft): fixed, capsule, concentric */
  --radius-panel: 32px;  /* page panels, the rail, the mobile menu */
  --radius-tile: 22px;   /* a card, a menu, a toast */
  --radius-block: 12px;  /* media and blocks inside a card */
  --radius-inline: 6px;  /* marks inside text */
  --radius-pill: 999px;  /* every control: a capsule */
  --radius-field: 20px;  /* every field: half the control height */
  --radius-row: 16px;    /* a row 6px inside a menu: 22 - 6 */

  /* Spatial */
  --control-h: 40px;     /* 32px at the .btn--sm action size */
  --container-max: 1200px;
}`;

  return (
    <>
      {/* Page Header */}
      <Section>
        <Container>
          <div className="mb-2">
            <PagePath path="/brand" />
          </div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="section-label">{PAGES.brand.label}</div>
              <h1>{PAGES.brand.title}</h1>
            </div>
            <div className="count-badge inline-flex items-center gap-1.5 font-mono text-small text-fg-muted px-2.5 py-1 shrink-0 mt-1">
              <span className="font-medium text-fg">v2.1</span>
              <span>Design system</span>
            </div>
          </div>
          <p className="section-intro max-w-2xl">{PAGES.brand.intro}</p>

          {/* Quick-jump Anchor Bar */}
          <nav
            aria-label="Brand reference sections"
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            <a href="#mark" className="chip chip--interactive">
              #mark
            </a>
            <a href="#colors" className="chip chip--interactive">
              #colors
            </a>
            <a href="#typography" className="chip chip--interactive">
              #typography
            </a>
            <a href="#portrait" className="chip chip--interactive">
              #portrait-and-media
            </a>
            <a href="#metadata" className="chip chip--interactive">
              #metadata-and-assets
            </a>
            <a href="#components" className="chip chip--interactive">
              #ui-components
            </a>
            <a href="#icons" className="chip chip--interactive">
              #icons
            </a>
            <a href="#voice" className="chip chip--interactive">
              #voice-and-copy
            </a>
            <a href="#tokens" className="chip chip--interactive">
              #tokens-code
            </a>
          </nav>
        </Container>
      </Section>

      <RailContents headings={CONTENTS} />

      {/* 1. The Mark & Lockup */}
      <Section id="mark">
        <Container>
          <SectionHeading
            label="Identity"
            title="The mark and logo lockup"
            intro="The platform lockup is the handle: @dileepadev, with the @ one step muted and the wordmark at full contrast. No hue - the split is in contrast alone."
          />

          <div className="grid grid-cols-1 @2xl/section:grid-cols-2 gap-6 mt-6">
            {/* Primary Lockup Showcase */}
            <div className="p-6 tile flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-label font-mono text-fg-muted mb-6">
                  <span>Primary lockup</span>
                  <span className="text-brand">Default</span>
                </div>
                <div className="py-8 flex items-center justify-center rounded-block bg-bg-surface">
                  <div className="scale-125 sm:scale-150 transform">
                    <Lockup href="#mark" />
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-label font-mono text-fg-muted">
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Wordmark font</span>
                    <span className="text-fg">Manrope Medium (500)</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Wordmark color</span>
                    <span className="text-fg">Neutral (var(--fg))</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Mark (@)</span>
                    <span className="text-fg">Muted (var(--fg-muted))</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Mark weight</span>
                    <span className="text-fg">
                      Medium (500), as the wordmark
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border-strong flex justify-end">
                <CopySnippetButton
                  text={fullLockupSvg}
                  label="Copy lockup SVG"
                />
              </div>
            </div>

            {/* Reduced Mark Showcase */}
            <div className="p-6 tile flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-label font-mono text-fg-muted mb-6">
                  <span>Reduced mark</span>
                  <span>Square placements</span>
                </div>
                <div className="py-8 flex items-center justify-center rounded-block bg-bg-surface">
                  <div className="w-16 h-16 rounded-block border border-border-strong bg-bg flex items-center justify-center font-sans font-medium text-2xl text-fg">
                    <span>@</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-label font-mono text-fg-muted">
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Role</span>
                    <span className="text-fg">Favicon, avatar, stamp</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Character</span>
                    <span className="text-fg">@ (the handle)</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Min width</span>
                    <span className="text-fg">24px</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Forbidden</span>
                    <span className="text-error">
                      No neural-net / AI clichés
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border-strong flex justify-end">
                <CopySnippetButton
                  text={reducedMarkSvg}
                  label="Copy mark SVG"
                />
              </div>
            </div>
          </div>

          {/* Do's and Don'ts */}
          <div className="mt-6 grid grid-cols-1 @2xl/section:grid-cols-2 gap-4">
            <div className="tile p-4">
              <div className="flex items-center gap-2 font-mono text-label font-medium text-brand mb-2">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Mark rules - do</span>
              </div>
              <ul className="text-label text-fg-muted space-y-1.5 list-disc list-inside">
                <li>Wordmark at full contrast; the @ one step muted</li>
                <li>
                  Set the @ at the wordmark&apos;s weight (500), never bold
                </li>
                <li>
                  Maintain minimum clear space equal to the wordmark cap-height
                </li>
                <li>Write all brand text in sentence case</li>
              </ul>
            </div>

            <div className="tile p-4">
              <div className="flex items-center gap-2 font-mono text-label font-medium text-error mb-2">
                <XCircle className="h-4 w-4" aria-hidden="true" />
                <span>Mark rules - don&apos;t</span>
              </div>
              <ul className="text-label text-fg-muted space-y-1.5 list-disc list-inside">
                <li>Never color the lockup - it is black and white only</li>
                <li>Never apply gradients, drop shadows, or outlines</li>
                <li>
                  Never use AI visual clichés: brains, robots, or circuit trees
                </li>
                <li>Never use Title Case or ALL-CAPS in logo copy</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Color System & Contrast */}
      <Section id="colors">
        <Container>
          <SectionHeading
            label="Palette"
            title="Color system and contrast"
            intro="Black to white, no hue. The accent is the text colour itself, so emphasis comes from contrast, weight and fill. Color appears only to report a state: success, error, warning."
          />

          {/* Accent stops: the ends of the neutral ramp */}
          <div className="mt-6">
            <Subsection title="Accent stops">
              <div className="grid grid-cols-1 @xl/section:grid-cols-2 gap-4 mb-8">
                <ColorSwatch
                  name="Ink (accent on dark)"
                  token="--brand / --ink-100"
                  hex="#F1F1F1"
                  role="Accent on Carbon: primary buttons, status dots, focus rings, links in prose."
                  contrast="18.0:1 on Carbon (#050505)"
                  contrastBadge="WCAG AAA"
                  bgHex="#F1F1F1"
                  textHex="#050505"
                />
                <ColorSwatch
                  name="Ink (accent on light)"
                  token="--brand / --paper-900"
                  hex="#131313"
                  role="Accent on Paper: primary buttons, status dots, focus rings, links in prose."
                  contrast="17.3:1 on Paper (#F7F7F7)"
                  contrastBadge="WCAG AAA"
                  bgHex="#131313"
                  textHex="#ffffff"
                />
              </div>
            </Subsection>

            {/* Palette Proportions */}
            <div className="p-4 tile mb-8">
              <div className="flex items-center justify-between text-label font-mono text-fg-muted mb-2">
                <span>Palette proportion budget</span>
                <span className="text-fg">Contrast, not hue</span>
              </div>
              <div className="h-4 w-full rounded-full overflow-hidden flex font-mono text-label text-bg font-medium">
                <div
                  style={{ width: "85%" }}
                  className="bg-fg-muted flex items-center justify-center truncate"
                  title="85% Neutrals"
                >
                  Neutrals 85%
                </div>
                <div
                  style={{ width: "14%" }}
                  className="bg-brand flex items-center justify-center truncate text-bg"
                  title="14% Full-contrast ink"
                >
                  14%
                </div>
                <div
                  style={{ width: "1%" }}
                  className="bg-error"
                  title="1% Functional"
                />
              </div>
              <p className="mt-2 text-small text-fg-muted">
                Full-contrast ink is the emphasis. One filled primary action per
                surface stays the focal point; everything around it sits on the
                muted and surface steps.
              </p>
            </div>

            {/* Dark Neutrals Ramp */}
            <Subsection title="Dark ramp (Carbon foundation)">
              <div className="grid grid-cols-2 @xl/section:grid-cols-3 @4xl/section:grid-cols-4 gap-3 mb-8">
                <ColorSwatch
                  name="Carbon"
                  token="--ink-900 / --carbon"
                  hex="#050505"
                  role="Canvas page foundation in dark theme."
                  bgHex="#050505"
                  borderHex="#1f1f1f"
                  textHex="#f1f1f1"
                />
                <ColorSwatch
                  name="Surface"
                  token="--ink-800 / --bg-surface"
                  hex="#0D0D0D"
                  role="Card and section background."
                  bgHex="#0D0D0D"
                  borderHex="#2e2e2e"
                  textHex="#f1f1f1"
                />
                <ColorSwatch
                  name="Raised"
                  token="--ink-700 / --bg-raised"
                  hex="#141414"
                  role="Raised surface, code blocks."
                  bgHex="#141414"
                  borderHex="#2e2e2e"
                  textHex="#f1f1f1"
                />
                <ColorSwatch
                  name="Divider"
                  token="--ink-600 / --border"
                  hex="#1F1F1F"
                  role="Structural rules, section borders."
                  bgHex="#1F1F1F"
                  borderHex="#2e2e2e"
                  textHex="#f1f1f1"
                />
                <ColorSwatch
                  name="Edge strong"
                  token="--ink-500 / --border-strong"
                  hex="#2E2E2E"
                  role="Card borders, control boundaries."
                  bgHex="#2E2E2E"
                  borderHex="#8d8d8d"
                  textHex="#f1f1f1"
                />
                <ColorSwatch
                  name="Text muted"
                  token="--ink-400 / --fg-muted"
                  hex="#8D8D8D"
                  role="Dates, names, labels, captions, leads (6.1:1)."
                  contrastBadge="WCAG AA"
                  bgHex="#8D8D8D"
                  textHex="#050505"
                />
                <ColorSwatch
                  name="Text body"
                  token="--fg-body"
                  hex="#A8A8A8"
                  role="Every paragraph, card text too (8.6:1)."
                  contrastBadge="WCAG AAA"
                  bgHex="#A8A8A8"
                  textHex="#050505"
                />
                <ColorSwatch
                  name="Text primary"
                  token="--ink-100 / --fg"
                  hex="#F1F1F1"
                  role="Titles, headings, emphasis (18:1)."
                  contrastBadge="WCAG AAA"
                  bgHex="#F1F1F1"
                  textHex="#050505"
                />
              </div>
            </Subsection>

            {/* Light Neutrals Ramp */}
            <Subsection title="Light ramp (Paper foundation)">
              <div className="grid grid-cols-2 @xl/section:grid-cols-3 @4xl/section:grid-cols-4 gap-3 mb-8">
                <ColorSwatch
                  name="Pure Paper"
                  token="--paper-0"
                  hex="#FFFFFF"
                  role="Raised cards in light mode."
                  bgHex="#FFFFFF"
                  borderHex="#d2d2d2"
                  textHex="#131313"
                />
                <ColorSwatch
                  name="Paper Ground"
                  token="--paper-50 / --paper"
                  hex="#F7F7F7"
                  role="Canvas page foundation in light theme."
                  bgHex="#F7F7F7"
                  borderHex="#d2d2d2"
                  textHex="#131313"
                />
                <ColorSwatch
                  name="Paper Rule"
                  token="--paper-200"
                  hex="#E3E3E3"
                  role="Structural dividing lines in light mode."
                  bgHex="#E3E3E3"
                  borderHex="#d2d2d2"
                  textHex="#131313"
                />
                <ColorSwatch
                  name="Paper Edge"
                  token="--paper-300"
                  hex="#D2D2D2"
                  role="Component boundaries in light mode."
                  bgHex="#D2D2D2"
                  borderHex="#6a6a6a"
                  textHex="#131313"
                />
                <ColorSwatch
                  name="Paper Muted"
                  token="--paper-400 / --fg-muted"
                  hex="#6A6A6A"
                  role="Dates, names, labels, captions (5.1:1)."
                  contrastBadge="WCAG AA"
                  bgHex="#6A6A6A"
                  textHex="#ffffff"
                />
                <ColorSwatch
                  name="Paper Body"
                  token="--fg-body"
                  hex="#4F4F4F"
                  role="Every paragraph, card text too (7.6:1)."
                  contrastBadge="WCAG AAA"
                  bgHex="#4F4F4F"
                  textHex="#ffffff"
                />
                <ColorSwatch
                  name="Paper Primary"
                  token="--paper-900 / --fg"
                  hex="#131313"
                  role="Titles, headings, emphasis (17.3:1)."
                  contrastBadge="WCAG AAA"
                  bgHex="#131313"
                  textHex="#ffffff"
                />
              </div>
            </Subsection>

            {/* Functional colors */}
            <Subsection title="Functional & state colors">
              <div className="grid grid-cols-1 @xl/section:grid-cols-3 gap-3 mb-8">
                <ColorSwatch
                  name="Success"
                  token="--success"
                  hex="#23B888 / #087F5B"
                  role="Success states only - sent, saved. Never decoration."
                  bgHex="#23B888"
                  textHex="#050505"
                />
                {/* Error and Warning carry dark ink rather than white: white on
                    those fills is 3.9:1 and 3.2:1, under the 4.5:1 a 12px label
                    needs. Both read as light surfaces in the WCAG luminance
                    sense, the same way the success green does. */}
                <ColorSwatch
                  name="Error"
                  token="--error"
                  hex="#E5484D / #C4292E"
                  role="Alert states, validation errors (5.2:1)."
                  contrastBadge="WCAG AA"
                  bgHex="#E5484D"
                  textHex="#050505"
                />
                <ColorSwatch
                  name="Warning"
                  token="--warning"
                  hex="#D97706 / #B45309"
                  role="Strictly UI warning states, never a brand accent."
                  contrastBadge="WCAG AA"
                  bgHex="#D97706"
                  textHex="#050505"
                />
              </div>
            </Subsection>

            {/* Contrast & Forbidden Pairings */}
            <div className="p-4 tile">
              <div className="font-mono text-label font-medium text-fg mb-3">
                Verified contrast and forbidden pairings
              </div>
              <div className="grid grid-cols-1 @xl/section:grid-cols-2 gap-4 text-label font-mono">
                <div className="space-y-2">
                  <div className="text-fg-muted font-medium">
                    Allowed pairings:
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-block bg-bg-surface">
                    <span>Ink 100 on Carbon</span>
                    <span className="text-brand font-medium">18.0:1 (AAA)</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-block bg-bg-surface">
                    <span>Paper 900 on Paper</span>
                    <span className="text-brand font-medium">17.3:1 (AAA)</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-block bg-bg-surface">
                    <span>Muted text on Carbon / Paper</span>
                    <span className="text-brand font-medium">
                      6.1 / 5.0:1 (AA)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-error font-medium">
                    Forbidden pairings (never ship):
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-block bg-error/10">
                    <span>Ink 500 (border) as text on Carbon</span>
                    <span className="text-error font-medium">1.5:1 (Fail)</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-block bg-error/10">
                    <span>Paper 300 (border) as text on Paper</span>
                    <span className="text-error font-medium">1.4:1 (Fail)</span>
                  </div>
                  <div className="p-2 text-fg-muted text-label">
                    Border and surface steps are for edges and fills, never for
                    text.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Typography & Scale */}
      <Section id="typography">
        <Container>
          <SectionHeading
            label="Typography"
            title="Typefaces and typographic scale"
            intro="Two families: Manrope for display and UI, JetBrains Mono for code and data. Weights 400, 500, and 700 only - no 600."
          />

          <div className="grid grid-cols-1 @xl/section:grid-cols-2 gap-6 mt-6 mb-8">
            <div className="p-5 tile">
              <div className="flex items-center justify-between text-label font-mono text-fg-muted mb-2">
                <span>Display & UI typeface</span>
                <span className="text-brand">Manrope</span>
              </div>
              <div className="font-sans text-h2 font-medium text-fg mb-3">
                Manrope
              </div>
              <p className="text-small text-fg-muted leading-relaxed">
                Geometric enough to convey engineering rigor, with subtle human
                curves. Used for all headings, navigation, button labels, and
                narrative body copy.
              </p>
              <div className="mt-4 pt-3 border-t border-border-strong/50 font-mono text-label text-fg-muted">
                Weights: 400 (regular) · 500 (medium) · 700 (bold)
              </div>
            </div>

            <div className="p-5 tile">
              <div className="flex items-center justify-between text-label font-mono text-fg-muted mb-2">
                <span>Code & Data typeface</span>
                <span className="text-brand">JetBrains Mono</span>
              </div>
              <div className="font-mono text-h2 font-medium text-fg mb-3">
                JetBrains Mono
              </div>
              <p className="text-small text-fg-muted leading-relaxed">
                Legible at small sizes, designed for technical reading. Used for
                source code, dates, terminal commands, metadata chips, and
                numerical values.
              </p>
              <div className="mt-4 pt-3 border-t border-border-strong/50 font-mono text-label text-fg-muted">
                Weights: 400 (regular) · 500 (medium)
              </div>
            </div>
          </div>

          {/* Live scale: each row set with the token it documents (v2.1.0
              draft - fluid display sizes, weight 500 for every heading). */}
          <div className="tile divide-y divide-border-hairline">
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                Display · 44–80px / 1.02 · 500
              </div>
              <div className="font-sans text-display font-medium tracking-[var(--track-display)] text-fg">
                Building AI systems
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                H1 · 36–56px / 1.06 · 500
              </div>
              <div className="font-sans text-h1 font-medium tracking-[var(--track-display)] text-fg">
                Engineering in production
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                H2 · 28px / 1.2 · 500
              </div>
              <div className="font-sans text-h2 font-medium tracking-[var(--track-tight)] text-fg">
                Section titles and key milestones
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                Lead · 20–26px / 1.35 · 400 · --fg-muted
              </div>
              <div className="font-sans text-lead text-fg-muted max-w-[48ch]">
                The opening line under a page or section title - large text, so
                the muted colour still reads.
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                H3 · 19px / 1.35 · 500
              </div>
              <div className="font-sans text-h3 font-medium text-fg">
                Subsection headings and card titles
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                Body · 17px / 1.65 · 400 · --fg-body
              </div>
              <div className="font-sans text-body text-fg-body max-w-[68ch]">
                Clear technical notes on what I build, what went wrong along the
                way, and how systems perform under load.
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                Small · 15px / 1.55 · 400 · --fg-muted
              </div>
              <div className="font-sans text-small text-fg-muted">
                Dates, names, roles, captions and notes - what you glance at. A
                paragraph, a card&apos;s description included, is Body.
              </div>
            </div>
            <div className="p-4 sm:p-6 grid grid-cols-1 @2xl/section:grid-cols-[200px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-label text-fg-muted shrink-0">
                Label · 13px / 1.45 · 500
              </div>
              <div className="font-mono text-label font-medium text-fg-muted">
                Section labels, dates, badges and status chips - the smallest
                size on the site
              </div>
            </div>
          </div>
          <p className="mt-4 text-small text-fg-muted">
            Every size is one of these steps; nothing is set below 13px. Two
            weights carry the interface, 400 and 500 - every heading is 500 -
            and 700 is kept for bold inside running text. Text clears WCAG 1.4.3
            everywhere: titles about 18:1, body about 8:1, muted 5-6:1, against
            4.5:1 required.
          </p>
        </Container>
      </Section>

      {/* 4. Imagery & Portrait */}
      <Section id="portrait">
        <Container>
          <SectionHeading
            label="Media"
            title="Portrait and photography guidelines"
            intro="The image budget is strictly two locations: the hero portrait and the event gallery. That is the entire image budget for the platform."
          />

          {/* Portrait fields */}
          <div className="mt-6">
            <Subsection title="The three portrait field grounds">
              <p className="text-small text-fg-muted mb-4">
                The official hero portrait for {name} ({role}) sits on verified
                neutral fields to guarantee contrast and prevent visual clash
                across platform crops.
              </p>
              <div className="grid grid-cols-1 @xl/section:grid-cols-3 gap-6 mb-8">
                {/* Field 1: Default */}
                <div className="p-4 tile flex flex-col items-center text-center">
                  <div
                    className="w-44 h-44 rounded-block border border-border-hairline overflow-hidden flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#D2D2D2" }}
                  >
                    <Image
                      src={transparentPortrait || portraitUrl}
                      alt={`${name} portrait on default field`}
                      width={176}
                      height={176}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="font-mono text-label font-medium text-fg">
                    portrait-field (#D2D2D2)
                  </div>
                  <div className="text-label text-fg-muted mt-1">
                    Default field for platform crops (re-uses paper-300).
                  </div>
                </div>

                {/* Field 2: On Dark */}
                <div className="p-4 tile flex flex-col items-center text-center">
                  <div
                    className="w-44 h-44 rounded-block border border-border-hairline overflow-hidden flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#F1F1F1" }}
                  >
                    <Image
                      src={transparentPortrait || portraitUrl}
                      alt={`${name} portrait on dark swap`}
                      width={176}
                      height={176}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="font-mono text-label font-medium text-fg">
                    portrait-on-dark (#F1F1F1)
                  </div>
                  <div className="text-label text-fg-muted mt-1">
                    Swap-in field on Carbon surfaces (re-uses ink-100).
                  </div>
                </div>

                {/* Field 3: On Light */}
                <div className="p-4 tile flex flex-col items-center text-center">
                  <div
                    className="w-44 h-44 rounded-block border border-border-hairline overflow-hidden flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#6A6A6A" }}
                  >
                    <Image
                      src={transparentPortrait || portraitUrl}
                      alt={`${name} portrait on light swap`}
                      width={176}
                      height={176}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="font-mono text-label font-medium text-fg">
                    portrait-on-light (#6A6A6A)
                  </div>
                  <div className="text-label text-fg-muted mt-1">
                    Swap-in field on Paper surfaces (re-uses paper-400).
                  </div>
                </div>
              </div>
            </Subsection>

            {/* Event Gallery Context */}
            {galleryPhotos.length > 0 && (
              <Subsection title="Event gallery photography">
                <p className="text-small text-fg-muted mb-4">
                  The only other photograph surface on the website. Authentic,
                  documentary captures from delivered workshops and talks.
                </p>
                <div className="grid grid-cols-2 @xl/section:grid-cols-4 gap-3">
                  {galleryPhotos.map((photo, i) => (
                    <div
                      key={photo.url || i}
                      className="group relative aspect-4/3 rounded-block overflow-hidden bg-bg"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption || photo.eventTitle || "Event photo"}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                        <span className="font-mono text-label text-fg line-clamp-2">
                          {photo.eventTitle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Subsection>
            )}
          </div>
        </Container>
      </Section>

      {/* 5. Favicons, Open Graph & Platform Metadata */}
      <Section id="metadata">
        <Container>
          <SectionHeading
            label="Assets"
            title="Favicons, Open Graph, and metadata"
            intro="The platform's favicon suite, social card previews, web app manifest, and discovery feeds."
          />

          {/* Favicons Suite */}
          <div className="mt-6">
            <Subsection
              title="Favicon suite"
              note="The circular portrait at every size, and no vector - the identity is a photograph (brand guide §3.2)."
            >
              <div className="grid grid-cols-1 @xl/section:grid-cols-2 @5xl/section:grid-cols-3 gap-4 mb-8">
                {FAVICONS.map((icon) => (
                  <div
                    key={icon.filename}
                    className="tile p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-block bg-bg-surface flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        {/* Served as the file itself, not through the image
                            optimizer. This grid exists to show what actually
                            ships in /public - a re-encoded, re-scaled copy of
                            an icon is not the icon, and a 16px PNG has nothing
                            to gain from being optimized anyway. */}
                        <Image
                          src={icon.src}
                          alt={icon.label}
                          width={icon.size}
                          height={icon.size}
                          unoptimized
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-label text-fg">
                          {icon.label}
                        </div>
                        <div className="font-mono text-label text-brand">
                          {icon.dimensions}
                        </div>
                      </div>
                    </div>

                    <p className="text-label text-fg-muted leading-relaxed">
                      {icon.target}
                    </p>

                    {/* The filename on its own line, whole: it is the
                        thing being documented, so it never gives way to the
                        button beside it. */}
                    <div className="pt-3 border-t border-border-strong/60 flex flex-col items-start gap-2 text-label font-mono">
                      <span className="text-fg-muted break-all">
                        {icon.filename}
                      </span>
                      <a
                        href={icon.src}
                        download={icon.filename}
                        className={buttonClasses({ size: "sm" })}
                      >
                        <Download aria-hidden="true" />
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Subsection>

            {/* Social Open Graph (OG) Card */}
            <Subsection
              title="Open Graph & social card"
              note="1200×630 px master image rendered with carbon theme styling and canonical brand lockup."
            >
              <div className="mb-8">
                <SocialCardPreview />
              </div>
            </Subsection>

            {/* Platform Discovery & Crawlers */}
            <Subsection
              title="Platform metadata & crawlers"
              note="Search engines, AI agent crawlers, and platform syndication feeds configured on dileepa.dev."
            >
              <div className="tile overflow-hidden divide-y divide-border-hairline mb-8">
                {METADATA_ENDPOINTS.map((ep) => (
                  <div
                    key={ep.path}
                    className="p-4 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-label font-medium text-fg">
                          {ep.path}
                        </span>
                        <span className="chip">{ep.type}</span>
                      </div>
                      <p className="text-small text-fg-muted">
                        {ep.description}
                      </p>
                    </div>

                    <a
                      href={ep.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonClasses({
                        size: "sm",
                        className: "shrink-0 self-end sm:self-auto",
                      })}
                    >
                      <span>Inspect</span>
                      <ExternalLink aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            </Subsection>

            {/* Production HTML Head & Next.js Metadata Snippet */}
            <Subsection
              title="Production metadata specification"
              note="The root layout's defaults - the title template, the icon set, and the card every page falls back to."
            >
              <div className="space-y-3 mb-8">
                <div className="flex justify-end">
                  <CopySnippetButton
                    text={metadataSnippet}
                    label="Copy meta snippet"
                  />
                </div>
                <pre className="p-4 rounded-block bg-bg-surface overflow-x-auto font-mono text-label text-fg-muted leading-relaxed">
                  <code>{metadataSnippet}</code>
                </pre>
              </div>
            </Subsection>

            <Subsection
              title="Per-page metadata"
              note="Every route composes its own tags through one helper. Next merges metadata per key, not per field, so a page that hand-writes an openGraph block loses the site name, the locale and the default card image along with it."
            >
              <div className="space-y-3 mb-8">
                <div className="flex justify-end">
                  <CopySnippetButton
                    text={pageMetadataSnippet}
                    label="Copy page snippet"
                  />
                </div>
                <pre className="p-4 rounded-block bg-bg-surface overflow-x-auto font-mono text-label text-fg-muted leading-relaxed">
                  <code>{pageMetadataSnippet}</code>
                </pre>
              </div>
            </Subsection>
          </div>
        </Container>
      </Section>

      {/* 6. UI Components & Patterns */}
      <Section id="components">
        <Container>
          <SectionHeading
            label="Components"
            title="UI components and spatial rules"
            intro="Every control - a button, a field, a select, a toggle, a chip - is a capsule, 40px tall or 32px at the action size, and an icon alone is a circle. What can be pressed has an edge; what only labels does not. Containers keep fixed corners, and anything nested tight inside one is concentric with it. The content column is capped at 1200px."
          />

          <div className="grid grid-cols-1 @2xl/section:grid-cols-2 gap-6 mt-6 mb-8">
            {/* Buttons Showcase */}
            <div className="p-5 tile space-y-4">
              <div className="flex items-center justify-between text-label font-mono text-fg-muted">
                <span>Button variants (`Button`, `LinkButton`)</span>
                <span className="text-fg">40px · 32px · capsule</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary button</Button>
                <Button variant="secondary">Secondary button</Button>
                <LinkButton href="#mark" variant="secondary">
                  <span>Link button</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </LinkButton>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
              {/* The action size, and the icon-only button at both sizes. */}
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" size="sm">
                  <Copy aria-hidden="true" />
                  <span>Copy</span>
                </Button>
                <Button variant="secondary" size="sm">
                  <Share2 aria-hidden="true" />
                  <span>Share</span>
                </Button>
                <Button
                  variant="secondary"
                  className="btn--icon"
                  aria-label="Close (example)"
                >
                  <X aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="btn--icon"
                  aria-label="Close, small (example)"
                >
                  <X aria-hidden="true" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 text-label font-mono text-fg-muted pt-3 border-t border-border-strong/40">
                <div>
                  <span className="text-fg font-medium">.btn--primary:</span>{" "}
                  Solid ink fill (`var(--brand-fill)`), the page colour as text
                  (`var(--on-brand)`).
                </div>
                <div>
                  <span className="text-fg font-medium">.btn--secondary:</span>{" "}
                  Transparent, border (`var(--border-strong)`), hover surface.
                </div>
                <div>
                  <span className="text-fg font-medium">.btn--sm:</span> The
                  action size - copy, share, download, open. 32px, 14px icons.
                </div>
                <div>
                  <span className="text-fg font-medium">.btn--icon:</span> An
                  icon alone: a circle as wide as it is tall, at either size.
                </div>
              </div>
            </div>

            {/* Badges & Chips Showcase */}
            <div className="p-5 tile space-y-4">
              <div className="text-label font-mono text-fg-muted">
                Badges and chip indicators (`Badge`, `Chip`, `StatusBadge`)
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-label font-mono text-fg-muted mb-1.5">
                    Static (read-only metadata, status, tech stack - no edge, no
                    hover):
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge>Available for work</StatusBadge>
                    <Badge variant="filled">Active</Badge>
                    <Badge>Upcoming</Badge>
                    <Chip>Agent Framework</Chip>
                    <Chip>v2.1</Chip>
                  </div>
                </div>
                <div>
                  <div className="text-label font-mono text-fg-muted mb-1.5">
                    Interactive (links and filters - an edge, and the text rises
                    to full contrast on hover):
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge interactive>Next.js</Badge>
                    <Chip interactive>TypeScript</Chip>
                  </div>
                </div>
              </div>
              <div className="text-small text-fg-muted pt-2 border-t border-border-strong/40">
                Font: JetBrains Mono (Chip) / Manrope (Badge) · Size: 12px ·
                Tracking: 0.01em · Hover reserved strictly for interactive
                targets
              </div>
            </div>

            {/* Form controls: one corner for a field and its button */}
            <div className="p-5 tile space-y-4 @2xl/section:col-span-2">
              <div className="flex items-center justify-between gap-3 text-label font-mono text-fg-muted">
                <span>
                  Form controls (`.field`, `.search-input`, `.toggle-group`)
                </span>
                <span className="text-fg">40px · 20px corner</span>
              </div>
              <div className="grid grid-cols-1 @2xl/section:grid-cols-2 gap-4">
                <div className="field space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      readOnly
                      placeholder="you@example.com"
                      aria-label="Email (example)"
                    />
                    <Button variant="primary" className="shrink-0">
                      <Send aria-hidden="true" />
                      <span>Send</span>
                    </Button>
                  </div>
                  <textarea
                    readOnly
                    rows={3}
                    placeholder="A textarea takes the same corner as the field above it."
                    aria-label="Message (example)"
                  />
                </div>
                <div className="space-y-3">
                  <div className="search-input-wrap">
                    <Search className="search-input-icon" aria-hidden="true" />
                    <input
                      type="search"
                      readOnly
                      className="search-input"
                      placeholder="Search posts"
                      aria-label="Search (example)"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className="toggle-group"
                      role="group"
                      aria-label="View (example)"
                    >
                      <button
                        type="button"
                        className="toggle-group-option"
                        aria-pressed="true"
                      >
                        Grid
                      </button>
                      <button
                        type="button"
                        className="toggle-group-option"
                        aria-pressed="false"
                      >
                        List
                      </button>
                    </div>
                    <Chip>Next.js</Chip>
                    <Chip>Azure</Chip>
                  </div>
                </div>
              </div>
              <div className="text-small text-fg-muted pt-3 border-t border-border-strong/40">
                Every field has a 20px corner, half its height, so on one line
                it is a capsule like the button beside it, and the textarea
                keeps the same ends as it grows. A field&apos;s edge is
                --border-input, 3:1 against the page (WCAG 1.4.11) - the only
                sign that it is a field. A button, a select or a toggle that
                acts takes the quieter --border-strong; a badge that only labels
                takes none.
              </div>
            </div>
          </div>

          {/* Corner radius: fixed, capsule, concentric */}
          <Subsection
            title="Corner radius"
            note="Three kinds of corner, after Apple's shape system: fixed for containers, capsules for controls, and concentric for anything nested tight inside another shape."
          >
            <div className="space-y-6">
              {RADIUS_KINDS.map((group) => (
                <div key={group.kind} className="space-y-3">
                  <p className="text-small text-fg-muted">
                    <span className="font-medium text-fg">{group.kind}.</span>{" "}
                    {group.rule}
                  </p>
                  <ul className="grid grid-cols-1 @xl/section:grid-cols-2 @4xl/section:grid-cols-3 gap-3">
                    {group.roles.map((role) => (
                      <li key={role.name} className="tile p-4 space-y-3">
                        <div
                          className="h-24 flex items-center"
                          aria-hidden="true"
                        >
                          {role.specimen ? (
                            <div
                              className={`border border-border-strong bg-bg-surface ${role.specimen}`}
                            />
                          ) : (
                            // A menu with one row in it: the row sits 6px in.
                            <div className="w-full rounded-tile border border-border-strong bg-bg-surface p-1.5">
                              <div className="h-8 rounded-row bg-surface-hover" />
                              <div className="h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="font-medium text-small text-fg">
                            {role.name}
                          </span>
                          <span className="font-mono text-label text-fg-muted">
                            {role.value}
                          </span>
                        </div>
                        <p className="text-label text-fg-muted leading-relaxed">
                          {role.use}
                        </p>
                        <code className="font-mono text-label text-fg-muted">
                          {role.token}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Subsection>
        </Container>
      </Section>

      {/* 6b. Icons */}
      <Section id="icons">
        <Container>
          <SectionHeading
            label="Icons"
            title="Every icon on the site"
            intro={`${INTERFACE_ICON_COUNT} interface icons from Lucide, six pillar marks and six social marks. Icons take the text colour they sit in - no icon carries a colour of its own.`}
          />
          <IconCatalog />
        </Container>
      </Section>

      {/* 7. Voice & Banned Words */}
      <Section id="voice">
        <Container>
          <SectionHeading
            label="Voice"
            title="Tone of voice and prohibited copy"
            intro="Direct, technical, and understated. Speak as an engineer explaining real systems to peers. Avoid hyperbole and empty buzzwords."
          />

          <div className="tile p-5 mt-6">
            <div className="flex items-center gap-2 font-mono text-label font-medium text-error mb-4">
              <XCircle className="h-4 w-4" aria-hidden="true" />
              <span>Banned terms in all content and copy</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "passionate about",
                "leveraging",
                "cutting-edge",
                "revolutionize",
                "game-changing",
                "unlock",
                "seamless",
                "AI enthusiast",
                "thought leader",
                "journey",
                "humbled to announce",
                "10x",
              ].map((term) => (
                <div
                  key={term}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error/10 font-mono text-label text-error"
                >
                  <span className="line-through">{term}</span>
                  <span className="text-label text-error">✗</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-small text-fg-muted">
              Never use vague marketing filler. Describe the architecture, the
              failures, and the concrete outcome plainly.
            </p>
          </div>
        </Container>
      </Section>

      {/* 8. Quick Reference & CSS Tokens */}
      <Section id="tokens">
        <Container>
          <SectionHeading
            label="Tokens"
            title="Design tokens quick reference"
            intro="Canonical tokens as defined in `docs/brand-tokens.css` and `DESIGN.md`."
          />

          <div className="tile p-4 sm:p-6 mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-mono text-label text-fg-muted">
                <Code2 className="h-4 w-4 text-brand" aria-hidden="true" />
                <span>brand-tokens.css</span>
              </div>
              <CopySnippetButton
                text={cssTokensSnippet}
                label="Copy CSS variables"
              />
            </div>
            <pre className="p-4 rounded-block bg-bg-surface overflow-x-auto font-mono text-label text-fg-muted leading-relaxed">
              <code>{cssTokensSnippet}</code>
            </pre>

            <div className="mt-6 pt-4 border-t border-border-strong flex items-center justify-between flex-wrap gap-4 text-label font-mono text-fg-muted">
              <div>
                Canonical specification: DESIGN.md & docs/brand-guide.md
              </div>
              <div className="flex items-center gap-3">
                <Link href="/sitemap" className="text-link">
                  Sitemap
                </Link>
                <a
                  href={SITE_CONFIG.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
