import Image from "next/image";
import type { MerchItem } from "@/data/merch";
import { whatsappLink } from "@/data/site";

// Rotación y desnivel "sticker" que se repiten según la posición.
const rotate = ["-rotate-5", "rotate-3", "-rotate-2", "rotate-6", "-rotate-4"];
const lift = ["", "lg:translate-y-[18px]", "", "lg:translate-y-7", "lg:translate-y-1.5"];

export function MerchCard({ item, index, className = "" }: { item: MerchItem; index: number; className?: string }) {
  const i = index % rotate.length;
  const wa = whatsappLink(`¡Hola Dokebi! Quiero ${item.nombre} (${item.precio ?? "[PRECIO]"}).`);
  return (
    <li
      className={`bg-paper flex flex-col gap-2.5 rounded-[20px] p-3 shadow-[0_0_0_3px_var(--color-ink),6px_8px_0_3px_var(--color-ink)] md:gap-3 md:rounded-[22px] md:p-3.5 md:shadow-[0_0_0_3px_var(--color-ink),8px_10px_0_3px_var(--color-ink)] ${rotate[i]} ${lift[i]} ${className}`}
    >
      <div className="photo-placeholder relative flex aspect-square items-end rounded-xl p-2.5">
        {item.foto ? (
          <Image src={item.foto} alt={item.nombre} fill sizes="240px" className="rounded-xl object-cover" />
        ) : (
          <span className="text-[11px] font-bold tracking-[0.08em] text-gray-400 uppercase">Foto · {item.nombre}</span>
        )}
      </div>
      <h3 className="font-display m-0 text-[22px] leading-none md:text-[26px]">{item.nombre}</h3>
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-lg md:text-xl">{item.precio ?? "[PRECIO]"}</span>
        <a
          href={wa.href}
          aria-label={`Pedir ${item.nombre} por WhatsApp`}
          {...(wa.external && { target: "_blank", rel: "noopener" })}
          className="inline-flex min-h-11 items-center text-sm font-bold underline md:text-base"
        >
          Lo quiero
        </a>
      </div>
    </li>
  );
}
