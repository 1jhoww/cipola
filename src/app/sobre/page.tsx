import { About } from "@/components/sobre/About";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, webPageJsonLd } from "@/lib/seo";

const title = "Nossa História desde 1992 | Cipola Mármores e Granitos";
const description =
  "Fundada em 1992 por Joaquim Cipola e hoje conduzida por Rafael Cipola, a marmoraria une tradição familiar, estrutura própria e acabamento preciso em pedra.";

export const metadata = pageMetadata({
  title,
  description,
  path: "/sobre",
  image: {
    url: "/images/sobre/familia-cipola.jpg",
    width: 1600,
    height: 878,
    alt: "Família Cipola reunida",
  },
});

export default function Page() {
  return (
    <>
      <JsonLd
        graph={webPageJsonLd({
          path: "/sobre",
          name: title,
          description,
          type: "AboutPage",
          image: {
            url: "/images/sobre/familia-cipola.jpg",
            width: 1600,
            height: 878,
            alt: "Família Cipola reunida, com Joaquim Cipola à direita",
          },
          breadcrumb: [{ name: "A Cipola", path: "/sobre" }],
        })}
      />
      <About />
    </>
  );
}
