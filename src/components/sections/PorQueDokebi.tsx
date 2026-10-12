"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section } from "@/components/ui/Section";
import { Smiley } from "@/components/ui/Smiley";
import { porQue } from "@/data/porque";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PorQueDokebi() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Con reduced motion no se registra nada: queda el estado final estático.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.from(".pq-face", { scale: 0.6, opacity: 0, duration: 0.7, ease: "back.out(2.4)" })
          .from(".smiley-horn-left", { scale: 0, svgOrigin: "74 20", duration: 0.45, ease: "back.out(2.2)" }, "-=0.2")
          .from(".smiley-horn-right", { scale: 0, svgOrigin: "126 20", duration: 0.45, ease: "back.out(2.2)" }, "<0.08")
          .from(".pq-ko", { y: 48, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
          .from(".pq-caption", { opacity: 0, duration: 0.4 }, "-=0.2")
          .from(".pq-text", { y: 32, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 0.1)
          .from(".pq-sticker", { scale: 1.15, opacity: 0, duration: 0.35, ease: "power2.out" }, "-=0.1");
      });
      // La altura del hero cambia al hidratar (pin): recalcula el disparo.
      const refresh = setTimeout(() => ScrollTrigger.refresh(), 800);
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);
      return () => {
        clearTimeout(refresh);
        window.removeEventListener("load", onLoad);
      };
    },
    { scope: root },
  );

  const { parrafo1: p1 } = porQue;
  return (
    <Section
      id="por-que-dokebi"
      labelledBy="h2-por-que-dokebi"
      ref={root}
      className="on-light bg-yolk text-ink py-20 md:py-28"
      innerClassName="grid items-center gap-14 md:grid-cols-[1fr_1.3fr] md:gap-[72px]"
    >
      <div className="flex flex-col items-start gap-2">
        <div className="pq-face bg-ink mt-9 flex aspect-square w-[clamp(180px,20vw,260px)] items-center justify-center rounded-full shadow-[8px_8px_0_var(--color-paper)]">
          <Smiley wink horns size={230} className="h-auto w-[70%]" />
        </div>
        <p lang="ko" className="pq-ko font-korean text-ink m-0 mt-2 text-[clamp(88px,12vw,176px)] leading-none">
          {porQue.ko}
        </p>
        <p className="pq-caption font-marker m-0 -rotate-3 text-[clamp(22px,2.2vw,28px)]">{porQue.caption}</p>
      </div>
      <div className="flex flex-col items-start gap-[22px]">
        <p className="pq-text m-0 text-[13px] font-bold tracking-[0.16em] uppercase">{porQue.eyebrow}</p>
        <h2 id="h2-por-que-dokebi" className="pq-text font-display m-0 text-[clamp(52px,6vw,92px)] leading-[0.92] uppercase">
          {porQue.titulo}
        </h2>
        <p className="pq-text text-gray-700 m-0 max-w-[58ch] text-[17px] leading-[1.6] md:text-[19px]">
          {p1.antes}
          <span lang="ko">{p1.ko}</span> (<em>{p1.romanizado}</em>
          {p1.despues}
        </p>
        <p className="pq-text text-gray-700 m-0 max-w-[58ch] text-[17px] leading-[1.6] md:text-[19px]">{porQue.parrafo2}</p>
        <p className="pq-sticker font-marker bg-ink text-yolk shadow-sticker-paper m-0 mt-2.5 inline-block -rotate-2 rounded-lg px-5 py-2 text-[22px]">
          {porQue.sticker}
        </p>
      </div>
    </Section>
  );
}
