import type { NextConfig } from "next";
const config: NextConfig = {
  // Optional separate build folder, so parallel previews don't overwrite each other.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimized variants of photos that rarely change stay cached for 31 days.
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    // The about page moved from /a-cipola to /sobre.
    return [
      { source: "/a-cipola", destination: "/sobre", permanent: true },
      // The architects page was removed; old links land on the home page.
      { source: "/arquitetos", destination: "/", permanent: true },
    ];
  },
  async headers() {
    // Files in public/ have no content hash in their names, so a week of cache
    // plus a month of background revalidation, rather than immutable.
    const staticCache = {
      key: "Cache-Control",
      value: "public, max-age=604800, stale-while-revalidate=2592000",
    };
    return [
      { source: "/images/:path*", headers: [staticCache] },
      { source: "/textures/:path*", headers: [staticCache] },
      { source: "/brand/:path*", headers: [staticCache] },
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
