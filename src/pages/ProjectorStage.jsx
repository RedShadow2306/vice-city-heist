/**
 * ProjectorStage.jsx
 * Route: /stage
 * Full-screen leaderboard for projection / big-screen display.
 * Polls the BroadcastChannel for live score updates from AdminCommand.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import SoundEngine from "../utils/soundEngine";
import "./ProjectorStage.css";

const CHANNEL_NAME = "vch-admin-bus";

const INITIAL_BOARD = [
  { id: "P003", alias: "Syndicate",  score: 520, chapter: 3, delta: 0 },
  { id: "P001", alias: "NeonRider",  score: 350, chapter: 2, delta: 0 },
  { id: "P004", alias: "DataViper",  score: 290, chapter: 2, delta: 0 },
  { id: "P002", alias: "GhostWire",  score: 180, chapter: 1, delta: 0 },
  { id: "P005", alias: "ChromeFox",  score: 100, chapter: 1, delta: 0 },
];

const MEDALS = ["🥇", "🥈", "🥉"];

function getRankColor(rank) {
  if (rank === 1) return "#ffd700";
  if (rank === 2) return "#c0c0c0";
  if (rank === 3) return "#cd7f32";
  return "#00ffcc88";
}

export default function ProjectorStage() {
  const [board, setBoard]       = useState(INITIAL_BOARD);
  const [frozen, setFrozen]     = useState({});
  const [globalFreeze, setGF]   = useState(false);
  const [flashId, setFlashId]   = useState(null);
  const busRef = useRef(null);
  const prevRanksRef = useRef({});

  /* live score ticker */
  useEffect(() => {
    const id = setInterval(() => {
      setBoard(prev => {
        const updated = prev.map(p => ({
          ...p,
          score: frozen[p.id] || globalFreeze
            ? p.score
            : p.chapter >= 3
              ? p.score
              : p.score + Math.floor(Math.random() * 8),
          delta: frozen[p.id] || globalFreeze ? 0 : Math.floor(Math.random() * 8),
        }));
        return [...updated].sort((a, b) => b.score - a.score);
      });
    }, 1200);
    return () => clearInterval(id);
  }, [frozen, globalFreeze]);

  /* detect rank changes → play sound */
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

  /* BroadcastChannel from admin */
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bus = new BroadcastChannel(CHANNEL_NAME);
    busRef.current = bus;
    bus.onmessage = (evt) => {
      const { type, playerId, frozen: f } = evt.data ?? {};
      if (type === "freeze")       setFrozen(prev => ({ ...prev, [playerId]: f }));
      if (type === "globalFreeze") setGF(f);
      if (type === "advance") {
        setBoard(prev => prev.map(p =>
          p.id === playerId ? { ...p, chapter: Math.min(p.chapter + 1, 3) } : p
        ).sort((a, b) => b.score - a.score));
      }
    };
    return () => bus.close();
  }, []);

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
          <p className="stage-sub">LIVE LEADERBOARD</p>
        </div>
        <div className="stage-meta">
          <span className="stage-clock">{tick}</span>
          {globalFreeze && <span className="freeze-badge">❄ FREEZE ACTIVE</span>}
        </div>
      </header>

      {/* leaderboard */}
      <main className="stage-main">
        {board.map((player, i) => {
          const rank   = i + 1;
          const isTop  = rank <= 3;
          const isFlash = flashId === player.id;
          const isF    = frozen[player.id] || globalFreeze;
          const color  = getRankColor(rank);

          return (
            <div
              key={player.id}
              className={`stage-row${isTop ? " top" : ""}${isFlash ? " rank-up" : ""}${isF ? " stage-frozen" : ""}`}
              style={{ "--row-color": color }}
            >
              {/* rank */}
              <span className="stage-rank" style={{ color }}>
                {MEDALS[i] ?? `#${rank}`}
              </span>

              {/* alias */}
              <span className="stage-alias" style={{ color: isTop ? color : "#00ffcc" }}>
                {player.alias}
              </span>

              {/* chapter progress */}
              <div className="stage-progress">
                {[1, 2, 3].map(ch => (
                  <span
                    key={ch}
                    className={`stage-seg${player.chapter >= ch ? " done" : ""}`}
                    style={player.chapter >= ch ? { background: color } : {}}
                  />
                ))}
                <span className="stage-ch-label">CH.{player.chapter}</span>
              </div>

              {/* score */}
              <span className="stage-score" style={{ color }}>
                {String(player.score).padStart(6, "0")}
              </span>

              {/* delta */}
              {player.delta > 0 && !isF && (
                <span className="stage-delta">+{player.delta}</span>
              )}
              {isF && <span className="stage-frozen-tag">FROZEN</span>}
            </div>
          );
        })}
      </main>

      {/* footer */}
      <footer className="stage-footer">
        <span>▲ VICE CITY HEIST  ·  /stage</span>
        <span>Players: {board.length}</span>
      </footer>
    </div>
  );
}
