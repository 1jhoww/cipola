"use client";
import { Suspense, useEffect, useRef, type ComponentRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import { Vector2 } from "three";
import type { Material } from "@/lib/data";
import { StoneSurface } from "./StoneSurface";
function Stone({
  material,
  onReady,
}: {
  material: Material;
  onReady: () => void;
}) {
  useEffect(() => onReady(), [onReady]);
  return (
    <group rotation={[0.05, -0.28, -0.07]} position={[0, 0.05, 0]}>
      <StoneSurface material={material} size={material.slabSize} slab />
    </group>
  );
}
// On touch screens a drag that starts on the slab turns it in any direction;
// one that starts on the empty stage around it scrolls the page as usual.
function TouchGate() {
  const { gl, camera, scene, raycaster } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    // A finger is wide: probe a small cross around the touch point.
    const reach = 22;
    const onStone = (touch: Touch) => {
      const stone = scene.getObjectByName("stone");
      if (!stone) return false;
      const box = el.getBoundingClientRect();
      const point = new Vector2();
      return [[0, 0], [reach, 0], [-reach, 0], [0, reach], [0, -reach]].some(
        ([dx, dy]) => {
          point.set(
            ((touch.clientX + dx - box.left) / box.width) * 2 - 1,
            -((touch.clientY + dy - box.top) / box.height) * 2 + 1,
          );
          raycaster.setFromCamera(point, camera);
          return raycaster.intersectObject(stone).length > 0;
        },
      );
    };
    let holding = false;
    const start = (event: TouchEvent) => {
      holding = event.touches.length === 1 && onStone(event.touches[0]);
      if (holding) event.preventDefault();
    };
    const move = (event: TouchEvent) => {
      if (holding) event.preventDefault();
    };
    const end = () => {
      holding = false;
    };
    el.addEventListener("touchstart", start, { passive: false });
    el.addEventListener("touchmove", move, { passive: false });
    el.addEventListener("touchend", end);
    el.addEventListener("touchcancel", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", move);
      el.removeEventListener("touchend", end);
      el.removeEventListener("touchcancel", end);
    };
  }, [gl, camera, scene, raycaster]);
  return null;
}

export type StoneView = { angle: number; zoom: number; reset: number };
// Buttons and keys move the camera from wherever the visitor left it after dragging;
// "Restaurar" (a new `reset`) returns it to the front view.
function Camera({ view }: { view: StoneView }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const previous = useRef(view);
  const { camera, invalidate, size } = useThree();
  const base = size.width < 600 ? 6.4 : 5.1;
  useEffect(() => {
    const last = previous.current;
    previous.current = view;
    if (view.reset !== last.reset || view === last) {
      camera.position.set(0, 0.35, base / view.zoom);
    } else {
      const turn = view.angle - last.angle;
      const { x, y, z } = camera.position;
      camera.position.set(
        x * Math.cos(turn) + z * Math.sin(turn),
        y,
        z * Math.cos(turn) - x * Math.sin(turn),
      );
      if (view.zoom !== last.zoom)
        camera.position.multiplyScalar(last.zoom / view.zoom);
    }
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
    invalidate();
  }, [view, base, camera, invalidate]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableDamping={false}
      minDistance={2.5}
      maxDistance={8}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI - 0.35}
      rotateSpeed={0.55}
      zoomSpeed={0.7}
    />
  );
}
export default function StoneStudio({
  material,
  onReady,
  onLost,
  lite = false,
  view,
}: {
  material: Material;
  onReady: () => void;
  // Older mobile GPUs drop the WebGL context under memory pressure; the photo takes over.
  onLost: () => void;
  // Weaker devices render fewer pixels and a smaller shadow map.
  lite?: boolean;
  view: StoneView;
}) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, lite ? 1.25 : 1.75]}
      camera={{ position: [0, 0.35, 5.1], fov: 35 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      role="img"
      aria-label={`Objeto tridimensional com textura de ${material.name}`}
      style={{ position: "absolute", inset: 0 }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onLost();
          },
          { once: true },
        );
      }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 5]} intensity={1.8} />
      <directionalLight position={[-4, 2, -2]} intensity={0.6} />
      <Suspense fallback={null}>
        <Environment resolution={128} frames={1}>
          <Lightformer
            position={[0, 4, 2]}
            rotation={[Math.PI / 3, 0, 0]}
            scale={[6, 4, 1]}
            intensity={3}
          />
          <Lightformer
            position={[-4, 1, 2]}
            rotation={[0, Math.PI / 3, 0]}
            scale={[2, 5, 1]}
            intensity={2}
          />
          <Lightformer
            position={[4, 2, -2]}
            rotation={[0, -Math.PI / 3, 0]}
            scale={[2, 4, 1]}
            intensity={3}
          />
        </Environment>
        <Stone material={material} onReady={onReady} />
        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.28}
          scale={9}
          blur={2.8}
          far={4}
          resolution={lite ? 256 : 512}
          frames={1}
        />
      </Suspense>
      <Camera view={view} />
      <TouchGate />
    </Canvas>
  );
}
