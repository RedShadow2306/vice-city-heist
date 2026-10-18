import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getAssetUrl } from "../utils/assetPath";
import "./LobbyVault3D.css";

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

const VAULT_MODEL_URL = getAssetUrl("/models/lobby_vault.glb?v=7");

/* ─── 3D Vice City Savings & Loan Vault Mesh ─── */
function VaultModel({ isOpening }) {
  const gltf = useGLTF(VAULT_MODEL_URL);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const groupRef = useRef(null);
  const doorRef = useRef(null);
  const wheelRef = useRef(null);
  const handleRef = useRef(null);
  const openProgressRef = useRef(0);

  // Bind assembly nodes from Blender GLTF
  useEffect(() => {
    scene.traverse((child) => {
      if (child.name === "VaultDoorAssembly") {
        doorRef.current = child;
      } else if (child.name === "CombinationWheel") {
        wheelRef.current = child;
      } else if (child.name === "HandleAssembly") {
        handleRef.current = child;
      }

      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.6;
          // Ensure steel materials respond crisply to studio light
          if (child.material.roughness !== undefined) {
            child.material.roughness = Math.max(0.18, Math.min(child.material.roughness, 0.42));
          }
          if (
            child.material.metalness !== undefined &&
            child.material.metalness > 0.75 &&
            !child.name.includes("Chrome") &&
            !child.name.includes("Gold") &&
            !child.name.includes("Spoke") &&
            !child.name.includes("Hub") &&
            !child.name.includes("Rivet") &&
            !child.name.includes("Bolt")
          ) {
            child.material.metalness = 0.55;
          }
        }
      }
    });
  }, [scene]);

  // Frame Loop: Dial spinning in idle & Handle unlatch + Door swing on open
  useFrame((state, delta) => {
    if (!isOpening) {
      // 1. IDLE: Combination Dial rotates back & forth (Safecracker rhythm)
      const t = state.clock.elapsedTime * 1.5;
      const dialAngle = Math.sin(t) * 1.8 + Math.sin(t * 0.45) * 0.8;
      if (wheelRef.current) {
        wheelRef.current.rotation.z = dialAngle;
      }

      // Handle & Door remain locked
      if (handleRef.current) handleRef.current.rotation.z = 0;
      if (doorRef.current) doorRef.current.rotation.y = 0;
      openProgressRef.current = 0;

      // Subtle resting 3D perspective angle with gentle floating breathing
      const idleTime = state.clock.elapsedTime;
      if (groupRef.current) {
        // Base 3D isometric turn (14 degrees) showcases safe depth, left hinges, and chrome spokes
        groupRef.current.rotation.y = 0.22 + Math.sin(idleTime * 0.8) * 0.05;
        groupRef.current.rotation.x = 0.05 + Math.cos(idleTime * 0.7) * 0.025;
      }
    } else {
      // 2. OPENING SEQUENCE:
      // Spoke Handle spins to unlatch (0 to 0.4s) -> Door swings open on left hinge (0.18 to 1.4s)
      openProgressRef.current = Math.min(1, openProgressRef.current + delta / 1.35);
      const p = openProgressRef.current;

      // Handle unlatch turn (-120 degrees)
      const handleP = Math.min(1, p / 0.35);
      if (handleRef.current) {
        handleRef.current.rotation.z = -Math.PI * (2 / 3) * easeOutCubic(handleP);
      }

      // Door swing open on left hinge (-85 degrees)
      const doorP = Math.min(1, Math.max(0, (p - 0.18) / 0.82));
      if (doorRef.current) {
        doorRef.current.rotation.y = -Math.PI * 0.48 * easeOutCubic(doorP);
      }

      // Tilt slightly toward the opened gold chamber
      if (groupRef.current) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          0.10,
          0.08
        );
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.02, 0]} scale={[0.98, 0.98, 0.98]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(VAULT_MODEL_URL);

/* ─── Exported Lobby Vault 3D Component (Borderless, Pure 3D Safe) ─── */
export default function LobbyVault3D({ isOpening = false }) {
  return (
    <div className="vault-3d-stage">
      {/* Borderless, Transparent 3D Real-Time Viewport */}
      <div className="vault-canvas-container">
        <Canvas
          shadows
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.45,
          }}
          camera={{ position: [0, 0, 3.8], fov: 42 }}
          className="vault-r3f-canvas"
        >
          {/* High-Visibility Studio Lighting */}
          <ambientLight intensity={2.2} color="#FFFFFF" />

          {/* Strong Front Key Light */}
          <directionalLight position={[3.5, 4.5, 4.5]} intensity={3.6} color="#FFFFFF" castShadow />

          {/* Left Fill Light (soft cool daylight) */}
          <directionalLight position={[-4.0, 2.0, 3.5]} intensity={2.6} color="#BEE3FF" />

          {/* Bottom Bounce Light (illuminates underside and lower bolts) */}
          <directionalLight position={[0, -3.5, 2.5]} intensity={2.0} color="#FFFFFF" />

          {/* Top Edge Highlight */}
          <directionalLight position={[0, 4.5, 0.5]} intensity={2.0} color="#FFFFFF" />

          {/* Backlight / Rim Light */}
          <directionalLight position={[0, 3.0, -3.0]} intensity={2.5} color="#FFFFFF" />

          {/* Vice City Cyan Neon Accent (specular reflections on steel chassis) */}
          <pointLight position={[-2.4, 1.8, 2.2]} intensity={3.8} color="#00E5FF" distance={8} />

          {/* Vice City Magenta Rim Accent */}
          <pointLight position={[2.4, -1.4, 2.0]} intensity={2.8} color="#FF007F" distance={8} />

          {/* Interior Gold Bullion Glow */}
          <pointLight
            position={[0.2, -0.1, -0.3]}
            intensity={isOpening ? 9.5 : 2.5}
            color="#FFD166"
            distance={6}
          />

          <Suspense fallback={null}>
            <VaultModel isOpening={isOpening} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
