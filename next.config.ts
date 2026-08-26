import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Source of truth: dileepadev/docs/architecture/redirects.md. If that file
  // and this list disagree, that file is right.
  async redirects() {
    return [
      // Two posts were renamed after publication, and both old slugs were live
      // long enough to be shared. Neither rule is optional: a redirect costs
      // nothing to keep and the URL is the only thing a reader saved.
      //
      // redirects.md §2 row 1 — this lived in the blog's `astro.config.mjs`,
      // which has been deleted, so it is easy to lose with that file.
      {
        source:
          "/blog/2026-08-06-zero-to-agent-microsoft-foundry-series-kickoff",
        destination: "/blog/2026-08-06-part-1-kicking-off-the-series",
        permanent: true,
      },
      // redirects.md §2 row 2 — the v2.0.0 content move renamed this post and
      // corrected its publishedDate by a day. The corrected date is kept.
      {
        source: "/blog/2026-02-11-welcome",
        destination: "/blog/2026-02-10-welcome",
        permanent: true,
      },
      // `/sessions` existed only on the v2.0.0 branch and was never the
      // published URL — `/events` was, and is again. The rule is kept so links
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
};

export default nextConfig;
