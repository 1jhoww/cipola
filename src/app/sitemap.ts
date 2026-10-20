import type { MetadataRoute } from "next";
import { materials, projects } from "@/lib/data";
import { site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  return [
    "",
    "/sobre",
    "/materiais",
    "/projetos",
    "/contato",
    "/privacidade",
    "/cookies",
    ...materials.map((m) => `/materiais/${m.slug}`),
    ...projects.map((p) => `/projetos/${p.slug}`),
  ].map((path) => ({ url: `${site.url}${path}` }));
}
