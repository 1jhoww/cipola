"use client";
import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersLightMotion } from "@/lib/device";
import { materials, projects } from "@/lib/data";
import { site, whatsappLink } from "@/lib/site";
import {
  EdgesVisual,
  InstalledVisual,
  PlanVisual,
  SamplesVisual,
} from "./ProcessVisuals";
import s from "./home.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Best works for the home: all square photos, so the row lines up without cropping.
const featuredProjects = [
  "area-gourmet-verde-ubatuba",
  "bar-pedra-ametista",
  "area-gourmet-ilha-branca",
]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p) => p !== undefined);
const stoneName = (slug: string) =>
  materials.find((m) => m.slug === slug)?.name ?? slug;

// One room per card, each shown in a different stone from the catalog.
const rooms = [
  {
    name: "Cozinhas",
    items: "Da bancada do dia a dia à ilha que vira o centro da casa.",
    stone: "preto-sao-gabriel",
    image: "/images/materiais/preto-sao-gabriel/cozinha.webp",
    position: "35% 60%",
  },
  {
    name: "Banheiros",
    items:
      "Bancadas, cubas e paredes em pedra, com o acabamento que o projeto pedir.",
    stone: "marmore-branco",
    image: "/images/materiais/marmore-branco/banheiro.webp",
    position: "62% 50%",
  },
  {
    name: "Lavabos",
    items: "Peças de destaque que fazem um espaço pequeno marcar presença.",
    stone: "onix-cristal",
    image: "/images/materiais/onix-cristal/lavabo.webp",
    position: "48% 50%",
  },
  {
    name: "Áreas gourmet",
    items:
      "Superfícies para receber, cozinhar e conviver, dentro ou fora de casa.",
    stone: "verde-ubatuba",
    image: "/images/materiais/verde-ubatuba/gourmet.webp",
    position: "52% 60%",
  },
];

// General answers only: nothing here promises prices, deadlines or regions.
const faqs = [
  {
    q: "Como peço um orçamento?",
    a: "Use o formulário de orçamento e envie medidas, planta ou fotos do espaço, junto com a pedra que você tem em mente. Se ainda não escolheu, a equipe indica opções adequadas ao uso.",
  },
  {
    q: "Preciso ter as medidas exatas?",
    a: "Não. Medidas aproximadas bastam para começar. As dimensões finais, os recortes e os encontros são confirmados antes do corte, conforme as condições da obra.",
  },
  {
    q: "Qual a diferença entre granito, mármore e quartzo?",
    a: "O granito tem aspecto granulado e boa resistência a riscos e calor, por isso é comum em cozinhas e áreas gourmet. O mármore tem veios marcantes e é mais sensível a ácidos e manchas, pedindo mais cuidado no uso. O quartzo tem aparência mais uniforme e baixa porosidade.",
  },
  {
    q: "A pedra que vou receber é igual à das fotos?",
    a: "Cada chapa de pedra natural tem veios e tonalidade próprios. As imagens do site são referência; a escolha final é feita sobre a chapa disponível.",
  },
  {
    q: "Vocês fazem a instalação?",
    a: "Sim. A instalação na obra faz parte do trabalho, e você recebe as orientações de uso e conservação daquele tipo de pedra.",
  },
  {
    q: "Como limpar e conservar a pedra?",
    a: "No dia a dia, use pano macio com água e detergente neutro. Evite produtos ácidos, abrasivos ou com cloro, e seque líquidos derramados logo, principalmente em mármores.",
  },
  {
    q: "Vocês atendem arquitetos e construtoras?",
    a: "Sim. Traga plantas e detalhes da obra para resolvermos paginação, encontros e acabamentos junto com o projeto.",
  },
];

const steps = [
  {
    title: "Escuta e seleção",
    text: "Conte como o espaço será usado e envie planta, fotos ou medidas aproximadas. Indicamos as pedras que combinam com o uso e com o projeto.",
    kind: "samples",
    visual: () => <SamplesVisual />,
  },
  {
    title: "Medidas e projeto",
    text: "Antes do corte, definimos dimensões, recortes de cuba e cooktop e os encontros com paredes e marcenaria, conforme a obra.",
    kind: "drawing",
    visual: (id: string) => <PlanVisual id={id} />,
  },
  {
    title: "Corte e acabamento",
    text: "A chapa é cortada sob medida, com a paginação dos veios e o acabamento de borda escolhidos. As opções variam conforme a pedra.",
    kind: "drawing",
    visual: (id: string) => <EdgesVisual id={id} />,
  },
  {
    title: "Instalação e cuidado",
    text: "A peça é instalada na obra, e você recebe as orientações de limpeza e conservação daquele tipo de pedra.",
    kind: "photo",
    visual: () => <InstalledVisual />,
  },
];

// Splits a line into masked words so headings can rise into place.
function Words({ text }: { text: string }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      <span className={s.word}>
        <span>{word}</span>
      </span>{" "}
    </Fragment>
  ));
}

export function Home() {
  const root = useRef<HTMLDivElement>(null);
  const swipe = useRef<HTMLDivElement>(null);
  // Phones: the bar under the stones follows the swipe, so it shows there is more to the side.
  useEffect(() => {
    const track = root.current?.querySelector<HTMLElement>("[data-track]");
    const bar = swipe.current;
    if (!track || !bar) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      bar.style.setProperty("--thumb-left", `${(scrollLeft / scrollWidth) * 100}%`);
      bar.style.setProperty("--thumb-width", `${(clientWidth / scrollWidth) * 100}%`);
      // Snapping alone shifts the track a few pixels; hide the hint only on a real swipe.
      if (scrollLeft > 80) bar.setAttribute("data-moved", "");
    };
    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
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

          const process =
            root.current?.querySelector<HTMLElement>("[data-process]");
          process?.setAttribute("data-animate", "");
          const stepEls = gsap.utils.toArray<HTMLElement>("[data-step]");
          const reach = (el: HTMLElement) =>
            el.setAttribute("data-reached", "");
          // Each block rises in as it enters; its drawing traces itself then.
          stepEls.forEach((el) => {
            gsap.from(el, {
              autoAlpha: 0,
              y: 32,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 82%",
                onEnter: () => reach(el),
              },
            });
          });

          // Page load: the photo settles while the headline rises.
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from("[data-hero-image]", {
              autoAlpha: 0,
              duration: 1.2,
              ease: "power2.out",
            })
            .from(
              "[data-hero] h1 > span > span",
              { yPercent: 115, duration: 1.1, stagger: 0.08 },
              0.25,
            )
            .from(
              "[data-hero-fade]",
              { autoAlpha: 0, y: 24, duration: 0.9, stagger: 0.12 },
              0.9,
            );
          // Scroll-linked parallax is skipped on low-memory devices and data saver.
          if (!prefersLightMotion()) gsap.to("[data-hero-image]", {
            yPercent: 16,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero]",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
            gsap.from(el.querySelectorAll(":scope > span > span"), {
              yPercent: 115,
              duration: 1,
              stagger: 0.06,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 85%" },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
            gsap.from(el, {
              autoAlpha: 0,
              y: 32,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 88%" },
            });
          });

          gsap.from("[data-room]", {
            autoAlpha: 0,
            y: 40,
            duration: 0.9,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-rooms]", start: "top 80%" },
          });

          // Stones: pinned horizontal run on wide screens, native swipe on phones.
          const track =
            root.current?.querySelector<HTMLElement>("[data-track]");
          if (wide && track) {
            const distance = () =>
              Math.max(0, track.scrollWidth - track.clientWidth);
            gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: "[data-stones]",
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            });
          } else {
            gsap.from("[data-track] > a", {
              autoAlpha: 0,
              x: 40,
              duration: 0.9,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: "[data-track]", start: "top 85%" },
            });
          }

          gsap.from("[data-project]", {
            autoAlpha: 0,
            y: 32,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-projects]", start: "top 80%" },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <section className={s.hero} data-hero aria-labelledby="home-title">
        <div className={s.heroImage} data-hero-image>
          <Image
            src="/images/materiais/travertino/cozinha.webp"
            fill
            priority
            sizes="100vw"
            alt="Cozinha com ilha de pedra natural — ambiente ilustrativo"
          />
        </div>
        <div className={s.heroShade} />
        <div className={s.heroContent}>
          <h1 id="home-title">
            <Words text="Mármore e granito sob medida." />
          </h1>
          <p data-hero-fade>
            Bancadas, ilhas, lavatórios e áreas gourmet, do corte à instalação.
          </p>
          <div className={s.heroActions} data-hero-fade>
            <Link href="/contato" className={`button ${s.heroButton}`}>
              Pedir orçamento
            </Link>
            <Link href="/materiais" className="text-link">
              Ver as pedras
            </Link>
          </div>
        </div>
      </section>

      <section className={s.offer} aria-labelledby="home-offer">
        <div className={s.offerHeading}>
          <h2 id="home-offer" data-rise>
            <Words text="O que fazemos" />
          </h2>
          <p data-fade>
            Pedra natural para qualquer ambiente da casa, desenhada para o seu
            espaço e instalada por quem cortou.
          </p>
        </div>
        <div className={s.rooms} data-rooms>
          {rooms.map((room) => (
            <article key={room.name} className={s.room} data-room>
              <div className={s.roomImage}>
                <Image
                  src={room.image}
                  fill
                  sizes="(max-width:700px) 50vw, (max-width:1100px) 50vw, 25vw"
                  style={{ objectPosition: room.position }}
                  alt={`${room.name} com ${stoneName(room.stone)}`}
                />
              </div>
              <h3>{room.name}</h3>
              <p>{room.items}</p>
              <Link href={`/materiais/${room.stone}`} className={s.roomStone}>
                Na imagem: {stoneName(room.stone)}
              </Link>
            </article>
          ))}
        </div>
        <p className={s.roomsMore} data-fade>
          E também lareiras, tampos de mesa, revestimentos e outras peças
          especiais, sempre sob medida.
        </p>
      </section>

      <section className={s.stones} data-stones aria-labelledby="home-stones">
        <div className={s.stonesHeading}>
          <h2 id="home-stones" data-rise>
            <Words text="A seleção de pedras" />
          </h2>
          <p data-fade>
            Granitos, mármores, quartzos, travertinos, ônix e nanoglass. Cada
            chapa tem desenho próprio.
          </p>
          <Link href="/materiais" className="button" data-fade>
            Ver catálogo completo
          </Link>
        </div>
        <div className={s.stoneTrack} data-track>
          {materials.map((m) => (
            <Link
              key={m.slug}
              href={`/materiais/${m.slug}`}
              className={s.stone}
            >
              <div className={s.stoneImage}>
                <Image
                  src={m.texture}
                  fill
                  loading="eager"
                  sizes="(max-width:900px) 60vw, 22vw"
                  alt={`Textura de referência de ${m.name}`}
                />
              </div>
              <h3>{m.name}</h3>
              {m.category !== m.name && <p>{m.category}</p>}
            </Link>
          ))}
        </div>
        <div className={s.swipe} ref={swipe} aria-hidden="true">
          <span className={s.swipeBar}>
            <span className={s.swipeThumb} />
          </span>
          <span className={s.swipeHint}>
            Arraste para o lado <span className={s.swipeArrow}>→</span>
          </span>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className={s.projects} aria-labelledby="home-projects">
          <div className={s.projectsHeading}>
            <h2 id="home-projects" data-rise>
              <Words text="Projetos" />
            </h2>
            <Link href="/projetos" className="button" data-fade>
              Ver todos os projetos
            </Link>
          </div>
          <div className={s.projectGrid} data-projects>
            {featuredProjects.map((p) => (
              <Link
                key={p.slug}
                href={`/projetos/${p.slug}`}
                className={s.project}
                data-project
              >
                <div className={s.projectImage}>
                  <Image
                    src={p.image}
                    width={p.width}
                    height={p.height}
                    sizes="(max-width:700px) 100vw, 33vw"
                    alt={`${p.name}${p.demo ? " — estudo ilustrativo" : ""}`}
                  />
                </div>
                <p className={s.projectSpace}>{p.space}</p>
                <h3>{p.name}</h3>
                {p.demo && (
                  <p className={s.projectNote}>
                    Estudo ilustrativo, não representa obra executada
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        className={s.process}
        data-process
        aria-labelledby="home-process"
      >
        <div className={s.processHeading}>
          <h2 id="home-process" data-rise>
            <Words text="Como trabalhamos" />
          </h2>
          <p data-fade>
            Do primeiro contato à peça instalada, cada etapa é combinada com
            você.
          </p>
        </div>
        {/* Mosaic: every step visible at once, read left to right, top to bottom. */}
        <ul className={s.mosaic}>
          {steps.map((step, i) => (
            <li
              key={step.title}
              className={s.cell}
              data-step
              data-kind={step.kind}
            >
              <div className={s.cellVisual}>{step.visual(`step-${i}`)}</div>
              <div className={s.cellText}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={s.faq} aria-labelledby="home-faq">
        <div className={s.faqHeading}>
          <h2 id="home-faq" data-rise>
            <Words text="Perguntas frequentes" />
          </h2>
          <p data-fade>Não achou a resposta? Mande sua pergunta.</p>
          <Link href="/contato" className="button" data-fade>
            Fale com a equipe
          </Link>
        </div>
        <div className={s.faqList}>
          {faqs.map((item, i) => (
            <details key={item.q} open={i === 0}>
              <summary>
                {item.q}
                <span aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            }),
          }}
        />
      </section>

      <ContactBand />
    </div>
  );
}

export function ContactBand() {
  const channels = [
    ...site.whatsapp.map((w) => ({
      label: `WhatsApp ${w.name}`,
      href: whatsappLink(w.number),
      external: true,
    })),
    site.phone && {
      label: `Telefone ${site.phone.display}`,
      href: `tel:+${site.phone.number}`,
    },
    site.email && { label: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { label: string; href: string; external?: boolean }[];
  return (
    <section className={s.contact} aria-labelledby="home-contact">
      <div className={s.contactMain}>
        <h2 id="home-contact" data-rise>
          <Words text="Conte como é o seu espaço." />
        </h2>
        <p data-fade>
          Envie medidas, plantas ou fotos. A equipe indica as pedras adequadas e
          prepara o orçamento.
        </p>
        <Link href="/contato" className="button button-accent" data-fade>
          Pedir orçamento
        </Link>
      </div>
      <div className={s.contactSide} data-fade>
        {(channels.length > 0 || site.address || site.serviceArea) && (
          <ul>
            {channels.map((c) => (
              <li key={c.href}>
                <a href={c.href}>
                  {c.label}
                  {c.external && <span aria-hidden="true"> ↗︎</span>}
                </a>
              </li>
            ))}
            {site.address && <li>{site.address}</li>}
            {site.serviceArea && <li>{site.serviceArea}</li>}
          </ul>
        )}
        <div>
          <h3>Arquitetos e construtoras</h3>
          <p>
            Traga plantas e detalhes da obra. Resolvemos paginação, encontros e
            acabamentos junto com o seu projeto.
          </p>
          <Link
            href="/contato?tipo=Parceria%20profissional"
            className="button button-light"
          >
            Atendimento para profissionais
          </Link>
        </div>
      </div>
    </section>
  );
}
