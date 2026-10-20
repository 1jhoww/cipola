"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects } from "@/lib/data";
import { sobrePhotos as p } from "@/content/sobre-photos";
import { Photo } from "./Photo";
import s from "./about.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Real works close the page, shown whole at their own proportions.
const closingWorks = ["cozinha-ilha-branca", "lareira", "area-gourmet-preto-absoluto"]
  .map((slug) => projects.find((w) => w.slug === slug))
  .filter((w) => w !== undefined);

export function About() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          wide: "(min-width: 901px)",
        },
        (context) => {
          const { motion, wide } = context.conditions as {
            motion: boolean;
            wide: boolean;
          };
          if (!motion) return;

          // Page load: the two sentences rise, then the family photo opens.
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from("[data-hero-eyebrow]", { autoAlpha: 0, y: 16, duration: 0.8 })
            .from(
              "[data-hero] h1 > span > span",
              { yPercent: 105, duration: 1.15, stagger: 0.18 },
              0.1,
            )
            .from(
              "[data-hero-photo] [data-photo-media]",
              { clipPath: "inset(100% 0 0 0)", duration: 1.5, ease: "power3.inOut" },
              0.45,
            )
            .from(
              "[data-hero-fade]",
              { autoAlpha: 0, y: 20, duration: 0.9 },
              0.9,
            );

          // On narrow screens the photo sits under the headline and widens from
          // the text column to the whole width of the band while scrolling.
          const hero = document.querySelector<HTMLElement>("[data-hero]");
          const gutter = hero ? parseFloat(getComputedStyle(hero).paddingLeft) : 0;
          if (!wide) gsap.fromTo(
            "[data-hero-photo] [data-photo]",
            { clipPath: `inset(0px ${gutter}px 0px ${gutter}px)` },
            {
              clipPath: "inset(0px 0px 0px 0px)",
              ease: "none",
              scrollTrigger: {
                trigger: "[data-hero-photo]",
                start: "top 75%",
                end: "top 10%",
                scrub: 0.6,
              },
            },
          );
          // The headline drifts up a little slower than the page.
          gsap.to("[data-hero] h1", {
            yPercent: -12,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          // Every other photo opens from a slight inset and settles while scrolling.
          gsap.utils
            .toArray<HTMLElement>("[data-photo]")
            .filter((el) => !el.closest("[data-hero-photo]"))
            .forEach((el) => {
              gsap.fromTo(
                el,
                { clipPath: "inset(10% 6% 10% 6%)" },
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  ease: "none",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    end: "top 45%",
                    scrub: 0.6,
                  },
                },
              );
            });
          gsap.utils.toArray<HTMLElement>("[data-photo-media]").forEach((el) => {
            gsap.fromTo(
              el,
              { scale: 1.12 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
            gsap.from(el, {
              autoAlpha: 0,
              y: 28,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            });
          });

          // The founding year drifts against the photo laid over it.
          gsap.fromTo(
            "[data-year]",
            { xPercent: 4 },
            {
              xPercent: -4,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-origin]",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          // The two portraits move toward the photo of father and son.
          if (wide) {
            const together = {
              trigger: "[data-generations]",
              start: "top 85%",
              end: "center 45%",
              scrub: 0.8,
            };
            gsap.from("[data-founder]", {
              xPercent: -14,
              ease: "none",
              scrollTrigger: together,
            });
            gsap.from("[data-successor]", {
              xPercent: 14,
              yPercent: 10,
              ease: "none",
              scrollTrigger: together,
            });
          }
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className={s.hero} data-hero aria-labelledby="sobre-title">
        <div className={s.heroText}>
          <p className={s.eyebrow} data-hero-eyebrow>
            Empresa familiar desde 1992
          </p>
          <h1 id="sobre-title">
            <span className={s.lineA}>
              <span>A experiência de quem construiu uma história.</span>
            </span>{" "}
            <span className={s.lineB}>
              <span>A visão de quem a leva adiante.</span>
            </span>
          </h1>
        </div>
        <div className={s.heroPhoto} data-hero-photo>
          <Photo
            slot={p.hero}
            priority
            sizes="(max-width:900px) 100vw, 60vw"
            caption="Família Cipola"
          />
        </div>
        <p className={s.heroLead} data-hero-fade>
          A Cipola é uma empresa familiar de mármores e granitos. A história
          começou em 1992, com Joaquim Cipola, e hoje segue com seu filho,
          Rafael (Kaka) Cipola, à frente do negócio.
        </p>
      </section>

      <section className={s.origin} data-origin aria-labelledby="sobre-origem">
        <p className={s.year} aria-hidden="true">
          <span data-year>1992</span>
        </p>
        <div className={s.originText} data-fade>
          <h2 id="sobre-origem">Tudo começou com pedras decorativas.</h2>
          <p>
            Joaquim Cipola fundou a empresa em 1992, trabalhando com pedras
            decorativas. Foi nesse ofício, peça por peça, que a Cipola aprendeu
            a ler o material e a respeitar o tempo de cada trabalho.
          </p>
          <p>
            Com o passar dos anos, a empresa expandiu sua atuação para
            mármores e granitos, levando essa mesma atenção a bancadas,
            revestimentos e peças sob medida.
          </p>
        </div>
      </section>

      <section className={s.growth} aria-labelledby="sobre-evolucao">
        <div className={s.growthHead}>
          <h2 id="sobre-evolucao" data-fade>
            Uma estrutura que cresceu com o trabalho.
          </h2>
          <div className={s.growthText} data-fade>
            <p>
              Ao longo dos anos, a Cipola aperfeiçoou técnicas, ampliou sua
              estrutura e investiu em maquinário de alto nível.
            </p>
            <p>
              Esse crescimento aparece onde o cliente olha de perto: no corte,
              nos encontros entre as peças e na atenção a cada acabamento.
            </p>
          </div>
        </div>
        <div className={s.growthPhotos}>
          <Photo
            slot={p.maquinario}
            className={s.machines}
            sizes="(max-width:900px) 100vw, 64vw"
            caption="Ponte de corte"
          />
          <Photo
            slot={p.producao}
            className={s.production}
            sizes="(max-width:900px) 60vw, 34vw"
            caption="Corte de bancada"
          />
          <Photo
            slot={p.recorte}
            className={s.finish}
            sizes="(max-width:900px) 60vw, 30vw"
            caption="Recorte de cuba"
          />
          <p className={s.growthNote} data-fade>
            Capacidade de execução para bancadas, ilhas, revestimentos e peças
            especiais, do corte da chapa à instalação na obra.
          </p>
        </div>
      </section>

      <section
        className={s.generations}
        data-generations
        aria-labelledby="sobre-geracoes"
      >
        <div className={s.generationsHead} data-fade>
          <h2 id="sobre-geracoes">Duas gerações, uma história.</h2>
          <p className={s.statement}>
            Uma nova geração à frente. O mesmo compromisso com o trabalho bem
            feito.
          </p>
        </div>
        <div className={s.portraits}>
          <div className={s.founder} data-founder>
            <Photo
              slot={p.joaquim}
              sizes="(max-width:900px) 50vw, 26vw"
              caption={
                <>
                  <strong>Joaquim Cipola</strong> Fundador
                </>
              }
            />
          </div>
          <div className={s.together}>
            <Photo
              slot={p.juntos}
              sizes="(max-width:900px) 100vw, 40vw"
              caption="Joaquim e Rafael (Kaka) Cipola"
            />
          </div>
          <div className={s.successor} data-successor>
            <Photo
              slot={p.rafael}
              sizes="(max-width:900px) 50vw, 26vw"
              caption={
                <>
                  <strong>Rafael (Kaka) Cipola</strong> À frente da empresa
                </>
              }
            />
          </div>
          <div className={s.generationsText} data-fade>
            <p>
              Hoje, a Cipola é conduzida por Rafael (Kaka) Cipola, filho do fundador.
              Ele chega com uma visão contemporânea e novas perspectivas de
              crescimento, sem abrir mão do que trouxe a empresa até aqui.
            </p>
            <p>
              Os valores, a experiência e a qualidade de trabalho estabelecidos
              por Joaquim continuam sendo a base de cada projeto. O que se renova
              é o olhar para o que vem pela frente.
            </p>
          </div>
        </div>
      </section>

      <section className={s.closing} aria-labelledby="sobre-obras">
        <div className={s.closingHead}>
          <h2 id="sobre-obras" data-fade>
            Essa história também se conta nas obras.
          </h2>
          <div className={s.closingText} data-fade>
            <p>
              Veja projetos executados pela Cipola ou conte sobre o seu. A
              conversa começa pelas medidas, pelo uso do espaço e pela pedra
              que você tem em mente.
            </p>
            <div className={s.actions}>
              <Link href="/contato" className="button button-accent">
                Pedir orçamento
              </Link>
              <Link href="/projetos" className="button button-outline">
                Ver projetos executados
              </Link>
            </div>
          </div>
        </div>
        <div className={s.works}>
          {closingWorks.map((w) => (
            <Link
              key={w.slug}
              href={`/projetos/${w.slug}`}
              className={s.work}
              data-fade
            >
              <Image
                src={w.image}
                width={w.width}
                height={w.height}
                sizes="(max-width:700px) 100vw, 30vw"
                alt={`${w.name}, obra Cipola`}
              />
              <span>{w.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
