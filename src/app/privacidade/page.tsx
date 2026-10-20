import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { legalUpdated } from "@/lib/legal";
import { site } from "@/lib/site";
import s from "@/components/pages.module.css";
export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Cipola trata dados pessoais no site, nos pedidos de orçamento e nas campanhas de anúncios, de acordo com a LGPD.",
  alternates: { canonical: "/privacidade" },
};
export default function Page() {
  const contact = site.privacyEmail ? (
    <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
  ) : (
    "o canal de atendimento indicado na página de contato"
  );
  return (
    <>
      <PageIntro
        eyebrow="Transparência"
        title="Política de Privacidade"
        description="Como tratamos seus dados pessoais no site, nos pedidos de orçamento e nas campanhas de anúncios, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018)."
      />
      <article className={s.legal}>
        <p className={s.legalMeta}>Última atualização: {legalUpdated}</p>

        <h2>Quem é responsável pelos seus dados</h2>
        <p>
          O controlador dos dados pessoais tratados neste site é{" "}
          <strong>{site.legalName || site.name}</strong>
          {site.cnpj && <>, inscrita no CNPJ sob o nº {site.cnpj}</>}
          {site.address && <>, com sede em {site.address}</>} (“Cipola”, “nós”).
          Esta política explica quais dados coletamos, para quê, com quem os
          compartilhamos e como você pode exercer seus direitos.
        </p>
        <p>
          Encarregado pelo tratamento de dados pessoais (DPO):{" "}
          {site.dpoName && <>{site.dpoName}, </>}contato por {contact}.
        </p>

        <h2>Dados que coletamos</h2>
        <h3>Dados que você nos informa</h3>
        <ul>
          <li>
            <strong>Pedido de orçamento:</strong> nome, telefone, e-mail
            (opcional), tipo de projeto, material de interesse, local da obra e
            a mensagem que você escrever. O site não guarda esses dados: ao
            enviar o formulário, o WhatsApp abre com o pedido já escrito, e as
            informações só chegam à Cipola quando você envia a mensagem pelo
            seu próprio WhatsApp.
          </li>
          <li>
            <strong>Contato direto:</strong> as informações que você enviar por
            e-mail, WhatsApp ou redes sociais, incluindo fotos e medidas do
            projeto.
          </li>
        </ul>
        <h3>Dados coletados automaticamente</h3>
        <ul>
          <li>
            <strong>Registros de acesso:</strong> endereço IP, data e hora da
            visita, navegador, sistema operacional e páginas acessadas. A guarda
            desses registros é exigida pelo Marco Civil da Internet (Lei nº
            12.965/2014).
          </li>
          <li>
            <strong>Cookies e tecnologias semelhantes:</strong> identificadores
            de navegador, páginas vistas, tempo de navegação, dispositivo,
            localização aproximada (cidade, a partir do IP) e interações com o
            site. Os cookies de análise e de publicidade só são ativados com o
            seu consentimento. Os detalhes estão na{" "}
            <Link href="/cookies">Política de Cookies</Link>.
          </li>
          <li>
            <strong>Dados de campanhas:</strong> quando você chega ao site por um
            anúncio, o endereço pode conter parâmetros de campanha (como UTM) e
            identificadores de clique do Google (gclid) e da Meta (fbclid). Com
            o seu consentimento para publicidade, eles são usados para saber
            qual anúncio gerou a visita ou o pedido de orçamento.
          </li>
        </ul>
        <h3>Dados recebidos de plataformas de anúncios</h3>
        <p>
          Google e Meta nos fornecem relatórios sobre o desempenho dos anúncios,
          como alcance, cliques e conversões. Esses relatórios são agregados ou
          estatísticos e não identificam você individualmente para a Cipola.
        </p>

        <h2>Para que usamos os dados e com qual base legal</h2>
        <ul>
          <li>
            <strong>Responder ao seu pedido de orçamento</strong> e conduzir as
            conversas sobre o projeto: procedimentos preliminares e execução de
            contrato a seu pedido (art. 7º, V, da LGPD).
          </li>
          <li>
            <strong>Prestar o serviço contratado</strong>, incluindo medição,
            produção, instalação e pós-venda: execução de contrato (art. 7º, V).
          </li>
          <li>
            <strong>Manter registros de acesso e a segurança do site</strong>,
            prevenir fraudes e abusos: cumprimento de obrigação legal (art. 7º,
            II) e legítimo interesse (art. 7º, IX).
          </li>
          <li>
            <strong>Medir audiência e melhorar o site</strong> com estatísticas
            de navegação: consentimento (art. 7º, I).
          </li>
          <li>
            <strong>Anunciar nas plataformas Google e Meta</strong>: medir
            conversões, exibir anúncios a quem já visitou o site (remarketing),
            criar públicos semelhantes e otimizar campanhas: consentimento (art.
            7º, I).
          </li>
          <li>
            <strong>Cumprir obrigações legais, fiscais e regulatórias</strong>{" "}
            e atender autoridades: obrigação legal (art. 7º, II).
          </li>
          <li>
            <strong>Defender direitos</strong> em processos judiciais,
            administrativos ou arbitrais: exercício regular de direitos (art.
            7º, VI).
          </li>
        </ul>
        <p>
          Não tomamos decisões exclusivamente automatizadas que afetem seus
          interesses e não vendemos dados pessoais.
        </p>

        <h2>Publicidade online e remarketing</h2>
        <p>
          A Cipola divulga seus serviços por anúncios no Google Ads (Pesquisa,
          YouTube e rede de sites parceiros) e na Meta Ads (Facebook e
          Instagram), e poderá usar outras plataformas de anúncios, que serão
          informadas na Política de Cookies antes de entrarem em uso.
        </p>
        <p>
          Se você autorizar os cookies de publicidade, ferramentas como a Tag do
          Google e o Pixel da Meta registram a sua visita e ações como o envio de
          um pedido de orçamento. Com isso podemos saber se um anúncio trouxe
          resultado e mostrar anúncios da Cipola a quem já demonstrou interesse.
          Essas plataformas atuam também como controladoras dos dados que
          coletam e os tratam conforme suas próprias políticas:{" "}
          <a
            href="https://policies.google.com/privacy?hl=pt-BR"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade do Google
          </a>{" "}
          e{" "}
          <a
            href="https://www.facebook.com/privacy/policy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade da Meta
          </a>
          .
        </p>
        <p>
          Sem o seu consentimento, essas ferramentas não são carregadas. Você
          pode retirar o consentimento a qualquer momento nas{" "}
          <Link href="/cookies">preferências de cookies</Link>. Para controlar
          os anúncios que vê em outros sites e aplicativos, use também as
          configurações da sua conta no{" "}
          <a
            href="https://myadcenter.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Minha Central de Anúncios do Google
          </a>{" "}
          e nas{" "}
          <a
            href="https://accountscenter.facebook.com/ad_preferences"
            target="_blank"
            rel="noopener noreferrer"
          >
            Preferências de anúncios da Meta
          </a>
          .
        </p>
        <p>
          Caso a Cipola venha a usar listas de clientes para públicos
          personalizados (por exemplo, Customer Match do Google ou Públicos
          Personalizados da Meta), isso será feito apenas com dados de quem
          tiver consentido, enviados de forma criptografada (hash) e com a
          possibilidade de oposição a qualquer momento.
        </p>

        <h2>Com quem compartilhamos</h2>
        <ul>
          <li>
            <strong>Provedores de tecnologia</strong> que operam o site e o
            atendimento, como hospedagem e e-mail, sob contrato e apenas para
            essas finalidades.
          </li>
          <li>
            <strong>WhatsApp (Meta)</strong>, aplicativo pelo qual você envia o
            pedido de orçamento e conversa com a equipe. As mensagens seguem os
            termos e a{" "}
            <a
              href="https://www.whatsapp.com/legal/privacy-policy?lang=pt_BR"
              target="_blank"
              rel="noopener noreferrer"
            >
              Política de Privacidade do WhatsApp
            </a>
            .
          </li>
          <li>
            <strong>Plataformas de anúncios e análise</strong> (Google e Meta),
            somente com o seu consentimento.
          </li>
          <li>
            <strong>Parceiros da execução do projeto</strong>, como
            transportadoras e instaladores, na medida necessária para o serviço
            contratado.
          </li>
          <li>
            <strong>Autoridades públicas</strong>, quando houver obrigação legal
            ou ordem judicial.
          </li>
        </ul>

        <h2>Transferência internacional</h2>
        <p>
          Alguns fornecedores, como Google e Meta, armazenam dados em servidores
          fora do Brasil. Essas transferências seguem o art. 33 da LGPD e a
          regulamentação da ANPD, apoiadas em cláusulas contratuais e garantias
          oferecidas por esses fornecedores.
        </p>

        <h2>Por quanto tempo guardamos</h2>
        <ul>
          <li>
            <strong>Pedidos de orçamento sem contratação:</strong> até 2 anos
            após o último contato, para retomar a conversa se você quiser.
          </li>
          <li>
            <strong>Dados de clientes:</strong> pelo prazo do contrato e, depois,
            pelo período exigido pela legislação fiscal e para defesa de
            direitos, em geral 5 anos.
          </li>
          <li>
            <strong>Registros de acesso:</strong> 6 meses, conforme o Marco
            Civil da Internet.
          </li>
          <li>
            <strong>Cookies:</strong> pelos prazos indicados na{" "}
            <Link href="/cookies">Política de Cookies</Link>. O registro do seu
            consentimento é mantido enquanto for válido e pelo tempo necessário
            para comprová-lo.
          </li>
        </ul>
        <p>
          Ao fim desses prazos, os dados são eliminados ou anonimizados.
        </p>

        <h2>Seus direitos</h2>
        <p>Conforme o art. 18 da LGPD, você pode solicitar a qualquer momento:</p>
        <ul>
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>
            anonimização, bloqueio ou eliminação de dados desnecessários,
            excessivos ou tratados em desconformidade com a lei;
          </li>
          <li>portabilidade dos dados a outro fornecedor;</li>
          <li>eliminação dos dados tratados com base no seu consentimento;</li>
          <li>
            informação sobre as entidades com as quais compartilhamos seus dados;
          </li>
          <li>
            informação sobre a possibilidade de não consentir e as consequências
            da negativa;
          </li>
          <li>revogação do consentimento;</li>
          <li>oposição a tratamentos feitos com base em outras hipóteses legais.</li>
        </ul>
        <p>
          Para exercer seus direitos, escreva para {contact}. Podemos pedir
          informações para confirmar sua identidade. Respondemos em até 15 dias.
          Você também pode apresentar reclamação à{" "}
          <a
            href="https://www.gov.br/anpd/pt-br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Autoridade Nacional de Proteção de Dados (ANPD)
          </a>
          .
        </p>

        <h2>Segurança</h2>
        <p>
          Usamos conexão criptografada (HTTPS), acesso restrito às informações e
          fornecedores com práticas de segurança reconhecidas. Nenhum sistema é
          totalmente imune a incidentes; se ocorrer um incidente que possa
          causar risco ou dano relevante, comunicaremos você e a ANPD, conforme
          a lei.
        </p>

        <h2>Crianças e adolescentes</h2>
        <p>
          O site e os anúncios da Cipola são destinados a maiores de 18 anos.
          Não coletamos intencionalmente dados de crianças e adolescentes.
        </p>

        <h2>Links para outros sites</h2>
        <p>
          O site pode conter links para WhatsApp, redes sociais e outros
          serviços. Ao acessá-los, valem as políticas de privacidade de cada
          serviço.
        </p>

        <h2>Alterações nesta política</h2>
        <p>
          Esta política pode ser atualizada para refletir mudanças na lei, nas
          ferramentas ou nas campanhas da Cipola. A data da última atualização
          fica no topo da página. Quando a mudança afetar o uso de cookies,
          pediremos o seu consentimento novamente.
        </p>
      </article>
    </>
  );
}
