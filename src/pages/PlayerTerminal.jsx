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

/* ─── Session Randomizer Pools & Helper ─── */
let lastSessionCache = null;

function pickNonRepeating(pool, prevItem, keyFn = (x) => x) {
  if (!pool || pool.length === 0) return null;
  if (pool.length === 1) return pool[0];
  const prevKey = prevItem != null ? keyFn(prevItem) : null;
  const filtered = prevKey != null ? pool.filter((item) => keyFn(item) !== prevKey) : pool;
  const candidates = filtered.length > 0 ? filtered : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

const MULT_PAIRS = [
  [6, 7], [7, 6], [7, 8], [8, 7], [6, 9], [9, 6],
  [8, 9], [9, 8], [7, 7], [8, 8], [9, 9], [6, 8],
  [8, 6], [7, 9], [9, 7], [12, 3], [11, 4], [12, 4],
  [11, 5], [12, 5], [11, 6], [7, 5], [8, 5], [9, 5], [6, 6],
];

const BINARY_OPTIONS = [
  { dec: 5, bin: "101" },
  { dec: 6, bin: "110" },
  { dec: 7, bin: "111" },
  { dec: 9, bin: "1001" },
  { dec: 10, bin: "1010" },
  { dec: 11, bin: "1011" },
  { dec: 12, bin: "1100" },
  { dec: 13, bin: "1101" },
  { dec: 14, bin: "1110" },
  { dec: 15, bin: "1111" },
];

const ROMAN_OPTIONS = [
  { num: 4, roman: "IV" },
  { num: 9, roman: "IX" },
  { num: 14, roman: "XIV" },
  { num: 19, roman: "XIX" },
  { num: 24, roman: "XXIV" },
  { num: 29, roman: "XXIX" },
  { num: 34, roman: "XXXIV" },
  { num: 39, roman: "XXXIX" },
  { num: 44, roman: "XLIV" },
  { num: 49, roman: "XLIX" },
  { num: 64, roman: "LXIV" },
  { num: 74, roman: "LXXIV" },
  { num: 89, roman: "LXXXIX" },
  { num: 94, roman: "XCIV" },
];

const ELEMENT_OPTIONS = [
  { sym: "Au", name: "Gold (Atomic #79)" },
  { sym: "Ag", name: "Silver (Atomic #47)" },
  { sym: "Fe", name: "Iron (Atomic #26)" },
  { sym: "Cu", name: "Copper (Atomic #29)" },
  { sym: "Pt", name: "Platinum (Atomic #78)" },
  { sym: "Ti", name: "Titanium (Atomic #22)" },
  { sym: "Pb", name: "Lead (Atomic #82)" },
  { sym: "Hg", name: "Mercury (Atomic #80)" },
  { sym: "Zn", name: "Zinc (Atomic #30)" },
  { sym: "Ni", name: "Nickel (Atomic #28)" },
  { sym: "Kr", name: "Krypton (Atomic #36)" },
  { sym: "Xe", name: "Xenon (Atomic #54)" },
  { sym: "Ne", name: "Neon (Atomic #10)" },
  { sym: "He", name: "Helium (Atomic #2)" },
  { sym: "Na", name: "Sodium (Atomic #11)" },
  { sym: "Co", name: "Cobalt (Atomic #27)" },
];

const LANDMARK_OPTIONS = [
  { prompt: "coastal oceanfront getaway boulevard", code: "OCEAN", label: "Boulevard" },
  { prompt: "island district of Tommy's luxurious mansion", code: "STARFISH", label: "Mansion Island" },
  { prompt: "golf club island estate connected by bridges", code: "LEAF", label: "Golf Estate" },
  { prompt: "abandoned movie studio island district", code: "PRAWN", label: "Studio Island" },
  { prompt: "north beach commercial district and mall", code: "VICE POINT", label: "District" },
];

const HOTSPOT_OPTIONS = [
  { prompt: "legendary beachfront neon nightclub hotspot", word: "MALIBU", label: "Nightclub" },
  { prompt: "premier automobile dealership showroom", word: "SUNSHINE", label: "Dealership" },
  { prompt: "waterfront yacht marina harbor club", word: "MARINA", label: "Marina" },
  { prompt: "downtown rock 'n' roll radio studio", word: "VROCK", label: "Music Studio" },
];

const WEB_ACRONYM_OPTIONS = [
  { prompt: "Hypertext Markup Language", ans: "HTML", tag: "Markup" },
  { prompt: "Cascading Style Sheets", ans: "CSS", tag: "Styles" },
  { prompt: "JavaScript Object Notation", ans: "JSON", tag: "Data Format" },
  { prompt: "Hypertext Transfer Protocol", ans: "HTTP", tag: "Web Protocol" },
  { prompt: "Structured Query Language", ans: "SQL", tag: "Database" },
];

const SQL_KEYWORD_OPTIONS = [
  { action: "retrieve and read rows from a table", word: "SELECT" },
  { action: "insert new rows into a database table", word: "INSERT" },
  { action: "modify existing records in a database table", word: "UPDATE" },
  { action: "remove records from a database table", word: "DELETE" },
];

const NET_PORT_OPTIONS = [
  { proto: "DNS lookups", port: "53" },
  { proto: "unencrypted HTTP web traffic", port: "80" },
  { proto: "secure HTTPS web traffic", port: "443" },
  { proto: "secure SSH remote shell access", port: "22" },
  { proto: "FTP control connections", port: "21" },
  { proto: "SMTP email routing", port: "25" },
];

const OS_RIDDLES = [
  { text: '🧩 TECH RIDDLE: "Launched in 1991 by Linus Torvalds with Tux the Penguin as my mascot, I power the majority of cloud servers. Name my 5-letter OS kernel."', ans: "linux" },
  { text: '🧩 TECH RIDDLE: "Developed at AT&T Bell Labs in 1969 by Ken Thompson and Dennis Ritchie, my philosophical architecture pioneered pipelines and shells. Name my 4-letter OS."', ans: "unix" },
  { text: '🧩 TECH RIDDLE: "Open-source Unix-like operating system foundation based on FreeBSD and Mach microkernel powering macOS and iOS. What 6-letter name am I?"', ans: "darwin" },
];

const SCRIPT_EXTS = [
  { clue: "British comedy troupe Monty Python", ext: ".py", lang: "Python" },
  { clue: "Netscape's web language created in 10 days by Brendan Eich", ext: ".js", lang: "JavaScript" },
  { clue: "Microsoft's statically typed superset of JavaScript", ext: ".ts", lang: "TypeScript" },
  { clue: "Mozilla's memory-safe systems programming language with crab mascot", ext: ".rs", lang: "Rust" },
  { clue: "Yukihiro Matsumoto's gem-focused object-oriented scripting language", ext: ".rb", lang: "Ruby" },
];

const CIDR_OPTIONS = [
  { bits: 24, mask: "255.255.255.0", prefix: "/24" },
  { bits: 16, mask: "255.255.0.0", prefix: "/16" },
  { bits: 8, mask: "255.0.0.0", prefix: "/8" },
  { bits: 30, mask: "255.255.255.252", prefix: "/30" },
];

const CS_PIONEERS = [
  { clue: "British mathematician and father of theoretical computer science whose Bombe machine broke Enigma at Bletchley Park", code: "turing", name: "Alan Turing" },
  { clue: "Victorian mathematician who wrote the world's first algorithm for Charles Babbage's Analytical Engine", code: "lovelace", name: "Ada Lovelace" },
  { clue: "Father of Information Theory who introduced the digital bit and applied Boolean algebra to circuits", code: "shannon", name: "Claude Shannon" },
  { clue: "US Navy rear admiral who built the first compiler (A-0) and popularized the computer 'bug' term", code: "hopper", name: "Grace Hopper" },
];

const SWATCH_OPTIONS = [
  { hex: "#EFA", css: "#eeffaa", name: "Neon Lime Glow" },
  { hex: "#ACE", css: "#aaccee", name: "Vice Ice Blue" },
  { hex: "#FAB", css: "#ffaabb", name: "Flamingo Pink" },
  { hex: "#DAD", css: "#ddaadd", name: "Orchid Neon" },
  { hex: "#BEE", css: "#bbeeee", name: "Cyber Aqua" },
  { hex: "#CAB", css: "#ccaabb", name: "Sunset Mauve" },
  { hex: "#FAD", css: "#ffaadd", name: "Synth Magenta" },
];

const SPONSORS = [
  "diaz_cartel",
  "ocean_drive",
  "sunshine",
  "cuban_gang",
  "starfish",
  "avery",
  "vance_corp",
  "vercetti_crime",
];

/* ─── Dynamic Session Randomizer ─── */
function createSessionData() {
  // Generate random non-repeating 2-digit addition
  let addA, addB, addSum;
  let attempts = 0;
  do {
    addA = Math.floor(Math.random() * 35) + 14; // 14 to 48
    addB = Math.floor(Math.random() * 37) + 13; // 13 to 49
    addSum = addA + addB;
    attempts++;
  } while (lastSessionCache?.addition?.answer === addSum && attempts < 15);
  const addition = { num1: addA, num2: addB, answer: addSum };

  // Generate random non-repeating multiplication
  const multPair = pickNonRepeating(MULT_PAIRS, lastSessionCache?.multiplication?.pair, (p) => `${p[0]}x${p[1]}`);
  const multiplication = {
    a: multPair[0],
    b: multPair[1],
    product: multPair[0] * multPair[1],
    pair: `${multPair[0]}x${multPair[1]}`,
  };

  // Letters without 'M' to prevent unintended multi-M collisions with the single M rule
  const letters = "ABCDEFGHJKLNPQRSTUVWXYZ";
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    let nextChar;
    do {
      nextChar = letters[Math.floor(Math.random() * letters.length)];
    } while (nextChar === captcha[captcha.length - 1]);
    captcha += nextChar;
  }

  const session = {
    addition,
    multiplication,
    binaryTarget: pickNonRepeating(BINARY_OPTIONS, lastSessionCache?.binaryTarget, (b) => b.dec),
    romanTarget: pickNonRepeating(ROMAN_OPTIONS, lastSessionCache?.romanTarget, (r) => r.num),
    element: pickNonRepeating(ELEMENT_OPTIONS, lastSessionCache?.element, (e) => e.sym),
    landmark: pickNonRepeating(LANDMARK_OPTIONS, lastSessionCache?.landmark, (l) => l.code),
    hotspot: pickNonRepeating(HOTSPOT_OPTIONS, lastSessionCache?.hotspot, (h) => h.word),
    webAcronym: pickNonRepeating(WEB_ACRONYM_OPTIONS, lastSessionCache?.webAcronym, (w) => w.ans),
    sqlKeyword: pickNonRepeating(SQL_KEYWORD_OPTIONS, lastSessionCache?.sqlKeyword, (s) => s.word),
    netPort: pickNonRepeating(NET_PORT_OPTIONS, lastSessionCache?.netPort, (n) => n.port),
    osRiddle: pickNonRepeating(OS_RIDDLES, lastSessionCache?.osRiddle, (o) => o.ans),
    scriptExt: pickNonRepeating(SCRIPT_EXTS, lastSessionCache?.scriptExt, (s) => s.ext),
    cidrTarget: pickNonRepeating(CIDR_OPTIONS, lastSessionCache?.cidrTarget, (c) => c.prefix),
    csPioneer: pickNonRepeating(CS_PIONEERS, lastSessionCache?.csPioneer, (c) => c.code),
    swatch: pickNonRepeating(SWATCH_OPTIONS, lastSessionCache?.swatch, (s) => s.hex),
    sponsor: pickNonRepeating(SPONSORS, lastSessionCache?.sponsor),
    geo: { country: "France", capital: "paris" },
    captcha,
  };

  lastSessionCache = session;
  return session;
}

function getDigitSum(pw) {
  return (pw.match(/\d/g) || []).reduce((acc, d) => acc + Number(d), 0);
}

/* ─── Build Full 45-Rule Security Suite with Dynamic Math & Unpredictable Non-Leaking Badges ─── */
function buildAll45Rules(session, cfg) {
  return [
    /* ════ LEVEL 1: TELLERS GATE (Rules 1 - 10) ════ */
    {
      id: 1,
      text: `Master key must contain at least ${cfg.minLength} characters`,
      badge: (pw) => `${[...pw].length}/${cfg.minLength}`,
      hint: `Type at least ${cfg.minLength} characters to meet minimum cipher length.`,
      check: (pw) => [...pw].length >= cfg.minLength,
      headline: "CIPHER TOO SHORT!",
      managerSpeech: (pw, cfg) => `That's way too short, rookie! Tommy's decryption brute-forcer will crack that in two seconds! Give me at least ${cfg.minLength} characters! (Currently: ${[...pw].length}/${cfg.minLength})`,
    },
    {
      id: 2,
      text: "Uppercase clearance: Master key must contain at least TWO uppercase letters",
      badge: (pw) => `Upper: ${(pw.match(/[A-Z]/g) || []).length}/2`,
      hint: "Include at least two capital letters in the cipher.",
      check: (pw) => (pw.match(/[A-Z]/g) || []).length >= 2,
      headline: "UPPERCASE CLEARANCE!",
      managerSpeech: "We need strong encryption entropy! Include at least two capital letters in the cipher!",
    },
    {
      id: 3,
      text: `Include the sum / answer to: ${session.addition.num1} + ${session.addition.num2}`,
      badge: (pw) => (pw.includes(String(session.addition.answer)) ? `${session.addition.answer} ✓` : "Sum ?"),
      hint: `${session.addition.num1} + ${session.addition.num2} = ${session.addition.answer}. Type "${session.addition.answer}" into the cipher.`,
      check: (pw) => pw.includes(String(session.addition.answer)),
      headline: "ARITHMETIC PRESSURE!",
      managerSpeech: `Tumbler pressure calculation! What is ${session.addition.num1} plus ${session.addition.num2}? Add the numbers and enter the sum!`,
    },
    {
      id: 4,
      text: "Anti-repetition protocol: No two identical consecutive characters allowed",
      badge: (pw) => (/(.)\1/i.test(pw) ? "Duplicate Adjacent!" : "Unique Flow ✓"),
      hint: "Ensure no adjacent matching characters like '00', '11', 'aa'.",
      check: (pw) => !/(.)\1/i.test(pw),
      headline: "REPETITION VULNERABILITY!",
      managerSpeech: "Red alert! Tommy's automated cracker detects identical consecutive characters! Eliminate all doubled letters or numbers!",
    },
    {
      id: 5,
      text: 'Include the security clearance keyword: "VAULT"',
      badge: (pw) => (/vault/i.test(pw) ? "VAULT ✓" : "Keyword ?"),
      hint: 'Type the word "VAULT" into the cipher.',
      check: (pw) => /vault/i.test(pw),
      headline: "VAULT CLEARANCE KEYWORD!",
      managerSpeech: "Security protocol active! Include the keyword 'VAULT' in your master cipher!",
    },
    {
      id: 6,
      text: `Include our bank security contractor code: "${session.sponsor}"`,
      badge: (pw) => (pw.toLowerCase().includes(session.sponsor) ? "Contractor ✓" : "Contractor ?"),
      hint: `Type "${session.sponsor}" in your password.`,
      check: (pw) => pw.toLowerCase().includes(session.sponsor),
      headline: "AUTHORIZE OUR SYNDICATE!",
      managerSpeech: `Our emergency security syndicate requires contractor authorization! Type "${session.sponsor}" into the passphrase!`,
    },
    {
      id: 7,
      text: `Include the binary equivalent of decimal ${session.binaryTarget.dec}`,
      badge: (pw) => (pw.includes(session.binaryTarget.bin) ? `${session.binaryTarget.bin} ✓` : "Binary ?"),
      hint: `Decimal ${session.binaryTarget.dec} in binary is ${session.binaryTarget.bin}. Type "${session.binaryTarget.bin}".`,
      check: (pw) => pw.includes(session.binaryTarget.bin),
      headline: "BINARY REGISTER CONVERSION!",
      managerSpeech: `Digital registers operate in binary! Convert decimal ${session.binaryTarget.dec} into its binary value!`,
    },
    {
      id: 8,
      text: "Quarantine protocol: Master key must not contain any whitespace characters",
      badge: (pw) => (!/\s/.test(pw) ? "No Spaces ✓" : "Whitespace Detected!"),
      hint: "Remove all space characters.",
      check: (pw) => !/\s/.test(pw),
      headline: "REMOVE ALL WHITESPACE!",
      managerSpeech: "Spaces leak buffer memory! Strip every single space character from the password!",
    },
    {
      id: 9,
      text: `Include the Roman numeral for ${session.romanTarget.num}`,
      badge: (pw) => (pw.toUpperCase().includes(session.romanTarget.roman) ? `${session.romanTarget.roman} ✓` : "Roman ?"),
      hint: `${session.romanTarget.num} in Roman numerals is ${session.romanTarget.roman}. Type "${session.romanTarget.roman}".`,
      check: (pw) => pw.toUpperCase().includes(session.romanTarget.roman),
      headline: "ROMAN CIPHER CONVERSION!",
      managerSpeech: `Another Roman tumbler index! What is ${session.romanTarget.num} in Roman numerals? Work it out or click for intel!`,
    },
    {
      id: 10,
      text: "Signal security: Include at least one special security symbol (!@#$%^&*)",
      badge: (pw) => `Symbols: ${(pw.match(/[^a-zA-Z0-9\s]/g) || []).length}/1`,
      hint: "Include at least one special character (!@#$%^&*).",
      check: (pw) => /[^a-zA-Z0-9\s]/.test(pw),
      headline: "ENCRYPT SECURITY SIGNAL!",
      managerSpeech: "Our security transmission needs noise shielding! Inject at least one special symbol into the cipher!",
    },

    /* ════ LEVEL 2: EXECUTIVE CASH CORRIDORS (Rules 11 - 20) ════ */
    {
      id: 11,
      text: "Include standard networking local loopback hostname (IPv4 127.0.0.1)",
      badge: (pw) => (/localhost/i.test(pw) ? "localhost ✓" : "Loopback ?"),
      hint: 'Standard local loopback hostname is "localhost". Type "localhost".',
      check: (pw) => /localhost/i.test(pw),
      headline: "LOOPBACK SHIELD!",
      managerSpeech: "Route incoming packets back to local loopback! Enter the standard IPv4 loopback hostname!",
    },
    {
      id: 12,
      text: "Bandwidth ratio: Total consonants must be strictly greater than total vowels",
      badge: (pw) => `C:${(pw.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length} > V:${(pw.match(/[aeiou]/gi) || []).length}`,
      hint: "Add more consonants so consonant count exceeds vowel count.",
      check: (pw) => (pw.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length > (pw.match(/[aeiou]/gi) || []).length,
      headline: "CONSONANT BALANCE!",
      managerSpeech: "Acoustic sensor imbalance! We need more hard consonants than vowels in that key!",
    },
    {
      id: 13,
      text: `Include the product / answer to: ${session.multiplication.a} × ${session.multiplication.b}`,
      badge: (pw) => (pw.includes(String(session.multiplication.product)) ? `${session.multiplication.product} ✓` : "Product ?"),
      hint: `${session.multiplication.a} × ${session.multiplication.b} = ${session.multiplication.product}. Type "${session.multiplication.product}" into the cipher.`,
      check: (pw) => pw.includes(String(session.multiplication.product)),
      headline: "BASIC MULTIPLICATION!",
      managerSpeech: `Tumbler verification! What is ${session.multiplication.a} multiplied by ${session.multiplication.b}? Calculate and enter the product!`,
    },
    {
      id: 14,
      text: `Vice City Cartography: Include the name of our ${session.landmark.prompt}`,
      badge: (pw) => (new RegExp(session.landmark.code, "i").test(pw) ? `${session.landmark.code} ✓` : `${session.landmark.label} ?`),
      hint: `The landmark name is "${session.landmark.code}". Type "${session.landmark.code}".`,
      check: (pw) => new RegExp(session.landmark.code, "i").test(pw),
      headline: "VICE CITY LANDMARK!",
      managerSpeech: `Check the Vice City street map! What is our ${session.landmark.prompt}? Enter the name!`,
    },
    {
      id: 15,
      text: `Include the standard acronym for ${session.webAcronym.prompt}`,
      badge: (pw) => (new RegExp(session.webAcronym.ans, "i").test(pw) ? `${session.webAcronym.ans} ✓` : `${session.webAcronym.tag} ?`),
      hint: `${session.webAcronym.prompt} abbreviation is "${session.webAcronym.ans}". Type "${session.webAcronym.ans}".`,
      check: (pw) => new RegExp(session.webAcronym.ans, "i").test(pw),
      headline: "WEB STANDARDS CLEARANCE!",
      managerSpeech: `Web foundation standard! What is the acronym for ${session.webAcronym.prompt}?`,
    },
    {
      id: 16,
      text: "Parameter encapsulation: Enclose any token inside square brackets: [ ... ]",
      badge: (pw) => (/\[[a-zA-Z0-9_\-!]+\]/.test(pw) ? "[OK] ✓" : "[ ... ] ?"),
      hint: 'Wrap any word or token in square brackets, e.g., "[101]" or "[HTML]".',
      check: (pw) => /\[[a-zA-Z0-9_\-!]+\]/.test(pw),
      headline: "ENCAPSULATE PARAMETERS!",
      managerSpeech: "Security parameters must be bounded! Wrap any token inside square brackets like '[101]'!",
    },
    {
      id: 17,
      text: `Include the primary SQL keyword used to ${session.sqlKeyword.action}`,
      badge: (pw) => (new RegExp(session.sqlKeyword.word, "i").test(pw) ? `${session.sqlKeyword.word} ✓` : "SQL Keyword ?"),
      hint: `The SQL keyword to ${session.sqlKeyword.action} is "${session.sqlKeyword.word}". Type "${session.sqlKeyword.word}".`,
      check: (pw) => new RegExp(session.sqlKeyword.word, "i").test(pw),
      headline: "DATABASE QUERY CLEARANCE!",
      managerSpeech: `Query the financial database! What is the primary SQL command used to ${session.sqlKeyword.action}?`,
    },
    {
      id: 18,
      text: `Tumbler arithmetic: Numeric digits must mathematically sum up to at least ${cfg.digitSumTarget}`,
      badge: (pw) => `Sum: ${getDigitSum(pw)}/${cfg.digitSumTarget}`,
      hint: (pw) => `Current digit sum is ${getDigitSum(pw)}. Must be at least ${cfg.digitSumTarget}.`,
      check: (pw) => getDigitSum(pw) >= cfg.digitSumTarget,
      headline: "ARITHMETIC PRESSURE!",
      managerSpeech: (pw, cfg) => `The mechanical tumbler requires numerical pressure! The numbers in your password must sum up to at least ${cfg.digitSumTarget}! Current sum: ${getDigitSum(pw)}!`,
    },
    {
      id: 19,
      text: `Vice City Dossier: Include the name of our ${session.hotspot.prompt}`,
      badge: (pw) => (new RegExp(session.hotspot.word, "i").test(pw) ? `${session.hotspot.word} ✓` : `${session.hotspot.label} ?`),
      hint: `The hotspot name is "${session.hotspot.word}". Type "${session.hotspot.word}".`,
      check: (pw) => new RegExp(session.hotspot.word, "i").test(pw),
      headline: "VICE CITY DOSSIER!",
      managerSpeech: `Vice City intelligence file! What is our ${session.hotspot.prompt}? Enter the name!`,
    },
    {
      id: 20,
      text: `Include the default network port number for ${session.netPort.proto}`,
      badge: (pw) => (pw.includes(session.netPort.port) ? `${session.netPort.port} ✓` : "Port ?"),
      hint: `Default port for ${session.netPort.proto} is ${session.netPort.port}. Type "${session.netPort.port}".`,
      check: (pw) => pw.includes(session.netPort.port),
      headline: "NETWORK PROTOCOL PORT!",
      managerSpeech: `Network communications protocol! What is the numerical port for ${session.netPort.proto}?`,
    },

    /* ════ LEVEL 3: TITANIUM DEEP VAULT (Rules 21 - 32) ════ */
    {
      id: 21,
      isRiddle: true,
      text: session.osRiddle.text,
      badge: (pw) => (new RegExp(session.osRiddle.ans, "i").test(pw) ? `${session.osRiddle.ans} ✓` : "Kernel ?"),
      hint: `OS kernel name: "${session.osRiddle.ans}".`,
      check: (pw) => new RegExp(session.osRiddle.ans, "i").test(pw),
      headline: "OS KERNEL RIDDLE!",
      managerSpeech: "Operating systems foundation! What operating system kernel matches that description? Think, assistant!",
    },
    {
      id: 22,
      text: "Thermal drill overheating! Inject the universal chemical formula for water coolant",
      badge: (pw) => (pw.includes("H2O") ? "H2O ✓" : "Coolant ?"),
      hint: 'Water chemical formula is H2O. Type "H2O".',
      check: (pw) => pw.includes("H2O"),
      headline: "INJECT COOLANT!",
      managerSpeech: "The vault door hinges are glowing red! Inject the universal water coolant formula right now!",
    },
    {
      id: 23,
      isRiddle: true,
      text: `🧩 TECH RIDDLE: "Named after ${session.scriptExt.clue}, what is the dot file extension for scripts written in this language?"`,
      badge: (pw) => (pw.toLowerCase().includes(session.scriptExt.ext) ? `${session.scriptExt.ext} ✓` : "Extension ?"),
      hint: `File extension for ${session.scriptExt.lang} is "${session.scriptExt.ext}".`,
      check: (pw) => pw.toLowerCase().includes(session.scriptExt.ext),
      headline: "SCRIPT EXTENSION RIDDLE!",
      managerSpeech: `Language file specification! What is the dot file extension for ${session.scriptExt.lang} scripts?`,
    },
    {
      id: 24,
      text: `Authorize with 5-letter biometric captcha: [${session.captcha}]`,
      isCaptcha: true,
      badge: (pw) => (pw.includes(session.captcha) ? "Captcha ✓" : "Captcha ?"),
      hint: `Enter "${session.captcha}" in exact uppercase.`,
      check: (pw) => pw.includes(session.captcha),
      headline: "BIOMETRIC RETINAL SCAN!",
      managerSpeech: `Retinal verification required! The terminal monitor displays "${session.captcha}"! Type it in exact uppercase!`,
    },
    {
      id: 25,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "In dining philosophers and multi-threading, I am the fatal condition where two threads wait on each other\'s locks indefinitely. Name this 8-letter state."',
      badge: (pw) => (/deadlock/i.test(pw) ? "deadlock ✓" : "Concurrency ?"),
      hint: 'Mutual process blocking: "deadlock".',
      check: (pw) => /deadlock/i.test(pw),
      headline: "CONCURRENCY DEADLOCK RIDDLE!",
      managerSpeech: "Two threads waiting forever! That fatal concurrency freeze state! What is it called?",
    },
    {
      id: 26,
      text: "VCPD Radio Protocol: Include standard police 10-code for 'Affirmative / Received' (10-4) or 'Location' (10-20)",
      badge: (pw) => (/10-4|10-20/.test(pw) ? "Radio ✓" : "10-Code ?"),
      hint: 'Include "10-4" or "10-20".',
      check: (pw) => /10-4|10-20/.test(pw),
      headline: "POLICE RADIO DISPATCH!",
      managerSpeech: "VCPD cruisers are speeding down the causeway! Acknowledge dispatch with standard police 10-code for affirmative or location!",
    },
    {
      id: 27,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "In C and Java, I am the return type keyword specifying that a function performs work without returning any value. What 4-letter keyword am I?"',
      badge: (pw) => (/void/i.test(pw) ? "void ✓" : "Return Type ?"),
      hint: 'Empty return type keyword: "void".',
      check: (pw) => /void/i.test(pw),
      headline: "VOID RETURN TYPE RIDDLE!",
      managerSpeech: "A function that yields nothing! In C and Java, what is that empty return type keyword?",
    },
    {
      id: 28,
      text: `Deep Vault Bullion: Include the chemical element symbol for ${session.element.name}`,
      badge: (pw) => (pw.includes(session.element.sym) ? `${session.element.sym} ✓` : "Symbol ?"),
      hint: `Chemical symbol for ${session.element.name} is "${session.element.sym}".`,
      check: (pw) => pw.includes(session.element.sym),
      headline: "BULLION ELEMENT SPEC!",
      managerSpeech: `Our deep deposit holds ${session.element.name}! Punch in its atomic chemical symbol from the periodic table!`,
    },
    {
      id: 29,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "Known as the silicon \'Brain of the Computer\' housing the Arithmetic Logic Unit and control circuits. What 3-letter acronym am I?"',
      badge: (pw) => (/CPU/.test(pw) ? "CPU ✓" : "Hardware ?"),
      hint: 'Central Processing Unit: "CPU".',
      check: (pw) => /CPU/.test(pw),
      headline: "HARDWARE PROCESSOR RIDDLE!",
      managerSpeech: "The silicon brain! What is the 3-letter hardware processor acronym?",
    },
    {
      id: 30,
      text: "Scoped code block: Enclose any token inside curly brackets: { ... }",
      badge: (pw) => (/\{[^{}]+\}/.test(pw) ? "{OK} ✓" : "{ ... } ?"),
      hint: 'Wrap any character or token in curly braces, e.g., "{H2O}" or "{7}".',
      check: (pw) => /\{[^{}]+\}/.test(pw),
      headline: "ENCLOSE FUNCTION SCOPE!",
      managerSpeech: "Scope the security routine! Wrap any token inside curly braces like '{H2O}'!",
    },
    {
      id: 31,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "In OOP design patterns, I ensure that a class has only ONE solitary instance throughout the program execution. What 9-letter pattern am I?"',
      badge: (pw) => (/singleton/i.test(pw) ? "singleton ✓" : "Pattern ?"),
      hint: 'One-instance design pattern: "singleton".',
      check: (pw) => /singleton/i.test(pw),
      headline: "DESIGN PATTERN RIDDLE!",
      managerSpeech: "Only one single instance allowed! What GoF design pattern is that?",
    },
    {
      id: 32,
      text: "Tommy's getaway vehicle: Include legendary Vice City supercar model (INFERNUS, CHEETAH, or COMET)",
      badge: (pw) => (/infernus|cheetah|comet/i.test(pw) ? "Supercar ✓" : "Vehicle ?"),
      hint: 'Include "INFERNUS", "CHEETAH", or "COMET" (case-insensitive).',
      check: (pw) => /infernus|cheetah|comet/i.test(pw),
      headline: "GETAWAY SUPERCAR DETECTED!",
      managerSpeech: "Tommy's getaway driver is revving outside! Intercept their vehicle model: 'INFERNUS', 'CHEETAH', or 'COMET'!",
    },

    /* ════ LEVEL 4: OMEGA QUANTUM CORE (Rules 33 - 45) ════ */
    {
      id: 33,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "I am the universal boolean logic gate that outputs 0 ONLY when both inputs are 1. Any digital gate can be forged from me. What 4-letter gate am I?"',
      badge: (pw) => (/NAND/.test(pw) ? "NAND ✓" : "Logic Gate ?"),
      hint: 'Universal logic gate: "NAND".',
      check: (pw) => /NAND/.test(pw),
      headline: "UNIVERSAL GATE RIDDLE!",
      managerSpeech: "The universal circuit gate! What gate produces 0 only on two 1s?",
    },
    {
      id: 34,
      text: "Master key parity: Total character count must be an EVEN number",
      badge: (pw) => `Len: ${[...pw].length} (${[...pw].length % 2 === 0 ? "EVEN ✓" : "ODD"})`,
      hint: "Add or remove one character so the length is an even number.",
      check: (pw) => [...pw].length > 0 && [...pw].length % 2 === 0,
      headline: "EVEN PARITY BALANCE!",
      managerSpeech: "Parity mismatch! The total character count across the whole key must be an EVEN number!",
    },
    {
      id: 35,
      isRiddle: true,
      text: `🧩 TECH RIDDLE: "In standard IPv4 subnetting with subnet mask ${session.cidrTarget.mask}, what is the slash-prefix notation for these ${session.cidrTarget.bits} network bits?"`,
      badge: (pw) => (pw.includes(session.cidrTarget.prefix) ? `${session.cidrTarget.prefix} ✓` : "CIDR ?"),
      hint: `Subnet mask ${session.cidrTarget.mask} uses prefix "${session.cidrTarget.prefix}". Type "${session.cidrTarget.prefix}".`,
      check: (pw) => pw.includes(session.cidrTarget.prefix),
      headline: "CIDR SUBNET RIDDLE!",
      managerSpeech: `Network bits calculation! For subnet mask ${session.cidrTarget.mask}, what is the slash prefix notation?`,
    },
    {
      id: 36,
      text: "Perimeter bookend: First and last characters of the master key must be IDENTICAL",
      badge: (pw) => {
        const c = [...pw];
        return c.length >= 2 && c[0] === c[c.length - 1] ? `${c[0]} … ${c[0]} ✓` : "Match Ends ?";
      },
      hint: "Make the very first character and last character the same exact character.",
      check: (pw) => {
        const c = [...pw];
        return c.length >= 2 && c[0] === c[c.length - 1];
      },
      headline: "MIRROR THE PERIMETER!",
      managerSpeech: "Symmetry protocol active! The very first character and very last character must be identical!",
    },
    {
      id: 37,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "Designed by the NSA, I am the 256-bit cryptographic hash function securing Bitcoin and TLS handshakes. What 6-character name am I?"',
      badge: (pw) => (/SHA256/i.test(pw) ? "SHA256 ✓" : "Hash ?"),
      hint: 'Cryptographic hash standard: "SHA256".',
      check: (pw) => /SHA256/i.test(pw),
      headline: "CRYPTOGRAPHIC DIGEST RIDDLE!",
      managerSpeech: "The NSA's 256-bit cryptographic digest! What secures the blockchain?",
    },
    {
      id: 38,
      text: "Prime security factor: Include at least one 2-digit prime number (greater than 10, divisible only by 1 and itself)",
      badge: (pw) => (/13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(pw) ? "Prime ✓" : "2-Digit Prime ?"),
      hint: "2-digit prime numbers include: 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.",
      check: (pw) => /13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(pw),
      headline: "PRIME NUMBER ENCRYPTION!",
      managerSpeech: "RSA cryptographic circuit requires primes! Include a 2-digit prime number!",
    },
    {
      id: 39,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "Algorithmic Complexity: In Big-O asymptotic notation, what is the quadratic worst-case runtime complexity of standard unbalanced Quicksort?"',
      badge: (pw) => (/O\(n\^?2\)/i.test(pw) ? "O(n²) ✓" : "Big-O ?"),
      hint: 'Quicksort worst-case occurs on sorted arrays: quadratic "O(n2)" or "O(n^2)".',
      check: (pw) => /O\(n\^?2\)/i.test(pw),
      headline: "ASYMPTOTIC COMPLEXITY RIDDLE!",
      managerSpeech: "Quicksort worst-case pivot breakdown! What is the quadratic asymptotic upper bound in Big-O?",
    },
    {
      id: 40,
      text: "Include 3-character uppercase hex code for vault color swatch",
      isSwatch: true,
      swatchColor: session.swatch.css,
      badge: (pw) => (pw.includes(session.swatch.hex) ? `${session.swatch.hex} ✓` : "Hex Code ?"),
      hint: `Color swatch hex code is "${session.swatch.hex}".`,
      check: (pw) => pw.includes(session.swatch.hex),
      headline: "OPTICAL SWATCH CALIBRATION!",
      managerSpeech: "Calibrate the laser sensors! Type the 3-character hex code for our color swatch!",
    },
    {
      id: 41,
      isRiddle: true,
      text: '🧩 TECH RIDDLE: "Deadlock Avoidance: What 6-letter algorithm name, formulated by Edsger Dijkstra, tests resource allocation safety before granting claims to avoid deadlocks?"',
      badge: (pw) => (/banker/i.test(pw) ? "banker ✓" : "Algorithm ?"),
      hint: 'Dijkstra\'s deadlock avoidance algorithm: "banker".',
      check: (pw) => /banker/i.test(pw),
      headline: "DEADLOCK AVOIDANCE RIDDLE!",
      managerSpeech: "Operating systems resource matrix! What algorithm formulated by Dijkstra tests safe states to prevent deadlock?",
    },
    {
      id: 42,
      text: "Grandmaster chess notation: Include checkmate symbol (#) delivered by Queen (Q) or Knight (N)",
      badge: (pw) => (pw.includes("Q#") || pw.includes("N#") ? "Checkmate ✓" : "Chess Mate ?"),
      hint: 'Type "Q#" for Queen checkmate or "N#" for Knight checkmate.',
      check: (pw) => pw.includes("Q#") || pw.includes("N#"),
      headline: "GRANDMASTER CHECKMATE!",
      managerSpeech: "Final tactical moves! Deliver checkmate to Tommy's syndicates with Queen or Knight mate notation!",
    },
    {
      id: 43,
      isRiddle: true,
      text: `🧩 TECH RIDDLE: "${session.csPioneer.clue}. What is their last name?"`,
      badge: (pw) => (new RegExp(session.csPioneer.code, "i").test(pw) ? `${session.csPioneer.code} ✓` : "Pioneer ?"),
      hint: `Computer pioneer last name: "${session.csPioneer.code}".`,
      check: (pw) => new RegExp(session.csPioneer.code, "i").test(pw),
      headline: "FATHER OF COMPUTING RIDDLE!",
      managerSpeech: `Computer pioneer identification! What is the last name of ${session.csPioneer.name}?`,
    },
    {
      id: 44,
      text: 'Synthwave acoustic frequency: Include an 80s sharp key synth note (A#, C#, D#, F#, or G#)',
      badge: (pw) => (/A#|C#|D#|F#|G#/.test(pw) ? "Synth Note ✓" : "Sharp Note ?"),
      hint: 'Include "A#", "C#", "D#", "F#", or "G#".',
      check: (pw) => /A#|C#|D#|F#|G#/.test(pw),
      headline: "SYNTHWAVE HARMONICS!",
      managerSpeech: "Tune the acoustic harmonic scanner! Play an 80s sharp synth chord note: 'A#', 'C#', 'D#', 'F#', or 'G#'!",
    },
    {
      id: 45,
      text: 'The Master Lockdown Seal: Include emergency vault command directive: "VAULT_LOCKED"',
      badge: (pw) => (/VAULT_LOCKED/i.test(pw) ? "LOCKED ✓" : "Master Seal ?"),
      hint: 'Type "VAULT_LOCKED" to complete the final quantum lock.',
      check: (pw) => /VAULT_LOCKED/i.test(pw),
      headline: "FINAL QUANTUM SEAL!",
      managerSpeech: "THIS IS IT, ROOKIE! FINAL LAYER! TYPE 'VAULT_LOCKED' AND HIT ENTER TO TRAP TOMMY FOREVER!",
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

  const handleResetToNameInput = useCallback(() => {
    clearInterval(timerRef.current);
    setIsLockedBreach(false);
    setIsEjected(false);
    setIsPlayerFrozen(false);
    setIsRegistered(false);
    setBreachReason("");
    setPlayerName("");
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
    localStorage.removeItem("vch_player_name");
    localStorage.removeItem("vch_player_alias");
    localStorage.removeItem("vch_player_college");
    try {
      localStorage.removeItem("vch_player_state_" + playerId);
      localStorage.removeItem("vch_player_data_" + playerId);
    } catch (_) {}
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

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPassword, setShowPassword] = useState(true);

  /* Video & Manager Avatar Assets */
  const [managerImgSrc] = useState(() => getAssetUrl("/images/manager.png"));
  const videoRef = useRef(null);

  /* ── Lobby Asset & Video Preloading (Eliminates cutscene & game loading lag) ── */
  useEffect(() => {
    if (screen === "lobby") {
      // 1. Preload video in background
      try {
        const preVideo = document.createElement("video");
        preVideo.src = getAssetUrl("/video/heist_intro.mp4");
        preVideo.preload = "auto";
        preVideo.muted = true;
        preVideo.playsInline = true;
        preVideo.load();
      } catch (_) {}

      // 2. Preload all background textures & UI graphics
      const assetsToPreload = [
        "/images/vault_neon_bg.jpg",
        "/images/vault_door.jpg",
        "/images/vault_lockers.jpg",
        "/images/manager.png",
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
      isEjected: overrides.isEjected !== undefined ? overrides.isEjected : isEjected,
      breachReason: overrides.breachReason !== undefined ? overrides.breachReason : breachReason,
      levelTimes: overrides.levelTimes || levelTimes,
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
      } else if (type === "reset_to_name_input") {
        if (!pid || pid === playerId || (evt.data?.target === "ejected" && (isEjected || localStorage.getItem("vch_ejected") === "true"))) {
          handleResetToNameInput();
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
  }, [playerId, handleEjected, handleResetToNameInput, screen, launchStoryMode, cfg.startSeconds, advanceFloorByAdmin, isEjected]);

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
              } else if (cmd.action === "RESET_TO_NAME_INPUT") {
                if (!cmd.playerId || cmd.playerId === playerId || (cmd.target === "ejected" && (isEjected || localStorage.getItem("vch_ejected") === "true"))) {
                  handleResetToNameInput();
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
            } else if (cmd.action === "RESET_TO_NAME_INPUT") {
              if (!cmd.playerId || cmd.playerId === playerId || (cmd.target === "ejected" && (isEjected || localStorage.getItem("vch_ejected") === "true"))) {
                handleResetToNameInput();
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
  }, [screen, launchStoryMode, playerId, cfg.startSeconds, handleEjected, handleResetToNameInput, advanceFloorByAdmin, isEjected]);

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
      if (document.hidden && screen === "game") {
        clearInterval(timerRef.current);
        const reason = "UNAUTHORIZED TAB SWITCH / MINIMIZE DETECTED (Eliminated)";
        setIsLockedBreach(true);
        setIsEjected(true);
        setBreachReason(reason);
        localStorage.setItem("vch_locked_breach", "true");
        localStorage.setItem("vch_ejected", "true");
        localStorage.setItem("vch_breach_reason", reason);
        setScreen("mission_failed");
        exitFullscreenSafe();
        SoundEngine.init();
        SoundEngine.playMissionFailed();
        reportViolation("TAB_SWITCH", reason, true);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && screen === "game") {
        clearInterval(timerRef.current);
        const reason = "FULLSCREEN DEPARTURE DETECTED (Eliminated)";
        setIsLockedBreach(true);
        setIsEjected(true);
        setBreachReason(reason);
        localStorage.setItem("vch_locked_breach", "true");
        localStorage.setItem("vch_ejected", "true");
        localStorage.setItem("vch_breach_reason", reason);
        setScreen("mission_failed");
        exitFullscreenSafe();
        SoundEngine.init();
        SoundEngine.playMissionFailed();
        reportViolation("FULLSCREEN_ESCAPE", reason, true);
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [screen, isLockedBreach, reportViolation]);

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

      const updatedLevelScores = { ...levelScores, [currentLevel]: levelScore };
      const updatedLevelTimes = { ...levelTimes, [currentLevel]: survivedSecondsRef.current };
      setLevelScores(updatedLevelScores);
      setLevelTimes(updatedLevelTimes);
      try {
        localStorage.setItem("vch_level_times", JSON.stringify(updatedLevelTimes));
      } catch (_) {}

      // Story Intermission Transitions
      if (currentLevel === 1) {
        setScreen("story_intermission_1");
        reportToAdmin({ status: "CLEARED_LEVEL_1", currentLevel: 2, levelTimes: updatedLevelTimes });
      } else if (currentLevel === 2) {
        setScreen("story_intermission_2");
        reportToAdmin({ status: "CLEARED_LEVEL_2", currentLevel: 3, levelTimes: updatedLevelTimes });
      } else if (currentLevel === 3) {
        setScreen("story_intermission_3");
        reportToAdmin({ status: "CLEARED_LEVEL_3", currentLevel: 4, levelTimes: updatedLevelTimes });
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
        };
        setCompletionData(compRecord);
        try {
          localStorage.setItem("vch_completion_data", JSON.stringify(compRecord));
        } catch (_) {}

        reportToAdmin({
          status: "GRAND_VICTORY",
          isGrandWinner: true,
          ...compRecord,
        });
      }
    },
    [cfg, currentLevel, soundEnabled, reportToAdmin, levelScores, levelTimes]
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
  const handleCutsceneDone = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    if (soundEnabled) SoundEngine.playClick();
    setScreen("briefing");
    reportToAdmin({ status: "BRIEFING" });
  }, [soundEnabled, reportToAdmin]);

  /* ── Cutscene Keydown & Fullscreen Handler ── */
  useEffect(() => {
    if (screen !== "cutscene") return;

    requestFullscreenSafe();

    const handleCutsceneKeyDown = () => {
      handleCutsceneDone();
    };

    window.addEventListener("keydown", handleCutsceneKeyDown);
    return () => {
      window.removeEventListener("keydown", handleCutsceneKeyDown);
    };
  }, [screen, handleCutsceneDone]);

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
    () => getManagerDirective(activeFailing, password, sessionData, cfg),
    [activeFailing, password, sessionData, cfg]
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
          {/* Preload cutscene video silently in the lobby DOM to eliminate any transition buffering */}
          <video
            preload="auto"
            muted
            playsInline
            src={getAssetUrl("/video/heist_intro.mp4")}
            style={{ display: "none", position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
            aria-hidden="true"
          />

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
        <section 
          className="cutscene-fullscreen-stage" 
          onClick={handleCutsceneDone}
          tabIndex={0}
          role="button"
          aria-label="Click anywhere or press any key to skip cutscene"
        >
          <div className="video-player-frame">
            <video
              ref={videoRef}
              src={getAssetUrl("/video/heist_intro.mp4")}
              autoPlay
              playsInline
              onEnded={handleCutsceneDone}
              className="heist-cutscene-video"
            />
            <div className="cutscene-hud-overlay">
              <div className="cutscene-hud-pulse">
                <span className="cutscene-hud-icon">▶▶</span>
                <span className="cutscene-hud-text">PRESS ANY KEY OR CLICK ANYWHERE TO SKIP INTRO</span>
              </div>
              <div className="cutscene-hud-sub">TRANSMISSION // LIVE INFILTRATION — DAEMON '26</div>
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
                        className={`neon-rule-row ${passed ? "rule-passed" : "rule-failing"} ${isFailingCurrent ? "rule-current-failing" : ""} ${rule.isRiddle ? "rule-is-riddle" : ""}`}
                        onClick={() => {
                          if (!revealedHints.has(rule.id)) {
                            setRevealedHints((prev) => new Set([...prev, rule.id]));
                            triggerTimeBonus(-15);
                            if (soundEnabled) SoundEngine.playHintUsed();
                          }
                        }}
                        title={isHinted ? "Intel already revealed" : "Click to reveal Manager Intel (-15s penalty)"}
                      >
                        <div className="neon-rule-content">
                          <span className="neon-bullet">{passed ? "✓" : (rule.isRiddle ? "🧩" : "•")}</span>
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

            {!isEjected ? (
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
            ) : (
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
