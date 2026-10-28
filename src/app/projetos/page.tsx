import { PageIntro } from "@/components/PageIntro";
import { Catalog } from "@/components/Catalog";
import { JsonLd } from "@/components/JsonLd";
import { projects } from "@/lib/data";
import { absoluteUrl, pageMetadata, webPageJsonLd } from "@/lib/seo";
import s from "@/components/pages.module.css";
const title = "Projetos em Mármore, Granito e Quartzo | Cipola";
const description =
  "Obras executadas pela Cipola: cozinhas, áreas gourmet, banheiros e lareiras com bancadas e revestimentos sob medida em pedra natural, quartzo e nanoglass.";
export const metadata = pageMetadata({ title, description, path: "/projetos" });
export default function Page() {
  return (
    <>
      <JsonLd
        graph={[
          ...webPageJsonLd({
            path: "/projetos",
            name: title,
            description,
            type: "CollectionPage",
            breadcrumb: [{ name: "Projetos", path: "/projetos" }],
          }),
          {
            "@type": "ItemList",
            name: "Obras da Cipola",
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              url: absoluteUrl(`/projetos/${p.slug}`),
            })),
          },
        ]}
      />
      <PageIntro
        eyebrow="PROJETOS / OBRAS"
        title="Obras da Cipola"
        description="Cozinhas, banheiros, áreas gourmet e outros ambientes com pedra cortada e instalada pela Cipola."
      />
      <div className={s.pageBody}>
        <Catalog kind="projects" />
      </div>
    </>
  );
}
