'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Motor } from '@/types/motor';

interface Motor3DViewerProps {
  motor?: Motor;
  className?: string;
}

function MotorModel({ motor }: { motor?: Motor }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // 缓慢旋转动画
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <group
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        {/* 电机外壳 */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 3, 32]} />
          <meshStandardMaterial
            color={hovered ? '#3b82f6' : '#60a5fa'}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* 电机端盖 */}
        <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 1.5, 0.3, 32]} />
          <meshStandardMaterial
            color="#1e40af"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 1.5, 0.3, 32]} />
          <meshStandardMaterial
            color="#1e40af"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* 电机轴 */}
        <mesh position={[0, 1.9, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
          <meshStandardMaterial
            color="#9ca3af"
            metalness={1}
            roughness={0.1}
          />
        </mesh>

        {/* 散热片 */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 1.7;
          const z = Math.sin(angle) * 1.7;
          return (
            <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]} castShadow>
              <boxGeometry args={[0.1, 2.5, 0.2]} />
              <meshStandardMaterial
                color="#1e3a8a"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          );
        })}

        {/* 风扇叶片 */}
        {[...Array(4)].map((_, i) => {
          const angle = (i / 4) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * 1,
                -1.2,
                Math.sin(angle) * 1
              ]}
              rotation={[Math.PI / 2, angle, 0]}
              castShadow
            >
              <boxGeometry args={[1.2, 0.1, 0.3]} />
              <meshStandardMaterial
                color="#dc2626"
                metalness={0.5}
                roughness={0.5}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export default function Motor3DViewer({ motor, className = '' }: Motor3DViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
        />

        {/* 环境光照 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />

        {/* 环境贴图 */}
        <Environment preset="sunset" />

        {/* 地面网格 */}
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6366f1"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#818cf8"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />

        {/* 阴影 */}
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />

        {/* 电机模型 */}
        <MotorModel motor={motor} />
      </Canvas>
    </div>
  );
}
