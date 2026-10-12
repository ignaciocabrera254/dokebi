"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Doodle } from "@/components/ui/Doodle";
import { Section } from "@/components/ui/Section";
import { bajada, capas } from "@/data/corndog";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- Geometría del dibujo (viewBox 300 × 760) ---
const cubos = [
  [84, 260, 12], [130, 250, -8], [184, 262, 20], [104, 310, -15], [160, 305, 6], [80, 360, 25], [136, 356, -20],
  [190, 350, 10], [106, 410, 4], [166, 405, -12], [84, 460, 18], [140, 458, -5], [190, 452, 14], [112, 510, -22],
  [166, 505, 8], [138, 556, 15],
] as const;
const destellos = [[110, 80], [190, 96], [152, 140], [96, 186], [204, 196], [146, 228]] as const;
const salsa = "M92 70 Q150 92 208 108 Q150 140 90 160 Q150 182 210 198 Q150 226 90 246 Q150 268 210 284";

// Puntos determinísticos (mismo resultado en servidor y cliente) dentro de la cápsula de masa.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const dentro = (x: number, y: number) => x > 74 && x < 226 && (y >= 114 && y <= 526 ? true : (x - 150) ** 2 + (y - (y < 114 ? 114 : 526)) ** 2 < 74 ** 2);
function esparcir(n: number, seed: number) {
  const r = rng(seed), out: { x: number; y: number; r: number; k: number }[] = [];
  while (out.length < n) {
    const x = 70 + r() * 160, y = 34 + r() * 572;
    if (dentro(x, y)) out.push({ x: +x.toFixed(1), y: +y.toFixed(1), r: +(1.6 + r() * 1.4).toFixed(1), k: Math.floor(r() * 3) });
  }
  return out;
}
const migas = esparcir(90, 7);
const polvo = esparcir(34, 21);
const POLVO = ["#FFFFFF", "#FFD400", "#F2A83B"];

const RELLENOS = ["salchicha", "tteok", "mixto"] as const;
type Relleno = (typeof RELLENOS)[number];
const ultima = capas.length - 1;
const MASA = "#EBD49A", MASA_FRITA = "#C99A4B"; // arena al cubrir; más oscura al llegar el panko
const TOTAL = 6.6; // 6 pasos de 1 + cola (corona, "se estira")
const SEG_PASO = 1.8; // segundos por paso

export function Corndog({ rellenos }: { rellenos: readonly string[] }) {
  const root = useRef<HTMLElement>(null);
  const barra = useRef<HTMLDivElement>(null);
  const ctrl = useRef<{ alternar: () => void; reiniciar: () => void; saltar: (k: number) => void } | null>(null);
  const [paso, setPaso] = useState(ultima);
  const [relleno, setRelleno] = useState<Relleno>("mixto");
  const [animado, setAnimado] = useState(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [terminada, setTerminada] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ normal: "(prefers-reduced-motion: no-preference)", reducido: "(prefers-reduced-motion: reduce)" }, (c) => {
        const { normal } = c.conditions as { normal: boolean };
        const q = gsap.utils.selector(root);
        const O = { transformOrigin: "50% 50%" };
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
        tl.set(q(".corndog-body, .palito"), { fill: MASA }, 0);
        // 00 · la base baja con un leve rebote
        tl.from(q("#capa-base"), { y: -440, opacity: 0, duration: 1, ease: "back.out(1.7)" }, 0)
          // 01 · la masa cubre el relleno de arriba hacia abajo (clipPath SVG)
          .fromTo(q("#clip-masa rect"), { attr: { height: 0 } }, { attr: { height: 760 }, duration: 1, ease: "power1.inOut" }, 1)
          // 02 · el panko se espolvorea y la masa se oscurece
          .to(q(".corndog-body, .palito"), { fill: MASA_FRITA, duration: 0.9, ease: "power1.inOut" }, 2)
          .from(q("#capa-panko .miga"), { scale: 0, opacity: 0, ...O, duration: 0.45, stagger: { amount: 0.55, from: "random" } }, 2)
          .from(q("#capa-panko .destello"), { scale: 0, opacity: 0, ...O, duration: 0.4, stagger: 0.07 }, 2.45)
          // 03 · los cubos se pegan uno a uno (0 → 1.15 → 1)
          .fromTo(q("#capa-papas .cubo"), { scale: 0, opacity: 0, ...O }, { keyframes: [{ scale: 1.15, opacity: 1, duration: 0.3 }, { scale: 1, duration: 0.2 }], stagger: { amount: 0.5 } }, 3)
          // 04 · lluvia de azúcar y queso en polvo que se asienta
          .from(q("#capa-toppings .grano"), { y: -280, opacity: 0, duration: 0.55, ease: "bounce.out", stagger: { amount: 0.4, from: "random" } }, 4)
          // 05 · la salsa se dibuja y aparece "¡crunch!"
          .fromTo(q("#capa-salsa path"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power1.inOut" }, 5)
          .from(q(".pop-crunch"), { scale: 0, opacity: 0, duration: 0.25, ease: "back.out(3)" }, 5.75)
          // cola: corona y "se estira ↓"
          .from(q(".pop-corona"), { scale: 0, rotate: -40, opacity: 0, ...O, duration: 0.4, ease: "back.out(2)" }, 6)
          .from(q(".pop-estira"), { y: -16, opacity: 0, duration: 0.4 }, 6.2);
        capas.forEach((_, k) => tl.addLabel(`paso-0${k}`, k));
        tl.addLabel("fin", TOTAL).set({}, {}, TOTAL);

        // El paso activo, el contador y la barra siguen a la timeline.
        let actual = -1;
        const seguir = () => {
          const t = tl.time();
          const k = Math.min(ultima, Math.max(0, Math.floor(t + 1e-6)));
          if (k !== actual) { actual = k; setPaso(k); }
          if (barra.current) barra.current.style.transform = `scaleX(${Math.min(1, t / ultima)})`;
        };
        tl.eventCallback("onUpdate", seguir);

        if (!normal) {
          // Reducido: sin reproducción; dibujo completo y cada clic muestra su capa sin animar.
          tl.progress(1);
          ctrl.current = { alternar: () => {}, reiniciar: () => {}, saltar: (k) => { tl.pause().time(k === ultima ? TOTAL : k + 1); seguir(); } };
          return () => { ctrl.current = null; setPaso(ultima); };
        }

        tl.timeScale(1 / SEG_PASO);
        let manual = false, visible = false;
        const sincronizar = () => {
          if (visible && !manual && tl.progress() < 1) tl.play(); else tl.pause();
          setReproduciendo(!tl.paused() && tl.progress() < 1);
        };
        tl.eventCallback("onComplete", () => { setTerminada(true); setReproduciendo(false); });
        ctrl.current = {
          alternar: () => { manual = !tl.paused(); if (!manual) tl.play(); else tl.pause(); setReproduciendo(!tl.paused()); },
          reiniciar: () => { manual = false; setTerminada(false); tl.restart(); setReproduciendo(true); },
          saltar: (k) => { manual = false; setTerminada(false); tl.seek(`paso-0${k}`).play(); setReproduciendo(true); },
        };
        setAnimado(true);
        seguir();
        // Arranca con el dibujo ≥ 50 % visible; si sale, se pausa y luego continúa.
        const dibujo = root.current!.querySelector("[data-dibujo]")!;
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && e.intersectionRatio >= 0.5; sincronizar(); }, { threshold: [0, 0.5, 1] });
        io.observe(dibujo);
        const refrescar = setTimeout(() => ScrollTrigger.refresh(), 800);
        return () => {
          clearTimeout(refrescar);
          io.disconnect();
          ctrl.current = null;
          setAnimado(false); setReproduciendo(false); setTerminada(false); setPaso(ultima);
        };
      });
    },
    { scope: root },
  );

  return (
    <Section
      ref={root}
      id="como-se-arma"
      labelledBy="h2-arma"
      className="on-light bg-yolk py-16 md:py-30"
      innerClassName="grid gap-x-16 gap-y-6 md:grid-cols-2 md:items-center"
    >
      <div className="flex flex-col gap-6 md:gap-7">
        <span className="font-marker border-ink -rotate-2 self-start rounded-full border-[3px] px-3.5 py-1 text-[17px] md:px-4 md:py-1.5 md:text-xl">
          paso a paso
        </span>
        <h2 id="h2-arma" className="font-display m-0 text-[56px] leading-[0.92] text-balance md:text-h2-md">
          Cómo se arma un corndog
        </h2>
        <p className="text-gray-700 m-0 max-w-[520px] text-[19px] leading-normal max-md:hidden">
          {bajada}
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 md:col-start-2 md:row-span-2 md:row-start-1">
        <div data-dibujo className="relative flex items-center justify-center md:w-full md:max-w-[560px]">
          <div aria-hidden="true" className="bg-paper absolute aspect-square w-[min(560px,100%)] rounded-full max-md:hidden" />
          <Doodle variant="crown" size={110} strokeWidth={5} className="pop-corona absolute top-[6%] left-[4%] -rotate-12 max-md:hidden" />
          <span className="pop-crunch font-marker absolute top-[22%] right-[1%] rotate-10 text-[30px] max-md:hidden">¡crunch!</span>
          <span className="pop-estira font-marker absolute bottom-[18%] left-[2%] -rotate-8 text-2xl max-md:hidden">se estira ↓</span>
          <CorndogArt relleno={relleno} className="relative h-[40svh] max-h-[360px] w-auto md:h-[min(760px,78svh)] md:max-h-none" />
        </div>
        <p className="font-display m-0 text-2xl md:hidden">{capas[paso].n} · {capas[paso].nombre}</p>
      </div>

      <div className="flex flex-col gap-6 md:gap-7">
        <ol className="border-ink m-0 flex list-none flex-col border-b-2 p-0 text-[15px] leading-[1.4] md:text-base">
          {capas.map((c, i) => (
            <li key={c.n} className={`border-ink border-t-2 ${i === paso ? "bg-ink text-yolk" : ""}`}>
              <button
                type="button"
                aria-current={i === paso ? "step" : undefined}
                onClick={() => ctrl.current?.saltar(i)}
                className="grid min-h-11 w-full cursor-pointer grid-cols-[48px_1fr] items-baseline gap-2 px-2.5 py-3 text-left md:grid-cols-[72px_1fr] md:gap-3 md:px-4 md:py-3.5"
              >
                <span className="font-display text-2xl md:text-3xl">{c.n}</span>
                <span>
                  <strong className="md:text-lg">{c.nombre}.</strong> {c.texto}
                </span>
              </button>
              {i === 0 && (
                <div role="group" aria-label="Relleno del corndog" className="flex flex-wrap gap-2 px-2.5 pb-3 md:px-4 md:pl-[88px]">
                  {rellenos.map((r, k) => (
                    <button
                      key={r}
                      type="button"
                      aria-pressed={relleno === RELLENOS[k]}
                      onClick={() => setRelleno(RELLENOS[k])}
                      className={`min-h-11 cursor-pointer rounded-full border-2 px-3.5 text-sm font-bold md:text-[15px] ${relleno === RELLENOS[k] ? (i === paso ? "border-yolk bg-yolk text-ink" : "border-ink bg-ink text-yolk") : i === paso ? "border-paper bg-paper text-ink" : "border-ink bg-paper text-ink"}`}
                    >
                      {r.split(":")[0]}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          {animado && !terminada && (
            <button
              type="button"
              onClick={() => ctrl.current?.alternar()}
              aria-label={reproduciendo ? "Pausar animación" : "Reproducir animación"}
              className="border-ink bg-ink text-yolk inline-flex size-11 flex-none cursor-pointer items-center justify-center rounded-full border-2"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                {reproduciendo ? <path d="M6 4h4v16H6zM14 4h4v16h-4z" /> : <path d="M7 4l13 8-13 8z" />}
              </svg>
            </button>
          )}
          <span className="font-display text-lg">Capa {capas[paso].n} / 05</span>
          <div aria-hidden="true" className="border-ink h-2.5 min-w-20 flex-1 overflow-hidden rounded-full border-2">
            <div ref={barra} className="bg-ink size-full origin-left" />
          </div>
          {animado && terminada && (
            <button
              type="button"
              onClick={() => ctrl.current?.reiniciar()}
              className="border-ink bg-ink text-yolk font-display inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-5 text-lg"
            >
              <span aria-hidden="true">↻</span> Ver de nuevo
            </button>
          )}
        </div>
      </div>
    </Section>
  );
}

function CorndogArt({ className, relleno }: { className?: string; relleno: Relleno }) {
  const seg = (i: number) => (i % 2 ? "#F6EBD0" : "#C7503C");
  return (
    <svg aria-hidden="true" viewBox="0 0 300 760" className={className}>
      <defs>
        <clipPath id="clip-relleno"><rect x="92" y="52" width="116" height="536" rx="58" /></clipPath>
        <clipPath id="clip-masa"><rect x="0" y="0" width="300" height="760" /></clipPath>
      </defs>

      <g id="capa-base">
        <rect className="palito" x="139" y="540" width="22" height="210" rx="8" fill={MASA_FRITA} stroke="#0A0A0A" strokeWidth="5" />
        <g clipPath="url(#clip-relleno)" style={{ transition: "opacity 0.25s" }}>
          <g style={{ opacity: relleno === "salchicha" ? 1 : 0, transition: "opacity 0.25s" }}>
            <rect x="92" y="52" width="116" height="536" fill="#C7503C" />
            <rect x="110" y="70" width="14" height="500" rx="7" fill="#E8806B" />
          </g>
          <g style={{ opacity: relleno === "tteok" ? 1 : 0, transition: "opacity 0.25s" }}>
            <rect x="92" y="52" width="116" height="536" fill="#F6EBD0" />
            {[150, 250, 350, 450].map((y) => <rect key={y} x="92" y={y} width="116" height="5" fill="#D8C79F" />)}
          </g>
          <g style={{ opacity: relleno === "mixto" ? 1 : 0, transition: "opacity 0.25s" }}>
            {[0, 1, 2, 3].map((i) => <rect key={i} x="92" y={52 + i * 134} width="116" height="134" fill={seg(i)} />)}
          </g>
        </g>
        <rect x="92" y="52" width="116" height="536" rx="58" fill="none" stroke="#0A0A0A" strokeWidth="5" />
      </g>

      <g id="capa-masa" clipPath="url(#clip-masa)">
        <rect className="corndog-body" x="66" y="30" width="168" height="580" rx="84" fill={MASA_FRITA} stroke="#0A0A0A" strokeWidth="6" />
      </g>

      <g id="capa-panko">
        {migas.map((m) => <circle key={`${m.x}-${m.y}`} className="miga" cx={m.x} cy={m.y} r={m.r} fill="#0A0A0A" />)}
        <g fill="#FFF" stroke="#0A0A0A" strokeWidth="2.5" strokeLinejoin="round">
          {destellos.map(([x, y]) => (
            <path key={`${x}-${y}`} className="destello" transform={`translate(${x} ${y})`} d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10 Z" />
          ))}
        </g>
      </g>

      <g id="capa-papas" fill="#FFD400" stroke="#0A0A0A" strokeWidth="4" strokeLinejoin="round">
        {cubos.map(([x, y, r]) => (
          <g key={`${x}-${y}`} className="cubo">
            <rect x={x} y={y} width="26" height="26" rx="4" transform={`rotate(${r} ${x + 13} ${y + 13})`} />
          </g>
        ))}
      </g>

      <g id="capa-toppings" stroke="#0A0A0A" strokeWidth="1.4">
        {polvo.map((p) => <circle key={`${p.x}-${p.y}`} className="grano" cx={p.x} cy={p.y} r={p.r + 0.8} fill={POLVO[p.k]} />)}
      </g>

      <g id="capa-salsa" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={salsa} stroke="#0A0A0A" strokeWidth="17" pathLength={1} strokeDasharray={1} />
        <path d={salsa} stroke="#FFD400" strokeWidth="8" pathLength={1} strokeDasharray={1} />
      </g>
    </svg>
  );
}
