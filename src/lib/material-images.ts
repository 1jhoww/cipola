import registry from "@/content/material-images.json";
import { materials } from "./data";
import { environments, type EnvironmentImage } from "./environments";

// Static registry written by scripts/generate-material-images.mjs when an image is approved.
// Pages never call the image provider: they only read these pre-generated assets.
type RegistryEntry = { src: string; width: number; height: number };
const images = registry.images as Record<
  string,
  Partial<Record<string, RegistryEntry>>
>;

export function materialApplicationImages(slug: string): EnvironmentImage[] {
  const material = materials.find((m) => m.slug === slug);
  if (!material) return [];
  return environments.flatMap((environment) => {
    const entry = images[slug]?.[environment.id];
    return entry
      ? [
          {
            environment: environment.id,
            src: entry.src,
            width: entry.width,
            height: entry.height,
            alt: `${environment.name} com ${material.name}`,
            simulation: true as const,
          },
        ]
      : [];
  });
}
