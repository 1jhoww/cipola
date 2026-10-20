import type { NextConfig } from "next";
const config: NextConfig = {
  // Optional separate build folder, so parallel previews don't overwrite each other.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    // The about page moved from /a-cipola to /sobre.
    return [
      { source: "/a-cipola", destination: "/sobre", permanent: true },
      // The architects page was removed; old links land on the home page.
      { source: "/arquitetos", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default config;
