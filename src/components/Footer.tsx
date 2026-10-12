import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { direccion, locales } from "@/data/locales";
import { site } from "@/data/site";

// [left %, top px, rotate deg, pin] — posiciones estáticas (la física llega en la etapa 3).
// Los índices pares van arriba y se ven en móvil; los impares van abajo y solo en desktop.
const pines = [
  "01-sonrisa-amarilla", "04-llama-azul", "05-corazon-verde", "06-corazon-rojo", "08-must-be-happy",
] as const;
const lluvia = [
  [3, 30, -14, 0], [16, 90, 12, 3], [29, 40, 8, 1], [42, 100, -10, 4],
  [55, 30, 18, 2], [68, 95, -16, 0], [80, 45, 6, 3], [91, 85, -8, 1],
] as const;

const label = "m-0 text-xs font-bold tracking-[0.18em] text-yolk uppercase md:text-[13px]";
const link = "text-paper hover:text-yolk inline-flex min-h-11 items-center no-underline";

function Icono({ id }: { id: string }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {id === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </>
      ) : (
        <>
          <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3c.5 3 2.5 5 5.5 5" />
        </>
      )}
    </svg>
  );
}

export function Footer() {
  return (
    <footer aria-labelledby="h2-footer" className="bg-ink text-paper relative overflow-hidden">
      <div aria-hidden="true" className="relative h-[150px] overflow-hidden md:h-[230px]">
        {lluvia.map(([x, y, r, pin], i) => (
          <div
            key={i}
            className={`absolute ${i % 2 ? "max-md:hidden" : ""}`}
            style={{ left: `${x}%`, top: y, rotate: `${r}deg` }}
          >
            <Image src={`/pines/${pines[pin]}.svg`} alt="" width={92} height={92} className="h-auto w-[clamp(56px,6.5vw,92px)]" />
          </div>
        ))}
      </div>
      <div className="px-gutter mx-auto flex w-full max-w-site flex-col gap-7 pt-4 pb-8 md:gap-14 md:pt-6 md:pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6 md:gap-8">
          <div className="flex flex-col gap-4">
            <h2 id="h2-footer" className="font-display text-yolk m-0 text-[64px] leading-[0.9] md:text-h2-footer">¿Te dio hambre?</h2>
            <p className="m-0 text-[19px] text-gray-200 max-md:hidden">Pide delivery o pásate por Barrio Italia o Los Leones.</p>
          </div>
          <Button href={site.ubereats} size="xl" arrow shadow className="max-md:min-h-[60px] max-md:w-full max-md:text-2xl max-md:shadow-none">
            Pedir ahora
          </Button>
        </div>

        <div className="grid gap-8 border-t-2 border-[#2A2A2A] pt-6 md:grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] md:pt-10">
          <div className="flex flex-col gap-2.5">
            <p className={label}>Locales</p>
            <address className="text-[15px] leading-relaxed text-gray-200 not-italic md:text-base">
              {locales.map((l) => (
                <span key={l.id} className="block">{direccion(l)} · {l.nombre}</span>
              ))}
            </address>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className={label}>Redes</p>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {site.social.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target="_blank" rel="noopener" className={`${link} gap-2.5 text-base`}>
                    <Icono id={s.id} />
                    {s.label} · {s.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2.5">
            <p className={label}>Explora</p>
            <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-base">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={link}>{n.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="m-0 flex flex-wrap justify-between gap-3 text-xs text-gray-400 md:text-[13px]">
          <span>© 2026 DOKEBI · Korean Street Food · Santiago de Chile</span>
          <span className="font-marker text-yolk text-base max-md:hidden">sonríe, pero con colmillo</span>
        </p>
      </div>
    </footer>
  );
}
