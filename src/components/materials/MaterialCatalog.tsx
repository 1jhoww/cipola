"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { materials, type Material } from "@/lib/data";
import { ScrollRow } from "@/components/ScrollRow";
import s from "./catalog.module.css";
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
const tone = (m: Material) => m.character.split(" · ")[0];
const describe = (m: Material) =>
  `${m.category}, ${m.character.toLowerCase().replace(" · ", " e ")}`;
// Tone filters, labelled for "pedras", each with the swatch colour of its first stone.
const tones = [
  ["Claro", "Claras"],
  ["Escuro", "Escuras"],
  ["Quente", "Quentes"],
  ["Verde", "Verdes"],
]
  .map(([value, label]) => ({
    value,
    label,
    color: materials.find((m) => tone(m) === value)?.color,
  }))
  .filter((item) => item.color);
const categories = [...new Set(materials.map((m) => m.category))];
// Stones are always shown as samples here; rooms live on each stone's own page.
export function MaterialCatalog() {
  const [query, setQuery] = useState("");
  const [toneFilter, setToneFilter] = useState("");
  const [category, setCategory] = useState("");
  const list = materials.filter(
    (m) =>
      normalize(m.name).includes(normalize(query.trim())) &&
      (!toneFilter || tone(m) === toneFilter) &&
      (!category || m.category === category),
  );
  const clear = () => {
    setQuery("");
    setToneFilter("");
    setCategory("");
  };
  return (
    <>
      <section className={s.intro}>
        <div>
          <h1>Escolha a pedra do seu projeto.</h1>
          <p>
            Compare as pedras da seleção lado a lado. Abra uma para girar em
            3D e ver como ela fica na cozinha, no banheiro e em outros
            ambientes.
          </p>
        </div>
      </section>
      <div className={s.filters}>
        <ScrollRow label="Filtrar por tom" className={s.tones}>
          <button
            type="button"
            aria-pressed={!toneFilter}
            onClick={() => setToneFilter("")}
          >
            Todas
          </button>
          {tones.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={toneFilter === item.value}
              onClick={() => setToneFilter(item.value)}
            >
              <span
                className={s.dot}
                style={{ background: item.color }}
                aria-hidden="true"
              />
              {item.label}
            </button>
          ))}
        </ScrollRow>
        <div className={s.filterEnd}>
          <label className={s.search}>
            <span className="sr-only">Buscar pedra pelo nome</span>
            <input
              type="search"
              placeholder="Buscar pelo nome"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <label className={s.select}>
            <span className="sr-only">Tipo de pedra</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Todos os tipos</option>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <p className={s.count} role="status">
            {list.length} {list.length === 1 ? "pedra" : "pedras"}
          </p>
        </div>
      </div>
      {list.length ? (
        <div className={s.grid}>
          {list.map((m) => (
            <Link key={m.slug} href={`/materiais/${m.slug}`} className={s.card}>
              <span className={s.media}>
                <Image
                  src={m.texture}
                  alt={`Amostra de ${m.name}`}
                  fill
                  sizes="(max-width: 700px) 50vw, (max-width: 1000px) 45vw, 30vw"
                />
              </span>
              <h2>{m.name}</h2>
              <p>{describe(m)}</p>
            </Link>
          ))}
          <aside className={s.helpCard}>
            <h2>Em dúvida entre duas pedras?</h2>
            <p>
              A equipe ajuda a escolher pelo uso do espaço, pela manutenção e
              pelo orçamento.
            </p>
            <Link href="/contato" className="button button-accent">
              Falar com a equipe
            </Link>
          </aside>
        </div>
      ) : (
        <div className={s.empty}>
          <p>Nenhuma pedra com essa combinação.</p>
          <button type="button" className="button" onClick={clear}>
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
