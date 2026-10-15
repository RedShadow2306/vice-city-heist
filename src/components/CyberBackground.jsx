/**
 * CyberBackground.jsx  -  GTA Vice City Retrowave Highway & Skyline Backdrop
 * - Layered Vice City skyline background with sunset lighting
 * - Three.js hot-pink & turquoise retrowave perspective grid
 * - Palm tree silhouettes & neon dust particles
 * - Lite FX toggle for battery/performance savings
 */
import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ViceFPSGovernor } from "../utils/fpsGovernor";
import SoundEngine from "../utils/soundEngine";
import { getAssetUrl } from "../utils/assetPath";

const ROAD_SEGS  = 36;
const ROAD_W     = 16;
const ROAD_DEPTH = 220;

function buildVCScene(lite) {
  const scene = new THREE.Scene();

  /* ── sunset sky gradient via canvas texture ── */
  const skyCanvas = document.createElement("canvas");
  skyCanvas.width = 4;
  skyCanvas.height = 256;
  const skyCtx = skyCanvas.getContext("2d");
  const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 256);
  skyGrad.addColorStop(0.0,  "#05060C");
  skyGrad.addColorStop(0.40, "#1F1230");
  skyGrad.addColorStop(0.68, "#45355F");
  skyGrad.addColorStop(0.85, "#F84391");
  skyGrad.addColorStop(1.0,  "#FF806F");
  skyCtx.fillStyle = skyGrad;
  skyCtx.fillRect(0, 0, 4, 256);
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  scene.background = skyTex;

  /* ── horizon line glow (Vice Hotpink / Neon Gold) ── */
  const horizonGeo = new THREE.PlaneGeometry(400, 2.5);
  const horizonMat = new THREE.MeshBasicMaterial({
    color: 0xF84391,
    transparent: true,
    opacity: lite ? 0.45 : 0.85,
  });
  const horizon = new THREE.Mesh(horizonGeo, horizonMat);
  horizon.position.set(0, 0.01, -ROAD_DEPTH * 0.72);
  scene.add(horizon);

  /* ── road grid (hotpink & turquoise perspective lines) ── */
  const roadGroup = new THREE.Group();
  const gridMatV = new THREE.LineBasicMaterial({
    color: lite ? 0xCC2065 : 0xF84391,
    transparent: true,
    opacity: lite ? 0.5 : 0.85,
  });
  const gridMatH = new THREE.LineBasicMaterial({
    color: lite ? 0x228888 : 0x48D5D0,
    transparent: true,
    opacity: lite ? 0.35 : 0.7,
  });

  /* longitudinal lines */
  for (let x = -ROAD_W / 2; x <= ROAD_W / 2; x += ROAD_W / 8) {
    const pts = [new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, 0, -ROAD_DEPTH)];
    roadGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMatV));
  }
  /* horizontal stripes */
  for (let i = 0; i <= ROAD_SEGS; i++) {
    const z = -(i / ROAD_SEGS) * ROAD_DEPTH;
    const pts = [new THREE.Vector3(-ROAD_W / 2, 0, z), new THREE.Vector3(ROAD_W / 2, 0, z)];
    roadGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMatH));
  }
  scene.add(roadGroup);

  /* ── off-road shoulder neon guide lines ── */
  if (!lite) {
    const shoulderMat = new THREE.LineBasicMaterial({
      color: 0x48D5D0,
      transparent: true,
      opacity: 0.4,
    });
    [-ROAD_W / 2 - 4, ROAD_W / 2 + 4].forEach(x => {
      const pts = [new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, 0, -ROAD_DEPTH)];
      roadGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), shoulderMat));
    });
  }

  /* ── city silhouette (wireframe buildings on horizon) ── */
  if (!lite) {
    const bMat = new THREE.MeshBasicMaterial({
      color: 0xF84391,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const bMat2 = new THREE.MeshBasicMaterial({
      color: 0xB8A4EC,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    [
      [-24, 8, -165, 5, 16, 6, bMat],
      [-15, 5, -158, 4, 10, 5, bMat2],
      [-8,  3, -162, 3, 6,  4, bMat],
      [0,   9, -168, 6, 18, 7, bMat],
      [8,   4, -160, 3, 8,  4, bMat2],
      [15,  6, -163, 4, 12, 5, bMat],
      [24,  7, -166, 5, 14, 6, bMat2],
      [-32, 4, -170, 3, 8,  4, bMat2],
      [32,  5, -170, 3, 10, 4, bMat],
    ].forEach(([x, y, z, w, h, d, m]) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
      mesh.position.set(x, h / 2, z);
      scene.add(mesh);
    });
  }

  /* ── palm tree silhouettes ── */
  if (!lite) {
    const palmCanvas = document.createElement("canvas");
    palmCanvas.width = 64;
    palmCanvas.height = 128;
    const pc = palmCanvas.getContext("2d");
    pc.strokeStyle = "#26182F";
    pc.fillStyle = "#26182F";
    /* trunk */
    pc.lineWidth = 5;
    pc.beginPath();
    pc.moveTo(32, 128);
    pc.bezierCurveTo(35, 90, 28, 60, 34, 20);
    pc.stroke();
    /* fronds */
    [[34, 20, 10, 0], [34, 20, 60, 10], [34, 20, 0, 15], [34, 20, 64, 20], [34, 20, 8, 30], [34, 20, 58, 30]].forEach(([ox, oy, tx, ty]) => {
      pc.beginPath();
      pc.moveTo(ox, oy);
      pc.quadraticCurveTo((ox + tx) / 2, (oy + ty) / 2 - 15, tx, ty);
      pc.stroke();
    });
    const palmTex = new THREE.CanvasTexture(palmCanvas);
    const palmMat = new THREE.MeshBasicMaterial({ map: palmTex, transparent: true, side: THREE.DoubleSide, depthWrite: false });
    [[-20, 5, -60], [20, 5, -60], [-24, 6, -100], [24, 6, -100], [-26, 4, -130], [26, 4, -130]].forEach(([x, y, z]) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 16), palmMat);
      mesh.position.set(x, y, z);
      scene.add(mesh);
    });
  }

  /* ── floating neon particles ── */
  const particleCount = lite ? 60 : 220;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pCol = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    pPos[i * 3]     = (Math.random() - 0.5) * 65;
    pPos[i * 3 + 1] = Math.random() * 32 + 1;
    pPos[i * 3 + 2] = -(Math.random() * 190);
    /* alternating Vice City pink / turquoise / gold */
    const t = i % 3;
    if (t === 0) {
      pCol[i * 3] = 0.97; pCol[i * 3 + 1] = 0.26; pCol[i * 3 + 2] = 0.57; // #F84391
    } else if (t === 1) {
      pCol[i * 3] = 0.28; pCol[i * 3 + 1] = 0.84; pCol[i * 3 + 2] = 0.82; // #48D5D0
    } else {
      pCol[i * 3] = 1.0;  pCol[i * 3 + 1] = 0.82; pCol[i * 3 + 2] = 0.40; // #FFD166
    }
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({
    size: lite ? 0.22 : 0.38,
    vertexColors: true,
    transparent: true,
    opacity: lite ? 0.5 : 0.85,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  return { scene, roadGroup, particles };
}

export default function CyberBackground({ onLiteChange }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [lite, setLite] = useState(false);

  const toggleLite = useCallback(() => {
    SoundEngine.init();
    SoundEngine.playClick();
    setLite(prev => {
      const next = !prev;
      stateRef.current.governor?.setLite(next);
      onLiteChange?.(next);
      return next;
    });
  }, [onLiteChange]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: !lite, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1 : 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(65, el.clientWidth / el.clientHeight, 0.1, 350);
    camera.position.set(0, 3.5, 10);
    camera.lookAt(0, 0.5, -40);

    const { scene, roadGroup, particles } = buildVCScene(lite);
    const governor = new ViceFPSGovernor({ lite });
    stateRef.current = { governor, renderer, scene, camera, roadGroup, particles };

    let scrollZ = 0;
    let time = 0;
    const segLength = ROAD_DEPTH / ROAD_SEGS;
    const speed = lite ? 0.055 : 0.085;

    governor.start((_, delta) => {
      const dt = Math.min(delta, 50);
      time += dt * 0.001;
      scrollZ += speed * (dt / 16.67);
      if (scrollZ >= segLength) scrollZ -= segLength;
      roadGroup.position.z = scrollZ;

      if (!lite) {
        const pos = particles.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          pos.setY(i, pos.getY(i) + Math.sin(time * 0.8 + i) * 0.003);
        }
        pos.needsUpdate = true;
      }

      camera.position.x = Math.sin(time * 0.3) * 0.35;
      renderer.render(scene, camera);
    });

    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      governor.stop();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [lite]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* Authentic Vice City Skyline Image Layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${getAssetUrl("/images/vice-hero.jpg")}')`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          opacity: 0.28,
          filter: "saturate(1.3) contrast(1.15) brightness(0.75)",
          mixBlendMode: "screen",
          transform: "scale(1.04)",
          transition: "transform 10s ease-out",
        }}
      />

      {/* Atmospheric sunset horizon gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 65%, rgba(248, 67, 145, 0.18) 0%, rgba(38, 24, 47, 0.85) 75%, rgba(5, 6, 12, 0.96) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* Three.js Retrowave Grid Canvas */}
      <div ref={mountRef} style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }} />

      {/* Lite FX toggle button */}
      <button
        id="lite-fx-toggle"
        onClick={toggleLite}
        style={{
          position: "fixed",
          bottom: 18,
          right: 18,
          zIndex: 9999,
          pointerEvents: "all",
          background: lite ? "rgba(248,67,145,0.22)" : "rgba(38,24,47,0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: `1px solid ${lite ? "#F84391" : "rgba(248,67,145,0.3)"}`,
          color: lite ? "#F84391" : "rgba(255,242,227,0.7)",
          borderRadius: 6,
          padding: "6px 14px",
          fontSize: 11,
          fontFamily: "var(--font-mono, monospace)",
          cursor: "pointer",
          letterSpacing: "0.1em",
          transition: "all 0.25s",
          boxShadow: lite ? "0 0 14px rgba(248,67,145,0.4)" : "none",
        }}
        title={lite ? "Disable Lite FX" : "Enable Lite FX (low power)"}
      >
        {lite ? "⚡ LITE FX: ON" : "💡 LITE FX: OFF"}
      </button>
    </div>
  );
}
