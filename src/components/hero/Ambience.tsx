"use client";

import { Line, MeshReflectorMaterial } from "@react-three/drei";
import { useMemo } from "react";
import { BoxGeometry, Shape, ShapeGeometry, SphereGeometry } from "three";
import type { createSceneTextures } from "./scene-textures";
import { Box, Glows, HOT, Instanced, INK, NEON, type Item, type Point } from "./parts";

type Textures = ReturnType<typeof createSceneTextures>;
const FLOOR = "#4A4E5A";

export function Floor({ reflective }: { reflective: boolean }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4]}>
    <planeGeometry args={[44, 44]} />
    {reflective
      ? <MeshReflectorMaterial color={FLOOR} resolution={512} blur={[260, 80]} mixBlur={1} mixStrength={0.7} mirror={0.35} roughness={1} depthScale={0.6} minDepthThreshold={0.5} maxDepthThreshold={1.6} />
      : <meshLambertMaterial color={FLOOR} />}
  </mesh>;
}

function Chair({ at, rot = 0, scale = 1 }: { at: Point; rot?: number; scale?: number }) {
  const c = "#1E2B27";
  return <group position={at} rotation={[0, rot, 0]} scale={scale}>
    <Box at={[0, 0.46, 0]} size={[0.46, 0.04, 0.46]} color={c} />
    <Box at={[0, 0.78, -0.22]} size={[0.46, 0.5, 0.04]} color={c} />
    {[[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]].map(([x, z]) => <Box key={`${x}${z}`} at={[x, 0.22, z]} size={[0.04, 0.44, 0.04]} color={INK} />)}
  </group>;
}
function Umbrella({ at, tilt = 0 }: { at: [number, number]; tilt?: number }) {
  const [x, z] = at;
  return <group position={[x, 0, z]}>
    <Box at={[0, 1.3, 0]} size={[0.06, 2.6, 0.06]} />
    <mesh position={[0, 2.62, 0]} rotation={[tilt, 0, 0]}><coneGeometry args={[1.55, 0.6, 8]} /><meshLambertMaterial color="#1D4A40" /></mesh>
    <mesh position={[0, 0.74, 0]}><cylinderGeometry args={[0.55, 0.55, 0.05, 16]} /><meshLambertMaterial color="#2C2F33" /></mesh>
    <Box at={[0, 0.37, 0]} size={[0.06, 0.74, 0.06]} />
    <Chair at={[-0.85, 0, 0.1]} rot={1.4} /><Chair at={[0.85, 0, -0.1]} rot={-1.6} />
  </group>;
}

function catenary(a: Point, b: Point, sag: number, n: number): Point[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - Math.sin(t * Math.PI) * sag, a[2] + (b[2] - a[2]) * t] as Point;
  });
}
const GARLANDS: [Point, Point, number][] = [[[-12, 4.3, 3.5], [-3.55, 3.55, 0.7], 0.7], [[-11, 4.35, 7.5], [-3.4, 3.6, 0.8], 0.8], [[-12, 4.2, -1], [-3.7, 3.5, 0.45], 0.55]];

function Plant({ x, z, w = 1.1 }: { x: number; z: number; w?: number }) {
  const leaf = useMemo(() => {
    const s = new Shape(); s.moveTo(0, 0); s.quadraticCurveTo(0.14, 0.4, 0, 1); s.quadraticCurveTo(-0.14, 0.4, 0, 0);
    return new ShapeGeometry(s);
  }, []);
  const items = useMemo<Item[]>(() => Array.from({ length: 16 }, (_, i) => {
    const k = i % 8, pair = Math.floor(i / 8);
    const lean = ((k % 4) - 1.5) * 0.28;
    return [x + ((k % 3) - 1) * 0.1, 0.62, z + ((k % 2) - 0.5) * 0.1, k * 0.8 + pair * Math.PI / 2, 0.7 + (k % 3) * 0.18, k % 2 ? "#2F6B3A" : "#245A31", 0, lean] as Item;
  }), [x, z]);
  return <group>
    <Box at={[x, 0.3, z]} size={[w, 0.6, 0.55]} color="#6D6D69" />
    <Instanced geometry={leaf} items={items} double />
  </group>;
}
function Bench({ at, rot = 0 }: { at: Point; rot?: number }) {
  return <group position={at} rotation={[0, rot, 0]}>
    <Box at={[0, 0.42, 0]} size={[1.5, 0.12, 0.5]} color="#5E5E5A" />
    {[-0.6, 0.6].map((x) => <Box key={x} at={[x, 0.18, 0]} size={[0.2, 0.36, 0.42]} color="#4D4D49" />)}
  </group>;
}

export function Ambience({ textures }: { textures: Textures }) {
  const bulb = useMemo(() => new SphereGeometry(0.045, 8, 6), []);
  const beam = useMemo(() => new BoxGeometry(0.22, 0.32, 26), []);
  const lantern = useMemo(() => new BoxGeometry(0.22, 0.5, 0.22), []);
  const rows = useMemo(() => GARLANDS.map(([a, b, sag]) => catenary(a, b, sag, 15)), []);
  const bulbs = useMemo<Item[]>(() => rows.flatMap((r) => r.filter((_, i) => i % 1 === 0 && i > 0 && i < r.length).map(([x, y, z]) => [x, y - 0.06, z] as Item)), [rows]);
  const bulbHalos = useMemo<Point[]>(() => bulbs.map(([x, y, z]) => [x, y, z]), [bulbs]);
  const beams = useMemo<Item[]>(() => Array.from({ length: 9 }, (_, i) => [-12 + i * 2.6, 4.53, 6, 0, 1, "#171717"] as Item), []);
  const lanternPos: Point[] = [[-5.7, 0.28, 1.5], [-3.0, 0.28, 1.5], [-9.2, 0.28, 3.2], [4.6, 0.28, 2.4], [6.5, 0.28, 3.6]];
  const lanternItems = useMemo<Item[]>(() => lanternPos.map(([x, y, z]) => [x, y, z, 0, 1, "#FFD28A"] as Item), []); // eslint-disable-line react-hooks/exhaustive-deps
  const lanternGlow = useMemo<Point[]>(() => lanternPos.map(([x, y, z]) => [x, y + 0.1, z]), []); // eslint-disable-line react-hooks/exhaustive-deps
  return <group>
    {/* Techo, vigas y pilares del fondo */}
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.7, 4]}><planeGeometry args={[44, 44]} /><meshLambertMaterial color="#0C0F18" /></mesh>
    <Instanced geometry={beam} items={beams} />
    {[[-9.5, -4], [-6.2, -5.5], [-13, 0], [7.5, -4], [9.5, 1.5]].map(([x, z]) => <Box key={`${x}${z}`} at={[x, 2.35, z]} size={[0.7, 4.7, 0.7]} color="#12151C" />)}
    <Box at={[0, 2.35, -9]} size={[40, 4.7, 0.3]} color="#0E1119" />
    {/* Patio izquierdo */}
    <Umbrella at={[-6.4, 0.6]} /><Umbrella at={[-8.2, 4.6]} tilt={0.08} /><Umbrella at={[-10.8, 0.5]} tilt={-0.06} />
    {/* Primer plano: borde de mesa y silla cortados por el encuadre */}
    <Box at={[-5.4, 0.78, 3.0]} size={[2.2, 0.06, 1.6]} color="#2E3135" rot={[0, 0.5, 0]} />
    <Box at={[-5.4, 0.39, 3.0]} size={[0.12, 0.78, 0.12]} color={INK} />
    <Chair at={[-3.8, 0, 3.7]} rot={0.9} scale={1.2} />
    {/* Guirnaldas */}
    {rows.map((r, i) => <Line key={i} points={r} color="#101010" lineWidth={1} />)}
    <Instanced geometry={bulb} items={bulbs} basic color={HOT} />
    <Glows points={bulbHalos} glow={textures.glow} color="#FFC060" size={0.5} opacity={0.85} />
    {/* Maceteros, bancas y faroles */}
    <Plant x={-4.3} z={0.4} /><Plant x={-9.0} z={-1.2} w={1.3} /><Plant x={5.2} z={1.2} /><Plant x={7.6} z={0.2} w={1.3} />
    <Bench at={[-3.4, 0, -0.5]} rot={0.15} /><Bench at={[5.2, 0, -0.9]} rot={-0.1} />
    <Instanced geometry={lantern} items={lanternItems} basic />
    <Glows points={lanternGlow} glow={textures.glow} color="#FFB45A" size={1.1} opacity={0.8} />
    {/* Pilar de madera con letrero vertical de neón */}
    <mesh position={[3.1, 2.35, 0.25]}><boxGeometry args={[0.85, 4.7, 0.7]} /><meshLambertMaterial map={textures.wood} /></mesh>
    <Box at={[3.1, 2.55, 0.62]} size={[0.62, 1.78, 0.05]} color="#140A06" />
    <mesh position={[3.1, 2.55, 0.65]}><planeGeometry args={[0.58, 1.74]} /><meshBasicMaterial map={textures.neon} toneMapped={false} /></mesh>
    <sprite position={[3.1, 2.55, 0.8]} scale={[1.3, 2.3, 1]}><spriteMaterial map={textures.glow} color={NEON} transparent opacity={0.3} depthWrite={false} blending={2} fog={false} /></sprite>
  </group>;
}

