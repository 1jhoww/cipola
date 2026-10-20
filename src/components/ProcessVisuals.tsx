import Image from "next/image";
import { materials } from "@/lib/data";
import s from "./home.module.css";

const sampleSlugs = [
  "travertino",
  "marmore-branco",
  "preto-sao-gabriel",
  "verde-ubatuba",
  "santa-cecilia",
  "onix-cristal",
];

// Sample tiles, as laid out on the table during the first conversation.
export function SamplesVisual() {
  return (
    <div className={s.samples}>
      {sampleSlugs.map((slug) => {
        const m = materials.find((x) => x.slug === slug)!;
        return (
          <figure key={slug}>
            <div>
              <Image src={m.texture} fill sizes="200px" loading="eager" alt="" />
            </div>
            <figcaption>{m.name}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

// Plan view of a countertop with its dimension lines and cut-outs.
export function PlanVisual({ id }: { id: string }) {
  return (
    <svg
      className={s.drawing}
      viewBox="0 0 400 300"
      role="img"
      aria-label="Desenho de bancada vista de cima, com comprimento, profundidade e recortes de cuba e cooktop"
    >
      <defs>
        <pattern
          id={`${id}-stone`}
          patternUnits="userSpaceOnUse"
          width="220"
          height="220"
        >
          <image
            href="/textures/branco-dallas.jpg"
            width="220"
            height="220"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      </defs>
      <rect x="40" y="110" width="320" height="110" fill={`url(#${id}-stone)`} />
      <rect className={s.cutout} x="88" y="132" width="92" height="62" rx="8" />
      <rect className={s.cutout} x="232" y="130" width="88" height="66" />
      <g className={s.lines} fill="none">
        <rect x="40" y="110" width="320" height="110" pathLength="1" />
        <rect x="88" y="132" width="92" height="62" rx="8" pathLength="1" />
        <path d="M40 80V100M360 80V100M40 90H360" pathLength="1" />
        <path d="M20 110H36M20 220H36M28 110V220" pathLength="1" />
        <path d="M134 194V258H116M276 196V258H294" pathLength="1" />
      </g>
      <rect
        className={s.dashed}
        x="232"
        y="130"
        width="88"
        height="66"
      />
      <g className={s.labels}>
        <text x="200" y="72" textAnchor="middle">
          comprimento
        </text>
        <text x="-165" y="14" textAnchor="middle" transform="rotate(-90)">
          profundidade
        </text>
        <text x="112" y="263" textAnchor="end">
          cuba
        </text>
        <text x="298" y="263">
          cooktop
        </text>
      </g>
    </svg>
  );
}

// Cross-sections of three common edge finishes.
export function EdgesVisual({ id }: { id: string }) {
  const fill = `url(#${id}-edge)`;
  return (
    <svg
      className={s.drawing}
      viewBox="0 0 400 300"
      role="img"
      aria-label="Corte lateral de três bordas: reta, meia-esquadria e boleada"
    >
      <defs>
        <pattern
          id={`${id}-edge`}
          patternUnits="userSpaceOnUse"
          width="160"
          height="160"
        >
          <image
            href="/textures/travertino.jpg"
            width="160"
            height="160"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      </defs>
      <g transform="translate(20 110)">
        <path d="M0 0H100V30H0Z" fill={fill} />
        <path className={s.edgeLine} d="M0 0H100V30H0" pathLength="1" />
        <text className={s.edgeLabel} x="50" y="130" textAnchor="middle">
          Reta
        </text>
      </g>
      <g transform="translate(150 110)">
        <path d="M0 0H100L70 30H0Z" fill={fill} />
        <path d="M100 0V90H70V30Z" fill={fill} />
        <path
          className={s.edgeLine}
          d="M0 0H100V90H70V30H0M70 30L100 0"
          pathLength="1"
        />
        <text className={s.edgeLabel} x="50" y="130" textAnchor="middle">
          Meia-esquadria
        </text>
      </g>
      <g transform="translate(280 110)">
        <path d="M0 0H85A15 15 0 0 1 85 30H0Z" fill={fill} />
        <path
          className={s.edgeLine}
          d="M0 0H85A15 15 0 0 1 85 30H0"
          pathLength="1"
        />
        <text className={s.edgeLabel} x="50" y="130" textAnchor="middle">
          Boleada
        </text>
      </g>
    </svg>
  );
}

// Finished bathroom; 3:2 like the frame, so it fills it whole without cropping.
export function InstalledVisual() {
  return (
    <Image
      className={s.installed}
      src="/images/banheiro.jpg"
      width={1536}
      height={1024}
      sizes="(max-width:900px) 90vw, 55vw"
      alt="Banheiro com bancada de pedra instalada"
    />
  );
}
