import type { Metadata } from "next";
import { About } from "@/components/sobre/About";
import { site } from "@/lib/site";

const description =
  "Empresa familiar de mármores e granitos fundada em 1992 por Joaquim Cipola e hoje conduzida por Rafael (Kaka) Cipola, seu filho.";

export const metadata: Metadata = {
  title: "Sobre a Cipola",
  description,
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Sobre a Cipola | Cipola Mármores e Granitos",
    description,
    url: "/sobre",
  },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  legalName: site.legalName,
  taxID: site.cnpj,
  email: site.email,
  telephone: site.whatsapp.map((w) => `+${w.number}`),
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Madagascar, 470 - Jardim Margarida",
    addressLocality: "Vargem Grande Paulista",
    addressRegion: "SP",
    postalCode: "06730-000",
    addressCountry: "BR",
  },
  ...(site.url && { url: site.url }),
  foundingDate: "1992",
  founder: { "@type": "Person", name: "Joaquim Cipola" },
  employee: {
    "@type": "Person",
    name: "Rafael Cipola",
    alternateName: "Kaka",
    jobTitle: "Responsável pela empresa",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organization).replace(/</g, "\\u003c"),
        }}
      />
      <About />
    </>
  );
}
