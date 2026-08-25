import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
