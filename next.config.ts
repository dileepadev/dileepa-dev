import type { NextConfig } from "next";

/**
 * The origin the browser talks to the API on.
 *
 * Post interactions - views, reactions, comments - are fetched in the browser
 * rather than at build time, so the API is a real `connect-src` and not just a
 * server-side dependency. Derived from the same variable the client reads, so
 * pointing the site at a different API cannot leave the policy behind naming
 * the old one.
 */
function apiOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL;
  if (!configured) return "";
  try {
    return new URL(configured).origin;
  } catch {
    return "";
  }
}

/**
 * Security headers.
 *
 * The API has carried these since v2.0.0; the site carried none, so every one
 * of them was absent on every page. They live here rather than in host
 * configuration so the posture ships with the code.
 *
 * `Strict-Transport-Security` deliberately omits `includeSubDomains`.
 * `blog.dileepa.dev` is retired and resolves to a registrar forward with no
 * certificate, and the directive would be honoured for that host too - turning
 * a redirect into a connection failure.
 *
 * `'unsafe-inline'` on `script-src` is not optional here: Next inlines its
 * hydration payload on every page, and Microsoft Clarity's loader is an inline
 * bootstrap. Removing it needs a per-request nonce, which needs middleware on
 * every route, which would make all 109 statically generated pages dynamic.
 * The directive still earns its place - it blocks an injected
 * `<script src="https://…">` from anywhere not named below.
 *
 * **Development needs three things production must never get**, so they are
 * added only when `next dev` is the thing running:
 *
 * - `'unsafe-eval'` - React's development build calls `eval()` to rebuild
 *   callstacks across environments and for other debugging features. Without
 *   it the console fills with "eval() is not supported in this environment".
 *
 *   Production keeps the stricter policy, and does **not** get away clean:
 *   Next ships a browserified `util` in its Node-builtin polyfill bundle, and
 *   `is-generator-function` inside it feature-detects with
 *   `Function("return function*(){}")`. CSP blocks the call, the surrounding
 *   `try/catch` swallows it, and the page is unaffected - but Chrome logs one
 *   `kEvalViolation` per load, which is what holds Lighthouse's Best Practices
 *   at 96. It is framework code, reachable from no import in this repository,
 *   so the choice is to keep the directive or to hand every third-party script
 *   `eval()` for a score. The directive stays.
 * - `ws:` and `wss:` on `connect-src` - hot module replacement is a WebSocket.
 * - `blob:` on `script-src` and `worker-src` - Turbopack loads some chunks as
 *   blob-backed workers.
 * - `https://va.vercel-scripts.com` - `@vercel/analytics` and
 *   `@vercel/speed-insights` fetch a *debug* build from that host when they
 *   detect development. In production both load from `/_vercel/…` on this
 *   origin, which `'self'` already covers, so the host never appears in the
 *   production policy.
 *
 * This is the one place the policy differs between environments, and it is
 * gated on `NODE_ENV` rather than on a flag someone can forget to unset.
 */
function securityHeaders() {
  const api = apiOrigin();
  const isDev = process.env.NODE_ENV === "development";
  const analyticsScripts = [
    "https://www.googletagmanager.com",
    "https://www.clarity.ms",
    "https://scripts.clarity.ms",
  ];
  const analyticsConnect = [
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://*.googletagmanager.com",
    "https://*.clarity.ms",
    "https://c.bing.com",
  ];
  const analyticsImages = [
    "https://*.google-analytics.com",
    "https://*.googletagmanager.com",
    "https://*.clarity.ms",
    "https://c.bing.com",
  ];

  const vercelScripts = [
    "https://vercel.live",
    "https://*.vercel.live",
    "https://va.vercel-scripts.com",
  ];
  const vercelConnect = [
    "https://vercel.live",
    "https://*.vercel.live",
    "https://*.pusher.com",
    "wss://*.pusher.com",
    "https://va.vercel-scripts.com",
  ];
  const vercelImages = [
    "https://vercel.live",
    "https://*.vercel.live",
    "https://vercel.com",
  ];
  const vercelFrames = ["https://vercel.live", "https://*.vercel.live"];

  // Development-only. See the note above: React's dev build needs eval(),
  // HMR is a WebSocket, and Turbopack serves some chunks from blob: URLs.
  const devScript = isDev
    ? " 'unsafe-eval' blob: https://va.vercel-scripts.com"
    : "";
  const devConnect = isDev ? " ws: wss:" : "";

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${devScript} ${analyticsScripts.join(" ")} ${vercelScripts.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://vercel.live",
    // next/font self-hosts Manrope and JetBrains Mono, so no font CDN appears.
    "font-src 'self' data: https://vercel.live https://assets.vercel.com",
    `img-src 'self' data: blob: https://res.cloudinary.com ${analyticsImages.join(" ")} ${vercelImages.join(" ")}`,
    `connect-src 'self'${devConnect} ${api} ${analyticsConnect.join(" ")} ${vercelConnect.join(" ")}`
      .replace(/\s+/g, " ")
      .trim(),
    `worker-src 'self'${isDev ? " blob:" : ""}`,
    // Google Tag Manager loads a frame for some tag types; Vercel Live uses frames for the feedback toolbar.
    `frame-src 'self' https://www.googletagmanager.com ${vercelFrames.join(" ")}`,
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value:
        "accelerometer=(), camera=(), geolocation=(), microphone=(), payment=()",
    },
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
    { key: "Content-Security-Policy", value: csp },
  ];
}

const nextConfig: NextConfig = {
  // Turbopack infers the project root from the nearest lockfile and walks up
  // to find one. There is a stray `package-lock.json` in the home directory
  // above this repository, so the inference reached outside the repo, warned
  // on every `next dev` and `next build`, and then fell back. Naming the root
  // settles it: module resolution, cache validation and filesystem watching
  // all stay inside the repository.
  turbopack: {
    root: import.meta.dirname,
  },
  // The two Manrope files `lib/og/card.tsx` reads to draw a social card. Next
  // traces `import` graphs, not `readFile` paths, so without this they are
  // absent from the deployed bundle and every generated card 500s - and only
  // at request time, because those routes render on demand.
  outputFileTracingIncludes: {
    "/**": ["./lib/og/*.ttf"],
  },
  // `X-Powered-By: Next.js` names the framework and its presence on every
  // response is free reconnaissance. Nothing reads it.
  poweredByHeader: false,
  // Source of truth: dileepadev/docs/architecture/redirects.md. If that file
  // and this list disagree, that file is right.
  async redirects() {
    return [
      // Two posts were renamed after publication, and both old slugs were live
      // long enough to be shared. Neither rule is optional: a redirect costs
      // nothing to keep and the URL is the only thing a reader saved.
      //
      // redirects.md §2 row 1 - this lived in the blog's `astro.config.mjs`,
      // which has been deleted, so it is easy to lose with that file.
      {
        source:
          "/blog/2026-08-06-zero-to-agent-microsoft-foundry-series-kickoff",
        destination: "/blog/2026-08-06-part-1-kicking-off-the-series",
        permanent: true,
      },
      // redirects.md §2 row 2 - the v2.0.0 content move renamed this post and
      // corrected its publishedDate by a day. The corrected date is kept.
      {
        source: "/blog/2026-02-11-welcome",
        destination: "/blog/2026-02-10-welcome",
        permanent: true,
      },
      // `/sessions` existed only on the v2.0.0 branch and was never the
      // published URL - `/events` was, and is again. The rule is kept so links
      // shared from a preview deployment keep resolving.
      { source: "/sessions", destination: "/events", permanent: true },
      {
        source: "/sessions/:slug",
        destination: "/events/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Cloudinary and nothing else. Every image the platform serves goes through
    // POST /uploads, so a second host here would mean an image had bypassed the
    // one path that holds the credentials.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders() }];
  },
};

export default nextConfig;
