import { CatmullRomCurve3, Quaternion, Vector3 } from "three";

// p (pin) → u (curva): aproximación 0–0.30, zoom a la carita y guiño 0.30–0.45 (u 0.5 → 0.6), vuelo automático al dispositivo 0.45–0.90.
export const PROGRESS_KEYS = [[0, 0], [0.30, 0.50], [0.38, 0.60], [0.45, 0.60], [0.90, 1], [1, 1]] as const;
export function progressToParameter(p: number) {
  p = Math.max(0, Math.min(1, p));
  for (let i = 0; i < PROGRESS_KEYS.length - 1; i++) {
    const [start, from] = PROGRESS_KEYS[i];
    const [end, to] = PROGRESS_KEYS[i + 1];
    if (p <= end) return from + (to - from) * ((p - start) / (end - start));
  }
  return 1;
}

export const START = new Vector3(-4.2, 1.5, 6.9);
export const START_TARGET = new Vector3(0.4, 2.4, 0);

export type HeroVariant = "notebook" | "telefono";
/** Tamaño (m) de la pantalla de cada dispositivo. */
export const SCREEN_SIZE = { notebook: [0.32, 0.2075], telefono: [0.074, 0.158] } as const;

/** Distancia a la que una pantalla w × h llena toda la vista (sin mostrar el borde), con 12 % de margen. */
export function fillDistance(width: number, height: number, fov: number, aspect: number) {
  const half = Math.tan((fov * Math.PI) / 360);
  return Math.min(height / 2 / half, width / 2 / (half * aspect)) * 0.88;
}

/** Recorrido a partir de posiciones reales de la escena: boca de la carita (`mouth`), su normal y la pantalla del dispositivo.
 *  6 puntos: inicio, dos del patio, zoom a la carita, sobre el dispositivo y frente a la pantalla a `dFill`. */
export function createCameraPath(screen: Vector3, orientation: Quaternion, mouth = new Vector3(-3.3, 2.8, 0.64), normal = new Vector3(Math.sin(-0.45), 0, Math.cos(-0.45)), dFill = 0.17) {
  const screenNormal = new Vector3(0, 0, 1).applyQuaternion(orientation);
  // Entrada en diagonal desde la izquierda, a la altura de los ojos y mirando un poco hacia arriba.
  return {
    camera: new CatmullRomCurve3([
      START, new Vector3(-4.3, 1.6, 5.4), new Vector3(-4.4, 1.9, 3.5), mouth.clone().addScaledVector(normal, 1.5),
      screen.clone().addScaledVector(screenNormal, 1.0).add(new Vector3(0, 0.18, 0)), screen.clone().addScaledVector(screenNormal, dFill),
    ]),
    target: new CatmullRomCurve3([
      START_TARGET, new Vector3(-1.4, 2.6, 0.2), new Vector3(-3.4, 2.9, 0.5), mouth.clone().add(new Vector3(0, 0.1, 0)),
      screen.clone(), screen.clone(),
    ]),
  };
}
