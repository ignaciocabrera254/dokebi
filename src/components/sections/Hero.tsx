import { HeroIntro } from "@/components/hero/HeroIntro";
import { Button } from "@/components/ui/Button";
import { Doodle } from "@/components/ui/Doodle";
import { Smiley } from "@/components/ui/Smiley";
import { hero } from "@/data/hero";
import { site } from "@/data/site";

const eyebrow = "absolute top-5 m-0 text-xs font-bold tracking-[0.16em] text-gray-300 uppercase md:top-8 md:text-sm md:tracking-[0.18em]";

export function Hero() {
  return (
    <section id="inicio" aria-labelledby="titulo-principal">
      <HeroIntro>
        <p className={`${eyebrow} left-[clamp(16px,4vw,40px)]`}>{hero.eyebrowIzq}</p>
        <p className={`${eyebrow} right-[clamp(16px,4vw,40px)] max-md:hidden`}>{hero.eyebrowDer}</p>

        <Doodle variant="star" size={120} stroke="#FFD400" strokeWidth={4} className="absolute top-[18%] left-[12%] -rotate-[14deg] max-md:top-20 max-md:left-[22px] max-md:size-16" />
        <Doodle variant="crown" size={150} stroke="#FFFFFF" strokeWidth={4} className="absolute top-[14%] right-[11%] rotate-12 max-md:top-24 max-md:right-[18px] max-md:size-[78px]" />
        <Doodle variant="squiggle" size={220} stroke="#FFFFFF" className="absolute bottom-[20%] left-[9%] rotate-8 max-md:bottom-[110px] max-md:left-3.5 max-md:w-[140px]" />
        <Doodle variant="sparkle" size={70} stroke="#FFD400" strokeWidth={4} className="absolute right-[17%] bottom-[22%] max-md:hidden" />

        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 md:bottom-9 md:gap-1.5">
          <span className="font-marker text-yolk -rotate-3 text-lg whitespace-nowrap md:text-[22px]">baja… si te atreves</span>
          <svg aria-hidden="true" width="28" height="36" viewBox="0 0 28 36" fill="none" stroke="#FFD400" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3 C 10 12, 18 18, 14 32 M6 24 L14 33 L22 24" />
          </svg>
        </div>

      </HeroIntro>

      {/* Bloque amarillo con el H1 */}
      <div className="hero-title on-light bg-yolk relative overflow-hidden pt-14 pb-16 md:pt-24 md:pb-26">
        <Doodle variant="star" size={90} strokeWidth={5} className="absolute top-10 right-[18px] rotate-18 max-md:size-[60px] md:right-[6%]" />
        <div className="px-gutter mx-auto flex w-full max-w-site flex-col gap-6 md:gap-10">
          <span className="font-marker bg-ink text-yolk -rotate-3 self-start rounded-md px-3.5 py-1.5 text-[17px] md:px-[18px] md:py-2 md:text-[22px]">
            ¡Annyeong, Santiago!
          </span>
          <h1 id="titulo-principal" tabIndex={-1} className="font-display text-ink m-0 scroll-mt-24 text-[70px] leading-[0.9] text-balance md:text-h1">
            <span className="hero-word">Korean</span>{" "}<span className="hero-word">Street</span>{" "}<span className="hero-word">Food</span> <span className="block"><span className="hero-word">·</span>{" "}<span className="hero-word">Santiago</span></span>
          </h1>
          <div className="flex flex-wrap items-end justify-between gap-10">
            <div className="flex max-w-[600px] flex-1 basis-[420px] flex-col gap-6 md:gap-7">
              <p className="m-0 text-lg leading-[1.35] font-medium md:text-[clamp(20px,2vw,26px)]">
                {hero.bajada}
              </p>
              <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-3.5">
                <Button href={site.ubereats} variant="ink" size="lg" shadow>
                  Pedir delivery
                </Button>
                <Button href="#menu" variant="outline-ink" size="lg">
                  Ver el menú
                </Button>
              </div>
              <p className="m-0 flex flex-wrap gap-x-5 gap-y-2.5 text-sm font-bold tracking-[0.08em] uppercase">
                <span>Delivery</span>
                <span aria-hidden="true">★</span>
                <span>Opciones veganas</span>
                <span aria-hidden="true">★</span>
                <span>2 locales</span>
              </p>
            </div>
            <CajaIlustrada />
          </div>
        </div>
      </div>
    </section>
  );
}

function CajaIlustrada() {
  return (
    <div aria-hidden="true" className="relative h-[374px] w-[340px] flex-none max-md:hidden">
      <svg viewBox="0 -100 400 440" width="340" height="374">
        <defs>
          <pattern id="pkBox" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="2" fill="#0A0A0A" />
            <circle cx="11" cy="10" r="1.5" fill="#0A0A0A" />
          </pattern>
        </defs>
        <polygon points="60,120 130,80 370,80 300,120" fill="#FFD400" stroke="#0A0A0A" strokeWidth="6" strokeLinejoin="round" />
        <g transform="rotate(-16 210 40)">
          <rect x="175" y="-80" width="74" height="200" rx="37" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="6" />
          <rect x="178" y="-77" width="68" height="194" rx="34" fill="url(#pkBox)" />
          <path d="M186 -50 L238 -34 L186 -14 L238 4 L186 24" fill="none" stroke="#0A0A0A" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M186 -50 L238 -34 L186 -14 L238 4 L186 24" fill="none" stroke="#FFD400" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <polygon points="300,120 370,80 370,270 300,320" fill="#FFD400" stroke="#0A0A0A" strokeWidth="6" strokeLinejoin="round" />
        <path d="M318 130 L318 290 M336 120 L336 278 M354 110 L354 266" stroke="#0A0A0A" strokeWidth="3" strokeLinecap="round" />
        <rect x="60" y="120" width="240" height="200" fill="#FFD400" stroke="#0A0A0A" strokeWidth="6" strokeLinejoin="round" />
        <path d="M60 150 L300 150" stroke="#0A0A0A" strokeWidth="3" strokeDasharray="10 8" />
      </svg>
      <div className="absolute top-[224px] left-[105px]">
        <Smiley size={96} />
      </div>
    </div>
  );
}
