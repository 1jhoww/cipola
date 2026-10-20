import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { materials, projects } from "@/lib/data";
import { Breadcrumb } from "@/components/PageIntro";
import { Gallery } from "@/components/Gallery";
import s from "@/components/project.module.css";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p?.name || "Projeto",
    description: p?.description,
    alternates: { canonical: `/projetos/${slug}` },
    openGraph: p
      ? {
          title: p.name,
          description: p.description,
          images: [
            { url: p.image, width: p.width, height: p.height, alt: p.name },
          ],
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
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const stone = materials.find((m) => m.slug === p.material);
  // Same kind of space first, so a bathroom leads to other bathrooms.
  const others = projects
    .filter((o) => o.slug !== p.slug)
    .map((o, i) => ({ o, rank: (o.space === p.space ? 0 : 1) * 100 + i }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 3)
    .map(({ o }) => o);
  const quote = `/contato?tipo=${p.category}${stone ? `&material=${stone.slug}` : ""}`;
  return (
    <>
      <Breadcrumb
        items={[{ label: "Projetos", href: "/projetos" }, { label: p.name }]}
      />
      <article className={s.work}>
        <header className={s.info}>
          <p className={s.space}>
            {p.space}
            {p.demo && ", estudo demonstrativo"}
          </p>
          <h1>{p.name}</h1>
          <p className={s.description}>{p.description}</p>
          <dl className={s.facts}>
            {p.details.map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>
                  {key === "Pedra" && stone ? (
                    <Link href={`/materiais/${stone.slug}`}>{value}</Link>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className={s.actions}>
            <Link href={quote} className="button button-accent">
              Pedir orçamento
            </Link>
            <Link
              href={stone ? `/materiais/${stone.slug}` : "/materiais"}
              className="button button-outline"
            >
              {stone ? `Ver a pedra ${stone.name}` : "Ver as pedras"}
            </Link>
          </div>
        </header>
        <div className={s.media}>
          <Gallery images={p.gallery} />
        </div>
      </article>

      {stone && (
        <section className={s.stone} aria-labelledby="pedra">
          <div className={s.swatch}>
            <Image
              src={stone.texture}
              alt={`Textura de referência de ${stone.name}`}
              fill
              sizes="(max-width: 1000px) 100vw, 40vw"
            />
          </div>
          <div className={s.stoneText}>
            <h2 id="pedra">A pedra desta obra</h2>
            <p className={s.stoneName}>{stone.name}</p>
            <p>
              {stone.category},{" "}
              {stone.character.toLowerCase().replace(" · ", " e ")}. A amostra
              é uma referência do padrão; cada chapa tem veios e tonalidade
              próprios.
            </p>
            <Link href={`/materiais/${stone.slug}`} className="text-link">
              Ver no catálogo
            </Link>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className={s.others} aria-labelledby="outras-obras">
          <div className={s.othersHead}>
            <h2 id="outras-obras">Outras obras</h2>
            <Link href="/projetos" className="button button-outline">
              Ver todos os projetos
            </Link>
          </div>
          <div className={s.othersGrid}>
            {others.map((o) => (
              <Link key={o.slug} href={`/projetos/${o.slug}`} className={s.other}>
                <Image
                  src={o.image}
                  width={o.width}
                  height={o.height}
                  sizes="(max-width: 700px) 100vw, 30vw"
                  alt={o.name}
                />
                <span className={s.otherSpace}>{o.space}</span>
                <span className={s.otherName}>{o.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
