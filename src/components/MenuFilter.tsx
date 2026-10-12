"use client";

import Image from "next/image";
import { useState } from "react";
import { Smiley } from "@/components/ui/Smiley";
import type { MenuItem } from "@/data/menu";
import { precio } from "@/data/menu";

type Props = {
  categorias: readonly { id: string; label: string }[];
  rellenos: readonly string[];
  items: readonly MenuItem[];
};

const ESTRELLA = "M50 6 L61 38 L95 39 L68 59 L78 92 L50 72 L22 92 L32 59 L5 39 L39 38 Z";

export function MenuFilter({ categorias, rellenos, items }: Props) {
  const [cat, setCat] = useState("todo");
  const [vegano, setVegano] = useState(false);

  // Todos los productos van siempre en el HTML; el filtro solo oculta.
  const visible = (i: MenuItem) => (cat === "todo" || i.categoria === cat) && (!vegano || i.vegano);
  const n = items.filter(visible).length;
  const chips = [{ id: "todo", label: "Todo" }, ...categorias];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="flex max-w-[640px] flex-col gap-3.5 md:gap-4">
          <h2 id="h2-menu" className="font-display text-yolk m-0 text-[84px] leading-[0.88] md:text-h2-xl">Menú</h2>
          <p className="m-0 text-base leading-normal text-gray-200 md:text-[19px]">
            Todo frito al momento y servido en nuestra caja amarilla. {items.length} productos, de los corndogs a las bebidas coreanas.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={vegano}
          onClick={() => setVegano((v) => !v)}
          className={`btn-lift font-display bg-paper text-ink border-paper -rotate-3 inline-flex min-h-[60px] cursor-pointer items-center gap-3 rounded-full border-[3px] px-7 text-[22px] md:text-2xl ${vegano ? "shadow-[0_0_0_5px_var(--color-yolk),6px_6px_0_5px_var(--color-yolk)]" : "shadow-sticker-yolk"}`}
        >
          <svg aria-hidden="true" width="26" height="26" viewBox="0 0 100 100">
            <path d={ESTRELLA} fill={vegano ? "#0A0A0A" : "#FFD400"} stroke="#0A0A0A" strokeWidth="8" strokeLinejoin="round" />
          </svg>
          Solo vegano
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Filtrar por categoría" className="scrollbar-none flex gap-2.5 overflow-x-auto py-1 max-md:w-full md:flex-wrap md:gap-3 md:overflow-visible md:p-0">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={cat === c.id}
              onClick={() => setCat(c.id)}
              className={`font-display border-yolk min-h-11 flex-none cursor-pointer rounded-full border-2 px-[18px] text-[17px] md:min-h-12 md:px-[22px] md:text-lg ${cat === c.id ? "bg-yolk text-ink" : "text-yolk bg-transparent"}`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="m-0 text-[13px] font-bold tracking-[0.06em] text-gray-300 uppercase md:ml-auto md:text-[15px]">
          {n} {n === 1 ? "producto" : "productos · desliza →"}
        </p>
      </div>

      <div className="border-yolk flex flex-wrap items-center gap-x-3.5 gap-y-2.5 rounded-lg border-2 border-dashed px-3.5 py-3 md:px-5 md:py-4">
        <span className="font-marker text-yolk w-full text-[17px] md:w-auto md:text-xl">Elige el relleno de tu corndog:</span>
        {rellenos.map((r) => (
          <span key={r} className="bg-paper text-ink rounded-full px-3 py-[5px] text-[13px] font-bold md:px-3.5 md:py-1.5 md:text-[15px]">{r}</span>
        ))}
        <span className="text-sm text-gray-300">Los tres son veganos.</span>
      </div>

      <ul className="scrollbar-none -mx-gutter px-gutter m-0 flex list-none snap-x snap-mandatory gap-4 overflow-x-auto p-0 pt-1 pb-5 [scrollbar-color:var(--color-yolk)_var(--color-gray-850)] md:gap-6 md:[scrollbar-width:thin]">
        {items.map((i) => (
          <li
            key={i.id}
            className={`bg-yolk text-ink w-[260px] flex-none snap-start flex-col overflow-hidden rounded-md md:w-[284px] ${visible(i) ? "flex" : "hidden"}`}
          >
            <svg aria-hidden="true" viewBox="0 0 300 30" preserveAspectRatio="none" className="bg-ink block h-[26px] w-full md:h-[30px]">
              <path d="M0 30 L22 4 L146 4 L150 30 Z M150 30 L154 4 L278 4 L300 30 Z" fill="#E8C200" stroke="#0A0A0A" strokeWidth="2" />
            </svg>
            <div className={`relative mx-3 mt-3 flex aspect-[6/7] items-end ${i.foto ? "bg-ink" : "photo-placeholder"} rounded-sm p-2.5 md:mx-3.5 md:mt-3.5 md:p-3`}>
              {i.foto ? (
                <Image src={i.foto} alt={i.nombre} fill sizes="284px" className="rounded-sm object-contain" />
              ) : (
                <span className="text-[11px] font-bold tracking-[0.08em] text-gray-400 uppercase md:text-xs">Foto · {i.nombre}</span>
              )}
              <div className="absolute -top-2 -right-1 rotate-10 md:-top-2.5 md:-right-1.5">
                <Smiley size={52} spicy={i.picante} className="max-md:size-11" />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-3.5 md:gap-2 md:p-[18px] md:pb-5">
              <h3 className="font-display m-0 text-2xl leading-none md:text-[28px]">{i.nombre}</h3>
              <p className="m-0 flex-1 text-sm leading-[1.4] md:text-[15px] md:leading-[1.45]">{i.descripcion}</p>
              <div className="border-ink flex items-center justify-between gap-2 border-t-2 border-dashed pt-2 md:pt-2.5">
                <span className="font-display text-xl md:text-[22px]">{precio(i.precio)}</span>
                <div className="flex items-center gap-1.5">
                  {i.picante && (
                    <span className="bg-ink text-yolk rounded-full px-2 py-0.5 text-[11px] font-extrabold tracking-[0.06em] uppercase md:px-2.5 md:py-[3px] md:text-xs">Picante</span>
                  )}
                  {i.favorito && (
                    <span className="font-marker bg-paper border-ink -rotate-4 inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-[13px] whitespace-nowrap md:text-sm">
                      <span lang="ko" className="font-korean">인기</span> · Favorito
                    </span>
                  )}
                  {i.etiqueta && (
                    <span className="font-marker bg-paper border-ink -rotate-4 inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-[13px] whitespace-nowrap md:text-sm">
                      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" className="fill-leaf stroke-leaf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 19C5 10 10 4 20 4c0 10-5 15-13 15" />
                        <path d="M5 19c3-5 6-8 10-10" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
                      </svg>
                      {i.etiqueta}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {n === 0 && (
        <p className="m-0 text-lg text-gray-200">No hay productos veganos en esta categoría (todavía). Prueba con «Todo».</p>
      )}
      <p className="m-0 text-sm text-gray-300">
        «vegano»: 100 % vegetal. «opción vegana»: pídelo con relleno vegano. Precios de referencia de delivery; en el local pueden variar. Consulta por alérgenos.
      </p>
    </>
  );
}
