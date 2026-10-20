import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { CookiePreferencesButton } from "@/components/consent/CookieConsent";
import { cookieCategories, cookieTable, legalUpdated } from "@/lib/legal";
import { site } from "@/lib/site";
import s from "@/components/pages.module.css";
export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Quais cookies o site da Cipola usa, para que servem, por quanto tempo ficam guardados e como gerenciar suas preferências.",
  alternates: { canonical: "/cookies" },
};
export default function Page() {
  return (
    <>
      <PageIntro
        eyebrow="Transparência"
        title="Política de Cookies"
        description="Quais cookies usamos, para que servem e como você controla suas escolhas a qualquer momento."
      />
      <article className={s.legal}>
        <p className={s.legalMeta}>Última atualização: {legalUpdated}</p>

        <h2>O que são cookies</h2>
        <p>
          Cookies são pequenos arquivos guardados no seu navegador quando você
          visita um site. Eles permitem lembrar escolhas, entender como o site é
          usado e medir o resultado de anúncios. Esta política também vale para
          tecnologias semelhantes, como pixels, tags e identificadores de
          dispositivo.
        </p>
        <p>
          Cookies próprios são definidos pelo site da Cipola. Cookies de
          terceiros são definidos por outras empresas, como Google e Meta, cujas
          ferramentas usamos. Alguns duram apenas a sessão; outros ficam
          guardados pelo prazo indicado abaixo.
        </p>

        <h2>Como usamos cookies</h2>
        {cookieCategories.map((c) => (
          <div key={c.id}>
            <h3>{c.title}</h3>
            <p>
              {c.description}
              {c.id === "necessary"
                ? " Base legal: legítimo interesse e cumprimento de obrigação legal (registro do consentimento)."
                : " Base legal: consentimento. Ficam desativados até você autorizar."}
              {c.tools && <> Ferramentas: {c.tools}.</>}
            </p>
          </div>
        ))}

        <h2>Cookies utilizados</h2>
        <p>
          Os nomes e prazos dos cookies de terceiros são definidos pelos próprios
          fornecedores e podem mudar sem aviso prévio da parte deles. Mantemos
          esta lista atualizada com as informações que eles publicam.
        </p>
        {cookieCategories.map((c) => (
          <div key={c.id}>
            <h3>{c.title}</h3>
            <div className={s.legalTable}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cookie</th>
                    <th scope="col">Fornecedor</th>
                    <th scope="col">Finalidade</th>
                    <th scope="col">Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieTable
                    .filter((row) => row.category === c.id)
                    .map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.provider}</td>
                        <td>{row.purpose}</td>
                        <td>{row.duration}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        <h2>Anúncios e o Modo de Consentimento do Google</h2>
        <p>
          A Cipola anuncia no Google Ads e na Meta Ads (Facebook e Instagram).
          Antes da sua escolha, nenhuma ferramenta de análise ou publicidade é
          carregada. Se você aceitar apenas os cookies de análise, o Google
          recebe o sinal de que a publicidade não foi autorizada (Modo de
          Consentimento do Google). Se você recusar, nada é enviado a essas
          plataformas a partir deste site.
        </p>
        <p>
          Com o seu consentimento para publicidade, registramos quando uma visita
          vinda de um anúncio resulta em pedido de orçamento (conversão) e
          podemos mostrar anúncios da Cipola a quem já visitou o site
          (remarketing). Mais detalhes na{" "}
          <Link href="/privacidade">Política de Privacidade</Link>.
        </p>

        <h2>Como gerenciar suas escolhas</h2>
        <p>
          Você pode aceitar, recusar ou mudar suas escolhas a qualquer momento.
          Ao retirar o consentimento, as ferramentas deixam de ser usadas e os
          cookies que elas criaram neste site são removidos.
        </p>
        <CookiePreferencesButton className={`button ${s.legalButton}`} />
        <p>
          Também é possível bloquear ou apagar cookies nas configurações do
          navegador (
          <a
            href="https://support.google.com/chrome/answer/95647?hl=pt-BR"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome
          </a>
          ,{" "}
          <a
            href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
          ,{" "}
          <a
            href="https://support.mozilla.org/pt-BR/kb/protecao-aprimorada-contra-rastreamento-firefox-desktop"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
          ,{" "}
          <a
            href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
            target="_blank"
            rel="noopener noreferrer"
          >
            Edge
          </a>
          ). Bloquear os cookies necessários pode impedir que sua escolha seja
          lembrada. Para os anúncios que você vê fora deste site, use{" "}
          <a
            href="https://myadcenter.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Minha Central de Anúncios do Google
          </a>{" "}
          e as{" "}
          <a
            href="https://accountscenter.facebook.com/ad_preferences"
            target="_blank"
            rel="noopener noreferrer"
          >
            Preferências de anúncios da Meta
          </a>
          .
        </p>

        <h2>Validade do consentimento</h2>
        <p>
          Sua escolha fica guardada por 12 meses. Depois desse prazo, ou quando
          esta política mudar de forma relevante, pedimos sua escolha novamente.
        </p>

        <h2>Contato</h2>
        <p>
          Dúvidas sobre cookies ou sobre seus dados podem ser enviadas para{" "}
          {site.privacyEmail ? (
            <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
          ) : (
            "o canal de atendimento indicado na página de contato"
          )}
          .
        </p>
      </article>
    </>
  );
}
