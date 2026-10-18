import React, { Suspense, useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { Link } from "react-router-dom";
import { getAssetUrl } from "../utils/assetPath";
import SoundEngine from "../utils/soundEngine";
import "./Vault3DViewer.css";

/* ─── 3D Model Component ─── */
function VaultModel({ wireframe, lightingPreset, isSpinning }) {
  const gltf = useGLTF(getAssetUrl("/models/vault_safe.glb"));
  const groupRef = useRef();

  // Clone scene so wireframe toggles don't mutate global GLTF cache
  const scene = React.useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.wireframe = wireframe;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene, wireframe]);

  useFrame((_, delta) => {
    if (groupRef.current && isSpinning) {
      groupRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.9, 0]} scale={[1.4, 1.4, 1.4]}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the GLB model asset
useGLTF.preload(getAssetUrl("/models/vault_safe.glb"));

/* ─── 3D Studio Lighting Presets ─── */
function StudioLighting({ preset }) {
  if (preset === "daylight") {
    return (
      <>
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2.0} castShadow />
        <directionalLight position={[-5, -2, -5]} intensity={0.6} />
      </>
    );
  }

  if (preset === "red_alert") {
    return (
      <>
        <ambientLight intensity={0.4} color="#330000" />
        <pointLight position={[0, 4, 2]} intensity={4.5} color="#FF0044" />
        <spotLight position={[-4, 6, 4]} intensity={5.0} angle={0.6} color="#FF2200" castShadow />
        <pointLight position={[3, -1, -3]} intensity={2.0} color="#FF5500" />
      </>
    );
  }

  if (preset === "gold_hour") {
    return (
      <>
        <ambientLight intensity={0.6} color="#2A1B0A" />
        <directionalLight position={[4, 6, 4]} intensity={3.0} color="#FFD166" />
        <pointLight position={[-3, 2, 2]} intensity={2.5} color="#FF9E00" />
        <pointLight position={[0, -2, -3]} intensity={1.5} color="#FF5400" />
      </>
    );
  }

  // Default: Cyberpunk Neon (Vice City Heist signature turquoise & hot pink)
  return (
    <>
      <ambientLight intensity={0.7} color="#0D1626" />
      {/* Key Light: Vice Turquoise */}
      <spotLight
        position={[4, 7, 5]}
        intensity={4.2}
        angle={0.55}
        penumbra={0.7}
        color="#00E5FF"
        castShadow
      />
      {/* Fill Light: Vice Hot Pink */}
      <pointLight position={[-5, 3, 2]} intensity={3.5} color="#FF007F" />
      {/* Rim Light: Warm Vice Gold */}
      <pointLight position={[0, -2, -4]} intensity={2.2} color="#FFD166" />
      {/* Front Face Soft Fill */}
      <directionalLight position={[0, 2, 4]} intensity={1.1} color="#FFFFFF" />
    </>
  );
}

/* ─── Loading HUD inside Canvas ─── */
function CanvasLoader() {
  return (
    <Html center>
      <div className="viewer-canvas-loader">
        <div className="loader-neon-ring" />
        <span className="loader-text">STREAMING 3D ASSET...</span>
      </div>
    </Html>
  );
}

/* ─── Main Page Component ─── */
export default function Vault3DViewer() {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingPreset, setLightingPreset] = useState("neon");
  const [specsOpen, setSpecsOpen] = useState(false);
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      SoundEngine.init();
      SoundEngine.playKeyType();
    }
  };

  const toggleAutoRotate = () => {
    setAutoRotate((prev) => !prev);
    SoundEngine.init();
    SoundEngine.playClick();
  };

  const toggleWireframe = () => {
    setWireframe((prev) => !prev);
    SoundEngine.init();
    SoundEngine.playClick();
  };

  return (
    <main className="vault-3d-page">
      {/* Atmospheric overlays */}
      <div className="viewer-scanlines" aria-hidden="true" />
      <div className="viewer-vignette" aria-hidden="true" />

      {/* Top Header HUD */}
      <header className="viewer-top-hud">
        <div className="viewer-header-left">
          <Link to="/" className="viewer-back-btn" title="Return to Bank Terminal">
            ◀ BACK TO LOBBY
          </Link>
          <div className="viewer-title-group">
            <span className="viewer-badge-tag">DAEMON '26 · ASSET PIPELINE</span>
            <h1 className="viewer-headline">TITANIUM VAULT SAFE // 3D INSPECTOR</h1>
            <p className="viewer-subline">
              Procedurally modeled via Blender 5.2.2 LTS Python Headless & Rendered with React Three Fiber
            </p>
          </div>
        </div>

        <div className="viewer-header-right">
          <div className="viewer-status-chip">
            <span className="status-dot-pulsing" />
            <span>RENDER ENGINE: R3F / THREE.JS</span>
          </div>
        </div>
      </header>

      {/* Center 3D Stage Viewport */}
      <section className="viewer-canvas-stage">
        <Canvas
          shadows
          camera={{ position: [0, 1.2, 3.8], fov: 45 }}
          className="three-canvas"
        >
          <StudioLighting preset={lightingPreset} />
          
          <Suspense fallback={<CanvasLoader />}>
            <Float
              speed={autoRotate ? 1.5 : 0}
              rotationIntensity={autoRotate ? 0.2 : 0}
              floatIntensity={autoRotate ? 0.3 : 0}
            >
              <VaultModel
                wireframe={wireframe}
                lightingPreset={lightingPreset}
                isSpinning={autoRotate}
              />
            </Float>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.06}
            minDistance={1.8}
            maxDistance={7.5}
            maxPolarAngle={Math.PI / 2 + 0.15}
          />
        </Canvas>

        {/* Orbit Helper Watermark */}
        <div className="viewer-orbit-hint">
          <span className="hint-mouse-icon">🖱️</span>
          <span>DRAG TO ROTATE · SCROLL TO ZOOM · RIGHT-CLICK TO PAN</span>
        </div>
      </section>

      {/* Floating Control Deck */}
      <footer className="viewer-control-deck">
        <div className="deck-actions-row">
          {/* Auto Rotate Button */}
          <button
            type="button"
            className={`deck-btn ${autoRotate ? "deck-btn-active" : ""}`}
            onClick={toggleAutoRotate}
          >
            <span className="deck-btn-icon">🔄</span>
            <span>AUTO-ROTATE: {autoRotate ? "ON" : "OFF"}</span>
          </button>

          {/* Wireframe Button */}
          <button
            type="button"
            className={`deck-btn ${wireframe ? "deck-btn-active" : ""}`}
            onClick={toggleWireframe}
          >
            <span className="deck-btn-icon">📐</span>
            <span>WIREFRAME: {wireframe ? "ON" : "OFF"}</span>
          </button>

          {/* Lighting Mode Selector */}
          <div className="deck-preset-group">
            <span className="preset-group-label">LIGHTING:</span>
            {[
              { id: "neon", label: "NEON HEIST" },
              { id: "daylight", label: "DAYLIGHT" },
              { id: "gold_hour", label: "GOLDEN" },
              { id: "red_alert", label: "RED ALERT" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                className={`deck-pill-btn ${lightingPreset === p.id ? "active" : ""}`}
                onClick={() => {
                  setLightingPreset(p.id);
                  SoundEngine.init();
                  SoundEngine.playTick();
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Reset Camera Button */}
          <button
            type="button"
            className="deck-btn deck-reset-btn"
            onClick={handleResetCamera}
          >
            <span className="deck-btn-icon">🎯</span>
            <span>RESET VIEW</span>
          </button>

          {/* Technical Specs Toggle */}
          <button
            type="button"
            className={`deck-btn deck-specs-btn ${specsOpen ? "deck-btn-active" : ""}`}
            onClick={() => setSpecsOpen((v) => !v)}
          >
            <span className="deck-btn-icon">📋</span>
            <span>{specsOpen ? "HIDE SPECS" : "ASSET SPECS"}</span>
          </button>
        </div>

        {/* Technical Specs Drawer */}
        {specsOpen && (
          <div className="viewer-specs-drawer">
            <div className="specs-grid">
              <div className="spec-card">
                <span className="spec-label">MODEL NAME</span>
                <span className="spec-value">Vice City Titanium Vault Safe</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">ASSET FORMAT</span>
                <span className="spec-value">glTF 2.0 Binary (.glb)</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">FILE SIZE</span>
                <span className="spec-value">~100 KB (Optimized Low-Poly)</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">GENERATOR ENGINE</span>
                <span className="spec-value">Blender 5.2.2 LTS (Headless bpy)</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">MATERIAL CHANNELS</span>
                <span className="spec-value">PBR Metallic-Roughness + Emissive</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">MCP AUTOMATION</span>
                <span className="spec-value">.agents/mcp_config.json (FastMCP)</span>
              </div>
            </div>
          </div>
        )}
      </footer>
    </main>
  );
}
