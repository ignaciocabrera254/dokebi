import { Doodle } from "@/components/ui/Doodle";
import { Section } from "@/components/ui/Section";
import { capas } from "@/data/corndog";

const cubos = [
  [84, 260, 12], [130, 250, -8], [184, 262, 20], [104, 310, -15], [160, 305, 6], [80, 360, 25], [136, 356, -20],
  [190, 350, 10], [106, 410, 4], [166, 405, -12], [84, 460, 18], [140, 458, -5], [190, 452, 14], [112, 510, -22],
  [166, 505, 8], [138, 556, 15],
] as const;
const destellos = [[110, 80], [190, 96], [152, 140], [96, 186], [204, 196], [146, 228]] as const;
const salsa = "M92 70 Q150 92 208 108 Q150 140 90 160 Q150 182 210 198 Q150 226 90 246 Q150 268 210 284";

export function Corndog() {
  const ultima = capas.length - 1;
  return (
    <Section
      id="como-se-arma"
      labelledBy="h2-arma"
      className="on-light bg-yolk py-16 md:py-30"
      innerClassName="grid items-center gap-8 md:gap-16 md:grid-cols-2"
    >
      <div className="flex flex-col gap-6 md:gap-7">
        <span className="font-marker border-ink -rotate-2 self-start rounded-full border-[3px] px-3.5 py-1 text-[17px] md:px-4 md:py-1.5 md:text-xl">
          paso a paso
        </span>
        <h2 id="h2-arma" className="font-display m-0 text-[56px] leading-[0.92] text-balance md:text-h2-md">
          Cómo se arma un corndog
        </h2>
        <p className="text-gray-700 m-0 max-w-[520px] text-[19px] leading-normal max-md:hidden">
          Crujiente por fuera, elástico por dentro. Baja y míralo armarse capa por capa, igual que en la freidora.
        </p>
        <CorndogArt className="mx-auto h-[456px] w-[180px] md:hidden" />
        <ol className="border-ink m-0 flex list-none flex-col border-b-2 p-0 text-[15px] leading-[1.4] md:text-base">
          {capas.map((c, i) => (
            <li
              key={c.n}
              aria-current={i === ultima ? "step" : undefined}
              className={`border-ink grid grid-cols-[48px_1fr] items-baseline gap-2 border-t-2 px-2.5 py-3 md:grid-cols-[72px_1fr] md:gap-3 md:px-4 md:py-3.5 ${i === ultima ? "bg-ink text-yolk" : ""}`}
            >
              <span className="font-display text-2xl md:text-3xl">{c.n}</span>
              <span>
                <strong className="md:text-lg">{c.nombre}.</strong> {c.texto}
              </span>
            </li>
          ))}
        </ol>
        <div className="flex items-center gap-4">
          <span className="font-display text-lg">Capa 05 / 05</span>
          <div aria-hidden="true" className="border-ink h-2.5 flex-1 overflow-hidden rounded-full border-2">
            <div className="bg-ink size-full" />
          </div>
        </div>
      </div>

      <div className="relative flex min-h-[470px] items-center justify-center max-md:hidden md:min-h-[760px]">
        <div aria-hidden="true" className="bg-paper absolute aspect-square w-[560px] max-w-full rounded-full" />
        <Doodle variant="crown" size={110} strokeWidth={5} className="absolute top-[6%] left-[4%] -rotate-12" />
        <span className="font-marker absolute top-[22%] right-[4%] rotate-10 text-[30px]">¡crunch!</span>
        <span className="font-marker absolute bottom-[18%] left-[2%] -rotate-8 text-2xl">se estira ↓</span>
        <CorndogArt className="relative h-[760px] w-[300px]" />
      </div>
    </Section>
  );
}

function CorndogArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 300 760" className={`relative ${className ?? ""}`}>
      <defs>
        <pattern id="pkD" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.2" fill="#0A0A0A" />
          <circle cx="12" cy="11" r="1.6" fill="#0A0A0A" />
          <path d="M9 3 l3 2" stroke="#0A0A0A" strokeWidth="1.4" />
        </pattern>
      </defs>
      <rect x="139" y="560" width="22" height="190" rx="8" fill="#FFF" stroke="#0A0A0A" strokeWidth="5" />
      <rect className="corndog-body" x="66" y="30" width="168" height="580" rx="84" fill="#FFF" stroke="#0A0A0A" strokeWidth="6" />
      <rect x="69" y="33" width="162" height="574" rx="81" fill="url(#pkD)" />
      <g className="corndog-papas" fill="#FFD400" stroke="#0A0A0A" strokeWidth="4" strokeLinejoin="round">
        {cubos.map(([x, y, r]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="26" height="26" rx="4" transform={`rotate(${r} ${x + 13} ${y + 13})`} />
        ))}
      </g>
      <g className="corndog-panko" fill="#FFF" stroke="#0A0A0A" strokeWidth="2.5" strokeLinejoin="round">
        {destellos.map(([x, y]) => (
          <path key={`${x}-${y}`} transform={`translate(${x} ${y})`} d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10 Z" />
        ))}
      </g>
      <g className="corndog-salsa" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={salsa} stroke="#0A0A0A" strokeWidth="17" />
        <path d={salsa} stroke="#FFD400" strokeWidth="8" />
      </g>
    </svg>
  );
}
