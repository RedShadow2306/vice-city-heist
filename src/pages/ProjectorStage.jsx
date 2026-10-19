/**
 * ProjectorStage.jsx
 * Route: /stage (or /leaderboard)
 * Full-screen leaderboard for projection / big-screen display.
 * Synchronizes with Supabase Cloud, BroadcastChannel, and Local Storage.
 * Zero prebuilt demo players: displays real connected players.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import SoundEngine from "../utils/soundEngine";
import { fetchPlayersFromSupabase, fetchGameStateFromSupabase } from "../utils/supabaseClient";
import "./ProjectorStage.css";

const CHANNEL_NAME = "vch-admin-bus";
const MEDALS = ["🥇", "🥈", "🥉"];

function getRankColor(rank) {
  if (rank === 1) return "#ffd700";
  if (rank === 2) return "#c0c0c0";
  if (rank === 3) return "#cd7f32";
  return "#00ffcc88";
}

export default function ProjectorStage() {
  const [board, setBoard]       = useState([]);
  const [frozen, setFrozen]     = useState({});
  const [globalFreeze, setGF]   = useState(false);
  const [flashId, setFlashId]   = useState(null);
  const busRef = useRef(null);
  const prevRanksRef = useRef({});

  const normalizePlayer = useCallback((sp) => {
    if (!sp || !sp.id || sp.isMock) return null;
    let trimmedName = (sp.name || "").trim();
    if (!trimmedName || trimmedName === "Anonymous Agent") {
      trimmedName = (sp.alias || "").trim() || `Station ${String(sp.id).slice(-4)}`;
    }

    const chapter = Number(sp.current_level || sp.currentLevel || sp.chapter) || 1;
    const rulesCleared = Number(sp.rules_cleared ?? sp.rulesCleared) || 0;
    const rawTime = sp.time_left ?? sp.timeLeft;
    const timeLeft = Number.isFinite(Number(rawTime)) ? Number(rawTime) : 600;
    const calculatedScore = sp.score !== undefined
      ? Number(sp.score)
      : rulesCleared * 150 + (chapter - 1) * 600 + Math.max(0, timeLeft);
    const isGrandWinner = Boolean(
      sp.isGrandWinner ||
      sp.is_grand_winner ||
      sp.status === "GRAND_VICTORY" ||
      (chapter >= 4 && rulesCleared >= 59)
    );

    return {
      id: sp.id,
      alias: (sp.alias || "").trim() || trimmedName || `Station ${String(sp.id).slice(-4)}`,
      name: trimmedName,
      college: (sp.college || "").trim(),
      chapter,
      currentLevel: chapter,
      score: calculatedScore,
      rulesCleared,
      timeLeft,
      delta: 0,
      isBreached: Boolean(sp.is_breached || sp.isBreached),
      isGrandWinner,
      status: sp.status || "IN_LOBBY",
      isMock: false,
    };
  }, []);

  const sortProjectorPlayers = useCallback((a, b) => {
    const aWon = Boolean(a.isGrandWinner || a.status === "GRAND_VICTORY");
    const bWon = Boolean(b.isGrandWinner || b.status === "GRAND_VICTORY");
    if (aWon && !bWon) return -1;
    if (!aWon && bWon) return 1;
    return (b.score || 0) - (a.score || 0);
  }, []);

  /* Scan local storage for local player tabs */
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

  /* Poll Supabase Cloud & Local Server for live players */
  useEffect(() => {
    const pollAll = async () => {
      let combinedMap = new Map();

      // 1. Scan Local Storage
      const localPlayers = loadLocalPlayers();
      localPlayers.forEach(p => combinedMap.set(p.id, p));

      // 2. Fetch Supabase Cloud
      try {
        const cloudPlayers = await fetchPlayersFromSupabase();
        if (cloudPlayers && Array.isArray(cloudPlayers)) {
          cloudPlayers.forEach(cp => {
            const normalized = normalizePlayer(cp);
            if (normalized) {
              combinedMap.set(normalized.id, {
                ...(combinedMap.get(normalized.id) || {}),
                ...normalized,
              });
            }
          });
        }
      } catch (_) {}

      // 3. Fetch Standalone Admin Server (if running)
      try {
        const adminUrl = typeof window !== "undefined" ? `http://${window.location.hostname || "localhost"}:5176/api/state` : "http://localhost:5176/api/state";
        const res = await fetch(adminUrl);
        const data = await res.json();
        const serverPlayers = data.players || [];
        if (serverPlayers.length > 0) {
          serverPlayers.forEach(sp => {
            const normalized = normalizePlayer(sp);
            if (normalized) {
              combinedMap.set(normalized.id, {
                ...(combinedMap.get(normalized.id) || {}),
                ...normalized,
              });
            }
          });
        }

        if (typeof data.gameState?.globalFreeze === "boolean") {
          setGF(data.gameState.globalFreeze);
        }
      } catch (_) {}

      // 4. Fetch Global Game State
      try {
        const cloudState = await fetchGameStateFromSupabase();
        if (cloudState && typeof cloudState.global_freeze === "boolean") {
          setGF(cloudState.global_freeze);
        }
      } catch (_) {}

      const sorted = Array.from(combinedMap.values()).sort(sortProjectorPlayers);
      setBoard(sorted);
    };

    pollAll();
    const id = setInterval(pollAll, 1200);
    return () => clearInterval(id);
  }, [loadLocalPlayers, normalizePlayer]);

  /* Detect rank changes → play rank up audio */
  useEffect(() => {
    board.forEach((p, i) => {
      const rank = i + 1;
      const prev = prevRanksRef.current[p.id];
      if (prev !== undefined && rank < prev) {
        SoundEngine.init();
        SoundEngine.playRankUp();
        setFlashId(p.id);
        setTimeout(() => setFlashId(null), 900);
      }
    });
    prevRanksRef.current = Object.fromEntries(board.map((p, i) => [p.id, i + 1]));
  }, [board]);

  /* BroadcastChannel listener from admin and player terminals */
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bus = new BroadcastChannel(CHANNEL_NAME);
    busRef.current = bus;

    bus.onmessage = (evt) => {
      const { type, player, playerId, frozen: f } = evt.data ?? {};

      if ((type === "player_update" || type === "playerUpdate") && (player || evt.data.id)) {
        const raw = player || evt.data;
        const normalized = normalizePlayer(raw);

        setBoard(prev => {
          const map = new Map(prev.map(item => [item.id, item]));
          const existing = map.get(normalized.id);
          const updated = {
            ...normalized,
            delta: existing ? Math.max(0, normalized.score - existing.score) : 0,
          };
          map.set(normalized.id, updated);
          return Array.from(map.values()).sort(sortProjectorPlayers);
        });
      }

      if (type === "freeze")       setFrozen(prev => ({ ...prev, [playerId]: f }));
      if (type === "unfreeze")     setFrozen(prev => ({ ...prev, [playerId]: false }));
      if (type === "globalFreeze") setGF(f);
      if (type === "remove")       setBoard(prev => prev.filter(p => p.id !== playerId));
      if (type === "advance") {
        setBoard(prev => prev.map(p =>
          p.id === playerId ? { ...p, chapter: Math.min((p.chapter || 1) + 1, 4) } : p
        ).sort((a, b) => b.score - a.score));
      }
      if (type === "reset_lobby") {
        setBoard(prev => prev.map(p => ({
          ...p,
          score: 0,
          chapter: 1,
          currentLevel: 1,
          status: "IN_LOBBY",
        })));
      }
    };

    return () => bus.close();
  }, [normalizePlayer]);

  const now = new Date().toLocaleTimeString("en-US", { hour12: false });
  const [tick, setTick] = useState(now);
  useEffect(() => {
    const id = setInterval(() => setTick(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="stage-root">
      {/* header */}
      <header className="stage-header">
        <div className="stage-title-block">
          <h1 className="stage-title glitch-stage" data-text="VICE CITY HEIST">
            VICE CITY HEIST
          </h1>
          <p className="stage-sub">LIVE LEADERBOARD · VYUHA by DAEMON '26 TOURNAMENT BROADCAST</p>
        </div>
        <div className="stage-meta">
          <span className="stage-clock">{tick}</span>
          {globalFreeze && <span className="freeze-badge">❄ FREEZE ACTIVE</span>}
        </div>
      </header>

      {/* leaderboard */}
      <main className="stage-main">
        {board.length === 0 ? (
          <div className="stage-empty-state" style={{
            textAlign: "center",
            padding: "80px 20px",
            fontFamily: "var(--font-mono, monospace)",
            color: "#FFF2E3",
          }}>
            <div style={{ fontSize: "50px", marginBottom: "16px" }}>🏆</div>
            <h2 style={{
              fontFamily: "var(--font-heading, sans-serif)",
              fontSize: "28px",
              color: "#FFD700",
              letterSpacing: "0.06em",
              marginBottom: "12px",
            }}>
              AWAITING AGENTS TO CONNECT FROM THE BANK LOBBY
            </h2>
            <p style={{ color: "rgba(255, 242, 227, 0.6)", fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
              Zero prebuilt mock entities loaded. Real player standings will display on this live projector as agents complete cipher layers.
            </p>
          </div>
        ) : (
          board.map((player, i) => {
            const rank = i + 1;
            const medal = MEDALS[i] ?? `#${rank}`;
            const isFrozen = frozen[player.id] || globalFreeze;
            const isFlash = flashId === player.id;

            return (
              <div
                key={player.id}
                className={`stage-row ${isFrozen ? "frozen-row" : ""} ${isFlash ? "flash-row" : ""}`}
                style={{ borderColor: getRankColor(rank) }}
              >
                <span className="row-rank" style={{ color: getRankColor(rank) }}>
                  {medal}
                </span>

                <div className="row-info">
                  <span className="row-alias">{player.alias}</span>
                  {player.college && <span className="row-college">{player.college}</span>}
                  <span className="row-chapter">FLOOR {player.chapter}</span>
                  {player.isGrandWinner && (
                    <span className="row-grand-winner-badge" style={{
                      background: "linear-gradient(90deg, #FFD700, #FF69B4)",
                      color: "#000",
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "0.75rem",
                      marginLeft: "6px",
                      letterSpacing: "0.05em",
                    }}>
                      👑 HEIST DEFENDED
                    </span>
                  )}
                  {player.isBreached && <span className="row-breach-badge">🚨 BREACHED</span>}
                  {isFrozen && <span className="row-frozen-badge">❄ FROZEN</span>}
                </div>

                <div className="row-score-block">
                  <span className="row-score">${String(player.score).padStart(6, "0")}</span>
                  {player.delta > 0 && (
                    <span className="row-delta">+{player.delta}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* footer */}
      <footer className="stage-footer">
        <span className="footer-ticker">
          {board.length > 0
            ? `★ MONITORING ${board.length} LIVE AGENT TERMINALS ★ DEFEND EL BANCO CORRUPTO GRANDE ★ 10-MINUTE ROUND PROTOCOLS ★`
            : "★ WAITING FOR ACTIVE STATIONS TO JOIN AT / ★ EL BANCO CORRUPTO GRANDE VAULT DEFENSE ★"}
        </span>
      </footer>
    </div>
  );
}
