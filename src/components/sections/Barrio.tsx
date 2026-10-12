import Image from "next/image";
import { Doodle } from "@/components/ui/Doodle";
import { Section } from "@/components/ui/Section";
import { colaboraciones, eventos, polaroids, prensa } from "@/data/barrio";

const card = "flex flex-col gap-3 rounded-lg p-6 md:gap-[18px] md:p-8";

export function Barrio() {
  return (
    <Section id="barrio" labelledBy="h2-barrio" className="bg-ink text-paper pt-16 pb-18 md:pt-30 md:pb-32" innerClassName="flex flex-col gap-7 md:gap-14">
      <Doodle variant="crown" size={130} stroke="#FFD400" className="absolute top-[60px] left-[3%] -rotate-10 max-md:top-10 max-md:right-3.5 max-md:left-auto max-md:size-[70px]" />
      <Doodle variant="squiggle" size={260} stroke="#FFD400" className="absolute top-[420px] right-[4%] -rotate-6 max-md:hidden" />

      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="h2-barrio" className="font-display m-0 text-[84px] leading-[0.88] md:text-h2-xl">El barrio</h2>
        <p className="m-0 max-w-[520px] text-base leading-normal font-medium text-gray-200 md:text-[19px]">
          Nacimos en la calle y ahí seguimos: Barrio Italia, Los Leones y todo lo que pasa entre medio. Colabs, eventos y la fila de siempre.
        </p>
      </div>

      <div className="relative grid grid-cols-2 items-start gap-5 md:grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] md:gap-7">
        {polaroids.map((p) => (
          <figure key={p.id} className={`bg-paper shadow-sticker m-0 p-2.5 pb-3 md:p-3 md:pb-3.5 md:shadow-sticker-lg ${p.pos}`}>
            <div className={`relative overflow-hidden bg-ink ${p.ratio}`}>
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 767px) 45vw, (max-width: 1135px) 30vw, 25vw"
                className="object-cover"
              />
            </div>
            <figcaption className="font-marker pt-2 text-[15px] md:pt-2.5 md:text-lg">{p.caption}</figcaption>
          </figure>
        ))}
        <Doodle variant="star" size={96} stroke="#FFD400" fill="#FFD400" className="absolute -top-10 left-[22%] rotate-14 max-md:hidden" />
        <Doodle variant="sparkle" size={64} stroke="#FFD400" fill="#FFD400" className="absolute right-[24%] -bottom-15 max-md:hidden" />
      </div>

      <div className="grid gap-6 md:mt-14 md:grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]">
        <article className={`${card} on-light bg-yolk text-ink`}>
          <h3 className="font-display m-0 text-[30px] md:text-4xl">Colaboraciones</h3>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[15px] leading-[1.4] md:gap-3.5 md:text-base">
            {colaboraciones.map((c, i) => (
              <li key={i} className="flex flex-col gap-0.5 border-b border-ink/30 pb-3.5 last:border-0 last:pb-0">
                <strong>{c.titulo}</strong>
                <span className="text-gray-700">{c.detalle}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${card} on-light bg-yolk text-ink`}>
          <h3 className="font-display m-0 text-[30px] md:text-4xl">Eventos</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-[15px] md:gap-3.5 md:text-base">
            {eventos.map((e, i) => (
              <li key={i} className="flex items-center gap-3 md:gap-3.5">
                <span className="font-display bg-ink text-yolk min-w-14 flex-none rounded-md px-2 py-1.5 text-center text-base md:min-w-16 md:px-2.5 md:py-2 md:text-lg">{e.fecha}</span>
                <span>
                  <strong>{e.nombre}</strong>
                  <br />
                  <span className="text-gray-700">{e.lugar}</span>
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${card} on-light bg-paper text-ink rotate-1`}>
          <h3 className="font-display m-0 text-[30px] md:text-4xl">En la prensa</h3>
          <blockquote className="m-0 text-[21px] leading-tight font-extrabold md:text-[26px]">“{prensa.cita}”</blockquote>
          <p className="m-0 text-[13px] font-bold tracking-[0.08em] uppercase md:text-[15px]">— {prensa.medio}, {prensa.fecha}</p>
          <a href={prensa.href} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center self-start font-bold underline">Leer la nota</a>
        </article>
      </div>
    </Section>
  );
}
