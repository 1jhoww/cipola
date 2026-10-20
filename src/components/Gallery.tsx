"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/data";
import s from "./project.module.css";
// Photos are shown whole at their own proportions and never scaled past their
// pixel size, so client photos stay sharp and nothing is cropped.
export function Gallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const several = images.length > 1;
  const current = images[index];
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <div className={s.gallery}>
      <button
        ref={trigger}
        className={s.photo}
        onClick={() => setOpen(true)}
        aria-label="Ver a foto em tela cheia"
        style={{ maxWidth: current.width }}
      >
        <Image
          src={current.image}
          alt={current.alt}
          width={current.width}
          height={current.height}
          priority
          sizes={`(max-width: 1000px) 100vw, min(58vw, ${current.width}px)`}
        />
      </button>
      <div className={s.photoBar}>
        {several && (
          <div className={s.thumbs}>
            {images.map((img, i) => (
              <button
                key={img.image}
                onClick={() => setIndex(i)}
                aria-pressed={index === i}
                aria-label={`Ver: ${img.alt}`}
              >
                <Image
                  src={img.image}
                  alt=""
                  width={img.width}
                  height={img.height}
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
        <button className={s.expand} onClick={() => setOpen(true)}>
          Ver em tela cheia
        </button>
      </div>
      <dialog
        ref={dialog}
        className={s.lightbox}
        aria-label={current.alt}
        onCancel={() => setOpen(false)}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onKeyDown={(e) => {
          if (!several) return;
          if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
          if (e.key === "ArrowLeft")
            setIndex((i) => (i + images.length - 1) % images.length);
        }}
      >
        <div className={s.lightboxTop}>
          <p>{current.alt}</p>
          <button onClick={() => setOpen(false)}>Fechar</button>
        </div>
        <div className={s.lightboxImage}>
          <Image
            src={current.image}
            alt={current.alt}
            width={current.width}
            height={current.height}
            sizes={`${current.width}px`}
          />
        </div>
        {several && (
          <div className={s.lightboxBottom}>
            <button
              onClick={() =>
                setIndex((i) => (i + images.length - 1) % images.length)
              }
            >
              Foto anterior
            </button>
            <button onClick={() => setIndex((i) => (i + 1) % images.length)}>
              Próxima foto
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
