"use client";
import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { materials } from "@/lib/data";
import { projectTypes, quoteMessage, validateQuote, type Quote } from "@/lib/quote";
import { site, whatsappLink } from "@/lib/site";
import { trackLead } from "@/lib/tracking";
import s from "./form.module.css";
export function QuoteForm({
  initialMaterial = "",
  initialType = "",
}: {
  initialMaterial?: string;
  initialType?: string;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  // The WhatsApp message last opened, so it can be sent to the other contacts too.
  const [sent, setSent] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const [primary, ...others] = site.whatsapp;
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const entries = Object.fromEntries(new FormData(e.currentTarget).entries());
    const result = validateQuote({
      ...entries,
      consent: entries.consent === "on",
    });
    setErrors(result.errors);
    if (!result.data || Object.keys(result.errors).length) {
      const key = Object.keys(result.errors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${key}"]`)?.focus();
      return;
    }
    const data: Quote = result.data;
    if (data.company) return; // Honeypot filled: a bot, not a visitor.
    const message = quoteMessage(
      data,
      materials.find((m) => m.slug === data.material)?.name || "",
    );
    // Opened inside the submit gesture, so browsers do not block the new tab.
    window.open(whatsappLink(primary.number, message), "_blank", "noopener");
    setSent(message);
    trackLead();
  };
  const error = (name: string) =>
    errors[name] ? (
      <span className={s.error} id={`${name}-error`}>
        {errors[name]}
      </span>
    ) : null;
  const props = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  return (
    <form
      ref={form}
      onSubmit={submit}
      onChange={() => setSent("")}
      noValidate
      className={s.form}
    >
      <p className={s.required}>* Campos obrigatórios</p>
      <fieldset>
        <legend>
          <span>01</span> Sobre o projeto
        </legend>
        <div className={s.grid}>
          <label>
            Tipo de projeto *
            <select
              name="project"
              defaultValue={initialType}
              required
              {...props("project")}
            >
              <option value="">Selecione</option>
              {projectTypes.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            {error("project")}
          </label>
          <label>
            Material de interesse
            <select
              name="material"
              defaultValue={initialMaterial}
              {...props("material")}
            >
              <option value="">Ainda estou escolhendo</option>
              {materials.map((m) => (
                <option key={m.slug} value={m.slug}>
                  {m.name}
                </option>
              ))}
            </select>
            {error("material")}
          </label>
          <label className={s.wide}>
            Cidade e estado da obra *
            <input
              name="location"
              placeholder="Ex.: São Paulo, SP"
              maxLength={160}
              autoComplete="address-level2"
              required
              {...props("location")}
            />
            {error("location")}
          </label>
          <label className={s.wide}>
            Conte um pouco mais
            <textarea
              name="message"
              rows={4}
              maxLength={1500}
              placeholder="Ambiente, medidas aproximadas, prazo desejado e referências que você já tem."
              {...props("message")}
            />
            {error("message")}
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          <span>02</span> Seus dados
        </legend>
        <div className={s.grid}>
          <label className={s.wide}>
            Nome *
            <input
              name="name"
              autoComplete="name"
              maxLength={120}
              required
              {...props("name")}
            />
            {error("name")}
          </label>
          <label>
            Telefone com DDD *
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={30}
              required
              {...props("phone")}
            />
            {error("phone")}
          </label>
          <label>
            E-mail
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              {...props("email")}
            />
            {error("email")}
          </label>
        </div>
      </fieldset>
      <label className={s.honeypot} aria-hidden="true">
        Empresa
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <label className={s.consent}>
        <input type="checkbox" name="consent" required {...props("consent")} />
        <span>
          Autorizo o envio destes dados à Cipola pelo WhatsApp para responder a
          esta solicitação. Li a{" "}
          <Link href="/privacidade">Política de Privacidade</Link>. *
        </span>
      </label>
      {error("consent")}
      <p className={s.deliveryNote}>
        Ao enviar, o WhatsApp abre com o seu pedido já escrito para{" "}
        {primary.name}. É só conferir e tocar em enviar.
      </p>
      <button type="submit" className="button button-accent">
        Enviar pelo WhatsApp <span aria-hidden="true">↗︎</span>
      </button>
      <div role="status" aria-live="polite">
        {sent && (
          <div className={s.sent}>
            <p className={s.sentTitle}>
              Seu pedido está pronto no WhatsApp de {primary.name}.
            </p>
            <p>
              Confira a mensagem e toque em enviar. Se a conversa não abriu,
              use o botão abaixo.
              {others.length > 0 &&
                " Para agilizar o atendimento, envie também para a equipe."}
            </p>
            <div className={s.sentActions}>
              <a
                className="button button-accent"
                href={whatsappLink(primary.number, sent)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir conversa com {primary.name} ↗︎
              </a>
              {others.map((w) => (
                <a
                  key={w.number}
                  className="button button-outline"
                  href={whatsappLink(w.number, sent)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Enviar também para {w.name} ↗︎
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
