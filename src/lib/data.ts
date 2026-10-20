export type Material = {
  slug: string;
  name: string;
  category:
    | "Mármore"
    | "Granito"
    | "Quartzo"
    | "Travertino"
    | "Ônix"
    | "Nanoglass";
  color: string;
  texture: string;
  description: string;
  character: string;
  finishes: string[];
  applications: string[];
  demo: boolean;
  maps?: { normal?: string; roughness?: string };
  slabSize: [number, number, number];
  textureScale: number;
  surface: { roughness: number; clearcoat: number; ior: number };
};
const suppliedCatalog: [
  string,
  string,
  Material["category"],
  string,
  string,
][] = [
  [
    "branco-itaunas",
    "Branco Itaúnas",
    "Granito",
    "#d4cbb7",
    "Claro · Granulado",
  ],
  ["branco-dallas", "Branco Dallas", "Granito", "#ded9cb", "Claro · Granulado"],
  [
    "quartzo-branco",
    "Quartzo Branco",
    "Quartzo",
    "#eeede7",
    "Claro · Uniforme",
  ],
  [
    "santa-cecilia",
    "Santa Cecília",
    "Granito",
    "#b69c71",
    "Quente · Granulado",
  ],
  ["verde-ubatuba", "Verde Ubatuba", "Granito", "#303b29", "Verde · Granulado"],
  [
    "preto-sao-gabriel",
    "Preto São Gabriel",
    "Granito",
    "#333631",
    "Escuro · Granulado",
  ],
  [
    "preto-absoluto",
    "Preto Absoluto",
    "Granito",
    "#20211e",
    "Escuro · Uniforme",
  ],
  ["marmore-branco", "Mármore Branco", "Mármore", "#e5e1d9", "Claro · Veios"],
  [
    "branco-stelar",
    "Branco Stelar",
    "Quartzo",
    "#e7e5df",
    "Claro · Pontilhado",
  ],
  [
    "travertino",
    "Travertino Nacional",
    "Travertino",
    "#cdb99c",
    "Quente · Texturado",
  ],
  [
    "travertino-romano",
    "Travertino Romano",
    "Travertino",
    "#d0b596",
    "Quente · Texturado",
  ],
  ["onix-cristal", "Ônix Cristal", "Ônix", "#e4dac6", "Claro · Veios"],
  [
    "quartzo-calacata",
    "Quartzo Calacata",
    "Quartzo",
    "#e9eaec",
    "Claro · Veios",
  ],
  [
    "quartzo-calacata-gold",
    "Quartzo Calacata Gold",
    "Quartzo",
    "#f1eee9",
    "Claro · Veios",
  ],
  [
    "cafe-imperial",
    "Café Imperial",
    "Granito",
    "#4f4139",
    "Escuro · Granulado",
  ],
  ["nanoglass", "Nanoglass", "Nanoglass", "#f4f3f0", "Claro · Uniforme"],
];
export const materials: Material[] = suppliedCatalog.map(
  ([slug, name, category, color, character]) => ({
    slug,
    name,
    category,
    color,
    texture: `/textures/${slug}.jpg`,
    character,
    description: `${name} faz parte da seleção da Cipola. Explore a referência visual e converse com a equipe sobre chapas disponíveis, acabamentos e adequação ao seu projeto.`,
    finishes: [],
    applications: [],
    demo: false,
    slabSize: [2.8, 1.8, 0.03],
    textureScale: category === "Granito" || category === "Quartzo" ? 0.8 : 1.8,
    surface: { roughness: 0.24, clearcoat: 0.2, ior: 1.5 },
  }),
);
// Stones that read alike: same tone first ("Claro", "Escuro"…), then same category,
// then the closest swatch colour, so a one-of-a-kind tone still gets near neighbours.
export function similarMaterials(material: Material, count = 3): Material[] {
  const tone = (m: Material) => m.character.split(" · ")[0];
  const rgb = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const target = rgb(material.color);
  const distance = (m: Material) =>
    rgb(m.color).reduce((sum, c, i) => sum + (c - target[i]) ** 2, 0);
  const score = (m: Material) =>
    (tone(m) === tone(material) ? 2 : 0) +
    (m.category === material.category ? 1 : 0);
  return materials
    .filter((m) => m.slug !== material.slug)
    .map((m) => ({ m, score: score(m), distance: distance(m) }))
    .sort((a, b) => b.score - a.score || a.distance - b.distance)
    .slice(0, count)
    .map(({ m }) => m);
}
export type Project = {
  slug: string;
  name: string;
  category: "Residencial" | "Comercial";
  space: string;
  image: string;
  // Intrinsic size of `image`, so it is shown whole and never enlarged.
  width: number;
  height: number;
  description: string;
  material: string;
  details: [string, string][];
  gallery: GalleryImage[];
  demo: boolean;
};
export type GalleryImage = {
  image: string;
  alt: string;
  width: number;
  height: number;
};
// Pixel size of each published photo in public/images/projetos.
const photoSizes: Record<string, [number, number]> = {
  "cozinha-ilha-branca": [1368, 2000],
  "area-gourmet-verde-ubatuba": [1440, 1440],
  "bar-pedra-ametista": [960, 960],
  "area-gourmet-ilha-branca": [1440, 1440],
  "area-gourmet-preto-absoluto": [1440, 1800],
  "banheira-marmore-branco": [2000, 1500],
  "banheiro-cuba-esculpida": [1334, 1334],
  "banheiro-bancada-escura": [1333, 2000],
  lareira: [1440, 1440],
  "lavatorio-esculpido": [1334, 1334],
  "cozinha-bancada-branca": [1440, 1440],
};
// Works executed by Cipola. Photos supplied by the client; stone names come
// from the original file names. `material` links to the catalog when the stone is in it.
const work = (
  slug: string,
  name: string,
  space: string,
  stone: string,
  material: string,
  application: string,
  description: string,
): Project => {
  const [width, height] = photoSizes[slug];
  const image = `/images/projetos/${slug}.webp`;
  return {
    slug,
    name,
    category: "Residencial",
    space,
    image,
    width,
    height,
    material,
    description,
    details: [
      ["Ambiente", space],
      ["Pedra", stone],
      ["Aplicação", application],
    ],
    gallery: [{ image, alt: `${name}, obra Cipola`, width, height }],
    demo: false,
  };
};
export const projects: Project[] = [
  work(
    "cozinha-ilha-branca",
    "Cozinha em Quartzo Calacata Gold",
    "Cozinha",
    "Quartzo Calacata Gold",
    "quartzo-calacata-gold",
    "Ilha, bancada e frontão",
    "Ilha com lateral até o piso, bancada e frontão em Quartzo Calacata Gold, com os veios marcados acompanhando as peças.",
  ),
  work(
    "area-gourmet-verde-ubatuba",
    "Área gourmet em Verde Ubatuba",
    "Área gourmet",
    "Verde Ubatuba",
    "verde-ubatuba",
    "Bancada de churrasqueira e ilha",
    "Bancada de churrasqueira e ilha em granito Verde Ubatuba, com cuba e cooktop embutidos.",
  ),
  work(
    "bar-pedra-ametista",
    "Bar com mesa em Pedra Ametista",
    "Bar",
    "Pedra Ametista",
    "",
    "Tampo de mesa",
    "Tampo de mesa de bar em formato orgânico, em Pedra Ametista.",
  ),
  work(
    "area-gourmet-ilha-branca",
    "Área gourmet em Quartzo Calacata",
    "Área gourmet",
    "Quartzo Calacata",
    "quartzo-calacata",
    "Ilha com cooktop",
    "Ilha de área gourmet em Quartzo Calacata, com lateral até o piso e recorte para cooktop.",
  ),
  work(
    "area-gourmet-preto-absoluto",
    "Área gourmet em Preto Absoluto",
    "Área gourmet",
    "Preto Absoluto",
    "preto-absoluto",
    "Ilha com cuba e cooktop",
    "Ilha em granito Preto Absoluto, com cuba e cooktop embutidos, em área gourmet aberta para o jardim.",
  ),
  work(
    "banheira-marmore-branco",
    "Banheira em Mármore Branco",
    "Banheiro",
    "Mármore Branco",
    "marmore-branco",
    "Revestimento de banheira e degraus",
    "Revestimento de banheira de hidromassagem e dos degraus de acesso em Mármore Branco.",
  ),
  work(
    "banheiro-cuba-esculpida",
    "Banheiro com cuba esculpida",
    "Banheiro",
    "Pedra branca",
    "",
    "Bancada com cuba esculpida",
    "Bancada com cuba esculpida em pedra branca.",
  ),
  work(
    "banheiro-bancada-escura",
    "Banheiro em Café Imperial",
    "Banheiro",
    "Café Imperial",
    "cafe-imperial",
    "Bancada com cuba de embutir",
    "Bancada em granito Café Imperial polido, com cuba de embutir sob o tampo.",
  ),
  work(
    "lareira",
    "Lareira em Travertino Romano",
    "Sala",
    "Travertino Romano",
    "travertino-romano",
    "Revestimento de lareira",
    "Revestimento e moldura de lareira em Travertino Romano.",
  ),
  work(
    "lavatorio-esculpido",
    "Lavatório esculpido em Nanoglass",
    "Banheiro",
    "Nanoglass",
    "nanoglass",
    "Cuba esculpida",
    "Cuba esculpida com fundo inclinado, em Nanoglass.",
  ),
  work(
    "cozinha-bancada-branca",
    "Cozinha com bancada em Quartzo Calacata",
    "Cozinha",
    "Quartzo Calacata",
    "quartzo-calacata",
    "Bancada com cuba dupla",
    "Bancada de cozinha em Quartzo Calacata, com cuba dupla de embutir.",
  ),
];
export const processSteps = [
  {
    title: "Escuta e seleção",
    text: "O ponto de partida é o uso do espaço. Materiais, referências e expectativas entram na mesma conversa.",
  },
  {
    title: "Medidas e projeto",
    text: "Dimensões, recortes e encontros precisam ser definidos antes da produção, conforme as condições da obra.",
  },
  {
    title: "Corte e acabamento",
    text: "A paginação dos veios e os detalhes das bordas dão forma à peça. A execução depende do material escolhido.",
  },
  {
    title: "Instalação e cuidado",
    text: "A montagem conclui o projeto. As orientações de uso e conservação devem acompanhar cada tipo de pedra.",
  },
];
