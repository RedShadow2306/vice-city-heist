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
import PlayerTerminal  from "./pages/PlayerTerminal";
import SoundEngine     from "./utils/soundEngine";
import "./App.css";

const ADMIN_PORTAL_URL = "http://localhost:5176/";

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
        window.open(ADMIN_PORTAL_URL, "_blank");
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
            href="http://localhost:5174/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link external-portal-link"
            title="Open DAEMON '26 Main Association Fest Website"
          >
            <img
              src="/daemon-logo.png"
              alt="DAEMON Logo"
              className="nav-portal-logo-icon"
              onError={(e) => {
                if (!e.target.src.endsWith(".svg")) {
                  e.target.src = "/daemon-logo.svg";
                }
              }}
            />
            <span>DAEMON PORTAL ↗</span>
          </a>
        </div>
      </nav>

      {/* Main Page: Defaults to PlayerTerminal with Waiting Lobby */}
      <div className="app-content">
        <Routes>
          <Route path="*" element={<PlayerTerminal />} />
        </Routes>
      </div>

      {/* Discreet Organizer Footer Hint */}
      <footer className="discreet-organizer-footer">
        <span
          className="organizer-shortcut-text"
          title="Central Dispatch shortcut: Ctrl + Shift + A"
          onDoubleClick={() => window.open(ADMIN_PORTAL_URL, "_blank")}
        >
          🔒 Central Security System v2.6 · [Ctrl+Shift+A for Dispatch Console]
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
