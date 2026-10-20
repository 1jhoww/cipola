import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { materials, similarMaterials } from "@/lib/data";
import { materialApplicationImages } from "@/lib/material-images";
import { Breadcrumb } from "@/components/PageIntro";
import { MaterialObject } from "@/components/materials/MaterialObject";
import { EnvironmentGallery } from "@/components/materials/EnvironmentGallery";
import { ScrollRow } from "@/components/ScrollRow";
import { WhatsAppQuote } from "@/components/WhatsAppQuote";
import s from "@/components/materials/material.module.css";
import p from "@/components/pages.module.css";
export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = materials.find((item) => item.slug === slug);
  return {
    title: material?.name || "Material",
    description: material?.description,
    alternates: { canonical: `/materiais/${slug}` },
    openGraph: material
      ? {
          title: `${material.name} | Cipola`,
          description: material.description,
          images: [material.texture],
        }
      : undefined,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = materials.find((item) => item.slug === slug);
  if (!material) notFound();
  // The 3D slab and its placeholder use this file; start it with the HTML.
  preload(material.texture, { as: "image", fetchPriority: "high" });
  // Every stone's rooms, so the environment view can swap stones in the same room.
  const catalog = Object.fromEntries(
    materials.map((item) => [item.slug, materialApplicationImages(item.slug)]),
  );
  const similar = similarMaterials(material);
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Catálogo", href: "/materiais" },
          { label: material.name },
        ]}
      />
      <section className={s.hero}>
        <div className={s.intro}>
          <p className="eyebrow">{material.category} / SELEÇÃO CIPOLA</p>
          <h1>{material.name}</h1>
          <p>{material.description}</p>
          <WhatsAppQuote material={material.name} className="button button-vein">
            Pedir orçamento pelo WhatsApp <span aria-hidden="true">↗︎</span>
          </WhatsAppQuote>
        </div>
        <MaterialObject key={material.slug} material={material} />
      </section>
      <EnvironmentGallery
        key={material.slug}
        material={material}
        catalog={catalog}
      />
      <div className={s.technical}>
        <div className={p.specs}>
          <div>
            <p className="eyebrow">A MATÉRIA EM DETALHE</p>
            <h2>
              Conheça a pedra.
              <br />
              Converse sobre o uso.
            </h2>
            <p>
              A escolha final considera o lote, o uso do espaço, a manutenção e
              as condições da obra. Acabamentos e aplicações são avaliados para
              cada projeto.
            </p>
            <p className={s.sampleNote}>
              A pedra em 3D usa uma textura real de referência, com dimensões e
              acabamento ilustrativos. Confirme sempre na amostra física.
            </p>
            {material.slug === "onix-cristal" && (
              <p className={p.notice}>
                A textura mostra uma referência de ônix translúcido. Confirme
                com a equipe a variedade comercial Ônix Cristal.
              </p>
            )}
          </div>
          <dl>
            <div>
              <dt>Material</dt>
              <dd>{material.name}</dd>
            </div>
            <div>
              <dt>Categoria</dt>
              <dd>{material.category}</dd>
            </div>
            <div>
              <dt>Aspecto de referência</dt>
              <dd>{material.character}</dd>
            </div>
            <div>
              <dt>Acabamentos</dt>
              <dd>Sob consulta</dd>
            </div>
            <div>
              <dt>Espessuras e dimensões</dt>
              <dd>Conforme a chapa</dd>
            </div>
            <div>
              <dt>Aplicações indicadas</dt>
              <dd>Avaliação técnica por projeto</dd>
            </div>
          </dl>
        </div>
      </div>
      <section className={s.similar} aria-labelledby="similar-title">
        <h2 id="similar-title">Pedras parecidas</h2>
        <ScrollRow label="Pedras parecidas" className={s.similarGrid}>
          {similar.map((item) => (
            <Link
              key={item.slug}
              href={`/materiais/${item.slug}`}
              className={s.similarItem}
            >
              <span className={s.similarImage}>
                <Image
                  src={item.texture}
                  alt={`Amostra de ${item.name}`}
                  fill
                  sizes="(max-width: 700px) 80vw, 30vw"
                />
              </span>
              <h3>{item.name}</h3>
              <p>
                {item.category}, {item.character.toLowerCase().replace(" · ", " e ")}
              </p>
            </Link>
          ))}
        </ScrollRow>
      </section>
      <div className={s.related}>
        <Link href="/materiais" className="button">
          Todos os materiais
        </Link>
        <WhatsAppQuote material={material.name} className="button button-vein">
          Pedir orçamento de {material.name} <span aria-hidden="true">↗︎</span>
        </WhatsAppQuote>
      </div>
    </>
  );
}
