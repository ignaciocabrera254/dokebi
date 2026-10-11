import assert from "node:assert/strict";
import test from "node:test";
import { Group, Mesh, Quaternion, Vector3 } from "three";
import { createCameraPath, progressToParameter } from "../src/components/hero/camera-path.ts";

test("scroll pauses on the face, reaches the screen at 72%, and stays there", () => {
  assert.equal(progressToParameter(-1), 0);
  assert.equal(progressToParameter(0.38), 0.3);
  for (const p of [0.48, 0.49, 0.5, 0.51, 0.52]) assert.equal(progressToParameter(p), 0.5);
  for (const p of [0.72, 0.8, 1, 2]) assert.equal(progressToParameter(p), 1);
  let previous = 0;
  for (let i = 0; i <= 1000; i++) { const u = progressToParameter(i / 1000); assert.ok(u >= previous); previous = u; }
});

test("paired parametric curves align at the sign and finish 17cm from the tilted screen", () => {
  const notebook = new Group(); notebook.position.set(-1.9, 1.11, 0.22); notebook.rotation.y = 0.25;
  const lid = new Group(); lid.position.set(0, 0.018, -0.12); lid.rotation.x = -0.25; notebook.add(lid);
  const screen = new Mesh(); screen.position.set(0, 0.112, 0.0065); lid.add(screen);
  notebook.updateMatrixWorld(true);
  const center = screen.getWorldPosition(new Vector3());
  const orientation = screen.getWorldQuaternion(new Quaternion());
  const path = createCameraPath(center, orientation);
  const mouth = new Vector3(-3.263, 2.796, 0.637);
  const signNormal = new Vector3(Math.sin(0.4), 0, Math.cos(0.4));
  assert.ok(path.camera.getPoint(0.5).distanceTo(mouth.clone().addScaledVector(signNormal, 1.5)) < 1e-9);
  assert.ok(path.target.getPoint(0.5).distanceTo(mouth.clone().add(new Vector3(0, 0.1, 0))) < 1e-9);
  const aim = center.clone().addScaledVector(new Vector3(0, 1, 0).applyQuaternion(orientation), -0.008);
  assert.ok(path.target.getPoint(1).distanceTo(aim) < 1e-9);
  const finalOffset = path.camera.getPoint(1).sub(aim);
  assert.ok(Math.abs(finalOffset.length() - 0.17) < 1e-9);
  assert.ok(finalOffset.normalize().distanceTo(new Vector3(0, 0, 1).applyQuaternion(orientation)) < 1e-9);
  for (let i = 0; i <= 6; i++) {
    assert.ok(path.camera.getPoint(i / 6).distanceTo(path.camera.points[i]) < 1e-9);
    assert.ok(path.target.getPoint(i / 6).distanceTo(path.target.points[i]) < 1e-9);
  }
});
