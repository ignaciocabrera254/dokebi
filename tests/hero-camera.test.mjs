import assert from "node:assert/strict";
import test from "node:test";
import { Group, Mesh, Quaternion, Vector3 } from "three";
import { createCameraPath, fillDistance, progressToParameter, SCREEN_SIZE, START, START_TARGET } from "../src/components/hero/camera-path.ts";

function device(variant) {
  const root = new Group(); root.position.set(-1.9, 1.11, 0.33); root.rotation.y = -0.35;
  const hinge = new Group(); const screen = new Mesh();
  if (variant === "notebook") { hinge.position.set(0, 0.018, -0.12); hinge.rotation.x = -0.25; screen.position.set(0, 0.112, 0.0065); }
  else { hinge.position.set(0, 0.103, -0.012); hinge.rotation.x = -0.2; screen.position.set(0, 0, 0.0042); }
  root.add(hinge); hinge.add(screen); root.updateMatrixWorld(true);
  return { center: screen.getWorldPosition(new Vector3()), q: screen.getWorldQuaternion(new Quaternion()) };
}

test("mapeo p → u: scroll hasta el guiño, hold en la carita, vuelo automático 0.45–0.90", () => {
  assert.equal(progressToParameter(-1), 0);
  assert.equal(progressToParameter(0.30), 0.5);
  for (const p of [0.38, 0.4, 0.45]) assert.ok(Math.abs(progressToParameter(p) - 0.6) < 1e-12);
  assert.ok(Math.abs(progressToParameter(0.675) - 0.8) < 1e-12);
  for (const p of [0.9, 0.95, 1, 2]) assert.equal(progressToParameter(p), 1);
  let previous = 0;
  for (let i = 0; i <= 1000; i++) { const u = progressToParameter(i / 1000); assert.ok(u >= previous); previous = u; }
});

test("la curva usa 6 puntos y termina frente a la pantalla a dFill", () => {
  const { center, q } = device("notebook");
  const mouth = new Vector3(-3.3, 2.8, 0.64), normal = new Vector3(Math.sin(-0.45), 0, Math.cos(-0.45));
  const dFill = fillDistance(...SCREEN_SIZE.notebook, 50, 16 / 9);
  const path = createCameraPath(center, q, mouth, normal, dFill);
  assert.equal(path.camera.points.length, 6);
  assert.ok(path.camera.getPoint(0).distanceTo(START) < 1e-9 && path.target.getPoint(0).distanceTo(START_TARGET) < 1e-9);
  // u = 0.6: zoom a la carita
  assert.ok(path.camera.getPoint(0.6).distanceTo(mouth.clone().addScaledVector(normal, 1.5)) < 1e-9);
  const sn = new Vector3(0, 0, 1).applyQuaternion(q);
  // u = 0.8: sobre el dispositivo (normal × 1.0 + 0.18 arriba)
  assert.ok(path.camera.getPoint(0.8).distanceTo(center.clone().addScaledVector(sn, 1.0).add(new Vector3(0, 0.18, 0))) < 1e-9);
  const end = path.camera.getPoint(1).sub(center);
  assert.ok(Math.abs(end.length() - dFill) < 1e-9 && end.normalize().distanceTo(sn) < 1e-9);
  assert.ok(path.target.getPoint(1).distanceTo(center) < 1e-9);
});

test("al final la pantalla llena la vista sin mostrar el borde (varias proporciones)", () => {
  for (const [variant, fov, aspect] of [["notebook", 50, 16 / 9], ["notebook", 50, 4 / 3], ["notebook", 50, 1.2], ["telefono", 68, 390 / 844], ["telefono", 68, 0.6]]) {
    const [w, h] = SCREEN_SIZE[variant];
    const d = fillDistance(w, h, fov, aspect);
    const half = Math.tan((fov * Math.PI) / 360);
    assert.ok(2 * d * half <= h * 0.88 + 1e-9, `${variant} ${aspect}: alto de vista ${2 * d * half} vs pantalla ${h}`);
    assert.ok(2 * d * half * aspect <= w * 0.88 + 1e-9, `${variant} ${aspect}: ancho de vista`);
    assert.ok(d > (variant === "telefono" ? 0.01 : 0.02), "debe quedar por delante del near");
  }
});
