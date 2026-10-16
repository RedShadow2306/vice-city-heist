/**
 * AdminCommand.jsx
 * Route: /admin (or #/admin via HashRouter)
 * Theme: El Banco Corrupto Grande · Executive Managing Director Suite
 * Persona: Bank Manager Gordon Bennett / Chief Vault Overseer
 * - Executive PIN gate (1986) with Manager Bennett portrait
 * - Real-time terminal surveillance & move inspector (Supabase Cloud + Local Broadcast bus + Node server sync)
 * - Live Player Vault Key (Password) Surveillance & copy inspector
 * - Executive Vault controls: Story dispatch, Emergency Siren, Global Lockdown, Floor Advance (up to Tier 4), Player Ejection
 * - ZERO prebuilt demo pieces: 100% connected real players
 */
import { useState, useEffect, useRef, useCallback } from "react";
import SoundEngine from "../utils/soundEngine";
import { getAssetPath } from "../utils/assetPath";
import {
  fetchPlayersFromSupabase,
  fetchGameStateFromSupabase,
  sendAdminCommandToSupabase,
  updatePlayerInSupabase,
  deletePlayerFromSupabase,
  resetAllPlayersInSupabase,
  clearAllPlayersFromSupabase,
  supabase,
} from "../utils/supabaseClient";

import "./AdminCommand.css";

const ADMIN_PIN    = "1986";
const CHANNEL_NAME = "vch-admin-bus";
const POLL_MS      = 1200;

/* ─── Broadcast Helper ──────────────────────────────────── */
function getBus() {
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(CHANNEL_NAME);
}

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
  const [players, setPlayers] = useState([]);
  const [frozen, setFrozen] = useState({});
  const [globalFreeze, setGF] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [copiedTiebreaker, setCopiedTiebreaker] = useState(false);
  const [activePasswordView, setActivePasswordView] = useState(null);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [ejectedStations, setEjectedStations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vch_ejected_stations") || "[]");
    } catch (_) {
      return [];
    }
  });
  const [securityViolations, setSecurityViolations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("vch_admin_violations") || "[]");
    } catch (_) {
      return [];
    }
  });
  const [violationFilter, setViolationFilter] = useState("ALL");
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

  /* Helper to normalize player data from any incoming source */
  const normalizePlayer = useCallback((p) => {
    if (!p || !p.id || p.isMock) return null;
    let trimmedName = (p.name || "").trim();
    if (!trimmedName || trimmedName === "Anonymous Agent") {
      trimmedName = (p.alias || "").trim() || `Station ${String(p.id).slice(-4)}`;
    }

    const chapter = Number(p.current_level || p.currentLevel || p.chapter) || 1;
    const rulesCleared = Number(p.rules_cleared ?? p.rulesCleared) || 0;
    const timeLeft = Number(p.time_left ?? p.timeLeft) ?? 600;
    const score = p.score !== undefined
      ? Number(p.score)
      : rulesCleared * 150 + (chapter - 1) * 600 + Math.max(0, timeLeft);

    return {
      id: p.id,
      alias: (p.alias || "").trim() || trimmedName || `Station ${String(p.id).slice(-4)}`,
      name: trimmedName,
      college: (p.college || "").trim(),
      chapter,
      currentLevel: chapter,
      rulesCleared,
      score,
      timeLeft,
      status: p.is_breached || p.isBreached
        ? "BREACHED"
        : p.is_frozen || p.isFrozen
        ? "FROZEN"
        : p.status || "IN_LOBBY",
      isBreached: Boolean(p.is_breached || p.isBreached),
      isFrozen: Boolean(p.is_frozen || p.isFrozen),
      isEjected: Boolean(p.is_ejected || p.isEjected || p.status === "EJECTED" || p.status?.startsWith("DISQUALIFIED")),
      ejectReason: p.eject_reason || p.ejectReason || p.breachReason || p.reason || "",
      violations: p.violations || (p.lastViolation ? [p.lastViolation] : []),
      completedAt: p.completedAt || p.completed_at || "",
      completedTimestamp: Number(p.completedTimestamp || p.completed_timestamp || 0),
      totalClearanceSeconds: Number(p.totalClearanceSeconds || p.total_clearance_seconds || 0),
      clearanceFormatted: p.clearanceFormatted || p.clearance_formatted || "",
      levelTimes: p.levelTimes || p.level_times || {},
      isGrandWinner: Boolean(p.isGrandWinner || p.is_grand_winner || p.status === "GRAND_VICTORY" || (chapter >= 4 && rulesCleared >= 45)),
      currentPassword: p.current_password || p.currentPassword || p.password || "",
      passwordHistory: p.password_history || p.passwordHistory || [],
      lastSeen: p.last_seen || p.lastSeen || Date.now(),
      isMock: false,
    };
  }, []);

  /* Read real players from local browser storage (instant zero-delay sync across local tabs) */
  const loadLocalPlayers = useCallback(() => {
    const found = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith("vch_player_state_") || key.startsWith("vch_player_data_"))) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              const parsed = JSON.parse(raw);
              if (parsed && parsed.id && !parsed.isMock) {
                const norm = normalizePlayer(parsed);
                if (norm) found.push(norm);
              }
            } catch (_) {}
          }
        }
      }
    } catch (_) {}
    return found;
  }, [normalizePlayer]);

  /* Poll Supabase Cloud, Local Storage & Standalone Admin Server */
  useEffect(() => {
    const syncAllSources = async () => {
      let combinedMap = new Map();

      // 1. Scan Local Storage (instant cross-tab sync)
      const localPlayers = loadLocalPlayers();
      localPlayers.forEach(p => combinedMap.set(p.id, p));

      // 2. Fetch from Supabase Cloud
      try {
        const cloudPlayers = await fetchPlayersFromSupabase();
        if (cloudPlayers && cloudPlayers.length >= 0) {
          setSupabaseConnected(true);
          cloudPlayers.forEach(p => {
            const normalized = normalizePlayer(p);
            if (normalized) {
              combinedMap.set(normalized.id, {
                ...(combinedMap.get(normalized.id) || {}),
                ...normalized,
              });
            }
          });
        }
      } catch (_) {
        setSupabaseConnected(false);
      }

      // 3. Fetch from Standalone Admin Server on Port 5176 (if running)
      try {
        const res = await fetch("http://localhost:5176/api/state");
        const data = await res.json();
        if (data.players && Array.isArray(data.players)) {
          data.players.forEach(p => {
            const normalized = normalizePlayer(p);
            if (normalized) {
              combinedMap.set(normalized.id, {
                ...(combinedMap.get(normalized.id) || {}),
                ...normalized,
              });
            }
          });
        }
        if (data.ejectedPlayers && Array.isArray(data.ejectedPlayers)) {
          setEjectedStations(prev => {
            const map = new Map(prev.map(s => [s.id, s]));
            data.ejectedPlayers.forEach(ep => map.set(ep.id, ep));
            const merged = Array.from(map.values()).slice(0, 50);
            try { localStorage.setItem("vch_ejected_stations", JSON.stringify(merged)); } catch (_) {}
            return merged;
          });
        }
        if (data.securityViolations && Array.isArray(data.securityViolations)) {
          setSecurityViolations(prev => {
            const map = new Map(prev.map(v => [v.id, v]));
            data.securityViolations.forEach(sv => map.set(sv.id, sv));
            const merged = Array.from(map.values()).sort((a,b) => b.timestamp - a.timestamp).slice(0, 100);
            try { localStorage.setItem("vch_admin_violations", JSON.stringify(merged)); } catch (_) {}
            return merged;
          });
        }
        if (typeof data.gameState?.globalFreeze === "boolean") {
          setGF(data.gameState.globalFreeze);
        }
      } catch (_) {}

      // 4. Fetch Global Game State from Supabase
      try {
        const cloudState = await fetchGameStateFromSupabase();
        if (cloudState && typeof cloudState.global_freeze === "boolean") {
          setGF(cloudState.global_freeze);
        }
      } catch (_) {}

      // Commit merged roster - STRICTLY EXCLUDE EJECTED PARTICIPANTS FROM ACTIVE GRID
      const rawList = Array.from(combinedMap.values());
      const ejectedIdSet = new Set(ejectedStations.map(s => s.id));

      const activeList = [];
      const newlyDetectedEjected = [];

      for (const p of rawList) {
        if (ejectedIdSet.has(p.id) || p.isEjected || p.status === "EJECTED" || p.status?.startsWith("DISQUALIFIED")) {
          if (!ejectedIdSet.has(p.id)) {
            newlyDetectedEjected.push({
              id: p.id,
              alias: p.alias,
              name: p.name,
              college: p.college,
              reason: p.ejectReason || p.breachReason || "Security Violation / Disqualified",
              time: new Date().toLocaleTimeString(),
              level: p.currentLevel,
              score: p.score,
              rulesCleared: p.rulesCleared,
            });
          }
        } else {
          activeList.push(p);
        }
      }

      if (newlyDetectedEjected.length > 0) {
        setEjectedStations(prev => {
          const updated = [...newlyDetectedEjected, ...prev].slice(0, 50);
          try { localStorage.setItem("vch_ejected_stations", JSON.stringify(updated)); } catch (_) {}
          return updated;
        });
      }

      activeList.sort((a, b) => b.score - a.score);
      setPlayers(activeList);
    };

    syncAllSources();
    const id = setInterval(syncAllSources, POLL_MS);
    return () => clearInterval(id);
  }, [loadLocalPlayers, normalizePlayer, ejectedStations]);

  /* Real-time Supabase Realtime channel subscription */
  useEffect(() => {
    try {
      const channel = supabase
        .channel("vch_admin_realtime")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "vch_players" },
          (payload) => {
            if (payload.eventType === "DELETE") {
              const delId = payload.old?.id;
              if (delId) {
                setPlayers(prev => prev.filter(p => p.id !== delId));
              }
            } else if (payload.new && payload.new.id) {
              const updated = normalizePlayer(payload.new);
              if (updated) {
                setPlayers(prev => {
                  const existing = prev.some(item => item.id === updated.id);
                  if (existing) {
                    return prev.map(item => item.id === updated.id ? updated : item).sort((a, b) => b.score - a.score);
                  }
                  return [...prev, updated].sort((a, b) => b.score - a.score);
                });
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (_) {}
  }, [normalizePlayer]);

  /* Broadcast channel listener (instant cross-window dispatch) */
  useEffect(() => {
    busRef.current = getBus();
    if (!busRef.current) return;

    busRef.current.onmessage = (evt) => {
      const { type, player, playerId: pid, frozen: f } = evt.data || {};

      // Handles both { type: "player_update", player } and flat { type: "playerUpdate", ... }
      if ((type === "player_update" || type === "playerUpdate") && (player || evt.data.id)) {
        const rawPlayer = player || evt.data;
        const mapped = normalizePlayer(rawPlayer);
        if (mapped) {
          setPlayers(prev => {
            const existing = prev.some(item => item.id === mapped.id);
            if (existing) {
              return prev.map(item => item.id === mapped.id ? { ...item, ...mapped } : item).sort((a, b) => b.score - a.score);
            }
            return [...prev, mapped].sort((a, b) => b.score - a.score);
          });
        }
      } else if (type === "remove") {
        setPlayers(prev => prev.filter(p => p.id !== pid));
      } else if (type === "purge_roster") {
        setPlayers([]);
      } else if (type === "freeze") {
        setFrozen(prev => ({ ...prev, [pid]: f }));

        setPlayers(prev => prev.map(p => p.id === pid ? { ...p, isFrozen: f } : p));
      } else if (type === "unfreeze") {
        setFrozen(prev => ({ ...prev, [pid]: false }));
        setPlayers(prev => prev.map(p => p.id === pid ? { ...p, isFrozen: false, isBreached: false } : p));
      } else if (type === "globalFreeze") {
        setGF(f);
      }
    };

    return () => busRef.current?.close();
  }, [normalizePlayer]);

  /* Listen for localStorage changes across browser tabs */
  useEffect(() => {
    const handleStorageChange = () => {
      const localPlayers = loadLocalPlayers();
      if (localPlayers.length > 0) {
        setPlayers(prev => {
          const map = new Map(prev.map(p => [p.id, p]));
          localPlayers.forEach(lp => map.set(lp.id, { ...(map.get(lp.id) || {}), ...lp }));
          return Array.from(map.values()).sort((a, b) => b.score - a.score);
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [loadLocalPlayers]);

  /* Auto-scroll log */
  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight);
  }, [log]);

  /* ── Action Handlers ── */
  const toggleFreeze = useCallback((id, alias) => {
    SoundEngine.init();
    setFrozen(prev => {
      const nextFrozen = !prev[id];
      const action = nextFrozen ? "EXECUTIVE LOCKDOWN (FROZEN)" : "LOCKDOWN LIFTED (THAWED)";
      SoundEngine[nextFrozen ? "playFreeze" : "playUnlock"]();
      addLog(`Director Bennett applied ${action} on station ${alias} (${id})`);

      // 1. Supabase Cloud Sync
      updatePlayerInSupabase(id, { isFrozen: nextFrozen });
      sendAdminCommandToSupabase({
        action: nextFrozen ? "FREEZE_PLAYER" : "UNFREEZE_PLAYER",
        playerId: id,
      });

      // 2. BroadcastChannel
      broadcast({ type: nextFrozen ? "freeze" : "unfreeze", playerId: id, frozen: nextFrozen });

      // 3. Port 5176 Server
      fetch("http://localhost:5176/api/admin/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: nextFrozen ? "FREEZE_PLAYER" : "UNFREEZE_PLAYER",
          playerId: id,
        }),
      }).catch(() => {});

      // 4. Update local state
      setPlayers(pls => pls.map(p => p.id === id ? { ...p, isFrozen: nextFrozen } : p));
      return { ...prev, [id]: nextFrozen };
    });
  }, [addLog, broadcast]);

  const toggleGlobalFreeze = useCallback(() => {
    SoundEngine.init();
    setGF(prev => {
      const next = !prev;
      SoundEngine[next ? "playFreeze" : "playUnlock"]();
      addLog(`DIRECTOR BENNETT: GLOBAL VAULT ${next ? "LOCKDOWN ARMED" : "LOCKDOWN RELEASED"}`);

      // 1. Supabase Cloud Sync
      sendAdminCommandToSupabase({
        action: next ? "GLOBAL_FREEZE" : "GLOBAL_UNFREEZE",
        globalFreeze: next,
      });

      // 2. BroadcastChannel
      broadcast({ type: "globalFreeze", frozen: next });

      // 3. Port 5176 Server
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

    const currentPlayer = players.find(p => p.id === id);
    const nextChapter = Math.min((currentPlayer?.chapter || 1) + 1, 4);

    setPlayers(prev => prev.map(p =>
      p.id === id ? { ...p, chapter: nextChapter, currentLevel: nextChapter } : p
    ));
    addLog(`Director Bennett authorized vault tier advance to Floor ${nextChapter} for ${alias} (${id})`);

    // 1. Supabase Cloud Sync
    updatePlayerInSupabase(id, { currentLevel: nextChapter });
    sendAdminCommandToSupabase({
      action: "ADVANCE_PLAYER",
      playerId: id,
      targetLevel: nextChapter,
    });

    // 2. BroadcastChannel
    broadcast({ type: "advance", playerId: id, targetLevel: nextChapter });

    // 3. Port 5176 Server
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "ADVANCE_PLAYER", playerId: id, level: nextChapter }),
    }).catch(() => {});
  }, [players, addLog, broadcast]);

  const removePlayer = useCallback((id, alias) => {
    SoundEngine.init();
    SoundEngine.playAlert();

    const target = players.find(p => p.id === id);

    setPlayers(prev => prev.filter(p => p.id !== id));
    setEjectedStations(prev => {
      const updated = [
        {
          id,
          alias: target?.alias || alias,
          name: target?.name || "",
          college: target?.college || "",
          reason: "Security clearance revoked by Director Bennett",
          time: new Date().toLocaleTimeString(),
          level: target?.currentLevel || 1,
          score: target?.score || 0,
          rulesCleared: target?.rulesCleared || 0,
        },
        ...prev.filter(s => s.id !== id)
      ];
      try { localStorage.setItem("vch_ejected_stations", JSON.stringify(updated.slice(0, 50))); } catch (_) {}
      return updated.slice(0, 50);
    });

    const ejectViolation = {
      id: "VIO_" + Date.now(),
      playerId: id,
      alias: target?.alias || alias,
      name: target?.name || "",
      college: target?.college || "",
      type: "ADMIN_EJECT",
      reason: "Security clearance manually revoked by Chief Director Bennett",
      level: target?.currentLevel || 1,
      timestamp: Date.now(),
      formattedTime: new Date().toLocaleTimeString(),
      eliminated: true,
    };
    setSecurityViolations(prev => {
      const next = [ejectViolation, ...prev].slice(0, 100);
      try { localStorage.setItem("vch_admin_violations", JSON.stringify(next)); } catch (_) {}
      return next;
    });

    addLog(`Director Bennett revoked security clearance & ejected ${alias} (${id})`);

    // 1. Supabase Cloud Sync
    deletePlayerFromSupabase(id);
    sendAdminCommandToSupabase({ action: "REMOVE_PLAYER", playerId: id, reason: "Revoked by Director Bennett" });

    // 2. Clear from local storage
    try {
      localStorage.removeItem("vch_player_state_" + id);
      localStorage.removeItem("vch_player_data_" + id);
    } catch (_) {}

    // 3. BroadcastChannel
    broadcast({ type: "remove", playerId: id });

    // 4. Port 5176 Server
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "REMOVE_PLAYER", playerId: id, reason: "Revoked by Director Bennett" }),
    }).catch(() => {});
  }, [players, addLog, broadcast]);

  const sendEjectedToNameInput = useCallback(() => {
    SoundEngine.init();
    SoundEngine.playUnlock();
    addLog("Director Bennett dispatched command: Reset all ejected terminals to Name Input registration");

    // 1. Supabase Cloud Sync
    sendAdminCommandToSupabase({ action: "RESET_TO_NAME_INPUT", target: "ejected" });

    // 2. BroadcastChannel
    broadcast({ type: "reset_to_name_input", target: "ejected" });

    // 3. Port 5176 Server
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "RESET_TO_NAME_INPUT", target: "ejected" }),
    }).catch(() => {});

    setEjectedStations([]);
    try { localStorage.removeItem("vch_ejected_stations"); } catch (_) {}
  }, [addLog, broadcast]);

  const sendPlayerToNameInput = useCallback((id, alias) => {
    SoundEngine.init();
    SoundEngine.playUnlock();
    addLog(`Director Bennett reset ${alias} (${id}) back to Name Input registration`);

    setPlayers(prev => prev.filter(p => p.id !== id));
    setEjectedStations(prev => {
      const updated = prev.filter(s => s.id !== id);
      try { localStorage.setItem("vch_ejected_stations", JSON.stringify(updated)); } catch (_) {}
      return updated;
    });

    // 1. Supabase Cloud Sync
    deletePlayerFromSupabase(id);
    sendAdminCommandToSupabase({ action: "RESET_TO_NAME_INPUT", playerId: id });

    // 2. Clear local storage
    try {
      localStorage.removeItem("vch_player_state_" + id);
      localStorage.removeItem("vch_player_data_" + id);
    } catch (_) {}

    // 3. BroadcastChannel
    broadcast({ type: "reset_to_name_input", playerId: id });

    // 4. Port 5176 Server
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "RESET_TO_NAME_INPUT", playerId: id }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  /* ── Official Championship Tiebreaker Rankings ── */
  const tiebreakerRankings = useMemo(() => {
    const list = [...players];
    return list.sort((a, b) => {
      // 1. Level 4 Cleared / Grand Victory (Priority 1)
      const aWon = a.isGrandWinner || a.status === "GRAND_VICTORY" || (a.currentLevel >= 4 && a.rulesCleared >= 45);
      const bWon = b.isGrandWinner || b.status === "GRAND_VICTORY" || (b.currentLevel >= 4 && b.rulesCleared >= 45);
      if (aWon && !bWon) return -1;
      if (!aWon && bWon) return 1;

      // Both cleared Level 4: TIEBREAKER IS FASTEST CLEARANCE TIME
      if (aWon && bWon) {
        const aSec = a.totalClearanceSeconds || 999999;
        const bSec = b.totalClearanceSeconds || 999999;
        if (aSec !== bSec) return aSec - bSec;
        const aTs = a.completedTimestamp || 9999999999999;
        const bTs = b.completedTimestamp || 9999999999999;
        if (aTs !== bTs) return aTs - bTs;
        return b.score - a.score;
      }

      // Neither cleared Level 4: sort by highest level, then most rules, then score
      if (b.currentLevel !== a.currentLevel) return b.currentLevel - a.currentLevel;
      if (b.rulesCleared !== a.rulesCleared) return b.rulesCleared - a.rulesCleared;
      return b.score - a.score;
    });
  }, [players]);

  const copyTiebreakerReport = useCallback(() => {
    if (tiebreakerRankings.length === 0) return;
    const header = `🏆 EL BANCO CORRUPTO GRANDE // OFFICIAL CASH PRIZE TIEBREAKER REPORT\nTimestamp: ${new Date().toLocaleString()}\n` +
      `================================================================================\n`;
    const rows = tiebreakerRankings.map((p, idx) => {
      const medal = idx === 0 ? "🥇 [1ST PLACE - CASH PRIZE WINNER]" : idx === 1 ? "🥈 [2ND PLACE]" : idx === 2 ? "🥉 [3RD PLACE]" : `   [#${idx + 1}]`;
      const timeStr = p.clearanceFormatted || (p.totalClearanceSeconds ? `${p.totalClearanceSeconds}s` : "In Progress");
      const finishStr = p.completedAt ? `Finished at: ${p.completedAt}` : `Level: ${p.currentLevel} (Rules: ${p.rulesCleared})`;
      return `${medal} ${p.alias} (${p.name || "Agent"}) - ${p.college || "Vice City"}\n   Clearance Time: ${timeStr} | Score: $${p.score.toLocaleString()} | ${finishStr}`;
    }).join("\n\n");

    const fullReport = header + rows;
    navigator.clipboard.writeText(fullReport).then(() => {
      setCopiedTiebreaker(true);
      setTimeout(() => setCopiedTiebreaker(false), 2500);
      SoundEngine.init();
      SoundEngine.playUnlock();
    }).catch(() => {});
  }, [tiebreakerRankings]);

  const filteredViolations = useMemo(() => {
    if (violationFilter === "ELIMINATIONS") return securityViolations.filter(v => v.eliminated);
    if (violationFilter === "FULLSCREEN") return securityViolations.filter(v => v.type === "FULLSCREEN_ESCAPE");
    if (violationFilter === "TAB_SWITCH") return securityViolations.filter(v => v.type === "TAB_SWITCH");
    return securityViolations;
  }, [securityViolations, violationFilter]);

  const startStoryAll = useCallback(() => {
    SoundEngine.init();
    SoundEngine.playWantedStar();
    addLog("Director Bennett dispatched Story Cutscene directive to all bank stations");

    // 1. Supabase Cloud Sync
    sendAdminCommandToSupabase({ action: "START_STORY_MODE" });

    // 2. BroadcastChannel
    broadcast({ type: "start_story" });

    // 3. Port 5176 Server
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

    // 1. Supabase Cloud Sync
    sendAdminCommandToSupabase({ action: "TRIGGER_SIREN" });

    // 2. BroadcastChannel
    broadcast({ type: "siren" });

    // 3. Port 5176 Server
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "TRIGGER_SIREN" }),
    }).catch(() => {});
  }, [addLog, broadcast]);

  const resetLobbyAll = useCallback(() => {
    if (!window.confirm("⚠️ Director Bennett: Recall all bank stations back to the Lobby? This will reset active sessions.")) return;
    SoundEngine.init();
    SoundEngine.playAlert();
    addLog("Director Bennett issued mandatory recall: all stations reset to lobby");

    // 1. Supabase Cloud Sync
    resetAllPlayersInSupabase();
    sendAdminCommandToSupabase({ action: "RESET_TO_LOBBY" });

    // 2. BroadcastChannel
    broadcast({ type: "reset_lobby" });

    // 3. Port 5176 Server
    fetch("http://localhost:5176/api/admin/command", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "RESET_TO_LOBBY" }),
    }).catch(() => {});

    // 4. Update local state
    setPlayers(prev => prev.map(p => ({
      ...p,
      chapter: 1,
      currentLevel: 1,
      rulesCleared: 0,
      score: 0,
      status: "IN_LOBBY",
      isBreached: false,
      isFrozen: false,
      currentPassword: "",
    })));
  }, [addLog, broadcast]);

  const clearRosterAll = useCallback(async () => {
    if (!window.confirm("Director Bennett: Permanently purge all participant records and reset surveillance grid? This cannot be undone.")) return;
    SoundEngine.init();
    SoundEngine.playAlert();
    addLog("Director Bennett permanently purged all participant records");

    // 1. Supabase Cloud Sync
    await clearAllPlayersFromSupabase();
    sendAdminCommandToSupabase({ action: "PURGE_ROSTER" });

    // 2. Clear local storage player items
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("vch_player_state_") || k.startsWith("vch_player_data_"))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (_) {}

    // 3. BroadcastChannel
    broadcast({ type: "purge_roster" });

    // 4. Update local state
    setPlayers([]);
  }, [addLog, broadcast]);

  const handleCopyPassword = useCallback((playerId, password, alias) => {

    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopiedId(playerId);
    SoundEngine.init();
    SoundEngine.playClick();
    addLog(`Director Bennett copied live vault key for ${alias}: "${password}"`);
    setTimeout(() => setCopiedId(null), 1800);
  }, [addLog]);

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
              <span className={`sync-indicator-pill ${supabaseConnected ? "sync-online" : "sync-local"}`}>
                {supabaseConnected ? "🟢 SUPABASE CLOUD SYNC" : "📡 LOCAL DISPATCH BUS"}
              </span>
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
            id="reset-ejected-btn"
            type="button"
            className="boss-btn boss-btn-nameinput"
            onClick={sendEjectedToNameInput}
            title="Redirect ejected / disqualified players back to the Name Input registration screen"
          >
            <span className="btn-icon">📝</span>
            <span className="btn-text">
              EJECTED ➔ NAME INPUT {ejectedStations.length > 0 ? `(${ejectedStations.length})` : ""}
            </span>
          </button>

          <button
            id="purge-roster-btn"
            type="button"
            className="boss-btn boss-btn-eject"
            onClick={clearRosterAll}
            title="Permanently purge all participant records from database"
          >
            <span className="btn-icon">🗑️</span>
            <span className="btn-text">PURGE ROSTER</span>
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
              {players.length} Live Agent{players.length === 1 ? "" : "s"} Connected
            </span>
          </div>
        </div>

        <div className="boss-metric-card pink-border">
          <span className="metric-icon">🔑</span>
          <div className="metric-info">
            <span className="metric-label">ACTIVE CIPHER KEYS</span>
            <span className="metric-val pink-glow">
              {players.filter(p => Boolean(p.currentPassword)).length} Keys Intercepted
            </span>
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

      {/* ── CASH PRIZE CHAMPIONSHIP TIEBREAKER & LEADERBOARD ── */}
      <section className="tiebreaker-section">
        <div className="tiebreaker-header-bar">
          <div className="tiebreaker-title-wrap">
            <span className="tiebreaker-crown-icon">👑</span>
            <div>
              <h2 className="tiebreaker-main-title">
                OFFICIAL CASH PRIZE CHAMPIONSHIP PODIUM & TIEBREAKER
              </h2>
              <p className="tiebreaker-sub-directive">
                Tiebreaker Protocol: Ranked by (1) Final Level 4 Clearance, (2) Total Rules Cleared, (3) Lowest Total Clearance Time, (4) Earliest Wall-Clock Finish Timestamp.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="tiebreaker-copy-btn"
            onClick={copyTiebreakerReport}
            title="Copy official winner report and tiebreaker breakdown to clipboard"
          >
            <span>📋</span>
            <span>{copiedTiebreaker ? "REPORT COPIED TO CLIPBOARD!" : "COPY CASH PRIZE PODIUM REPORT"}</span>
          </button>
        </div>

        <div className="boss-table-wrapper">
          <table className="tiebreaker-table" aria-label="Official Cash Prize Tiebreaker Table">
            <thead>
              <tr>
                <th>PODIUM RANK</th>
                <th>STATION ALIAS & AGENT</th>
                <th>COLLEGE / TEAM</th>
                <th>VAULT STATUS</th>
                <th>RULES CLEARED</th>
                <th>TOTAL CLEARANCE TIME</th>
                <th>OFFICIAL FINISH TIMESTAMP</th>
                <th>FLOOR BREAKDOWN</th>
              </tr>
            </thead>
            <tbody>
              {tiebreakerRankings.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: "24px", color: "rgba(255, 242, 227, 0.5)" }}>
                    No participant clearance records recorded yet. Stations will be automatically evaluated here as they advance through the 4 vault floors.
                  </td>
                </tr>
              ) : (
                tiebreakerRankings.map((p, idx) => {
                  const isWinner = idx === 0;
                  const isRunnerUp = idx === 1;
                  const isThird = idx === 2;
                  const isLevel4Cleared = p.isGrandWinner || p.status === "GRAND_VICTORY" || (p.currentLevel >= 4 && p.rulesCleared >= 45);

                  return (
                    <tr
                      key={p.id}
                      className={isWinner ? "tiebreaker-row-winner" : isRunnerUp ? "tiebreaker-row-runnerup" : ""}
                    >
                      <td>
                        <span className={`rank-badge ${isWinner ? "rank-1" : isRunnerUp ? "rank-2" : isThird ? "rank-3" : "rank-standard"}`}>
                          {isWinner ? "🥇 1ST PLACE" : isRunnerUp ? "🥈 2ND PLACE" : isThird ? "🥉 3RD PLACE" : `#${idx + 1}`}
                          {isWinner && <span className="cash-prize-tag">💵 CASH PRIZE WINNER</span>}
                        </span>
                      </td>
                      <td>
                        <strong>{p.alias}</strong>
                        {p.name && <div style={{ fontSize: "11px", color: "rgba(255, 242, 227, 0.6)" }}>{p.name}</div>}
                      </td>
                      <td>{p.college || "Vice City Division"}</td>
                      <td>
                        <span className={`cell-status-chip ${isLevel4Cleared ? "status-victory" : "status-active"}`}>
                          {isLevel4Cleared ? "🏆 LEVEL 4 COMPLETED" : `FLOOR ${p.currentLevel || 1} IN PROGRESS`}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                          {p.rulesCleared} / {p.currentLevel >= 4 ? 45 : p.currentLevel === 3 ? 32 : p.currentLevel === 2 ? 20 : 10}
                        </span>
                      </td>
                      <td>
                        <span className="clearance-time-highlight">
                          {p.clearanceFormatted || (p.totalClearanceSeconds ? `${p.totalClearanceSeconds}s` : "--")}
                        </span>
                      </td>
                      <td>
                        <span className="completion-clock-time">
                          {p.completedAt || (isLevel4Cleared ? "Recorded" : "--")}
                        </span>
                      </td>
                      <td>
                        <div className="floor-times-summary">
                          {p.levelTimes && Object.keys(p.levelTimes).length > 0 ? (
                            Object.entries(p.levelTimes).map(([lvl, sec]) => `FL.${lvl}: ${sec}s`).join(" · ")
                          ) : (
                            "Floor timing active"
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── LIVE STATION SURVEILLANCE TABLE ── */}
      <section className="boss-table-section">
        <div className="table-header-bar">
          <div className="table-title-group">
            <h2 className="table-heading">
              <span className="table-icon">🔍</span>
              REAL-TIME TERMINAL SURVEILLANCE & MOVE INSPECTOR
            </h2>
            <span className="table-sub-count">
              MONITORING {players.length} LIVE STATIONS ACROSS 4 FLOORS · PASSWORDS LOGGED IN REAL-TIME
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
                <th>LIVE VAULT KEY / PASSWORD</th>
                <th>SECURITY STATUS</th>
                <th>LOCKDOWN</th>
                <th>ADVANCE FLOOR</th>
                <th>NAME INPUT</th>
                <th>DISQUALIFY</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 ? (
                <tr>
                  <td colSpan={11} className="table-empty-cell">
                    <div className="radar-empty-container">
                      <div className="radar-anim-wrapper">
                        <div className="radar-circle radar-c1"></div>
                        <div className="radar-circle radar-c2"></div>
                        <div className="radar-sweep-beam"></div>
                        <span className="radar-core-pulse">📡</span>
                      </div>
                      <div className="radar-content-text">
                        <h3 className="radar-empty-title">
                          ACTIVE FREQUENCY SCANNER // ZERO AGENT TERMINALS CURRENTLY CONNECTED
                        </h3>
                        <p className="radar-empty-desc">
                          All prebuilt mock items have been removed. Central Dispatch is actively listening on Supabase Cloud and local broadcast channels.
                          Terminals will automatically appear in this surveillance grid the moment players join from the Bank Lobby.
                        </p>
                        <div className="radar-actions-row">
                          <a
                            href="./#/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="radar-test-btn"
                          >
                            <span>🎮 OPEN PLAYER TERMINAL IN NEW TAB ↗</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                players.map(p => {
                  const isF = frozen[p.id] || p.isFrozen || globalFreeze;
                  const floorCfg = VAULT_FLOORS[p.chapter] || VAULT_FLOORS[1];
                  const hasPw = Boolean(p.currentPassword);

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
                          {p.name && p.name !== p.alias && (
                            <span className="agent-real-name">({p.name})</span>
                          )}
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
                        <span className="rules-number">{p.rulesCleared ?? 0}</span>
                      </td>

                      {/* Score */}
                      <td className="cell-score">
                        <span className="score-gold">
                          ${String(p.score || 0).padStart(6, "0")}
                        </span>
                      </td>

                      {/* Live Password / Vault Key */}
                      <td className="cell-password">
                        <div className="admin-pw-inspector-box">
                          {hasPw ? (
                            <div className="pw-chip-container">
                              <span
                                className="pw-chip-text"
                                title={`Full password: ${p.currentPassword}`}
                                onClick={() => setActivePasswordView(p)}
                              >
                                {p.currentPassword.length > 20
                                  ? p.currentPassword.slice(0, 18) + "…"
                                  : p.currentPassword}
                              </span>
                              <span className="pw-chip-len">({[...p.currentPassword].length}c)</span>
                              <button
                                type="button"
                                className="pw-quick-copy-btn"
                                onClick={() => handleCopyPassword(p.id, p.currentPassword, p.alias)}
                                title="Copy password to clipboard"
                              >
                                {copiedId === p.id ? "✓" : "📋"}
                              </button>
                            </div>
                          ) : (
                            <span className="pw-awaiting-label">— Awaiting Input</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="cell-status">
                        {p.isBreached ? (
                          <span className="status-badge breached">🚨 BREACHED</span>
                        ) : isF ? (
                          <span className="status-badge locked">❄️ FROZEN</span>
                        ) : (
                          <span className={`status-badge ${(p.status || "active").toLowerCase()}`}>
                            {p.status ? p.status.toUpperCase() : "ACTIVE"}
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

                      {/* Return to Name Input */}
                      <td className="cell-action">
                        <button
                          id={`nameinput-${p.id}`}
                          type="button"
                          className="boss-cell-btn nameinput-btn"
                          onClick={() => sendPlayerToNameInput(p.id, p.alias)}
                          title="Reset station and send back to Name Input registration"
                        >
                          📝 NAME INPUT
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

      {/* ── DISQUALIFIED & EJECTED TERMINALS ROSTER ── */}
      <section className="ejected-roster-section">
        <div className="ejected-roster-header">
          <div className="ejected-title-wrap">
            <span style={{ fontSize: "24px" }}>🚫</span>
            <div>
              <h2 className="ejected-main-title">
                DISQUALIFIED & EJECTED TERMINALS ({ejectedStations.length})
              </h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255, 242, 227, 0.6)" }}>
                Terminals eliminated due to fullscreen exits, tab switches, or security clearance revocation.
              </span>
            </div>
          </div>
          {ejectedStations.length > 0 && (
            <button
              type="button"
              className="ejected-restore-all-btn"
              onClick={sendEjectedToNameInput}
              title="Reset all eliminated/ejected stations and return them to the Name Input registration screen"
            >
              ↩ RESTORE ALL EJECTED TO NAME INPUT
            </button>
          )}
        </div>

        <div className="boss-table-wrapper">
          <table className="boss-table" aria-label="Ejected stations table">
            <thead>
              <tr>
                <th>STATION ID & ALIAS</th>
                <th>AGENT NAME</th>
                <th>COLLEGE / INSTITUTION</th>
                <th>DISQUALIFICATION REASON</th>
                <th>TIME ELIMINATED</th>
                <th>LAST FLOOR</th>
                <th>RESTORE CLEARANCE</th>
              </tr>
            </thead>
            <tbody>
              {ejectedStations.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "rgba(255, 242, 227, 0.5)" }}>
                    No eliminated or ejected terminals. When a player is disqualified or ejected, they will automatically appear here instead of the active surveillance grid.
                  </td>
                </tr>
              ) : (
                ejectedStations.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="station-id-cell">{s.id.slice(0, 10)}</span>
                      <div style={{ fontWeight: 800, color: "#FF8585" }}>{s.alias}</div>
                    </td>
                    <td>{s.name || "Agent"}</td>
                    <td>{s.college || "Vice City Division"}</td>
                    <td>
                      <span className="ejected-reason-tag">
                        {s.reason || "Security violation / clearance revoked"}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-mono)", color: "rgba(255, 242, 227, 0.8)" }}>
                      {s.time || "--"}
                    </td>
                    <td>
                      <span className="legend-chip fl1" style={{ fontSize: "10px" }}>
                        FL.{s.level || 1}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="ejected-restore-single-btn"
                        onClick={() => sendPlayerToNameInput(s.id, s.alias)}
                        title="Reset this station back to Name Input registration"
                      >
                        📝 SEND TO NAME INPUT
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── BLACK BOX AUDIT LOG: ILLEGAL ACTIONS & VIOLATIONS ── */}
      <section className="audit-log-section">
        <div className="audit-header-bar">
          <div className="audit-title-wrap">
            <span style={{ fontSize: "24px" }}>🚨</span>
            <div>
              <h2 className="audit-main-title">
                BLACK BOX AUDIT: ILLEGAL ACTIONS & SECURITY VIOLATIONS ({securityViolations.length})
              </h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255, 242, 227, 0.6)" }}>
                Live tamper detection: Records escaping fullscreen, switching tabs, and devtools inspection attempts.
              </span>
            </div>
          </div>
          <div className="audit-filters-group">
            {["ALL", "ELIMINATIONS", "FULLSCREEN", "TAB_SWITCH"].map((f) => (
              <button
                key={f}
                type="button"
                className={`audit-filter-btn ${violationFilter === f ? "active" : ""}`}
                onClick={() => setViolationFilter(f)}
              >
                {f.replace("_", " ")}
              </button>
            ))}
            {securityViolations.length > 0 && (
              <button
                type="button"
                className="audit-clear-btn"
                onClick={() => {
                  setSecurityViolations([]);
                  try { localStorage.removeItem("vch_admin_violations"); } catch (_) {}
                }}
                title="Clear current session audit log"
              >
                CLEAR LOG
              </button>
            )}
          </div>
        </div>

        <div className="boss-table-wrapper">
          <table className="audit-table" aria-label="Security violation audit table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>TERMINAL ALIAS & AGENT</th>
                <th>COLLEGE / TEAM</th>
                <th>VIOLATION CATEGORY</th>
                <th>SEVERITY</th>
                <th>FLOOR</th>
                <th>INCIDENT NARRATIVE</th>
              </tr>
            </thead>
            <tbody>
              {filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "20px", color: "rgba(255, 242, 227, 0.5)" }}>
                    Zero security violations recorded. The vault perimeter is fully secure.
                  </td>
                </tr>
              ) : (
                filteredViolations.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontFamily: "var(--font-mono)", color: "var(--boss-cyan)", whiteSpace: "nowrap" }}>
                      {v.formattedTime || new Date(v.timestamp).toLocaleTimeString()}
                    </td>
                    <td>
                      <strong>{v.alias}</strong>
                      {v.name && <div style={{ fontSize: "10px", color: "rgba(255, 242, 227, 0.5)" }}>{v.name}</div>}
                    </td>
                    <td>{v.college || "Vice City"}</td>
                    <td>
                      <span className={v.eliminated ? "audit-badge-critical" : "audit-badge-warning"}>
                        {v.type}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, color: v.eliminated ? "#FF4B4B" : "var(--boss-gold)" }}>
                        {v.eliminated ? "🚨 ELIMINATED" : "⚠️ FLAGGED"}
                      </span>
                    </td>
                    <td>FL.{v.level || 1}</td>
                    <td style={{ color: "rgba(255, 242, 227, 0.85)" }}>
                      {v.reason}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FULL PASSWORD INSPECTION MODAL ── */}
      {activePasswordView && (
        <div className="pw-modal-overlay" onClick={() => setActivePasswordView(null)}>
          <div className="pw-modal-card" onClick={e => e.stopPropagation()}>
            <div className="pw-modal-header">
              <div className="pw-modal-title">
                <span>🔐 VAULT CIPHER INSPECTION:</span>
                <span className="pw-modal-agent">{activePasswordView.alias}</span>
              </div>
              <button
                type="button"
                className="pw-modal-close"
                onClick={() => setActivePasswordView(null)}
              >
                ✕
              </button>
            </div>
            <div className="pw-modal-body">
              <div className="pw-modal-field-group">
                <label className="pw-modal-label">LIVE MASTER KEY SUGGESTION</label>
                <div className="pw-modal-secret-box">
                  <span className="pw-modal-secret-text">{activePasswordView.currentPassword || "(Empty)"}</span>
                  <button
                    type="button"
                    className="boss-cell-btn pw-modal-copy-btn"
                    onClick={() => handleCopyPassword(activePasswordView.id, activePasswordView.currentPassword, activePasswordView.alias)}
                  >
                    {copiedId === activePasswordView.id ? "✓ COPIED" : "📋 COPY KEY"}
                  </button>
                </div>
              </div>
              <div className="pw-modal-meta-row">
                <span className="pw-modal-pill">Length: {[...(activePasswordView.currentPassword || "")].length} characters</span>
                <span className="pw-modal-pill">Rules Cleared: {activePasswordView.rulesCleared}</span>
                <span className="pw-modal-pill">Current Level: Floor {activePasswordView.chapter}</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
