"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./scroll-row.module.css";
// A horizontal row that scrolls with arrow buttons instead of a visible scrollbar.
// The arrows only appear when the content is wider than the row.
export function ScrollRow({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const node = track.current;
    if (!node) return;
    const update = () =>
      setEdges({
        start: node.scrollLeft <= 1,
        end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 1,
      });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    node.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      node.removeEventListener("scroll", update);
    };
  }, []);
  const move = (direction: number) =>
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  return (
    <div className={s.row} data-overflow={!(edges.start && edges.end)}>
      <button
        type="button"
        className={s.arrow}
        onClick={() => move(-1)}
        disabled={edges.start}
        aria-label={`${label}: anteriores`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m12 4-6 6 6 6" />
        </svg>
      </button>
      <div
        ref={track}
        className={`${s.track} ${className ?? ""}`}
        role="group"
        aria-label={label}
      >
        {children}
      </div>
      <button
        type="button"
        className={s.arrow}
        onClick={() => move(1)}
        disabled={edges.end}
        aria-label={`${label}: próximos`}
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m8 4 6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
