"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import type Lenis from "lenis";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });
const clamp = (value: number) => Math.max(0, Math.min(1, value));

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function HeroIntro({ children }: { children: ReactNode }) {
  const intro = useRef<HTMLDivElement>(null);
  const decoration = useRef<HTMLDivElement>(null);
  const wash = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLAnchorElement>(null);
  const hud = useRef<HTMLOutputElement>(null);
  const progress = useRef(0);
  const failed = useRef(false);
  const lenis = useRef<Lenis | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [debug, setDebug] = useState(false);
  const [orbit, setOrbit] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const query = new URLSearchParams(location.search);
    const capture = query.has("captureHero");
    const reduced = () => media.matches || query.has("reducedMotion");
    const isDebug = query.has("debug");
    const element = intro.current!;
    const title = document.getElementById("titulo-principal")!;
    let frame = 0;
    let visible = false;
    let sceneMounted = false;
    let disposed = false;
    let lastSolid = false;
    let smoothScroll: Lenis | null = null;

    const syncPreference = () => {
      const animate = !reduced() && !capture && !failed.current;
      setEnabled(animate);
      setDebug(isDebug);
      root.classList.toggle("hero-motion", animate);
      root.classList.toggle("hero-capture", capture);
      root.classList.toggle("hero-debug", isDebug);
      title.classList.toggle("title-in", !animate);
      smoothScroll?.destroy();
      smoothScroll = null;
      lenis.current = null;
      if (animate) {
        void import("lenis").then(({ default: Lenis }) => {
          if (disposed || reduced() || failed.current) return;
          smoothScroll = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
          lenis.current = smoothScroll;
          root.classList.add("hero-lenis");
        });
      } else {
        root.classList.remove("hero-lenis");
        setMounted(false);
        setActive(false);
      }
      schedule();
    };

    const tick = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const stageHeight = element.firstElementChild!.clientHeight;
      const target = clamp(-rect.top / Math.max(1, element.offsetHeight - stageHeight));
      progress.current += (target - progress.current) * 0.12;
      if (Math.abs(target - progress.current) < 0.0005) progress.current = target;
      const p = reduced() || failed.current ? 0 : progress.current;
      element.dataset.progress = p.toFixed(4);
      const solid = capture || reduced() || p > 0.82 || rect.bottom < stageHeight;
      if (solid !== lastSolid) { root.classList.toggle("hero-header-solid", solid); lastSolid = solid; }
      if (decoration.current) decoration.current.style.opacity = String(1 - clamp(p / 0.12));
      if (wash.current) wash.current.style.opacity = String(clamp((p - 0.72) / 0.08));
      if (skip.current) {
        const hidden = p >= 0.85;
        skip.current.style.opacity = String(1 - clamp((p - 0.75) / 0.1));
        skip.current.style.visibility = hidden ? "hidden" : "visible";
        skip.current.tabIndex = hidden ? -1 : 0;
      }
      if (hud.current) hud.current.value = `p ${p.toFixed(3)} · ${p < 0.38 ? "Patio" : p < 0.52 ? "Guiño" : p < 0.72 ? "Pantalla" : "Amarillo"}`;
      const needsScene = !capture && !reduced() && !failed.current && visible && !document.hidden && (p < 0.81 || isDebug);
      setActive(needsScene);
      if (needsScene !== sceneMounted) { sceneMounted = needsScene; setMounted(needsScene); }
      if (visible && !document.hidden && !reduced() && !capture && !failed.current && Math.abs(target - progress.current) >= 0.0005) schedule();
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(tick); };
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    visibility.observe(element);
    const reveal = new IntersectionObserver(([entry]) => {
      if (reduced() || capture || entry.intersectionRatio >= 0.4) title.classList.add("title-in");
      else if (entry.boundingClientRect.top > 0) title.classList.remove("title-in");
    }, { threshold: [0, 0.4] });
    reveal.observe(title);
    media.addEventListener("change", syncPreference);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    // Leave the server-rendered image as the initial, meaningful paint.
    const startup = requestAnimationFrame(syncPreference);
    return () => {
      disposed = true;
      cancelAnimationFrame(startup);
      cancelAnimationFrame(frame);
      smoothScroll?.destroy();
      lenis.current = null;
      visibility.disconnect();
      reveal.disconnect();
      media.removeEventListener("change", syncPreference);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
      root.classList.remove("hero-motion", "hero-capture", "hero-debug", "hero-lenis", "hero-header-solid");
      title.classList.remove("title-in");
    };
  }, []);

  return (
    <div ref={intro} className="hero-intro" data-scene={mounted ? "mounted" : "paused"}>
      <div className="hero-stage bg-ink">
        <Image src="/hero-fachada.svg" alt="Fachada del local DOKEBI con el letrero luminoso del smiley" fill priority sizes="100vw" className="object-cover" />
        {enabled && mounted && (
          <SceneBoundary onError={() => {
            failed.current = true;
            setEnabled(false);
            document.documentElement.classList.remove("hero-motion", "hero-lenis");
            lenis.current?.destroy();
            lenis.current = null;
          }}>
            <div className="hero-canvas" style={{ opacity: ready ? 1 : 0 }} aria-hidden="true">
              <HeroCanvas progress={progress} active={active} debug={debug} orbit={orbit} onReady={() => setReady(true)} />
            </div>
          </SceneBoundary>
        )}
        <div ref={decoration} className="hero-decoration">{children}</div>
        <div ref={wash} className="hero-wash" aria-hidden="true" />
        <a ref={skip} href="#titulo-principal" className="hero-skip border-paper/60 text-paper hover:border-yolk hover:text-yolk absolute right-[clamp(16px,4vw,40px)] bottom-6 inline-flex min-h-11 items-center rounded-full border-2 px-4 text-sm font-bold tracking-[0.08em] uppercase no-underline md:bottom-9"
          onClick={(event) => {
            const title = document.getElementById("titulo-principal");
            if (!title || !lenis.current) return;
            event.preventDefault();
            event.stopPropagation();
            lenis.current.scrollTo(title, { offset: -88, onComplete: () => { history.replaceState(null, "", "#titulo-principal"); title.focus({ preventScroll: true }); } });
          }}>Saltar intro</a>
        {debug && <div className="hero-hud">
          <output ref={hud} aria-live="off">p 0.000 · Patio</output>
          <label><input type="checkbox" checked={orbit} onChange={(event) => setOrbit(event.target.checked)} /> Cámara libre</label>
          <form onSubmit={(event) => {
            event.preventDefault();
            const element = intro.current!;
            const value = Number(new FormData(event.currentTarget).get("progress"));
            const target = element.getBoundingClientRect().top + window.scrollY + clamp(value) * (element.offsetHeight - element.firstElementChild!.clientHeight);
            if (lenis.current) lenis.current.scrollTo(target, { immediate: true });
            else window.scrollTo({ top: target, behavior: "instant" });
          }}>
            <label>Progreso <input name="progress" type="number" min="0" max="1" step="0.001" defaultValue="0" /></label>
            <button type="submit">Ir</button>
          </form>
        </div>}
      </div>
    </div>
  );
}
