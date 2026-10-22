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
