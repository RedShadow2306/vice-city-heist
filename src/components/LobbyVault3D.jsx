import React, { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { getAssetUrl } from "../utils/assetPath";
import "./LobbyVault3D.css";

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

const VAULT_MODEL_URL = getAssetUrl("/models/lobby_vault.glb?v=60");

/* ─── Procedural Studio Environment for True Metallic Reflections ─── */
function StudioEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    const envTexture = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTexture;

    return () => {
      pmremGenerator.dispose();
      roomEnv.dispose();
      envTexture.dispose();
    };
  }, [gl, scene]);

  return null;
}

/* ─── 3D Vice City Bank Vault Mesh Component ─── */
function VaultModel({ isOpening, onToggleOpen }) {
  const gltf = useGLTF(VAULT_MODEL_URL);
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const groupRef = useRef(null);
  const doorRef = useRef(null);
  const wheelRef = useRef(null);
  const handleRef = useRef(null);
  const deadboltsRef = useRef([]);
  const openProgressRef = useRef(0);

  // Bind assembly nodes from Blender GLTF
  useEffect(() => {
    deadboltsRef.current = [];
    scene.traverse((child) => {
      if (child.name === "VaultDoorAssembly") {
        doorRef.current = child;
      } else if (child.name === "CombinationWheel") {
        wheelRef.current = child;
      } else if (child.name === "HandleAssembly") {
        handleRef.current = child;
      } else if (child.name.startsWith("LockBolt_")) {
        deadboltsRef.current.push({
          mesh: child,
          basePos: child.position.clone(),
          axis: child.name.includes("Top") || child.name.includes("Bottom") ? "z" : "x",
          dir: child.name.includes("Bottom") || child.name.includes("Left") ? 1 : -1,
        });
      }

      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.envMapIntensity = 1.15;
          if (child.material.map) {
            child.material.map.colorSpace = THREE.SRGBColorSpace;
            child.material.map.needsUpdate = true;
          }
        }
      }
    });
  }, [scene]);

  // Frame Loop: Mechanical Safecracker Animation & Opening Sequence
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    if (!isOpening) {
      // 1. AUTHENTIC SAFECRACKER IDLE SEQUENCE:
      // The central wheel handle actively spins and jiggles as someone attempts to crack the vault combinations!
      // Rhythm: Clockwise Search -> Tumbler Tension Notch Jiggle -> Counter-Clockwise Sweep ->
      //         Second Gate Jiggle -> Precision Alignment -> Forceful Latch Crank Attempt & Recoil
      const cycle = t % 7.2;
      let handleAngle = 0;
      let dialAngle = 0;

      if (cycle < 1.6) {
        // Step 1: Rapid clockwise rotation searching for first gate
        const p = cycle / 1.6;
        const ease = easeInOutQuad(p);
        handleAngle = Math.PI * 2.2 * ease;
        dialAngle = Math.PI * 3.8 * ease;
      } else if (cycle < 2.3) {
        // Step 2: Feels tumbler resistance! Tension jiggle testing notch depth
        const elapsed = cycle - 1.6;
        const jitter = Math.sin(elapsed * 28.0) * 0.05 * Math.exp(-elapsed * 1.5);
        handleAngle = Math.PI * 2.2 + jitter;
        dialAngle = Math.PI * 3.8 + jitter * 1.8;
      } else if (cycle < 4.0) {
        // Step 3: Brisk counter-clockwise sweep past zero for combination #2
        const p = (cycle - 2.3) / 1.7;
        const ease = easeInOutQuad(p);
        handleAngle = Math.PI * 2.2 - Math.PI * 3.2 * ease;
        dialAngle = Math.PI * 3.8 - Math.PI * 5.2 * ease;
      } else if (cycle < 4.7) {
        // Step 4: Second gate tension testing & mechanical notch clicks
        const elapsed = cycle - 4.0;
        const jitter = Math.sin(elapsed * 24.0) * 0.06 * Math.exp(-elapsed * 1.5);
        handleAngle = -Math.PI * 1.0 + jitter;
        dialAngle = -Math.PI * 1.4 + jitter * 1.8;
      } else if (cycle < 5.8) {
        // Step 5: Precision clockwise alignment to final gate
        const p = (cycle - 4.7) / 1.1;
        const ease = easeInOutQuad(p);
        handleAngle = -Math.PI * 1.0 + Math.PI * 1.8 * ease;
        dialAngle = -Math.PI * 1.4 + Math.PI * 2.7 * ease;
      } else {
        // Step 6: Forceful latch crank attempt! Safecracker tries to force the wheel down,
        // meets lock bolt resistance, and springs back with a mechanical clank recoil!
        const p = (cycle - 5.8) / 1.4;
        const crank = -0.52 * Math.sin(p * Math.PI);
        const recoil = Math.sin(p * 18.0) * 0.07 * (1.0 - p);
        handleAngle = Math.PI * 0.8 + crank + recoil;
        dialAngle = Math.PI * 1.3 + recoil * 1.4;
      }

      // Apply safecracker rotation to central wheel handle
      if (handleRef.current) {
        handleRef.current.rotation.z = handleAngle;
      }

      // Apply synchronized rotation to combination dial disc
      if (wheelRef.current) {
        wheelRef.current.rotation.z = dialAngle;
      }

      // Reset bolts and door to locked state while waiting
      deadboltsRef.current.forEach(({ mesh, basePos }) => {
        mesh.position.copy(basePos);
      });
      if (doorRef.current) doorRef.current.rotation.y = 0;
      openProgressRef.current = 0;

      // Perfectly facing user (0° tilt)
      if (groupRef.current) {
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
      }
    } else {
      // 2. STORY MODE START / UNLOCK SEQUENCE:
      // When story mode starts, the lock finally gives way:
      openProgressRef.current = Math.min(1, openProgressRef.current + delta / 1.5);
      const p = openProgressRef.current;

      // Phase A: Rapid final combination spin (0 to 0.25)
      if (wheelRef.current) {
        wheelRef.current.rotation.z += delta * 16.0;
      }

      // Phase B: Central 8-Spoke Chrome Wheel Handle spins forcefully by -180° to disengage latch (0 to 0.40)
      const handleP = Math.min(1, p / 0.40);
      if (handleRef.current) {
        handleRef.current.rotation.z = -Math.PI * easeOutCubic(handleP);
      }

      // Phase C: 6 Hydraulic Chrome Deadbolts retract into door slab (0.15 to 0.50)
      const boltP = Math.min(1, Math.max(0, (p - 0.15) / 0.35));
      deadboltsRef.current.forEach(({ mesh, basePos, axis, dir }) => {
        const retractDist = 0.14 * easeOutCubic(boltP);
        mesh.position[axis] = basePos[axis] + dir * retractDist;
      });

      // Phase D: Massive Vault Door swings open wide on left crane hinge (-84°) (0.35 to 1.0)
      const doorP = Math.min(1, Math.max(0, (p - 0.35) / 0.65));
      if (doorRef.current) {
        doorRef.current.rotation.y = -Math.PI * 0.47 * easeOutCubic(doorP);
      }

      // Keep clean perspective facing user
      if (groupRef.current) {
        groupRef.current.rotation.y = 0;
        groupRef.current.rotation.x = 0;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      scale={[0.92, 0.92, 0.92]}
      onClick={onToggleOpen}
      style={{ cursor: "pointer" }}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(VAULT_MODEL_URL);

/* ─── Exported Lobby Vault 3D Component ─── */
export default function LobbyVault3D({ isOpening = false }) {
  const [interactiveOpen, setInteractiveOpen] = useState(false);
  const effectiveOpening = isOpening || interactiveOpen;

  return (
    <div className="vault-3d-stage">
      <div
        className="vault-canvas-container"
        title="Interactive 3D Bank Vault: Central wheel cracking. Click to toggle open."
        onClick={() => setInteractiveOpen((prev) => !prev)}
      >
        <Canvas
          shadows
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.98,
          }}
          camera={{ position: [0, 0, 4.3], fov: 40 }}
          className="vault-r3f-canvas"
        >
          {/* Studio Environment for Realistic Metallic Specular Reflections */}
          <StudioEnvironment />

          {/* Balanced Atmospheric Midnight Blue Fill */}
          <ambientLight intensity={0.55} color="#121824" />

          {/* Left Key Neon: Vivid Vice City Electric Magenta (matches vault_neon_bg.jpg left wash) */}
          <directionalLight position={[-3.2, 1.2, 2.5]} intensity={3.4} color="#F84391" />

          {/* Right Key Neon: Vivid Vice City Electric Cyan (matches vault_neon_bg.jpg right wash) */}
          <directionalLight position={[3.2, 1.4, 2.5]} intensity={3.4} color="#00E5FF" />

          {/* Top Center Cool Steel Highlight */}
          <directionalLight position={[0, 3.5, 1.8]} intensity={0.9} color="#C8E4F8" />

          {/* Front Soft Neutral Key (subtle fill to avoid white blowout) */}
          <directionalLight position={[0.2, 1.2, 3.6]} intensity={0.55} color="#FFFFFF" castShadow />

          {/* Interior Gold Bullion Glow (radiates outward when opened) */}
          <pointLight
            position={[0.1, -0.1, -0.3]}
            intensity={effectiveOpening ? 10.0 : 2.0}
            color="#FFC107"
            distance={5.5}
          />

          <Suspense fallback={null}>
            <VaultModel
              isOpening={effectiveOpening}
              onToggleOpen={() => setInteractiveOpen((prev) => !prev)}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
