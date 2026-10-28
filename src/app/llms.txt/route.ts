import { describeCharacter, materials, projects, services } from "@/lib/data";
import { openingHoursText, site } from "@/lib/site";
import { absoluteUrl, indexable } from "@/lib/seo";

// llms.txt (https://llmstxt.org): a plain summary of the site for AI tools.
// It is a convention, not a standard, and no assistant is bound to read it.
export const dynamic = "force-static";

export function GET() {
  const link = (label: string, path: string, note?: string) =>
    `- [${label}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;
  const hours = openingHoursText();
  const text = [
    `# ${site.name}`,
    "",
    `> Marmoraria familiar fundada em ${site.foundingYear} por ${site.founder} e hoje conduzida por ${site.manager.name}. Bancadas, ilhas, lavatórios, revestimentos e peças sob medida em mármore, granito, quartzo, travertino, ônix, nanoglass e porcelanato, com estrutura própria de corte e acabamento e instalação na obra.`,
    "",
    `Sede: ${site.address} (coordenadas ${site.geo.latitude}, ${site.geo.longitude}). Vargem Grande Paulista é vizinha de Cotia. ${site.serviceArea}`,
    "",
    "## Contato",
    "",
    `- Telefone: ${site.phone.display}`,
    ...site.whatsapp.map(
      (w) => `- WhatsApp (${w.name}): ${w.display}, https://wa.me/${w.number}`,
    ),
    `- E-mail: ${site.email}`,
    `- Instagram: ${site.instagram.url}`,
    ...(hours ? [`- Horário: ${hours}`] : []),
    link("Pedir orçamento", "/contato"),
    "",
    "## Páginas principais",
    "",
    link("Início", "/", "serviços, seleção de pedras, processo de trabalho e perguntas frequentes"),
    link("A Cipola", "/sobre", `história da empresa desde ${site.foundingYear} e as duas gerações da família`),
    link("Catálogo de pedras", "/materiais", "todas as pedras, com busca por tom e categoria"),
    link("Projetos", "/projetos", "obras executadas pela Cipola"),
    "",
    "## Serviços",
    "",
    ...services.map((s) => `- ${s.name}: ${s.description}`),
    "",
    "## Pedras do catálogo",
    "",
    ...materials.map((m) =>
      link(m.name, `/materiais/${m.slug}`, `${m.category}, ${describeCharacter(m)}`),
    ),
    "",
    "## Projetos executados",
    "",
    ...projects.map((p) => link(p.name, `/projetos/${p.slug}`, p.description)),
    "",
    "## Observações",
    "",
    "- Cada chapa de pedra natural tem veios e tonalidade próprios; as imagens do catálogo são referência.",
    "- Preços, prazos, acabamentos e disponibilidade são informados no orçamento.",
    "",
  ].join("\n");
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      ...(!indexable && { "X-Robots-Tag": "noindex" }),
    },
  });
}
