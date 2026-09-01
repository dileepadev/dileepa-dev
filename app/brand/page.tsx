import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  ExternalLink,
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

export const metadata: Metadata = pageMetadata({
  title: PAGES.brand.meta.title,
  description: PAGES.brand.meta.description,
  path: "/brand",
});

export const revalidate = 900;

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
      "Standard plaintext reference describing dileepadev for AI models and autonomous agents.",
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
    default: "Dileepa Bandara — AI engineer building agentic systems",
    template: "%s · Dileepa Bandara",
  },
  // The long form. SITE_CONFIG.description is the short line the hero, the
  // footer and the terminal profile use; a search snippet gets ~155 characters
  // and Google writes its own when the supplied one is too thin.
  description: SITE_CONFIG.metaDescription,
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
    title: "Dileepa Bandara — AI engineer building agentic systems",
    description: SITE_CONFIG.metaDescription,
    siteName: "Dileepa Bandara",
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dileepa Bandara — AI engineer building agentic systems",
    description: SITE_CONFIG.metaDescription,
    site: "@dileepadev",
    creator: "@dileepadev",
    images: [{ url: "/og.png", width: 1200, height: 630, type: "image/png" }],
  },
};`;

// Every other route composes its tags through one helper rather than writing
// them out. Next merges metadata per key, not per field: a page that declares
// `openGraph` replaces the layout's outright, and a page that declares none
// inherits the homepage's whole card — so hand-written page metadata produces
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

export default async function BrandPage() {
  const [about, galleryPhotos] = await Promise.all([
    api.getAbout(),
    getGallery(4),
  ]);

  const portraitUrl = getPortraitUrl(about?.images) || "/profile/v2.webp";
  const transparentPortrait = "/profile/v2-transparent.png";
  const name = about?.name || SITE_CONFIG.name;
  const role = about?.title || "AI engineer";

  const fullLockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 32" height="32" fill="none">
  <text x="0" y="24" font-family="Manrope, system-ui, sans-serif" font-size="20" font-weight="500" letter-spacing="-0.02em" fill="#f1f1f1">dileepadev</text>
  <text x="118" y="24" font-family="Manrope, system-ui, sans-serif" font-size="20" font-weight="700" fill="#23b888">/</text>
  <circle cx="131" cy="22" r="2.5" fill="#23b888" />
</svg>`;

  const reducedMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none">
  <rect width="32" height="32" rx="6" fill="#0d0d0d" stroke="#1f1f1f" stroke-width="1" />
  <text x="10" y="22" font-family="Manrope, system-ui, sans-serif" font-size="20" font-weight="700" fill="#23b888">/</text>
  <circle cx="21" cy="20" r="2" fill="#23b888" />
</svg>`;

  const cssTokensSnippet = `:root {
  /* Brand accent stops */
  --emerald-bright: #23b888; /* WCAG AAA on Carbon (7.7:1) */
  --emerald-deep: #087f5b;   /* WCAG AA on Paper (4.7:1) */

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

  /* Typography */
  --font-sans: "Manrope", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", monospace;
  --font-weights: 400, 500, 700; /* No 600 */

  /* Spatial */
  --control-h: 40px;
  --container-max: 1020px;
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
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors hover:border-brand cursor-default">
              <span className="font-medium text-fg">v2.0</span>
              <span>Design system</span>
            </div>
          </div>
          <p className="section-intro max-w-2xl">{PAGES.brand.intro}</p>

          {/* Quick-jump Anchor Bar */}
          <nav
            aria-label="Brand reference sections"
            className="mt-6 flex flex-wrap items-center gap-2"
          >
            <a
              href="#mark"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #mark
            </a>
            <a
              href="#colors"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #colors
            </a>
            <a
              href="#typography"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #typography
            </a>
            <a
              href="#portrait"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #portrait-and-media
            </a>
            <a
              href="#metadata"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #metadata-and-assets
            </a>
            <a
              href="#components"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #ui-components
            </a>
            <a
              href="#voice"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #voice-and-copy
            </a>
            <a
              href="#tokens"
              className="px-2.5 py-1 rounded-sm bg-bg-surface text-fg-muted hover:text-fg hover:border-brand border border-border-strong transition-colors font-mono text-xs"
            >
              #tokens-code
            </a>
          </nav>
        </Container>
      </Section>

      {/* 1. The Mark & Lockup */}
      <Section id="mark">
        <Container>
          <SectionHeading
            label="Identity"
            title="The mark and logo lockup"
            intro="The platform lockup is an understated developer identity: a neutral wordmark paired with an upright emerald terminal prompt and dot."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Primary Lockup Showcase */}
            <div className="p-6 rounded-lg border border-border-strong bg-bg-surface flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-6">
                  <span>Primary lockup</span>
                  <span className="text-brand">Default</span>
                </div>
                <div className="py-8 flex items-center justify-center border border-border-strong/60 rounded bg-bg">
                  <div className="scale-125 sm:scale-150 transform">
                    <Lockup href="#mark" />
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs font-mono text-fg-muted">
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Wordmark font</span>
                    <span className="text-fg">Manrope Medium (500)</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Wordmark color</span>
                    <span className="text-fg">Neutral (var(--fg))</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Mark slash & dot</span>
                    <span className="text-brand">Emerald (var(--brand))</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Mark weight</span>
                    <span className="text-fg">Bold (700), upright</span>
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
            <div className="p-6 rounded-lg border border-border-strong bg-bg-surface flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-6">
                  <span>Reduced mark</span>
                  <span>Square placements</span>
                </div>
                <div className="py-8 flex items-center justify-center border border-border-strong/60 rounded bg-bg">
                  <div className="w-16 h-16 rounded-md border border-border-strong bg-bg-surface flex items-center justify-center font-sans font-bold text-2xl text-brand">
                    <span>/.</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-xs font-mono text-fg-muted">
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Role</span>
                    <span className="text-fg">Favicon, avatar, stamp</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Character</span>
                    <span className="text-brand">/. (terminal closer)</span>
                  </div>
                  <div className="flex justify-between border-b border-border-strong/40 pb-1">
                    <span>Min width</span>
                    <span className="text-fg">24px</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Forbidden</span>
                    <span className="text-error">No neural-net / AI clichés</span>
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-sm border border-brand/40 bg-brand/5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-brand mb-2">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>Mark rules — do</span>
              </div>
              <ul className="text-xs text-fg-muted space-y-1.5 list-disc list-inside">
                <li>Wordmark stays neutral; emerald is reserved for the mark `/.`</li>
                <li>Set mark upright at weight 700 (bold), never italic</li>
                <li>Maintain minimum clear space equal to the wordmark cap-height</li>
                <li>Write all brand text in sentence case</li>
              </ul>
            </div>

            <div className="p-4 rounded-sm border border-error/40 bg-error/5">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-error mb-2">
                <XCircle className="h-4 w-4" aria-hidden="true" />
                <span>Mark rules — don&apos;t</span>
              </div>
              <ul className="text-xs text-fg-muted space-y-1.5 list-disc list-inside">
                <li>Never color the wordmark in emerald</li>
                <li>Never apply gradients, drop shadows, or outlines</li>
                <li>Never use AI visual clichés: brains, robots, or circuit trees</li>
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
            intro="Emerald is the single accent. Everything else is neutral. The contrast between emerald and deep carbon or crisp paper carries the brand."
          />

          {/* Emerald Stops */}
          <div className="mt-6">
            <Subsection title="Accent stops">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <ColorSwatch
                  name="Emerald Bright"
                  token="--emerald-bright"
                  hex="#23B888"
                  role="Primary accent on dark (Carbon) surfaces. Links, buttons, tags."
                  contrast="8.0:1 on Carbon (#050505)"
                  contrastBadge="WCAG AAA"
                  bgHex="#23B888"
                  textHex="#050505"
                />
                <ColorSwatch
                  name="Emerald Deep"
                  token="--emerald-deep"
                  hex="#087F5B"
                  role="Primary accent on light (Paper) surfaces. Links, buttons, tags."
                  contrast="4.7:1 on Paper (#F7F7F7)"
                  contrastBadge="WCAG AA"
                  bgHex="#087F5B"
                  textHex="#ffffff"
                />
              </div>
            </Subsection>

            {/* Palette Proportions */}
            <div className="p-4 rounded-lg border border-border-strong bg-bg-surface mb-8">
              <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2">
                <span>Palette proportion budget</span>
                <span className="text-brand">Deliberate accent</span>
              </div>
              <div className="h-4 w-full rounded overflow-hidden flex font-mono text-label text-bg font-bold">
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
                  title="14% Emerald"
                >
                  14%
                </div>
                <div
                  style={{ width: "1%" }}
                  className="bg-error"
                  title="1% Functional"
                />
              </div>
              <p className="mt-2 text-xs text-fg-muted">
                Emerald appears <strong>once per surface</strong> as an intentional
                focal point. Scattering emerald links, chips, and icons dilutes
                visual hierarchy.
              </p>
            </div>

            {/* Dark Neutrals Ramp */}
            <Subsection title="Dark ramp (Carbon foundation)">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
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
                  role="Secondary metadata and subtitles (6.1:1)."
                  contrastBadge="WCAG AAA"
                  bgHex="#8D8D8D"
                  textHex="#050505"
                />
                <ColorSwatch
                  name="Text primary"
                  token="--ink-100 / --fg"
                  hex="#F1F1F1"
                  role="Headings and primary body copy (18:1)."
                  contrastBadge="WCAG AAA"
                  bgHex="#F1F1F1"
                  textHex="#050505"
                />
              </div>
            </Subsection>

            {/* Light Neutrals Ramp */}
            <Subsection title="Light ramp (Paper foundation)">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
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
                  token="--paper-400"
                  hex="#6A6A6A"
                  role="Secondary text on light mode (5.1:1)."
                  contrastBadge="WCAG AA"
                  bgHex="#6A6A6A"
                  textHex="#ffffff"
                />
                <ColorSwatch
                  name="Paper Primary"
                  token="--paper-900"
                  hex="#131313"
                  role="Primary headings and text on light mode."
                  contrastBadge="WCAG AAA"
                  bgHex="#131313"
                  textHex="#ffffff"
                />
              </div>
            </Subsection>

            {/* Functional colors */}
            <Subsection title="Functional & state colors">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <ColorSwatch
                  name="Success"
                  token="--success"
                  hex="#23B888 / #087F5B"
                  role="Reuses emerald accent — no new hue needed."
                  bgHex="#23B888"
                  textHex="#050505"
                />
                {/* Error and Warning carry dark ink rather than white: white on
                    those fills is 3.9:1 and 3.2:1, under the 4.5:1 a 12px label
                    needs. Both read as light surfaces in the WCAG luminance
                    sense, the same way Emerald Bright does. */}
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
            <div className="p-4 rounded-lg border border-border-strong bg-bg-surface">
              <div className="font-mono text-xs font-bold text-fg mb-3">
                Verified contrast and forbidden pairings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-2">
                  <div className="text-fg-muted font-medium">
                    Allowed pairings:
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-bg border border-border">
                    <span>Emerald Bright on Carbon</span>
                    <span className="text-brand font-medium">8.0:1 (AAA)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-bg border border-border">
                    <span>Emerald Deep on Paper</span>
                    <span className="text-brand font-medium">4.7:1 (AA)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-bg border border-border">
                    <span>Primary text on Carbon</span>
                    <span className="text-brand font-medium">18.0:1 (AAA)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-error font-medium">
                    Forbidden pairings (never ship):
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-error/10 border border-error/30">
                    <span>Emerald Deep on Carbon</span>
                    <span className="text-error font-medium">4.1:1 (Fail)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-error/10 border border-error/30">
                    <span>Emerald Bright on Paper</span>
                    <span className="text-error font-medium">2.4:1 (Fail)</span>
                  </div>
                  <div className="p-2 text-fg-muted text-label">
                    Never use light accent on light background, nor dark accent on
                    dark background.
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
            intro="Two families: Manrope for display and UI, JetBrains Mono for code and data. Weights 400, 500, and 700 only — no 600."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 mb-8">
            <div className="p-5 rounded-lg border border-border-strong bg-bg-surface">
              <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2">
                <span>Display & UI typeface</span>
                <span className="text-brand">Manrope</span>
              </div>
              <div className="font-sans text-3xl font-bold text-fg mb-3">
                Manrope
              </div>
              <p className="text-xs text-fg-muted leading-relaxed">
                Geometric enough to convey engineering rigor, with subtle human
                curves. Used for all headings, navigation, button labels, and
                narrative body copy.
              </p>
              <div className="mt-4 pt-3 border-t border-border-strong/50 font-mono text-label text-fg-muted">
                Weights: 400 (regular) · 500 (medium) · 700 (bold)
              </div>
            </div>

            <div className="p-5 rounded-lg border border-border-strong bg-bg-surface">
              <div className="flex items-center justify-between text-xs font-mono text-fg-muted mb-2">
                <span>Code & Data typeface</span>
                <span className="text-brand">JetBrains Mono</span>
              </div>
              <div className="font-mono text-3xl font-bold text-fg mb-3">
                JetBrains Mono
              </div>
              <p className="text-xs text-fg-muted leading-relaxed">
                Legible at small sizes, designed for technical reading. Used for
                source code, dates, terminal commands, metadata chips, and
                numerical values.
              </p>
              <div className="mt-4 pt-3 border-t border-border-strong/50 font-mono text-label text-fg-muted">
                Weights: 400 (regular) · 500 (medium)
              </div>
            </div>
          </div>

          {/* Live Scale Showcase */}
          <div className="rounded-lg border border-border-strong bg-bg-surface divide-y divide-border-strong">
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-xs text-fg-muted shrink-0">
                Display · 44px / 1.1 · 700
              </div>
              <div className="font-sans text-4xl sm:text-display font-bold tracking-tight text-fg">
                Building AI systems
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-xs text-fg-muted shrink-0">
                H1 · 36px / 1.15 · 700
              </div>
              <div className="font-sans text-3xl sm:text-h1 font-bold tracking-tight text-fg">
                Engineering in production
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-xs text-fg-muted shrink-0">
                H2 · 22px / 1.3 · 700
              </div>
              <div className="font-sans text-h2 font-bold tracking-tight text-fg">
                Section titles and key milestones
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-xs text-fg-muted shrink-0">
                H3 · 18px / 1.35 · 500
              </div>
              <div className="font-sans text-h3 font-medium text-fg">
                Subsection headings and article card titles
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-xs text-fg-muted shrink-0">
                Body · 16px / 1.65 · 400
              </div>
              <div className="font-sans text-base text-fg leading-relaxed max-w-[68ch]">
                Clear technical notes on what I build, what went wrong along the
                way, and how systems perform under load.
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-xs text-fg-muted shrink-0">
                Small · 14px / 1.55 · 400
              </div>
              <div className="font-mono text-small text-fg-muted">
                JetBrains Mono captions, dates, and terminal outputs.
              </div>
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[180px_1fr] md:items-baseline gap-2 sm:gap-6">
              <div className="font-mono text-xs text-fg-muted shrink-0">
                Label · 12px / 1.45 · 500
              </div>
              <div className="font-mono text-xs text-fg-muted">
                Section labels, badges, and status chips
              </div>
            </div>
          </div>
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
              <p className="text-xs text-fg-muted mb-4">
                The official hero portrait for {name} ({role}) sits on verified neutral fields to guarantee contrast
                and prevent visual clash across platform crops.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {/* Field 1: Default */}
                <div className="p-4 rounded-lg border border-border-strong bg-bg-surface flex flex-col items-center text-center">
                  <div
                    className="w-44 h-44 rounded-sm border border-border-strong overflow-hidden flex items-center justify-center mb-3"
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
                  <div className="font-mono text-xs font-medium text-fg">
                    portrait-field (#D2D2D2)
                  </div>
                  <div className="text-label text-fg-muted mt-1">
                    Default field for platform crops (re-uses paper-300).
                  </div>
                </div>

                {/* Field 2: On Dark */}
                <div className="p-4 rounded-lg border border-border-strong bg-bg-surface flex flex-col items-center text-center">
                  <div
                    className="w-44 h-44 rounded-sm border border-border-strong overflow-hidden flex items-center justify-center mb-3"
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
                  <div className="font-mono text-xs font-medium text-fg">
                    portrait-on-dark (#F1F1F1)
                  </div>
                  <div className="text-label text-fg-muted mt-1">
                    Swap-in field on Carbon surfaces (re-uses ink-100).
                  </div>
                </div>

                {/* Field 3: On Light */}
                <div className="p-4 rounded-lg border border-border-strong bg-bg-surface flex flex-col items-center text-center">
                  <div
                    className="w-44 h-44 rounded-sm border border-border-strong overflow-hidden flex items-center justify-center mb-3"
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
                  <div className="font-mono text-xs font-medium text-fg">
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
                <p className="text-xs text-fg-muted mb-4">
                  The only other photograph surface on the website. Authentic,
                  documentary captures from delivered workshops and talks.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryPhotos.map((photo, i) => (
                    <div
                      key={photo.url || i}
                      className="group relative aspect-4/3 rounded overflow-hidden border border-border-strong bg-bg-surface"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption || photo.eventTitle || "Event photo"}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                        <span className="font-mono text-label text-fg truncate">
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
              note="The favicon is the circular portrait, not the reduced mark (decided in brand guide §3.2)."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {FAVICONS.map((icon) => (
                  <div
                    key={icon.filename}
                    className="rounded-lg border border-border-strong bg-bg-surface p-4 flex flex-col justify-between gap-3 shadow-xs hover:border-brand/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded border border-border-strong bg-bg flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        {/* Served as the file itself, not through the image
                            optimizer. This grid exists to show what actually
                            ships in /public — a re-encoded, re-scaled copy of
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
                        <div className="font-bold text-xs text-fg truncate">
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

                    <div className="pt-2 border-t border-border-strong/60 flex items-center justify-between text-label font-mono">
                      <span className="text-fg-muted truncate">{icon.filename}</span>
                      <a
                        href={icon.src}
                        download={icon.filename}
                        className="text-brand hover:underline font-medium ml-2 shrink-0"
                      >
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
              <div className="rounded-lg border border-border-strong bg-bg-surface overflow-hidden divide-y divide-border-strong/60 shadow-xs mb-8">
                {METADATA_ENDPOINTS.map((ep) => (
                  <div
                    key={ep.path}
                    className="p-4 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-hover/30 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-fg">
                          {ep.path}
                        </span>
                        <span className="text-label font-mono px-1.5 py-0.2 rounded bg-brand/10 text-brand border border-brand/20">
                          {ep.type}
                        </span>
                      </div>
                      <p className="text-xs text-fg-muted">
                        {ep.description}
                      </p>
                    </div>

                    <a
                      href={ep.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--secondary !h-7 !px-2.5 text-xs inline-flex items-center gap-1 shrink-0 self-end sm:self-auto font-mono"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="h-3 w-3 text-fg-muted" aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            </Subsection>

            {/* Production HTML Head & Next.js Metadata Snippet */}
            <Subsection
              title="Production metadata specification"
              note="The root layout's defaults — the title template, the icon set, and the card every page falls back to."
            >
              <div className="space-y-3 mb-8">
                <div className="flex justify-end">
                  <CopySnippetButton
                    text={metadataSnippet}
                    label="Copy meta snippet"
                  />
                </div>
                <pre className="p-4 rounded border border-border-strong/60 bg-bg overflow-x-auto font-mono text-xs text-fg-muted leading-relaxed">
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
                <pre className="p-4 rounded border border-border-strong/60 bg-bg overflow-x-auto font-mono text-xs text-fg-muted leading-relaxed">
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
            intro="Universal control height of 40px, container width capped at 1020px, and hairline borders."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-8">
            {/* Buttons Showcase */}
            <div className="p-5 rounded-lg border border-border-strong bg-bg-surface space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-fg-muted">
                <span>Button variants (`Button`, `LinkButton`)</span>
                <span className="text-brand">40px height</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">
                  Primary button
                </Button>
                <Button variant="secondary">
                  Secondary button
                </Button>
                <LinkButton href="#mark" variant="secondary">
                  <span>Link button</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </LinkButton>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-fg-muted pt-3 border-t border-border-strong/40">
                <div>
                  <span className="text-fg font-medium">.btn--primary:</span> Solid emerald fill (`var(--brand-fill)`), dark text (`var(--on-brand)`).
                </div>
                <div>
                  <span className="text-fg font-medium">.btn--secondary:</span> Transparent, border (`var(--border-strong)`), hover surface.
                </div>
              </div>
            </div>

            {/* Badges & Chips Showcase */}
            <div className="p-5 rounded-lg border border-border-strong bg-bg-surface space-y-4">
              <div className="text-xs font-mono text-fg-muted">
                Badges and chip indicators (`Badge`, `Chip`, `StatusBadge`)
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-label font-mono text-fg-muted mb-1.5">
                    Static (read-only metadata, status, tech stack — calm, no hover):
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge>Available for work</StatusBadge>
                    <Badge variant="filled">Active</Badge>
                    <Badge>Upcoming</Badge>
                    <Chip>Agent Framework</Chip>
                    <Chip>v2.0</Chip>
                  </div>
                </div>
                <div>
                  <div className="text-label font-mono text-fg-muted mb-1.5">
                    Interactive (links, filter buttons — cursor-pointer &amp; brand hover):
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge interactive>Next.js</Badge>
                    <Chip interactive>TypeScript</Chip>
                  </div>
                </div>
              </div>
              <div className="font-mono text-label text-fg-muted pt-2 border-t border-border-strong/40">
                Font: JetBrains Mono (Chip) / Manrope (Badge) · Size: 12px · Tracking: 0.01em · Hover reserved strictly for interactive targets
              </div>
            </div>
          </div>
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

          <div className="p-5 rounded-lg border border-error/30 bg-bg-surface mt-6">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-error mb-4">
              <XCircle className="h-4 w-4" aria-hidden="true" />
              <span>Banned terms in all content and copy</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
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
                  className="px-2.5 py-1.5 rounded bg-error/10 border border-error/20 font-mono text-xs text-error flex items-center justify-between"
                >
                  <span className="line-through">{term}</span>
                  <span className="text-label text-error/80">✗</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-fg-muted">
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

          <div className="rounded-lg border border-border-strong bg-bg-surface p-4 sm:p-6 mt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 font-mono text-xs text-fg-muted">
                <Code2 className="h-4 w-4 text-brand" aria-hidden="true" />
                <span>brand-tokens.css</span>
              </div>
              <CopySnippetButton
                text={cssTokensSnippet}
                label="Copy CSS variables"
              />
            </div>
            <pre className="p-4 rounded border border-border-strong/60 bg-bg overflow-x-auto font-mono text-xs text-fg-muted leading-relaxed">
              <code>{cssTokensSnippet}</code>
            </pre>

            <div className="mt-6 pt-4 border-t border-border-strong flex items-center justify-between flex-wrap gap-4 text-xs font-mono text-fg-muted">
              <div>Canonical specification: DESIGN.md & docs/brand-guide.md</div>
              <div className="flex items-center gap-3">
                <Link
                  href="/sitemap"
                  className="hover:text-brand transition-colors inline-flex items-center gap-1"
                >
                  <span>Sitemap</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
                <a
                  href={SITE_CONFIG.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
