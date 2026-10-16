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
import { syncPlayerToSupabase, fetchGameStateFromSupabase } from "../utils/supabaseClient";
import "./PlayerTerminal.css";

const CHANNEL_NAME = "vch-admin-bus";
const ADMIN_API_URL = "http://localhost:5176";

/* ─── 4-Level Progressive Campaign Configurations (10 Min Each) ─── */
const CAMPAIGN_LEVELS = {
  1: {
    levelNumber: 1,
    title: "LEVEL 1 // OUTER LOBBY & TELLERS GATE",
    shortName: "Level 1: Tellers Gate",
    subtitle: "Floor 01 · Teller Security Perimeter",
    rules: 10,
    startSeconds: 600, // 10:00 minutes
    drillSpeedMultiplier: 1.0,
    wantedStars: 2,
    bonusSeconds: 15,
    minLength: 8,
    minUpper: 2,
    digitSumTarget: 20,
    primeCountReq: 1,
    vowelCountReq: 2,
    color: "#48D5D0",
    promotionRank: "ACTING DEPUTY VAULT OFFICER",
    nextLevelLocation: "LEVEL 2: EXECUTIVE CASH CORRIDORS",
  },
  2: {
    levelNumber: 2,
    title: "LEVEL 2 // EXECUTIVE CASH CORRIDORS",
    shortName: "Level 2: Cash Corridor",
    subtitle: "Floor 02 · Safety Deposit Airlocks",
    rules: 20,
    startSeconds: 600, // 10:00 minutes
    drillSpeedMultiplier: 1.4,
    wantedStars: 3,
    bonusSeconds: 12,
    minLength: 12,
    minUpper: 3,
    digitSumTarget: 28,
    primeCountReq: 2,
    vowelCountReq: 3,
    color: "#FFD166",
    promotionRank: "CHIEF TITANIUM VAULT CUSTODIAN",
    nextLevelLocation: "LEVEL 3: TITANIUM DEEP VAULT",
  },
  3: {
    levelNumber: 3,
    title: "LEVEL 3 // TITANIUM DEEP VAULT",
    shortName: "Level 3: Deep Vault",
    subtitle: "Sub-Level · Master Titanium Chamber",
    rules: 32,
    startSeconds: 600, // 10:00 minutes
    drillSpeedMultiplier: 1.8,
    wantedStars: 5,
    bonusSeconds: 10,
    minLength: 15,
    minUpper: 4,
    digitSumTarget: 36,
    primeCountReq: 3,
    vowelCountReq: 4,
    color: "#F84391",
    promotionRank: "HONORARY BANK DIRECTOR",
    nextLevelLocation: "FINAL LEVEL 4: OMEGA QUANTUM CORE",
  },
  4: {
    levelNumber: 4,
    title: "FINAL LEVEL 4 // OMEGA QUANTUM CORE",
    shortName: "Level 4: Omega Core",
    subtitle: "Subterranean · Quantum Cryptographic Sanctum",
    rules: 45,
    startSeconds: 600, // 10:00 minutes (Supreme Difficulty)
    drillSpeedMultiplier: 2.4,
    wantedStars: 6,
    bonusSeconds: 8,
    minLength: 18,
    minUpper: 5,
    digitSumTarget: 46,
    primeCountReq: 4,
    vowelCountReq: 5,
    color: "#9B00FF",
    promotionRank: "LEGENDARY GRAND DEFENDER OF VICE CITY",
    nextLevelLocation: null,
  },
};

/* ─── Session Randomizer ─── */
function createSessionData() {
  const sponsors = ["daemon", "vercetti", "malibu", "ocean_drive", "ammu_nation"];
  const elements = [
    { sym: "Au", name: "Gold (Atomic #79)" },
    { sym: "Ag", name: "Silver (Atomic #47)" },
    { sym: "Fe", name: "Iron (Atomic #26)" },
    { sym: "Kr", name: "Krypton (Atomic #36)" },
    { sym: "Xe", name: "Xenon (Atomic #54)" },
  ];
  const geos = [
    { country: "Japan", capital: "tokyo" },
    { country: "France", capital: "paris" },
    { country: "Egypt", capital: "cairo" },
    { country: "Italy", capital: "rome" },
    { country: "Brazil", capital: "brasilia" },
  ];
  const romans = [
    { num: 35, roman: "XXXV" },
    { num: 49, roman: "XLIX" },
    { num: 74, roman: "LXXIV" },
    { num: 95, roman: "XCV" },
  ];
  const swatches = [
    { hex: "#FFF", css: "#ffffff", name: "Pure Vault White" },
    { hex: "#ACE", css: "#aaccee", name: "Vice Ice Blue" },
    { hex: "#FAB", css: "#ffaabb", name: "Flamingo Pink" },
    { hex: "#DAD", css: "#ddaadd", name: "Orchid Neon" },
  ];

  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    captcha += letters[Math.floor(Math.random() * letters.length)];
  }

  return {
    sponsor: sponsors[Math.floor(Math.random() * sponsors.length)],
    element: elements[Math.floor(Math.random() * elements.length)],
    geo: geos[Math.floor(Math.random() * geos.length)],
    romanTarget: romans[Math.floor(Math.random() * romans.length)],
    swatch: swatches[Math.floor(Math.random() * swatches.length)],
    captcha,
  };
}

function getDigitSum(pw) {
  return (pw.match(/\d/g) || []).reduce((acc, d) => acc + Number(d), 0);
}

/* ─── Build Full 45-Rule Security Suite ─── */
function buildAll45Rules(session, cfg) {
  return [
    {
      id: 1,
      text: `Master key must contain at least ${cfg.minLength} characters`,
      badge: (pw) => `${[...pw].length}/${cfg.minLength}`,
      hint: `Type at least ${cfg.minLength} characters to meet minimum cipher length.`,
      check: (pw) => [...pw].length >= cfg.minLength,
    },
    {
      id: 2,
      text: "Include at least one numerical vault digit (0-9)",
      badge: () => "Digit",
      hint: "Add any number from 0 to 9.",
      check: (pw) => /\d/.test(pw),
    },
    {
      id: 3,
      text: `Include at least ${cfg.minUpper} uppercase letters`,
      badge: (pw) => `${(pw.match(/[A-Z]/g) || []).length}/${cfg.minUpper}`,
      hint: `Insert ${cfg.minUpper} or more capital letters.`,
      check: (pw) => (pw.match(/[A-Z]/g) || []).length >= cfg.minUpper,
    },
    {
      id: 4,
      text: "Include at least one special security symbol (!@#$%^&*)",
      badge: () => "Symbol",
      hint: "Use punctuation or symbols like ! @ # $ % & *",
      check: (pw) => /[^a-zA-Z0-9\s]/.test(pw),
    },
    {
      id: 5,
      text: `The vault digits must mathematically sum up to exactly ${cfg.digitSumTarget}`,
      badge: (pw) => `Sum: ${getDigitSum(pw)}/${cfg.digitSumTarget}`,
      hint: (pw) => `Current sum is ${getDigitSum(pw)}. Target is ${cfg.digitSumTarget}.`,
      check: (pw) => getDigitSum(pw) === cfg.digitSumTarget,
    },
    {
      id: 6,
      text: "Include the name of any month in lowercase (e.g., may, june)",
      badge: () => "Month",
      hint: "Types: january, february, march, april, may, june, etc.",
      check: (pw) => /january|february|march|april|may|june|july|august|september|october|november|december/i.test(pw),
    },
    {
      id: 7,
      text: `Include target Roman numeral: ${session.romanTarget.roman} (${session.romanTarget.num})`,
      badge: () => session.romanTarget.roman,
      hint: `Type "${session.romanTarget.roman}" in uppercase.`,
      check: (pw) => pw.includes(session.romanTarget.roman),
    },
    {
      id: 8,
      text: `Include our bank security syndicate code: "${session.sponsor}"`,
      badge: () => "Syndicate",
      hint: `Type "${session.sponsor}" in your password.`,
      check: (pw) => pw.toLowerCase().includes(session.sponsor),
    },
    {
      id: 9,
      text: `Authorize with the 5-letter biometric captcha: [${session.captcha}]`,
      isCaptcha: true,
      badge: () => session.captcha,
      hint: `Enter "${session.captcha}" in exact uppercase letters.`,
      check: (pw) => pw.includes(session.captcha),
    },
    {
      id: 10,
      text: `Include at least ${cfg.primeCountReq} prime digit${cfg.primeCountReq > 1 ? "s" : ""} (2, 3, 5, 7)`,
      badge: (pw) => `${(pw.match(/[2357]/g) || []).length}/${cfg.primeCountReq}`,
      hint: `Prime digits are 2, 3, 5, 7. Insert at least ${cfg.primeCountReq}.`,
      check: (pw) => (pw.match(/[2357]/g) || []).length >= cfg.primeCountReq,
    },
    {
      id: 11,
      text: `Include the chemical element symbol for ${session.element.name}`,
      badge: () => session.element.sym,
      hint: `Chemical symbol for ${session.element.name} is "${session.element.sym}".`,
      check: (pw) => pw.includes(session.element.sym),
    },
    {
      id: 12,
      text: 'Include the vault emergency master clearance word: "KEY"',
      badge: () => "KEY",
      hint: 'Type "KEY" in uppercase letters.',
      check: (pw) => pw.includes("KEY"),
    },
    {
      id: 13,
      text: "Include the current fest year (2026) in Roman numerals: MMXXVI",
      badge: () => "MMXXVI",
      hint: "Type MMXXVI.",
      check: (pw) => pw.includes("MMXXVI"),
    },
    {
      id: 14,
      text: 'Include our coastal getaway boulevard: "OCEAN"',
      badge: () => "OCEAN",
      hint: 'Type "OCEAN" in your password.',
      check: (pw) => /ocean/i.test(pw),
    },
    {
      id: 15,
      text: 'Station our twin vault patrol surveillance code: "00"',
      badge: () => "00",
      hint: 'Type two consecutive zeros "00" in your password.',
      check: (pw) => pw.includes("00"),
    },
    {
      id: 16,
      text: `Include the capital city code of ${session.geo.country}`,
      badge: () => session.geo.capital,
      hint: `Capital of ${session.geo.country} is "${session.geo.capital}".`,
      check: (pw) => pw.toLowerCase().includes(session.geo.capital),
    },
    {
      id: 17,
      text: `Include at least ${cfg.vowelCountReq} uppercase English vowels (A, E, I, O, U)`,
      badge: (pw) => `${(pw.match(/[AEIOU]/g) || []).length}/${cfg.vowelCountReq}`,
      hint: `Uppercase vowels are A, E, I, O, U. Need ${cfg.vowelCountReq}.`,
      check: (pw) => (pw.match(/[AEIOU]/g) || []).length >= cfg.vowelCountReq,
    },
    {
      id: 18,
      text: 'Include the binary representation of decimal 2: "10"',
      badge: () => "10",
      hint: 'The number 2 in binary is "10".',
      check: (pw) => pw.includes("10"),
    },
    {
      id: 19,
      text: 'Include algebraic chess notation for Queen or Knight checkmate ("Q#" or "N#")',
      badge: () => "Q# / N#",
      hint: 'Type "Q#" for Queen mate or "N#" for Knight mate.',
      check: (pw) => pw.includes("Q#") || pw.includes("N#"),
    },
    {
      id: 20,
      text: 'Include a 4-letter English palindrome (e.g., "noon", "deed")',
      badge: () => "Palindrome",
      hint: 'Examples: "noon", "deed", "peep", "anna", "otto".',
      check: (pw) => /noon|deed|peep|anna|otto|toot|elle/i.test(pw),
    },
    {
      id: 21,
      text: 'Thermal drill overheating! Inject vault coolant formula: "H2O"',
      badge: () => "H2O",
      hint: 'Type "H2O" with capital H, number 2, and capital O.',
      check: (pw) => pw.includes("H2O"),
    },
    {
      id: 22,
      text: `Include 3-character uppercase hex code for vault color swatch`,
      isSwatch: true,
      swatchColor: session.swatch.css,
      badge: () => session.swatch.hex,
      hint: `Color swatch hex code is "${session.swatch.hex}".`,
      check: (pw) => pw.includes(session.swatch.hex),
    },
    {
      id: 23,
      text: "Include the name of any noble gas (e.g., neon, argon, krypton)",
      badge: () => "Noble Gas",
      hint: "Types: helium, neon, argon, krypton, xenon, radon.",
      check: (pw) => /helium|neon|argon|krypton|xenon|radon/i.test(pw),
    },
    {
      id: 24,
      text: "Enclose encryption parameters with both opening and closing square brackets: [ ]",
      badge: () => "[ ]",
      hint: 'Include both "[" and "]".',
      check: (pw) => pw.includes("[") && pw.includes("]"),
    },
    {
      id: 25,
      text: "Include a major world currency symbol ($ € £ ¥ ₹)",
      badge: () => "Currency",
      hint: 'Include a currency symbol like "$" (Shift + 4), "€", "£", "¥", or "₹".',
      check: (pw) => /[$€£¥₹]/.test(pw),
    },
    {
      id: 26,
      text: 'Include an uppercase boolean logic gate ("NAND", "NOR", or "XOR")',
      badge: () => "Logic Gate",
      hint: 'Type "NAND", "NOR", or "XOR".',
      check: (pw) => pw.includes("NAND") || pw.includes("NOR") || pw.includes("XOR"),
    },
    {
      id: 27,
      text: 'Include Vice City synthwave chord notation: "Am" or "Em"',
      badge: () => "Chord",
      hint: 'Type "Am" or "Em".',
      check: (pw) => pw.includes("Am") || pw.includes("Em"),
    },
    {
      id: 28,
      text: 'Include the largest planet in our solar system: "jupiter"',
      badge: () => "Astronomy",
      hint: 'Largest planet is "jupiter".',
      check: (pw) => pw.toLowerCase().includes("jupiter"),
    },
    {
      id: 29,
      text: 'Include the 2-letter uppercase HTTP 200 status word: "OK"',
      badge: () => "HTTP Status",
      hint: 'Type "OK".',
      check: (pw) => pw.includes("OK"),
    },
    {
      id: 30,
      text: 'Include the universal 3-letter DNA start codon: "ATG"',
      badge: () => "Genetics",
      hint: 'Type "ATG" in uppercase.',
      check: (pw) => pw.includes("ATG"),
    },
    {
      id: 31,
      text: 'Seal the security archive with file extension: ".enc"',
      badge: () => ".enc",
      hint: 'Type ".enc" (period, e, n, c).',
      check: (pw) => pw.includes(".enc"),
    },
    {
      id: 32,
      text: 'Include both addition and equality math operators: "+" and "="',
      badge: () => "Operators",
      hint: 'Include both "+" and "=".',
      check: (pw) => pw.includes("+") && pw.includes("="),
    },
    {
      id: 33,
      text: "Prohibited: Master key must not contain any whitespace characters",
      badge: () => "No Spaces",
      hint: "Remove all space characters.",
      check: (pw) => !/\s/.test(pw),
    },
    {
      id: 34,
      text: "Symmetry protocol: First and last characters of master key must be identical",
      badge: (pw) => (pw.length >= 2 ? `${pw[0]} … ${pw[pw.length - 1]}` : "Match"),
      hint: "Make the very first character and last character the same character.",
      check: (pw) => {
        const c = [...pw];
        return c.length >= 2 && c[0] === c[c.length - 1];
      },
    },
    {
      id: 35,
      text: "Parity check: Total character count must be an even number",
      badge: (pw) => `Len: ${[...pw].length}`,
      hint: "Add or remove one character so the length is an even number.",
      check: (pw) => [...pw].length > 0 && [...pw].length % 2 === 0,
    },
    {
      id: 36,
      text: 'VCPD Radio Protocol: Include standard radio receipt confirmation: "10-4"',
      badge: () => "10-4",
      hint: 'Include "10-4" in your master key.',
      check: (pw) => pw.includes("10-4"),
    },
    {
      id: 37,
      text: 'Include ASCII hexadecimal code for letter "V" (Vice): "56"',
      badge: () => "Hex 56",
      hint: 'The ASCII hex code for "V" is 56. Type "56".',
      check: (pw) => pw.includes("56"),
    },
    {
      id: 38,
      text: "Enclose at least one character inside curly brackets: { }",
      badge: () => "{ }",
      hint: 'Wrap any letter or number in curly braces, e.g., "{7}" or "{V}".',
      check: (pw) => /\{[^{}]+\}/.test(pw),
    },
    {
      id: 39,
      text: 'Relativistic security factor: Include energy mass equivalence constant: "mc^2" or "mc2"',
      badge: () => "mc^2",
      hint: 'Type "mc^2" or "mc2".',
      check: (pw) => /mc\^2|mc2/i.test(pw),
    },
    {
      id: 40,
      text: 'Include legendary Vice City neon hotspot: "MALIBU"',
      badge: () => "MALIBU",
      hint: 'Include the nightclub name "MALIBU" (case-insensitive).',
      check: (pw) => /malibu/i.test(pw),
    },
    {
      id: 41,
      text: 'Include 3 consecutive Fibonacci sequence numbers: "112", "123", "235", or "358"',
      badge: () => "Fibonacci",
      hint: 'Type a 3-number Fibonacci sequence: "112", "123", "235", or "358".',
      check: (pw) => /112|123|235|358/.test(pw),
    },
    {
      id: 42,
      text: 'Include the quadrennial leap day: "FEB29" or "29FEB"',
      badge: () => "Leap Day",
      hint: 'Include leap day string "FEB29" or "29FEB".',
      check: (pw) => /feb29|29feb/i.test(pw),
    },
    {
      id: 43,
      text: "Include Tommy's high-speed getaway vehicle: \"INFERNUS\" or \"CHEETAH\"",
      badge: () => "Supercar",
      hint: 'Type supercar model "INFERNUS" or "CHEETAH" (case-insensitive).',
      check: (pw) => /infernus|cheetah/i.test(pw),
    },
    {
      id: 44,
      text: 'Include standard local network CIDR prefix: "/24" or "/16"',
      badge: () => "CIDR",
      hint: 'Include subnet prefix "/24" or "/16".',
      check: (pw) => pw.includes("/24") || pw.includes("/16"),
    },
    {
      id: 45,
      text: 'The Master Lockdown Seal: Include emergency vault command: "VAULT_LOCKED"',
      badge: () => "VAULT_LOCKED",
      hint: 'Type "VAULT_LOCKED" to complete the final quantum lock.',
      check: (pw) => /VAULT_LOCKED/i.test(pw),
    },
  ];
}

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
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("vch_player_name") || "");
  const [playerAlias, setPlayerAlias] = useState(() => localStorage.getItem("vch_player_alias") || "");
  const [playerCollege, setPlayerCollege] = useState(() => localStorage.getItem("vch_player_college") || "");
  const [isRegistered, setIsRegistered] = useState(() => Boolean(localStorage.getItem("vch_registered")));

  /* Lockout & Security Freeze State */
  const [isLockedBreach, setIsLockedBreach] = useState(() => localStorage.getItem("vch_locked_breach") === "true");
  const [isEjected, setIsEjected] = useState(() => localStorage.getItem("vch_ejected") === "true");
  const [isPlayerFrozen, setIsPlayerFrozen] = useState(false);
  const [breachReason, setBreachReason] = useState(() => localStorage.getItem("vch_breach_reason") || "");

  const handleEjected = useCallback(() => {
    clearInterval(timerRef.current);
    setIsLockedBreach(true);
    setIsEjected(true);
    setBreachReason("DISQUALIFIED & REMOVED FROM TOURNAMENT BY DISPATCH ADMIN");
    localStorage.setItem("vch_locked_breach", "true");
    localStorage.setItem("vch_ejected", "true");
    localStorage.setItem("vch_breach_reason", "DISQUALIFIED & REMOVED FROM TOURNAMENT BY DISPATCH ADMIN");
    setScreen("mission_failed");
    exitFullscreenSafe();
    SoundEngine.init();
    SoundEngine.playAlert();
    SoundEngine.playDenied();
  }, []);

  /* 4-Level 40-Minute Progressive Campaign State (10 Min Each) */
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelScores, setLevelScores] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [levelTimes, setLevelTimes] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [totalCampaignSeconds, setTotalCampaignSeconds] = useState(0);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(true);

  /* Video & Manager Avatar Assets */
  const [managerImgSrc] = useState(() => getAssetUrl("/images/manager.png"));
  const videoRef = useRef(null);

  /* Game Session */
  const [password, setPassword] = useState("");
  const [unlockedCount, setUnlockedCount] = useState(1);
  const [timeLeft, setTimeLeft] = useState(600); // 10:00 minutes
  const [survivedSeconds, setSurvivedSeconds] = useState(0);
  const [revealedHints, setRevealedHints] = useState(() => new Set());
  const [bonusFloat, setBonusFloat] = useState(null);
  const [lastPraise, setLastPraise] = useState(null);

  const [sessionData, setSessionData] = useState(() => createSessionData());

  /* Stable Refs */
  const passwordRef = useRef(password);
  passwordRef.current = password;

  const unlockedCountRef = useRef(unlockedCount);
  unlockedCountRef.current = unlockedCount;

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  const survivedSecondsRef = useRef(survivedSeconds);
  survivedSecondsRef.current = survivedSeconds;

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const cfg = CAMPAIGN_LEVELS[currentLevel] || CAMPAIGN_LEVELS[1];
  const allRules = useMemo(() => buildAll45Rules(sessionData, cfg), [sessionData, cfg]);
  const activeRulesList = useMemo(() => allRules.slice(0, cfg.rules), [allRules, cfg]);

  /* ── Report Player Status to Supabase, Local Bus, & Admin Server ── */
  const reportToAdmin = useCallback(async (overrides = {}) => {
    // Determine effective name and ensure station always reports
    let effectiveName = (overrides.name !== undefined ? overrides.name : (playerName || localStorage.getItem("vch_player_name") || ""))?.trim();
    if (!effectiveName) {
      effectiveName = (playerAlias || localStorage.getItem("vch_player_alias") || "").trim() || `Station ${playerId.slice(-4)}`;
    }

    const curUnlocked = overrides.unlockedCount !== undefined ? overrides.unlockedCount : unlockedCountRef.current;
    const curLevel = overrides.currentLevel !== undefined ? overrides.currentLevel : currentLevel;
    const curTime = overrides.timeLeft !== undefined ? overrides.timeLeft : timeLeftRef.current;
    const curBreach = overrides.isBreached !== undefined ? overrides.isBreached : isLockedBreach;
    const curFrozen = overrides.isFrozen !== undefined ? overrides.isFrozen : (isPlayerFrozen || Boolean(parentFrozen));
    const curPassword = overrides.currentPassword !== undefined ? overrides.currentPassword : (passwordRef.current || "");

    const calculatedScore = Math.max(0, curUnlocked - 1) * 150 + (curLevel - 1) * 600 + Math.max(0, curTime || 0);

    const payload = {
      id: playerId,
      name: effectiveName,
      alias: (overrides.alias !== undefined ? overrides.alias : (playerAlias || localStorage.getItem("vch_player_alias") || "")) || `Station ${playerId.slice(-4)}`,
      college: overrides.college !== undefined ? overrides.college : (playerCollege || localStorage.getItem("vch_player_college") || "Vice City"),

      status: curBreach
        ? "BREACH_LOCKED"
        : curFrozen
        ? "FROZEN"
        : screen === "game"
        ? `LEVEL_${curLevel}_ACTIVE`
        : screen.toUpperCase(),
      currentLevel: curLevel,
      chapter: curLevel,
      rulesCleared: Math.max(0, curUnlocked - 1),
      score: calculatedScore,
      timeLeft: curTime,
      isBreached: curBreach,
      isFrozen: curFrozen,
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
  }, [playerId, playerName, playerAlias, playerCollege, isLockedBreach, isPlayerFrozen, parentFrozen, screen, currentLevel, handleEjected]);

  /* ── Periodic Heartbeat: ensures live password and stats update smoothly ── */
  useEffect(() => {
    reportToAdmin();
    const interval = setInterval(() => {
      reportToAdmin();
    }, 1500);
    return () => clearInterval(interval);
  }, [reportToAdmin]);

  /* ── Start Fullscreen Mode ── */
  const requestFullscreenSafe = () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen && !document.fullscreenElement) {
        el.requestFullscreen().catch(() => {});
      }
    } catch (_) {}
  };

  /* ── Release Fullscreen Mode ── */
  const exitFullscreenSafe = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (_) {}
  };

  /* ── Launch Story Mode from Lobby ── */
  const launchStoryMode = useCallback(() => {
    SoundEngine.init();
    SoundEngine.playClick();
    SoundEngine.playWantedStar();
    requestFullscreenSafe();
    setScreen("cutscene");
    setCurrentLevel(1);
    reportToAdmin({ status: "STORY_CUTSCENE", currentLevel: 1 });
  }, [reportToAdmin]);

  /* ── Advance to specific level ── */
  const advanceFloorByAdmin = useCallback((targetLevel) => {
    SoundEngine.init();
    SoundEngine.playSwoosh();
    SoundEngine.playSuccess();
    const nextLvl = targetLevel || Math.min(currentLevel + 1, 4);
    const targetCfg = CAMPAIGN_LEVELS[nextLvl];
    setCurrentLevel(nextLvl);
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
    reportToAdmin({
      status: `LEVEL_${nextLvl}_ACTIVE`,
      currentLevel: nextLvl,
      rulesCleared: 0,
      currentPassword: "",
    });
  }, [currentLevel, reportToAdmin]);

  /* ── Listen for BroadcastChannel events ── */
  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") return;
    const bus = new BroadcastChannel(CHANNEL_NAME);
    bus.onmessage = (evt) => {
      const { type, playerId: pid, frozen: f } = evt.data || {};
      if (type === "remove" && pid === playerId) {
        handleEjected();
      } else if (type === "start_story") {
        if (screen === "lobby") {
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
          if (screen === "mission_failed") {
            setScreen("game");
            setTimeLeft(cfg.startSeconds);
            timeLeftRef.current = cfg.startSeconds;
          }
        }
      } else if (type === "globalFreeze") {
        setIsPlayerFrozen(Boolean(f));
        SoundEngine.init();
        if (f) SoundEngine.playFreeze();
        else SoundEngine.playUnlock();
      } else if (type === "advance" && pid === playerId) {
        advanceFloorByAdmin();
      }
    };
    return () => bus.close();
  }, [playerId, handleEjected, screen, launchStoryMode, cfg.startSeconds, advanceFloorByAdmin]);

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
              if (cmd.action === "START_STORY_MODE" && screen === "lobby") {
                launchStoryMode();
              } else if (cmd.action === "UNFREEZE_PLAYER" && (!cmd.playerId || cmd.playerId === playerId)) {
                setIsPlayerFrozen(false);
                setIsLockedBreach(false);
                setIsEjected(false);
                localStorage.removeItem("vch_locked_breach");
                localStorage.removeItem("vch_breach_reason");
                localStorage.removeItem("vch_ejected");
                if (screen === "mission_failed") {
                  setScreen("game");
                  setTimeLeft(cfg.startSeconds);
                  timeLeftRef.current = cfg.startSeconds;
                }
              } else if (cmd.action === "FREEZE_PLAYER" && cmd.playerId === playerId) {
                setIsPlayerFrozen(true);
              } else if (cmd.action === "ADVANCE_PLAYER" && cmd.playerId === playerId) {
                advanceFloorByAdmin();
              } else if (cmd.action === "REMOVE_PLAYER" && cmd.playerId === playerId) {
                handleEjected();
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

        if (cmd) {
          const cmdTime = cmd.timestamp;
          const lastProcessed = Number(sessionStorage.getItem("vch_last_admin_cmd") || 0);

          if (cmdTime > lastProcessed) {
            sessionStorage.setItem("vch_last_admin_cmd", String(cmdTime));

            if (cmd.action === "START_STORY_MODE") {
              if (screen === "lobby") {
                launchStoryMode();
              }
            } else if (cmd.action === "UNFREEZE_PLAYER") {
              if (!cmd.playerId || cmd.playerId === playerId) {
                setIsPlayerFrozen(false);
                setIsLockedBreach(false);
                setIsEjected(false);
                localStorage.removeItem("vch_locked_breach");
                localStorage.removeItem("vch_breach_reason");
                localStorage.removeItem("vch_ejected");
                if (screen === "mission_failed") {
                  setScreen("game");
                  setTimeLeft(cfg.startSeconds);
                  timeLeftRef.current = cfg.startSeconds;
                }
              }
            } else if (cmd.action === "FREEZE_PLAYER" && cmd.playerId === playerId) {
              setIsPlayerFrozen(true);
            } else if (cmd.action === "ADVANCE_PLAYER" && cmd.playerId === playerId) {
              advanceFloorByAdmin();
            } else if (cmd.action === "REMOVE_PLAYER") {
              if (cmd.playerId === playerId) {
                handleEjected();
              }
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
  }, [screen, launchStoryMode, playerId, cfg.startSeconds, handleEjected, advanceFloorByAdmin]);

  /* ── Anti-Cheat: Fullscreen & Tab Switch Watcher ── */
  useEffect(() => {
    if (screen !== "game" || isLockedBreach) return;

    const handleVisibilityChange = () => {
      if (document.hidden && screen === "game") {
        clearInterval(timerRef.current);
        setIsLockedBreach(true);
        setBreachReason("UNAUTHORIZED TAB SWITCH DETECTED");
        localStorage.setItem("vch_locked_breach", "true");
        localStorage.setItem("vch_breach_reason", "UNAUTHORIZED TAB SWITCH DETECTED");
        setScreen("mission_failed");
        exitFullscreenSafe();
        SoundEngine.init();
        SoundEngine.playMissionFailed();
        reportToAdmin({ isBreached: true, status: "LOCKED_TAB_SWITCH" });
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && screen === "game") {
        clearInterval(timerRef.current);
        setIsLockedBreach(true);
        setBreachReason("FULLSCREEN DEPARTURE DETECTED");
        localStorage.setItem("vch_locked_breach", "true");
        localStorage.setItem("vch_breach_reason", "FULLSCREEN DEPARTURE DETECTED");
        setScreen("mission_failed");
        exitFullscreenSafe();
        SoundEngine.init();
        SoundEngine.playMissionFailed();
        reportToAdmin({ isBreached: true, status: "LOCKED_FULLSCREEN_EXIT" });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [screen, isLockedBreach, reportToAdmin]);

  /* ── Time Adjustment & Feedback ── */
  const triggerTimeBonus = useCallback((delta) => {
    setTimeLeft((prev) => {
      const next = Math.max(0, prev + delta);
      timeLeftRef.current = next;
      return next;
    });
    setBonusFloat(`+${delta}s`);
    setTimeout(() => setBonusFloat(null), 1800);
  }, []);

  /* ── Level Finished Handler ── */
  const handleLevelFinished = useCallback(
    (won, finalPw, finalUnlocked) => {
      clearInterval(timerRef.current);
      if (soundEnabled) SoundEngine.stopDrone();

      if (!won) {
        // Mission Failed!
        if (soundEnabled) SoundEngine.playMissionFailed();
        setIsLockedBreach(true);
        setBreachReason("THE VAULT WAS BREACHED! TOMMY VERCETTI ESCAPED WITH $3,000,000");
        localStorage.setItem("vch_locked_breach", "true");
        localStorage.setItem("vch_breach_reason", "THE VAULT WAS BREACHED! TOMMY VERCETTI ESCAPED WITH $3,000,000");
        setScreen("mission_failed");
        reportToAdmin({ status: "LOCKED_FAILED", isBreached: true });
        return;
      }

      // Level Cleared Successfully!
      if (soundEnabled) {
        SoundEngine.playSuccess();
        try {
          confetti({
            particleCount: 130,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#F84391", "#48D5D0", "#FFD166", "#FFF2E3"],
          });
        } catch (_) {}
      }

      const levelScore = Math.round(
        survivedSecondsRef.current * 15 + cfg.rules * 160 + timeLeftRef.current * 20
      );

      setLevelScores((prev) => ({ ...prev, [currentLevel]: levelScore }));
      setLevelTimes((prev) => ({ ...prev, [currentLevel]: survivedSecondsRef.current }));

      // Story Intermission Transitions
      if (currentLevel === 1) {
        setScreen("story_intermission_1");
        reportToAdmin({ status: "CLEARED_LEVEL_1", currentLevel: 2 });
      } else if (currentLevel === 2) {
        setScreen("story_intermission_2");
        reportToAdmin({ status: "CLEARED_LEVEL_2", currentLevel: 3 });
      } else if (currentLevel === 3) {
        setScreen("story_intermission_3");
        reportToAdmin({ status: "CLEARED_LEVEL_3", currentLevel: 4 });
      } else {
        // Grand Victory!
        exitFullscreenSafe();
        setScreen("end");
        reportToAdmin({ status: "GRAND_WON" });
      }
    },
    [cfg, currentLevel, soundEnabled, reportToAdmin]
  );

  /* ── Input Change & Progressive Unlock ── */
  const handleInputChange = (e) => {
    if (isLockedBreach || isPlayerFrozen || Boolean(parentFrozen)) return;
    const newPw = e.target.value;
    setPassword(newPw);
    passwordRef.current = newPw;
    if (soundEnabled) SoundEngine.playKeyType();

    let curUnlocked = unlockedCount;
    while (curUnlocked <= cfg.rules) {
      const activeRules = activeRulesList.slice(0, curUnlocked);
      const allPassed = activeRules.every((r) => r.check(newPw));

      if (allPassed) {
        if (curUnlocked === cfg.rules) {
          setUnlockedCount(curUnlocked);
          reportToAdmin({ currentPassword: newPw, password: newPw, unlockedCount: curUnlocked });
          handleLevelFinished(true, newPw, curUnlocked);
          return;
        }
        curUnlocked += 1;
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

    // Save live password to Supabase and BroadcastChannel in real-time
    reportToAdmin({ currentPassword: newPw, password: newPw, unlockedCount: curUnlocked });
  };

  /* ── Cutscene Completion ── */
  const handleCutsceneDone = () => {
    if (videoRef.current) videoRef.current.pause();
    if (soundEnabled) SoundEngine.playClick();
    setScreen("briefing");
    reportToAdmin({ status: "BRIEFING" });
  };

  /* ── Start Active Defense on Current Level ── */
  const handleStartActiveDefense = (levelToStart) => {
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
    setIsPlayerFrozen(false);
    setIsLockedBreach(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    reportToAdmin({
      status: `LEVEL_${levelToStart}_ACTIVE`,
      currentLevel: levelToStart,
      rulesCleared: 0,
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

  /* ── Manager Dialogue Computation ── */
  const displayedRules = useMemo(() => activeRulesList.slice(0, unlockedCount), [activeRulesList, unlockedCount]);
  const activeFailing = useMemo(
    () => [...displayedRules].reverse().find((r) => !r.check(password)),
    [displayedRules, password]
  );
  const currentDirective = useMemo(
    () => getManagerDirective(activeFailing?.id, password, cfg),
    [activeFailing, password, cfg]
  );

  /* Typewriter Effect with retro GBA text blips */
  const [typedSpeech, setTypedSpeech] = useState("");
  useEffect(() => {
    let i = 0;
    const fullText = currentDirective.speech;
    setTypedSpeech("");

    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedSpeech(fullText.slice(0, i + 1));
        if (soundEnabled && i % 3 === 0) SoundEngine.playTextBlip();
        i++;
      } else {
        clearInterval(interval);
      }
    }, 24);

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
    const newPw = password + char;
    handleInputChange({ target: { value: newPw } });
    inputRef.current?.focus();
  }, [password, isLockedBreach, isPlayerFrozen, parentFrozen, handleInputChange]);

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
        setIsLockedBreach(true);
        setBreachReason("MISSION ABORTED BY AGENT");
        setScreen("mission_failed");
        reportToAdmin({ status: "ABORTED", isBreached: true });
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
    const trimmedName = playerName.trim();
    if (!trimmedName) return;
    const finalAlias = (playerAlias || "").trim() || `Station ${playerId.slice(-4)}`;
    const finalCollege = (playerCollege || "").trim();

    localStorage.setItem("vch_player_id", playerId);
    localStorage.setItem("vch_player_name", trimmedName);
    localStorage.setItem("vch_player_alias", finalAlias);
    localStorage.setItem("vch_player_college", finalCollege);
    localStorage.setItem("vch_registered", "true");
    setPlayerName(trimmedName);
    setPlayerAlias(finalAlias);
    setPlayerCollege(finalCollege);
    setIsRegistered(true);

    if (soundEnabled) SoundEngine.playClick();
    reportToAdmin({
      status: "IN_LOBBY",
      isRegistered: true,
      name: trimmedName,
      alias: finalAlias,
      college: finalCollege,
    });
  };


  /* ══════════════════════════════════════════════════
     RENDER INTERFACE
     ══════════════════════════════════════════════════ */
  return (
    <main className={`terminal-root ${isLockedBreach ? "breach-locked" : ""}`}>

      {/* ── SCREEN 1: WAITING LOBBY (Main Association Background & Clutter-Free) ── */}
      {screen === "lobby" && (
        <section className="lobby-fullscreen-stage">
          {/* Main Association Website Sunset Background Layers */}
          <div className="lobby-bg-viewport" aria-hidden="true">
            <img
              src={getAssetUrl("/images/vice-hero.jpg")}
              alt="DAEMON Vice City Sunset"
              className="lobby-bg-img"
            />
            <div className="lobby-bg-overlay-warm" />
            <div className="lobby-bg-overlay-vignette" />
            <div className="lobby-bg-sunflare" />
            <div className="lobby-bg-grain" />
          </div>

          <div className="lobby-card">
            <div className="lobby-badge">🚔 VCPD CENTRAL BANK DISPATCH · DAEMON '26</div>
            <h1 className="vice-display-lg lobby-title">EL BANCO CORRUPTO GRANDE</h1>
            <p className="lobby-subtitle">CENTRAL VAULT DEFENSE PROTOCOL · CSE ASSOCIATION</p>

            {!isRegistered ? (
              /* Registration Form */
              <form onSubmit={handleRegisterLobby} className="lobby-reg-form">
                <div className="form-group">
                  <label className="form-label">YOUR FULL NAME / AGENT NAME</label>
                  <input
                    type="text"
                    required
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="e.g. Lance Vance"
                    className="lobby-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="form-label">STATION / TERMINAL ALIAS</label>
                    <input
                      type="text"
                      value={playerAlias}
                      onChange={(e) => setPlayerAlias(e.target.value)}
                      placeholder="e.g. Terminal #04"
                      className="lobby-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="form-label">COLLEGE / TEAM NAME</label>
                    <input
                      type="text"
                      value={playerCollege}
                      onChange={(e) => setPlayerCollege(e.target.value)}
                      placeholder="e.g. Cyber Squad"
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
                <div className="vault-rotary-lock" title="Central Vault Combination Dial">
                  <div className="vault-dial-ring">
                    <div className="vault-dial-tick tick-0"></div>
                    <div className="vault-dial-tick tick-20"></div>
                    <div className="vault-dial-tick tick-40"></div>
                    <div className="vault-dial-tick tick-60"></div>
                    <div className="vault-dial-tick tick-80"></div>
                  </div>
                  <div className="vault-wheel-spinner">
                    <div className="vault-spoke spoke-vert"></div>
                    <div className="vault-spoke spoke-horiz"></div>
                    <div className="vault-spoke spoke-diag1"></div>
                    <div className="vault-spoke spoke-diag2"></div>
                    <div className="vault-center-hub">
                      <div className="vault-hub-laser"></div>
                    </div>
                  </div>
                </div>

                <div className="waiting-status-box">
                  <div className="waiting-pulse-dot"></div>
                  <span className="waiting-status-text">
                    TERMINAL CONNECTED: <strong>{playerName}</strong> ({playerAlias})
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
                      reportToAdmin({ status: "NAME_ENTRY" });
                    }}
                    title="Return to name & terminal registration page"
                  >
                    ⮌ BACK TO AGENT REGISTRATION
                  </button>

                  <button
                    type="button"
                    className="solo-start-btn"
                    onClick={launchStoryMode}
                    title="Click for solo testing or offline demo"
                  >
                    ▶ [SOLO TEST: LAUNCH STORY MODE DIRECTLY]
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── SCREEN 2: TOMMY VERCETTI CUTSCENE VIDEO ── */}
      {screen === "cutscene" && (
        <section className="cutscene-fullscreen-stage">
          <div className="video-player-frame">
            <video
              ref={videoRef}
              src={getAssetUrl("/video/heist_intro.mp4")}
              autoPlay
              playsInline
              onEnded={handleCutsceneDone}
              className="heist-cutscene-video"
            />
            <div className="cutscene-controls-overlay">
              <span className="cutscene-tag">🎬 TRANSMISSION // LIVE INFILTRATION</span>
              <button
                type="button"
                className="vice-btn primary-btn skip-cutscene-btn"
                onClick={handleCutsceneDone}
              >
                PROCEED TO SECURITY LOCKER ROOM ➔
              </button>
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
                        <div className="crt-chars-wrapper">
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
                  <span className="neon-rules-sparkle" aria-hidden="true">✦</span>
                </div>

                <div className="neon-rules-scroll">
                  {displayedRules.map((rule) => {
                    const passed = rule.check(password);
                    const isHinted = revealedHints.has(rule.id);
                    const isFailingCurrent = activeFailing?.id === rule.id;

                    return (
                      <div
                        key={rule.id}
                        className={`neon-rule-row ${passed ? "rule-passed" : "rule-failing"} ${isFailingCurrent ? "rule-current-failing" : ""}`}
                        onClick={() => {
                          if (!revealedHints.has(rule.id)) {
                            setRevealedHints((prev) => new Set([...prev, rule.id]));
                            triggerTimeBonus(-15);
                            if (soundEnabled) SoundEngine.playHintUsed();
                          }
                        }}
                        title="Click to reveal Manager Intel (-15s)"
                      >
                        <div className="neon-rule-content">
                          <span className="neon-bullet">{passed ? "✓" : "•"}</span>
                          <span className="neon-rule-text">{rule.text.toUpperCase()}</span>
                          {rule.isSwatch ? (
                            <span className="neon-swatch" style={{ backgroundColor: rule.swatchColor }} />
                          ) : (
                            <span className="neon-badge">{rule.badge(password)}</span>
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
                  setIsLockedBreach(true);
                  setBreachReason("MISSION ABORTED BY AGENT");
                  setScreen("mission_failed");
                  reportToAdmin({ status: "ABORTED", isBreached: true });
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
                  setIsLockedBreach(true);
                  setBreachReason("MISSION ABORTED BY AGENT");
                  setScreen("mission_failed");
                  reportToAdmin({ status: "ABORTED", isBreached: true });
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

      {/* ── SCREEN 5: STORY INTERMISSION 1 (Tommy Didn't Accept Defeat) ── */}
      {screen === "story_intermission_1" && (
        <section className="intermission-fullscreen-stage">
          <div className="intermission-card">
            <div className="intermission-newspaper-header">
              <span className="newspaper-date">🌴 THREE DAYS LATER IN VICE CITY... 🌴</span>
              <h2 className="vice-display-lg newspaper-headline">
                TOMMY VERCETTI REFUSED TO ACCEPT DEFEAT!
              </h2>
            </div>

            <div className="intermission-story-box">
              <p>
                Word on Ocean Beach is Tommy Vercetti trashed the Malibu Club in a blind fury after being repelled at the Tellers Gate! He refused to accept defeat! He regrouped his syndicate, acquired high-yield thermal drills, and is storming the Executive Cash Corridors right now!
              </p>
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
                  <span className="gba-mood-chip urgent">ALARMED</span>
                </div>
                <div className="gba-text-content">
                  <p className="gba-typewriter-text">
                    "ROOKIE! HE DIDN'T ACCEPT HIS LOSS! He's drilling twice as fast—we need to make the password STRONGER, and FASTER than before! Move to Level 2 Executive Corridors NOW!"
                  </p>
                </div>
                <div className="gba-prompt-arrow blink">▼</div>
              </div>
            </div>

            <div className="action-row center-actions">
              <button
                type="button"
                className="vice-btn primary-btn large-cta"
                onClick={() => handleStartActiveDefense(2)}
              >
                ENGAGE LEVEL 2 DEFENSE (FASTER DRILL) ➔
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── SCREEN 6: STORY INTERMISSION 2 (Final Siege) ── */}
      {screen === "story_intermission_2" && (
        <section className="intermission-fullscreen-stage">
          <div className="intermission-card">
            <div className="intermission-newspaper-header">
              <span className="newspaper-date">🌴 ONE WEEK LATER... STARFISH ISLAND 🌴</span>
              <h2 className="vice-display-lg newspaper-headline">
                THE FINAL SIEGE: VERCETTI'S ALL-OUT ASSAULT ON THE DEEP VAULT!
              </h2>
            </div>

            <div className="intermission-story-box">
              <p>
                Furious after two failed attempts, Tommy Vercetti deployed an industrial laser drill directly into the Sub-Level Titanium Deep Vault! This is his last, most desperate heist attempt!
              </p>
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
                  <span className="gba-mood-chip urgent">DESPERATE</span>
                </div>
                <div className="gba-text-content">
                  <p className="gba-typewriter-text">
                    "HOLD THE LINE, ASSISTANT! All 32 security layers must be locked simultaneously—and FASTER than ever! If you fail, the bank's entire gold reserve is his! SECURE THE TITANIUM VAULT!"
                  </p>
                </div>
                <div className="gba-prompt-arrow blink">▼</div>
              </div>
            </div>

            <div className="action-row center-actions">
              <button
                type="button"
                className="vice-btn primary-btn large-cta"
                onClick={() => handleStartActiveDefense(3)}
              >
                DEPLOY LEVEL 3 MAXIMUM CIPHER ➔
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── SCREEN 6B: STORY INTERMISSION 3 (Omega Core Lockdown) ── */}
      {screen === "story_intermission_3" && (
        <section className="intermission-fullscreen-stage">
          <div className="intermission-card">
            <div className="intermission-newspaper-header">
              <span className="newspaper-date">🌴 MIDNIGHT IN VICE CITY... 🌴</span>
              <h2 className="vice-display-lg newspaper-headline">
                CODE RED: OMEGA QUANTUM CORE UNDER DIRECT ASSAULT!
              </h2>
            </div>

            <div className="intermission-story-box">
              <p>
                Repelled from the Titanium Deep Vault, Tommy Vercetti deployed military-grade diamond plasma cutters and cyber-jamming arrays into the subterranean Omega Quantum Sanctum! If this final core breaches, Vice City's entire treasury will be wiped out!
              </p>
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
                  <span className="gba-mood-chip urgent">MAXIMUM CRISIS</span>
                </div>
                <div className="gba-text-content">
                  <p className="gba-typewriter-text">
                    "OFFICER! HE PENETRATED THE OMEGA QUANTUM CORE! 45 ultra-cryptographic lock tumblers must now be calibrated simultaneously in under 10 minutes! His drill is operating at 240% overdrive! STAND FIRM AND ENGAGE THE OMEGA CIPHER!"
                  </p>
                </div>
                <div className="gba-prompt-arrow blink">▼</div>
              </div>
            </div>

            <div className="action-row center-actions">
              <button
                type="button"
                className="vice-btn primary-btn large-cta"
                onClick={() => handleStartActiveDefense(4)}
              >
                ENGAGE LEVEL 4 OMEGA CIPHER ➔
              </button>
            </div>
          </div>
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

            {!isEjected && (
              <div className="solo-dev-unfreeze">
                <button
                  type="button"
                  className="dev-override-btn"
                  onClick={() => {
                    setIsLockedBreach(false);
                    localStorage.removeItem("vch_locked_breach");
                    localStorage.removeItem("vch_breach_reason");
                    setScreen("lobby");
                    exitFullscreenSafe();
                  }}
                >
                  [OVERRIDE: RETURN TO LOBBY]
                </button>
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
