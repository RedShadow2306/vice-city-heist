/**
 * App.jsx  -  Vice City Heist: Bank Manager Vault Defense Root Router
 *
 * Implements user requirements:
 *   - The site defaultly opens to the Wait Screen / Lobby on route "/"
 *   - Admin links are hidden from players
 *   - Hidden key combination shortcut (Ctrl + Shift + A) opens the dedicated Admin Portal (Port 5176)
 */

import { useState, useEffect, useCallback } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import CyberBackground from "./components/CyberBackground";
import DaemonLogo from "./components/DaemonLogo";
import PlayerTerminal from "./pages/PlayerTerminal";
import AdminCommand from "./pages/AdminCommand";
import ProjectorStage from "./pages/ProjectorStage";
import SoundEngine from "./utils/soundEngine";
import { getAssetUrl } from "./utils/assetPath";
import "./App.css";

const getAdminPortalUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5176/";
  if (window.location.port === "5176") return window.location.href;
  return `${window.location.origin}${window.location.pathname}#/admin`;
};

function Shell() {
  const [lite, setLite] = useState(false);

  /* Hidden Key combination shortcut to open Admin Portal: Ctrl + Shift + A */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) ||
          (e.ctrlKey && e.altKey && (e.key === "A" || e.key === "a"))) {
        e.preventDefault();
        SoundEngine.init();
        SoundEngine.playUnlock();
        window.open(getAdminPortalUrl(), "_blank");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* Init sound on first interaction */
  const handleFirstClick = useCallback(() => {
    SoundEngine.init();
  }, []);

  return (
    <div className="app-shell" onClick={handleFirstClick}>
      {/* Background Ambience */}
      <CyberBackground onLiteChange={setLite} />

      {/* Top Floating Navigation with Official DAEMON '26 Fest Identity */}
      <nav className="app-nav" aria-label="Main navigation">
        <div className="nav-brand">
          <DaemonLogo size="sm" showSubtitle={true} />
          <div className="nav-brand-text">
            <span className="nav-heist-sub">EL BANCO CORRUPTO GRANDE · VAULT DEFENSE</span>
          </div>
        </div>

        <div className="nav-links">
          <a
            href="https://www.daemonietm.online"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link external-portal-link"
            title="Open VYUHA by DAEMON '26 Main Fest Website"
          >
            <img
              src={getAssetUrl("/daemon-logo.png")}
              alt="VYUHA Logo"
              className="nav-portal-logo-icon"
              onError={(e) => {
                if (!e.target.src.endsWith(".svg")) {
                  e.target.src = getAssetUrl("/daemon-logo.svg");
                }
              }}
            />
            <span>VYUHA PORTAL ↗</span>
          </a>
        </div>
      </nav>

      {/* Main Page: Defaults to PlayerTerminal with Waiting Lobby, or /admin for Admin Console */}
      <div className="app-content">
        <Routes>
          <Route path="/admin" element={<AdminCommand />} />
          <Route path="/stage" element={<ProjectorStage />} />
          <Route path="/leaderboard" element={<ProjectorStage />} />
          <Route path="*" element={<PlayerTerminal />} />
        </Routes>
      </div>

      {/* Discreet Organizer Footer Hint */}
      <footer className="discreet-organizer-footer">
        <span
          className="organizer-shortcut-text"
          onDoubleClick={() => window.open(getAdminPortalUrl(), "_blank")}
        >
          🔒 Central Security System v2.6 · Bank of Vice City Operations
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}
