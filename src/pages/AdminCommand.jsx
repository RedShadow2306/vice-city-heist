/**
 * AdminCommand.jsx
 * Route: /admin
 * - PIN gate (1986)
 * - Live move inspector (shows player state via localStorage poll)
 * - Remote freeze controls (broadcasts freeze via BroadcastChannel)
 */
import { useState, useEffect, useRef, useCallback } from "react";
import SoundEngine from "../utils/soundEngine";
import "./AdminCommand.css";

const ADMIN_PIN     = "1986";
const CHANNEL_NAME  = "vch-admin-bus";
const POLL_MS       = 800;

/* ─── broadcast helpers ──────────────────────────────────── */
function getBus() {
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHANNEL_NAME);
}

/* ─── mock player row data (would come from real back-end) ── */
const MOCK_PLAYERS = [
  { id: "P001", alias: "NeonRider",  chapter: 2, score: 350, status: "active" },
  { id: "P002", alias: "GhostWire",  chapter: 1, score: 180, status: "active" },
  { id: "P003", alias: "Syndicate",  chapter: 3, score: 520, status: "active" },
  { id: "P004", alias: "DataViper",  chapter: 2, score: 290, status: "idle"   },
  { id: "P005", alias: "ChromeFox",  chapter: 1, score: 100, status: "active" },
];

/* ─── PIN gate ──────────────────────────────────────────── */
function PinGate({ onSuccess }) {
  const [pin, setPin]       = useState("");
  const [shake, setShake]   = useState(false);
  const [attempts, setAtt]  = useState(0);

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

  const handleClear = () => { SoundEngine.init(); SoundEngine.playClick(); setPin(""); };

  return (
    <div className={`pin-gate${shake ? " shake" : ""}`}>
      <div className="pin-header">
        <span className="admin-logo">🚔 VCPD COMMAND</span>
      </div>
      <p className="pin-label">ENTER ADMIN PIN</p>
      <div className="pin-dots" aria-label={`${pin.length} of 4 digits entered`}>
        {[0,1,2,3].map(i => (
          <span key={i} className={`pin-dot${i < pin.length ? " filled" : ""}`} />
        ))}
      </div>
      {attempts > 0 && <p className="pin-attempts">⚠ {attempts} failed attempt{attempts > 1 ? "s" : ""}</p>}
      <div className="pin-pad">
        {"123456789".split("").map(d => (
          <button key={d} id={`pin-${d}`} className="pin-key" onClick={() => handlePin(d)}>{d}</button>
        ))}
        <button id="pin-clear" className="pin-key pin-clear" onClick={handleClear}>CLR</button>
        <button id="pin-0"     className="pin-key" onClick={() => handlePin("0")}>0</button>
        <button id="pin-enter" className="pin-key pin-enter" onClick={() => {}}>↵</button>
      </div>
    </div>
  );
}

/* ─── admin dashboard ───────────────────────────────────── */
function AdminDashboard() {
  const [players, setPlayers]   = useState(MOCK_PLAYERS.map(p => ({ ...p, isMock: true })));
  const [hasRealPlayers, setHasRealPlayers] = useState(false);
  const [frozen, setFrozen]     = useState({});          // { playerId: bool }
  const [globalFreeze, setGF]   = useState(false);
  const [log, setLog]           = useState([]);
  const busRef = useRef(null);
  const logRef = useRef(null);

  const addLog = useCallback((msg) => {
    setLog(l => [...l.slice(-99), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const broadcast = useCallback((payload) => {
    busRef.current?.postMessage(payload);
  }, []);

  /* Poll server on port 5176 for real players & global state */
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

  /* auto-scroll log */
  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [log]);

  const toggleFreeze = useCallback((id, alias) => {
    SoundEngine.init();
    setFrozen(prev => {
      const next = { ...prev, [id]: !prev[id] };
      const action = next[id] ? "FROZEN" : "UNFROZEN";
      SoundEngine[next[id] ? "playFreeze" : "playUnlock"]();
      addLog(`Player ${alias} (${id}) → ${action}`);
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
      addLog(`GLOBAL ${next ? "FREEZE" : "UNFREEZE"} applied`);
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
      p.id === id ? { ...p, chapter: Math.min(p.chapter + 1, 3) } : p
    ));
    addLog(`Admin advanced ${alias} (${id}) to next chapter`);
    broadcast({ type: "advance", playerId: id });
  }, [addLog, broadcast]);

  const removePlayer = useCallback((id, alias) => {
    SoundEngine.init();
    SoundEngine.playAlert();
    setPlayers(prev => prev.filter(p => p.id !== id));
    addLog(`Admin ejected & removed ${alias} (${id}) from game`);
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
    addLog("Admin launched Story Mode cutscene for all player stations");
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
    addLog("Admin triggered VCPD Emergency Siren on all stations");
    broadcast({ type: "siren" });
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "TRIGGER_SIREN" }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  const resetLobbyAll = useCallback(() => {
    if (!window.confirm("⚠️ Reset all terminals back to Lobby? This will reset all player sessions.")) return;
    SoundEngine.init();
    SoundEngine.playAlert();
    addLog("Admin reset all stations to Lobby");
    broadcast({ type: "reset_lobby" });
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "RESET_TO_LOBBY" }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  return (
    <div className="admin-root">
      {/* top bar */}
      <header className="admin-header">
        <div className="admin-header-left" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span className="admin-logo">🚔 VCPD COMMAND</span>
          <span className="admin-roster-count mono" style={{ fontSize: "11px", color: "var(--vc-teal)" }}>
            {players.length} {hasRealPlayers ? "Live Stations" : "Demo Stations"}
          </span>
        </div>
        <div className="admin-header-right">
          <button
            id="start-story-btn"
            className="admin-btn green"
            onClick={startStoryAll}
            title="Dispatch Story Cutscene to all terminals"
          >
            🎬 START STORY (ALL)
          </button>
          <button
            id="siren-btn"
            className="admin-btn warn"
            onClick={triggerSirenAll}
            title="Trigger VCPD siren on all terminals"
          >
            🚨 SIREN
          </button>
          <button
            id="reset-lobby-btn"
            className="admin-btn"
            onClick={resetLobbyAll}
            title="Reset all terminals to Waiting Lobby"
          >
            🔄 RESET LOBBY
          </button>
          <button
            id="global-freeze-btn"
            className={`admin-btn${globalFreeze ? " danger" : " warn"}`}
            onClick={toggleGlobalFreeze}
          >
            {globalFreeze ? "❄ UNFREEZE ALL" : "❄ FREEZE ALL"}
          </button>
        </div>
      </header>

      {/* move inspector table */}
      <section className="admin-section">
        <h2 className="admin-section-title">🔍 LIVE MOVE INSPECTOR</h2>
        <div className="inspector-table-wrap">
          <table className="inspector-table" aria-label="Player status table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ALIAS</th>
                <th>CHAPTER</th>
                <th>SCORE</th>
                <th>STATUS</th>
                <th>FREEZE</th>
                <th>ADVANCE</th>
                <th>REMOVE</th>
              </tr>
            </thead>
            <tbody>
              {players.map(p => {
                const isF = frozen[p.id] || globalFreeze;
                return (
                  <tr key={p.id} className={isF ? "row-frozen" : ""}>
                    <td className="mono">{p.id}</td>
                    <td className="alias">{p.alias}</td>
                    <td>
                      <span className="chap-badge">CH.{p.chapter}</span>
                    </td>
                    <td className="score-cell mono">
                      {String(p.score).padStart(6, "0")}
                    </td>
                    <td>
                      <span className={`status-badge ${isF ? "frozen" : p.status}`}>
                        {isF ? "FROZEN" : p.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button
                        id={`freeze-${p.id}`}
                        className={`admin-btn tiny${isF && !globalFreeze ? " danger" : ""}`}
                        onClick={() => !globalFreeze && toggleFreeze(p.id, p.alias)}
                        disabled={globalFreeze}
                        title={isF ? "Unfreeze player" : "Freeze player"}
                      >
                        {isF && !globalFreeze ? "THAW" : "❄"}
                      </button>
                    </td>
                    <td>
                      <button
                        id={`advance-${p.id}`}
                        className="admin-btn tiny green"
                        onClick={() => advancePlayer(p.id, p.alias)}
                        disabled={isF || p.chapter >= 3}
                        title="Push to next chapter"
                      >
                        ▶
                      </button>
                    </td>
                    <td>
                      <button
                        id={`remove-${p.id}`}
                        className="admin-btn tiny danger"
                        onClick={() => removePlayer(p.id, p.alias)}
                        title="Eject and remove player from game"
                      >
                        🚫
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* action log */}
      <section className="admin-section">
        <h2 className="admin-section-title">📋 ACTION LOG</h2>
        <div className="log-panel" ref={logRef} aria-live="polite" aria-label="Admin action log">
          {log.length === 0
            ? <span className="log-empty">No actions yet…</span>
            : log.map((l, i) => <div key={i} className="log-line">{l}</div>)
          }
        </div>
      </section>
    </div>
  );
}

/* ─── main export ───────────────────────────────────────── */
export default function AdminCommand() {
  const [authed, setAuthed] = useState(false);

  return authed
    ? <AdminDashboard />
    : <PinGate onSuccess={() => setAuthed(true)} />;
}
