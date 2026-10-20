"use client";
import { useEffect, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import {
  BoxGeometry,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { Material } from "@/lib/data";
export type Vec3 = [number, number, number];
export function StoneSurface({
  material,
  size,
  position = [0, 0, 0],
  radius = 0.008,
  slab = false,
}: {
  material: Material;
  size: Vec3;
  position?: Vec3;
  radius?: number;
  slab?: boolean;
}) {
  const paths = [
    material.texture,
    ...(material.maps?.normal ? [material.maps.normal] : []),
    ...(material.maps?.roughness ? [material.maps.roughness] : []),
  ];
  const originals = useLoader(TextureLoader, paths);
  const maps = useMemo(
    () =>
      originals.map((source, index) => {
        const texture = source.clone();
        texture.wrapS = texture.wrapT = RepeatWrapping;
        texture.anisotropy = 8;
        if (index === 0) texture.colorSpace = SRGBColorSpace;
        texture.needsUpdate = true;
        return texture;
      }),
    [originals],
  );
  useEffect(() => () => maps.forEach((texture) => texture.dispose()), [maps]);
  const [width, height, depth] = size;
  const sourceImage = originals[0].image as { width: number; height: number };
  const aspect = sourceImage.width / sourceImage.height;
  const geometry = useMemo(() => {
    const result =
      radius > 0
        ? new RoundedBoxGeometry(
            width,
            height,
            depth,
            3,
            Math.min(radius, depth / 3, height / 3, width / 3),
          )
        : new BoxGeometry(width, height, depth);
    const p = result.attributes.position,
      n = result.attributes.normal,
      uv = result.attributes.uv;
    const scale = slab
      ? Math.max(width / aspect, height)
      : material.textureScale;
    for (let i = 0; i < p.count; i++) {
      const nx = Math.abs(n.getX(i)),
        ny = Math.abs(n.getY(i)),
        nz = Math.abs(n.getZ(i));
      let u: number, v: number;
      if (nx > ny && nx > nz) {
        u = p.getZ(i);
        v = p.getY(i);
      } else if (ny > nz) {
        u = p.getX(i);
        v = p.getZ(i);
      } else {
        u = p.getX(i);
        v = p.getY(i);
      }
      uv.setXY(i, u / (scale * aspect) + 0.5, v / scale + 0.5);
    }
    return result;
  }, [width, height, depth, radius, material.textureScale, aspect, slab]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const normal = material.maps?.normal ? maps[1] : undefined;
  const roughness = material.maps?.roughness
    ? maps[material.maps.normal ? 2 : 1]
    : undefined;
  return (
    <mesh
      name="stone"
      position={position}
      geometry={geometry}
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        map={maps[0]}
        normalMap={normal}
        roughnessMap={roughness}
        roughness={material.surface.roughness}
        metalness={0}
        clearcoat={slab ? 0.3 : material.surface.clearcoat}
        clearcoatRoughness={0.2}
        ior={material.surface.ior}
        envMapIntensity={0.7}
      />
    </mesh>
  );
}
