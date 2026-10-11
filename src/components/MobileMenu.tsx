"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="panel-movil"
        onClick={() => setOpen((v) => !v)}
        className="border-paper flex size-11 cursor-pointer items-center justify-center rounded-full border-2 bg-transparent p-0 md:hidden"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h10" />}
        </svg>
      </button>
      <nav
        id="panel-movil"
        aria-label="Principal"
        hidden={!open}
        className="border-gray-850 bg-ink absolute inset-x-0 top-full border-b-2 md:hidden"
      >
        <ul className="px-gutter m-0 flex list-none flex-col py-2">
          {site.nav.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display hover:text-yolk text-paper flex min-h-14 items-center text-[28px] no-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
