'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function MinimalOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group>
      <Sphere ref={meshRef} args={[1.5, 64, 64]}>
        <meshStandardMaterial
          color="#6366F1"
          roughness={0.3}
          metalness={0.8}
        />
      </Sphere>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#6366F1" />
    </group>
  );
}

export default function Hero({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="relative min-h-screen w-full flex items-center pt-16">
      <div className="max-w-6xl mx-auto px-6 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-8"
          >
            <div className="inline-block px-3 py-1 rounded-full bg-[#111113] border border-zinc-800 text-xs text-[#A1A1AA]">
              Powered by AI
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-[#FAFAFA] leading-tight">
              Analyze your
              <br />
              <span className="text-[#6366F1]">Instagram profile</span>
            </h1>

            <p className="text-lg text-[#A1A1AA] max-w-md leading-relaxed">
              Get instant AI-powered insights to understand your profile&apos;s strengths and discover growth opportunities.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCTAClick}
              className="px-6 py-3 rounded-lg bg-[#6366F1] text-white font-medium hover:bg-[#5558E3] transition-colors duration-200 shadow-lg shadow-[rgba(99,102,241,0.25)]"
            >
              Get Started
            </motion.button>
          </motion.div>

          {/* Right Column - 3D Orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative h-100 lg:h-125"
          >
            <div className="absolute inset-0 bg-[rgba(99,102,241,0.08)] rounded-full blur-3xl" />
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <MinimalOrb />
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

