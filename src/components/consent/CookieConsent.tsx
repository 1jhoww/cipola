"use client";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  OPEN_PREFERENCES_EVENT,
  openCookiePreferences,
  parseConsent,
  readConsentRaw,
  saveConsent,
  subscribeConsent,
  type Choice,
} from "@/lib/consent";
import { cookieCategories } from "@/lib/legal";
import { applyConsent, trackPageView } from "@/lib/tracking";
import s from "./consent.module.css";

const all: Choice = { analytics: true, marketing: true };
const none: Choice = { analytics: false, marketing: false };

export function CookieConsent() {
  const path = usePathname();
  // null on the server: the banner renders only once the cookie can be read.
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, () => null);
  const consent = useMemo(() => (raw === null ? null : parseConsent(raw)), [raw]);
  const showBanner = raw !== null && !consent;
  const [draft, setDraft] = useState<Choice>(none);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (consent) applyConsent(consent);
  }, [consent]);

  const firstPath = useRef(true);
  useEffect(() => {
    if (firstPath.current) firstPath.current = false;
    else trackPageView();
  }, [path]);

  useEffect(() => {
    const open = () => {
      setDraft(consent ? { analytics: consent.analytics, marketing: consent.marketing } : none);
      dialog.current?.showModal();
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, [consent]);

  const choose = (choice: Choice) => {
    saveConsent(choice);
    dialog.current?.close();
  };

  return (
    <>
      {showBanner && (
        <section className={s.banner} aria-labelledby="cookie-title">
          <div className={s.bannerText}>
            <p id="cookie-title" className={s.bannerTitle}>
              Sua privacidade, sua escolha.
            </p>
            <p>
              Usamos cookies necessários para o site funcionar e, com a sua
              permissão, cookies de análise e de publicidade (Google e Meta)
              para medir visitas e mostrar anúncios relevantes. Saiba mais na{" "}
              <Link href="/cookies">Política de Cookies</Link> e na{" "}
              <Link href="/privacidade">Política de Privacidade</Link>.
            </p>
          </div>
          <div className={s.bannerActions}>
            <button className={s.choice} onClick={() => choose(none)}>
              Rejeitar opcionais
            </button>
            <button className={s.choice} onClick={() => choose(all)}>
              Aceitar todos
            </button>
            <button
              className={s.customize}
              onClick={openCookiePreferences}
            >
              Personalizar
            </button>
          </div>
        </section>
      )}

      <dialog
        ref={dialog}
        className={s.dialog}
        aria-labelledby="cookie-preferences-title"
      >
        <div className={s.dialogHead}>
          <h2 id="cookie-preferences-title">Preferências de cookies</h2>
          <button
            className={s.close}
            onClick={() => dialog.current?.close()}
            aria-label="Fechar preferências de cookies"
          >
            Fechar ×
          </button>
        </div>
        <p className={s.dialogLead}>
          Escolha quais categorias autoriza. Você pode alterar ou retirar o
          consentimento a qualquer momento pelo link “Preferências de cookies”
          no rodapé.
        </p>
        <ul className={s.categories}>
          {cookieCategories.map((c) => {
            const locked = c.id === "necessary";
            const on = locked || draft[c.id as keyof Choice];
            return (
              <li key={c.id}>
                <div className={s.categoryHead}>
                  <h3 id={`cookie-${c.id}`}>{c.title}</h3>
                  {locked ? (
                    <span className={s.always}>Sempre ativos</span>
                  ) : (
                    <button
                      role="switch"
                      aria-checked={on}
                      aria-labelledby={`cookie-${c.id}`}
                      className={s.switch}
                      onClick={() =>
                        setDraft((d) => ({ ...d, [c.id]: !d[c.id as keyof Choice] }))
                      }
                    >
                      <span aria-hidden="true" />
                    </button>
                  )}
                </div>
                <p>{c.description}</p>
                {c.tools && <p className={s.tools}>Ferramentas: {c.tools}</p>}
              </li>
            );
          })}
        </ul>
        <div className={s.dialogActions}>
          <button className={s.secondary} onClick={() => choose(none)}>
            Rejeitar opcionais
          </button>
          <button className={s.secondary} onClick={() => choose(all)}>
            Aceitar todos
          </button>
          <button className={s.primary} onClick={() => choose(draft)}>
            Salvar escolhas
          </button>
        </div>
        <p className={s.dialogLinks}>
          <Link href="/cookies" onClick={() => dialog.current?.close()}>
            Política de Cookies
          </Link>
          <Link href="/privacidade" onClick={() => dialog.current?.close()}>
            Política de Privacidade
          </Link>
        </p>
      </dialog>
    </>
  );
}

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={openCookiePreferences}
    >
      Preferências de cookies
    </button>
  );
}
