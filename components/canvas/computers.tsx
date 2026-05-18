"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";

import CanvasLoader from "./loader";

const Computers = () => {
  const computer = useGLTF("/desktop_pc/scene.gltf");

  return (
    <mesh>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={1.5} />
      <hemisphereLight intensity={1} groundColor="#1a1a2e" />
      {/* Main spotlight from above */}
      <spotLight
        position={[0, 20, 10]}
        angle={0.3}
        penumbra={0.5}
        intensity={3}
        castShadow
        shadow-mapSize={2048}
      />
      {/* Fill light from the side */}
      <spotLight
        position={[10, 10, 10]}
        angle={0.5}
        penumbra={1}
        intensity={2}
      />
      {/* Backlight for rim lighting */}
      <pointLight position={[-10, 5, -10]} intensity={2} color="#38bdf8" />
      {/* Front fill light */}
      <pointLight position={[0, 5, 10]} intensity={2} color="#ffffff" />
      <primitive
        object={computer.scene}
        scale={0.75}
        position={[0, -3.0, -1]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
};

interface ComputersCanvasProps {
  reduceMotion?: boolean;
  isVisible?: boolean;
}

const ComputersCanvas = ({
  reduceMotion = false,
  isVisible = true,
}: ComputersCanvasProps) => {
  const visibleAnimation = reduceMotion
    ? {
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
      }
    : {
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 24,
        scale: isVisible ? 1 : 0.96,
        visibility: isVisible ? "visible" : "hidden",
      };

  return (
    <motion.div
      className="absolute inset-0 z-10 hidden md:block"
      initial={false}
      animate={visibleAnimation}
      transition={reduceMotion ? { duration: 0.15 } : { duration: 0.35, ease: "easeOut" }}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
        willChange: "opacity, transform",
      }}
    >
      <Canvas
        frameloop="demand"
        shadows
        dpr={[1, 2]}
        camera={{ position: [20, 3, 5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers />
      </Suspense>

      <Preload all />
    </Canvas>
    </motion.div>
  );
};

export default ComputersCanvas;
