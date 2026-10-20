/**
 * PlayerTerminal.jsx  –  Vice City Heist: Bank Manager Vault Defense
 *
 * Implements Full User Storyline:
 *   1. Waiting Lobby: Player enters Name, Station Alias, College/Team & waits for Central Dispatch.
 *   2. Admin Control Sync: When Admin (Port 5176) starts game, all terminals launch into Fullscreen Story Mode!
 *   3. Tommy Vercetti Entrance Cutscene: Plays /video/heist_intro.mp4.
 *   4. Locker Room & Manager GBA Conversation Box:
 *      - Background: /images/vault_lockers.jpg
 *      - Bank Manager Gordon Bennett (/images/manager.png) slides in from the left!
 *      - Pokémon GBA conversation box with retro sound blips, typewriter text, and animated indicator arrow (▼).
 *      - Manager gives live reactive feedback as assistant suggests passwords.
 *   5. Timer & Classic GTA Wanted Star Level (Top Corner near Timer):
 *      - Timer ONLY activates during active defense!
 *      - Level 1: 2 Wanted Stars (Outer Lobby // Tellers Gate - 12 rules - 15m)
 *      - Level 2: 4 Wanted Stars (Executive Cash Corridors - 22 rules - 12m - Faster Drill)
 *      - Level 3: 6 MAX Wanted Stars (Titanium Deep Vault - 35 rules - 10m - Overdrive Drill)
 *   6. Story Intermissions ("Tommy Didn't Accept Defeat"):
 *      - After Level 1: "3 DAYS LATER IN VICE CITY... TOMMY VERCETTI REFUSED TO ACCEPT DEFEAT!"
 *      - After Level 2: "ONE WEEK LATER... FINAL SIEGE AT TITANIUM DEEP VAULT!"
 *   7. Fullscreen Lock & Anti-Tab Switch Protection:
 *      - Switching tabs or exiting fullscreen freezes terminal with a breach alert.
 *      - Released only when user loses, quits, wins, or Admin unfreezes them.
 *   8. Classic GTA Vice City Mission Failed Screen:
 *      - If time expires or breach occurs, displays classic red "MISSION FAILED" with doom gong sound.
 *      - Terminal remains locked until Admin unfreezes them on Port 5176!
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import confetti from "canvas-confetti";
import SoundEngine from "../utils/soundEngine";
import { getManagerDirective, MANAGER_PRAISE } from "../utils/managerDialogue";
import { getAssetUrl } from "../utils/assetPath";
import { syncPlayerToSupabase, fetchGameStateFromSupabase, deletePlayerFromSupabase } from "../utils/supabaseClient";
import { videoPreloader } from "../utils/videoPreloader";
import {
  CAMPAIGN_LEVELS,
  createSessionData,
  buildAll59Rules,
  buildAll45Rules,
  loadSavedSessionData,
  RULES_CHANNEL,
} from "../utils/gameRules";
import "./PlayerTerminal.css";
import LobbyVault3D from "../components/LobbyVault3D";

const CHANNEL_NAME = "vch-admin-bus";
const ADMIN_API_URL = typeof window !== "undefined"
  ? `http://${window.location.hostname || "localhost"}:5176`
  : "http://localhost:5176";

/* ─── Story Intermissions Data for GTA Story Mode Slideshow ─── */
const INTERMISSION_STORIES = {
  1: {
    timeJump: "THREE DAYS LATER IN VICE CITY...",
    timeJumpSub: "TOMMY VERCETTI REFUSED TO ACCEPT DEFEAT!",
    headline: "TOMMY VERCETTI REFUSED TO ACCEPT DEFEAT!",
    location: "🌴 THREE DAYS LATER IN VICE CITY... 🌴",
    story: "Word on Ocean Beach is Tommy Vercetti trashed the Malibu Club in a blind fury after being repelled at the Tellers Gate! He refused to accept defeat! He regrouped his syndicate, acquired high-yield thermal drills, and is storming the Executive Cash Corridors right now!",
    mood: "ALARMED",
    speech: '"ROOKIE! HE DIDN\'T ACCEPT HIS LOSS! He\'s drilling twice as fast—we need to make the password STRONGER, and FASTER than before! Move to Level 2 Executive Corridors NOW!"',
    cta: "ENGAGE LEVEL 2 DEFENSE (FASTER DRILL) ➔",
    targetLevel: 2,
  },
  2: {
    timeJump: "ONE WEEK LATER... STARFISH ISLAND",
    timeJumpSub: "VERCETTI'S ALL-OUT ASSAULT ON THE DEEP VAULT!",
    headline: "THE FINAL SIEGE: VERCETTI'S ALL-OUT ASSAULT ON THE DEEP VAULT!",
    location: "🌴 ONE WEEK LATER... STARFISH ISLAND 🌴",
    story: "Furious after two failed attempts, Tommy Vercetti deployed an industrial laser drill directly into the Sub-Level Titanium Deep Vault! This is his last, most desperate heist attempt!",
    mood: "DESPERATE",
    speech: '"HOLD THE LINE, ASSISTANT! All 32 security layers must be locked simultaneously—and FASTER than ever! If you fail, the bank\'s entire gold reserve is his! SECURE THE TITANIUM VAULT!"',
    cta: "DEPLOY LEVEL 3 MAXIMUM CIPHER ➔",
    targetLevel: 3,
  },
  3: {
    timeJump: "FORTY-EIGHT HOURS LATER: OMEGA CORE ALERT",
    timeJumpSub: "CODE RED: OMEGA QUANTUM SANCTUM UNDER ATTACK!",
    headline: "CODE RED: OMEGA QUANTUM CORE UNDER DIRECT ASSAULT!",
    location: "🌴 MIDNIGHT IN VICE CITY... 🌴",
    story: "Repelled from the Titanium Deep Vault, Tommy Vercetti deployed military-grade diamond plasma cutters and cyber-jamming arrays into the subterranean Omega Quantum Sanctum! If this final core breaches, Vice City's entire treasury will be wiped out!",
    mood: "MAXIMUM CRISIS",
    speech: '"OFFICER! HE PENETRATED THE OMEGA QUANTUM CORE! 45 ultra-cryptographic lock tumblers must now be calibrated simultaneously in under 10 minutes! His drill is operating at 240% overdrive! STAND FIRM AND ENGAGE THE OMEGA CIPHER!"',
    cta: "ENGAGE LEVEL 4 OMEGA CIPHER ➔",
    targetLevel: 4,
  },
};

/* ─── Vault Breach Surveillance Snapshots (GTA Wasted Sequence) ─── */
const BREACH_SNAPSHOTS = [
  {
    img: "/images/vault_door.jpg",
    tag: "CAM 01 // AIRLOCK IMPACT",
    title: "TITANIUM VAULT AIRLOCK FORCED",
    sub: "THERMAL DRILL HAS PIERCED HEAVY LOCKING MECHANISM",
  },
  {
    img: "/images/vice-hero.jpg",
    tag: "CAM 04 // PERIMETER INVASION",
    title: "TOMMY VERCETTI GANG BREACHES VAULT",
    sub: "SYNDICATE FORCES OVERRUN SUB-LEVEL ENTRANCE",
  },
  {
    img: "/images/vault_lockers.jpg",
    hasManager: true,
    tag: "CAM 09 // EXECUTIVE LOCKERS",
    title: "BANK MANAGER GORDON BENNETT IN CUSTODY",
    sub: "MANAGEMENT SUBDUED · MASTER CIPHERS EXTRACTED UNDER DURESS",
  },
  {
    img: "/images/vault_neon_bg.jpg",
    tag: "CAM 12 // CORE VAULT LOOTED",
    title: "TOTAL ASSET DRAIN // VAULT OVERRUN",
    sub: "RESERVES OF EL BANCO CORRUPTO GRANDE COMPLETELY EMPTIED",
  },
];

/* ─── GTA Wanted Stars Component ─── */
function GtaWantedStars({ wantedCount }) {
  return (
    <div className="gta-wanted-container" title={`VCPD Threat Level: ${wantedCount} Stars`}>
      <span className="wanted-label">WANTED LEVEL:</span>
      <div className="wanted-stars-row">
        {[1, 2, 3, 4, 5, 6].map((idx) => {
          const isLit = idx <= wantedCount;
          return (
            <span
              key={idx}
              className={`gta-star ${isLit ? "star-active" : "star-hollow"} ${
                isLit && wantedCount >= 4 ? "star-flash" : ""
              }`}
            >
              ★
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function PlayerTerminal({ frozen: parentFrozen }) {
  /* Screens: 'lobby' | 'cutscene' | 'briefing' | 'game' | 'story_intermission_1' | 'story_intermission_2' | 'mission_failed' | 'end' */
  const [screen, setScreen] = useState(() => {
    if (localStorage.getItem("vch_locked_breach") === "true" || localStorage.getItem("vch_ejected") === "true") {
      return "mission_failed";
    }
    return "lobby";
  });

  /* Player Registration & Session Details */
  const [playerId] = useState(() => localStorage.getItem("vch_player_id") || "P_" + Math.random().toString(36).substring(2, 8));
  const [player1Name, setPlayer1Name] = useState(() => localStorage.getItem("vch_player1_name") || "");
  const [player2Name, setPlayer2Name] = useState(() => localStorage.getItem("vch_player2_name") || "");
  const [playerName, setPlayerName] = useState(() => {
    const saved = localStorage.getItem("vch_player_name") || "";
    const p1 = localStorage.getItem("vch_player1_name") || "";
    const p2 = localStorage.getItem("vch_player2_name") || "";
    if (p1 && p2) return `${p1} & ${p2}`;
    return saved || p1 || "";
  });
  const [playerAlias, setPlayerAlias] = useState(() => localStorage.getItem("vch_player_alias") || "");
  const [playerCollege, setPlayerCollege] = useState(() => localStorage.getItem("vch_player_college") || "");
  const [isRegistered, setIsRegistered] = useState(() => Boolean(localStorage.getItem("vch_registered")));
  const [soundEnabled, setSoundEnabled] = useState(true);

  /* Lockout & Security Freeze State */
  const [isLockedBreach, setIsLockedBreach] = useState(() => localStorage.getItem("vch_locked_breach") === "true");
  const [isEjected, setIsEjected] = useState(() => localStorage.getItem("vch_ejected") === "true");
  const [isPlayerFrozen, setIsPlayerFrozen] = useState(() => localStorage.getItem("vch_player_frozen_" + playerId) === "true");
  const [breachReason, setBreachReason] = useState(() => localStorage.getItem("vch_breach_reason") || "");

  /* 3D Vault & Story Slideshow State */
  const [vaultDoorState, setVaultDoorState] = useState("locked"); // "locked" | "opening" | "unlocked"
  const [storySlideshow, setStorySlideshow] = useState({
    active: false,
    stage: "splash", // "splash" | "time_jump" | "briefing"
    levelCleared: 1,
    nextLevel: 2,
    scoreEarned: 1500,
    timeBonus: 25000,
  });

  /* Preview & Cinematic State */
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewOrigin, setPreviewOrigin] = useState("lobby");

  /* Video Preload & Cache State */
  const [videoPreload, setVideoPreload] = useState(() => ({
    status: videoPreloader.status,
    progress: videoPreloader.progress,
    blobUrl: videoPreloader.blobUrl,
  }));
  const [videoIsBuffering, setVideoIsBuffering] = useState(false);
  // Freeze video src upon mounting cutscene so playback never gets interrupted/swapped mid-stream
  const [activeCutsceneSrc, setActiveCutsceneSrc] = useState(() => videoPreloader.getVideoUrl());
  const [isCutsceneMuted, setIsCutsceneMuted] = useState(false);

  useEffect(() => {
    videoPreloader.init();
    const unsubscribe = videoPreloader.subscribe((state) => {
      setVideoPreload({ ...state });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (screen === "cutscene") {
      setActiveCutsceneSrc((prev) => prev || videoPreloader.getVideoUrl());
    } else {
      setActiveCutsceneSrc(videoPreloader.getVideoUrl());
    }
  }, [screen]);

  /* Auto-advance GTA Slideshow Stages */
  useEffect(() => {
    if (screen === "story_slideshow") {
      if (isPreviewMode) return; // Keep active on screen during preview
      if (storySlideshow.stage === "splash") {
        const timer = setTimeout(() => {
          setStorySlideshow((prev) => ({ ...prev, stage: "time_jump" }));
          if (soundEnabled) SoundEngine.playRadioChirp();
        }, 4500);
        return () => clearTimeout(timer);
      }
      if (storySlideshow.stage === "time_jump") {
        const timer = setTimeout(() => {
          setStorySlideshow((prev) => ({ ...prev, stage: "briefing" }));
          if (soundEnabled) SoundEngine.playUnlock();
        }, 2800);
        return () => clearTimeout(timer);
      }
    }
  }, [screen, storySlideshow.stage, isPreviewMode, soundEnabled]);

  /* Timer Ref & Fullscreen Helpers */
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const charsWrapperRef = useRef(null);
  const reportDebounceTimerRef = useRef(null);

  const screenRef = useRef(screen);
  screenRef.current = screen;
  const isLockedBreachRef = useRef(isLockedBreach);
  isLockedBreachRef.current = isLockedBreach;

  const isSoloAllowed = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(
      import.meta.env?.DEV ||
      new URLSearchParams(window.location.search).has("solo") ||
      new URLSearchParams(window.location.search).has("test")
    );
  }, []);

  const requestFullscreenSafe = () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen && !document.fullscreenElement) {
        el.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
  };

  const exitFullscreenSafe = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (_) {}
  };

  /* Fullscreen Grace Countdown & Filter States */
  const [fullscreenGraceCountdown, setFullscreenGraceCountdown] = useState(null);
  const graceTimerRef = useRef(null);
  const rulesScrollRef = useRef(null);
  const [filterFailingOnly, setFilterFailingOnly] = useState(false);

  const resumeFullscreenSafe = useCallback(() => {
    if (graceTimerRef.current) {
      clearInterval(graceTimerRef.current);
      graceTimerRef.current = null;
    }
    setFullscreenGraceCountdown(null);
    requestFullscreenSafe();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleEjected = useCallback(() => {
    clearInterval(timerRef.current);
    setIsLockedBreach(true);
    isLockedBreachRef.current = true;
    setIsEjected(true);
    const reason = "DISQUALIFIED & REMOVED FROM TOURNAMENT BY DISPATCH ADMIN";
    setBreachReason(reason);
    localStorage.setItem("vch_locked_breach", "true");
    localStorage.setItem("vch_ejected", "true");
    localStorage.setItem("vch_breach_reason", reason);
    setScreen("wasted_cinematic");
    screenRef.current = "wasted_cinematic";
    exitFullscreenSafe();
    SoundEngine.init();
    if (soundEnabled) SoundEngine.playWasted();
  }, [soundEnabled]);

  const handleResetToNameInput = useCallback(() => {
    clearInterval(timerRef.current);
    setIsLockedBreach(false);
    setIsEjected(false);
    setIsPlayerFrozen(false);
    setIsRegistered(false);
    setBreachReason("");
    setPlayerName("");
    setPlayer1Name("");
    setPlayer2Name("");
    setPlayerAlias("");
    setPlayerCollege("");
    setPassword("");
    passwordRef.current = "";
    setUnlockedCount(1);
    unlockedCountRef.current = 1;
    setCurrentLevel(1);
    localStorage.removeItem("vch_locked_breach");
    localStorage.removeItem("vch_breach_reason");
    localStorage.removeItem("vch_ejected");
    localStorage.removeItem("vch_registered");
    localStorage.removeItem("vch_player1_name");
    localStorage.removeItem("vch_player2_name");
    localStorage.removeItem("vch_player_name");
    localStorage.removeItem("vch_player_alias");
    localStorage.removeItem("vch_player_college");
    localStorage.removeItem("vch_round_submissions");
    localStorage.removeItem("vch_level_times");
    localStorage.removeItem("vch_completion_data");
    localStorage.removeItem("vch_player_violations_" + playerId);
    setRoundSubmissions({ 1: "", 2: "", 3: "", 4: "" });
    setLevelTimes({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setCompletionData(null);
    setViolations([]);
    setTotalCampaignSeconds(0);
    try {
      localStorage.removeItem("vch_player_state_" + playerId);
      localStorage.removeItem("vch_player_data_" + playerId);
    } catch (_) {}
    try {
      fetch(`${ADMIN_API_URL}/api/player/unregister`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: playerId }),
      }).catch(() => {});
    } catch (_) {}
    deletePlayerFromSupabase(playerId);

    setScreen("lobby");
    exitFullscreenSafe();
    SoundEngine.init();
    SoundEngine.playUnlock();
  }, [playerId]);

  /* 4-Level 40-Minute Progressive Campaign State (10 Min Each) */
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [levelTimes, setLevelTimes] = useState(() => {
    try {
      const saved = localStorage.getItem("vch_level_times");
      return saved ? JSON.parse(saved) : { 1: 0, 2: 0, 3: 0, 4: 0 };
    } catch (_) {
      return { 1: 0, 2: 0, 3: 0, 4: 0 };
    }
  });
  const [roundSubmissions, setRoundSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem("vch_round_submissions");
      return saved ? JSON.parse(saved) : { 1: "", 2: "", 3: "", 4: "" };
    } catch (_) {
      return { 1: "", 2: "", 3: "", 4: "" };
    }
  });
  const [completionData, setCompletionData] = useState(() => {
    try {
      const saved = localStorage.getItem("vch_completion_data");
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  const [violations, setViolations] = useState(() => {
    try {
      const saved = localStorage.getItem("vch_player_violations_" + playerId);
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });
  const [totalCampaignSeconds, setTotalCampaignSeconds] = useState(0);
  const [showPassword, setShowPassword] = useState(true);

  /* Video & Manager Avatar Assets */
  const [managerImgSrc] = useState(() => getAssetUrl("/images/manager.png?v=gta"));
  const videoRef = useRef(null);

  /* ── Lobby Asset Preloading (Eliminates cutscene & game loading lag) ── */
  useEffect(() => {
    if (screen === "lobby") {
      // Preload all background textures & UI graphics
      const assetsToPreload = [
        "/images/heist_intro_poster.jpg",
        "/images/vault_neon_bg.jpg",
        "/images/vault_door.jpg",
        "/images/vault_lockers.jpg",
        "/images/manager.png?v=gta",
        "/images/manager.png",
        "/images/manager_cutout.png",
        "/images/manager.svg",
        "/images/vice-hero.jpg",
        "/images/hero-bg.jpg",
        "/images/association-logo.png",
        "/images/daemon-logo.png",
        "/images/neon_emblem.png",
        "/images/user_logo_cropped.png",
      ];

      assetsToPreload.forEach((src) => {
        const img = new Image();
        img.src = getAssetUrl(src);
      });
    }
  }, [screen]);

  /* Game Session */
  const [password, setPassword] = useState("");
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); // 10:00 minutes
  const [survivedSeconds, setSurvivedSeconds] = useState(0);
  const [revealedHints, setRevealedHints] = useState(() => new Set());
  const [bonusFloat, setBonusFloat] = useState(null);
  const [lastPraise, setLastPraise] = useState(null);

  const [sessionData, setSessionData] = useState(() => loadSavedSessionData() || createSessionData());

  /* ── Listen for Admin Question Rerolls and Cipher Protocol Updates ── */
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const rulesBus = new BroadcastChannel(RULES_CHANNEL);
    rulesBus.onmessage = (evt) => {
      if (evt.data?.type === "session_data_updated" && evt.data?.session) {
        setSessionData(evt.data.session);
      }
    };
    return () => rulesBus.close();
  }, []);

  /* Stable Refs */
  const passwordRef = useRef(password);
  const unlockedCountRef = useRef(unlockedCount);
  const timeLeftRef = useRef(timeLeft);
  const survivedSecondsRef = useRef(survivedSeconds);

  useEffect(() => {
    passwordRef.current = password;
    if (charsWrapperRef.current) {
      charsWrapperRef.current.scrollLeft = charsWrapperRef.current.scrollWidth;
    }
  }, [password]);

  useEffect(() => {
    return () => {
      if (reportDebounceTimerRef.current) clearTimeout(reportDebounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    unlockedCountRef.current = unlockedCount;
  }, [unlockedCount]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    survivedSecondsRef.current = survivedSeconds;
  }, [survivedSeconds]);

  const cfg = CAMPAIGN_LEVELS[currentLevel] || CAMPAIGN_LEVELS[1];
  const allRules = useMemo(() => buildAll59Rules(sessionData, cfg), [sessionData, cfg]);
  const activeRulesList = useMemo(() => allRules.slice(0, cfg.rules), [allRules, cfg]);

  /* ── Report Player Status to Supabase, Local Bus, & Admin Server ── */
  const reportToAdmin = useCallback(async (overrides = {}) => {
    // Determine registration and real player name
    const registered = overrides.isRegistered !== undefined ? overrides.isRegistered : isRegistered;
    const effectiveName = (overrides.name !== undefined ? overrides.name : (playerName || localStorage.getItem("vch_player_name") || ""))?.trim();

    // STRICT: Only players from the lobby onwards who registered with their real name should be reported
    if (!registered || !effectiveName || effectiveName === "Anonymous Agent" || effectiveName.startsWith("Station ") || overrides.status === "NAME_ENTRY") {
      return;
    }

    const curUnlocked = overrides.unlockedCount !== undefined ? overrides.unlockedCount : unlockedCountRef.current;
    const curLevel = overrides.currentLevel !== undefined ? overrides.currentLevel : currentLevel;
    const curTime = overrides.timeLeft !== undefined ? overrides.timeLeft : timeLeftRef.current;
    const curBreach = overrides.isBreached !== undefined ? overrides.isBreached : isLockedBreach;
    const curFrozen = overrides.isFrozen !== undefined ? overrides.isFrozen : (isPlayerFrozen || Boolean(parentFrozen));
    const curPassword = overrides.currentPassword !== undefined ? overrides.currentPassword : (passwordRef.current || "");

    const prevRulesCompleted = curLevel === 1 ? 0 : curLevel === 2 ? 10 : curLevel === 3 ? 23 : 39;
    const cumulativeRules = overrides.rulesCleared !== undefined
      ? overrides.rulesCleared
      : (prevRulesCompleted + Math.max(0, curUnlocked - 1));

    const calculatedScore = overrides.score !== undefined
      ? overrides.score
      : (cumulativeRules * 150 + (curLevel - 1) * 600 + Math.max(0, curTime || 0));

    const payload = {
      id: playerId,
      name: effectiveName,
      alias: (overrides.alias !== undefined ? overrides.alias : (playerAlias || localStorage.getItem("vch_player_alias") || "")) || effectiveName,
      college: overrides.college !== undefined ? overrides.college : (playerCollege || localStorage.getItem("vch_player_college") || "Vice City"),
      isRegistered: true,

      status: curBreach
        ? "BREACH_LOCKED"
        : curFrozen
        ? "FROZEN"
        : screen === "game"
        ? `LEVEL_${curLevel}_ACTIVE`
        : screen.toUpperCase(),
      currentLevel: curLevel,
      chapter: curLevel,
      rulesCleared: cumulativeRules,
      score: calculatedScore,
      timeLeft: curTime,
      isBreached: curBreach,
      isFrozen: curFrozen,
      isEjected: overrides.isEjected !== undefined ? overrides.isEjected : isEjected,
      breachReason: overrides.breachReason !== undefined ? overrides.breachReason : breachReason,
      levelTimes: overrides.levelTimes || levelTimes,
      roundSubmissions: overrides.roundSubmissions || roundSubmissions,
      completionStats: overrides.completionStats || completionData,
      completedAt: overrides.completedAt || completionData?.completedAt || "",
      completedTimestamp: overrides.completedTimestamp || completionData?.completedTimestamp || 0,
      totalClearanceSeconds: overrides.totalClearanceSeconds || completionData?.totalClearanceSeconds || 0,
      clearanceFormatted: overrides.clearanceFormatted || completionData?.clearanceFormatted || "",
      isGrandWinner: overrides.isGrandWinner || Boolean(completionData),
      violations: overrides.violations || violations,
      currentPassword: curPassword,
      password: curPassword,
      lastSeen: Date.now(),
      isMock: false,
      ...overrides,
    };

    // 1. Sync to Supabase in Cloud (Stores player and live password)
    syncPlayerToSupabase(payload).catch(() => {});

    // 2. Broadcast to BroadcastChannel (local cross-tab sync)
    try {
      if (typeof BroadcastChannel !== "undefined") {
        const bus = new BroadcastChannel(CHANNEL_NAME);
        bus.postMessage({ type: "player_update", player: payload });
        bus.postMessage({ type: "playerUpdate", ...payload });
        bus.close();
      }
    } catch (_) {}

    // 3. Cache to localStorage for tab/window sync
    try {
      localStorage.setItem("vch_player_state_" + playerId, JSON.stringify(payload));
      localStorage.setItem("vch_last_heartbeat", String(Date.now()));
    } catch (_) {}

    // 4. Post to Port 5176 Admin Server (if running)
    try {
      fetch(`${ADMIN_API_URL}/api/player/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(res => res.json()).then(data => {
        if (data && data.removed) {
          handleEjected();
        }
      }).catch(() => {});
    } catch (_) {}
  }, [
    playerId,
    isRegistered,
    playerName,
    playerAlias,
    playerCollege,
    isLockedBreach,
    isPlayerFrozen,
    parentFrozen,
    screen,
    currentLevel,
    handleEjected,
    isEjected,
    breachReason,
    levelTimes,
    completionData,
    violations,
  ]);

  /* ── Periodic Heartbeat: ensures live password and stats update smoothly ── */
  useEffect(() => {
    if (!isRegistered || !playerName.trim()) return;
    reportToAdmin();
    const interval = setInterval(() => {
      reportToAdmin();
    }, 1500);
    return () => clearInterval(interval);
  }, [reportToAdmin, isRegistered, playerName]);

  /* ── Launch Story Mode from Lobby ── */
  const launchStoryMode = useCallback(() => {
    SoundEngine.init();
    SoundEngine.playVaultClank();
    SoundEngine.playTumblerClick();
    setVaultDoorState("opening");
    setTimeout(() => {
      SoundEngine.playWantedStar();
      requestFullscreenSafe();
      setScreen("cutscene");
      setCurrentLevel(1);
      setVaultDoorState("locked");
      reportToAdmin({ status: "STORY_CUTSCENE", currentLevel: 1 });
    }, 1800);
  }, [reportToAdmin]);

  /* ── Advance to specific level ── */
  const advanceFloorByAdmin = useCallback((targetLevel) => {
    SoundEngine.init();
    SoundEngine.playSwoosh();
    SoundEngine.playSuccess();
    setCurrentLevel(prevLvl => {
      const nextLvl = Number(targetLevel) || Math.min(prevLvl + 1, 4);
      const targetCfg = CAMPAIGN_LEVELS[nextLvl] || CAMPAIGN_LEVELS[1];
      setSessionData(createSessionData());
      setPassword("");
      passwordRef.current = "";
      setUnlockedCount(1);
      setTimeLeft(targetCfg.startSeconds);
      timeLeftRef.current = targetCfg.startSeconds;
      setSurvivedSeconds(0);
      survivedSecondsRef.current = 0;
      setRevealedHints(new Set());
      setLastPraise(null);
      setScreen("game");
      setIsPlayerFrozen(false);
      setIsLockedBreach(false);
      try {
        localStorage.setItem("vch_player_level_" + playerId, String(nextLvl));
        localStorage.removeItem("vch_player_frozen_" + playerId);
      } catch (_) {}
      reportToAdmin({
        status: `LEVEL_${nextLvl}_ACTIVE`,
        currentLevel: nextLvl,
        chapter: nextLvl,
        rulesCleared: 0,
        currentPassword: "",
        isFrozen: false,
      });
      return nextLvl;
    });
  }, [playerId, reportToAdmin]);

  /* ── Trigger Cinematic WASTED Sequence ── */
  const triggerWastedSequence = useCallback((reason = "THE VAULT WAS BREACHED! TOMMY VERCETTI ESCAPED WITH $3,000,000", isElimination = false) => {
    clearInterval(timerRef.current);
    if (soundEnabled) SoundEngine.stopDrone();
    setBreachReason(reason);
    localStorage.setItem("vch_breach_reason", reason);
    setIsLockedBreach(true);
    isLockedBreachRef.current = true;
    localStorage.setItem("vch_locked_breach", "true");
    if (isElimination) {
      setIsEjected(true);
      localStorage.setItem("vch_ejected", "true");
    }
    setScreen("wasted_cinematic");
    screenRef.current = "wasted_cinematic";
    exitFullscreenSafe();
    SoundEngine.init();
    if (soundEnabled) SoundEngine.playWasted();
    reportToAdmin({ status: "LOCKED_FAILED", isBreached: true, reason });
  }, [soundEnabled, reportToAdmin]);

  /* ── Cinematic Demo Previews (On-Demand Visual Verification) ── */
  const handleTriggerWastedDemo = useCallback(() => {
    setPreviewOrigin(screen);
    setIsPreviewMode(true);
    setBreachReason("SIMULATION // THERMAL DRILL PENETRATED TITANIUM CHAMBER");
    setScreen("wasted_cinematic");
    SoundEngine.init();
    if (soundEnabled) SoundEngine.playWasted();
  }, [screen, soundEnabled]);

  const handleTriggerPassedDemo = useCallback(() => {
    setPreviewOrigin(screen);
    setIsPreviewMode(true);
    setStorySlideshow({
      active: true,
      stage: "splash",
      levelCleared: currentLevel || 1,
      nextLevel: 2,
      scoreEarned: 1500,
      timeBonus: 25000,
    });
    setScreen("story_slideshow");
    SoundEngine.init();
    if (soundEnabled) SoundEngine.playMissionPassed();
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#F8C018", "#00E676", "#FF2A6D", "#00E5FF", "#FFF2E3"],
      });
    } catch (_) {}
  }, [screen, currentLevel, soundEnabled]);

  const handleExitPreview = useCallback(() => {
    setIsPreviewMode(false);
    setScreen(previewOrigin || "lobby");
  }, [previewOrigin]);

  /* ── Listen for BroadcastChannel events ── */
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bus = new BroadcastChannel(CHANNEL_NAME);
    bus.onmessage = (evt) => {
      const { type, playerId: pid, frozen: f } = evt.data || {};
      if (type === "remove" && pid === playerId) {
        handleEjected();
      } else if (type === "start_story") {
        if (screen === "lobby" && isRegistered) {
          launchStoryMode();
        }
      } else if (type === "siren") {
        SoundEngine.init();
        SoundEngine.playSiren();
      } else if (type === "reset_lobby") {
        clearInterval(timerRef.current);
        setScreen("lobby");
        setIsLockedBreach(false);
        setIsEjected(false);
        setIsPlayerFrozen(false);
        localStorage.removeItem("vch_locked_breach");
        localStorage.removeItem("vch_breach_reason");
        localStorage.removeItem("vch_ejected");
        exitFullscreenSafe();
      } else if (type === "freeze" && (pid === playerId || f === true)) {
        setIsPlayerFrozen(true);
        SoundEngine.init();
        SoundEngine.playFreeze();
      } else if (type === "unfreeze") {
        if (!pid || pid === playerId) {
          setIsPlayerFrozen(false);
          setIsLockedBreach(false);
          setIsEjected(false);
          localStorage.removeItem("vch_locked_breach");
          localStorage.removeItem("vch_breach_reason");
          localStorage.removeItem("vch_ejected");
          SoundEngine.init();
          SoundEngine.playUnlock();
          if (screen === "mission_failed" || screen === "wasted_cinematic" || screen === "wasted_slideshow") {
            setScreen("game");
            setTimeLeft(cfg.startSeconds);
            timeLeftRef.current = cfg.startSeconds;
          }
        }
      } else if (type === "reset_to_name_input") {
        if (!pid || pid === playerId || (evt.data?.target === "ejected" && (isEjected || localStorage.getItem("vch_ejected") === "true"))) {
          handleResetToNameInput();
        }
      } else if (type === "purge_all" || type === "purge_roster") {
        handleResetToNameInput();
      } else if (type === "purge_player" && pid === playerId) {
        handleResetToNameInput();
      } else if (type === "globalFreeze") {
        setIsPlayerFrozen(Boolean(f));
        SoundEngine.init();
        if (f) SoundEngine.playFreeze();
        else SoundEngine.playUnlock();
      } else if (type === "advance" && (pid === playerId || !pid)) {
        advanceFloorByAdmin(evt.data?.targetLevel || evt.data?.level);
      }
    };
    return () => bus.close();
  }, [playerId, isRegistered, handleEjected, handleResetToNameInput, screen, launchStoryMode, cfg.startSeconds, advanceFloorByAdmin, isEjected]);

  /* ── Listen for Admin Commands (via Supabase & Port 5176) ── */
  useEffect(() => {
    const checkAdminCommands = async () => {
      // 1. Supabase Cloud Check
      try {
        const state = await fetchGameStateFromSupabase();
        if (state) {
          if (typeof state.global_freeze === "boolean") {
            setIsPlayerFrozen(state.global_freeze);
          }
          const cmd = state.active_command;
          if (cmd && cmd.timestamp) {
            const lastProcessed = Number(sessionStorage.getItem("vch_last_admin_cmd") || 0);
            if (cmd.timestamp > lastProcessed) {
              sessionStorage.setItem("vch_last_admin_cmd", String(cmd.timestamp));
              if (cmd.action === "START_STORY_MODE" && screen === "lobby" && isRegistered) {
                launchStoryMode();
              } else if (cmd.action === "UNFREEZE_PLAYER" && (!cmd.playerId || cmd.playerId === playerId)) {
                setIsPlayerFrozen(false);
                setIsLockedBreach(false);
                setIsEjected(false);
                try { localStorage.removeItem("vch_player_frozen_" + playerId); } catch (_) {}
                localStorage.removeItem("vch_locked_breach");
                localStorage.removeItem("vch_breach_reason");
                localStorage.removeItem("vch_ejected");
                if (screen === "mission_failed" || screen === "wasted_cinematic" || screen === "wasted_slideshow") {
                  setScreen("game");
                  setTimeLeft(cfg.startSeconds);
                  timeLeftRef.current = cfg.startSeconds;
                }
              } else if (cmd.action === "FREEZE_PLAYER" && cmd.playerId === playerId) {
                setIsPlayerFrozen(true);
                try { localStorage.setItem("vch_player_frozen_" + playerId, "true"); } catch (_) {}
              } else if (cmd.action === "ADVANCE_PLAYER" && cmd.playerId === playerId) {
                advanceFloorByAdmin(cmd.targetLevel || cmd.level);
              } else if (cmd.action === "REMOVE_PLAYER" && cmd.playerId === playerId) {
                handleEjected();
              } else if (cmd.action === "RESET_TO_NAME_INPUT") {
                if (!cmd.playerId || cmd.playerId === playerId || (cmd.target === "ejected" && (isEjected || localStorage.getItem("vch_ejected") === "true"))) {
                  handleResetToNameInput();
                }
              } else if (cmd.action === "PURGE_ALL_DATA" || cmd.action === "PURGE_ROSTER") {
                handleResetToNameInput();
              } else if ((cmd.action === "PURGE_PLAYER" || cmd.action === "DELETE_RECORD" || cmd.action === "DELETE_PLAYER_RECORD") && cmd.playerId === playerId) {
                handleResetToNameInput();
              } else if (cmd.action === "RESET_TO_LOBBY") {
                clearInterval(timerRef.current);
                setScreen("lobby");
                setIsLockedBreach(false);
                setIsEjected(false);
                setIsPlayerFrozen(false);
                localStorage.removeItem("vch_locked_breach");
                localStorage.removeItem("vch_breach_reason");
                localStorage.removeItem("vch_ejected");
                exitFullscreenSafe();
              } else if (cmd.action === "TRIGGER_SIREN") {
                SoundEngine.playSiren();
              }
            }
          }
        }
      } catch (_) {}

      // 2. Local Port 5176 fallback
      try {
        const res = await fetch(`${ADMIN_API_URL}/api/state`);
        const data = await res.json();
        const cmd = data?.gameState?.activeCommand;

        if (typeof data?.gameState?.globalFreeze === "boolean") {
          setIsPlayerFrozen(data.gameState.globalFreeze);
        }
        if (data?.players && Array.isArray(data.players)) {
          const myP = data.players.find(p => p.id === playerId);
          if (myP && typeof myP.isFrozen === "boolean") {
            setIsPlayerFrozen(myP.isFrozen);
          }
        }

        if (cmd) {
          const cmdTime = cmd.timestamp;
          const lastProcessed = Number(sessionStorage.getItem("vch_last_admin_cmd") || 0);

          if (cmdTime > lastProcessed) {
            sessionStorage.setItem("vch_last_admin_cmd", String(cmdTime));

            if (cmd.action === "START_STORY_MODE") {
              if (screen === "lobby" && isRegistered) {
                launchStoryMode();
              }
            } else if (cmd.action === "UNFREEZE_PLAYER") {
              if (!cmd.playerId || cmd.playerId === playerId) {
                setIsPlayerFrozen(false);
                setIsLockedBreach(false);
                setIsEjected(false);
                try { localStorage.removeItem("vch_player_frozen_" + playerId); } catch (_) {}
                localStorage.removeItem("vch_locked_breach");
                localStorage.removeItem("vch_breach_reason");
                localStorage.removeItem("vch_ejected");
                if (screen === "mission_failed" || screen === "wasted_cinematic" || screen === "wasted_slideshow") {
                  setScreen("game");
                  setTimeLeft(cfg.startSeconds);
                  timeLeftRef.current = cfg.startSeconds;
                }
              }
            } else if (cmd.action === "FREEZE_PLAYER" && cmd.playerId === playerId) {
              setIsPlayerFrozen(true);
              try { localStorage.setItem("vch_player_frozen_" + playerId, "true"); } catch (_) {}
            } else if (cmd.action === "ADVANCE_PLAYER" && cmd.playerId === playerId) {
              advanceFloorByAdmin(cmd.targetLevel || cmd.level);
            } else if (cmd.action === "REMOVE_PLAYER") {
              if (cmd.playerId === playerId) {
                handleEjected();
              }
            } else if (cmd.action === "RESET_TO_NAME_INPUT") {
              if (!cmd.playerId || cmd.playerId === playerId || (cmd.target === "ejected" && (isEjected || localStorage.getItem("vch_ejected") === "true"))) {
                handleResetToNameInput();
              }
            } else if (cmd.action === "PURGE_ALL_DATA" || cmd.action === "PURGE_ROSTER") {
              handleResetToNameInput();
            } else if ((cmd.action === "PURGE_PLAYER" || cmd.action === "DELETE_RECORD" || cmd.action === "DELETE_PLAYER_RECORD") && cmd.playerId === playerId) {
              handleResetToNameInput();
            } else if (cmd.action === "RESET_TO_LOBBY") {
              clearInterval(timerRef.current);
              setScreen("lobby");
              setIsLockedBreach(false);
              setIsEjected(false);
              setIsPlayerFrozen(false);
              localStorage.removeItem("vch_locked_breach");
              localStorage.removeItem("vch_breach_reason");
              localStorage.removeItem("vch_ejected");
              exitFullscreenSafe();
            } else if (cmd.action === "TRIGGER_SIREN") {
              SoundEngine.playSiren();
            }
          }
        }
      } catch (_) {}
    };

    const interval = setInterval(checkAdminCommands, 1200);
    return () => clearInterval(interval);
  }, [screen, isRegistered, launchStoryMode, playerId, cfg.startSeconds, handleEjected, handleResetToNameInput, advanceFloorByAdmin, isEjected]);

  /* ── Security Violation & Illegal Actions Reporter (Anti-Cheat) ── */
  const reportViolation = useCallback(
    (violationType, violationDesc, isEliminated = true) => {
      let effectiveName = playerName || localStorage.getItem("vch_player_name") || "";
      if (!effectiveName.trim()) {
        effectiveName = (playerAlias || localStorage.getItem("vch_player_alias") || "").trim() || `Station ${playerId.slice(-4)}`;
      }

      const violationRecord = {
        id: "VIO_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        playerId,
        name: effectiveName,
        alias: playerAlias || localStorage.getItem("vch_player_alias") || `Station ${playerId.slice(-4)}`,
        college: playerCollege || localStorage.getItem("vch_player_college") || "Vice City",
        type: violationType,
        reason: violationDesc,
        level: currentLevel,
        timestamp: Date.now(),
        formattedTime:
          new Date().toLocaleTimeString("en-US", { hour12: false }) +
          "." +
          String(new Date().getMilliseconds()).padStart(3, "0"),
        eliminated: isEliminated,
      };

      setViolations((prev) => {
        const next = [violationRecord, ...prev].slice(0, 30);
        try {
          localStorage.setItem("vch_player_violations_" + playerId, JSON.stringify(next));
        } catch (_) {}
        return next;
      });

      // 1. Broadcast to local bus
      try {
        if (typeof BroadcastChannel !== "undefined") {
          const bus = new BroadcastChannel(CHANNEL_NAME);
          bus.postMessage({ type: "security_violation", violation: violationRecord });
          bus.close();
        }
      } catch (_) {}

      // 2. Post to Port 5176 server
      try {
        fetch(`${ADMIN_API_URL}/api/player/violation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(violationRecord),
        }).catch(() => {});
      } catch (_) {}

      // 3. Sync player state with violation
      reportToAdmin({
        isBreached: isEliminated ? true : isLockedBreach,
        isEjected: isEliminated ? true : isEjected,
        breachReason: isEliminated ? violationDesc : breachReason,
        lastViolation: violationRecord,
        status: isEliminated ? `DISQUALIFIED_${violationType}` : undefined,
      });
    },
    [playerId, playerName, playerAlias, playerCollege, currentLevel, isLockedBreach, isEjected, breachReason, reportToAdmin]
  );

  /* ── Anti-Cheat: Fullscreen, Tab Switch & DevTools Watcher ── */
  useEffect(() => {
    if (screen !== "game" || isLockedBreach) return;

    const handleVisibilityChange = () => {
      if (document.hidden && screenRef.current === "game" && !isLockedBreachRef.current) {
        const reason = "UNAUTHORIZED TAB SWITCH / MINIMIZE DETECTED (Eliminated)";
        triggerWastedSequence(reason, true);
        reportViolation("TAB_SWITCH", reason, true);
      }
    };

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        if (graceTimerRef.current) {
          clearInterval(graceTimerRef.current);
          graceTimerRef.current = null;
        }
        setFullscreenGraceCountdown(null);
        return;
      }

      if (!document.fullscreenElement && screenRef.current === "game" && !isLockedBreachRef.current) {
        SoundEngine.init();
        SoundEngine.playAlert();
        setFullscreenGraceCountdown(5);

        if (graceTimerRef.current) clearInterval(graceTimerRef.current);
        let remaining = 5;
        graceTimerRef.current = setInterval(() => {
          remaining -= 1;
          if (remaining > 0) {
            setFullscreenGraceCountdown(remaining);
            SoundEngine.playTick();
          } else {
            clearInterval(graceTimerRef.current);
            graceTimerRef.current = null;
            setFullscreenGraceCountdown(null);

            const reason = "FULLSCREEN DEPARTURE DETECTED (Eliminated)";
            triggerWastedSequence(reason, true);
            reportViolation("FULLSCREEN_ESCAPE", reason, true);
          }
        }, 1000);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      reportViolation("RIGHT_CLICK_INSPECT", "Attempted right-click context menu / inspect", false);
    };

    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "J" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
        reportViolation("DEVTOOLS_SHORTCUT", `Attempted DevTools keyboard shortcut (${e.key})`, false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (graceTimerRef.current) clearInterval(graceTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [screen, isLockedBreach, reportViolation, triggerWastedSequence]);

  /* ── Time Adjustment & Feedback ── */
  const triggerTimeBonus = useCallback((delta) => {
    if (!delta || delta === 0) return;
    setTimeLeft((prev) => {
      const next = Math.max(0, prev + delta);
      timeLeftRef.current = next;
      return next;
    });
    setBonusFloat(delta > 0 ? `+${delta}s` : `${delta}s`);
    setTimeout(() => setBonusFloat(null), 1800);
  }, []);

  /* ── Level Finished Handler ── */
  const handleLevelFinished = useCallback(
    (won, finalPw, finalUnlocked) => {
      clearInterval(timerRef.current);
      if (soundEnabled) SoundEngine.stopDrone();

      if (!won) {
        // Mission Failed / Vault Breached!
        const reason = "THE VAULT WAS BREACHED! TOMMY VERCETTI ESCAPED WITH $3,000,000";
        triggerWastedSequence(reason, false);
        return;
      }

      // Level Cleared Successfully!
      if (soundEnabled) {
        SoundEngine.playMissionPassed();
        try {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#F84391", "#48D5D0", "#FFD166", "#FFF2E3"],
          });
        } catch (_) {}
      }

      // No positive time bonuses awarded in Round 1 & Round 2 for challenging gameplay
      const levelScore = Math.round(
        survivedSecondsRef.current * 15 + cfg.rules * 160 + (currentLevel <= 2 ? 0 : timeLeftRef.current * 20)
      );
      const timeBonus = currentLevel <= 2 ? 0 : timeLeftRef.current * 250;

      const updatedLevelScores = { ...levelScores, [currentLevel]: levelScore };
      const updatedLevelTimes = { ...levelTimes, [currentLevel]: survivedSecondsRef.current };
      const updatedSubmissions = { ...roundSubmissions, [currentLevel]: finalPw };
      setLevelScores(updatedLevelScores);
      setLevelTimes(updatedLevelTimes);
      setRoundSubmissions(updatedSubmissions);
      try {
        localStorage.setItem("vch_level_times", JSON.stringify(updatedLevelTimes));
        localStorage.setItem("vch_round_submissions", JSON.stringify(updatedSubmissions));
      } catch (_) {}

      // Story Intermission Transitions
      if (currentLevel < 4) {
        setStorySlideshow({
          active: true,
          stage: "splash",
          levelCleared: currentLevel,
          nextLevel: currentLevel + 1,
          scoreEarned: levelScore,
          timeBonus: timeBonus,
        });
        setScreen("story_slideshow");
        reportToAdmin({
          status: `CLEARED_LEVEL_${currentLevel}`,
          currentLevel: currentLevel + 1,
          levelTimes: updatedLevelTimes,
          roundSubmissions: updatedSubmissions,
          currentPassword: finalPw,
        });
      } else {
        // Grand Victory on Level 4!
        exitFullscreenSafe();
        setScreen("end");

        const now = Date.now();
        const finishDate = new Date();
        const finishTimestampStr =
          finishDate.toLocaleTimeString("en-US", { hour12: false }) +
          "." +
          String(finishDate.getMilliseconds()).padStart(3, "0");
        const totalClearSec =
          (updatedLevelTimes[1] || 0) +
          (updatedLevelTimes[2] || 0) +
          (updatedLevelTimes[3] || 0) +
          (survivedSecondsRef.current || 0);
        const mins = Math.floor(totalClearSec / 60);
        const secs = totalClearSec % 60;
        const clearanceFormatted = `${String(mins).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;

        const compRecord = {
          completedTimestamp: now,
          completedAt: finishTimestampStr,
          completedIso: finishDate.toISOString(),
          totalClearanceSeconds: totalClearSec,
          clearanceFormatted,
          levelTimes: updatedLevelTimes,
          roundSubmissions: updatedSubmissions,
        };
        setCompletionData(compRecord);
        try {
          localStorage.setItem("vch_completion_data", JSON.stringify(compRecord));
        } catch (_) {}

        reportToAdmin({
          status: "GRAND_VICTORY",
          isGrandWinner: true,
          ...compRecord,
          roundSubmissions: updatedSubmissions,
          currentPassword: finalPw,
          rulesCleared: cfg.rules,
        });
      }
    },
    [cfg, currentLevel, soundEnabled, reportToAdmin, levelScores, levelTimes, roundSubmissions]
  );

  /* ── Input Change & Progressive Unlock ── */
  const handleInputChange = useCallback((e) => {
    if (isLockedBreach || isPlayerFrozen || Boolean(parentFrozen)) return;
    const newPw = e.target.value;
    setPassword(newPw);
    passwordRef.current = newPw;
    if (soundEnabled) SoundEngine.playKeyType();

    let curUnlocked = unlockedCountRef.current;
    let ruleMilestonePassed = false;

    while (curUnlocked <= cfg.rules) {
      const activeRules = activeRulesList.slice(0, curUnlocked);
      const allPassed = activeRules.every((r) => r.check(newPw));

      if (allPassed) {
        if (curUnlocked === cfg.rules) {
          if (reportDebounceTimerRef.current) clearTimeout(reportDebounceTimerRef.current);
          setUnlockedCount(curUnlocked);
          reportToAdmin({ currentPassword: newPw, password: newPw, unlockedCount: curUnlocked });
          handleLevelFinished(true, newPw, curUnlocked);
          return;
        }
        curUnlocked += 1;
        ruleMilestonePassed = true;
        setUnlockedCount(curUnlocked);
        triggerTimeBonus(cfg.bonusSeconds);

        if (soundEnabled) {
          SoundEngine.playRuleClear();
          SoundEngine.playRadioChirp();
        }

        const praise = MANAGER_PRAISE[Math.floor(Math.random() * MANAGER_PRAISE.length)];
        setLastPraise(praise);
        setTimeout(() => setLastPraise(null), 3500);
      } else {
        break;
      }
    }

    if (ruleMilestonePassed) {
      // Immediate sync to server and cloud when a security protocol rule clears
      if (reportDebounceTimerRef.current) clearTimeout(reportDebounceTimerRef.current);
      reportToAdmin({ currentPassword: newPw, password: newPw, unlockedCount: curUnlocked });
    } else {
      // Debounce routine keystrokes by 250ms to maintain instantaneous 60fps local fluidity without HTTP queue lag
      if (reportDebounceTimerRef.current) clearTimeout(reportDebounceTimerRef.current);
      reportDebounceTimerRef.current = setTimeout(() => {
        reportToAdmin({ currentPassword: newPw, password: newPw, unlockedCount: curUnlocked });
      }, 250);
    }
  }, [isLockedBreach, isPlayerFrozen, parentFrozen, soundEnabled, cfg, activeRulesList, triggerTimeBonus, handleLevelFinished, reportToAdmin, setPassword, setUnlockedCount]);

  /* ── Cutscene Completion & Audio Controls ── */
  const handleCutsceneDone = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    if (soundEnabled) SoundEngine.playClick();
    setScreen("briefing");
    reportToAdmin({ status: "BRIEFING" });
  }, [soundEnabled, reportToAdmin]);

  const handleUnmuteCutscene = useCallback((e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.volume = 1.0;
      setIsCutsceneMuted(false);
      if (soundEnabled) {
        SoundEngine.resume();
        SoundEngine.playClick();
      }
    }
  }, [soundEnabled]);

  const handleToggleCutsceneAudio = useCallback((e) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsCutsceneMuted(nextMuted);
      if (!nextMuted && soundEnabled) {
        SoundEngine.resume();
        SoundEngine.playClick();
      }
    }
  }, [soundEnabled]);

  const handleCutsceneStageClick = useCallback((e) => {
    // If video was muted by browser autoplay policy, first click unmutes with sound blip and doesn't skip!
    if (isCutsceneMuted || (videoRef.current && videoRef.current.muted)) {
      handleUnmuteCutscene(e);
      return;
    }
    // If already unmuted or sound is playing, clicking skips to briefing
    handleCutsceneDone();
  }, [isCutsceneMuted, handleUnmuteCutscene, handleCutsceneDone]);

  /* ── Cutscene Playback & Keydown Handler ── */
  useEffect(() => {
    if (screen !== "cutscene") return;

    requestFullscreenSafe();

    if (videoRef.current) {
      // First attempt unmuted playback if sound is enabled
      videoRef.current.muted = !soundEnabled;
      videoRef.current.volume = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsCutsceneMuted(Boolean(videoRef.current?.muted));
          })
          .catch((err) => {
            console.warn("[Cutscene] Autoplay with audio restricted by browser. Falling back to muted with tap-to-unmute prompt:", err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsCutsceneMuted(true);
              videoRef.current.play().catch(() => {});
            }
          });
      }
    }

    const handleCutsceneKeyDown = (e) => {
      // If user presses M, toggle audio
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        handleToggleCutsceneAudio(e);
        return;
      }
      // If muted, Enter or Space unmutes without skipping
      if (isCutsceneMuted && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleUnmuteCutscene(e);
        return;
      }
      handleCutsceneDone();
    };

    window.addEventListener("keydown", handleCutsceneKeyDown);
    return () => {
      window.removeEventListener("keydown", handleCutsceneKeyDown);
    };
  }, [screen, soundEnabled, isCutsceneMuted, handleCutsceneDone, handleUnmuteCutscene, handleToggleCutsceneAudio]);

  /* ── Start Active Defense on Current Level ── */
  const handleStartActiveDefense = (levelToStart) => {
    requestFullscreenSafe();
    SoundEngine.init();
    if (soundEnabled) {
      SoundEngine.playClick();
      SoundEngine.playWantedStar();
    }

    const targetCfg = CAMPAIGN_LEVELS[levelToStart];
    setCurrentLevel(levelToStart);
    setSessionData(createSessionData());
    setPassword("");
    passwordRef.current = "";
    setUnlockedCount(1);
    setTimeLeft(targetCfg.startSeconds);
    timeLeftRef.current = targetCfg.startSeconds;
    setSurvivedSeconds(0);
    survivedSecondsRef.current = 0;
    setRevealedHints(new Set());
    setLastPraise(null);
    setScreen("game");
    screenRef.current = "game";
    setIsPlayerFrozen(false);
    setIsLockedBreach(false);
    isLockedBreachRef.current = false;

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    reportToAdmin({
      status: `LEVEL_${levelToStart}_ACTIVE`,
      currentLevel: levelToStart,
      currentPassword: "",
    });
  };

  /* ── Timer Countdown Effect (Active Defense Only!) ── */
  useEffect(() => {
    if (screen !== "game" || isLockedBreach || parentFrozen || isPlayerFrozen) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (timeLeftRef.current <= 1) {
        clearInterval(timerRef.current);
        handleLevelFinished(false, passwordRef.current, unlockedCountRef.current);
        setTimeLeft(0);
        return;
      }

      if (timeLeftRef.current <= 11 && soundEnabled) {
        SoundEngine.playTick();
      }

      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 1);
        timeLeftRef.current = next;
        return next;
      });

      setSurvivedSeconds((s) => {
        const next = s + 1;
        survivedSecondsRef.current = next;
        return next;
      });

      setTotalCampaignSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [screen, isLockedBreach, parentFrozen, isPlayerFrozen, soundEnabled, handleLevelFinished]);

  /* ── Manager Dialogue Computation & Dynamic Rule Sorting ── */
  const displayedRules = useMemo(() => activeRulesList.slice(0, unlockedCount), [activeRulesList, unlockedCount]);

  /* 
   * Dynamic Rule Priority:
   * 1. Rules to be completed, newly unlocked rules, and broken rules appear at the VERY TOP.
   * 2. The newest unlocked uncompleted rule is always at index 0 (top of the list).
   * 3. Completed / passed rules move down to the bottom.
   */
  const visibleRulesInPanel = useMemo(() => {
    const sourceList = filterFailingOnly
      ? displayedRules.filter((r) => !r.check(password))
      : displayedRules;

    const failing = [];
    const passed = [];

    sourceList.forEach((rule) => {
      if (rule.check(password)) {
        passed.push(rule);
      } else {
        failing.push(rule);
      }
    });

    // Uncompleted / broken rules at the TOP, newest first
    failing.sort((a, b) => b.id - a.id);
    // Completed rules at the BOTTOM, newest completed first
    passed.sort((a, b) => b.id - a.id);

    return [...failing, ...passed];
  }, [displayedRules, filterFailingOnly, password]);

  // Auto-scroll rules panel to top whenever a new rule is unlocked so player sees it immediately
  useEffect(() => {
    if (rulesScrollRef.current) {
      rulesScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [unlockedCount, currentLevel]);

  const activeFailing = useMemo(
    () => [...displayedRules].reverse().find((r) => !r.check(password)),
    [displayedRules, password]
  );
  const currentDirective = useMemo(
    () => getManagerDirective(activeFailing, password, sessionData, cfg),
    [activeFailing, password, sessionData, cfg]
  );

  /* Typewriter Effect with retro GBA text blips (optimized to eliminate audio stutter on keystroke) */
  const [typedSpeech, setTypedSpeech] = useState("");
  const prevSpeechRef = useRef("");

  useEffect(() => {
    const fullText = currentDirective.speech || "";
    if (prevSpeechRef.current === fullText) return;
    prevSpeechRef.current = fullText;

    let i = 0;
    setTypedSpeech("");

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedSpeech(fullText.slice(0, i + 1));
        if (soundEnabled && i % 3 === 0) SoundEngine.playTextBlip();
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [currentDirective.speech, soundEnabled]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* Slot characters for the retro CRT screen display [ _ _ _ _ _ _ ] */
  const slotChars = useMemo(() => {
    const chars = [...password];
    const slots = [];
    for (let i = 0; i < Math.max(6, chars.length); i++) {
      if (i < chars.length) {
        slots.push(showPassword ? chars[i] : "●");
      } else {
        slots.push("_");
      }
    }
    return slots;
  }, [password, showPassword]);

  /* On-Screen Numeric Keypad Press */
  const handleKeypadPress = useCallback((char) => {
    if (isLockedBreach || isPlayerFrozen || Boolean(parentFrozen)) return;
    if (soundEnabled) SoundEngine.playKeyType();
    const newPw = password + char;
    handleInputChange({ target: { value: newPw } });
    inputRef.current?.focus();
  }, [password, isLockedBreach, isPlayerFrozen, parentFrozen, soundEnabled, handleInputChange]);

  /* Global Keyboard Shortcuts for Game Screen */
  useEffect(() => {
    if (screen !== "game") return;

    const handleKeyDown = (e) => {
      if (e.target && e.target !== inputRef.current && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const allPassed = displayedRules.length >= cfg.rules && displayedRules.every((r) => r.check(passwordRef.current));
        if (allPassed) {
          handleLevelFinished(true, passwordRef.current, unlockedCountRef.current);
        } else {
          if (soundEnabled) SoundEngine.playDenied();
          inputRef.current?.focus();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        inputRef.current?.focus();
      } else {
        if (document.activeElement !== inputRef.current && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, displayedRules, cfg.rules, handleLevelFinished, soundEnabled, reportToAdmin]);

  /* ── Lobby Registration Submit ── */
  const handleRegisterLobby = (e) => {
    e.preventDefault();
    const p1 = (player1Name || "").trim();
    const p2 = (player2Name || "").trim();
    if (!p1 || !p2) {
      alert("Please enter the full names of both team operatives.");
      return;
    }
    const combinedName = `${p1} & ${p2}`;
    const finalAlias = (playerAlias || "").trim() || `Station ${playerId.slice(-4)}`;
    const finalCollege = (playerCollege || "").trim();

    localStorage.setItem("vch_player_id", playerId);
    localStorage.setItem("vch_player1_name", p1);
    localStorage.setItem("vch_player2_name", p2);
    localStorage.setItem("vch_player_name", combinedName);
    localStorage.setItem("vch_player_alias", finalAlias);
    localStorage.setItem("vch_player_college", finalCollege);
    localStorage.setItem("vch_registered", "true");
    setPlayer1Name(p1);
    setPlayer2Name(p2);
    setPlayerName(combinedName);
    setPlayerAlias(finalAlias);
    setPlayerCollege(finalCollege);
    setIsRegistered(true);

    if (soundEnabled) SoundEngine.playClick();
    reportToAdmin({
      status: "IN_LOBBY",
      isRegistered: true,
      name: combinedName,
      alias: finalAlias,
      college: finalCollege,
    });
  };


  /* ══════════════════════════════════════════════════
     RENDER INTERFACE
     ══════════════════════════════════════════════════ */
  return (
    <main className={`terminal-root ${isLockedBreach ? "breach-locked" : ""}`}>
      {/* ── EMERGENCY FULLSCREEN BREACH RECOVERY OVERLAY ── */}
      {fullscreenGraceCountdown !== null && (
        <div className="fullscreen-breach-warning-overlay" onClick={resumeFullscreenSafe}>
          <div className="breach-warning-card" onClick={(e) => e.stopPropagation()}>
            <span className="warning-alarm-icon" aria-hidden="true">⚠️</span>
            <h2 className="warning-headline">SECURITY PERIMETER BREACH!</h2>
            <p className="warning-subtext">FULLSCREEN LOST. RE-ENGAGE FULLSCREEN TO RESUME CIPHER DEFENSE!</p>
            <div className="warning-timer-pill">
              LOCKOUT IN: <span className="warning-countdown-num">{fullscreenGraceCountdown}s</span>
            </div>
            <button
              type="button"
              className="vice-btn primary-btn resume-fullscreen-btn"
              onClick={resumeFullscreenSafe}
            >
              ⚡ RESUME FULLSCREEN DEFENSE
            </button>
          </div>
        </div>
      )}


      {/* ── SCREEN 1: WAITING LOBBY (Main Association Background & Clutter-Free) ── */}
      {screen === "lobby" && (
        <section className="lobby-fullscreen-stage">
          {/* Main Association Website Sunset Background Layers */}
          <div className="lobby-bg-viewport" aria-hidden="true">
            <img
              src={getAssetUrl("/images/vice-hero.jpg")}
              alt="VYUHA Vice City Sunset"
              className="lobby-bg-img"
            />
            <div className="lobby-bg-overlay-warm" />
            <div className="lobby-bg-overlay-vignette" />
            <div className="lobby-bg-sunflare" />
            <div className="lobby-bg-grain" />
          </div>

          <div className="lobby-card">
            <div className="lobby-badge">🚔 VCPD CENTRAL BANK DISPATCH · VYUHA '26</div>
            <h1 className="vice-display-lg lobby-title">EL BANCO CORRUPTO GRANDE</h1>
            <p className="lobby-subtitle">CENTRAL VAULT DEFENSE PROTOCOL · CSE ASSOCIATION</p>

            {!isRegistered ? (
              /* Registration Form - Two Player Team */
              <form onSubmit={handleRegisterLobby} className="lobby-reg-form">
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">OPERATIVE 1 (FULL NAME)</label>
                    <input
                      type="text"
                      required
                      value={player1Name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPlayer1Name(val);
                        const p2 = (player2Name || "").trim();
                        const p1 = val.trim();
                        setPlayerName(p1 && p2 ? `${p1} & ${p2}` : (p1 || p2));
                      }}
                      placeholder="e.g. Lance Vance"
                      className="lobby-input"
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label className="form-label">OPERATIVE 2 (FULL NAME)</label>
                    <input
                      type="text"
                      required
                      value={player2Name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPlayer2Name(val);
                        const p1 = (player1Name || "").trim();
                        const p2 = val.trim();
                        setPlayerName(p1 && p2 ? `${p1} & ${p2}` : (p1 || p2));
                      }}
                      placeholder="e.g. Tommy Vercetti"
                      className="lobby-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">TEAM / STATION ALIAS</label>
                    <input
                      type="text"
                      value={playerAlias}
                      onChange={(e) => setPlayerAlias(e.target.value)}
                      placeholder="e.g. Terminal #04 / Cyber Squad"
                      className="lobby-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">COLLEGE / INSTITUTION</label>
                    <input
                      type="text"
                      value={playerCollege}
                      onChange={(e) => setPlayerCollege(e.target.value)}
                      placeholder="e.g. KMCT IETM"
                      className="lobby-input"
                    />
                  </div>
                </div>

                <button type="submit" className="vice-btn primary-btn lobby-submit-btn">
                  ENTER CENTRAL WAITING LOUNGE ➔
                </button>
              </form>
            ) : (
              /* Waiting Lounge View */
              <div className="lobby-waiting-view">
                {/* Real-time 3D Submarine Vault Door Asset (React Three Fiber + Blender PBR) */}
                <LobbyVault3D isOpening={vaultDoorState === "opening"} />

                <div className="waiting-status-box">
                  <div className="waiting-pulse-dot"></div>
                  <span className="waiting-status-text">
                    TERMINAL CONNECTED: <strong>{playerName}</strong> ({playerAlias})
                  </span>
                </div>

                <div className="lobby-vault-feed-status">
                  <span className={`status-pill ${videoPreload.progress === 100 ? "status-ready" : "status-loading"}`}>
                    {videoPreload.progress === 100 ? "⚡ SURVEILLANCE FEED CACHED (0ms LAG)" : `⚡ PRE-CACHING INTRO FEED: ${videoPreload.progress}%`}
                  </span>
                </div>

                <p className="waiting-dispatch-msg">
                  STANDBY IN THE BANK LOBBY. AWAITING CENTRAL DISPATCH (PORT 5176) TO LAUNCH STORY MODE.
                </p>

                <div className="lobby-practice-action">
                  <button
                    type="button"
                    className="lobby-back-btn"
                    onClick={() => {
                      if (soundEnabled) SoundEngine.playClick();
                      setIsRegistered(false);
                      localStorage.removeItem("vch_registered");
                      try {
                        fetch(`${ADMIN_API_URL}/api/player/unregister`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: playerId }),
                        }).catch(() => {});
                      } catch (_) {}
                      deletePlayerFromSupabase(playerId);
                      reportToAdmin({ status: "NAME_ENTRY", isRegistered: false });
                    }}
                    title="Return to name & terminal registration page"
                  >
                    ⮌ BACK TO AGENT REGISTRATION
                  </button>

                  {isSoloAllowed && (
                    <button
                      type="button"
                      className="solo-start-btn"
                      onClick={launchStoryMode}
                      title="Click for solo testing or offline demo"
                    >
                      ▶ [SOLO TEST: LAUNCH STORY MODE DIRECTLY]
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SCREEN 2: TOMMY VERCETTI CUTSCENE VIDEO ── */}
      {screen === "cutscene" && (
        <section 
          className="cutscene-fullscreen-stage" 
          onClick={handleCutsceneStageClick}
          tabIndex={0}
          role="button"
          aria-label={isCutsceneMuted ? "Click anywhere to unmute cutscene audio" : "Click anywhere or press any key to skip cutscene"}
        >
          <div className="video-player-frame">
            <video
              ref={videoRef}
              src={activeCutsceneSrc}
              poster={getAssetUrl("/images/heist_intro_poster.jpg")}
              playsInline
              preload="auto"
              onEnded={handleCutsceneDone}
              onError={() => {
                console.warn("[Cutscene] Video stream error fallback to briefing");
                handleCutsceneDone();
              }}
              onWaiting={() => setVideoIsBuffering(true)}
              onPlaying={() => setVideoIsBuffering(false)}
              onCanPlay={() => setVideoIsBuffering(false)}
              className="heist-cutscene-video"
            />

            {/* Video Loading/Buffering HUD (only if network is still streaming and not ready) */}
            {(videoIsBuffering && videoPreload.progress < 100) && (
              <div className="video-loading-hud" onClick={(e) => { e.stopPropagation(); handleCutsceneDone(); }}>
                <div className="video-loading-spinner" />
                <div className="video-loading-text">
                  DECRYPTING SURVEILLANCE FEED... {videoPreload.progress}%
                </div>
                <div className="video-loading-bar-track">
                  <div className="video-loading-bar-fill" style={{ width: `${videoPreload.progress}%` }} />
                </div>
                <div className="video-loading-sub">
                  PRESS ESC / SPACE OR CLICK ANYWHERE TO SKIP DIRECTLY TO BRIEFING
                </div>
              </div>
            )}

            {/* Tap to Unmute Banner (Shown whenever browser autoplay policy restricted initial audio) */}
            {isCutsceneMuted && (
              <div 
                className="cutscene-unmute-banner"
                onClick={handleUnmuteCutscene}
              >
                <div className="cutscene-unmute-badge">
                  <span className="unmute-badge-icon">🔊</span>
                  <span className="unmute-badge-title">AUDIO MUTED BY BROWSER</span>
                </div>
                <div className="cutscene-unmute-callout">
                  TAP ANYWHERE TO UNMUTE VICE CITY TRANSMISSION
                </div>
              </div>
            )}

            <div className="cutscene-hud-overlay">
              {/* Direct Unmute / Mute Toggle Button */}
              <button
                type="button"
                className={`cutscene-audio-pill ${isCutsceneMuted ? "pill-muted" : "pill-active"}`}
                onClick={handleToggleCutsceneAudio}
                title="Toggle cutscene sound (or press M)"
              >
                <span className="pill-icon">{isCutsceneMuted ? "🔇" : "🔊"}</span>
                <span className="pill-text">{isCutsceneMuted ? "UNMUTE AUDIO" : "SOUND ON"}</span>
              </button>

              <div className="cutscene-hud-pulse">
                <span className="cutscene-hud-icon">▶▶</span>
                <span className="cutscene-hud-text">
                  {isCutsceneMuted ? "TAP SCREEN TO UNMUTE · PRESS ESC TO SKIP" : "PRESS ANY KEY OR CLICK TO SKIP"}
                </span>
              </div>
              <div className="cutscene-hud-sub">TRANSMISSION // LIVE INFILTRATION — VYUHA '26</div>
            </div>
          </div>
        </section>
      )}

      {/* ── SCREEN 3: LOCKER ROOM BRIEFING & MANAGER GBA BOX ── */}
      {screen === "briefing" && (
        <section className="locker-briefing-stage">
          <div className="locker-briefing-card">
            <div className="locker-scene-header">
              <span className="scene-badge">🚨 EMERGENCY AIRLOCK // SUB-LEVEL</span>
              <h2 className="vice-display-lg scene-title">{cfg.title}</h2>
              <p className="scene-sub">Vercetti's gang has infiltrated the outer perimeter!</p>
            </div>

            {/* Pokémon GBA Interactive Box */}
            <div className="gba-interactive-wrapper briefing-gba">
              <div className="gba-manager-slide-container slide-in">
                <div className="manager-portrait-frame speaking">
                  <img src={managerImgSrc} alt="Bank Manager Gordon Bennett" className="manager-portrait-img" />
                </div>
              </div>

              <div className="gba-dialogue-box">
                <div className="gba-nameplate">
                  <span>👔 MANAGER GORDON BENNETT</span>
                  <span className="gba-mood-chip urgent">PANICKED</span>
                </div>
                <div className="gba-text-content">
                  <p className="gba-typewriter-text">
                    "ASSISTANT! Tommy Vercetti and his crew just blasted through the lobby! Tommy has a 10-minute timer per floor before each blast gate breaches! You must set an unbreakable cipher on this terminal immediately! Every suggestion you make, I will verify the security protocols!"
                  </p>
                </div>
                <div className="gba-prompt-arrow blink">▼</div>
              </div>
            </div>

            <div className="action-row center-actions">
              <button
                type="button"
                className="vice-btn primary-btn large-cta"
                onClick={() => handleStartActiveDefense(1)}
              >
                ENGAGE LEVEL 1 CIPHER CONSOLE ➔
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── SCREEN 4: ACTIVE PASSWORD DEFENSE GAME (Full Setup: Vault Background + Zoomed-In CRT + Attached Rules Panel + Manager Bubble) ── */}
      {screen === "game" && (
        <section className="vault-game-stage">
          {/* Ambient overlays */}
          <div className="vault-screen-vignette" aria-hidden="true" />
          <div className="vault-screen-scanlines" aria-hidden="true" />

          {/* 1. TOP HUD (Objective, Breach Progress, Wanted Stars, Neon Timer) */}
          <header className="vault-top-hud">
            {/* Top-Left: Objective & Tommy Drill Breach */}
            <div className="hud-top-left">
              <div className="hud-objective-title">
                <span className="hud-diamond-icon">◇</span>
                <span className="hud-level-title">{cfg.title}</span>
              </div>
              <div className="hud-layer-subtitle">Layer {unlockedCount} of {cfg.rules}</div>

              {/* Tommy Vercetti Thermal Drill Breach Bar */}
              <div className="hud-drill-bar-box">
                <div className="hud-drill-label-row">
                  <span className="hud-drill-warning-text">
                    ⚠️ TOMMY VERCETTI THERMAL DRILL BREACH: {Math.min(100, Math.round(((cfg.startSeconds - Math.min(cfg.startSeconds, timeLeft)) / cfg.startSeconds) * 100))}%
                  </span>
                  <span className="hud-drill-speed-text">SPEED: {cfg.drillSpeedMultiplier.toFixed(1)}x</span>
                </div>
                <div className="hud-drill-track">
                  <div
                    className="hud-drill-fill"
                    style={{
                      width: `${Math.min(100, Math.round(((cfg.startSeconds - Math.min(cfg.startSeconds, timeLeft)) / cfg.startSeconds) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Top-Center: Wanted Stars */}
            <div className="hud-top-center">
              <span className="hud-wanted-label">WANTED LEVEL</span>
              <GtaWantedStars wantedCount={cfg.wantedStars} />
            </div>

            {/* Top-Right: Digital Timer with Neon Amber Box */}
            <div className="hud-top-right">
              <div className="hud-neon-timer-box">
                <span className="hud-timer-clock-icon">⏱</span>
                <span className="hud-timer-numbers">{formatTime(timeLeft)}</span>
                {bonusFloat && <span className="hud-bonus-tag">{bonusFloat}</span>}
              </div>
            </div>
          </header>

          {/* 2. CENTER STAGE: ZOOMED-IN CRT MONITOR + ATTACHED NEON RULES PANEL */}
          <div className="vault-center-unit">
            {/* CRT Computer Terminal Monitor */}
            <div className="crt-monitor-cabinet" onClick={() => inputRef.current?.focus()}>
              <div className="crt-screen-bezel">
                <div className="crt-screen-glass">
                  <div className="crt-scanline-lines" aria-hidden="true" />
                  <div className="crt-inner-display">
                    {/* Header */}
                    <div className="crt-prompt-text">CREATE NEW STRONG PASSWORD:</div>

                    {/* Bracketed Slot Row */}
                    <div className="crt-password-slots-row">
                      <span className="crt-bracket-label">PASSWORD:</span>
                      <div className="crt-slots-container">
                        <span className="crt-bracket">[</span>
                        <div className="crt-chars-wrapper" ref={charsWrapperRef}>
                          {slotChars.map((ch, idx) => (
                            <span
                              key={idx}
                              className={`crt-char-cell ${ch !== "_" ? "char-entered" : "char-underscore"}`}
                            >
                              {ch}
                            </span>
                          ))}
                        </div>
                        <span className="crt-bracket">]</span>
                      </div>
                    </div>

                    {/* Active Input Box & On-Screen Numeric Keypad Row */}
                    <div className="crt-interactive-row">
                      <div className={`crt-input-box ${password.length > 0 && activeFailing ? "input-failing-glow" : ""}`}>
                        <input
                          ref={inputRef}
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={handleInputChange}
                          className="crt-real-input"
                          placeholder={
                            isPlayerFrozen || Boolean(parentFrozen)
                              ? "❄️ TERMINAL FROZEN..."
                              : ""
                          }
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
                          disabled={isLockedBreach || isPlayerFrozen || Boolean(parentFrozen)}
                        />
                        <span className="crt-blinking-cursor">█</span>
                      </div>

                      {/* On-Screen Keypad Grid */}
                      <div className="crt-keypad-grid" aria-label="Numeric keypad">
                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-"].map((k) => (
                          <button
                            key={k}
                            type="button"
                            className="crt-keypad-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleKeypadPress(k);
                            }}
                          >
                            {k}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="crt-status-row">
                      <span className={`crt-status-pill ${activeFailing ? "status-pending" : "status-cleared"}`}>
                        {activeFailing ? "PROTOCOL PENDING" : "VAULT ACCESS GRANTED"}
                      </span>
                      <span className="crt-char-count">{[...password].length} CHARACTERS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attached Illuminated Neon Frame Panel: PASSWORD RULES */}
            <div className="neon-rules-panel">
              <div className="neon-rules-inner">
                <div className="neon-rules-header">
                  <h2 className="neon-rules-title">PASSWORD RULES:</h2>
                  <div className="neon-rules-header-controls">
                    <button
                      type="button"
                      className={`neon-filter-btn ${filterFailingOnly ? "active" : ""}`}
                      onClick={() => setFilterFailingOnly((v) => !v)}
                      title="Filter between all active rules and failing rules"
                    >
                      {filterFailingOnly ? "🔴 FAILING ONLY" : "📋 ALL RULES"}
                    </button>
                    <span className="neon-rules-sparkle" aria-hidden="true">✦</span>
                  </div>
                </div>

                <div className="neon-rules-scroll" ref={rulesScrollRef}>
                  {visibleRulesInPanel.map((rule) => {
                    const passed = rule.check(password);
                    const isHinted = revealedHints.has(rule.id);
                    const isFailingCurrent = activeFailing?.id === rule.id;

                    return (
                      <div
                        key={rule.id}
                        className={`neon-rule-row ${passed ? "rule-passed" : "rule-failing"} ${isFailingCurrent ? "rule-current-failing" : ""} ${rule.isRiddle ? "rule-is-riddle" : ""}`}
                        onClick={() => {
                          if (!passed && !revealedHints.has(rule.id)) {
                            setRevealedHints((prev) => new Set([...prev, rule.id]));
                            triggerTimeBonus(-15);
                            if (soundEnabled) SoundEngine.playHintUsed();
                          }
                        }}
                        title={passed ? "Rule already passed" : (isHinted ? "Intel already revealed" : "Click to reveal Manager Intel (-15s penalty)")}
                      >
                        <div className="neon-rule-content">
                          <span className="neon-bullet">{passed ? "✓" : (rule.isRiddle ? "🧩" : "•")}</span>
                          {rule.difficultyStars && (
                            <span
                              className="neon-diff-star-pill"
                              style={{
                                color: rule.difficultyColor || "#00E676",
                                fontSize: "0.72rem",
                                fontWeight: 800,
                                marginRight: "6px",
                                letterSpacing: "0.5px",
                                whiteSpace: "nowrap"
                              }}
                              title={rule.difficultyTier || "Difficulty"}
                            >
                              {rule.difficultyStars}
                            </span>
                          )}
                          <span className={`neon-rule-text ${rule.isRiddle ? "neon-riddle-text" : ""}`}>
                            {rule.isRiddle ? rule.text : rule.text.toUpperCase()}
                          </span>
                          {rule.isSwatch ? (
                            <span className="neon-swatch" style={{ backgroundColor: rule.swatchColor }} />
                          ) : (
                            <span className={`neon-badge ${rule.isRiddle ? "neon-riddle-badge" : ""}`}>{rule.badge(password)}</span>
                          )}
                          {!passed && !isHinted && (
                            <span className="neon-hint-btn-pill" title="Click to reveal Manager Intel (-15s)">
                              💡 HINT (-15s)
                            </span>
                          )}
                        </div>

                        {isHinted && (
                          <div className="neon-hint-drawer">
                            💡 MANAGER INTEL: {typeof rule.hint === "function" ? rule.hint(password) : rule.hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 3. BOTTOM-LEFT: MANAGER GORDON BENNETT & COMIC SPEECH BUBBLE */}
          <div className="vault-manager-corner">
            {/* Comic Speech Bubble */}
            <div className="manager-comic-bubble">
              <div className="bubble-header-row">
                <span className="bubble-speaker-tag">👔 MANAGER BENNETT</span>
                <span className={`bubble-mood-tag ${currentDirective.mood}`}>
                  {currentDirective.mood.toUpperCase()}
                </span>
              </div>

              {lastPraise && (
                <div className="bubble-praise-banner">✨ {lastPraise}</div>
              )}

              <p className="bubble-speech-text">
                "{typedSpeech || "Quick! Enter a new, secure password before Tommy breaches the vault!"}"
              </p>

              {/* Speech bubble tail pointing towards the manager */}
              <div className="bubble-tail" />
            </div>

            {/* Manager Bennett Bust */}
            <div className="manager-bust-container">
              <img
                src={managerImgSrc}
                alt="Bank Manager Gordon Bennett"
                className="manager-bust-image"
              />
            </div>
          </div>

          {/* 4. BOTTOM FOOTER BAR: KEYBINDS & ACTIONS */}
          <footer className="vault-game-footer">
            <div className="footer-keys-group">
              <button
                type="button"
                className="footer-keybind-btn primary-submit"
                onClick={() => {
                  const allPassed = displayedRules.length >= cfg.rules && displayedRules.every((r) => r.check(passwordRef.current));
                  if (allPassed) {
                    handleLevelFinished(true, passwordRef.current, unlockedCountRef.current);
                  } else {
                    if (soundEnabled) SoundEngine.playDenied();
                    inputRef.current?.focus();
                  }
                }}
                title="Submit Password [Enter]"
              >
                <span className="keycap">[ENTER]</span>
                <span className="key-action">SUBMIT</span>
              </button>

              <button
                type="button"
                className="footer-keybind-btn cancel-btn"
                onClick={() => {
                  triggerWastedSequence("MISSION ABORTED BY AGENT", false);
                }}
                title="Cancel Session [Esc]"
              >
                <span className="keycap">[ESC]</span>
                <span className="key-action">CANCEL</span>
              </button>

              <button
                type="button"
                className="footer-plain-btn abort-btn"
                onClick={() => {
                  triggerWastedSequence("MISSION ABORTED BY AGENT", false);
                }}
              >
                ABORT MISSION
              </button>
            </div>

            <div className="footer-hints-group">
              <button
                type="button"
                className="footer-plain-btn hint-link-btn"
                onClick={() => {
                  if (activeFailing && !revealedHints.has(activeFailing.id)) {
                    setRevealedHints((prev) => new Set([...prev, activeFailing.id]));
                    triggerTimeBonus(-15);
                    if (soundEnabled) SoundEngine.playHintUsed();
                  }
                }}
                title="Ask Manager for Hint (-15s penalty)"
              >
                ASK MANAGER FOR HINT (-15s)
              </button>

              <span className="footer-legend-tag">0-9 KEYPAD TO ENTER</span>

              <button
                type="button"
                className="footer-toggle-btn"
                onClick={() => setShowPassword((v) => !v)}
                title="Toggle Password Visibility"
              >
                {showPassword ? "👁 VISIBLE" : "🔒 MASKED"}
              </button>

              <button
                type="button"
                className="footer-toggle-btn"
                onClick={() => setSoundEnabled((v) => !v)}
                title="Toggle Audio Effects"
              >
                {soundEnabled ? "🔊 SFX ON" : "🔇 MUTED"}
              </button>
            </div>
          </footer>
        </section>
      )}

      {/* ── SCREEN: AUTHENTIC GTA WASTED / MISSION FAILED CINEMATIC ── */}
      {(screen === "wasted_cinematic" || screen === "wasted_slideshow") && (
        <section
          className="gta-wasted-fullscreen-stage"
          tabIndex={0}
          role="region"
          aria-label="GTA Wasted Mission Failed Screen"
        >
          {/* Cinema Letterbox Widescreen Bars */}
          <div className="gta-cinema-bars top" />
          <div className="gta-cinema-bars bottom" />

          {/* CCTV Live Surveillance Feed Overlay */}
          <div className="gta-wasted-cctv-hud">
            <div className="cctv-rec-indicator">
              <span className="cctv-rec-dot" />
              <span className="cctv-rec-text">● REC · LIVE OVERRIDE</span>
            </div>
            <div className="cctv-camera-tag">
              CAM 08 · TITANIUM VAULT SUB-01 // {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Layered Gritty Dark Background Environment with Ken Burns Drift & Red Klaxon */}
          <div className="gta-wasted-bg-environment">
            <img
              src={getAssetUrl("/images/vault_breached_lockers.jpg")}
              alt="Vault Breached Emptied Lockers"
              className="gta-wasted-bg-img"
            />
            <div className="gta-wasted-klaxon-sweep" />
            <div className="gta-wasted-red-vignette" />
            <div className="gta-wasted-scanlines" />
          </div>

          {/* Central Hero Card */}
          <div className="gta-wasted-card">
            <h1 className="gta-wasted-title">WASTED</h1>
            <div className="gta-wasted-breached-banner">
              ⚠️ MISSION FAILED // VAULT BREACHED
            </div>
            <p className="gta-wasted-subtitle">
              VERCETTI SYNDICATE FORCED THE MULTI-CIPHER AIRLOCK AND EMPTIED EL BANCO CORRUPTO GRANDE
            </p>

            {/* Debrief Telemetry Box */}
            <div className="gta-wasted-debrief-box">
              <div className="debrief-row">
                <span className="debrief-label">AGENT STATION:</span>
                <span className="debrief-val">{playerName || "AGENT"} ({playerAlias || "STATION-01"})</span>
              </div>
              <div className="debrief-row">
                <span className="debrief-label">SECURITY LEVEL:</span>
                <span className="debrief-val">{CAMPAIGN_LEVELS[currentLevel]?.title || "LEVEL 1 // OUTER LOBBY"}</span>
              </div>
              <div className="debrief-row">
                <span className="debrief-label">BREACH CAUSE:</span>
                <span className="debrief-val status-danger">{breachReason || "THERMAL DRILL PENETRATED TITANIUM CHAMBER"}</span>
              </div>
              <div className="debrief-row">
                <span className="debrief-label">PROTOCOL STATUS:</span>
                <span className="debrief-val status-danger">{isEjected ? "🚫 DISQUALIFIED BY CENTRAL DISPATCH" : "🔒 HIGH-SECURITY LOCKDOWN"}</span>
              </div>
            </div>

            {/* Actions Row */}
            <div className="gta-wasted-actions-row">
              {isPreviewMode ? (
                <>
                  <button
                    type="button"
                    className="gta-action-btn retry-btn"
                    onClick={() => {
                      SoundEngine.init();
                      if (soundEnabled) SoundEngine.playWasted();
                    }}
                  >
                    🔄 REPLAY WASTED AUDIO
                  </button>
                  <button
                    type="button"
                    className="gta-action-btn secondary-btn"
                    onClick={handleExitPreview}
                  >
                    ✖ EXIT PREVIEW
                  </button>
                </>
              ) : !isEjected ? (
                <>
                  <button
                    type="button"
                    className="gta-action-btn retry-btn"
                    onClick={() => {
                      setIsLockedBreach(false);
                      localStorage.removeItem("vch_locked_breach");
                      localStorage.removeItem("vch_breach_reason");
                      handleStartActiveDefense(currentLevel);
                    }}
                  >
                    🔄 RETRY LEVEL {currentLevel} DEFENSE
                  </button>
                  <button
                    type="button"
                    className="gta-action-btn secondary-btn"
                    onClick={() => {
                      setIsLockedBreach(false);
                      localStorage.removeItem("vch_locked_breach");
                      localStorage.removeItem("vch_breach_reason");
                      setScreen("lobby");
                      exitFullscreenSafe();
                    }}
                  >
                    🏠 RETURN TO LOBBY
                  </button>
                </>
              ) : isSoloAllowed ? (
                <button
                  type="button"
                  className="gta-action-btn secondary-btn"
                  onClick={handleResetToNameInput}
                >
                  [➔ REGISTER NEW AGENT DETAILS]
                </button>
              ) : (
                <div className="ejected-warning-box" style={{ color: "#FF2A6D", fontWeight: 700, padding: "10px", border: "1px dashed #FF2A6D", marginTop: "12px", fontFamily: "var(--font-mono, monospace)", textAlign: "center" }}>
                  ⚠️ OPERATIVE DISQUALIFIED // CONTACT DISPATCH ORGANIZER
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── SCREEN: GTA STORY MODE SLIDESHOW (Passed Splash -> Time Jump -> Briefing) ── */}
      {screen === "story_slideshow" && (
        <section className="gta-slideshow-fullscreen-stage">
          {/* Cinema Letterbox Widescreen Bars */}
          <div className="gta-cinema-bars top" />
          <div className="gta-cinema-bars bottom" />

          {/* SLIDE 1: CLASSIC GTA MISSION PASSED + RESPECT */}
          {storySlideshow.stage === "splash" && (
            <div
              className="gta-passed-splash-card"
              onClick={() => {
                setStorySlideshow((prev) => ({ ...prev, stage: "time_jump" }));
                if (soundEnabled) SoundEngine.playRadioChirp();
              }}
              title="Click to continue story"
            >
              {/* Game Theme Vice City Sunset & Vault Background (NO GREEN SCREEN) */}
              <div className="gta-passed-theme-bg" aria-hidden="true">
                <img
                  src={getAssetUrl("/images/vault_neon_bg.jpg")}
                  alt="Vice City Vault Defense Theme"
                  className="gta-passed-bg-img"
                />
                <div className="gta-passed-sunburst" />
                <div className="gta-passed-vignette" />
                <div className="gta-passed-scanlines" />
              </div>

              <div className="gta-passed-content">
                <div className="gta-passed-badge">🌴 VAULT DEFENSE PROTOCOL · LEVEL 0{storySlideshow.levelCleared} COMPLETE 🌴</div>
                <h1 className="gta-passed-title">MISSION PASSED!</h1>
                <div className="gta-respect-badge">RESPECT +</div>

                <p className="gta-passed-subtitle">
                  VAULT SECURED // {CAMPAIGN_LEVELS[storySlideshow.levelCleared]?.shortName?.toUpperCase()} LOCKED
                </p>

                <div className="gta-passed-stats-row">
                  <div className="gta-stat-pill">
                    SCORE: <span className="highlight">+{storySlideshow.scoreEarned} PTS</span>
                  </div>
                  <div className="gta-stat-pill">
                    TIME BONUS: {storySlideshow.timeBonus > 0 ? (
                      <span className="highlight" style={{ color: "#00E676" }}>+${storySlideshow.timeBonus.toLocaleString()}</span>
                    ) : (
                      <span className="highlight" style={{ color: "#FFD166" }}>CHALLENGE TIER (NO TIME BONUS)</span>
                    )}
                  </div>
                  <div className="gta-stat-pill">
                    STATUS: <span className="highlight" style={{ color: "#00E676" }}>100% SECURE</span>
                  </div>
                </div>

                <div className="gta-passed-actions-row" style={{ marginTop: "16px" }}>
                  {isPreviewMode ? (
                    <>
                      <button
                        type="button"
                        className="gta-action-btn retry-btn"
                        style={{
                          background: "linear-gradient(135deg, #FFB300 0%, #FF6F00 100%)",
                          border: "1.5px solid #FFE082",
                          color: "#000",
                          fontWeight: 900,
                          boxShadow: "0 0 25px rgba(255, 179, 0, 0.7)"
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          SoundEngine.init();
                          if (soundEnabled) SoundEngine.playMissionPassed();
                          try {
                            confetti({
                              particleCount: 120,
                              spread: 80,
                              origin: { y: 0.6 },
                              colors: ["#F8C018", "#00E676", "#FF2A6D", "#00E5FF", "#FFF2E3"],
                            });
                          } catch (_) {}
                        }}
                      >
                        🎉 REPLAY VICTORY & CONFETTI
                      </button>
                      <button
                        type="button"
                        className="gta-action-btn secondary-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExitPreview();
                        }}
                      >
                        ✖ EXIT PREVIEW
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="vice-btn primary-btn"
                      style={{ padding: "12px 34px", fontSize: "14px", marginTop: "12px", boxShadow: "0 0 25px rgba(255, 42, 109, 0.6)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setStorySlideshow((prev) => ({ ...prev, stage: "time_jump" }));
                        if (soundEnabled) SoundEngine.playRadioChirp();
                      }}
                    >
                      CONTINUE STORY SEQUENCE ➔
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: CINEMATIC TIME JUMP (THREE DAYS LATER...) */}
          {storySlideshow.stage === "time_jump" && (
            <div
              className="gta-time-jump-card"
              onClick={() => {
                setStorySlideshow((prev) => ({ ...prev, stage: "briefing" }));
                if (soundEnabled) SoundEngine.playUnlock();
              }}
              title="Click to skip time transition"
            >
              <h1 className="gta-time-jump-caption">
                "{INTERMISSION_STORIES[storySlideshow.levelCleared]?.timeJump || "A SHORT TIME LATER IN VICE CITY..."}"
              </h1>
              <p className="gta-time-jump-subtext">
                {INTERMISSION_STORIES[storySlideshow.levelCleared]?.timeJumpSub || "THE SYNDICATE STRIKES BACK!"}
              </p>
              <div className="gta-time-jump-progress">
                <div className="gta-time-jump-progress-fill" />
              </div>
            </div>
          )}

          {/* SLIDE 3: STORY BRIEFING & MANAGER GORDON BENNETT */}
          {storySlideshow.stage === "briefing" && (
            <div className="intermission-card" style={{ maxWidth: "780px" }}>
              <div className="intermission-newspaper-header">
                <span className="newspaper-date">
                  {INTERMISSION_STORIES[storySlideshow.levelCleared]?.location}
                </span>
                <h2 className="vice-display-lg newspaper-headline">
                  {INTERMISSION_STORIES[storySlideshow.levelCleared]?.headline}
                </h2>
              </div>

              <div className="intermission-story-box">
                <p>{INTERMISSION_STORIES[storySlideshow.levelCleared]?.story}</p>
              </div>

              <div className="gba-interactive-wrapper briefing-gba">
                <div className="gba-manager-slide-container slide-in">
                  <div className="manager-portrait-frame speaking">
                    <img src={managerImgSrc} alt="Bank Manager" className="manager-portrait-img" />
                  </div>
                </div>

                <div className="gba-dialogue-box">
                  <div className="gba-nameplate">
                    <span>👔 MANAGER GORDON BENNETT</span>
                    <span className="gba-mood-chip urgent">
                      {INTERMISSION_STORIES[storySlideshow.levelCleared]?.mood}
                    </span>
                  </div>
                  <div className="gba-text-content">
                    <p className="gba-typewriter-text">
                      {INTERMISSION_STORIES[storySlideshow.levelCleared]?.speech}
                    </p>
                  </div>
                  <div className="gba-prompt-arrow blink">▼</div>
                </div>
              </div>

              <div className="action-row center-actions">
                <button
                  type="button"
                  className="vice-btn primary-btn large-cta"
                  onClick={() => handleStartActiveDefense(INTERMISSION_STORIES[storySlideshow.levelCleared]?.targetLevel || 2)}
                >
                  {INTERMISSION_STORIES[storySlideshow.levelCleared]?.cta}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── SCREEN 7: CLASSIC GTA VICE CITY MISSION FAILED (Locked until Admin Unfreezes) ── */}
      {screen === "mission_failed" && (
        <section className={`mission-failed-fullscreen-stage ${isEjected ? "ejected-stage" : ""}`}>
          <div className="failed-inner-box">
            <h1 className="vice-display-lg failed-title">
              {isEjected ? "DISQUALIFIED" : "MISSION FAILED"}
            </h1>
            <p className="failed-reason">{breachReason}</p>

            <div className="failed-lockout-notice">
              <span className={`lockout-badge ${isEjected ? "ejected-badge" : ""}`}>
                {isEjected ? "🚫 EJECTED BY ADMIN" : "🔒 TERMINAL LOCKED DOWN"}
              </span>
              <p className="lockout-text">
                {isEjected
                  ? "Your station has been removed and disqualified from the tournament by Central Dispatch Admin. You cannot continue this session."
                  : "Your station has been locked by Central Security. You cannot proceed or refresh. Await Central Dispatch / Admin authorization from Port 5176 to unfreeze your terminal."}
              </p>
            </div>

            {!isEjected ? (
              <div className="failed-actions-row">
                <button
                  type="button"
                  className="vice-btn primary-btn retry-defense-btn"
                  onClick={() => {
                    setIsLockedBreach(false);
                    localStorage.removeItem("vch_locked_breach");
                    localStorage.removeItem("vch_breach_reason");
                    handleStartActiveDefense(currentLevel);
                  }}
                >
                  🔄 RESTART LEVEL {currentLevel} DEFENSE
                </button>

                <button
                  type="button"
                  className="dev-override-btn lobby-return-btn"
                  onClick={() => {
                    setIsLockedBreach(false);
                    setIsEjected(false);
                    localStorage.removeItem("vch_locked_breach");
                    localStorage.removeItem("vch_breach_reason");
                    localStorage.removeItem("vch_ejected");
                    setScreen("lobby");
                    exitFullscreenSafe();
                  }}
                >
                  ➔ RETURN TO SECURITY LOBBY
                </button>
              </div>
            ) : isSoloAllowed ? (
              <div className="solo-dev-unfreeze">
                <button
                  type="button"
                  id="ejected-name-input-btn"
                  className="dev-override-btn"
                  style={{
                    borderColor: "var(--vice-teal, #48d5d0)",
                    color: "var(--vice-teal, #48d5d0)",
                    boxShadow: "0 0 20px rgba(72, 213, 208, 0.4)",
                    letterSpacing: "0.08em",
                    padding: "12px 24px",
                    fontWeight: "800",
                  }}
                  onClick={handleResetToNameInput}
                >
                  [➔ REGISTER NEW AGENT DETAILS // RETURN TO NAME INPUT]
                </button>
              </div>
            ) : (
              <div className="ejected-warning-box" style={{ color: "#FF2A6D", fontWeight: 700, padding: "14px", border: "1px dashed #FF2A6D", marginTop: "16px", fontFamily: "var(--font-mono, monospace)", textAlign: "center", maxWidth: "500px", margin: "16px auto 0" }}>
                ⚠️ OPERATIVE DISQUALIFIED BY DISPATCH // CONTACT TOURNAMENT ORGANIZER
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SCREEN 8: GRAND CHAMPION FINALE ── */}
      {screen === "end" && (
        <section className="grand-victory-fullscreen-stage">
          <div className="victory-card">
            <span className="trophy-badge">🏆</span>
            <h1 className="vice-display-lg victory-title">MISSION PASSED!</h1>
            <div className="respect-plus-badge">RESPECT +</div>

            <p className="victory-speech">
              Manager Bennett: <em>"UNBELIEVABLE! You defended all 4 security vaults across 40 minutes of intense siege! The Omega Quantum Vault is permanently clamped shut, and VCPD SWAT arrested Vercetti's crew! By order of the Board, you are hereby appointed LEGENDARY GRAND DEFENDER OF VICE CITY!"</em>
            </p>

            <div className="action-row center-actions">
              <button
                type="button"
                className="vice-btn primary-btn"
                onClick={() => {
                  setScreen("lobby");
                  exitFullscreenSafe();
                }}
              >
                RETURN TO LOBBY ➔
              </button>
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
