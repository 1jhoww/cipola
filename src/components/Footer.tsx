import Link from "next/link";
import { Brand } from "./Brand";
import { CookiePreferencesButton } from "./consent/CookieConsent";
import {
  developerCredit,
  mapsLink,
  navigation,
  openingHoursText,
  site,
  whatsappLink,
} from "@/lib/site";
import s from "./shell.module.css";
export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerTop}>
        <div>
          <Brand />
          <p>Da natureza ao seu espaço.</p>
        </div>
        <nav aria-label="Links do rodapé">
          {navigation.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
          <Link href="/contato">Contato</Link>
        </nav>
        <div className={s.footerContact}>
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
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
      </div>
      <div className={s.footerLegalRow}>
        <nav className={s.footerLegal} aria-label="Privacidade e cookies">
          <Link href="/privacidade">Política de Privacidade</Link>
          <Link href="/cookies">Política de Cookies</Link>
          <CookiePreferencesButton />
        </nav>
        <a href="#top">Voltar ao topo ↑</a>
      </div>
      <div className={s.footerBottom}>
        <span>
          © {new Date().getFullYear()} {site.legalName || site.name}
          {site.cnpj && <> · CNPJ {site.cnpj}</>}
        </span>
        <div className={s.credit} aria-label="Créditos do site">
          <span>Desenvolvido por</span>
          <a
            className={s.creditLogo}
            href={developerCredit.website}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Site oficial da ${developerCredit.name}`}
          >
            <img
              src={developerCredit.logoSrc}
              alt=""
              width="400"
              height="267"
              loading="lazy"
              decoding="async"
            />
          </a>
          <a
            className={s.creditInstagram}
            href={developerCredit.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram da ${developerCredit.name} — ${developerCredit.instagramHandle}`}
          >
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
