import React, { useState, useEffect, useMemo, useCallback } from "react";
import SoundEngine from "../utils/soundEngine";

/**
 * VaultPuzzleVisuals.jsx
 * High-tech cyberpunk visual puzzle widgets for 2-Player Duo Vault Defense:
 * - Visual Distorted Security CAPTCHA
 * - Visual Electronics Resistor Color-Band Decoder
 * - Visual Digital Logic Gate Circuit Schematic
 * - Visual Optical Swatch Sensor Calibration Tile
 * - Visual Hardware MAC Address Format Guide (with Demo Blacklist alert)
 */

export function VisualCaptcha({ token = "VD79K" }) {
  const chars = [...(token || "VD79K")];
  // Deterministic pseudo-random offsets based on char codes
  const offsets = chars.map((ch, idx) => {
    const code = ch.charCodeAt(0);
    const rot = ((code * 7 + idx * 13) % 25) - 12; // -12 to +13 deg
    const yShift = ((code * 3 + idx * 5) % 10) - 5; // -5 to +5 px
    const isPink = (code + idx) % 2 === 0;
    return { ch, rot, yShift, color: isPink ? "#f84391" : "#48d5d0" };
  });

  return (
    <div className="vault-visual-card visual-captcha-card">
      <div className="visual-card-header">
        <span className="visual-card-badge">🔐 OPTICAL MATRIX // CAM-04 CAPTCHA</span>
        <span className="visual-card-tag">VERIFICATION TOKEN</span>
      </div>

      <div className="visual-captcha-stage">
        <svg
          viewBox="0 0 240 60"
          className="visual-captcha-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="captcha-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(72, 213, 208, 0.15)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="captcha-bg-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#080c16" />
              <stop offset="50%" stopColor="#0d1424" />
              <stop offset="100%" stopColor="#080c16" />
            </linearGradient>
            <linearGradient id="strike-grad-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#f84391" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#48d5d0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="strike-grad-2" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffd166" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#f84391" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="240" height="60" fill="url(#captcha-bg-grad)" rx="6" />
          <rect width="240" height="60" fill="url(#captcha-grid)" rx="6" />

          {/* Security noise lines */}
          <path
            d="M 10 32 Q 60 12, 120 35 T 230 25"
            fill="none"
            stroke="url(#strike-grad-1)"
            strokeWidth="1.8"
          />
          <path
            d="M 15 18 Q 75 48, 140 18 T 225 42"
            fill="none"
            stroke="url(#strike-grad-2)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <line x1="20" y1="48" x2="220" y2="12" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />

          {/* Random noise dots */}
          {[18, 42, 70, 95, 125, 155, 185, 210].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={15 + ((i * 17) % 30)}
              r={(i % 2 === 0 ? 1.5 : 2)}
              fill={i % 3 === 0 ? "#48d5d0" : "#f84391"}
              opacity="0.45"
            />
          ))}

          {/* Render Characters */}
          {offsets.map((item, idx) => {
            const xPos = 36 + idx * 38;
            const yPos = 38 + item.yShift;
            return (
              <text
                key={idx}
                x={xPos}
                y={yPos}
                fill={item.color}
                fontSize="26"
                fontWeight="900"
                fontFamily="'Courier New', monospace"
                textAnchor="middle"
                transform={`rotate(${item.rot}, ${xPos}, ${yPos})`}
                style={{
                  filter: `drop-shadow(0 0 6px ${item.color})`,
                  letterSpacing: "2px",
                }}
              >
                {item.ch}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="visual-card-footer">
        <span className="captcha-instruction">
          👀 Transcribe the 5 security characters above into your master cipher!
        </span>
      </div>
    </div>
  );
}

export function VisualResistor({ resistor }) {
  if (!resistor) return null;
  const bands = resistor.bands || ["Red", "Red", "Brown", "Gold"];
  const colors = resistor.bandColors || ["#e53935", "#e53935", "#8d6e63", "#ffd700"];

  return (
    <div className="vault-visual-card visual-resistor-card">
      <div className="visual-card-header">
        <span className="visual-card-badge">⚡ CIRCUIT HARDWARE // RESISTOR DECODER</span>
        <span className="visual-card-tag">4-BAND AXIAL RESISTOR</span>
      </div>

      <div className="visual-resistor-stage">
        <svg
          viewBox="0 0 280 64"
          className="visual-resistor-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lead-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b0bec5" />
              <stop offset="50%" stopColor="#eceff1" />
              <stop offset="100%" stopColor="#78909c" />
            </linearGradient>
            <linearGradient id="body-tan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d7ccc8" />
              <stop offset="40%" stopColor="#f5f5f5" />
              <stop offset="100%" stopColor="#bcaaa4" />
            </linearGradient>
          </defs>

          {/* Metal Wire Leads */}
          <rect x="10" y="29" width="60" height="6" fill="url(#lead-metal)" rx="2" />
          <rect x="210" y="29" width="60" height="6" fill="url(#lead-metal)" rx="2" />

          {/* Resistor Body */}
          <path
            d="M 68 20 C 68 14, 76 14, 82 18 L 198 18 C 204 14, 212 14, 212 20 L 212 44 C 212 50, 204 50, 198 46 L 82 46 C 76 50, 68 50, 68 44 Z"
            fill="url(#body-tan)"
            stroke="#5d4037"
            strokeWidth="1.2"
          />

          {/* Band 1 */}
          <rect x="88" y="18" width="10" height="28" fill={colors[0]} rx="1" />
          {/* Band 2 */}
          <rect x="114" y="18" width="10" height="28" fill={colors[1]} rx="1" />
          {/* Band 3 (Multiplier) */}
          <rect x="140" y="18" width="10" height="28" fill={colors[2]} rx="1" />
          {/* Band 4 (Tolerance - Spaced apart) */}
          <rect x="182" y="18" width="10" height="28" fill={colors[3]} rx="1" />
        </svg>

        <div className="resistor-bands-labels">
          <span className="resistor-band-pill" style={{ borderColor: colors[0], color: colors[0] }}>
            1st: {bands[0]}
          </span>
          <span className="resistor-band-pill" style={{ borderColor: colors[1], color: colors[1] }}>
            2nd: {bands[1]}
          </span>
          <span className="resistor-band-pill" style={{ borderColor: colors[2], color: colors[2] }}>
            Mult: {bands[2]}
          </span>
          <span className="resistor-band-pill" style={{ borderColor: colors[3], color: colors[3] }}>
            Tol: {bands[3]}
          </span>
        </div>
      </div>

      <div className="visual-card-footer">
        <span className="resistor-hint-formula">
          📐 Formula: (Band 1 · Band 2) × Multiplier = Resistance (Ω). Include resistance in your password!
        </span>
      </div>
    </div>
  );
}

export function VisualLogicCircuit({ circuit }) {
  if (!circuit) return null;

  return (
    <div className="vault-visual-card visual-circuit-card">
      <div className="visual-card-header">
        <span className="visual-card-badge">🧩 DIGITAL LOGIC GATE // TRUTH CIRCUIT</span>
        <span className="visual-card-tag">VOLTAGE SCHEMATIC</span>
      </div>

      <div className="visual-circuit-stage">
        <svg
          viewBox="0 0 280 76"
          className="visual-circuit-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Input Line A */}
          <line x1="20" y1="24" x2="90" y2="24" stroke="#48d5d0" strokeWidth="2.5" />
          <circle cx="20" cy="24" r="4" fill="#48d5d0" />
          <text x="30" y="18" fill="#48d5d0" fontSize="12" fontWeight="800" fontFamily="monospace">
            IN A = {circuit.inputA}
          </text>

          {/* Input Line B */}
          <line x1="20" y1="52" x2="90" y2="52" stroke="#48d5d0" strokeWidth="2.5" />
          <circle cx="20" cy="52" r="4" fill="#48d5d0" />
          <text x="30" y="68" fill="#48d5d0" fontSize="12" fontWeight="800" fontFamily="monospace">
            IN B = {circuit.inputB}
          </text>

          {/* Logic Gate Box with Cyberpunk styling */}
          <rect
            x="90"
            y="12"
            width="88"
            height="52"
            rx="8"
            fill="rgba(10, 20, 36, 0.9)"
            stroke="#f84391"
            strokeWidth="2"
            style={{ filter: "drop-shadow(0 0 8px rgba(248, 67, 145, 0.5))" }}
          />

          <text x="134" y="36" fill="#f84391" fontSize="13" fontWeight="900" fontFamily="monospace" textAnchor="middle">
            [GATE ?]
          </text>
          <text x="134" y="52" fill="#ffd166" fontSize="11" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">
            IDENTIFY ME
          </text>

          {/* Inversion bubble if applicable */}
          {circuit.gateName?.startsWith("N") && (
            <circle cx="182" cy="38" r="4" fill="none" stroke="#f84391" strokeWidth="2" />
          )}

          {/* Output Line Q */}
          <line x1={circuit.gateName?.startsWith("N") ? "186" : "178"} y1="38" x2="250" y2="38" stroke="#00e676" strokeWidth="2.5" />
          <circle cx="250" cy="38" r="4" fill="#00e676" />
          <text x="200" y="28" fill="#00e676" fontSize="13" fontWeight="900" fontFamily="monospace">
            OUT Q = {circuit.output}
          </text>
        </svg>
      </div>

      <div className="visual-card-footer">
        <span className="circuit-instruction">
          💡 What boolean logic gate produces Output Q = {circuit.output} for Input A = {circuit.inputA} and Input B = {circuit.inputB}?
        </span>
      </div>
    </div>
  );
}

export function VisualSwatchCard({ swatch }) {
  if (!swatch) return null;

  return (
    <div className="vault-visual-card visual-swatch-card">
      <div className="visual-card-header">
        <span className="visual-card-badge">🎨 OPTICAL SENSOR // COLOR SPECTRUM</span>
        <span className="visual-card-tag">{swatch.name || "CALIBRATION"}</span>
      </div>

      <div className="visual-swatch-stage">
        <div className="swatch-color-chip-large" style={{ backgroundColor: swatch.css }}>
          <div className="swatch-chip-gloss" />
          <span className="swatch-laser-target">⌖</span>
        </div>

        <div className="swatch-info-panel">
          <div className="swatch-info-row">
            <span className="swatch-info-label">OPTICAL COLOR:</span>
            <span className="swatch-info-name">{swatch.name}</span>
          </div>
          <div className="swatch-info-row">
            <span className="swatch-info-label">SENSOR STATUS:</span>
            <span className="swatch-info-code" style={{ color: "#ffd166" }}>CALIBRATE [ #RGB ]</span>
          </div>
          <div className="swatch-spectrum-bar">
            <span className="spectrum-step" style={{ background: "#ff0055" }} />
            <span className="spectrum-step" style={{ background: "#ffaa00" }} />
            <span className="spectrum-step" style={{ background: "#00ffcc" }} />
            <span className="spectrum-step" style={{ background: "#9900ff" }} />
            <span className="spectrum-step" style={{ background: swatch.css, border: "2px solid #fff" }} />
          </div>
        </div>
      </div>

      <div className="visual-card-footer">
        <span className="swatch-instruction">
          🔎 Calibrate the optical sensor: Determine the 3-character hex code for this color tile and include it in your cipher!
        </span>
      </div>
    </div>
  );
}

export function VisualMacGuide() {
  return (
    <div className="vault-visual-card visual-mac-card">
      <div className="visual-card-header">
        <span className="visual-card-badge">🌐 NIC LAYER // PHYSICAL HARDWARE MAC</span>
        <span className="visual-card-tag">IEEE 802 48-BIT</span>
      </div>

      <div className="visual-mac-stage">
        <div className="mac-format-display">
          <span className="mac-byte">XX</span>
          <span className="mac-sep">:</span>
          <span className="mac-byte">XX</span>
          <span className="mac-sep">:</span>
          <span className="mac-byte">XX</span>
          <span className="mac-sep">:</span>
          <span className="mac-byte">XX</span>
          <span className="mac-sep">:</span>
          <span className="mac-byte">XX</span>
          <span className="mac-sep">:</span>
          <span className="mac-byte">XX</span>
        </div>

        <div className="mac-blacklist-alert">
          <span className="blacklist-icon">⛔</span>
          <span className="blacklist-text">
            <strong>DEMO ADDRESS BLACKLISTED:</strong> Do NOT type <code>00:1A:2B:3C:4D:5E</code> from the hint! You must supply your own unique hardware hex MAC address!
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Interactive Ventilation Duct Maze Reconnaissance Mini-Game ─── */
const DUCT_GRAPH = {
  A: {
    id: "A",
    name: "Point A (Intake Grate)",
    subtitle: "Drone Entry Airlock",
    x: 45,
    y: 115,
    type: "start",
    connections: [
      { dir: "NORTH", key: "1", label: "Upper Vent Shaft [N1]", target: "J1", desc: "Upward toward air conditioning intake" },
      { dir: "EAST",  key: "2", label: "Central Mixing Duct [E1]", target: "J2", desc: "Direct path into main mixing junction" },
      { dir: "SOUTH", key: "3", label: "Lower Service Conduit [S1]", target: "J3", desc: "Downward toward utility pipes" },
    ],
  },
  J1: {
    id: "J1",
    name: "Junction 1 · Upper Filter Grate",
    subtitle: "High-Pressure Airflow Chamber",
    x: 135,
    y: 45,
    type: "junction",
    connections: [
      { dir: "EAST",  key: "1", label: "Cooling Overpass [E2]", target: "J4", desc: "Lead duct across the upper ceiling" },
      { dir: "SOUTH", key: "2", label: "Vertical Filter Shaft [S2]", target: "J2", desc: "Cross-link to central duct" },
      { dir: "WEST",  key: "3", label: "Retreat to Point A [W1]", target: "A", desc: "Back to starting entry airlock" },
    ],
  },
  J2: {
    id: "J2",
    name: "Junction 2 · Central Mixing Duct",
    subtitle: "Main Air Distribution Hub",
    x: 135,
    y: 115,
    type: "junction",
    connections: [
      { dir: "EAST",  key: "1", label: "High-Velocity Exhaust Duct [E3]", target: "HAZARD_FAN", desc: "Turbulent airflow roaring ahead" },
      { dir: "NORTH", key: "2", label: "Up to Upper Filter [N2]", target: "J1", desc: "Upward link to upper ceiling" },
      { dir: "SOUTH", key: "3", label: "Down to Service Conduit [S3]", target: "J3", desc: "Downward link to lower utilities" },
      { dir: "WEST",  key: "4", label: "Retreat to Point A [W2]", target: "A", desc: "Back to starting entry airlock" },
    ],
  },
  J3: {
    id: "J3",
    name: "Junction 3 · Lower Service Conduit",
    subtitle: "Sub-Floor Utility Chamber",
    x: 135,
    y: 185,
    type: "junction",
    connections: [
      { dir: "EAST",  key: "1", label: "Sub-Floor Air Passage [E4]", target: "J5", desc: "Quiet duct below floor level" },
      { dir: "NORTH", key: "2", label: "Up to Central Mixing [N3]", target: "J2", desc: "Climb up to central hub" },
      { dir: "WEST",  key: "3", label: "Retreat to Point A [W3]", target: "A", desc: "Back to starting entry airlock" },
    ],
  },
  J4: {
    id: "J4",
    name: "Junction 4 · Reinforced Duct Airlock",
    subtitle: "Ceiling Overpass Chamber",
    x: 235,
    y: 45,
    type: "junction",
    connections: [
      { dir: "EAST",  key: "1", label: "Vault Ventilation Intake [E5]", target: "B", desc: "Direct route into Safe Deposit Vault #88!" },
      { dir: "SOUTH", key: "2", label: "Maintenance Access Hatch [S4]", target: "HAZARD_LASER", desc: "Red flashing reflection visible below" },
      { dir: "WEST",  key: "3", label: "Back to Junction 1 [W4]", target: "J1", desc: "Return to upper filter chamber" },
    ],
  },
  J5: {
    id: "J5",
    name: "Junction 5 · Drainage Bypass Shaft",
    subtitle: "Secondary Vault Ventilation Link",
    x: 235,
    y: 185,
    type: "junction",
    connections: [
      { dir: "EAST",  key: "1", label: "Vault Air Exhaust Grille [E6]", target: "B", desc: "Opens directly behind Vault Deposit Box #88!" },
      { dir: "WEST",  key: "2", label: "Back to Junction 3 [W5]", target: "J3", desc: "Return to lower service conduit" },
    ],
  },
  HAZARD_FAN: {
    id: "HAZARD_FAN",
    name: "⚠️ INDUSTRIAL EXHAUST TURBINE",
    subtitle: "HAZARD // PATH BLOCKED",
    x: 235,
    y: 115,
    type: "hazard",
    hazardTitle: "SPINNING INDUSTRIAL FAN (1,800 RPM) BLOCKED!",
    hazardMsg: "Turbine blades will shred the fiber camera! Path blocked. Reverse thrusters back to Junction 2!",
    returnNode: "J2",
  },
  HAZARD_LASER: {
    id: "HAZARD_LASER",
    name: "⚠️ SECURITY LASER TRIPWIRE",
    subtitle: "HAZARD // ALARM DETECTED",
    x: 235,
    y: 115,
    type: "hazard",
    hazardTitle: "INFRARED SECURITY LASER GRID ACTIVE!",
    hazardMsg: "Sensors detected high-frequency tripwire beams. Advance halted to avoid alarm. Retreat to Junction 4!",
    returnNode: "J4",
  },
  B: {
    id: "B",
    name: "Point B · Safe Deposit Vault Vent",
    subtitle: "TARGET // EMERGENCY SLIP #88",
    x: 335,
    y: 115,
    type: "target",
    slipTitle: "CLASSIFIED EMERGENCY OVERRIDE SLIP #88",
  },
};

export function VisualDuctMaze({ mazeData, onCodeDiscovered, standalone = false }) {
  const secretCodeword = mazeData?.secretWord || "VENT_BYPASS";
  const storageKey = `vch_duct_maze_${secretCodeword}`;

  const [currentNodeId, setCurrentNodeId] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? JSON.parse(saved).node || "A" : "A";
    } catch (_) {
      return "A";
    }
  });

  const [discovered, setDiscovered] = useState(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      return saved ? Boolean(JSON.parse(saved).discovered) : false;
    } catch (_) {
      return false;
    }
  });

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const currentNode = DUCT_GRAPH[currentNodeId] || DUCT_GRAPH.A;
  const isTimeExpired = timeLeft <= 0 && !discovered;

  // 60-Second Countdown Timer
  useEffect(() => {
    if (discovered || !isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          SoundEngine.playAlert();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [discovered, isTimerRunning]);

  // Persist state
  const saveState = useCallback((node, isDisc) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ node, discovered: isDisc }));
    } catch (_) {}
  }, [storageKey]);

  // Navigate to target node
  const handleNavigate = (targetId) => {
    if (isTimeExpired) return;
    const nextNode = DUCT_GRAPH[targetId];
    if (!nextNode) return;

    if (nextNode.type === "hazard") {
      SoundEngine.playAlert();
      setCurrentNodeId(targetId);
      saveState(targetId, discovered);
      return;
    }

    if (nextNode.type === "target") {
      SoundEngine.playSuccess();
      setCurrentNodeId("B");
      setDiscovered(true);
      setIsTimerRunning(false);
      saveState("B", true);
      if (onCodeDiscovered) onCodeDiscovered(secretCodeword);
      return;
    }

    SoundEngine.playClick();
    setCurrentNodeId(targetId);
    saveState(targetId, discovered);
  };

  const handleRetreat = (targetId) => {
    SoundEngine.playClick();
    setCurrentNodeId(targetId);
    saveState(targetId, discovered);
  };

  const handleReset = () => {
    SoundEngine.playClick();
    setCurrentNodeId("A");
    setTimeLeft(60);
    setIsTimerRunning(true);
    saveState("A", discovered);
  };

  const handleCopyCodeword = () => {
    SoundEngine.playClick();
    try {
      navigator.clipboard.writeText(secretCodeword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Keyboard controls for 1, 2, 3, 4
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || isTimeExpired) return;
      if (currentNode.connections) {
        const match = currentNode.connections.find(c => c.key === e.key);
        if (match) {
          e.preventDefault();
          handleNavigate(match.target);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentNode, isTimeExpired]);

  return (
    <div className={`vault-visual-card visual-duct-card ${standalone ? "standalone-maze-card" : ""}`}>
      <div className="visual-card-header">
        <div className="visual-header-left">
          <span className="visual-card-badge">🌀 DUCT RECON // FIBER-OPTIC PROBE</span>
          <span className="visual-card-tag">AIRLOCK BLUEPRINT</span>
        </div>
        {!standalone && (
          <a
            href="#/maze"
            target="_blank"
            rel="noopener noreferrer"
            className="duct-expand-link"
            title="Open expanded full-screen ventilation blueprint"
          >
            EXPAND MAZE ↗
          </a>
        )}
      </div>

      {/* SVG Duct Schematic Blueprint */}
      <div className="visual-duct-stage">
        <svg
          viewBox="0 0 380 230"
          className="visual-duct-svg"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="duct-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(72, 213, 208, 0.08)" strokeWidth="0.5" />
            </pattern>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glow-pink" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Blueprint Dark Background & Grid */}
          <rect width="380" height="230" fill="#080e18" rx="8" />
          <rect width="380" height="230" fill="url(#duct-grid)" rx="8" />

          {/* Duct Tunnel Steel Envelopes (Thick Background Pipes) */}
          {/* A -> J1 */}
          <path d="M 45 115 L 45 45 L 135 45" fill="none" stroke="#102236" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          {/* A -> J2 */}
          <line x1="45" y1="115" x2="135" y2="115" stroke="#102236" strokeWidth="18" strokeLinecap="round" />
          {/* A -> J3 */}
          <path d="M 45 115 L 45 185 L 135 185" fill="none" stroke="#102236" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          {/* J1 -> J2 */}
          <line x1="135" y1="45" x2="135" y2="115" stroke="#102236" strokeWidth="18" strokeLinecap="round" />
          {/* J2 -> J3 */}
          <line x1="135" y1="115" x2="135" y2="185" stroke="#102236" strokeWidth="18" strokeLinecap="round" />
          {/* J1 -> J4 */}
          <line x1="135" y1="45" x2="235" y2="45" stroke="#102236" strokeWidth="18" strokeLinecap="round" />
          {/* J2 -> HAZARD_FAN */}
          <line x1="135" y1="115" x2="235" y2="115" stroke="#2a1622" strokeWidth="18" strokeLinecap="round" />
          {/* J3 -> J5 */}
          <line x1="135" y1="185" x2="235" y2="185" stroke="#102236" strokeWidth="18" strokeLinecap="round" />
          {/* J4 -> HAZARD_LASER */}
          <line x1="235" y1="45" x2="235" y2="115" stroke="#2a1622" strokeWidth="18" strokeLinecap="round" />
          {/* J4 -> B */}
          <path d="M 235 45 L 335 45 L 335 115" fill="none" stroke="#102236" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          {/* J5 -> B */}
          <path d="M 235 185 L 335 185 L 335 115" fill="none" stroke="#102236" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />

          {/* Neon Airflow Interior Centerlines */}
          <path d="M 45 115 L 45 45 L 135 45" fill="none" stroke="rgba(72, 213, 208, 0.45)" strokeWidth="3" strokeDasharray="4,4" />
          <line x1="45" y1="115" x2="135" y2="115" stroke="rgba(72, 213, 208, 0.45)" strokeWidth="3" strokeDasharray="4,4" />
          <path d="M 45 115 L 45 185 L 135 185" fill="none" stroke="rgba(72, 213, 208, 0.45)" strokeWidth="3" strokeDasharray="4,4" />
          <line x1="135" y1="45" x2="135" y2="115" stroke="rgba(72, 213, 208, 0.45)" strokeWidth="3" strokeDasharray="4,4" />
          <line x1="135" y1="115" x2="135" y2="185" stroke="rgba(72, 213, 208, 0.45)" strokeWidth="3" strokeDasharray="4,4" />
          <line x1="135" y1="45" x2="235" y2="45" stroke="rgba(72, 213, 208, 0.45)" strokeWidth="3" strokeDasharray="4,4" />
          <line x1="135" y1="115" x2="235" y2="115" stroke="rgba(248, 67, 145, 0.55)" strokeWidth="3" strokeDasharray="3,3" />
          <line x1="135" y1="185" x2="235" y2="185" stroke="rgba(72, 213, 208, 0.45)" strokeWidth="3" strokeDasharray="4,4" />
          <line x1="235" y1="45" x2="235" y2="115" stroke="rgba(248, 67, 145, 0.55)" strokeWidth="3" strokeDasharray="3,3" />
          <path d="M 235 45 L 335 45 L 335 115" fill="none" stroke="rgba(255, 209, 102, 0.55)" strokeWidth="3" strokeDasharray="4,4" />
          <path d="M 235 185 L 335 185 L 335 115" fill="none" stroke="rgba(255, 209, 102, 0.55)" strokeWidth="3" strokeDasharray="4,4" />

          {/* Node Circles */}
          {/* Junction 1 */}
          <circle cx="135" cy="45" r="9" fill="#0d1b2a" stroke="#48d5d0" strokeWidth="2" />
          <text x="135" y="48" fill="#48d5d0" fontSize="8" fontWeight="800" textAnchor="middle">J1</text>
          
          {/* Junction 2 */}
          <circle cx="135" cy="115" r="9" fill="#0d1b2a" stroke="#48d5d0" strokeWidth="2" />
          <text x="135" y="118" fill="#48d5d0" fontSize="8" fontWeight="800" textAnchor="middle">J2</text>

          {/* Junction 3 */}
          <circle cx="135" cy="185" r="9" fill="#0d1b2a" stroke="#48d5d0" strokeWidth="2" />
          <text x="135" y="188" fill="#48d5d0" fontSize="8" fontWeight="800" textAnchor="middle">J3</text>

          {/* Junction 4 */}
          <circle cx="235" cy="45" r="9" fill="#0d1b2a" stroke="#48d5d0" strokeWidth="2" />
          <text x="235" y="48" fill="#48d5d0" fontSize="8" fontWeight="800" textAnchor="middle">J4</text>

          {/* Junction 5 */}
          <circle cx="235" cy="185" r="9" fill="#0d1b2a" stroke="#48d5d0" strokeWidth="2" />
          <text x="235" y="188" fill="#48d5d0" fontSize="8" fontWeight="800" textAnchor="middle">J5</text>

          {/* Hazard Dead Ends */}
          <circle cx="235" cy="115" r="11" fill="#2d0d19" stroke="#f84391" strokeWidth="2" />
          <text x="235" y="118" fill="#f84391" fontSize="10" fontWeight="900" textAnchor="middle">⚠️</text>

          {/* Point A (Start Node) */}
          <circle cx="45" cy="115" r="14" fill="#0b242e" stroke="#48d5d0" strokeWidth="3" filter="url(#glow-cyan)" />
          <text x="45" y="119" fill="#48d5d0" fontSize="11" fontWeight="900" textAnchor="middle">A</text>
          <text x="45" y="142" fill="#48d5d0" fontSize="8" fontWeight="800" textAnchor="middle">ENTRY</text>

          {/* Point B (Target Node / Slip Box) */}
          <circle cx="335" cy="115" r="15" fill="#292008" stroke="#ffd166" strokeWidth="3" style={{ filter: "drop-shadow(0 0 8px rgba(255, 209, 102, 0.7))" }} />
          <text x="335" y="119" fill="#ffd166" fontSize="11" fontWeight="900" textAnchor="middle">B</text>
          <text x="335" y="142" fill="#ffd166" fontSize="8" fontWeight="800" textAnchor="middle">SLIP #88</text>

          {/* Current Probe Marker (Glowing Animated Dot) */}
          <circle
            cx={currentNode.x}
            cy={currentNode.y}
            r="8"
            fill="#f84391"
            stroke="#ffffff"
            strokeWidth="2"
            filter="url(#glow-pink)"
          >
            <animate attributeName="r" values="7;11;7" dur="1.4s" repeatCount="indefinite" />
          </circle>
          <circle
            cx={currentNode.x}
            cy={currentNode.y}
            r="16"
            fill="none"
            stroke="#f84391"
            strokeWidth="1.2"
            opacity="0.6"
          >
            <animate attributeName="r" values="12;24;12" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Bank Manager Narrative Mission Briefing */}
      <div className="duct-manager-story-card">
        <div className="duct-manager-story-header">
          <span className="duct-manager-avatar">👔</span>
          <span className="duct-manager-speaker">BANK MANAGER GORDON BENNETT // COMMS:</span>
        </div>
        <div className="duct-manager-story-text">
          {discovered ? (
            <span style={{ color: "#00e676" }}>
              "Exceptional work, operative! You navigated the ducts and retrieved Slip #88 from my office desk before the airlocks sealed! Transcribe that recovered codeword into your master cipher!"
            </span>
          ) : isTimeExpired ? (
            <span style={{ color: "#f84391" }}>
              "Time expired, agent! The pneumatic airlocks cycled shut! Reboot the camera drone and re-attempt the run before Tommy's hackers breach the system!"
            </span>
          ) : (
            <span>
              "Rookie! There's an emergency override slip inside my Executive Office (Point B) containing our vault's secret bypass word! The ventilation airlocks cycle in <strong>60 seconds</strong>—pilot the drone through the duct junctions to my office desk and fetch it before the doors lock down!"
            </span>
          )}
        </div>
      </div>

      {/* 60-Second Mission Timer Bar */}
      <div className={`duct-timer-container ${timeLeft <= 10 && !discovered ? "danger-pulse" : ""}`}>
        <div className="duct-timer-header">
          <span className="duct-timer-label">
            {discovered ? "✓ OBJECTIVE SECURED IN TIME" : isTimeExpired ? "🚨 AIRLOCK LOCKDOWN ACTIVE" : "⏱️ AIRLOCK PURGE COUNTDOWN"}
          </span>
          <span className="duct-timer-clock">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>
        <div className="duct-timer-track">
          <div
            className={`duct-timer-fill ${timeLeft <= 15 ? "danger" : timeLeft <= 30 ? "warning" : ""}`}
            style={{ width: `${(Math.max(0, timeLeft) / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Interactive Directional Console */}
      <div className="duct-console-panel">
        {/* Status Header */}
        <div className="duct-status-bar">
          <span className="duct-pos-label">PROBE POSITION:</span>
          <span className="duct-pos-name">{currentNode.name}</span>
          <span className="duct-pos-sub"> · {currentNode.subtitle}</span>
        </div>

        {/* TIME EXPIRED STATE */}
        {isTimeExpired && (
          <div className="duct-hazard-box" style={{ borderColor: "#f84391" }}>
            <div className="duct-hazard-title">🚨 AIRLOCK LOCKDOWN TIMEOUT!</div>
            <div className="duct-hazard-msg">
              The 60-second ventilation window elapsed and pneumatic blast gates sealed the duct. You must re-launch the probe to try the run again.
            </div>
            <button
              type="button"
              className="duct-retreat-btn"
              style={{ background: "#48d5d0", color: "#081018" }}
              onClick={handleReset}
            >
              ↺ RE-LAUNCH PROBE AT POINT A (60s RESET)
            </button>
          </div>
        )}

        {/* HAZARD STATE */}
        {!isTimeExpired && currentNode.type === "hazard" && (
          <div className="duct-hazard-box">
            <div className="duct-hazard-title">{currentNode.hazardTitle}</div>
            <div className="duct-hazard-msg">{currentNode.hazardMsg}</div>
            <button
              type="button"
              className="duct-retreat-btn"
              onClick={() => handleRetreat(currentNode.returnNode)}
            >
              ↩ RETREAT PROBE TO SAFETY [{currentNode.returnNode}]
            </button>
          </div>
        )}

        {/* POINT B OBJECTIVE CLEARED SLIP */}
        {currentNode.type === "target" && (
          <div className="duct-slip-unlocked-card">
            <div className="duct-slip-header">
              <span className="duct-slip-badge">📜 CLASSIFIED BANK VAULT MEMORANDUM</span>
              <span className="duct-slip-dept">SECURITY DIVISION · COMPARTMENT #88</span>
            </div>
            <div className="duct-slip-body">
              <div className="duct-slip-intro">
                "Agent, you retrieved the emergency override voucher. Transcribe the codeword below directly into your cipher to satisfy the directive!"
              </div>
              <div className="duct-slip-codeword-box">
                <span className="duct-slip-code-label">RECOVERED CODEWORD:</span>
                <span className="duct-slip-code-val">{secretCodeword}</span>
              </div>
            </div>
            <div className="duct-slip-actions">
              <button
                type="button"
                className={`duct-copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyCodeword}
              >
                {copied ? "✓ CODEWORD COPIED!" : "📋 COPY CODEWORD TO CIPHER"}
              </button>
              <button
                type="button"
                className="duct-reset-btn"
                onClick={handleReset}
              >
                ↺ RE-NAVIGATE MAZE
              </button>
            </div>
          </div>
        )}

        {/* JUNCTION PATHWAY SELECTION */}
        {currentNode.connections && currentNode.connections.length > 0 && (
          <div className="duct-choices-section">
            <div className="duct-choices-heading">
              SELECT DUCT PATHWAY TO ADVANCE PROBE:
            </div>
            <div className="duct-button-grid">
              {currentNode.connections.map((conn) => (
                <button
                  key={conn.target + conn.dir}
                  type="button"
                  className="duct-path-btn"
                  onClick={() => handleNavigate(conn.target)}
                >
                  <div className="duct-btn-key">[{conn.key}] {conn.dir}</div>
                  <div className="duct-btn-label">{conn.label}</div>
                  <div className="duct-btn-desc">{conn.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="visual-card-footer">
        <span className="duct-footer-tip">
          {discovered
            ? `✅ Objective Accomplished! Secret codeword "${secretCodeword}" recovered. Type it into your master password!`
            : "🎯 Heist Mission: Pilot the camera probe from Point A to Point B to recover Tommy's hidden security override slip!"}
        </span>
      </div>
    </div>
  );
}
