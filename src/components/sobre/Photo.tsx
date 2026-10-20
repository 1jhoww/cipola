import Image from "next/image";
import type { PhotoSlot } from "@/content/sobre-photos";
import s from "./about.module.css";

// A fixed-proportion frame: the real photo when `src` is set, a labelled
// placeholder until then. `data-photo` drives the scroll reveal.
export function Photo({
  slot,
  sizes,
  priority = false,
  className = "",
  caption,
}: {
  slot: PhotoSlot;
  sizes: string;
  priority?: boolean;
  className?: string;
  caption?: React.ReactNode;
}) {
  return (
    <figure className={`${s.photo} ${className}`}>
      <div
        className={s.frame}
        style={{ aspectRatio: slot.ratio }}
        data-photo
      >
        <div className={s.media} data-photo-media>
          {slot.src ? (
            <Image
              src={slot.src}
              alt={slot.alt}
              fill
              priority={priority}
              sizes={sizes}
              style={{ objectPosition: slot.position }}
            />
          ) : (
            <div className={s.placeholder} aria-hidden="true">
              <span>{slot.purpose}</span>
              <span>Fotografia a incluir, proporção {slot.ratio.replace(/ /g, "")}</span>
            </div>
          )}
        </div>
      </div>
      {caption && <figcaption className={s.caption}>{caption}</figcaption>}
    </figure>
  );
}
