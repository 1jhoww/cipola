"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  environments,
  type EnvironmentId,
  type EnvironmentImage,
} from "@/lib/environments";
import { materials, type Material } from "@/lib/data";
import { ScrollRow } from "@/components/ScrollRow";
import { WhatsAppQuote } from "@/components/WhatsAppQuote";
import s from "./material.module.css";
export function EnvironmentGallery({
  material,
  catalog,
}: {
  material: Material;
  // Approved environment images for every stone, keyed by slug, so the same room can be shown with another stone.
  catalog: Record<string, EnvironmentImage[]>;
}) {
  const reduce = useReducedMotion();
  const own = catalog[material.slug] ?? [];
  const [room, setRoom] = useState<EnvironmentId | undefined>(
    own[0]?.environment,
  );
  const [stoneSlug, setStoneSlug] = useState(material.slug);
  const stone = materials.find((m) => m.slug === stoneSlug) ?? material;
  const imageFor = (slug: string, id?: EnvironmentId) =>
    catalog[slug]?.find((entry) => entry.environment === id);
  const image = imageFor(stone.slug, room);
  const scene = environments.find((item) => item.id === room);
  // Only rooms with an approved image for the shown stone are offered.
  const rooms = environments.filter((item) => imageFor(stone.slug, item.id));
  const stones = materials.filter((m) => imageFor(m.slug, room));
  const comparing = stone.slug !== material.slug;
  return (
    <section id="ambientes" className={s.environments}>
      <h2 className={s.environmentTitle}>
        Imagine {material.name} no seu ambiente.
      </h2>
      {image && scene ? (
        <div className={s.sceneLayout}>
          <div className={s.environmentImage}>
            <AnimatePresence initial={false}>
              <motion.div
                key={image.src}
                className={s.environmentFrame}
                initial={{ opacity: 0, scale: reduce ? 1 : 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width:900px) 100vw, 60vw"
                  quality={85}
                />
              </motion.div>
            </AnimatePresence>
            <span>Simulação ilustrativa</span>
          </div>
          <div className={s.sceneControls}>
            {rooms.length > 1 && (
              <div>
                <p className={s.controlLabel}>Ambiente</p>
                <ScrollRow label="Ambiente" className={s.roomTabs}>
                  {rooms.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={room === item.id}
                      onClick={() => setRoom(item.id)}
                    >
                      {item.name}
                    </button>
                  ))}
                </ScrollRow>
                <p className={s.controlNote}>{scene.description}</p>
              </div>
            )}
            {stones.length > 1 && (
              <div className={s.stonePicker}>
                <p className={s.controlLabel}>Pedra</p>
                <p className={s.stoneName} aria-live="polite">
                  {stone.name}
                </p>
                <p className={s.stoneMeta}>
                  {stone.category},{" "}
                  {stone.character.toLowerCase().replace(" · ", " e ")}
                </p>
                <ScrollRow label="Pedra" className={s.swatches}>
                  {stones.map((item) => (
                    <button
                      key={item.slug}
                      type="button"
                      aria-pressed={stone.slug === item.slug}
                      aria-label={item.name}
                      title={item.name}
                      onClick={() => setStoneSlug(item.slug)}
                    >
                      <Image
                        src={item.texture}
                        alt=""
                        fill
                        sizes="48px"
                        quality={60}
                      />
                    </button>
                  ))}
                </ScrollRow>
              </div>
            )}
            {comparing && (
              <div className={s.compareActions}>
                <Link href={`/materiais/${stone.slug}`} className="button">
                  Conhecer {stone.name}
                </Link>
                <button
                  type="button"
                  className={s.backLink}
                  onClick={() => setStoneSlug(material.slug)}
                >
                  Voltar para {material.name}
                </button>
              </div>
            )}
            <div className={s.sceneQuote}>
              <p>
                Gostou da combinação? A equipe confirma chapas disponíveis,
                acabamento e prazo para o seu projeto.
              </p>
              <WhatsAppQuote material={stone.name} className="button button-vein">
                Pedir orçamento de {stone.name} <span aria-hidden="true">↗</span>
              </WhatsAppQuote>
            </div>
          </div>
        </div>
      ) : (
        <div className={s.environmentEmpty}>
          <p>As aplicações de {material.name} estão em preparação.</p>
          <WhatsAppQuote material={material.name} className="button button-vein">
            Pedir orçamento pelo WhatsApp <span aria-hidden="true">↗</span>
          </WhatsAppQuote>
        </div>
      )}
    </section>
  );
}
