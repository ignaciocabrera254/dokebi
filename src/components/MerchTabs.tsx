"use client";

import { useState } from "react";
import { MerchCard } from "@/components/MerchCard";
import type { MerchItem } from "@/data/merch";

type Props = {
  categorias: readonly { id: string; label: string }[];
  items: readonly MerchItem[];
};

export function MerchTabs({ categorias, items }: Props) {
  const [cat, setCat] = useState("todo");
  const tabs = [{ id: "todo", label: "Todo" }, ...categorias];
  const visibles = items.filter((i) => cat === "todo" || i.categoria === cat).length;

  return (
    <>
      <div role="tablist" aria-label="Categorías de merch" className="scrollbar-none flex gap-2.5 overflow-x-auto py-1 md:flex-wrap md:gap-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={cat === t.id}
            aria-controls="panel-merch"
            onClick={() => setCat(t.id)}
            className={`font-display border-ink min-h-11 flex-none cursor-pointer rounded-full border-[3px] px-5 text-[18px] md:min-h-12 md:px-6 md:text-xl ${cat === t.id ? "bg-ink text-yolk" : "text-ink bg-transparent"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Todos los productos van siempre en el HTML; el tab solo oculta. */}
      <div id="panel-merch" role="tabpanel" aria-labelledby={`tab-${cat}`}>
        <ul className="m-0 grid list-none grid-cols-2 gap-x-7 gap-y-12 p-0 pt-6 md:grid-cols-[repeat(auto-fill,minmax(min(230px,100%),1fr))] md:gap-x-16 md:gap-y-20">
          {items.map((m, i) => (
            <MerchCard key={m.id} item={m} index={i} className={cat === "todo" || m.categoria === cat ? "" : "hidden"} />
          ))}
        </ul>
        {visibles === 0 && (
          <p className="m-0 text-lg font-medium">Pronto subiremos productos a esta categoría.</p>
        )}
      </div>
    </>
  );
}
