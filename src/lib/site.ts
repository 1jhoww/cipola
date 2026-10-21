export const site = {
  name: "Cipola Mármores e Granitos",
  description:
    "A natureza cria. A Cipola transforma. Pedras, possibilidades e execução sob medida para o seu projeto.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "kakacipola@gmail.com",
  // WhatsApp numbers with country code; display keeps the local format.
  // The first one receives the quotes; the others get a "send too" button.
  whatsapp: [
    { name: "Juliana", number: "5511978975025", display: "(11) 97897-5025" },
    { name: "Rafael (Kaka)", number: "5511971597501", display: "(11) 97159-7501" },
  ],
  // Landline, for calls.
  phone: { number: "551152868881", display: "(11) 5286-8881" },
  address:
    process.env.NEXT_PUBLIC_ADDRESS ||
    "Av. Madagascar, 470 - Jardim Margarida, Vargem Grande Paulista - SP, 06730-000",
  serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA || "",
  // Data controller identification for the privacy policy (LGPD art. 9).
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME || "Cipola Mármores e Granitos",
  cnpj: process.env.NEXT_PUBLIC_CNPJ || "59.260.871/0001-97",
  privacyEmail:
    process.env.NEXT_PUBLIC_PRIVACY_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "kakacipola@gmail.com",
  dpoName: process.env.NEXT_PUBLIC_DPO_NAME || "",
  // Ad and analytics IDs. Each tag loads only after cookie consent.
  tracking: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || "",
    adsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "",
    adsLeadLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  },
  // Populate only with information approved by Cipola.
  history: null as string | null,
  team: [] as { name: string; role: string; image: string }[],
  facility: null as string | null,
};
// Studio credit, same as the other Hepta Studios sites.
export const developerCredit = {
  name: "Hepta Studios",
  logoSrc: "/brand/hepta-studios.webp",
  website: "https://www.heptastudios.com.br/",
  instagramUrl: "https://www.instagram.com/hepta_studios/",
  instagramHandle: "@hepta_studios",
};
// "Início" stays in the menu: not everyone knows the logo leads home.
export const navigation = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "A Cipola" },
  { href: "/materiais", label: "Catálogo" },
  { href: "/projetos", label: "Projetos" },
];

// Opens a WhatsApp chat with a first message, so leads from the site are easy to spot.
export function whatsappLink(
  number: string,
  text = "Olá! Vim pelo site da Cipola e gostaria de um orçamento.",
) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

// Quote button on a stone: straight to the first WhatsApp (Juliana), no form to fill.
export function materialQuoteLink(materialName: string) {
  return whatsappLink(
    site.whatsapp[0].number,
    `Olá! Vim pelo site da Cipola e quero um orçamento de um projeto com ${materialName}.`,
  );
}

export function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
