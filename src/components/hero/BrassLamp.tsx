'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Environment,
  Float,
  Lightformer,
  ContactShadows,
  AdaptiveDpr,
} from '@react-three/drei';
import * as THREE from 'three';

/* ── The lamp profile (a Bengali "samai" standing oil lamp) ─────────────── */
function lampProfile(): THREE.Vector2[] {
  const p: [number, number][] = [
    [0.0, 0.0],
    [1.55, 0.0],
    [1.5, 0.16],
    [0.85, 0.34],
    [0.42, 0.5],
    [0.2, 0.66],
    [0.16, 1.1],
    [0.15, 1.8],
    [0.17, 2.18],
    [0.26, 2.32],
    [0.95, 2.68],
    [1.12, 2.86],
    [1.0, 2.86],
    [0.82, 2.66],
    [0.2, 2.42],
    [0.0, 2.4],
  ];
  return p.map(([x, y]) => new THREE.Vector2(x, y));
}

function Lamp() {
  const group = useRef<THREE.Group>(null);
  const flame = useRef<THREE.PointLight>(null);
  const points = useMemo(lampProfile, []);

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.25;
    // candle-flicker on the flame light
    if (flame.current) {
      const t = state.clock.elapsedTime;
      flame.current.intensity =
        7 + Math.sin(t * 12) * 1.4 + Math.sin(t * 23.3) * 0.8;
    }
  });

  const brass = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color('#b8893b'),
        metalness: 1,
        roughness: 0.26,
        envMapIntensity: 1.4,
      }),
    [],
  );

  return (
    <group ref={group} position={[0, -1.4, 0]} scale={1.05}>
      {/* body */}
      <mesh material={brass} castShadow>
        <latheGeometry args={[points, 96]} />
      </mesh>
      {/* finial rod + bud above the bowl */}
      <mesh material={brass} position={[0, 3.1, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 16]} />
      </mesh>
      <mesh material={brass} position={[0, 3.45, 0]} castShadow>
        <sphereGeometry args={[0.12, 24, 24]} />
      </mesh>
      {/* the flame */}
      <mesh position={[0, 2.78, 0.95]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color="#ffd27a"
          emissive="#ff9d2e"
          emissiveIntensity={6}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={flame}
        position={[0, 2.95, 0.95]}
        color="#ffb24d"
        intensity={7}
        distance={6}
        decay={2}
      />
    </group>
  );
}

/* ── Slowly drifting brass dust motes ───────────────────────────────────── */
function Dust({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#e8c987"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function BrassLamp() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.6, 7], fov: 38 }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.35} />
      <spotLight
        position={[5, 8, 6]}
        angle={0.4}
        penumbra={1}
        intensity={2.4}
        color="#fff0d4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-6, 2, -4]} intensity={1.1} color="#ffcf8f" />

      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.5}>
        <Lamp />
      </Float>
      <Dust />

      <ContactShadows
        position={[0, -1.45, 0]}
        opacity={0.55}
        scale={12}
        blur={2.6}
        far={4}
        color="#000000"
      />

      {/* Procedural studio reflections — no external HDR fetch (offline-safe). */}
      <Environment resolution={256}>
        <Lightformer
          intensity={3}
          position={[0, 4, 4]}
          scale={[8, 4, 1]}
          color="#fff1d6"
        />
        <Lightformer
          intensity={1.2}
          position={[-5, 1, 1]}
          scale={[3, 6, 1]}
          color="#d98a3d"
        />
        <Lightformer
          intensity={1.6}
          position={[5, 0, 2]}
          scale={[3, 6, 1]}
          color="#ffcf8f"
        />
      </Environment>
    </Canvas>
  );
}
