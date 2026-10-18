/**
 * Vice City Heist: Bank Manager Vault Defense
 * Core Game Rules, Dynamic Cipher Pools, and Level Configurations
 */

/* ─── 4-Level Progressive Campaign Configurations ───
   Timer schedule specified by Director:
   - Level 1: 10 minutes (600s)
   - Level 2: 9 minutes (540s)
   - Level 3: 8 minutes (480s)
   - Level 4: 7 minutes (420s)
*/
export const CAMPAIGN_LEVELS = {
  1: {
    levelNumber: 1,
    title: "LEVEL 1 // OUTER LOBBY & TELLERS GATE",
    shortName: "Level 1: Tellers Gate",
    subtitle: "Floor 01 · Teller Security Perimeter",
    rules: 10,
    startSeconds: 600, // 10:00 minutes
    drillSpeedMultiplier: 1.0,
    wantedStars: 2,
    bonusSeconds: 0,
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
    startSeconds: 540, // 9:00 minutes
    drillSpeedMultiplier: 1.4,
    wantedStars: 3,
    bonusSeconds: 0,
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
    startSeconds: 480, // 8:00 minutes
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
    startSeconds: 420, // 7:00 minutes (Supreme Overdrive)
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

/* ─── Code Snippets Fill-In-The-Blank Pool ─── */
export const CODE_SNIPPET_PUZZLES = [
  {
    id: "printf_c",
    lang: "C Language",
    title: "Console Output Function",
    snippet: '_____("Access Granted to Vault\\n");',
    blank: "printf",
    hint: 'Fill in the blank: C console output function: printf("...") (type directly, no quotes)',
    prompt: 'Fill in the missing C output function: _____("Access Granted to Vault\\n");',
    managerSpeech: 'Code diagnostic! Fill in the missing C console output function: _____("Access Granted")! Enter printf!'
  },
  {
    id: "def_python",
    lang: "Python",
    title: "Function Declaration",
    snippet: '_____ unlock_vault(code):\n    return True',
    blank: "def",
    hint: 'Fill in the blank: Python keyword used to define a function: def (type directly, no quotes)',
    prompt: 'Fill in the missing Python keyword: _____ unlock_vault(code):',
    managerSpeech: 'Python script syntax check! What 3-letter keyword defines a function in Python? Enter def!'
  },
  {
    id: "console_js",
    lang: "JavaScript",
    title: "Console Debug Object",
    snippet: '_____.log("Vault Lockdown Active");',
    blank: "console",
    hint: 'Fill in the blank: JavaScript standard output object: console.log(...) (type directly, no quotes)',
    prompt: 'Fill in the missing JavaScript object: _____.log("Vault Lockdown Active");',
    managerSpeech: 'Browser devtools log check! What object precedes .log("...") in JavaScript? Enter console!'
  },
  {
    id: "return_fn",
    lang: "General Coding",
    title: "Function Output Statement",
    snippet: 'int calculate_balance() {\n    _____ 3000000;\n}',
    blank: "return",
    hint: 'Fill in the blank: Keyword used to pass back a value from a function: return (type directly, no quotes)',
    prompt: 'Fill in the missing keyword: int calculate_balance() { _____ 3000000; }',
    managerSpeech: 'Function control flow! What 6-letter keyword passes the calculated value out of a function? Enter return!'
  },
  {
    id: "for_loop",
    lang: "C / Java / JS",
    title: "Iteration Loop",
    snippet: '_____ (int i = 0; i < 10; i++) {\n    scan_vault_perimeter();\n}',
    blank: "for",
    hint: 'Fill in the blank: Standard loop keyword for counter iterations: for (type directly, no quotes)',
    prompt: 'Fill in the missing loop keyword: _____ (int i = 0; i < 10; i++) { ... }',
    managerSpeech: 'Loop iteration protocol! What 3-letter keyword executes a counted loop? Enter for!'
  },
  {
    id: "if_condition",
    lang: "C / Python / JS",
    title: "Conditional Branch",
    snippet: '_____ (threat_level > 5) {\n    trigger_alarm();\n}',
    blank: "if",
    hint: 'Fill in the blank: Fundamental conditional branching keyword: if (type directly, no quotes)',
    prompt: 'Fill in the missing conditional keyword: _____ (threat_level > 5) { trigger_alarm(); }',
    managerSpeech: 'Branching logic check! What 2-letter keyword checks a conditional branch? Enter if!'
  },
  {
    id: "while_loop",
    lang: "C / Python / JS",
    title: "Predicate Loop",
    snippet: '_____ (vault_locked == true) {\n    guard_perimeter();\n}',
    blank: "while",
    hint: 'Fill in the blank: Loop keyword that runs as long as condition remains true: while (type directly, no quotes)',
    prompt: 'Fill in the missing loop keyword: _____ (vault_locked == true) { guard_perimeter(); }',
    managerSpeech: 'Continuous guard loop! What 5-letter keyword loops while a condition holds true? Enter while!'
  },
  {
    id: "print_python",
    lang: "Python",
    title: "Screen Output",
    snippet: '_____("Vault Security 100% OK")',
    blank: "print",
    hint: 'Fill in the blank: Built-in Python function to display text on screen: print (type directly, no quotes)',
    prompt: 'Fill in the missing Python function: _____("Vault Security 100% OK")',
    managerSpeech: 'Python standard output! What 5-letter built-in function prints text in Python? Enter print!'
  },
  {
    id: "new_oop",
    lang: "Java / C++ / JS",
    title: "Object Instantiation",
    snippet: 'VaultDefense system = _____ VaultDefense();',
    blank: "new",
    hint: 'Fill in the blank: OOP keyword used to instantiate a class into memory: new (type directly, no quotes)',
    prompt: 'Fill in the missing OOP keyword: VaultDefense system = _____ VaultDefense();',
    managerSpeech: 'Object instantiation check! What 3-letter keyword allocates a new object in OOP? Enter new!'
  },
  {
    id: "static_modifier",
    lang: "Java / C#",
    title: "Class Method Modifier",
    snippet: 'public _____ void main(String[] args) { ... }',
    blank: "static",
    hint: 'Fill in the blank: Modifier indicating method belongs to class rather than instance: static (type directly, no quotes)',
    prompt: 'Fill in the missing Java/C# modifier: public _____ void main(String[] args)',
    managerSpeech: 'Java entry point check! What 6-letter keyword precedes void main in Java? Enter static!'
  }
];

/* ─── Accessible Tech & Common Knowledge Riddles Pool (No CPU duplicate) ─── */
export const TECH_COMMON_RIDDLES = [
  {
    prompt: "Where is user data from apps like Instagram and TikTok stored remotely? (5-letter word)",
    ans: "cloud",
    alt: ["cloud", "server"],
    label: "Cloud Storage",
    hint: "Think of remote distributed internet servers and offsite data storage (do NOT use quotes)."
  },
  {
    prompt: "What is Tesla's famous automated driving capability? (9-letter word)",
    ans: "autopilot",
    alt: ["autopilot", "fsd"],
    label: "Autopilot",
    hint: "Aviation and autonomous vehicle term for self-navigating driver-assistance (do NOT use quotes)."
  },
  {
    prompt: "What secure protocol shows a padlock icon in your web browser URL bar? (5-letter acronym)",
    ans: "https",
    alt: ["https", "ssl"],
    label: "HTTPS",
    hint: "Encrypted web communications secured over Transport Layer Security (do NOT use quotes)."
  },
  {
    prompt: "What global network of interconnected computers connects the whole world? (8-letter word)",
    ans: "internet",
    alt: ["internet", "web"],
    label: "Internet",
    hint: "The vast global telecommunications system of packet-switched networks (do NOT use quotes)."
  },
  {
    prompt: "What device in your home routes Wi-Fi signals to your phone and laptop? (6-letter word)",
    ans: "router",
    alt: ["router", "modem"],
    label: "Router",
    hint: "The networking appliance directing packets between local LAN and WAN (do NOT use quotes)."
  },
  {
    prompt: "What Google mobile operating system is named after Android? (7-letter word)",
    ans: "android",
    alt: ["android"],
    label: "Android",
    hint: "The open-source mobile operating system developed under the Open Handset Alliance (do NOT use quotes)."
  },
  {
    prompt: "What wireless technology connects your smartphone to earbuds or speakers? (9-letter word)",
    ans: "bluetooth",
    alt: ["bluetooth"],
    label: "Bluetooth",
    hint: "Named after tenth-century King Harald Gormsson; connects personal area devices wirelessly (do NOT use quotes)."
  },
  {
    prompt: "What 2-letter abbreviation represents Artificial Intelligence systems that generate text, images, or chat? (2 letters)",
    ans: "ai",
    alt: ["ai"],
    label: "AI",
    hint: "Two-letter acronym for machine learning and artificial neural systems: AI (do NOT use quotes)."
  },
  {
    prompt: "What 3-letter satellite navigation system pinpoints your phone's location anywhere on Earth? (3-letter acronym)",
    ans: "gps",
    alt: ["gps"],
    label: "GPS",
    hint: "Global Positioning System satellite constellation: GPS (do NOT use quotes)."
  },
  {
    prompt: "What high-definition display cable standard connects your laptop or gaming console to a TV/monitor? (4-letter acronym)",
    ans: "hdmi",
    alt: ["hdmi"],
    label: "HDMI",
    hint: "High-Definition Multimedia Interface: HDMI (do NOT use quotes)."
  },
  {
    prompt: "What fast solid-state storage drive replaced traditional spinning Hard Disk Drives in modern laptops? (3-letter acronym)",
    ans: "ssd",
    alt: ["ssd"],
    label: "SSD",
    hint: "Solid-State Drive: SSD (do NOT use quotes)."
  },
  {
    prompt: "What ubiquitous connection standard is used by Type-C phone charger cables? (3-letter acronym)",
    ans: "usb",
    alt: ["usb"],
    label: "USB",
    hint: "Universal Serial Bus: USB (do NOT use quotes)."
  },
  {
    prompt: "What standard 3-letter acronym denotes a web address typed into your browser address bar? (3 letters)",
    ans: "url",
    alt: ["url"],
    label: "URL",
    hint: "Uniform Resource Locator: URL (do NOT use quotes)."
  },
  {
    prompt: "What small text file is saved on your device by websites to remember login sessions and preferences? (6-letter word)",
    ans: "cookie",
    alt: ["cookie", "cookies"],
    label: "Cookie",
    hint: "Web browser tracking and session token file: cookie (do NOT use quotes)."
  },
  {
    prompt: "What premium display panel technology lights every organic pixel individually for true deep blacks? (4-letter acronym)",
    ans: "oled",
    alt: ["oled"],
    label: "OLED",
    hint: "Organic Light-Emitting Diode: OLED (do NOT use quotes)."
  }
];

export const BINARY_OPTIONS = [
  { dec: 5, bin: "101" },
  { dec: 7, bin: "111" },
  { dec: 9, bin: "1001" },
  { dec: 10, bin: "1010" },
  { dec: 11, bin: "1011" },
  { dec: 13, bin: "1101" },
  { dec: 18, bin: "10010" },
  { dec: 21, bin: "10101" },
  { dec: 25, bin: "11001" },
  { dec: 27, bin: "11011" },
  { dec: 37, bin: "100101" },
  { dec: 42, bin: "101010" },
  { dec: 45, bin: "101101" },
  { dec: 50, bin: "110010" },
  { dec: 53, bin: "110101" },
];

export const ROT13_OPTIONS = [
  { plain: "vault", encoded: "inhyg" },
  { plain: "cyber", encoded: "plore" },
  { plain: "heist", encoded: "urvfg" },
  { plain: "hacker", encoded: "unpxre" },
  { plain: "matrix", encoded: "zngevk" },
  { plain: "token", encoded: "gbxra" },
  { plain: "crypto", encoded: "pelcgb" },
  { plain: "shadow", encoded: "funqbj" },
  { plain: "cipher", encoded: "pvcure" },
  { plain: "beacon", encoded: "ornpba" },
];

export const CAESAR_OPTIONS = [
  { word: "VICE", shift: 3, cipher: "YLFH" },
  { word: "CODE", shift: 3, cipher: "FRGH" },
  { word: "BANK", shift: 3, cipher: "EDQN" },
  { word: "HACK", shift: 3, cipher: "KDFN" },
  { word: "BYTE", shift: 3, cipher: "EBWH" },
  { word: "SAFE", shift: 3, cipher: "VDIH" },
  { word: "GOLD", shift: 3, cipher: "JROG" },
  { word: "LOCK", shift: 3, cipher: "ORFN" },
  { word: "DATA", shift: 3, cipher: "GDWD" },
];

export const SHA_PHRASES = [
  { phrase: "vice", short: "48419615", hash: "48419615a14d59a29583be45cb9eb85b1fc59b48b9911e86095ec983226be834" },
  { phrase: "heist", short: "f4299b45", hash: "f4299b4556488ff9cfbc287f39414e861d858e7eeec6b21644e5d61aa3fcbeab" },
  { phrase: "daemon", short: "9b2c48d5", hash: "9b2c48d576a8b1c4e61d835f29e17a4b08c9d2f14e5a7b8c09d1e2f3a4b5c6d7" },
  { phrase: "vault", short: "96c096ab", hash: "96c096ab84ef3c59600e1cc38b81db82e700a42426dd6877189f76a38bc6f8e7" },
  { phrase: "crypto", short: "220c85c2", hash: "220c85c2d3ef0c79e602462e742ff15024b3fe3bf3fffc87e5b15b3e6c98616c" },
  { phrase: "matrix", short: "7217dbbe", hash: "7217dbbebc11db9d2b27aaae7c732c5780bb6daee8ee49ea45187127e2a4be60" },
  { phrase: "vercetti", short: "3e590022", hash: "3e590022634e9e09d1e39a3f253303d2e3089d38c11964177eb79f4ad5b32ec6" },
  { phrase: "malibu", short: "86ad7dfa", hash: "86ad7dfa73229b3fa47d4e3ef4ff4a37e1ca3a1bc6ec6ae5906efd8ff20e6f66" },
];

export const ROMAN_OPTIONS = [
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

export const SYS_TECH_RIDDLES = [
  { prompt: "The core program of an OS managing hardware resources, CPU scheduling, and memory. What 6-letter term is it?", word: "kernel", label: "OS Core" },
  { prompt: "A network security shield monitoring and filtering incoming and outgoing traffic packets. What 8-letter system is it?", word: "firewall", label: "Security" },
  { prompt: "A program that translates source code into executable binary machine code before execution. What 8-letter tool is it?", word: "compiler", label: "Language Tool" },
  { prompt: "A software testing methodology where individual functions or modules are isolated and verified. What 4-letter word precedes 'testing'?", word: "unit", label: "Testing" },
  { prompt: "A hierarchical, tree-based structured object representation of HTML documents in web browsers. What 3-letter acronym is it?", word: "DOM", label: "Web Standard" },
  { prompt: "An active instance of a computer program being executed by threads in an operating system. What 7-letter term is it?", word: "process", label: "OS Process" },
  { prompt: "A communication endpoint for sending or receiving data across a computer network. What 6-letter term is it?", word: "socket", label: "Network Socket" },
  { prompt: "A dedicated memory holding area used to temporarily store data while in transit. What 6-letter term is it?", word: "buffer", label: "Memory Buffer" },
];

export const SQL_KEYWORD_OPTIONS = [
  { action: "retrieve and read rows from a table", word: "SELECT" },
  { action: "insert new rows into a database table", word: "INSERT" },
  { action: "modify existing records in a database table", word: "UPDATE" },
  { action: "remove records permanently from a table", word: "DELETE" },
  { action: "combine rows from two tables based on a related column", word: "JOIN" },
  { action: "filter rows based on specified condition criteria", word: "WHERE" },
  { action: "sort query result set rows in ascending or descending sequence", word: "ORDER" },
  { action: "eliminate duplicate rows in query results", word: "DISTINCT" },
];

export const NET_PORT_OPTIONS = [
  { proto: "DNS domain name lookups", port: "53" },
  { proto: "unencrypted HTTP web traffic", port: "80" },
  { proto: "secure encrypted HTTPS web traffic", port: "443" },
  { proto: "secure SSH remote terminal shell access", port: "22" },
  { proto: "FTP file transfer control connections", port: "21" },
  { proto: "SMTP email message routing", port: "25" },
  { proto: "Telnet legacy unencrypted terminal communications", port: "23" },
  { proto: "NTP network time synchronization", port: "123" },
];

export const CS_PIONEERS = [
  { clue: "British mathematician and father of theoretical computer science whose Bombe machine broke Enigma at Bletchley Park", code: "turing", name: "Alan Turing" },
  { clue: "Victorian mathematician who wrote the world's first algorithm for Charles Babbage's Analytical Engine", code: "lovelace", name: "Ada Lovelace" },
  { clue: "Father of Information Theory who introduced the digital bit and applied Boolean algebra to circuits", code: "shannon", name: "Claude Shannon" },
  { clue: "US Navy rear admiral who built the first compiler (A-0) and popularized the computer 'bug' term", code: "hopper", name: "Grace Hopper" },
  { clue: "Pioneer of modern computer architecture unifying CPU, arithmetic control unit, memory, and bus", code: "neumann", name: "John von Neumann" },
  { clue: "Creator of the World Wide Web and the first web browser at CERN in 1989", code: "berners", name: "Tim Berners-Lee" },
];

export const SWATCH_OPTIONS = [
  { hex: "#EFA", css: "#eeffaa", name: "Neon Lime Glow" },
  { hex: "#ACE", css: "#aaccee", name: "Vice Ice Blue" },
  { hex: "#FAB", css: "#ffaabb", name: "Flamingo Pink" },
  { hex: "#DAD", css: "#ddaadd", name: "Orchid Neon" },
  { hex: "#BEE", css: "#bbeeee", name: "Cyber Aqua" },
  { hex: "#CAB", css: "#ccaabb", name: "Sunset Mauve" },
  { hex: "#FAD", css: "#ffaadd", name: "Synth Magenta" },
  { hex: "#FED", css: "#ffee88", name: "Sunburst Gold" },
  { hex: "#CAF", css: "#ccaaff", name: "Electric Lavender" },
  { hex: "#BAD", css: "#bbaadd", name: "Vercetti Violet" },
];

export const CS_FUNDAMENTALS = [
  { clue: "The smallest atomic unit of digital data in computer science, storing binary 0 or 1. What 3-letter term am I?", word: "bit", name: "Digital Bit", tag: "Binary Unit" },
  { clue: "Composed of 8 continuous bits, I represent a single character in ASCII. What 4-letter unit am I?", word: "byte", name: "Data Byte", tag: "Data Unit" },
  { clue: "A linear data structure following Last-In First-Out (LIFO) where items push and pop from the top. What 5-letter term am I?", word: "stack", name: "LIFO Stack", tag: "Data Structure" },
  { clue: "A linear data structure following First-In First-Out (FIFO) where elements join the rear and leave the front. What 5-letter term am I?", word: "queue", name: "FIFO Queue", tag: "Data Structure" },
  { clue: "An unhandled flaw or error in source code causing unintended program behavior. What 3-letter term am I?", word: "bug", name: "Software Bug", tag: "Programming" },
  { clue: "High-speed volatile memory built directly inside or adjacent to the CPU for rapid data access. What 5-letter word am I?", word: "cache", name: "CPU Cache", tag: "Hardware" },
  { clue: "A contiguous collection of elements of the same data type stored sequentially in memory. What 5-letter data structure am I?", word: "array", name: "Array", tag: "Data Structure" },
  { clue: "A non-linear hierarchical data structure consisting of nodes connected by edges, starting from a root. What 4-letter term am I?", word: "tree", name: "Tree Structure", tag: "Data Structure" },
];

/* ─── Persistent Non-Repeating Cycle Helper ─── */
export function pickNonRepeating(category, pool, keyFn = (x) => x) {
  if (!pool || pool.length === 0) return null;
  if (pool.length === 1) return pool[0];

  let usedKeys = [];
  try {
    const raw = sessionStorage.getItem("vch_recent_pool_" + category);
    if (raw) usedKeys = JSON.parse(raw);
  } catch (_) {}

  // Filter out recently used keys
  const available = pool.filter((item) => !usedKeys.includes(String(keyFn(item))));
  const candidatePool = available.length > 0 ? available : pool;

  const picked = candidatePool[Math.floor(Math.random() * candidatePool.length)];
  const pickedKey = String(keyFn(picked));

  // Maintain recency history ring buffer
  const maxHistory = Math.max(1, pool.length - 1);
  const updatedKeys = [...usedKeys.filter((k) => k !== pickedKey), pickedKey].slice(-maxHistory);
  try {
    sessionStorage.setItem("vch_recent_pool_" + category, JSON.stringify(updatedKeys));
  } catch (_) {}

  return picked;
}

/* ─── Shared Storage / Broadcast Channel for Dynamic Question Management ─── */
export const RULES_CHANNEL = "vch_rules_sync_channel";
export const RULES_STORAGE_KEY = "vch_active_session_data";

export function loadSavedSessionData() {
  try {
    const saved = localStorage.getItem(RULES_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return null;
}

export function saveSessionData(session) {
  try {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(session));
    if (typeof BroadcastChannel !== "undefined") {
      const bus = new BroadcastChannel(RULES_CHANNEL);
      bus.postMessage({ type: "session_data_updated", session });
      bus.close();
    }
  } catch (_) {}
}

/* ─── Session Randomizer ─── */
export function createSessionData(customOverrides = {}) {
  const letters = "ABCDEFGHJKLNPQRSTUVWXYZ";
  let captcha = "";
  for (let i = 0; i < 5; i++) {
    let nextChar;
    do {
      nextChar = letters[Math.floor(Math.random() * letters.length)];
    } while (nextChar === captcha[captcha.length - 1]);
    captcha += nextChar;
  }

  const defaultSession = {
    codeSnippet: pickNonRepeating("codeSnippet", CODE_SNIPPET_PUZZLES, (c) => c.id),
    binaryTarget: pickNonRepeating("binaryTarget", BINARY_OPTIONS, (b) => b.dec),
    romanTarget: pickNonRepeating("romanTarget", ROMAN_OPTIONS, (r) => r.num),
    techCommon: pickNonRepeating("techCommon", TECH_COMMON_RIDDLES, (t) => t.ans),
    rot13: pickNonRepeating("rot13", ROT13_OPTIONS, (r) => r.plain),
    caesar: pickNonRepeating("caesar", CAESAR_OPTIONS, (c) => c.word),
    captcha,
    sqlKeyword: pickNonRepeating("sqlKeyword", SQL_KEYWORD_OPTIONS, (s) => s.word),
    sysTech: pickNonRepeating("sysTech", SYS_TECH_RIDDLES, (s) => s.word),
    csFundamental: pickNonRepeating("csFundamental", CS_FUNDAMENTALS, (s) => s.word),
    netPort: pickNonRepeating("netPort", NET_PORT_OPTIONS, (n) => n.port),
    shaPhrase: pickNonRepeating("shaPhrase", SHA_PHRASES, (s) => s.phrase),
    swatch: pickNonRepeating("swatch", SWATCH_OPTIONS, (s) => s.hex),
    csPioneer: pickNonRepeating("csPioneer", CS_PIONEERS, (c) => c.code),
    ...customOverrides,
  };

  saveSessionData(defaultSession);
  return defaultSession;
}

export function getDigitSum(pw) {
  return (pw.match(/\d/g) || []).reduce((acc, d) => acc + Number(d), 0);
}

/* ─── Build Full 45-Rule Security Suite ───
   All 45 rules are guaranteed:
   - ZERO duplicate conditions (Anti-repetition restriction removed completely)
   - Real, authentic code fill-in-the-blank snippet
   - Non-overlapping mathematical, networking, and CS conditions
*/
export function buildAll45Rules(session, cfg = CAMPAIGN_LEVELS[1]) {
  const codeSnippet = session.codeSnippet || CODE_SNIPPET_PUZZLES[0];
  const binaryTarget = session.binaryTarget || BINARY_OPTIONS[0];
  const romanTarget = session.romanTarget || ROMAN_OPTIONS[0];
  const techCommon = session.techCommon || TECH_COMMON_RIDDLES[0];
  const rot13 = session.rot13 || ROT13_OPTIONS[0];
  const caesar = session.caesar || CAESAR_OPTIONS[0];
  const captcha = session.captcha || "VD79K";
  const sqlKeyword = session.sqlKeyword || SQL_KEYWORD_OPTIONS[0];
  const sysTech = session.sysTech || SYS_TECH_RIDDLES[0];
  const csFundamental = session.csFundamental || CS_FUNDAMENTALS[0];
  const netPort = session.netPort || NET_PORT_OPTIONS[0];
  const shaPhrase = session.shaPhrase || SHA_PHRASES[0];
  const swatch = session.swatch || SWATCH_OPTIONS[0];
  const csPioneer = session.csPioneer || CS_PIONEERS[0];

  return [
    /* ════ LEVEL 1: TELLERS GATE (Rules 1 - 10) ════ */
    {
      id: 1,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Length Requirement",
      text: "Password must contain at least 8 characters",
      badge: (pw) => `${[...pw].length}/8`,
      hint: "Type at least 8 characters to meet minimum cipher length.",
      check: (pw) => [...pw].length >= 8,
      headline: "CIPHER TOO SHORT!",
      managerSpeech: (pw) => `That's way too short, rookie! Tommy's decryption brute-forcer will crack that in two seconds! Give me at least 8 characters! (Currently: ${[...pw].length}/8)`,
      expectedAnswer: ">= 8 total characters",
    },
    {
      id: 2,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Case Sensitivity",
      text: "Include at least one uppercase letter (A-Z)",
      badge: (pw) => ((pw.match(/[A-Z]/g) || []).length >= 1 ? "Upper ✓" : "Upper ?"),
      hint: "Include at least one capital letter (A-Z).",
      check: (pw) => /[A-Z]/.test(pw),
      headline: "UPPERCASE CLEARANCE!",
      managerSpeech: "Include at least one capital letter in the cipher!",
      expectedAnswer: "Any capital letter A-Z",
    },
    {
      id: 3,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Case Sensitivity",
      text: "Include at least one lowercase letter (a-z)",
      badge: (pw) => ((pw.match(/[a-z]/g) || []).length >= 1 ? "Lower ✓" : "Lower ?"),
      hint: "Include at least one lowercase letter (a-z).",
      check: (pw) => /[a-z]/.test(pw),
      headline: "LOWERCASE CLEARANCE!",
      managerSpeech: "We need case variation! Include at least one lowercase letter!",
      expectedAnswer: "Any lowercase letter a-z",
    },
    {
      id: 4,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Code Fill-in-the-Blank",
      isRiddle: true,
      poolCategory: "codeSnippet",
      text: `💻 CODE FILL-IN-THE-BLANK: ${codeSnippet.prompt}`,
      badge: (pw) => (new RegExp(codeSnippet.blank, "i").test(pw.replace(/["']/g, "")) ? `${codeSnippet.blank} ✓` : `${codeSnippet.lang} ?`),
      hint: `${codeSnippet.hint}`,
      check: (pw) => new RegExp(codeSnippet.blank, "i").test(pw.replace(/["']/g, "")),
      headline: "CODE SYNTAX FILL-IN-THE-BLANK!",
      managerSpeech: codeSnippet.managerSpeech,
      expectedAnswer: codeSnippet.blank,
    },
    {
      id: 5,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Numeric Requirement",
      text: "Include at least one numeric digit (0-9)",
      badge: (pw) => (/\d/.test(pw) ? "Digit ✓" : "Digit ?"),
      hint: "Include at least one numeric digit (0-9).",
      check: (pw) => /\d/.test(pw),
      headline: "NUMERIC PRESSURE!",
      managerSpeech: "The tumbler lock requires numerical pressure—insert at least one vault digit from 0 to 9!",
      expectedAnswer: "Any digit 0-9",
    },
    {
      id: 6,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Special Symbol",
      text: "Include at least one special character (!@#$%^&*)",
      badge: (pw) => (/[^a-zA-Z0-9\s]/.test(pw) ? "Special ✓" : "Special ?"),
      hint: "Include at least one special character (!@#$%^&*).",
      check: (pw) => /[^a-zA-Z0-9\s]/.test(pw),
      headline: "ENCRYPT SECURITY SIGNAL!",
      managerSpeech: "Our security transmission needs noise shielding! Inject at least one special symbol into the cipher!",
      expectedAnswer: "Any symbol !@#$%^&*",
    },
    {
      id: 7,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Binary Conversion",
      isRiddle: true,
      poolCategory: "binaryTarget",
      text: `Include the binary representation of decimal ${binaryTarget.dec}`,
      badge: (pw) => (pw.includes(binaryTarget.bin) ? `Binary ${binaryTarget.dec} ✓` : `Binary ${binaryTarget.dec} ?`),
      hint: `Convert decimal ${binaryTarget.dec} into binary: ${binaryTarget.bin} (type directly, no quotes).`,
      check: (pw) => pw.replace(/["']/g, "").includes(binaryTarget.bin),
      headline: "BINARY REGISTER CONVERSION!",
      managerSpeech: `Convert decimal ${binaryTarget.dec} into its binary representation! Enter ${binaryTarget.bin} (no quotes)!`,
      expectedAnswer: binaryTarget.bin,
    },
    {
      id: 8,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Whitespace Quarantine",
      text: "Quarantine protocol: Master key must not contain any whitespace characters",
      badge: (pw) => (!/\s/.test(pw) ? "No Spaces ✓" : "Whitespace Detected!"),
      hint: "Remove all space characters.",
      check: (pw) => !/\s/.test(pw),
      headline: "REMOVE ALL WHITESPACE!",
      managerSpeech: "Spaces leak buffer memory! Strip every single space character from the password!",
      expectedAnswer: "Zero spaces",
    },
    {
      id: 9,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Roman Numerals",
      isRiddle: true,
      poolCategory: "romanTarget",
      text: `Include Roman numeral representation for integer ${romanTarget.num} (${romanTarget.roman})`,
      badge: (pw) => (pw.includes(romanTarget.roman) ? `Roman ${romanTarget.roman} ✓` : "Roman ?"),
      hint: `Roman numeral for ${romanTarget.num} is ${romanTarget.roman} in uppercase (type directly, no quotes).`,
      check: (pw) => pw.replace(/["']/g, "").includes(romanTarget.roman),
      headline: "ROMAN NUMERAL VAULT ENCRYPTION!",
      managerSpeech: `Ancient Roman cipher lock! Translate decimal ${romanTarget.num} into Roman numerals: ${romanTarget.roman}!`,
      expectedAnswer: romanTarget.roman,
    },
    {
      id: 10,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "File Extension",
      text: "Include a valid programming file extension (.js, .py, .ts, etc.)",
      badge: (pw) => (/\.(js|py|html|css|ts|json|cpp|java|sh|jsx|tsx|php|rb|go|rs|sql|md)/i.test(pw.replace(/["']/g, "")) ? "File Ext ✓" : "Extension ?"),
      hint: "Include a standard code file extension preceded by a dot (e.g. .js, .py, .ts). Do NOT use quotes.",
      check: (pw) => /\.(js|py|html|css|ts|json|cpp|java|sh|jsx|tsx|php|rb|go|rs|sql|md)/i.test(pw.replace(/["']/g, "")),
      headline: "FILE EXTENSION SPECIFICATION!",
      managerSpeech: "The security program needs to register its script extension! Include a valid programming file extension with its dot!",
      expectedAnswer: ".js, .py, .ts, .html, etc.",
    },

    /* ════ LEVEL 2: EXECUTIVE CASH CORRIDORS (Rules 11 - 20) ════ */
    {
      id: 11,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Tech Trivia",
      isRiddle: true,
      poolCategory: "techCommon",
      text: `🧩 TECH TRIVIA: ${techCommon.prompt}`,
      badge: (pw) => {
        const alts = techCommon.alt || [techCommon.ans];
        const passed = alts.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
        return passed ? `${techCommon.label} ✓` : "Tech Trivia ?";
      },
      hint: `${techCommon.hint}`,
      check: (pw) => {
        const alts = techCommon.alt || [techCommon.ans];
        return alts.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
      },
      headline: "POP-TECH INTELLIGENCE CHECK!",
      managerSpeech: `Tech question from central intelligence! ${techCommon.prompt}`,
      expectedAnswer: techCommon.ans,
    },
    {
      id: 12,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Web Markup",
      text: "Include a valid HTML tag (e.g. <div>, <span>, <p>, <h1>)",
      badge: (pw) => (/<\s*(?:div|p|span|h[1-6]|a|b|i|u|button|input|form|table|tr|td|th|ul|ol|li|img|head|body|html|main|nav|header|footer|section|article|code|pre)\b[^>]*>/i.test(pw.replace(/["']/g, "")) || /<[a-zA-Z][a-zA-Z0-9]*>/i.test(pw.replace(/["']/g, "")) ? "HTML Tag ✓" : "HTML Tag ?"),
      hint: "Enclose a standard HTML markup element between angle brackets (e.g. <div>, <p>, <span>). Do NOT use quotes.",
      check: (pw) => /<\s*(?:div|p|span|h[1-6]|a|b|i|u|button|input|form|table|tr|td|th|ul|ol|li|img|head|body|html|main|nav|header|footer|section|article|code|pre)\b[^>]*>/i.test(pw.replace(/["']/g, "")) || /<[a-zA-Z][a-zA-Z0-9]*>/i.test(pw.replace(/["']/g, "")),
      headline: "HTML MARKUP TAG!",
      managerSpeech: "Structure the document DOM! Enclose a standard HTML markup tag between angle brackets!",
      expectedAnswer: "<div>, <p>, <span>, etc.",
    },
    {
      id: 13,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Language Keywords",
      text: "Include a reserved Python keyword (def, return, import, class, etc.)",
      badge: (pw) => (/(def|return|import|lambda|class|yield|async|await|while|elif|from|with|raise|except|finally|assert|break|continue|global|nonlocal)/i.test(pw.replace(/["']/g, "")) ? "Python KW ✓" : "Python KW ?"),
      hint: "Include a reserved Python language keyword (e.g. for functions, loops, or imports). Do NOT use quotes.",
      check: (pw) => /(def|return|import|lambda|class|yield|async|await|while|elif|from|with|raise|except|finally|assert|break|continue|global|nonlocal)/i.test(pw.replace(/["']/g, "")),
      headline: "PYTHON KEYWORD INJECTION!",
      managerSpeech: "Authenticate backend scripts! Inject a reserved Python language keyword!",
      expectedAnswer: "def, return, import, class, etc.",
    },
    {
      id: 14,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Version Control",
      text: "Include a Git command (commit, push, pull, branch, merge, etc.)",
      badge: (pw) => (/(commit|push|pull|checkout|branch|clone|status|merge|rebase|fetch|stash|reset|diff)/i.test(pw.replace(/["']/g, "")) ? "Git Cmd ✓" : "Git Cmd ?"),
      hint: "Include a command used in Git version control (e.g. for repository branching, commits, or remotes). Do NOT use quotes.",
      check: (pw) => /(commit|push|pull|checkout|branch|clone|status|merge|rebase|fetch|stash|reset|diff)/i.test(pw.replace(/["']/g, "")),
      headline: "VERSION CONTROL COMMAND!",
      managerSpeech: "Version control sync! Include a primary Git workflow command!",
      expectedAnswer: "commit, push, pull, branch, etc.",
    },
    {
      id: 15,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Networking IP",
      text: "Include a valid IPv4 address (e.g. 192.168.1.1 or 10.0.0.1)",
      badge: (pw) => (/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(pw.replace(/["']/g, "")) ? "IPv4 ✓" : "IPv4 ?"),
      hint: "Include a 4-octet IPv4 numerical address with octets 0-255 separated by dots. Do NOT use quotes.",
      check: (pw) => /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(pw.replace(/["']/g, "")),
      headline: "IPV4 ADDRESS ROUTING!",
      managerSpeech: "Network interface configuration! Route packets with a 4-octet IPv4 numerical address!",
      expectedAnswer: "192.168.1.1, 10.0.0.1, etc.",
    },
    {
      id: 16,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Encapsulation",
      text: "Parameter encapsulation: Enclose any token inside square brackets: [ ... ]",
      badge: (pw) => (/\[[a-zA-Z0-9_\-!:]+\]/.test(pw.replace(/["']/g, "")) ? "[OK] ✓" : "[ ... ] ?"),
      hint: "Wrap any word or token in square brackets like [1010] or [js] (type directly, do NOT use quotes).",
      check: (pw) => /\[[a-zA-Z0-9_\-!:]+\]/.test(pw.replace(/["']/g, "")),
      headline: "ENCAPSULATE PARAMETERS!",
      managerSpeech: "Security parameters must be bounded! Wrap any token inside square brackets like [1010]!",
      expectedAnswer: "[token], [101], [js], etc.",
    },
    {
      id: 17,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Hardware Address",
      text: "Include a valid MAC address format (e.g. 01:23:45:67:89:AB)",
      badge: (pw) => (/(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/.test(pw.replace(/["']/g, "")) ? "MAC ✓" : "MAC Format ?"),
      hint: "Include 6 pairs of hex digits separated by colons or hyphens, e.g. 01:23:45:67:89:AB (do NOT use quotes).",
      check: (pw) => /(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/.test(pw.replace(/["']/g, "")),
      headline: "PHYSICAL MAC ADDRESS!",
      managerSpeech: "Hardware NIC layer verification! Include a standard MAC address format like 01:23:45:67:89:AB!",
      expectedAnswer: "01:23:45:67:89:AB",
    },
    {
      id: 18,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Tumbler Arithmetic",
      text: `Tumbler arithmetic: Numeric digits must sum up to at least ${cfg.digitSumTarget}`,
      badge: (pw) => `Sum: ${getDigitSum(pw)}/${cfg.digitSumTarget}`,
      hint: (pw) => `Current digit sum is ${getDigitSum(pw)}. Must be at least ${cfg.digitSumTarget}.`,
      check: (pw) => getDigitSum(pw) >= cfg.digitSumTarget,
      headline: "ARITHMETIC PRESSURE!",
      managerSpeech: (pw, cfg) => `The mechanical tumbler requires numerical pressure! The numbers in your password must sum up to at least ${cfg.digitSumTarget}! Current sum: ${getDigitSum(pw)}!`,
      expectedAnswer: `>= ${cfg.digitSumTarget}`,
    },
    {
      id: 19,
      level: 2,
      section: "Executive Cash Corridors",
      category: "ROT13 Cipher",
      isRiddle: true,
      poolCategory: "rot13",
      text: `🧩 CIPHER: Include the word "${rot13.plain}" encoded with ROT13 (${rot13.encoded})`,
      badge: (pw) => (new RegExp(rot13.encoded, "i").test(pw.replace(/["']/g, "")) ? `${rot13.encoded} ✓` : "ROT13 ?"),
      hint: `ROT13 of ${rot13.plain} is ${rot13.encoded} (type directly, do NOT use quotes).`,
      check: (pw) => new RegExp(rot13.encoded, "i").test(pw.replace(/["']/g, "")),
      headline: "ROT13 CIPHER SHIFT!",
      managerSpeech: `Classic ROT13 rotation cipher! Rotate ${rot13.plain} by 13 alphabet positions to ${rot13.encoded}!`,
      expectedAnswer: rot13.encoded,
    },
    {
      id: 20,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Color Code",
      text: "Include a valid hexadecimal color code (e.g. #48D5D0 or #A1B2C3)",
      badge: (pw) => (/#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/i.test(pw.replace(/["']/g, "")) ? "Hex Color ✓" : "Hex Color ?"),
      hint: "Include a 6-digit hex color starting with #, like #48D5D0 or #A1B2C3 (do NOT use quotes).",
      check: (pw) => /#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})/i.test(pw.replace(/["']/g, "")),
      headline: "HEXADECIMAL COLOR CODE!",
      managerSpeech: "Calibrate RGB chromatic sensors! Include a valid 6-character hex color code starting with '#' like #48D5D0!",
      expectedAnswer: "#RRGGBB (e.g. #48D5D0)",
    },

    /* ════ LEVEL 3: TITANIUM DEEP VAULT (Rules 21 - 32) ════ */
    {
      id: 21,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Caesar Cipher",
      isRiddle: true,
      poolCategory: "caesar",
      text: `🧩 CIPHER: Include Caesar cipher (+${caesar.shift} shift) encoding of the word "${caesar.word}" (${caesar.cipher})`,
      badge: (pw) => (new RegExp(caesar.cipher, "i").test(pw.replace(/["']/g, "")) ? `${caesar.cipher} ✓` : "Caesar ?"),
      hint: `Caesar shift +${caesar.shift} of ${caesar.word} is ${caesar.cipher} (type directly, no quotes).`,
      check: (pw) => new RegExp(caesar.cipher, "i").test(pw.replace(/["']/g, "")),
      headline: "CAESAR CIPHER SHIFT!",
      managerSpeech: `Shift the Roman alphabet by +${caesar.shift} for '${caesar.word}'! Enter ${caesar.cipher} (no quotes)!`,
      expectedAnswer: caesar.cipher,
    },
    {
      id: 22,
      level: 3,
      section: "Titanium Deep Vault",
      category: "ISO 8601 Timestamp",
      text: "Include a valid timestamp in ISO 8601 format (e.g. 2026-10-18)",
      badge: (pw) => (/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:Z|[+-]\d{2}:?\d{2})?)?/.test(pw.replace(/["']/g, "")) ? "ISO 8601 ✓" : "ISO 8601 ?"),
      hint: "Include an ISO 8601 timestamp, e.g. 2026-10-18 or 2026-10-18T12:00:00Z (type directly, no quotes).",
      check: (pw) => /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:Z|[+-]\d{2}:?\d{2})?)?/.test(pw.replace(/["']/g, "")),
      headline: "ISO 8601 TIMESTAMP!",
      managerSpeech: "Audit timestamp synchronization! Include a valid ISO 8601 date timestamp like 2026-10-18 (no quotes)!",
      expectedAnswer: "YYYY-MM-DD",
    },
    {
      id: 23,
      level: 3,
      section: "Titanium Deep Vault",
      category: "HTTP Status",
      text: "Include a valid HTTP request method and status code (e.g. POST:201 or GET:404)",
      badge: (pw) => (/(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)[:_\-\s]?(100|[2345]\d{2})/i.test(pw.replace(/["']/g, "")) ? "HTTP Status ✓" : "HTTP Status ?"),
      hint: "Include an HTTP method and 3-digit status code without spaces, e.g. POST:201 or GET:404 (type directly, no quotes).",
      check: (pw) => /(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)[:_\-\s]?(100|[2345]\d{2})/i.test(pw.replace(/["']/g, "")),
      headline: "HTTP PROTOCOL STATUS!",
      managerSpeech: "Web API response! Include a valid HTTP method and status code like POST:201 or GET:404 (no quotes, no spaces)!",
      expectedAnswer: "METHOD:STATUS (e.g. POST:201)",
    },
    {
      id: 24,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Biometric Captcha",
      isCaptcha: true,
      text: `Authorize with 5-letter biometric captcha: [${captcha}]`,
      badge: (pw) => (pw.replace(/["']/g, "").includes(captcha) ? "Captcha ✓" : "Captcha ?"),
      hint: `Enter ${captcha} in exact uppercase (type directly, no quotes).`,
      check: (pw) => pw.replace(/["']/g, "").includes(captcha),
      headline: "BIOMETRIC RETINAL SCAN!",
      managerSpeech: `Retinal verification required! The terminal monitor displays ${captcha}! Type it directly in exact uppercase!`,
      expectedAnswer: captcha,
    },
    {
      id: 25,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Palindrome String",
      text: "Include a palindrome whose length is a prime number (e.g. radar, kayak, racecar)",
      badge: (pw) => {
        const sanitized = pw.replace(/["']/g, "");
        const words = sanitized.match(/[a-zA-Z]+/g) || [];
        const primes = [3, 5, 7, 11, 13];
        const match = words.find((w) => primes.includes(w.length) && w.toLowerCase() === [...w.toLowerCase()].reverse().join(""));
        return match ? `${match} ✓` : "Prime Palindrome ?";
      },
      hint: "Include a prime-length palindrome (3, 5, or 7 letters), e.g. radar, kayak, racecar, or level (type directly, no quotes).",
      check: (pw) => {
        const sanitized = pw.replace(/["']/g, "");
        const words = sanitized.match(/[a-zA-Z]+/g) || [];
        const primes = [3, 5, 7, 11, 13];
        return words.some((w) => primes.includes(w.length) && w.toLowerCase() === [...w.toLowerCase()].reverse().join(""));
      },
      headline: "PRIME PALINDROME PROTOCOL!",
      managerSpeech: "Symmetric mirror cipher! Include a palindrome whose letter count is a prime number, like radar or kayak!",
      expectedAnswer: "radar, kayak, racecar",
    },
    {
      id: 26,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Anagram Duality",
      text: "Include two words that are anagrams of each other (e.g. silent_listen or evil-vile)",
      badge: (pw) => {
        const sanitized = pw.replace(/["']/g, "");
        const words = (sanitized.match(/[a-zA-Z]{3,}/g) || []).map((w) => w.toLowerCase());
        for (let i = 0; i < words.length; i++) {
          for (let j = i + 1; j < words.length; j++) {
            if (words[i] !== words[j] && words[i].length === words[j].length) {
              if ([...words[i]].sort().join("") === [...words[j]].sort().join("")) return `${words[i]}/${words[j]} ✓`;
            }
          }
          const w = words[i];
          if (w.length >= 6 && w.length % 2 === 0) {
            const half = w.length / 2;
            const p1 = w.slice(0, half);
            const p2 = w.slice(half);
            if (p1 !== p2 && [...p1].sort().join("") === [...p2].sort().join("")) return `${p1}/${p2} ✓`;
          }
        }
        return "Anagrams ?";
      },
      hint: "Include two anagram words (same letters rearranged), e.g. silent_listen, evil-vile, or silentlisten (no quotes).",
      check: (pw) => {
        const sanitized = pw.replace(/["']/g, "");
        const words = (sanitized.match(/[a-zA-Z]{3,}/g) || []).map((w) => w.toLowerCase());
        for (let i = 0; i < words.length; i++) {
          for (let j = i + 1; j < words.length; j++) {
            if (words[i] !== words[j] && words[i].length === words[j].length) {
              if ([...words[i]].sort().join("") === [...words[j]].sort().join("")) return true;
            }
          }
          const w = words[i];
          if (w.length >= 6 && w.length % 2 === 0) {
            const half = w.length / 2;
            const p1 = w.slice(0, half);
            const p2 = w.slice(half);
            if (p1 !== p2 && [...p1].sort().join("") === [...p2].sort().join("")) return true;
          }
        }
        return false;
      },
      headline: "ANAGRAM DUALITY LOCK!",
      managerSpeech: "Letter transposition cipher! Include two different words that are anagrams of each other, like silent_listen or evil-vile!",
      expectedAnswer: "silent / listen, evil / vile",
    },
    {
      id: 27,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Semantic Versioning",
      text: "Include two semantic versions in ascending order (e.g. 1.0.1 then 1.0.2)",
      badge: (pw) => {
        const matches = [...pw.replace(/["']/g, "").matchAll(/(?:v)?(\d+)\.(\d+)\.(\d+)/gi)];
        return matches.length >= 2 ? "SemVer Order ✓" : "SemVer Order ?";
      },
      hint: "Include two SemVer versions in order (smaller then larger), e.g. 1.0.1 then 1.0.2 (no quotes).",
      check: (pw) => {
        const matches = [...pw.replace(/["']/g, "").matchAll(/(?:v)?(\d+)\.(\d+)\.(\d+)/gi)];
        if (matches.length < 2) return false;
        for (let i = 0; i < matches.length - 1; i++) {
          const v1 = [Number(matches[i][1]), Number(matches[i][2]), Number(matches[i][3])];
          for (let j = i + 1; j < matches.length; j++) {
            const v2 = [Number(matches[j][1]), Number(matches[j][2]), Number(matches[j][3])];
            if (v1[0] < v2[0] || (v1[0] === v2[0] && (v1[1] < v2[1] || (v1[1] === v2[1] && v1[2] < v2[2])))) return true;
          }
        }
        return false;
      },
      headline: "SEMANTIC VERSION HIERARCHY!",
      managerSpeech: "Software release progression! Include two semantic versions in ascending order, like 1.0.1 followed by 1.0.2!",
      expectedAnswer: "1.0.1 then 1.0.2",
    },
    {
      id: 28,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Database SQL",
      isRiddle: true,
      poolCategory: "sqlKeyword",
      text: `🧩 DATABASE SQL: Include the standard SQL keyword used to ${sqlKeyword.action} (${sqlKeyword.word})`,
      badge: (pw) => (new RegExp(sqlKeyword.word, "i").test(pw.replace(/["']/g, "")) ? `${sqlKeyword.word} ✓` : "SQL ?"),
      hint: `Standard SQL keyword: ${sqlKeyword.word} (type directly, do NOT use quotes).`,
      check: (pw) => new RegExp(sqlKeyword.word, "i").test(pw.replace(/["']/g, "")),
      headline: "DATABASE QUERY PROTOCOL!",
      managerSpeech: `Central database access! What SQL keyword is used to ${sqlKeyword.action}? Enter ${sqlKeyword.word} (no quotes)!`,
      expectedAnswer: sqlKeyword.word,
    },
    {
      id: 29,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Operating Systems",
      isRiddle: true,
      poolCategory: "sysTech",
      text: `🧩 SYSTEM ARCHITECTURE: ${sysTech.prompt}`,
      badge: (pw) => (new RegExp(sysTech.word, "i").test(pw.replace(/["']/g, "")) ? `${sysTech.word} ✓` : `${sysTech.label} ?`),
      hint: `System component: ${sysTech.word} (type directly, do NOT use quotes).`,
      check: (pw) => new RegExp(sysTech.word, "i").test(pw.replace(/["']/g, "")),
      headline: "OPERATING SYSTEM ARCHITECTURE!",
      managerSpeech: `Systems engineering challenge! ${sysTech.prompt} Enter ${sysTech.word} (no quotes)!`,
      expectedAnswer: sysTech.word,
    },
    {
      id: 30,
      level: 3,
      section: "Titanium Deep Vault",
      category: "CS Fundamentals",
      isRiddle: true,
      poolCategory: "csFundamental",
      text: `🧩 CS FUNDAMENTALS: ${csFundamental.clue}`,
      badge: (pw) => (new RegExp(`\\b${csFundamental.word}\\b`, "i").test(pw.replace(/["']/g, "")) || new RegExp(csFundamental.word, "i").test(pw.replace(/["']/g, "")) ? `${csFundamental.word} ✓` : `${csFundamental.tag} ?`),
      hint: `Fundamental concept: ${csFundamental.word} (type directly, do NOT use quotes).`,
      check: (pw) => new RegExp(csFundamental.word, "i").test(pw.replace(/["']/g, "")),
      headline: "COMPUTER SCIENCE FUNDAMENTALS!",
      managerSpeech: `Core computer science! ${csFundamental.clue} Type ${csFundamental.word} (no quotes)!`,
      expectedAnswer: csFundamental.word,
    },
    {
      id: 31,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Design Patterns",
      isRiddle: true,
      text: '🧩 SOFTWARE ENGINEERING: In OOP design patterns, I ensure that a class has only ONE solitary instance throughout program execution. What 9-letter pattern am I?',
      badge: (pw) => (/singleton/i.test(pw.replace(/["']/g, "")) ? "singleton ✓" : "Pattern ?"),
      hint: "One-instance design pattern: singleton (type directly, do NOT use quotes).",
      check: (pw) => /singleton/i.test(pw.replace(/["']/g, "")),
      headline: "DESIGN PATTERN RIDDLE!",
      managerSpeech: "Only one single instance allowed! What GoF design pattern is that? Enter singleton (no quotes)!",
      expectedAnswer: "singleton",
    },
    {
      id: 32,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Algorithms",
      isRiddle: true,
      text: '🧩 ALGORITHMS: What 9-letter programming paradigm involves a function directly or indirectly calling itself to solve smaller subproblems?',
      badge: (pw) => (/recursion/i.test(pw.replace(/["']/g, "")) ? "recursion ✓" : "Algorithm ?"),
      hint: "Self-referencing function paradigm: recursion (type directly, do NOT use quotes).",
      check: (pw) => /recursion/i.test(pw.replace(/["']/g, "")),
      headline: "ALGORITHMIC PARADIGM RIDDLE!",
      managerSpeech: "Call stack unwinding! What programming paradigm involves a function calling itself? Enter recursion (no quotes)!",
      expectedAnswer: "recursion",
    },

    /* ════ LEVEL 4: OMEGA QUANTUM CORE (Rules 33 - 45) ════ */
    {
      id: 33,
      level: 4,
      section: "Omega Quantum Core",
      category: "Digital Logic",
      isRiddle: true,
      text: '🧩 TECH RIDDLE: I am the universal boolean logic gate that outputs 0 ONLY when both inputs are 1. Any digital gate can be forged from me. What 4-letter gate am I?',
      badge: (pw) => (/NAND/i.test(pw.replace(/["']/g, "")) ? "NAND ✓" : "Logic Gate ?"),
      hint: "Universal logic gate: NAND (type directly, do NOT use quotes).",
      check: (pw) => /NAND/i.test(pw.replace(/["']/g, "")),
      headline: "UNIVERSAL GATE RIDDLE!",
      managerSpeech: "The universal circuit gate! What gate produces 0 only on two 1s? Enter NAND (no quotes)!",
      expectedAnswer: "NAND",
    },
    {
      id: 34,
      level: 4,
      section: "Omega Quantum Core",
      category: "Parity Balance",
      text: "Master key parity: Total character count must be an EVEN number",
      badge: (pw) => `Len: ${[...pw].length} (${[...pw].length % 2 === 0 ? "EVEN ✓" : "ODD"})`,
      hint: "Add or remove one character so the length is an even number.",
      check: (pw) => [...pw].length > 0 && [...pw].length % 2 === 0,
      headline: "EVEN PARITY BALANCE!",
      managerSpeech: "Parity mismatch! The total character count across the whole key must be an EVEN number!",
      expectedAnswer: "Even string length",
    },
    {
      id: 35,
      level: 4,
      section: "Omega Quantum Core",
      category: "Network Ports",
      isRiddle: true,
      poolCategory: "netPort",
      text: `🧩 NETWORK PORTS: Include the standard IANA port number reserved for ${netPort.proto} (Port ${netPort.port})`,
      badge: (pw) => (pw.replace(/["']/g, "").includes(netPort.port) ? `Port ${netPort.port} ✓` : "Port ?"),
      hint: `Standard IANA network port for ${netPort.proto} is ${netPort.port} (type directly, no quotes).`,
      check: (pw) => pw.replace(/["']/g, "").includes(netPort.port),
      headline: "IANA PORT NUMBER ASSIGNMENT!",
      managerSpeech: `Network transmission security! What is the standard port for ${netPort.proto}? Type ${netPort.port} (no quotes)!`,
      expectedAnswer: netPort.port,
    },
    {
      id: 36,
      level: 4,
      section: "Omega Quantum Core",
      category: "Perimeter Symmetry",
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
      expectedAnswer: "pw[0] === pw[last]",
    },
    {
      id: 37,
      level: 4,
      section: "Omega Quantum Core",
      category: "Cryptographic Hash",
      isRiddle: true,
      poolCategory: "shaPhrase",
      text: `🧩 CRYPTO HASH: Include the SHA-256 hash (or 8-char digest prefix: ${shaPhrase.short}) of phrase "${shaPhrase.phrase}"`,
      badge: (pw) => (pw.toLowerCase().includes(shaPhrase.short) || /[a-f0-9]{64}/i.test(pw) ? "SHA256 ✓" : "SHA256 ?"),
      hint: `SHA-256 8-char prefix for ${shaPhrase.phrase} is ${shaPhrase.short} (type directly, no quotes).`,
      check: (pw) => pw.toLowerCase().includes(shaPhrase.short) || pw.toLowerCase().includes(shaPhrase.hash) || /[a-f0-9]{64}/i.test(pw),
      headline: "CRYPTOGRAPHIC HASH DIGEST!",
      managerSpeech: `Cryptographic integrity check! Include the SHA-256 digest prefix '${shaPhrase.short}' for '${shaPhrase.phrase}'!`,
      expectedAnswer: shaPhrase.short,
    },
    {
      id: 38,
      level: 4,
      section: "Omega Quantum Core",
      category: "Prime Numbers",
      text: "Prime security factor: Include at least one 2-digit prime number (13, 17, 19, 23, 29, 31, etc.)",
      badge: (pw) => (/13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(pw) ? "Prime ✓" : "2-Digit Prime ?"),
      hint: "2-digit prime numbers include: 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 (no quotes).",
      check: (pw) => /13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(pw),
      headline: "PRIME NUMBER ENCRYPTION!",
      managerSpeech: "RSA cryptographic circuit requires primes! Include a 2-digit prime number!",
      expectedAnswer: "13, 17, 19, 23, 29, etc.",
    },
    {
      id: 39,
      level: 4,
      section: "Omega Quantum Core",
      category: "Asymptotic Complexity",
      isRiddle: true,
      text: '🧩 TECH RIDDLE: Algorithmic Complexity: In Big-O asymptotic notation, what is the quadratic worst-case runtime complexity of standard unbalanced Quicksort?',
      badge: (pw) => (/O\(n\^?2\)/i.test(pw.replace(/["']/g, "")) ? "O(n²) ✓" : "Big-O ?"),
      hint: "Quicksort worst-case occurs on sorted arrays: quadratic O(n2) or O(n^2) (type directly, no quotes).",
      check: (pw) => /O\(n\^?2\)/i.test(pw.replace(/["']/g, "")),
      headline: "ASYMPTOTIC COMPLEXITY RIDDLE!",
      managerSpeech: "Quicksort worst-case pivot breakdown! What is the quadratic asymptotic upper bound in Big-O? Enter O(n2) or O(n^2) (no quotes)!",
      expectedAnswer: "O(n2) or O(n^2)",
    },
    {
      id: 40,
      level: 4,
      section: "Omega Quantum Core",
      category: "Optical Swatch",
      isSwatch: true,
      poolCategory: "swatch",
      swatchColor: swatch.css,
      text: `Include 3-character uppercase hex code for vault color swatch (${swatch.hex})`,
      badge: (pw) => (pw.replace(/["']/g, "").includes(swatch.hex) ? `${swatch.hex} ✓` : "Hex Code ?"),
      hint: `Color swatch hex code is ${swatch.hex} (type directly, no quotes).`,
      check: (pw) => pw.replace(/["']/g, "").includes(swatch.hex),
      headline: "OPTICAL SWATCH CALIBRATION!",
      managerSpeech: "Calibrate the laser sensors! Type the 3-character hex code for our color swatch!",
      expectedAnswer: swatch.hex,
    },
    {
      id: 41,
      level: 4,
      section: "Omega Quantum Core",
      category: "Deadlock Avoidance",
      isRiddle: true,
      text: '🧩 TECH RIDDLE: Deadlock Avoidance: What 6-letter algorithm name, formulated by Edsger Dijkstra, tests resource allocation safety before granting claims to avoid deadlocks?',
      badge: (pw) => (/banker/i.test(pw.replace(/["']/g, "")) ? "banker ✓" : "Algorithm ?"),
      hint: "Dijkstra's deadlock avoidance algorithm: banker (type directly, no quotes).",
      check: (pw) => /banker/i.test(pw.replace(/["']/g, "")),
      headline: "DEADLOCK AVOIDANCE RIDDLE!",
      managerSpeech: "Operating systems resource matrix! What algorithm formulated by Dijkstra tests safe states to prevent deadlock? Enter banker (no quotes)!",
      expectedAnswer: "banker",
    },
    {
      id: 42,
      level: 4,
      section: "Omega Quantum Core",
      category: "Character Encoding",
      isRiddle: true,
      text: '🧩 CHARACTER ENCODING: "What foundational 5-letter 7-bit character encoding standard, published in 1963, assigns numerical codes 0–127 to English characters and symbols?"',
      badge: (pw) => (/ASCII/i.test(pw) ? "ASCII ✓" : "Character Encoding ?"),
      hint: 'Standard 7-bit character encoding acronym: "ASCII".',
      check: (pw) => /ASCII/i.test(pw),
      headline: "CHARACTER ENCODING RIDDLE!",
      managerSpeech: "The universal 7-bit character encoding! What 5-letter acronym standardized text codes?",
      expectedAnswer: "ASCII",
    },
    {
      id: 43,
      level: 4,
      section: "Omega Quantum Core",
      category: "CS Pioneer",
      isRiddle: true,
      poolCategory: "csPioneer",
      text: `🧩 CS PIONEER: "${csPioneer.clue}. What is their last name?"`,
      badge: (pw) => (new RegExp(csPioneer.code, "i").test(pw) ? `${csPioneer.code} ✓` : "Pioneer ?"),
      hint: `Computer pioneer last name: "${csPioneer.code}".`,
      check: (pw) => new RegExp(csPioneer.code, "i").test(pw),
      headline: "FATHER OF COMPUTING RIDDLE!",
      managerSpeech: `Computer pioneer identification! What is the last name of ${csPioneer.name}?`,
      expectedAnswer: csPioneer.code,
    },
    {
      id: 44,
      level: 4,
      section: "Omega Quantum Core",
      category: "Boolean Logic",
      isRiddle: true,
      text: '🧩 DIGITAL LOGIC: "What 3-letter boolean logic operator outputs 1 (TRUE) if and only if its two binary inputs are strictly DIFFERENT (Exclusive OR)?"',
      badge: (pw) => (/XOR/i.test(pw) ? "XOR ✓" : "Exclusive OR ?"),
      hint: 'Exclusive OR logic operator: "XOR".',
      check: (pw) => /XOR/i.test(pw),
      headline: "EXCLUSIVE OR RIDDLE!",
      managerSpeech: "Binary parity gate! What 3-letter logic operator is true only when inputs differ? Exclusive OR!",
      expectedAnswer: "XOR",
    },
    {
      id: 45,
      level: 4,
      section: "Omega Quantum Core",
      category: "Master Directive",
      isRiddle: true,
      text: '🧩 MASTER CONTAINMENT DIRECTIVE: "Final emergency system lockdown: Enter the 12-character uppercase command directive confirming our vault is locked (two words separated by an underscore)."',
      badge: (pw) => (/VAULT_LOCKED/i.test(pw) ? "LOCKED ✓" : "Master Directive ?"),
      hint: 'Emergency directive is "VAULT_LOCKED".',
      check: (pw) => /VAULT_LOCKED/i.test(pw),
      headline: "FINAL QUANTUM SEAL!",
      managerSpeech: "THIS IS IT, ROOKIE! FINAL LAYER! ENTER THE EMERGENCY 'VAULT IS LOCKED' DIRECTIVE TO TRAP TOMMY FOREVER!",
      expectedAnswer: "VAULT_LOCKED",
    },
  ];
}
