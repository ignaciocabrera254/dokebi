"use client";

import { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, RoundedBox } from "@react-three/drei";
import { Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Quaternion, Vector3, type Texture } from "three";
import { Ambience, Floor } from "./Ambience";
import { createCameraPath, fillDistance, progressToParameter, SCREEN_SIZE, START, type HeroVariant } from "./camera-path";
import { Kiosk } from "./Kiosk";
import { Box, Panel, type Point } from "./parts";
import { createSceneTextures, createScreenTexture } from "./scene-textures";

const Effects = lazy(() => import("./Effects"));
type Props = { variant: HeroVariant; progress: RefObject<number>; active: boolean; debug: boolean; orbit: boolean; onReady: () => void };
const SIGN_ROT = -0.45;
const BG = "#080B14";

function Notebook({ screen, texture }: { screen: RefObject<Mesh | null>; texture: Texture }) {
  return <group position={[-1.9, 1.11, 0.33]} rotation={[0, -0.35, 0]}>
    <Box at={[0, 0.009, 0]} size={[0.34, 0.018, 0.24]} color="#2B2B2B" />
    <mesh position={[0, 0.0185, -0.03]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.12]} /><meshLambertMaterial color="#141414" /></mesh>
    <group position={[0, 0.018, -0.12]} rotation={[-0.25, 0, 0]}>
      <Box at={[0, 0.11, 0]} size={[0.34, 0.22, 0.012]} color="#2B2B2B" />
      <mesh ref={screen} position={[0, 0.112, 0.0065]}><planeGeometry args={[0.32, 0.2075]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    </group>
  </group>;
}
function Telefono({ screen, texture }: { screen: RefObject<Mesh | null>; texture: Texture }) {
  return <group position={[-1.9, 1.11, 0.33]} rotation={[0, -0.35, 0]}>
    <Box at={[0, 0.006, -0.01]} size={[0.09, 0.012, 0.07]} color="#1B1B1B" />
    <Box at={[0, 0.022, 0.018]} size={[0.07, 0.02, 0.012]} color="#1B1B1B" />
    <group position={[0, 0.103, -0.012]} rotation={[-0.2, 0, 0]}>
      <RoundedBox args={[0.08, 0.165, 0.008]} radius={0.008} smoothness={4}><meshLambertMaterial color="#2B2B2B" /></RoundedBox>
      <mesh ref={screen} position={[0, 0, 0.0042]}><planeGeometry args={[0.074, 0.158]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    </group>
  </group>;
}

function Scene({ variant, progress, debug, orbit, onReady }: Omit<Props, "active">) {
  const sign = useRef<Group>(null);
  const face = useRef<Mesh>(null);
  const mouthRef = useRef<Mesh>(null);
  const screen = useRef<Mesh>(null);
  const phone = variant === "telefono";
  const path = useRef<ReturnType<typeof createCameraPath> | null>(null);
  const [route, setRoute] = useState<Point[]>([]);
  const { camera, size, gl } = useThree();
  const textures = useMemo(() => createSceneTextures(), []);
  const screenTexture = useMemo(() => createScreenTexture(phone), [phone]);
  const look = useMemo(() => new Vector3(), []);
  const position = useMemo(() => new Vector3(), []);
  const announced = useRef(false);

  useEffect(() => () => { Object.values(textures).forEach((texture) => texture.dispose()); }, [textures]);
  useEffect(() => () => screenTexture.dispose(), [screenTexture]);
  useLayoutEffect(() => {
    const mesh = screen.current!;
    mesh.updateWorldMatrix(true, false);
    sign.current!.updateWorldMatrix(true, true);
    const mouth = mouthRef.current!.getWorldPosition(new Vector3());
    const normal = new Vector3(0, 0, 1).applyQuaternion(sign.current!.getWorldQuaternion(new Quaternion()));
    // La pantalla debe llenar toda la vista sin mostrar el borde: se recalcula al cambiar el tamaño de la ventana.
    const aspect = size.width / size.height;
    const [sw, sh] = SCREEN_SIZE[variant];
    const dFill = fillDistance(sw, sh, aspect <= 1 ? 68 : 50, aspect);
    path.current = createCameraPath(mesh.getWorldPosition(new Vector3()), mesh.getWorldQuaternion(new Quaternion()), mouth, normal, dFill);
    if (debug) setRoute(path.current.camera.getPoints(100).map((p) => p.toArray() as Point));
    if (!debug || !orbit) {
      path.current.camera.getPoint(progressToParameter(progress.current), position);
      path.current.target.getPoint(progressToParameter(progress.current), look);
      camera.position.copy(position); camera.lookAt(look);
    }
  }, [camera, debug, orbit, look, position, progress, size, variant]);

  useFrame(({ clock, camera, size }) => {
    const perspective = camera as PerspectiveCamera;
    const fov = size.width / size.height <= 1 ? 68 : 50;
    if (perspective.fov !== fov) { perspective.fov = fov; perspective.updateProjectionMatrix(); }
    const p = progress.current;
    if (path.current && (!debug || !orbit)) {
      // Parametric samples keep the paired control points synchronized.
      const u = progressToParameter(p);
      path.current.camera.getPoint(u, position);
      path.current.target.getPoint(u, look);
      camera.position.copy(position); camera.lookAt(look);
    }
    if (sign.current && face.current) {
      const winking = p > 0.36 && p < 0.45;
      (face.current.material as MeshBasicMaterial).map = winking ? textures.wink : textures.face;
      sign.current.scale.setScalar(winking ? 1 + Math.sin((p - 0.36) / 0.09 * Math.PI) * 0.08 : 1);
      sign.current.rotation.y = SIGN_ROT + Math.sin(clock.elapsedTime / 1.1) * 0.03 * (1 - Math.min(1, Math.max(0, (p - 0.45) / 0.1)));
    }
    if (debug) (window as unknown as { __heroInfo?: () => unknown }).__heroInfo = () => ({ ...gl.info.render, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures });
    if (!announced.current) { announced.current = true; requestAnimationFrame(onReady); }
  });

  return <>
    <color attach="background" args={[BG]} />
    <fog attach="fog" args={[BG, 12, 38]} />
    {/* Ambiente frío y oscuro; el local, las guirnaldas, los faroles y el neón en cálido. Máx. 4 luces puntuales. */}
    <hemisphereLight args={["#5A7AB8", "#262A38", 2]} />
    <directionalLight position={[-4, 8, 6]} intensity={0.8} color="#8FA8E8" />
    <pointLight position={[-0.3, 2.4, -1.4]} intensity={4} distance={9} color="#FFE9A8" decay={1} />
    <pointLight position={[-1, 3.1, 2.2]} intensity={2.5} distance={9} color="#FFC860" decay={1} />
    <pointLight position={[-6.5, 3.4, 3.5]} intensity={2.5} distance={10} color="#FFB45A" decay={1} />
    <pointLight position={[3.6, 2.4, 1.6]} intensity={2} distance={6} color="#FF8A3A" decay={1} />
    <Floor reflective={!phone} /><Ambience textures={textures} /><Kiosk textures={textures} />
    {[3.22, 2.78].map((y) => <Box key={y} at={[-2.82, y, 0.42]} size={[0.7, 0.035, 0.035]} color="#9A9A96" />)}
    <group ref={sign} position={[-3.3, 3, 0.55]} rotation={[0, SIGN_ROT, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.66, 0.66, 0.18, 48]} /><meshLambertMaterial color="#E2B200" /></mesh>
      <mesh ref={face} position={[0, 0, 0.095]}><planeGeometry args={[1.32, 1.32]} /><meshBasicMaterial map={textures.face} transparent toneMapped={false} /></mesh>
      <group rotation={[0, Math.PI, 0]}><Panel at={[0, 0, 0.095]} size={[1.32, 1.32]} texture={textures.face} /></group>
      <mesh ref={mouthRef} position={[0, -0.2, 0.095]} visible={false}><boxGeometry args={[0.01, 0.01, 0.01]} /></mesh>
      <sprite position={[0, 0, -0.2]} scale={[2.4, 2.4, 1]}><spriteMaterial map={textures.glow} color="#FFD400" transparent opacity={0.35} depthWrite={false} blending={2} fog={false} /></sprite>
    </group>
    {phone ? <Telefono screen={screen} texture={screenTexture} /> : <Notebook screen={screen} texture={screenTexture} />}
    {!phone && <Suspense fallback={null}><Effects /></Suspense>}
    {debug && <>{orbit && <OrbitControls makeDefault target={[-1, 2, 0]} />}{!location.search.includes("clean") && <Line points={route.length ? route : [[0.3, 1.75, 12], [-3, 3, 2]]} color="#FF7657" lineWidth={2} />}</>}
  </>;
}

export default function HeroCanvas(props: Props) {
  const { active, variant } = props;
  const phone = variant === "telefono";
  return <Canvas key={variant} dpr={[1, 1.5]} frameloop={active ? "always" : "never"} camera={{ position: START.toArray(), fov: phone ? 68 : 50, near: phone ? 0.01 : 0.02, far: 70 }} gl={{ antialias: phone, powerPreference: "low-power", preserveDrawingBuffer: props.debug }} flat fallback={null}>
    <Suspense fallback={null}><Scene {...props} /></Suspense>
  </Canvas>;
}
