import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float } from "@react-three/drei";
import { Link } from "react-router-dom";
import { getAssetUrl } from "../utils/assetPath";
import SoundEngine from "../utils/soundEngine";
import "./LobbyVault3D.css";

function VaultMesh({ isSpinning, isOpening }) {
  const gltf = useGLTF(getAssetUrl("/models/vault_safe.glb"));
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current && isSpinning) {
      groupRef.current.rotation.y += delta * (isOpening ? 1.8 : 0.45);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.65, 0]}
      scale={[1.15, 1.15, 1.15]}
      rotation={[0.1, -0.3, 0]}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

useGLTF.preload(getAssetUrl("/models/vault_safe.glb"));

export default function LobbyVault3D({ isOpening = false }) {
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="lobby-vault-3d-wrapper">
      {/* Top Banner Tag */}
      <div className="lobby-vault-header-tag">
        <span className="vault-tag-pulsing-dot" />
        <span className="vault-tag-title">TITANIUM CLASS-IV SAFE · REAL-TIME 3D</span>
        <Link
          to="/vault-3d"
          className="vault-fullscreen-link"
          title="Open Fullscreen 3D Asset Inspector"
          onClick={() => {
            SoundEngine.init();
            SoundEngine.playClick();
          }}
        >
          FULLSCREEN 3D ↗
        </Link>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="lobby-canvas-container">
        <Canvas
          shadows
          camera={{ position: [0, 1.0, 3.2], fov: 42 }}
          className="lobby-r3f-canvas"
        >
          {/* Cyberpunk Lighting */}
          <ambientLight intensity={0.7} color="#0D1626" />
          <spotLight
            position={[3, 5, 4]}
            intensity={3.8}
            angle={0.6}
            penumbra={0.8}
            color="#00E5FF"
          />
          <pointLight position={[-4, 2, 2]} intensity={3.2} color="#FF007F" />
          <pointLight position={[0, -2, -3]} intensity={1.8} color="#FFD166" />
          <directionalLight position={[0, 2, 3]} intensity={1.0} color="#FFFFFF" />

          <Suspense fallback={null}>
            <Float
              speed={autoRotate ? 1.8 : 0}
              rotationIntensity={autoRotate ? 0.25 : 0}
              floatIntensity={autoRotate ? 0.35 : 0}
            >
              <VaultMesh isSpinning={autoRotate} isOpening={isOpening} />
            </Float>
          </Suspense>

          <OrbitControls
            enableDamping
            dampingFactor={0.06}
            minDistance={1.8}
            maxDistance={5.5}
            maxPolarAngle={Math.PI / 2 + 0.1}
          />
        </Canvas>

        {/* Orbit Drag Hint */}
        <div className="lobby-drag-hint">
          <span>🖱️ DRAG TO ROTATE 3D VAULT</span>
        </div>
      </div>
    </div>
  );
}
