import Image from "next/image";
import { PageIntro } from "@/components/PageIntro";
import { JsonLd } from "@/components/JsonLd";
import { QuoteForm } from "@/components/QuoteForm";
import { materials } from "@/lib/data";
import { mapsLink, openingHoursText, site, whatsappLink } from "@/lib/site";
import { pageMetadata, webPageJsonLd } from "@/lib/seo";
import { projectTypes } from "@/lib/quote";
import s from "@/components/form.module.css";
const title = "Orçamento de Bancadas em Mármore e Granito | Cipola";
const description =
  "Peça orçamento à Cipola pelo WhatsApp, telefone ou formulário. Sede em Vargem Grande Paulista, ao lado de Cotia, e atendimento em toda a região.";
export const metadata = pageMetadata({ title, description, path: "/contato" });
export const dynamic = "force-dynamic";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ material?: string; tipo?: string }>;
}) {
  const q = await searchParams;
  const material = materials.find((m) => m.slug === q.material)?.slug;
  const type = projectTypes.includes(q.tipo || "") ? q.tipo : "";
  return (
    <>
      <JsonLd
        graph={webPageJsonLd({
          path: "/contato",
          name: title,
          description,
          type: "ContactPage",
          breadcrumb: [{ name: "Contato", path: "/contato" }],
        })}
      />
      <PageIntro
        eyebrow="CONTATO / SOLICITAR ORÇAMENTO"
        title={"Vamos dar forma\nà sua ideia."}
        description="Pode ser uma referência, uma planta ou uma ideia ainda no começo. Conte o que você precisa para darmos o próximo passo."
      />
      <div className={s.layout}>
        <QuoteForm
          initialMaterial={material}
          initialType={type}
        />
        <aside className={s.aside}>
          <p className="eyebrow">UMA CONVERSA DE CADA VEZ</p>
          <h2>
            O primeiro detalhe
            <br />é ouvir você.
          </h2>
          <p>
            Quanto mais soubermos sobre o espaço, melhor podemos discutir
            materiais, medidas e possibilidades.
          </p>
          <div className={s.asideLinks}>
            {site.email && <a href={`mailto:${site.email}`}>{site.email} ↗︎</a>}
            {site.whatsapp.map((w) => (
              <a key={w.number} href={whatsappLink(w.number)}>
                WhatsApp {w.name} · {w.display} ↗︎
              </a>
            ))}
            {site.phone && (
              <a href={`tel:+${site.phone.number}`}>Telefone · {site.phone.display}</a>
            )}
            {site.address && (
              <a href={mapsLink(site.address)} target="_blank" rel="noopener noreferrer">
                {site.address} ↗︎
              </a>
            )}
            {site.instagram && (
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                Instagram · {site.instagram.handle} ↗︎
              </a>
            )}
            {site.serviceArea && <p>{site.serviceArea}</p>}
            {site.openingHours.length > 0 && <p>Horário: {openingHoursText()}</p>}
          </div>
          <div className={s.asideImage}>
            <Image
              src="/images/banheiro.jpg"
              alt="Estudo ilustrativo de bancada de pedra"
              fill
              sizes="(max-width: 700px) 90vw, 35vw"
            />
            <span>AMBIENTE ILUSTRATIVO</span>
          </div>
          {!site.email && !site.whatsapp.length && (
            <small>
              Os canais diretos de atendimento serão disponibilizados em breve.
            </small>
          )}
        </aside>
      </div>
    </>
  );
}
