"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Float } from "@react-three/drei";
import * as THREE from "three";

// Mouse position tracker
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  if (typeof window !== "undefined") {
    window.addEventListener("mousemove", (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    });
  }
  
  return mouse;
}

// Floating phone mesh
function PhoneMesh({ mouse }: { mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      // Subtle rotation based on mouse position
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mouse.x * 0.15,
        0.05
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mouse.y * 0.1,
        0.05
      );
    }
    if (glowRef.current) {
      glowRef.current.rotation.y = meshRef.current?.rotation.y || 0;
      glowRef.current.rotation.x = meshRef.current?.rotation.x || 0;
    }
  });
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.1}
      floatIntensity={0.4}
    >
      {/* Ember glow behind phone */}
      <mesh ref={glowRef} position={[0, 0, -0.15]}>
        <planeGeometry args={[1.8, 3.2]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.08}
        />
      </mesh>
      
      {/* Phone body */}
      <mesh ref={meshRef}>
        <RoundedBox args={[1, 2, 0.08]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color="#201F1F"
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0, 0.042]}>
        <RoundedBox args={[0.88, 1.8, 0.001]} radius={0.04} smoothness={4}>
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.1}
            roughness={0.1}
            emissive="#FF4500"
            emissiveIntensity={0.02}
          />
        </RoundedBox>
      </mesh>
      
      {/* Screen content glow lines */}
      <mesh position={[0, 0.3, 0.044]}>
        <boxGeometry args={[0.6, 0.15, 0.001]} />
        <meshBasicMaterial color="#FF4500" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.044]}>
        <boxGeometry args={[0.5, 0.08, 0.001]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      <mesh position={[0, -0.2, 0.044]}>
        <boxGeometry args={[0.4, 0.05, 0.001]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
      <mesh position={[0, -0.4, 0.044]}>
        <boxGeometry args={[0.45, 0.08, 0.001]} />
        <meshBasicMaterial color="#8A2BE2" transparent opacity={0.4} />
      </mesh>
      
      {/* Camera notch */}
      <mesh position={[0.25, 0.85, 0.045]}>
        <cylinderGeometry args={[0.03, 0.03, 0.01, 16]} />
        <meshStandardMaterial color="#353534" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Ember edge glow */}
      <mesh position={[0, 0, 0]}>
        <RoundedBox args={[1.02, 2.02, 0.09]} radius={0.09} smoothness={4}>
          <meshBasicMaterial
            color="#FF4500"
            transparent
            opacity={0.05}
          />
        </RoundedBox>
      </mesh>
    </Float>
  );
}

// Scene component
function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-2, -1, 1]} intensity={0.4} color="#FF4500" />
      <pointLight position={[0, -2, 2]} intensity={0.3} color="#8A2BE2" />
      <PhoneMesh mouse={mouse} />
    </>
  );
}

export default function HeroPhone3D() {
  const mouse = useMousePosition();
  
  return (
    <div className="absolute top-0 right-0 w-[280px] h-[400px] pointer-events-none opacity-90 hidden xl:block z-10">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
