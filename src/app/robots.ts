import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { indexable } from "@/lib/seo";

// Crawlers named on purpose: Cipola wants to be found and cited by search
// engines and AI assistants. A crawler follows only its own group, so each one
// repeats the /api/ block. None of this guarantees a listing or a citation.
const crawlers = [
  // Search engines.
  "Googlebot",
  "Bingbot",
  "Applebot",
  "DuckDuckBot",
  // AI search and answers.
  "OAI-SearchBot",
  "Claude-SearchBot",
  "PerplexityBot",
  // Fetches made when a person asks an assistant about a page.
  "ChatGPT-User",
  "Claude-User",
  "Perplexity-User",
  // Model training. Remove from this list to opt out of training only.
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      { userAgent: crawlers, allow: "/", disallow: "/api/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
