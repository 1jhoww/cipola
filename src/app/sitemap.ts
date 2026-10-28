import type { MetadataRoute } from "next";
import { materials, projects } from "@/lib/data";
import { site } from "@/lib/site";
import { absoluteUrl, indexable } from "@/lib/seo";
// Every public, indexable page. New stones and works join through data.ts.
// No lastmod: the pages carry no real edit date yet.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];
  return [
    "/",
    "/sobre",
    "/materiais",
    "/projetos",
    "/contato",
    ...materials.map((m) => `/materiais/${m.slug}`),
    ...projects.map((p) => `/projetos/${p.slug}`),
    "/privacidade",
    "/cookies",
  ].map((path) => ({
    // The home canonical has no trailing slash; keep the sitemap identical.
    url: path === "/" ? site.url : absoluteUrl(path),
  }));
}
