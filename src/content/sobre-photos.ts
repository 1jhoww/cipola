// Photo slots for the /sobre page. Each slot keeps its place and proportion in
// the layout, so adding a real photograph only needs its `src` (and an `alt`
// that describes the actual picture). Put the files in public/images/sobre/.
// While `src` is null, the page shows a labelled placeholder instead.
// Real family photos take their native proportion as `ratio`, so none is cropped.
// Never use photos of other people to stand in for Joaquim or Rafael.
export type PhotoSlot = {
  src: string | null;
  alt: string;
  // What the photo should show; printed on the placeholder.
  purpose: string;
  // CSS aspect-ratio of the frame, e.g. "4 / 5".
  ratio: string;
  // Optional focal point for the crop, e.g. "50% 30%".
  position?: string;
};

export const sobrePhotos = {
  hero: {
    src: "/images/sobre/familia-cipola.jpg",
    alt: "Família Cipola reunida, com Joaquim Cipola à direita",
    purpose: "Família Cipola ou fachada e estrutura da marmoraria",
    ratio: "1600 / 878",
  },
  maquinario: {
    src: "/images/sobre/ponte-de-corte.jpg",
    alt: "Ponte de corte da Cipola no galpão, com o disco sobre a mesa e chapas apoiadas ao fundo",
    purpose: "Maquinário de corte, plano aberto",
    ratio: "1280 / 960",
  },
  producao: {
    src: "/images/sobre/corte-de-bancada.jpg",
    alt: "Bancada de granito escuro sendo cortada com serra refrigerada a água",
    purpose: "Produção em andamento",
    ratio: "1280 / 960",
  },
  recorte: {
    src: "/images/sobre/recorte-de-cuba.jpg",
    alt: "Profissional da Cipola abrindo o recorte da cuba em uma bancada escura, com brocas e discos de polimento sobre a pedra",
    purpose: "Recorte e acabamento de bancada",
    ratio: "1280 / 960",
  },
  joaquim: {
    src: "/images/sobre/joaquim-cipola.jpg",
    alt: "Retrato de Joaquim Cipola, sorrindo, de boné e camisa listrada",
    purpose: "Retrato de Joaquim Cipola",
    ratio: "610 / 837",
  },
  juntos: {
    src: "/images/sobre/joaquim-e-rafael.jpg",
    alt: "Joaquim e Rafael (Kaka) Cipola diante de uma chapa de granito, Rafael com a camiseta da Pedras Decorativas Irmãos Cipola",
    purpose: "Joaquim e Rafael (Kaka) Cipola juntos",
    ratio: "836 / 642",
  },
  rafael: {
    src: "/images/sobre/rafael-cipola.jpg",
    alt: "Retrato de Rafael (Kaka) Cipola, de camisa branca, com o mar e as montanhas ao fundo",
    purpose: "Retrato de Rafael (Kaka) Cipola",
    ratio: "1122 / 1402",
  },
} satisfies Record<string, PhotoSlot>;
