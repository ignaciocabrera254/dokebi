"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, OrbitControls, useTexture } from "@react-three/drei";
import { Group, Mesh, MeshBasicMaterial, PerspectiveCamera, Quaternion, SRGBColorSpace, Vector3, type Texture } from "three";
import { createCameraPath, progressToParameter } from "./camera-path";
import { createSceneTextures } from "./scene-textures";

type Point = [number, number, number];
type Props = { progress: RefObject<number>; active: boolean; debug: boolean; orbit: boolean; onReady: () => void };
const INK = "#0A0A0A", YOLK = "#FFD400", WHITE = "#F4F4F0";

function Box({ at, size, color = INK, basic = false }: { at: Point; size: Point; color?: string; basic?: boolean }) {
  return <mesh position={at}><boxGeometry args={size} />{basic ? <meshBasicMaterial color={color} toneMapped={false} /> : <meshLambertMaterial color={color} />}</mesh>;
}
function Panel({ at, size, texture }: { at: Point; size: [number, number]; texture: Texture }) {
  return <mesh position={at}><planeGeometry args={size} /><meshBasicMaterial map={texture} transparent toneMapped={false} /></mesh>;
}
function Counter({ x, width, height }: { x: number; width: number; height: number }) {
  return <group>
    <Box at={[x, (height - 0.07) / 2, 0.18]} size={[width, height - 0.07, 0.55]} color={YOLK} />
    {Array.from({ length: Math.round(width / 0.09) }, (_, i) => <Box key={i} at={[x - width / 2 + i * 0.09 + 0.025, (height - 0.07) / 2, 0.465]} size={[0.018, height - 0.07, 0.022]} color="#D9AE00" />)}
    <Box at={[x, height - 0.035, 0.2]} size={[width + 0.06, 0.07, 0.66]} color={WHITE} />
    <Box at={[x, height - 0.08, 0.52]} size={[width, 0.025, 0.018]} color="white" basic />
  </group>;
}
function Patio() {
  return <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 4]}><planeGeometry args={[40, 40]} /><meshLambertMaterial color="#4B4B48" /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.7, 4]}><planeGeometry args={[40, 40]} /><meshLambertMaterial color="#0D0D0D" /></mesh>
    {Array.from({ length: 8 }, (_, i) => <Box key={i} at={[-8.8 + i * 2.2, 4.53, 6]} size={[0.22, 0.32, 24]} color="#171717" />)}
    <Box at={[-5.4, 4.34, 4.2]} size={[0.12, 0.07, 2.2]} color="white" basic />
    <Line points={Array.from({ length: 33 }, (_, i) => [-9 + i * 0.175, 3.75 - Math.sin(i / 32 * Math.PI) * 0.35, 1.2] as Point)} color="#171717" lineWidth={1} />
    {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-9 + i * 0.7, 3.75 - Math.sin(i / 8 * Math.PI) * 0.35, 1.2]}><sphereGeometry args={[0.05, 8, 8]} /><meshBasicMaterial color="#FFF1C2" toneMapped={false} /></mesh>)}
    {([[-6.6, 3.2], [-8.2, 6.5]] as const).map(([x, z]) => <group key={x}>
      <Box at={[x, 1.2, z]} size={[0.06, 2.4, 0.06]} />
      <mesh position={[x, 2.55, z]}><coneGeometry args={[1.5, 0.55, 8]} /><meshLambertMaterial color="#2F3B3B" /></mesh>
      <Box at={[x, 0.75, z]} size={[1.1, 0.05, 0.75]} color="#3A3A3A" />
      <Box at={[x, 0.36, z]} size={[0.05, 0.72, 0.05]} />
      {[-0.8, 0.8].map((offset) => <Box key={offset} at={[x + offset, 0.23, z]} size={[0.45, 0.45, 0.45]} color="#222222" />)}
    </group>)}
  </group>;
}
function Kiosk({ textures }: { textures: ReturnType<typeof createSceneTextures> }) {
  return <group>
    {[-2.45, 2.45].map((x) => <Box key={x} at={[x, 2.35, 0.1]} size={[0.24, 4.7, 0.4]} />)}
    <Box at={[0, 4.31, 0.1]} size={[5.14, 0.78, 0.4]} />
    {[-2.6, 2.6].map((x) => <Box key={x} at={[x, 2.35, -1.6]} size={[0.2, 4.7, 3.5]} />)}
    <Box at={[3.3, 2.35, -0.05]} size={[1.3, 4.7, 0.25]} color="#7A4E2C" />
    <Box at={[0, 3.35, 0.12]} size={[4.66, 1.14, 0.36]} color={YOLK} basic />
    <Panel at={[0, 3.35, 0.305]} size={[4.66, 1.14]} texture={textures.fascia} />
    <Box at={[0, 2.72, 0.05]} size={[4.66, 0.12, 0.3]} color="#9A9A96" />
    <mesh position={[-1.1, 2.5, -0.2]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.17, 0.17, 1.9, 20]} /><meshLambertMaterial color="#9A9A96" /></mesh>
    {Array.from({ length: 12 }, (_, i) => <Box key={i} at={[-2.02 + i * 0.16, 2.5, -0.021]} size={[0.008, 0.22, 0.008]} color="#71716E" />)}
    <Box at={[0, 1.4, -3.25]} size={[4.72, 2.8, 0.1]} color={YOLK} basic />
    {[-2.36, 2.36].map((x) => <Box key={x} at={[x, 1.39, -1.6]} size={[0.05, 2.78, 3.4]} color={YOLK} />)}
    <Box at={[0, 2.8, -1.6]} size={[4.66, 0.06, 3.4]} color={WHITE} />
    <Box at={[-0.4, 2.48, -2.95]} size={[2.4, 0.5, 0.45]} color={WHITE} />
    <Box at={[0, 2.7, -1.2]} size={[4, 0.04, 0.04]} />
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-1.6 + i * 0.65, 2.6, -1.2]}><cylinderGeometry args={[0.06, 0.07, 0.14, 12]} /><meshBasicMaterial color="white" /></mesh>)}
    <Box at={[-1.75, 0.875, -2.75]} size={[0.85, 1.75, 0.6]} />
    <Panel at={[-1.75, 0.875, -2.444]} size={[0.85, 1.75]} texture={textures.fridge} />
    <Box at={[0.9, 0.45, -2.9]} size={[2.7, 0.9, 0.55]} color={WHITE} />
    {[1.55, 1.95].map((y) => <group key={y}>
      <Box at={[1.5, y, -3.05]} size={[1.3, 0.04, 0.3]} color={WHITE} />
      {["#2E8B3A", "#E8742A", "#2E8B3A", "#111111", "#E8742A"].map((color, i) => <Box key={i} at={[1 + i * 0.25, y + 0.17, -3.05]} size={[0.2, 0.3, 0.08]} color={color} />)}
    </group>)}
    <Box at={[1.55, 2.42, -2.75]} size={[0.9, 0.5, 0.6]} color="#9A9A96" />
    <Counter x={-1.03} width={2.6} height={1.11} />
    <Counter x={1.3} width={2.06} height={0.8} />
    {[0.75, 1.28].map((x) => <group key={x}>
      <Box at={[x, 0.93, 0.3]} size={[0.5, 0.26, 0.36]} color={YOLK} />
      {Array.from({ length: 5 }, (_, i) => <Box key={i} at={[x - 0.19 + i * 0.09, 0.93, 0.486]} size={[0.055, 0.07, 0.01]} color="#C99F00" />)}
    </group>)}
    <mesh position={[1.85, 1.03, 0.25]}><cylinderGeometry args={[0.15, 0.15, 0.45, 20]} /><meshLambertMaterial color="#BFD8F0" transparent opacity={0.75} /></mesh>
    {[2.27, 1.36].map((y) => <group key={y}><Box at={[1.9, y, 0.12]} size={[0.86, 0.86, 0.06]} /><Panel at={[1.9, y, 0.155]} size={[0.8, 0.8]} texture={textures.menu} /></group>)}
    {[-1.25, -0.95, -0.65].map((x) => <group key={x} position={[x, 1.27, 0.32]} rotation={[-0.12, 0, 0]}><Panel at={[0, 0, 0]} size={[0.24, 0.32]} texture={textures.menu} /></group>)}
    <Panel at={[-2, 1.75, -0.3]} size={[0.55, 1.1]} texture={textures.merch} />
  </group>;
}

function Scene({ progress, debug, orbit, onReady }: Omit<Props, "active">) {
  const sign = useRef<Group>(null);
  const face = useRef<Mesh>(null);
  const screen = useRef<Mesh>(null);
  const path = useRef<ReturnType<typeof createCameraPath> | null>(null);
  const [route, setRoute] = useState<Point[]>([]);
  const { camera, size } = useThree();
  const textures = useMemo(() => createSceneTextures(), []);
  const screenshot = useTexture("/hero/pantalla.webp");
  const look = useMemo(() => new Vector3(), []);
  const position = useMemo(() => new Vector3(), []);
  const announced = useRef(false);

  useEffect(() => () => { Object.values(textures).forEach((texture) => texture.dispose()); }, [textures]);
  useLayoutEffect(() => {
    const mesh = screen.current!;
    mesh.updateWorldMatrix(true, false);
    path.current = createCameraPath(mesh.getWorldPosition(new Vector3()), mesh.getWorldQuaternion(new Quaternion()));
    if (debug) setRoute(path.current.camera.getPoints(100).map((p) => p.toArray() as Point));
    if (!debug || !orbit) {
      path.current.camera.getPoint(progressToParameter(progress.current), position);
      path.current.target.getPoint(progressToParameter(progress.current), look);
      camera.position.copy(position); camera.lookAt(look);
    }
  }, [camera, debug, orbit, look, position, progress, size]);

  useFrame(({ clock, camera, size }) => {
    const perspective = camera as PerspectiveCamera;
    const fov = size.width / size.height < 1 ? 68 : 50;
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
      const winking = p > 0.43 && p < 0.53;
      (face.current.material as MeshBasicMaterial).map = winking ? textures.wink : textures.face;
      sign.current.scale.setScalar(winking ? 1 + Math.sin((p - 0.43) / 0.1 * Math.PI) * 0.08 : 1);
      sign.current.rotation.y = 0.4 + Math.sin(clock.elapsedTime / 1.1) * 0.03 * (1 - Math.min(1, Math.max(0, (p - 0.5) / 0.1)));
    }
    if (!announced.current) { announced.current = true; requestAnimationFrame(onReady); }
  });

  return <>
    <color attach="background" args={[INK]} />
    <fog attach="fog" args={[INK, 14, 30]} />
    <ambientLight intensity={0.5} />
    <directionalLight position={[-3, 7, 8]} intensity={1.2} color="#FFF8E7" />
    <pointLight position={[0, 2.3, -1.4]} intensity={4} distance={9} color="#FFF1B0" decay={1} />
    <pointLight position={[0, 3.1, 1.7]} intensity={2} distance={7} color="#FFE680" decay={1} />
    <pointLight position={[-2.9, 3, 1.3]} intensity={2} distance={4} color={YOLK} decay={1} />
    <pointLight position={[-5.5, 4.2, 4]} intensity={2} distance={10} color="#DFE8FF" decay={1} />
    <Patio /><Kiosk textures={textures} />
    <Box at={[-3.3, 1.17, 0.55]} size={[0.09, 2.34, 0.09]} />
    <group position={[-2.88, 3.62, 0.42]} rotation={[0, 0.4, 0]}><Box at={[0, 0, 0]} size={[0.95, 0.07, 0.07]} /></group>
    <group ref={sign} position={[-3.3, 3, 0.55]} rotation={[0, 0.4, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.66, 0.66, 0.18, 48]} /><meshLambertMaterial color="#E2B200" /></mesh>
      <mesh ref={face} position={[0, 0, 0.095]}><planeGeometry args={[1.32, 1.32]} /><meshBasicMaterial map={textures.face} transparent toneMapped={false} /></mesh>
      <group rotation={[0, Math.PI, 0]}><Panel at={[0, 0, 0.095]} size={[1.32, 1.32]} texture={textures.face} /></group>
    </group>
    <group position={[-1.9, 1.11, 0.22]} rotation={[0, 0.25, 0]}>
      <Box at={[0, 0.009, 0]} size={[0.34, 0.018, 0.24]} color="#2B2B2B" />
      <mesh position={[0, 0.0185, -0.03]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.3, 0.12]} /><meshLambertMaterial color="#141414" /></mesh>
      <group position={[0, 0.018, -0.12]} rotation={[-0.25, 0, 0]}>
        <Box at={[0, 0.11, 0]} size={[0.34, 0.22, 0.012]} color="#2B2B2B" />
        <mesh ref={screen} position={[0, 0.112, 0.0065]}><planeGeometry args={[0.32, 0.2075]} /><meshBasicMaterial map={screenshot} map-colorSpace={SRGBColorSpace} map-anisotropy={4} toneMapped={false} /></mesh>
      </group>
    </group>
    {debug && <>{orbit && <OrbitControls makeDefault target={[-1, 2, 0]} />}<Line points={route.length ? route : [[0.3, 1.75, 12], [-3, 3, 2]]} color="#FF7657" lineWidth={2} /></>}
  </>;
}

export default function HeroCanvas(props: Props) {
  const { active } = props;
  return <Canvas dpr={[1, 1.5]} frameloop={active ? "always" : "never"} camera={{ position: [0.3, 1.75, 12], fov: 50, near: 0.01, far: 60 }} gl={{ antialias: true, powerPreference: "low-power" }} flat fallback={null}>
    <Suspense fallback={null}><Scene {...props} /></Suspense>
  </Canvas>;
}
