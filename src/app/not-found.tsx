import Link from "next/link";
import s from "@/components/pages.module.css";
export default function NotFound() {
  return (
    <div className={s.notFound}>
      <p className="eyebrow">404 / PÁGINA NÃO ENCONTRADA</p>
      <h1>Vamos por outro caminho.</h1>
      <p>Esta página não existe ou mudou de endereço.</p>
      <Link href="/materiais" className="button">
        Explorar materiais <span>↗</span>
      </Link>
    </div>
  );
}
