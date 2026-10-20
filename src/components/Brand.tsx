import Link from "next/link";
import s from "./shell.module.css";
export function Brand() {
  return (
    <Link
      href="/"
      className={s.brand}
      aria-label="Cipola Mármores e Granitos — início"
    >
      <svg viewBox="0 0 46 52" width="38" height="46" aria-hidden="true">
        <path d="M23 1 34 12 23 23 12 12Z" fill="#59568e" />
        <path d="M11 14 22 25 11 36 0 25Z" fill="#cc9e64" />
        <path
          d="m35 14 11 11-11 11-11-11Z"
          fill="#1f2021"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path d="m23 27 11 11-11 11-11-11Z" fill="#668d98" />
      </svg>
      <span>
        Cipola<small>MÁRMORES E GRANITOS</small>
      </span>
    </Link>
  );
}
