export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export const weekdayLabels: Record<Weekday, string> = {
  Monday: "segunda",
  Tuesday: "terça",
  Wednesday: "quarta",
  Thursday: "quinta",
  Friday: "sexta",
  Saturday: "sábado",
  Sunday: "domingo",
};
export const site = {
  name: "Cipola Mármores e Granitos",
  // Other names people search for; the Instagram handle and domain say "Cipola Marmoraria".
  alternateNames: ["Cipola", "Marmoraria Cipola", "Cipola Marmoraria"],
  description:
    "Marmoraria familiar fundada em 1992. Bancadas, ilhas, lavatórios e revestimentos sob medida em mármore, granito, quartzo e porcelanato, com estrutura própria de corte e acabamento. Sede em Vargem Grande Paulista, ao lado de Cotia.",
  // Canonical origin. The apex domain and plain http redirect here.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.cipolamarmoraria.com.br",
  foundingYear: "1992",
  founder: "Joaquim Cipola",
  // "Kaka" is how clients know Rafael.
  manager: { name: "Rafael Cipola", nickname: "Kaka" },
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "kakacipola@gmail.com",
  // WhatsApp numbers with country code; display keeps the local format.
  // The first one receives the quotes; the others get a "send too" button.
  whatsapp: [
    { name: "Juliana", number: "5511978975025", display: "(11) 97897-5025" },
    { name: "Rafael (Kaka)", number: "5511971597501", display: "(11) 97159-7501" },
  ],
  // Landline, for calls.
  phone: { number: "551152868881", display: "(11) 5286-8881" },
  // Same address as `address`, split for schema.org. Keep both in sync with the
  // Google Business Profile.
  postalAddress: {
    street: "Av. Madagascar, 470",
    district: "Jardim Margarida",
    city: "Vargem Grande Paulista",
    region: "SP",
    postalCode: "06730-000",
    country: "BR",
  },
  address:
    "Av. Madagascar, 470 - Jardim Margarida, Vargem Grande Paulista - SP, 06730-000",
  // Point of the storefront at no. 470, checked on Google Maps and Street View.
  geo: { latitude: -23.617829, longitude: -47.042828 },
  // Cities confirmed by Cipola, the two priorities first. Granja Viana is part of Cotia.
  areaServed: [
    "Vargem Grande Paulista",
    "Cotia",
    "Itapevi",
    "Jandira",
    "Barueri",
    "Carapicuíba",
    "Santana de Parnaíba",
    "Embu das Artes",
    "São Roque",
    "Araçariguama",
    "São Paulo",
  ],
  serviceArea:
    process.env.NEXT_PUBLIC_SERVICE_AREA ||
    "Atendemos Vargem Grande Paulista e Cotia, incluindo a Granja Viana, além de Itapevi, Jandira, Barueri, Carapicuíba, Santana de Parnaíba, Embu das Artes, São Roque, Araçariguama e São Paulo.",
  // Confirmed by Cipola. Closed on Sundays.
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "18:00" },
    { days: ["Friday"], opens: "08:00", closes: "17:00" },
    { days: ["Saturday"], opens: "08:00", closes: "12:00" },
  ] as { days: Weekday[]; opens: string; closes: string }[],
  instagram: {
    url: "https://www.instagram.com/cipolamarmoraria/",
    handle: "@cipolamarmoraria",
  },
  // Other profiles of this same business, for schema.org sameAs. Add the Google
  // Business Profile once its name, address and phone match the site.
  sameAs: ["https://www.instagram.com/cipolamarmoraria/"],
  // Search Console and Bing Webmaster Tools tokens, set in the hosting panel.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "",
    bing: process.env.BING_SITE_VERIFICATION || "",
  },
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

// "segunda a quinta, 08:00–18:00 · … · domingo, fechado". Days in each entry are consecutive.
export function openingHoursText() {
  if (!site.openingHours.length) return "";
  const open = site.openingHours.flatMap((h) => h.days);
  const closed = (Object.keys(weekdayLabels) as Weekday[]).filter(
    (d) => !open.includes(d),
  );
  return [
    ...site.openingHours.map(({ days, opens, closes }) => {
      const first = weekdayLabels[days[0]];
      const last = weekdayLabels[days[days.length - 1]];
      return `${days.length > 1 ? `${first} a ${last}` : first}, ${opens}–${closes}`;
    }),
    ...closed.map((d) => `${weekdayLabels[d]}, fechado`),
  ].join(" · ");
}

export function mapsLink(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
