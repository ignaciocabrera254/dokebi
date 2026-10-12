"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BoxGeometry, CylinderGeometry, SphereGeometry, type Sprite } from "three";
import type { createSceneTextures } from "./scene-textures";
import { Box, Glows, HOT, Instanced, Panel, WHITE, YOLK, type Item, type Point } from "./parts";

type Textures = ReturnType<typeof createSceneTextures>;
const GREY = "#9A9A96";
const colors = ["#C0341D", "#E8742A", "#2E8B3A", "#FFD400", "#C0341D", "#7A3FA8", "#2E8B3A"];

// Ventana x ∈ [−1.65, 1.1]; a la izquierda el muro con el merch, a la derecha el muro con los paneles de menú.
function Corrugated({ x0, x1, y0, y1, z }: { x0: number; x1: number; y0: number; y1: number; z: number }) {
  const geometry = useMemo(() => new BoxGeometry(0.018, y1 - y0, 0.022), [y0, y1]);
  const items = useMemo<Item[]>(() => Array.from({ length: Math.round((x1 - x0) / 0.09) }, (_, i) => [x0 + 0.025 + i * 0.09, (y0 + y1) / 2, z, 0, 1, "#D9AE00"]), [x0, x1, y0, y1, z]);
  return <Instanced geometry={geometry} items={items} />;
}

/** Letras en relieve: capas con el mismo recorte (alphaTest) apiladas hacia delante, de un amarillo oscuro a blanco brillante (Bloom). */
const LAYERS = 20, DEPTH = 0.11;
function Relief({ texture }: { texture: Textures["fasciaText"] }) {
  return <>{Array.from({ length: LAYERS }, (_, i) => {
    const front = i === LAYERS - 1;
    const color = front ? "#FFFFFF" : i < 8 ? "#6F5C00" : "#A88C00";
    return <mesh key={i} position={[0, 3.35, 0.31 + (DEPTH * i) / (LAYERS - 1)]}>
      <planeGeometry args={[4.66, 1.14]} />
      <meshBasicMaterial map={texture} color={color} alphaTest={0.5} toneMapped={false} />
    </mesh>;
  })}</>;
}

function Steam({ glow, at }: { glow: Textures["glow"]; at: Point }) {
  const refs = useRef<(Sprite | null)[]>([]);
  useFrame(({ clock }) => {
    refs.current.forEach((s, i) => {
      if (!s) return;
      const f = (clock.elapsedTime * 0.18 + i / 6) % 1;
      s.position.set(at[0] + Math.sin(f * 6 + i) * 0.04, at[1] + f * 0.55, at[2]);
      s.scale.setScalar(0.12 + f * 0.28);
      (s.material as { opacity: number }).opacity = Math.sin(f * Math.PI) * 0.4;
    });
  });
  return <>{Array.from({ length: 6 }, (_, i) => <sprite key={i} ref={(s) => { refs.current[i] = s; }}><spriteMaterial map={glow} color="#FFFFFF" transparent opacity={0} depthWrite={false} fog={false} /></sprite>)}</>;
}

export function Kiosk({ textures }: { textures: Textures }) {
  const cup = useMemo(() => new CylinderGeometry(0.05, 0.035, 0.1, 10), []);
  const dog = useMemo(() => new CylinderGeometry(0.03, 0.03, 0.3, 10), []);
  const snack = useMemo(() => new BoxGeometry(0.12, 0.18, 0.05), []);
  const crate = useMemo(() => new BoxGeometry(0.32, 0.2, 0.3), []);
  const spot = useMemo(() => new CylinderGeometry(0.06, 0.08, 0.16, 12), []);
  const bulb = useMemo(() => new SphereGeometry(0.03, 8, 6), []);
  const towers = useMemo<Item[]>(() => [[0.92, 0.2], [1.02, 0.18], [-1.5, 0.22]].flatMap(([x, z], t) => Array.from({ length: t === 2 ? 7 : 11 }, (_, i) => [x, 1.17 + i * 0.075, z, 0, 1, i % 4 === 0 ? "#E8E8E4" : "#FFFFFF"] as Item)), []);
  const dogs = useMemo<Item[]>(() => [-0.45, -0.3, -0.15, 0].map((x, i) => [x, 1.15, 0.2, 0, 1, i === 1 ? "#E0642B" : "#D98A3D", Math.PI / 2, 0] as Item), []);
  const snacks = useMemo<Item[]>(() => [1.67, 2.07].flatMap((y, row) => colors.map((c, i) => [0.05 + i * 0.16, y, -3.18, 0, 1, colors[(i + row * 3) % 7]] as Item)), []);
  const crates = useMemo<Item[]>(() => [[0.3, 2.62], [0.65, 2.62], [0.3, 2.42], [0.65, 2.42], [0.95, 2.6]].map(([x, y]) => [x, y, -3.05, 0.1, 1, "#FFD400"] as Item), []);
  const spots = useMemo<Item[]>(() => Array.from({ length: 5 }, (_, i) => [-1.3 + i * 0.55, 2.62, -1.3, 0, 1, "#E8E8E4"] as Item), []);
  const bulbs = useMemo<Item[]>(() => Array.from({ length: 5 }, (_, i) => [-1.3 + i * 0.55, 2.53, -1.3]), []);
  const halos = useMemo<Point[]>(() => bulbs.map(([x, y, z]) => [x, y - 0.05, z]), [bulbs]);
  return <group>
    {/* Marco y cascarón */}
    {[-2.45, 2.45].map((x) => <Box key={x} at={[x, 2.35, 0.1]} size={[0.24, 4.7, 0.4]} />)}
    <Box at={[0, 4.31, 0.1]} size={[5.14, 0.78, 0.4]} />
    {[-2.6, 2.6].map((x) => <Box key={x} at={[x, 2.35, -1.6]} size={[0.2, 4.7, 3.5]} />)}
    {/* Letrero frontal */}
    <Box at={[0, 3.35, 0.12]} size={[4.66, 1.14, 0.36]} color={YOLK} basic />
    <Panel at={[0, 3.35, 0.305]} size={[4.66, 1.14]} texture={textures.fascia} />
    <Relief texture={textures.fasciaText} />
    {/* Persiana */}
    <Box at={[-0.27, 2.72, 0.05]} size={[2.9, 0.12, 0.3]} color={GREY} />
    <mesh position={[-0.27, 2.52, -0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.17, 0.17, 2.7, 20]} /><meshLambertMaterial color={GREY} /></mesh>
    {/* Fondo, techo y lados interiores */}
    <Box at={[0, 1.4, -3.25]} size={[4.72, 2.8, 0.1]} color={YOLK} basic />
    {[-2.36, 2.36].map((x) => <Box key={x} at={[x, 1.39, -1.6]} size={[0.05, 2.78, 3.4]} color={YOLK} />)}
    <Box at={[0, 2.8, -1.6]} size={[4.66, 0.06, 3.4]} color={WHITE} />
    {/* Muro izquierdo (merch) y derecho (menús) */}
    <Box at={[-2, 1.36, -0.05]} size={[0.7, 2.72, 0.3]} color={YOLK} />
    <Panel at={[-2, 1.85, 0.105]} size={[0.62, 1.5]} texture={textures.merch} />
    <Box at={[1.725, 1.36, -0.05]} size={[1.25, 2.72, 0.3]} color={YOLK} />
    <Box at={[1.725, 1.2, 0.47]} size={[1.18, 2.15, 0.04]} color="#0A0A0A" />
    <Panel at={[1.725, 2.2, 0.495]} size={[1.1, 0.96]} texture={textures.menuHot} />
    <Panel at={[1.725, 1.17, 0.495]} size={[1.1, 0.96]} texture={textures.menuTteok} />
    {/* Mesón: base acanalada, tapa blanca y luz inferior */}
    <Box at={[0, 0.5, 0.18]} size={[4.7, 1.0, 0.55]} color={YOLK} />
    <Corrugated x0={-2.35} x1={2.35} y0={0} y1={1.0} z={0.465} />
    <Box at={[-0.625, 1.075, 0.2]} size={[3.51, 0.07, 0.66]} color={WHITE} />
    <Box at={[-0.625, 1.02, 0.52]} size={[3.45, 0.025, 0.018]} color="#FFF3B0" basic />
    {/* Interior: refri, repisas, campana, mesón trasero */}
    <Box at={[-1.1, 0.875, -2.75]} size={[0.85, 1.75, 0.6]} />
    <Panel at={[-1.1, 0.875, -2.444]} size={[0.85, 1.75]} texture={textures.fridge} />
    <Box at={[0.2, 0.45, -2.9]} size={[2.0, 0.9, 0.55]} color={WHITE} />
    {[1.55, 1.95].map((y) => <Box key={y} at={[0.55, y, -3.05]} size={[1.5, 0.04, 0.3]} color={WHITE} />)}
    <Instanced geometry={snack} items={snacks} />
    <Instanced geometry={crate} items={crates} />
    <Box at={[0.85, 2.3, -2.75]} size={[0.9, 0.45, 0.6]} color={GREY} />
    <Box at={[0.85, 2.62, -2.85]} size={[0.3, 0.3, 0.3]} color={GREY} />
    {/* Riel y focos encendidos */}
    <Box at={[-0.5, 2.7, -1.3]} size={[2.8, 0.04, 0.04]} />
    <Instanced geometry={spot} items={spots.map(([x, , z, r, s, c]) => [x, 2.64, z, r, s, c] as Item)} />
    <Instanced geometry={bulb} items={bulbs} basic color={HOT} />
    <Glows points={halos} glow={textures.glow} color="#FFE9A8" size={0.55} opacity={0.7} />
    {/* Mostrador: bandeja de corndogs, sartén con vapor, vasos y palillero */}
    <Box at={[-0.22, 1.12, 0.2]} size={[0.8, 0.02, 0.38]} color="#2A2A2A" />
    <Instanced geometry={dog} items={dogs.map(([x, y, z, ry, s, c, rx]) => [x, y + 0.03, z, ry, s, c, rx, Math.PI / 2] as Item)} />
    <mesh position={[0.6, 1.14, 0.2]}><cylinderGeometry args={[0.24, 0.22, 0.07, 24]} /><meshLambertMaterial color="#1A1A1A" /></mesh>
    <mesh position={[0.6, 1.178, 0.2]}><cylinderGeometry args={[0.21, 0.21, 0.01, 24]} /><meshBasicMaterial color="#C2351C" /></mesh>
    <Box at={[0.88, 1.15, 0.2]} size={[0.2, 0.025, 0.04]} color="#0A0A0A" />
    <Steam glow={textures.glow} at={[0.6, 1.25, 0.2]} />
    <Instanced geometry={cup} items={towers} />
    <Box at={[-1.25, 1.15, 0.28]} size={[0.14, 0.12, 0.1]} color="#7A4E2C" />
    {[-0.04, 0, 0.04].map((dx) => <Box key={dx} at={[-1.25 + dx, 1.25, 0.28]} size={[0.012, 0.12, 0.012]} color="#E8D2A0" />)}
  </group>;
}
