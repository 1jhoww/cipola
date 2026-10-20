// Shared by the cookie banner and the privacy and cookie policies.
// Update the date whenever either policy changes.
export const legalUpdated = "19 de outubro de 2026";

export type CookieCategory = "necessary" | "analytics" | "marketing";

export const cookieCategories: {
  id: CookieCategory;
  title: string;
  description: string;
  tools?: string;
}[] = [
  {
    id: "necessary",
    title: "Necessários",
    description:
      "Garantem o funcionamento e a segurança do site e guardam a sua escolha sobre cookies. Não podem ser desativados.",
  },
  {
    id: "analytics",
    title: "Análise e desempenho",
    description:
      "Mostram, de forma agregada, como o site é usado: páginas visitadas, tempo de navegação, dispositivo e origem do acesso. Usamos essas informações para melhorar conteúdo e navegação.",
    tools: "Google Analytics",
  },
  {
    id: "marketing",
    title: "Publicidade e marketing",
    description:
      "Medem o resultado das nossas campanhas e permitem exibir anúncios da Cipola a quem já visitou o site, no Google (Pesquisa, YouTube e sites parceiros) e na Meta (Facebook e Instagram).",
    tools: "Google Ads, Meta Pixel",
  },
];

export const cookieTable: {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
  category: CookieCategory;
}[] = [
  {
    name: "cipola_consent",
    provider: "Cipola",
    purpose: "Guarda suas escolhas sobre cookies e a data do consentimento.",
    duration: "12 meses",
    category: "necessary",
  },
  {
    name: "_ga",
    provider: "Google Analytics",
    purpose: "Distingue visitantes por um identificador aleatório.",
    duration: "2 anos",
    category: "analytics",
  },
  {
    name: "_ga_<ID>",
    provider: "Google Analytics",
    purpose: "Mantém o estado da sessão de navegação.",
    duration: "2 anos",
    category: "analytics",
  },
  {
    name: "_gcl_au",
    provider: "Google Ads",
    purpose: "Associa visitas e pedidos de orçamento aos anúncios do Google.",
    duration: "90 dias",
    category: "marketing",
  },
  {
    name: "_gcl_aw",
    provider: "Google Ads",
    purpose: "Guarda o identificador do clique em um anúncio (gclid).",
    duration: "90 dias",
    category: "marketing",
  },
  {
    name: "IDE, NID, AID e similares",
    provider: "Google (domínios google.com e doubleclick.net)",
    purpose: "Exibição, limitação de frequência e medição de anúncios.",
    duration: "Até 13 meses",
    category: "marketing",
  },
  {
    name: "_fbp",
    provider: "Meta",
    purpose: "Identifica o navegador para entrega e medição de anúncios.",
    duration: "90 dias",
    category: "marketing",
  },
  {
    name: "_fbc",
    provider: "Meta",
    purpose: "Guarda o identificador do clique em um anúncio (fbclid).",
    duration: "90 dias",
    category: "marketing",
  },
  {
    name: "fr",
    provider: "Meta (domínio facebook.com)",
    purpose: "Entrega, medição e relevância de anúncios.",
    duration: "90 dias",
    category: "marketing",
  },
];
