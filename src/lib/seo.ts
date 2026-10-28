import type { Metadata } from "next";
import { services } from "./data";
import { mapsLink, site } from "./site";

// Only production is indexed. Vercel previews and NEXT_PUBLIC_NOINDEX=1 stay out of search.
export const indexable =
  process.env.NEXT_PUBLIC_NOINDEX !== "1" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

export const absoluteUrl = (path = "/") =>
  new URL(path, `${site.url}/`).toString();

// Stable schema.org identifiers, so every page points at the same entities.
export const ids = {
  business: absoluteUrl("/#empresa"),
  website: absoluteUrl("/#site"),
  logo: absoluteUrl("/#logo"),
  founder: absoluteUrl("/sobre#joaquim-cipola"),
  manager: absoluteUrl("/sobre#rafael-cipola"),
};

// A real work, cropped to 1200×630 for link previews.
export const defaultImage = {
  url: "/og/cipola.jpg",
  width: 1200,
  height: 630,
  alt: "Área gourmet com ilha e bancada de churrasqueira em granito, obra da Cipola",
};

type Image = { url: string; width?: number; height?: number; alt?: string };

// Title, description, canonical and social cards for one page. Titles are
// absolute, so each page controls its full text.
export function pageMetadata({
  title,
  description,
  path,
  image = defaultImage,
}: {
  title: string;
  description: string;
  path: string;
  image?: Image;
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.name,
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

// Served cities, each tied to the state so "São Paulo" reads as the city.
// Described once on the business; services point at them by @id.
const cityId = (name: string) =>
  absoluteUrl(
    `/#cidade-${name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/ /g, "-")}`,
  );
const cities = () =>
  site.areaServed.map((name) => ({
    "@type": "City",
    "@id": cityId(name),
    name,
    containedInPlace: { "@type": "State", name: "São Paulo" },
  }));
const cityRefs = () => site.areaServed.map((name) => ({ "@id": cityId(name) }));

// "+55 11 5286-8881" from "(11) 5286-8881".
const e164 = (display: string) => `+55 ${display.replace(/[()]/g, "")}`;

export function businessJsonLd() {
  const a = site.postalAddress;
  return {
    "@type": "HomeAndConstructionBusiness",
    "@id": ids.business,
    name: site.name,
    alternateName: site.alternateNames,
    legalName: site.legalName,
    taxID: site.cnpj,
    description: site.description,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      "@id": ids.logo,
      url: absoluteUrl("/brand/cipola-logo.png"),
      width: 1200,
      height: 322,
      caption: site.name,
    },
    image: [
      absoluteUrl(defaultImage.url),
      absoluteUrl("/images/sobre/ponte-de-corte.jpg"),
      absoluteUrl("/images/projetos/cozinha-ilha-branca.webp"),
    ],
    telephone: e164(site.phone.display),
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.street} - ${a.district}`,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    hasMap: mapsLink(site.address),
    areaServed: [...cities(), { "@type": "Place", name: "Granja Viana, Cotia" }],
    contactPoint: site.whatsapp.map((w) => ({
      "@type": "ContactPoint",
      contactType: "sales",
      name: `WhatsApp ${w.name}`,
      telephone: e164(w.display),
      availableLanguage: "pt-BR",
    })),
    ...(site.openingHours.length > 0 && {
      openingHoursSpecification: site.openingHours.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
        opens: h.opens,
        closes: h.closes,
      })),
    }),
    foundingDate: site.foundingYear,
    founder: { "@type": "Person", "@id": ids.founder, name: site.founder },
    employee: {
      "@type": "Person",
      "@id": ids.manager,
      name: site.manager.name,
      alternateName: site.manager.nickname,
      jobTitle: "Responsável pela empresa",
    },
    knowsAbout: [
      "Mármore",
      "Granito",
      "Quartzo",
      "Porcelanato",
      "Travertino",
      "Ônix",
      "Nanoglass",
      "Pedras naturais",
      "Bancadas sob medida",
    ],
    sameAs: site.sameAs,
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: absoluteUrl("/"),
    name: site.name,
    alternateName: site.alternateNames,
    inLanguage: "pt-BR",
    publisher: { "@id": ids.business },
  };
}

export function servicesJsonLd() {
  return services.map((s, i) => ({
    "@type": "Service",
    "@id": absoluteUrl(`/#servico-${i + 1}`),
    name: s.name,
    description: s.description,
    provider: { "@id": ids.business },
    areaServed: cityRefs(),
  }));
}

export function webPageJsonLd({
  path,
  name,
  description,
  type = "WebPage",
  image,
  breadcrumb,
}: {
  path: string;
  name: string;
  description: string;
  type?: string;
  image?: Image;
  breadcrumb?: { name: string; path: string }[];
}) {
  const url = absoluteUrl(path);
  const nodes: object[] = [
    {
      "@type": type,
      "@id": `${url}#pagina`,
      url,
      name,
      description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": ids.website },
      about: { "@id": ids.business },
      ...(image && {
        primaryImageOfPage: {
          "@type": "ImageObject",
          contentUrl: absoluteUrl(image.url),
          ...(image.width && { width: image.width, height: image.height }),
          ...(image.alt && { caption: image.alt }),
        },
      }),
      ...(breadcrumb && { breadcrumb: { "@id": `${url}#trilha` } }),
    },
  ];
  if (breadcrumb)
    nodes.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#trilha`,
      itemListElement: [{ name: "Início", path: "/" }, ...breadcrumb].map(
        (item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        }),
      ),
    });
  return nodes;
}
