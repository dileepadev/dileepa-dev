import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Footer, Navbar } from "@/components/sections";
import { api } from "@/lib/api";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";
import { SITE_CONFIG } from "@/lib/constants";
import "./globals.css";

// Three weights, which is the whole scale: 400 body, 500 UI and labels, 700
// headings and the lockup mark. Five were loaded to serve three exceptions —
// 600 for the lockup mark and the hero name, 800 for the subsection rules —
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
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s · ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
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
  // The favicon is the portrait, not the reduced mark — decided in the brand
  // repo's Phase 1 and recorded in brand-guide.md §3.2. The full set is
  // vendored from dileepadev/docs/brand/favicon/, which is its only home.
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      {
        url: "/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [{ rel: "mask-icon", url: "/android-icon-512x512.png" }],
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
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
    description: SITE_CONFIG.description,
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

  return (
    // The font variables belong on <html>, not <body>: globals.css builds
    // --font-sans out of them at :root, and a custom property that is only
    // declared on <body> is undefined there — which makes the whole
    // declaration invalid and drops the site to a system font.
    <html
      lang="en"
      className={`${manrope.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
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
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
        <MicrosoftClarity />
      </body>
    </html>
  );
}
