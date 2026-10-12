import { CatmullRomCurve3, Quaternion, Vector3 } from "three";

export const PROGRESS_KEYS = [[0, 0], [0.38, 0.30], [0.48, 0.50], [0.52, 0.50], [0.72, 1], [1, 1]] as const;
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

/** Recorrido a partir de posiciones reales de la escena: boca de la carita (`mouth`), su normal y la pantalla del dispositivo. */
export function createCameraPath(screen: Vector3, orientation: Quaternion, variant: HeroVariant = "notebook", mouth = new Vector3(-3.3, 2.8, 0.64), normal = new Vector3(Math.sin(-0.45), 0, Math.cos(-0.45))) {
  const screenNormal = new Vector3(0, 0, 1).applyQuaternion(orientation);
  const screenUp = new Vector3(0, 1, 0).applyQuaternion(orientation);
  const phone = variant === "telefono";
  const aim = phone ? screen.clone() : screen.clone().addScaledVector(screenUp, -0.008);
  // Entrada en diagonal desde la izquierda, a la altura de los ojos y mirando un poco hacia arriba.
  const head = [START, new Vector3(-4.3, 1.6, 5.4), new Vector3(-4.4, 1.9, 3.5), mouth.clone().addScaledVector(normal, 1.5)];
  const headTarget = [START_TARGET, new Vector3(-1.4, 2.6, 0.2), new Vector3(-3.4, 2.9, 0.5), mouth.clone().add(new Vector3(0, 0.1, 0))];
  if (phone) return {
    camera: new CatmullRomCurve3([...head, screen.clone().addScaledVector(screenNormal, 0.8).add(new Vector3(0, 0.2, 0)), screen.clone().addScaledVector(screenNormal, 0.3), screen.clone().addScaledVector(screenNormal, 0.11)]),
    target: new CatmullRomCurve3([...headTarget, screen.clone().add(new Vector3(0, -0.03, 0)), screen.clone(), screen.clone()]),
  };
  return {
    camera: new CatmullRomCurve3([...head, aim.clone().addScaledVector(screenNormal, 1.5).add(new Vector3(0, 0.3, 0)), aim.clone().addScaledVector(screenNormal, 0.55), aim.clone().addScaledVector(screenNormal, 0.17)]),
    target: new CatmullRomCurve3([...headTarget, aim.clone().add(new Vector3(0, -0.05, 0)), aim.clone(), aim.clone()]),
  };
}
