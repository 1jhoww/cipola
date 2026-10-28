import { Home } from "@/components/Home";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata, servicesJsonLd, webPageJsonLd } from "@/lib/seo";
const title = "Marmoraria em Cotia e Região | Mármores e Granitos — Cipola";
const description =
  "Marmoraria familiar desde 1992. Bancadas sob medida em mármore, granito e quartzo, com fabricação própria. Atendemos Vargem Grande Paulista, Cotia e região.";
export const metadata = pageMetadata({ title, description, path: "/" });
export default function Page() {
  return (
    <>
      <JsonLd
        graph={[
          ...webPageJsonLd({ path: "/", name: title, description }),
          ...servicesJsonLd(),
        ]}
      />
      <Home />
    </>
  );
}
