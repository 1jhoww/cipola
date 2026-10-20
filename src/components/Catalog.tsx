"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { materials, projects } from "@/lib/data";
import s from "./pages.module.css";
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function Catalog({ kind }: { kind: "materials" | "projects" }) {
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [tone, setTone] = useState("Todos");
  const categories =
    kind === "materials"
      ? ["Todos", ...new Set(materials.map((m) => m.category))]
      : ["Todos", "Residencial", "Comercial"];
  const list =
    kind === "materials"
      ? materials.filter(
          (m) =>
            (category === "Todos" || m.category === category) &&
            normalize(m.name).includes(normalize(query)) &&
            (tone === "Todos" || m.character.includes(tone)),
        )
      : projects.filter(
          (p) =>
            (category === "Todos" || p.category === category) &&
            normalize(`${p.name} ${p.space}`).includes(normalize(query)),
        );
  return (
    <>
      <div className={s.filterBar}>
        <div className={s.filterTabs} aria-label="Filtrar por categoria">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className={s.searchFilters}>
          <label>
            <span className="eyebrow">BUSCAR</span>
            <input
              type="search"
              placeholder={
                kind === "materials" ? "Nome da pedra" : "Nome ou ambiente"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {kind === "materials" && (
            <label>
              <span className="eyebrow">TONALIDADE</span>
              <select value={tone} onChange={(e) => setTone(e.target.value)}>
                {["Todos", "Claro", "Escuro", "Quente", "Verde"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
      <p className={s.resultCount} role="status">
        {list.length}{" "}
        {kind === "materials"
          ? list.length === 1
            ? "material"
            : "materiais"
          : list.length === 1
            ? "projeto"
            : "projetos"}{" "}
        {list.length === 1 ? "encontrado" : "encontrados"}
      </p>
      <div className={kind === "materials" ? s.catalogGrid : s.projectsGrid}>
        {list.map((item) =>
          "texture" in item ? (
            <Link
              href={`/materiais/${item.slug}`}
              key={item.slug}
              className={s.catalogItem}
            >
              <div className={s.catalogImage}>
                <Image
                  src={item.texture}
                  alt={`Amostra de referência — ${item.name}`}
                  fill
                  sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
                />
                <span>CONHECER MATERIAL ↗</span>
              </div>
              <div className={s.itemTitle}>
                <h3>{item.name}</h3>
                <span aria-hidden="true">↗</span>
              </div>
              <p>
                {item.category} <span>{item.character}</span>
              </p>
            </Link>
          ) : (
            <Link
              href={`/projetos/${item.slug}`}
              key={item.slug}
              className={s.portfolioItem}
            >
              {/* Whole photo at its own proportions: never cropped or enlarged. */}
              <div className={s.portfolioImage}>
                <Image
                  src={item.image}
                  width={item.width}
                  height={item.height}
                  alt={`${item.name}${item.demo ? " — estudo ilustrativo" : ""}`}
                  sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
                />
                {item.demo && <span>ESTUDO DEMONSTRATIVO</span>}
              </div>
              <p>{item.space}</p>
              <h3>{item.name}</h3>
            </Link>
          ),
        )}
      </div>
      {!list.length && (
        <div className="empty">
          <p>
            {kind === "projects" && category === "Comercial"
              ? "Ainda não há projetos comerciais publicados."
              : "Nenhum resultado para esta combinação."}
          </p>
          <button
            className={s.resetFilters}
            onClick={() => {
              setCategory("Todos");
              setQuery("");
              setTone("Todos");
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
