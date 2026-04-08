import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

const PulsingPoint = ({ position, color, label }: { position: [number, number, number]; color: string; label: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh ref={mesh}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
};

const Globe = () => {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  const points = useMemo(() => {
    return [
      { pos: [0.8, 0.5, 0.3], color: '#f59e0b', label: 'Cascade Pack' },
      { pos: [0.3, 0.8, -0.4], color: '#f59e0b', label: 'Lamar Valley' },
      { pos: [-0.6, 0.4, 0.7], color: '#10b981', label: 'NE Expansion' },
      { pos: [0.2, -0.7, 0.6], color: '#3b82f6', label: 'Gila Corridor' },
      { pos: [0.9, -0.2, -0.3], color: '#3b82f6', label: 'Coastal Path' },
    ];
  }, []);

  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Sphere ref={globeRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#131b2c"
          roughness={0.1}
          metalness={0.9}
          distort={0.1}
          speed={2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Atmospheric Glow */}
      <Sphere args={[1.1, 64, 64]}>
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>

      {/* Lat/Long Grid (Simulated) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.01, 0.002, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} />
      </mesh>

      {points.map((p, i) => (
        <PulsingPoint key={i} position={p.pos as [number, number, number]} color={p.color} label={p.label} />
      ))}
    </group>
  );
};

export const ThreeDMap: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '400px', background: 'radial-gradient(circle at center, #1a2238 0%, #0a0e17 100%)', borderRadius: '16px', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <React.Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Globe />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </React.Suspense>
      </Canvas>
      <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: 'monospace', pointerEvents: 'none' }}>
        SYSTEM_3D_RENDER: ACTIVE // ORBITAL_PHASE: 14.2
      </div>
    </div>
  );
};

export default ThreeDMap;
