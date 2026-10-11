import { LocalMap } from "@/components/LocalMap";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { colacion, direccion, horario, locales } from "@/data/locales";

export function Locales() {
  return (
    <Section id="locales" labelledBy="h2-locales" contained={false} clip={false} className="bg-ink">
      <h2
        id="h2-locales"
        className="font-display bg-paper md:bg-yolk border-ink absolute top-[-40px] right-4 z-[2] m-0 flex size-[120px] rotate-8 items-center justify-center rounded-full border-4 text-center text-[28px] leading-[0.9] md:top-10 md:right-auto md:left-1/2 md:size-[180px] md:-translate-x-1/2 md:-rotate-6 md:text-[40px]"
      >
        Dos<br />locales
      </h2>
      <div className="grid md:grid-cols-[repeat(auto-fit,minmax(min(560px,100%),1fr))]">
        {locales.map((l, idx) => {
          const dark = l.tema === "dark";
          return (
            <article
              key={l.id}
              className={`flex flex-col gap-[18px] px-4 pb-12 md:gap-6 md:px-[clamp(16px,4vw,64px)] md:pt-40 md:pb-20 ${idx === 0 ? "pt-16" : "pt-12"} ${dark ? "bg-ink text-paper" : "on-light bg-paper text-ink"}`}
            >
              <p className={`m-0 text-xs font-bold tracking-[0.18em] uppercase md:text-sm ${dark ? "text-yolk" : ""}`}>{l.comuna}</p>
              <h3 className="font-display m-0 text-[56px] leading-[0.9] md:text-h3-local">{l.nombre}</h3>
              <address className="m-0 text-[17px] leading-[1.4] not-italic md:text-xl">
                {direccion(l)}
                <br />
                {l.comuna}, {l.ciudad}
              </address>
              <LocalMap local={l} />
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-[15px] md:gap-x-6 md:gap-y-2 md:text-[17px]">
                {horario.map((h) => (
                  <div key={h.label} className="contents">
                    <dt className="font-bold">{h.label}</dt>
                    <dd className={`m-0 ${dark ? "text-gray-200" : "text-gray-700"}`}>
                      {h.ranges.length ? h.ranges.map(([a, b]) => `${a}–${b}`).join(" · ") : "Cerrado"}
                    </dd>
                  </div>
                ))}
                <dt className={`font-bold ${dark ? "text-yolk" : "bg-yolk px-1.5"}`}>Colación</dt>
                <dd className={`m-0 ${dark ? "text-yolk" : "font-bold"}`}>{colacion}</dd>
              </dl>
              <div className="grid grid-cols-2 gap-2.5 md:flex md:flex-wrap md:gap-3">
                <Button href={l.mapsUrl} variant={dark ? "outline-paper" : "outline-ink"} size="sm" className="max-md:min-h-[52px] max-md:px-2 max-md:text-lg">
                  Cómo llegar
                </Button>
                <Button href={l.ubereats} variant={dark ? "yolk" : "ink"} size="sm" className="max-md:min-h-[52px] max-md:px-2 max-md:text-lg">
                  Pedir delivery
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
