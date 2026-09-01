import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Footer, Navbar } from "@/components/sections";
import { BackToTop } from "@/components/ui";
import { api } from "@/lib/api";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";
import { SITE_CONFIG } from "@/lib/constants";
import { METADATA_ORIGIN } from "@/lib/metadata";
import { portrait as portraitUrl } from "@/lib/format";
import "./globals.css";

// Three weights, which is the whole scale: 400 body, 500 UI and labels, 700
// headings and the lockup mark. Five were loaded to serve three exceptions -
// 600 for the lockup mark and the hero name, 800 for the subsection rules -
// and those three now sit on the scale, so the two extra faces are two
// requests and ~40KB of woff2 the page no longer waits on.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  // The deployment's own origin, not the site's identity - see
  // `deploymentOrigin` in lib/metadata.ts. Every relative URL in this object
  // and in every page's resolves against it, which is what makes a preview's
  // `og:image` a file that exists.
  metadataBase: new URL(METADATA_ORIGIN),
  title: {
    default: SITE_CONFIG.title,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.metaDescription,
  applicationName: SITE_CONFIG.name,
  category: "Personal website",
  generator: "Next.js",
  keywords: [
    "Dileepa Bandara",
    "dileepadev",
    "AI engineer",
    "AI agents",
    "agent architecture",
    "FastAPI",
    "Azure",
    "Microsoft Foundry",
    "workshops",
    "Sri Lanka",
  ],
  authors: [{ name: SITE_CONFIG.author, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  // The favicon is the portrait at every size - brand-guide.md §3.2. There is
  // deliberately no SVG favicon: the identity is a photograph, a photograph
  // has no vector form, and the alternatives are both worse than not having
  // one. A vector of the `/.` mark would put a second design in the tab while
  // every other surface shows the face; a PNG base64'd inside an SVG wrapper
  // is the same pixels a third larger, with none of the scaling or
  // colour-scheme behaviour that is the only reason to want SVG. Audit tools
  // flag the absence as a tip; it stays flagged. The set is vendored from
  // dileepadev/docs/brand/favicon/, which is its only home.
  manifest: "/manifest.json",
  icons: {
    // No `/favicon.ico` entry and no `shortcut`. `app/favicon.ico` is a file
    // convention: Next serves it at `/favicon.ico` and emits its own
    // `<link rel="icon" type="image/x-icon">` for it. Declaring it here as well
    // put three ICO links in every page's head for one file.
    //
    // That file is now built from the vendored PNGs rather than shipped by an
    // icon generator, and it carries 16, 32 and 48 in one container. The
    // generated one was a single 48 on a warm #CBC4BA field while every PNG in
    // the set sits on the neutral #D2D2D2 the portrait actually uses - a
    // mismatch you could see in a tab beside any other surface. Rebuilding it
    // from `favicon-16x16`, `favicon-32x32` and `android-icon-48x48` takes the
    // colour from the same source as the rest and gains two sizes.
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    // No `mask-icon`. It pointed at a PNG, and Safari's pinned-tab icon has to
    // be a monochrome SVG with a `color` attribute - so the tag has never done
    // anything but add a line to every page's head. Safari 12 and later use the
    // ordinary favicon for pinned tabs anyway, and that is now an SVG.
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    // The deployment's origin, not the site's identity - a hard-coded
    // production URL here would survive `metadataBase` and point a preview's
    // card at another site.
    url: METADATA_ORIGIN,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.metaDescription,
    siteName: SITE_CONFIG.name,
    emails: SITE_CONFIG.email,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.metaDescription,
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
        type: "image/png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  // Carbon and Paper, matching --bg in each theme. The browser paints the
  // address bar with this before any CSS runs, so a wrong value shows as a
  // flash of the other theme on mobile.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#F7F7F7" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The footer's social links come from the same `about` record the homepage
  // reads. The fetch is deduplicated by Next's cache, so this costs nothing.
  const about = await api.getAbout();

  // Two nodes, joined by `@id`, rather than two strangers.
  //
  // There is no `og:logo` - the Open Graph protocol defines twenty-three
  // properties and that is not one of them, whatever an audit tool says. The
  // logo a search engine actually reads is here, in the structured data, and
  // for a person it is `Person.image`: the portrait, which is also the favicon
  // by brand-guide.md section 3.2. So the logo is declared; it is just not
  // declared where a checker looking for a tag that does not exist can see it.
  //
  // These identifiers are fragments on the canonical origin on purpose. They
  // name the *entity*, not the page it happens to be served from, so they stay
  // stable across a preview deployment - unlike `METADATA_ORIGIN`, which
  // deliberately follows the deployment.
  const personId = `${SITE_CONFIG.url}/#person`;
  const websiteId = `${SITE_CONFIG.url}/#website`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: SITE_CONFIG.name,
    // The handle carries as much recognition as the name and now sits in the
    // page title too; this is what ties the two to one entity.
    alternateName: "dileepadev",
    url: SITE_CONFIG.url,
    jobTitle: "AI Engineer",
    sameAs: [
      about?.links?.github,
      about?.links?.linkedin,
      about?.links?.xtwitter,
      about?.links?.youtube,
    ].filter(Boolean),
    image: portraitUrl(about?.images) || undefined,
    description: SITE_CONFIG.description,
    ...(about?.location ? { address: about.location } : {}),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: "en",
    // The site is published by the person above. Without this the two nodes
    // describe the same thing and say nothing about each other.
    publisher: { "@id": personId },
  };

  return (
    // The font variables belong on <html>, not <body>: globals.css builds
    // --font-sans out of them at :root, and a custom property that is only
    // declared on <body> is undefined there - which makes the whole
    // declaration invalid and drops the site to a system font.
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preconnect"
          href="https://res.cloudinary.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded focus:bg-bg-surface focus:px-4 focus:py-2 focus:text-fg"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer about={about} />
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: "var(--bg-surface)",
                color: "var(--fg)",
                border: "var(--hairline) solid var(--border)",
                borderRadius: "var(--radius)",
                fontSize: "var(--text-small)",
              },
            }}
          />
          <BackToTop />
        </ThemeProvider>
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
