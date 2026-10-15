/**
 * AdminCommand.jsx
 * Route: /admin (or #/admin via HashRouter)
 * Theme: El Banco Corrupto Grande · Executive Managing Director Suite
 * Persona: Bank Manager Gordon Bennett / Chief Vault Overseer
 * - Executive PIN gate (1986) with Manager Bennett portrait
 * - Real-time terminal surveillance & move inspector (sync via port 5176 / BroadcastChannel)
 * - Executive Vault controls: Story dispatch, Emergency Siren, Global Lockdown, Floor Advance (up to Tier 4), Player Ejection
 */
import { useState, useEffect, useRef, useCallback } from "react";
import SoundEngine from "../utils/soundEngine";
import { getAssetPath } from "../utils/assetPath";
import "./AdminCommand.css";

const ADMIN_PIN    = "1986";
const CHANNEL_NAME = "vch-admin-bus";
const POLL_MS      = 800;

/* ─── Broadcast Helper ──────────────────────────────────── */
function getBus() {
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHANNEL_NAME);
}

/* ─── Mock Players (fallback when local server not running) ── */
const MOCK_PLAYERS = [
  { id: "STA-01", alias: "NeonRider", college: "Vice City Tech", chapter: 2, score: 850, status: "active", rulesCleared: 14, timeLeft: 420 },
  { id: "STA-02", alias: "GhostWire", college: "Starfish Academy", chapter: 1, score: 320, status: "active", rulesCleared: 6, timeLeft: 510 },
  { id: "STA-03", alias: "Syndicate", college: "Ocean Drive Inst", chapter: 3, score: 1450, status: "active", rulesCleared: 28, timeLeft: 380 },
  { id: "STA-04", alias: "DataViper", college: "Little Haiti Cyber", chapter: 2, score: 690, status: "idle", rulesCleared: 12, timeLeft: 480 },
  { id: "STA-05", alias: "ChromeFox", college: "Vice Harbor Poly", chapter: 1, score: 210, status: "active", rulesCleared: 4, timeLeft: 560 },
];

/* ─── Executive Vault Floor Labels ──────────────────────── */
const VAULT_FLOORS = {
  1: { name: "FLOOR 1: TELLERS GATE", short: "FL.1 TELLERS", color: "#48D5D0" },
  2: { name: "FLOOR 2: CASH CORRIDORS", short: "FL.2 CASH", color: "#FFD166" },
  3: { name: "FLOOR 3: DEEP VAULT", short: "FL.3 TITANIUM", color: "#F84391" },
  4: { name: "FLOOR 4: OMEGA CORE", short: "FL.4 OMEGA", color: "#9B00FF" },
};

/* ─── Executive PIN Gate ────────────────────────────────── */
function PinGate({ onSuccess }) {
  const [pin, setPin]       = useState("");
  const [shake, setShake]   = useState(false);
  const [attempts, setAtt]  = useState(0);
  const managerImgSrc = getAssetPath("manager.png");

  const handlePin = useCallback((digit) => {
    SoundEngine.init();
    SoundEngine.playClick();
    setPin(p => {
      const next = p + digit;
      if (next.length === 4) {
        if (next === ADMIN_PIN) {
          SoundEngine.playUnlock();
          onSuccess();
        } else {
          SoundEngine.playDenied();
          setShake(true);
          setAtt(a => a + 1);
          setTimeout(() => { setPin(""); setShake(false); }, 600);
        }
      }
      return next.length <= 4 ? next : p;
    });
  }, [onSuccess]);

  const handleClear = () => {
    SoundEngine.init();
    SoundEngine.playClick();
    setPin("");
  };

  const handleAutoFill = () => {
    SoundEngine.init();
    SoundEngine.playUnlock();
    setPin(ADMIN_PIN);
    setTimeout(() => onSuccess(), 250);
  };

  return (
    <div className={`pin-gate-boss${shake ? " shake" : ""}`}>
      <div className="boss-pin-card">
        {/* Manager Portrait & Seal */}
        <div className="boss-seal-container">
          <div className="boss-portrait-ring">
            <img src={managerImgSrc} alt="Manager Gordon Bennett" className="boss-portrait-img" />
            <div className="boss-ring-glow"></div>
          </div>
          <div className="boss-crest-badge">
            <span className="boss-crest-icon">🏛️</span>
            <span className="boss-crest-text">EL BANCO CORRUPTO GRANDE</span>
          </div>
        </div>

        <h1 className="boss-pin-title">EXECUTIVE BOARDROOM</h1>
        <p className="boss-pin-sub">CHIEF MANAGING DIRECTOR // GORDON BENNETT</p>
        <div className="boss-pin-directive">
          "ENTER 4-DIGIT EXECUTIVE CLEARANCE PIN TO OVERSEE VAULT DEFENSE"
        </div>

        {/* PIN Dots */}
        <div className="boss-pin-dots" aria-label={`${pin.length} of 4 digits entered`}>
          {[0, 1, 2, 3].map(i => (
            <span key={i} className={`boss-dot${i < pin.length ? " filled" : ""}`}>
              {i < pin.length && <span className="boss-dot-inner">✦</span>}
            </span>
          ))}
        </div>

        {attempts > 0 && (
          <p className="boss-pin-denied">
            ⚠ ACCESS DENIED: {attempts} INVALID ATTEMPT{attempts > 1 ? "S" : ""}
          </p>
        )}

        {/* Gold Obsidian Keypad */}
        <div className="boss-pin-pad">
          {"123456789".split("").map(d => (
            <button
              key={d}
              id={`pin-${d}`}
              type="button"
              className="boss-key"
              onClick={() => handlePin(d)}
            >
              <span className="key-num">{d}</span>
            </button>
          ))}
          <button
            id="pin-clear"
            type="button"
            className="boss-key boss-key-clear"
            onClick={handleClear}
            title="Clear entered digits"
          >
            CLR
          </button>
          <button
            id="pin-0"
            type="button"
            className="boss-key"
            onClick={() => handlePin("0")}
          >
            <span className="key-num">0</span>
          </button>
          <button
            id="pin-auto"
            type="button"
            className="boss-key boss-key-auto"
            onClick={handleAutoFill}
            title="Executive Quick Clearance (1986)"
          >
            1986
          </button>
        </div>

        <div className="boss-pin-footer">
          <span>RESTRICTED TO MANAGING DIRECTOR & CENTRAL DISPATCH</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Executive Director Dashboard ──────────────────────── */
function AdminDashboard() {
  const [players, setPlayers] = useState(MOCK_PLAYERS.map(p => ({ ...p, isMock: true })));
  const [hasRealPlayers, setHasRealPlayers] = useState(false);
  const [frozen, setFrozen] = useState({});
  const [globalFreeze, setGF] = useState(false);
  const [log, setLog] = useState([
    `[${new Date().toLocaleTimeString()}] Managing Director Gordon Bennett assumed active vault supervision.`,
    `[${new Date().toLocaleTimeString()}] 4-Floor Defense Protocol armed across all network stations.`,
  ]);
  const busRef = useRef(null);
  const logRef = useRef(null);
  const managerImgSrc = getAssetPath("manager.png");

  const addLog = useCallback((msg) => {
    setLog(l => [...l.slice(-99), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const broadcast = useCallback((payload) => {
    busRef.current?.postMessage(payload);
  }, []);

  /* Poll backend on port 5176 for real players & global state */
  useEffect(() => {
    const pollServer = async () => {
      try {
        const res = await fetch("http://localhost:5176/api/state");
        const data = await res.json();
        if (data.players && data.players.length > 0) {
          setHasRealPlayers(true);
          setPlayers(data.players.map(p => ({
            id: p.id,
            alias: p.alias || p.name || `Station ${p.id.slice(-4)}`,
            name: p.name || "",
            college: p.college || "",
            chapter: p.currentLevel || 1,
            score: (p.rulesCleared || 0) * 150 + ((p.currentLevel || 1) - 1) * 600 + Math.max(0, p.timeLeft || 0),
            status: p.isBreached ? "BREACHED" : p.status || "active",
            isBreached: Boolean(p.isBreached),
            rulesCleared: p.rulesCleared || 0,
            timeLeft: p.timeLeft,
            isMock: false,
          })));
        }
        if (typeof data.gameState?.globalFreeze === "boolean") {
          setGF(data.gameState.globalFreeze);
        }
      } catch (_) {}
    };

    pollServer();
    const id = setInterval(pollServer, POLL_MS);
    return () => clearInterval(id);
  }, []);

  /* Broadcast channel listener */
  useEffect(() => {
    busRef.current = getBus();
    if (!busRef.current) return;
    busRef.current.onmessage = (evt) => {
      const { type, player, playerId: pid, frozen: f } = evt.data || {};
      if (type === "player_update" && player) {
        setHasRealPlayers(true);
        setPlayers(prev => {
          const p = player;
          const mapped = {
            id: p.id,
            alias: p.alias || p.name || `Station ${p.id.slice(-4)}`,
            name: p.name || "",
            college: p.college || "",
            chapter: p.currentLevel || 1,
            score: (p.rulesCleared || 0) * 150 + ((p.currentLevel || 1) - 1) * 600 + Math.max(0, p.timeLeft || 0),
            status: p.isBreached ? "BREACHED" : p.status || "active",
            isBreached: Boolean(p.isBreached),
            rulesCleared: p.rulesCleared || 0,
            timeLeft: p.timeLeft,
            isMock: false,
          };
          const existing = prev.some(item => item.id === p.id);
          if (existing) {
            return prev.map(item => item.id === p.id ? mapped : item);
          }
          return [...prev.filter(item => !item.isMock), mapped];
        });
      } else if (type === "remove") {
        setPlayers(prev => prev.filter(p => p.id !== pid));
      } else if (type === "freeze") {
        setFrozen(prev => ({ ...prev, [pid]: f }));
      } else if (type === "globalFreeze") {
        setGF(f);
      }
    };
    return () => busRef.current?.close();
  }, []);

  /* Mock player score ticker (only when no real players are connected) */
  useEffect(() => {
    if (hasRealPlayers) return;
    const id = setInterval(() => {
      setPlayers(prev => prev.map(p => ({
        ...p,
        score: frozen[p.id] || globalFreeze
          ? p.score
          : p.status === "active" ? p.score + Math.floor(Math.random() * 5) : p.score,
      })));
    }, POLL_MS);
    return () => clearInterval(id);
  }, [frozen, globalFreeze, hasRealPlayers]);

  /* Auto-scroll log */
  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [log]);

  /* ── Action Handlers ── */
  const toggleFreeze = useCallback((id, alias) => {
    SoundEngine.init();
    setFrozen(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const action = next[id] ? "EXECUTIVE LOCKDOWN (FROZEN)" : "LOCKDOWN LIFTED (THAWED)";
      SoundEngine[next[id] ? "playFreeze" : "playUnlock"]();
      addLog(`Director Bennett applied ${action} on station ${alias} (${id})`);
      broadcast({ type: next[id] ? "freeze" : "unfreeze", playerId: id, frozen: next[id] });
      fetch("http://localhost:5176/api/admin/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: next[id] ? "FREEZE_PLAYER" : "UNFREEZE_PLAYER",
          playerId: id,
        }),
      }).catch(() => {});
      return next;
    });
  }, [addLog, broadcast]);

  const toggleGlobalFreeze = useCallback(() => {
    SoundEngine.init();
    setGF(prev => {
      const next = !prev;
      SoundEngine[next ? "playFreeze" : "playUnlock"]();
      addLog(`DIRECTOR BENNETT: GLOBAL VAULT ${next ? "LOCKDOWN ARMED" : "LOCKDOWN RELEASED"}`);
      broadcast({ type: "globalFreeze", frozen: next });
      fetch("http://localhost:5176/api/admin/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: next ? "GLOBAL_FREEZE" : "GLOBAL_UNFREEZE" }),
      }).catch(() => {});
      return next;
    });
  }, [addLog, broadcast]);

  const advancePlayer = useCallback((id, alias) => {
    SoundEngine.init();
    SoundEngine.playSwoosh();
    setPlayers(prev => prev.map(p =>
      p.id === id ? { ...p, chapter: Math.min(p.chapter + 1, 4) } : p
    ));
    addLog(`Director Bennett authorized vault tier advance for ${alias} (${id})`);
    broadcast({ type: "advance", playerId: id });
  }, [addLog, broadcast]);

  const removePlayer = useCallback((id, alias) => {
    SoundEngine.init();
    SoundEngine.playAlert();
    setPlayers(prev => prev.filter(p => p.id !== id));
    addLog(`Director Bennett revoked security clearance & ejected ${alias} (${id})`);
    broadcast({ type: "remove", playerId: id });
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REMOVE_PLAYER", playerId: id }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  const startStoryAll = useCallback(() => {
    SoundEngine.init();
    SoundEngine.playWantedStar();
    addLog("Director Bennett dispatched Story Cutscene directive to all bank stations");
    broadcast({ type: "start_story" });
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "START_STORY_MODE" }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  const triggerSirenAll = useCallback(() => {
    SoundEngine.init();
    SoundEngine.playSiren();
    addLog("Director Bennett sounded Bank Emergency Klaxon across all stations");
    broadcast({ type: "siren" });
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "TRIGGER_SIREN" }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  const resetLobbyAll = useCallback(() => {
    if (!window.confirm("⚠️ Director Bennett: Recall all bank stations back to the Lobby? This will reset all active sessions.")) return;
    SoundEngine.init();
    SoundEngine.playAlert();
    addLog("Director Bennett issued mandatory recall: all stations reset to lobby");
    broadcast({ type: "reset_lobby" });
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "RESET_TO_LOBBY" }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  return (
    <div className="boss-admin-root">
      {/* ── TOP EXECUTIVE BANNER ── */}
      <header className="boss-header">
        <div className="boss-header-left">
          <div className="boss-avatar-wrapper">
            <img src={managerImgSrc} alt="Manager Bennett" className="boss-header-avatar" />
            <span className="boss-status-pip" title="Director Online"></span>
          </div>
          <div className="boss-title-block">
            <div className="boss-super-title">
              <span className="bank-crest-symbol">🏛️</span>
              <span className="bank-name">EL BANCO CORRUPTO GRANDE</span>
              <span className="security-clearance-pill">CLASS 1 EXECUTIVE</span>
            </div>
            <h1 className="boss-title-text">
              MANAGING DIRECTOR'S COMMAND SUITE
            </h1>
            <p className="boss-sub-text">
              CHIEF VAULT OVERSEER: <strong>GORDON BENNETT</strong> · CENTRAL HEIST DISPATCH
            </p>
          </div>
        </div>

        {/* Executive Action Toolbar */}
        <div className="boss-header-actions">
          <button
            id="start-story-btn"
            type="button"
            className="boss-btn boss-btn-launch"
            onClick={startStoryAll}
            title="Dispatch Story Cutscene to all terminals simultaneously"
          >
            <span className="btn-icon">🎬</span>
            <span className="btn-text">DISPATCH STORY</span>
          </button>

          <button
            id="siren-btn"
            type="button"
            className="boss-btn boss-btn-alarm"
            onClick={triggerSirenAll}
            title="Sound Bank Klaxon alarm on all terminals"
          >
            <span className="btn-icon">🚨</span>
            <span className="btn-text">SOUND KLAXON</span>
          </button>

          <button
            id="reset-lobby-btn"
            type="button"
            className="boss-btn boss-btn-recall"
            onClick={resetLobbyAll}
            title="Recall all terminals to Waiting Lobby"
          >
            <span className="btn-icon">🔄</span>
            <span className="btn-text">RECALL LOBBY</span>
          </button>

          <button
            id="global-freeze-btn"
            type="button"
            className={`boss-btn ${globalFreeze ? "boss-btn-unfreeze" : "boss-btn-lockdown"}`}
            onClick={toggleGlobalFreeze}
            title={globalFreeze ? "Lift bank-wide lockdown" : "Emergency freeze all terminals"}
          >
            <span className="btn-icon">{globalFreeze ? "☀️" : "❄️"}</span>
            <span className="btn-text">
              {globalFreeze ? "RELEASE LOCKDOWN" : "GLOBAL LOCKDOWN"}
            </span>
          </button>
        </div>
      </header>

      {/* ── EXECUTIVE METRICS & MANAGER ADVISORY ── */}
      <section className="boss-status-strip">
        <div className="boss-metric-card gold-border">
          <span className="metric-icon">💰</span>
          <div className="metric-info">
            <span className="metric-label">TOTAL VAULT TREASURY</span>
            <span className="metric-val gold-glow">$3,000,000 INTACT</span>
          </div>
        </div>

        <div className="boss-metric-card cyan-border">
          <span className="metric-icon">🛡️</span>
          <div className="metric-info">
            <span className="metric-label">DEFENSE PROTOCOL</span>
            <span className="metric-val cyan-glow">4-TIER CIPHER MATRIX</span>
          </div>
        </div>

        <div className="boss-metric-card purple-border">
          <span className="metric-icon">🖥️</span>
          <div className="metric-info">
            <span className="metric-label">CONNECTED STATIONS</span>
            <span className="metric-val purple-glow">
              {players.length} {hasRealPlayers ? "Live Terminals" : "Demo Terminals"}
            </span>
          </div>
        </div>

        <div className="boss-metric-card pink-border">
          <span className="metric-icon">⚠️</span>
          <div className="metric-info">
            <span className="metric-label">PRIMARY THREAT</span>
            <span className="metric-val pink-glow">VERCETTI SYNDICATE</span>
          </div>
        </div>
      </section>

      {/* ── MANAGER BENNETT'S EXECUTIVE ADVISORY ── */}
      <div className="boss-dialogue-banner">
        <div className="boss-banner-portrait-frame">
          <img src={managerImgSrc} alt="Manager Bennett" className="boss-banner-portrait" />
        </div>
        <div className="boss-banner-text-wrap">
          <div className="boss-banner-sender">
            <span className="boss-tag">👔 DIRECTOR GORDON BENNETT</span>
            <span className="boss-broadcast-status">DIRECTIVE BROADCAST TO ALL AGENTS</span>
          </div>
          <p className="boss-banner-quote">
            "Gentlemen, Tommy Vercetti and his gang are hammering our blast gates with thermal drills! Not a single cent leaves El Banco Corrupto Grande without my signature. Oversee your assigned stations, enforce the 10-minute lock protocols, and defend the Omega Core!"
          </p>
        </div>
      </div>

      {/* ── LIVE STATION SURVEILLANCE TABLE ── */}
      <section className="boss-table-section">
        <div className="table-header-bar">
          <div className="table-title-group">
            <h2 className="table-heading">
              <span className="table-icon">🔍</span>
              REAL-TIME TERMINAL SURVEILLANCE & MOVE INSPECTOR
            </h2>
            <span className="table-sub-count">
              MONITORING {players.length} SECURITY STATIONS ACROSS 4 FLOORS
            </span>
          </div>
          <div className="table-legend">
            <span className="legend-chip fl1">FL.1 TELLERS</span>
            <span className="legend-chip fl2">FL.2 CASH</span>
            <span className="legend-chip fl3">FL.3 TITANIUM</span>
            <span className="legend-chip fl4">FL.4 OMEGA</span>
          </div>
        </div>

        <div className="boss-table-wrapper">
          <table className="boss-table" aria-label="Executive terminal inspector table">
            <thead>
              <tr>
                <th>STATION ID</th>
                <th>AGENT & INSTITUTION</th>
                <th>VAULT FLOOR</th>
                <th>RULES</th>
                <th>SCORE ($)</th>
                <th>SECURITY STATUS</th>
                <th>LOCKDOWN</th>
                <th>ADVANCE FLOOR</th>
                <th>DISQUALIFY</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan={9} className="table-empty-cell">
                    AWAITING AGENTS TO CONNECT TERMINALS FROM THE BANK LOBBY...
                  </td>
                </tr>
              ) : (
                players.map(p => {
                  const isF = frozen[p.id] || globalFreeze;
                  const floorCfg = VAULT_FLOORS[p.chapter] || VAULT_FLOORS[1];

                  return (
                    <tr key={p.id} className={`boss-row ${isF ? "row-locked" : ""} ${p.isBreached ? "row-breached" : ""}`}>
                      {/* Station ID */}
                      <td className="cell-id">
                        <span className="station-badge">{p.id}</span>
                      </td>

                      {/* Agent Alias & College */}
                      <td className="cell-agent">
                        <div className="agent-meta">
                          <span className="agent-alias-text">{p.alias}</span>
                          {p.college && (
                            <span className="agent-college-text">{p.college}</span>
                          )}
                        </div>
                      </td>

                      {/* Vault Floor */}
                      <td className="cell-floor">
                        <span
                          className={`floor-tag fl-${p.chapter}`}
                          style={{ borderColor: floorCfg.color, color: floorCfg.color }}
                        >
                          {floorCfg.name}
                        </span>
                      </td>

                      {/* Rules Cleared */}
                      <td className="cell-rules">
                        <span className="rules-number">{p.rulesCleared ?? "—"}</span>
                      </td>

                      {/* Score */}
                      <td className="cell-score">
                        <span className="score-gold">
                          ${String(p.score).padStart(6, "0")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="cell-status">
                        {p.isBreached ? (
                          <span className="status-badge breached">🚨 BREACHED</span>
                        ) : isF ? (
                          <span className="status-badge locked">❄️ FROZEN</span>
                        ) : (
                          <span className={`status-badge ${p.status.toLowerCase()}`}>
                            {p.status.toUpperCase()}
                          </span>
                        )}
                      </td>

                      {/* Individual Lockdown */}
                      <td className="cell-action">
                        <button
                          id={`freeze-${p.id}`}
                          type="button"
                          className={`boss-cell-btn ${isF && !globalFreeze ? "thaw-btn" : "freeze-btn"}`}
                          onClick={() => !globalFreeze && toggleFreeze(p.id, p.alias)}
                          disabled={globalFreeze}
                          title={isF ? "Thaw and resume station" : "Freeze station terminal"}
                        >
                          {isF && !globalFreeze ? "☀️ THAW" : "❄️ FREEZE"}
                        </button>
                      </td>

                      {/* Advance Floor */}
                      <td className="cell-action">
                        <button
                          id={`advance-${p.id}`}
                          type="button"
                          className="boss-cell-btn advance-btn"
                          onClick={() => advancePlayer(p.id, p.alias)}
                          disabled={isF || p.chapter >= 4}
                          title={p.chapter >= 4 ? "Station is at Maximum Omega Core" : "Promote station to next floor"}
                        >
                          {p.chapter >= 4 ? "MAX TIER" : "▶ PROMOTE"}
                        </button>
                      </td>

                      {/* Disqualify */}
                      <td className="cell-action">
                        <button
                          id={`remove-${p.id}`}
                          type="button"
                          className="boss-cell-btn eject-btn"
                          onClick={() => removePlayer(p.id, p.alias)}
                          title="Revoke clearance and eject station"
                        >
                          🚫 EJECT
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── EXECUTIVE AUDIT LOG ── */}
      <section className="boss-log-section">
        <div className="log-header-bar">
          <h2 className="log-heading">
            <span className="log-icon">📋</span>
            EXECUTIVE VAULT DIRECTIVES & AUDIT LOG
          </h2>
          <span className="log-live-dot">LIVE LOGGING</span>
        </div>
        <div
          className="boss-log-console"
          ref={logRef}
          aria-live="polite"
          aria-label="Executive director audit log"
        >
          {log.map((l, i) => (
            <div key={i} className="boss-log-line">
              <span className="log-chevron">❯</span> {l}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="boss-footer">
        <div className="boss-footer-brand">
          <span>🏛️ EL BANCO CORRUPTO GRANDE · EXECUTIVE BOARDROOM</span>
        </div>
        <div className="boss-footer-creds">
          <span>OFFICIAL CONSOLE OF MANAGING DIRECTOR GORDON BENNETT // EST. 1986</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Main Route Export ─────────────────────────────────── */
export default function AdminCommand() {
  const [authed, setAuthed] = useState(false);

  return authed ? (
    <AdminDashboard />
  ) : (
    <PinGate onSuccess={() => setAuthed(true)} />
  );
}
