import { MaterialCatalog } from "@/components/materials/MaterialCatalog";
import { JsonLd } from "@/components/JsonLd";
import { materials } from "@/lib/data";
import { absoluteUrl, pageMetadata, webPageJsonLd } from "@/lib/seo";
import s from "@/components/materials/catalog.module.css";
const title = "Catálogo de Mármores, Granitos e Quartzos | Cipola";
const description = `Compare ${materials.length} pedras da Cipola: granitos, mármores, quartzos, travertinos, ônix e nanoglass, em 3D e em ambientes. Bancadas sob medida para Cotia e região.`;
export const metadata = pageMetadata({ title, description, path: "/materiais" });
export default function Page() {
  return (
    <>
      <JsonLd
        graph={[
          ...webPageJsonLd({
            path: "/materiais",
            name: title,
            description,
            type: "CollectionPage",
            breadcrumb: [{ name: "Catálogo", path: "/materiais" }],
          }),
          {
            "@type": "ItemList",
            name: "Pedras da seleção Cipola",
            itemListElement: materials.map((m, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: m.name,
              url: absoluteUrl(`/materiais/${m.slug}`),
            })),
          },
        ]}
      />
      <MaterialCatalog />
      <p className={s.notice}>
        Imagens de referência obtidas em catálogos públicos. Veios e
        tonalidades variam entre chapas. Disponibilidade, acabamentos e
        aplicações devem ser confirmados com a Cipola.
      </p>
    </>
  );
}
