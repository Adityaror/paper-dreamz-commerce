"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, RoundedBox, Sparkles, Torus } from "@react-three/drei";
import * as THREE from "three";

function EnvelopeCard() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.25) * 0.4 + state.pointer.x * 0.35;
    group.current.rotation.x = Math.cos(t * 0.2) * 0.08 + state.pointer.y * 0.15;
  });

  return (
    <group ref={group}>
      {/* Envelope body */}
      <RoundedBox args={[3.2, 2.1, 0.08]} radius={0.06} smoothness={4}>
        <meshPhysicalMaterial
          color="#0f2b1e"
          metalness={0.4}
          roughness={0.25}
          clearcoat={1}
          clearcoatRoughness={0.15}
          reflectivity={0.6}
        />
      </RoundedBox>

      {/* Gold flap */}
      <mesh position={[0, 0.42, 0.045]} rotation={[0.5, 0, 0]}>
        <coneGeometry args={[1.85, 1.05, 3]} />
        <meshPhysicalMaterial color="#cda45e" metalness={0.85} roughness={0.2} clearcoat={1} />
      </mesh>

      {/* Wax seal */}
      <mesh position={[0, 0.05, 0.13]}>
        <cylinderGeometry args={[0.3, 0.3, 0.09, 48]} />
        <meshPhysicalMaterial color="#8f2f2f" metalness={0.3} roughness={0.35} clearcoat={0.8} />
      </mesh>
      <mesh position={[0, 0.05, 0.19]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.025, 16, 48]} />
        <meshStandardMaterial color="#e8cd94" metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius, speed, tilt }: { radius: number; speed: number; tilt: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * speed;
  });
  return (
    <group ref={ref} rotation={[tilt, 0.3, 0]}>
      <Torus args={[radius, 0.006, 16, 100]}>
        <meshBasicMaterial color="#cda45e" transparent opacity={0.4} />
      </Torus>
    </group>
  );
}

function FloatingGem({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh position={position} scale={scale}>
        <octahedronGeometry args={[0.18, 0]} />
        <MeshDistortMaterial color="#e8cd94" metalness={0.9} roughness={0.1} distort={0.15} speed={2} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6.6], fov: 40 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[4, 5, 5]} intensity={1.6} color="#fff6da" />
          <pointLight position={[-4, -2, 3]} intensity={0.8} color="#cda45e" />

          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
            <EnvelopeCard />
          </Float>

          <OrbitRing radius={2.6} speed={0.15} tilt={0.3} />
          <OrbitRing radius={3.1} speed={-0.1} tilt={-0.2} />

          <FloatingGem position={[-2.3, 1.4, -0.5]} scale={1.1} />
          <FloatingGem position={[2.4, -1.2, -0.8]} scale={0.85} />
          <FloatingGem position={[2.1, 1.7, 0.3]} scale={0.7} />
          <FloatingGem position={[-2.1, -1.5, 0.2]} scale={0.9} />

          <Sparkles count={50} scale={7} size={2.5} speed={0.3} color="#e8cd94" opacity={0.6} />

          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
