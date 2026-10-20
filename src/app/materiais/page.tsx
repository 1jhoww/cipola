import type { Metadata } from "next";
import { MaterialCatalog } from "@/components/materials/MaterialCatalog";
import s from "@/components/materials/catalog.module.css";
export const metadata: Metadata = {
  title: "Catálogo de pedras",
  description:
    "Explore os 11 materiais da seleção Cipola. Conheça as texturas, tonalidades e possibilidades de cada pedra no ambiente.",
  alternates: { canonical: "/materiais" },
};
export default function Page() {
  return (
    <>
      <MaterialCatalog />
      <p className={s.notice}>
        Imagens de referência obtidas em catálogos públicos. Veios e
        tonalidades variam entre chapas. Disponibilidade, acabamentos e
        aplicações devem ser confirmados com a Cipola.
      </p>
    </>
  );
}
