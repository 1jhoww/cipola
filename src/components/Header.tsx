"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "./Brand";
import { navigation } from "@/lib/site";
import s from "./shell.module.css";
// Pages whose first section is dark; the header takes that tone.
const darkPaths = ["/sobre"];
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) menu.current?.showModal();
    else menu.current?.close();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [open]);
  return (
    <header
      className={`${s.header} ${path === "/" ? s.homeHeader : ""} ${
        darkPaths.includes(path) ? s.darkHeader : ""
      }`}
    >
      <Brand />
      <nav className={s.desktopNav} aria-label="Navegação principal">
        {navigation.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={
              (n.href === "/" ? path === "/" : path.startsWith(n.href))
                ? "page"
                : undefined
            }
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <Link className={s.headerCta} href="/contato">
        Pedir orçamento
      </Link>
      <button
        ref={trigger}
        className={s.menuButton}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        Menu <span aria-hidden="true">☰</span>
      </button>
      <dialog
        ref={menu}
        id="mobile-menu"
        className={s.mobileMenu}
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        <div className={s.menuTop}>
          <Brand />
          <button onClick={() => setOpen(false)} aria-label="Fechar menu">
            Fechar ×
          </button>
        </div>
        <nav aria-label="Navegação mobile">
          {[...navigation, { href: "/contato", label: "Pedir orçamento" }].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </Link>
          ))}
        </nav>
        <p>Da natureza ao seu espaço.</p>
      </dialog>
    </header>
  );
}
