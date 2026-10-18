import React, { Suspense, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getAssetUrl } from "../utils/assetPath";
import "./LobbyVault3D.css";

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

/* ─── 3D Vice City Savings & Loan Vault Mesh ─── */
function VaultModel({ isOpening }) {
  const gltf = useGLTF(getAssetUrl("/models/lobby_vault.glb"));
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
          child.material.envMapIntensity = 1.3;
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

      // Subtle resting float tilt
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.03;
        groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.7) * 0.02;
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
    <group ref={groupRef} position={[0, -0.02, 0]} scale={[0.96, 0.96, 0.96]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(getAssetUrl("/models/lobby_vault.glb"));

/* ─── Exported Lobby Vault 3D Component ─── */
export default function LobbyVault3D({ isOpening = false }) {
  return (
    <div className="vault-3d-stage">
      <div className={`vault-3d-box ${isOpening ? "opening" : ""}`}>
        {/* Frame Header with Security Chip & Live Status */}
        <div className="vault-frame-header">
          <span className="vault-security-chip">TITANIUM CLASS-IV VAULT</span>
          <span className={`vault-status-indicator ${isOpening ? "opening" : ""}`}>
            {isOpening ? "UNLOCKING..." : "ARMED & SEALED"}
          </span>
        </div>

        {/* 3D Real-Time Canvas Viewport */}
        <div className="vault-canvas-container">
          <Canvas
            shadows
            camera={{ position: [0, 0, 3.8], fov: 42 }}
            className="vault-r3f-canvas"
          >
            {/* Cinematic Vice City Lighting */}
            <ambientLight intensity={0.9} color="#101828" />

            {/* Front Key Light */}
            <directionalLight position={[2, 3, 4]} intensity={2.2} castShadow />

            {/* Cyan Neon Accent Light (reflects off steel chassis & bezel) */}
            <pointLight position={[-1.8, 1.6, 2.0]} intensity={2.6} color="#00E5FF" distance={5} />

            {/* Hot Pink Rim Accent */}
            <pointLight position={[1.8, -1.2, 1.5]} intensity={1.6} color="#FF007F" distance={5} />

            {/* Interior Gold Light (revealed through opening door) */}
            <pointLight
              position={[0.2, -0.2, -0.4]}
              intensity={isOpening ? 6.0 : 1.2}
              color="#FFD166"
              distance={4}
            />

            <Suspense fallback={null}>
              <VaultModel isOpening={isOpening} />
            </Suspense>
          </Canvas>
        </div>
      </div>
    </div>
  );
}
