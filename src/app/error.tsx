"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="section">
      <p className="eyebrow">ALGO INTERROMPEU O CARREGAMENTO</p>
      <h1 style={{ fontSize: 48, margin: "25px 0" }}>Vamos tentar de novo.</h1>
      <button className="button" onClick={reset}>
        Recarregar conteúdo ↻
      </button>
    </section>
  );
}
