"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { AdditiveBlending, Color, Float32BufferAttribute, InstancedMesh, Object3D, type BufferGeometry, type Texture } from "three";

export type Point = [number, number, number];
export const INK = "#0A0A0A", YOLK = "#FFD400", WHITE = "#F4F4F0";
/** Colores > 1 (HDR): solo el Bloom los hace brillar; sin postprocesado se ven como color pleno. */
export const HOT = new Color().setRGB(3, 2.3, 1.1);
export const NEON = new Color().setRGB(3, 1.5, 0.4);

export function Box({ at, size, color = INK, basic = false, rot }: { at: Point; size: Point; color?: string; basic?: boolean; rot?: Point }) {
  return <mesh position={at} rotation={rot}><boxGeometry args={size} />{basic ? <meshBasicMaterial color={color} toneMapped={false} /> : <meshLambertMaterial color={color} />}</mesh>;
}
export function Panel({ at, size, texture, rot }: { at: Point; size: [number, number]; texture: Texture; rot?: Point }) {
  return <mesh position={at} rotation={rot}><planeGeometry args={size} /><meshBasicMaterial map={texture} transparent toneMapped={false} /></mesh>;
}

/** Una sola draw call para N copias de una geometría; `items` = [x, y, z, rotY, escala, color?, rotX?, rotZ?]. */
export type Item = [number, number, number, number?, number?, string?, number?, number?];
export function Instanced({ geometry, items, color = "#FFFFFF", basic = false, double = false }: { geometry: BufferGeometry; items: Item[]; color?: string | Color; basic?: boolean; double?: boolean }) {
  const mesh = useRef<InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = mesh.current!, o = new Object3D(), c = new Color();
    items.forEach(([x, y, z, ry = 0, s = 1, col, rx = 0, rz = 0], i) => {
      o.position.set(x, y, z); o.rotation.set(rx, ry, rz); o.scale.setScalar(s); o.updateMatrix();
      m.setMatrixAt(i, o.matrix); m.setColorAt(i, c.set(col ?? "#FFFFFF"));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [items]);
  return <instancedMesh ref={mesh} args={[geometry, undefined, items.length]} frustumCulled={false}>
    {basic ? <meshBasicMaterial color={color} toneMapped={false} /> : <meshLambertMaterial color={color} side={double ? 2 : 0} />}
  </instancedMesh>;
}

/** Halos aditivos (un solo draw call) para ampolletas, faroles y focos: el brillo en móvil, refuerzo en desktop. */
export function Glows({ points, glow, color = "#FFC870", size = 0.7, opacity = 0.9 }: { points: Point[]; glow: Texture; color?: string; size?: number; opacity?: number }) {
  const position = useMemo(() => new Float32BufferAttribute(points.flat(), 3), [points]);
  return <points frustumCulled={false}>
    <bufferGeometry attributes-position={position} />
    <pointsMaterial map={glow} color={color} size={size} sizeAttenuation transparent opacity={opacity} depthWrite={false} blending={AdditiveBlending} toneMapped={false} fog={false} />
  </points>;
}
