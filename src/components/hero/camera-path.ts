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

export type HeroVariant = "notebook" | "telefono";

export function createCameraPath(screen: Vector3, orientation: Quaternion, variant: HeroVariant = "notebook") {
  const mouth = new Vector3(-3.263, 2.796, 0.637);
  const normal = new Vector3(Math.sin(0.4), 0, Math.cos(0.4));
  const screenNormal = new Vector3(0, 0, 1).applyQuaternion(orientation);
  const screenUp = new Vector3(0, 1, 0).applyQuaternion(orientation);
  const phone = variant === "telefono";
  const aim = phone ? screen.clone() : screen.clone().addScaledVector(screenUp, -0.008);
  const head = [new Vector3(0.3, 1.75, 12), new Vector3(-0.5, 1.8, 7.5), new Vector3(-0.9, 1.85, 4.4), mouth.clone().addScaledVector(normal, 1.5)];
  const headTarget = [new Vector3(0, 2.6, 0), new Vector3(-1, 2.7, 0), new Vector3(-3.1, 2.95, 0.55), mouth.clone().add(new Vector3(0, 0.1, 0))];
  if (phone) return {
    camera: new CatmullRomCurve3([...head, screen.clone().addScaledVector(screenNormal, 0.8).add(new Vector3(0, 0.2, 0)), screen.clone().addScaledVector(screenNormal, 0.3), screen.clone().addScaledVector(screenNormal, 0.11)]),
    target: new CatmullRomCurve3([...headTarget, screen.clone().add(new Vector3(0, -0.03, 0)), screen.clone(), screen.clone()]),
  };
  const camera = new CatmullRomCurve3([
    new Vector3(0.3, 1.75, 12), new Vector3(-0.5, 1.8, 7.5), new Vector3(-0.9, 1.85, 4.4),
    mouth.clone().addScaledVector(normal, 1.5),
    aim.clone().addScaledVector(screenNormal, 1.5).add(new Vector3(0, 0.3, 0)),
    aim.clone().addScaledVector(screenNormal, 0.55), aim.clone().addScaledVector(screenNormal, 0.17),
  ]);
  const target = new CatmullRomCurve3([
    new Vector3(0, 2.6, 0), new Vector3(-1, 2.7, 0), new Vector3(-3.1, 2.95, 0.55),
    mouth.clone().add(new Vector3(0, 0.1, 0)), aim.clone().add(new Vector3(0, -0.05, 0)), aim.clone(), aim.clone(),
  ]);
  return { camera, target };
}
