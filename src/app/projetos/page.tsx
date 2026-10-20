import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { Catalog } from "@/components/Catalog";
import s from "@/components/pages.module.css";
export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Obras da Cipola em cozinhas, banheiros, áreas gourmet e outros ambientes.",
  alternates: { canonical: "/projetos" },
};
export default function Page() {
  return (
    <>
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
