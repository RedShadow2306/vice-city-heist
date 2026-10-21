import React, { useState, useEffect } from "react";
import { VisualDuctMaze } from "../components/VaultPuzzleVisuals";
import { getSessionData } from "../utils/gameRules";
import DaemonLogo from "../components/DaemonLogo";
import "./PlayerTerminal.css";

export default function DuctMazePage() {
  const [session, setSession] = useState(() => getSessionData() || {});
  const [discoveredCode, setDiscoveredCode] = useState(null);

  useEffect(() => {
    const handleStorage = () => {
      setSession(getSessionData() || {});
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const mazeData = session?.ductMaze || {
    id: "maze_slip_01",
    secretWord: "VENT_BYPASS",
    slipId: "#88",
  };

  return (
    <div className="duct-standalone-page" style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 50% 20%, #0d1b2e 0%, #060911 100%)",
      color: "#ffffff",
      padding: "24px 16px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      fontFamily: "var(--font-sans, sans-serif)",
    }}>
      {/* Header Banner */}
      <div style={{
        maxWidth: "680px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(72, 213, 208, 0.3)",
        paddingBottom: "12px",
        marginBottom: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <DaemonLogo size="xs" />
          <div>
            <div style={{
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontSize: "14px",
              fontWeight: 900,
              color: "#48d5d0",
              letterSpacing: "1px",
            }}>
              VENTILATION DUCT RECON // EXPANDED TACTICAL VIEW
            </div>
            <div style={{ fontSize: "11px", color: "#8899aa" }}>
              Bank of Vice City · Main Safe Deposit Airlocks (Floor 02)
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => window.close()}
          style={{
            background: "rgba(248, 67, 145, 0.2)",
            border: "1px solid #f84391",
            color: "#f84391",
            padding: "5px 12px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          CLOSE TAB ✕
        </button>
      </div>

      {/* Main Tactical Card */}
      <div style={{ maxWidth: "680px", width: "100%" }}>
        <VisualDuctMaze
          mazeData={mazeData}
          onCodeDiscovered={(code) => setDiscoveredCode(code)}
          standalone={true}
        />
      </div>

      {/* Operator Instructions Note */}
      <div style={{
        maxWidth: "680px",
        width: "100%",
        marginTop: "16px",
        padding: "10px 14px",
        background: "rgba(0, 0, 0, 0.45)",
        borderLeft: "3px solid #ffd166",
        borderRadius: "4px",
        fontSize: "12px",
        color: "#c0cdd8",
        lineHeight: 1.4,
      }}>
        <strong style={{ color: "#ffd166" }}>MISSION DIRECTIVE:</strong> Navigate Tommy's fiber camera probe through the air conditioning ducts from <strong>Point A (Intake Grate)</strong> to <strong>Point B (Deposit Vent #88)</strong>. Beware of spinning turbine fans and security laser tripwires. Once you reach Point B, copy the recovered emergency codeword and paste it into your main terminal password!
      </div>
    </div>
  );
}
