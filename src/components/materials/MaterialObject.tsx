"use client";
import {
  Component,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import type { Material } from "@/lib/data";
import s from "./material.module.css";
// Imported statically (not lazily) so the 3D code downloads with the page itself,
// in parallel with the HTML, and the slab is live as soon as the page hydrates.
import StoneStudio from "./StoneStudio";
class ObjectBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
const ROTATE_STEP = 0.3;
const ZOOM_STEP = 0.15;
const clampZoom = (value: number) => Math.min(1.8, Math.max(0.75, value));
export function MaterialObject({ material }: { material: Material }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  // `reset` changes on every "Restaurar" so the camera returns even when angle and zoom are already at rest.
  const [view, setView] = useState({ angle: 0, zoom: 1, reset: 0 });
  const [zoomTip, setZoomTip] = useState(false);
  const objectRef = useRef<HTMLDivElement>(null);
  const rotate = (direction: number) =>
    setView((v) => ({ ...v, angle: v.angle + direction * ROTATE_STEP }));
  const zoomBy = (direction: number) =>
    setView((v) => ({ ...v, zoom: clampZoom(v.zoom + direction * ZOOM_STEP) }));
  const restore = () =>
    setView((v) => ({ angle: 0, zoom: 1, reset: v.reset + 1 }));
  // A plain wheel scrolls the page; only Ctrl/⌘ + wheel (and trackpad pinch, which sends ctrlKey) reaches the 3D zoom.
  useEffect(() => {
    const node = objectRef.current;
    if (!node) return;
    let timer: ReturnType<typeof setTimeout>;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.stopPropagation();
      setZoomTip(true);
      clearTimeout(timer);
      timer = setTimeout(() => setZoomTip(false), 1400);
    };
    node.addEventListener("wheel", onWheel, { capture: true });
    return () => {
      clearTimeout(timer);
      node.removeEventListener("wheel", onWheel, { capture: true });
    };
  }, []);
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const actions: Record<string, () => void> = {
      ArrowLeft: () => rotate(-0.5),
      ArrowRight: () => rotate(0.5),
      "+": () => zoomBy(1),
      "=": () => zoomBy(1),
      "-": () => zoomBy(-1),
      Home: restore,
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };
  // Same file the 3D texture loads (preloaded by the page), so it is downloaded once.
  const poster = (
    <div className={s.poster} data-hidden={ready}>
      <Image
        src={material.texture}
        alt={`Superfície de ${material.name}`}
        fill
        priority
        unoptimized
      />
    </div>
  );
  return (
    <div className={s.objectWrap}>
      <div
        ref={objectRef}
        className={s.object}
        tabIndex={0}
        role="region"
        aria-label={`Pedra ${material.name}. Gire com as setas; use mais e menos para aproximar; Home restaura a vista.`}
        aria-describedby="stone-instructions"
        onKeyDown={keyboard}
      >
        <ObjectBoundary
          fallback={
            <>
              {poster}
              <FallbackFlag onFail={() => setFailed(true)} />
              <p className={s.fallbackNote}>
                Exibindo a amostra estática neste dispositivo.
              </p>
            </>
          }
        >
          {poster}
          <div className={s.studio} data-ready={ready}>
            <StoneStudio
              material={material}
              onReady={() => setReady(true)}
              view={view}
            />
          </div>
        </ObjectBoundary>
        <p className={s.zoomTip} data-visible={zoomTip} aria-hidden="true">
          Use Ctrl + rolagem para aproximar
        </p>
      </div>
      {!failed && (
        <div className={s.objectBar}>
          <p id="stone-instructions" className={s.objectHint}>
            {ready ? (
              <>
                Arraste para girar. Use os botões
                <span className={s.hintMouse}> ou Ctrl + rolagem</span> para
                aproximar.
              </>
            ) : (
              "Preparando a pedra…"
            )}
          </p>
          <div
            className={s.objectControls}
            role="group"
            aria-label="Controles da pedra"
          >
            <button
              type="button"
              onClick={() => rotate(-1)}
              disabled={!ready}
              aria-label="Girar para a esquerda"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M7 5 3 9l4 4M3.5 9H12a5 5 0 0 1 0 10h-2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => rotate(1)}
              disabled={!ready}
              aria-label="Girar para a direita"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m13 5 4 4-4 4M16.5 9H8a5 5 0 0 0 0 10h2" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => zoomBy(1)}
              disabled={!ready || view.zoom >= 1.8}
              aria-label="Aproximar"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 4v12M4 10h12" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => zoomBy(-1)}
              disabled={!ready || view.zoom <= 0.75}
              aria-label="Afastar"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h12" />
              </svg>
            </button>
            <button
              type="button"
              className={s.objectRestore}
              onClick={restore}
              disabled={!ready}
            >
              Restaurar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// Lets the parent hide the 3D controls once the static fallback is showing.
function FallbackFlag({ onFail }: { onFail: () => void }) {
  useEffect(() => onFail(), [onFail]);
  return null;
}
