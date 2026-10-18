/**
 * Vice City Heist: Bank Manager Vault Defense
 * Core Game Rules, Dynamic Cipher Pools, and 59-Rule Progressive Campaign Configurations
 * 
 * 4-Floor Progressive Campaign Distribution:
 * - Level 1: 10 rules (Rules 1 - 10) · 10 minutes (600s) · Difficulty Tier 1 -> Tier 2/3
 * - Level 2: 13 rules (Rules 11 - 23) · 9 minutes (540s) · Difficulty Tier 2 -> Tier 3
 * - Level 3: 16 rules (Rules 24 - 39) · 8 minutes (480s) · Difficulty Tier 3 -> Tier 4
 * - Level 4: 20 rules (Rules 40 - 59) · 7 minutes (420s) · Difficulty Tier 4 -> Tier 5
 * Total: Exactly 59 rules across 4 floors.
 */

/* ─── 5-Tier Difficulty Configuration ─── */
export const DIFFICULTY_TIERS = {
  1: { level: 1, stars: "★☆☆☆☆", label: "RECRUIT", color: "#00E676", badge: "TIER 1" },
  2: { level: 2, stars: "★★☆☆☆", label: "OPERATOR", color: "#48D5D0", badge: "TIER 2" },
  3: { level: 3, stars: "★★★☆☆", label: "SPECIALIST", color: "#FFD166", badge: "TIER 3" },
  4: { level: 4, stars: "★★★★☆", label: "EXPERT", color: "#F84391", badge: "TIER 4" },
  5: { level: 5, stars: "★★★★★", label: "MASTER CYBER", color: "#9B00FF", badge: "TIER 5" },
};

/* ─── 4-Level Progressive Campaign Configurations ─── */
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
    rules: 23,
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
    rules: 39,
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
    rules: 59,
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

/* ─── Code Snippets Fill-In-The-Blank Pool (Rule 10) ─── */
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
    managerSpeech: 'Logic branch checkpoint! What 2-letter keyword executes a condition? Enter if!'
  },
  {
    id: "while_loop",
    lang: "C / Python / JS",
    title: "Condition Loop",
    snippet: '_____ (security_breach == true) {\n    lock_outer_doors();\n}',
    blank: "while",
    hint: 'Fill in the blank: Loop keyword that runs while condition holds true: while (type directly, no quotes)',
    prompt: 'Fill in the missing loop keyword: _____ (security_breach == true) { ... }',
    managerSpeech: 'Continuous defense loop! What 5-letter keyword runs a loop while condition is true? Enter while!'
  },
  {
    id: "print_python",
    lang: "Python",
    title: "Python Print Statement",
    snippet: '_____("Vault Security Status: Armed")',
    blank: "print",
    hint: 'Fill in the blank: Python built-in standard display function: print (type directly, no quotes)',
    prompt: 'Fill in the missing Python output function: _____("Vault Security Status: Armed");',
    managerSpeech: 'Python terminal log check! What 5-letter function prints output to console? Enter print!'
  },
  {
    id: "new_keyword",
    lang: "Java / JS / C++",
    title: "Instance Allocation",
    snippet: 'VaultLock lock = _____ VaultLock();',
    blank: "new",
    hint: 'Fill in the blank: Keyword to instantiate or allocate a new object: new (type directly, no quotes)',
    prompt: 'Fill in the missing object instantiation keyword: VaultLock lock = _____ VaultLock();',
    managerSpeech: 'Object instantiation! What 3-letter keyword creates a new object instance? Enter new!'
  },
  {
    id: "static_mod",
    lang: "Java / C / C#",
    title: "Class Modifier",
    snippet: 'public _____ int MAX_SAFE_DEPOSITS = 1986;',
    blank: "static",
    hint: 'Fill in the blank: Keyword for class-level (non-instance) variables/methods: static (type directly, no quotes)',
    prompt: 'Fill in the missing Java/C# modifier: public _____ int MAX_SAFE_DEPOSITS = 1986;',
    managerSpeech: 'Class variable memory check! What 6-letter modifier makes a field belong to the class itself? Enter static!'
  }
];

/* ─── Sensational Tech: Modern AI Models (Rule 11) ─── */
export const CHATGPT_OPTIONS = [
  {
    model: "4o",
    name: "GPT-4o (Omni)",
    prompt: 'What is OpenAI\'s famous flagship multimodal model release for ChatGPT (short 2-character name)?',
    hint: 'OpenAI\'s omni flagship model is "4o" (do NOT use quotes).',
    alt: ["4o", "omni", "gpt-4o", "gpt4o"]
  },
  {
    model: "o1",
    name: "OpenAI o1 Reasoning",
    prompt: 'What is OpenAI\'s breakthrough reasoning model series name designed for complex math & coding (short 2-character name)?',
    hint: 'OpenAI\'s reasoning model series is "o1" (do NOT use quotes).',
    alt: ["o1", "o3", "reasoning"]
  },
  {
    model: "gpt4",
    name: "GPT-4",
    prompt: 'What major transformer model series by OpenAI preceded GPT-4o (enter "gpt4")?',
    hint: 'Generative Pre-trained Transformer model: "gpt4" (do NOT use quotes).',
    alt: ["gpt4", "4o", "gpt-4"]
  }
];

/* ─── Sensational Tech: Tesla High-Tech Innovations (Rule 12) ─── */
export const TESLA_OPTIONS = [
  {
    model: "roadster",
    name: "Tesla Roadster",
    prompt: 'What futuristic sports car has Elon Musk announced with optional SpaceX cold gas thrusters that can "fly"? (8-letter word)',
    hint: 'Tesla\'s rocket-thruster flying supercar: "roadster" (do NOT use quotes).',
    alt: ["roadster"]
  },
  {
    model: "cybertruck",
    name: "Tesla Cybertruck",
    prompt: 'What famous angular stainless-steel electric pickup truck was engineered by Tesla? (10-letter word)',
    hint: 'Tesla\'s angular electric pickup: "cybertruck" (do NOT use quotes).',
    alt: ["cybertruck"]
  },
  {
    model: "autopilot",
    name: "Tesla Autopilot",
    prompt: 'What famous autonomous driving and self-steering technology is built into Tesla vehicles? (9-letter word)',
    hint: 'Tesla autonomous navigation system: "autopilot" (do NOT use quotes).',
    alt: ["autopilot", "fsd"]
  }
];

/* ─── Accessible Tech & Common Knowledge Riddles Pool (Rule 13) ─── */
export const TECH_COMMON_RIDDLES = [
  {
    prompt: "Where is user data from apps like Instagram and TikTok stored remotely? (5-letter word)",
    ans: "cloud",
    alt: ["cloud", "server"],
    label: "Cloud Storage",
    hint: "Remote distributed internet servers and offsite data storage: cloud (do NOT use quotes)."
  },
  {
    prompt: "What secure protocol displays a padlock icon in your web browser address bar? (5-letter acronym)",
    ans: "https",
    alt: ["https", "ssl"],
    label: "HTTPS",
    hint: "Encrypted web communications protocol: https (do NOT use quotes)."
  },
  {
    prompt: "What global network of interconnected computers connects the whole world? (8-letter word)",
    ans: "internet",
    alt: ["internet", "web"],
    label: "Internet",
    hint: "The vast global telecommunications system: internet (do NOT use quotes)."
  },
  {
    prompt: "What device in your home routes Wi-Fi signals to your smartphone and laptop? (6-letter word)",
    ans: "router",
    alt: ["router", "modem"],
    label: "Router",
    hint: "Networking appliance routing packets: router (do NOT use quotes)."
  },
  {
    prompt: "What open-source Google mobile operating system powers billions of smartphones? (7-letter word)",
    ans: "android",
    alt: ["android"],
    label: "Android",
    hint: "Google's open-source mobile OS: android (do NOT use quotes)."
  },
  {
    prompt: "What wireless technology connects your smartphone to earbuds or speakers? (9-letter word)",
    ans: "bluetooth",
    alt: ["bluetooth"],
    label: "Bluetooth",
    hint: "Named after tenth-century King Harald Gormsson: bluetooth (do NOT use quotes)."
  },
  {
    prompt: "What 2-letter abbreviation represents Artificial Intelligence systems? (2 letters)",
    ans: "ai",
    alt: ["ai"],
    label: "AI",
    hint: "Two-letter acronym for artificial intelligence: ai (do NOT use quotes)."
  },
  {
    prompt: "What 3-letter satellite navigation system pinpoints your phone's geographic location? (3 letters)",
    ans: "gps",
    alt: ["gps"],
    label: "GPS",
    hint: "Global Positioning System: gps (do NOT use quotes)."
  },
  {
    prompt: "What video cable standard connects your console, laptop, or monitor for HD video? (4-letter acronym)",
    ans: "hdmi",
    alt: ["hdmi"],
    label: "HDMI",
    hint: "High-Definition Multimedia Interface: hdmi (do NOT use quotes)."
  },
  {
    prompt: "What fast solid-state drive replaced mechanical spinning hard drives in modern laptops? (3 letters)",
    ans: "ssd",
    alt: ["ssd"],
    label: "SSD",
    hint: "Solid-State Drive high-speed storage: ssd (do NOT use quotes)."
  },
  {
    prompt: "What universal cable standard charges modern iPhones, Androids, and laptops? (3 letters)",
    ans: "usb",
    alt: ["usb", "usbc"],
    label: "USB",
    hint: "Universal Serial Bus: usb or usbc (do NOT use quotes)."
  },
  {
    prompt: "What small text file does a website save in your browser to remember your login? (6-letter word)",
    ans: "cookie",
    alt: ["cookie", "cookies"],
    label: "HTTP Cookie",
    hint: "Small HTTP browser state tracking file: cookie (do NOT use quotes)."
  },
  {
    prompt: "What vibrant display screen technology illuminates each individual pixel without a backlight? (4 letters)",
    ans: "oled",
    alt: ["oled", "amoled"],
    label: "OLED Screen",
    hint: "Organic Light Emitting Diode: oled (do NOT use quotes)."
  }
];

/* ─── Binary Options (Rule 9) ─── */
export const BINARY_OPTIONS = [
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
  { dec: 17, bin: "10001" },
  { dec: 18, bin: "10010" },
  { dec: 20, bin: "10100" },
];

/* ─── Roman Numeral Options (Rule 17) ─── */
export const ROMAN_OPTIONS = [
  { num: 4, roman: "IV" },
  { num: 6, roman: "VI" },
  { num: 7, roman: "VII" },
  { num: 8, roman: "VIII" },
  { num: 9, roman: "IX" },
  { num: 11, roman: "XI" },
  { num: 12, roman: "XII" },
  { num: 14, roman: "XIV" },
  { num: 15, roman: "XV" },
  { num: 16, roman: "XVI" },
  { num: 19, roman: "XIX" },
  { num: 20, roman: "XX" },
  { num: 21, roman: "XXI" },
];

/* ─── ROT13 Options (Rule 24) ─── */
export const ROT13_OPTIONS = [
  { plain: "vault", encoded: "inhyg" },
  { plain: "bank", encoded: "onax" },
  { plain: "heist", encoded: "urvfg" },
  { plain: "cash", encoded: "pnfu" },
  { plain: "safe", encoded: "fnsr" },
  { plain: "gold", encoded: "tbyq" },
  { plain: "lock", encoded: "yvpx" },
  { plain: "code", encoded: "pbqr" },
  { plain: "hack", encoded: "unpx" },
  { plain: "cyber", encoded: "plore" },
  { plain: "data", encoded: "qngn" },
  { plain: "byte", encoded: "olgr" },
];

/* ─── Caesar Shift Options (Rule 25) ─── */
export const CAESAR_OPTIONS = [
  { word: "miami", shift: 3, cipher: "pldpl" },
  { word: "ocean", shift: 2, cipher: "qegcp" },
  { word: "guard", shift: 4, cipher: "kyevh" },
  { word: "alarm", shift: 3, cipher: "dodus" },
  { word: "beach", shift: 1, cipher: "cfbdi" },
  { word: "vice", shift: 4, cipher: "zmgv" },
  { word: "laser", shift: 2, cipher: "ncugt" },
  { word: "corrupt", shift: 3, cipher: "fruuxsw" },
  { word: "cyber", shift: 2, cipher: "eadgt" },
];

/* ─── SHA-256 Phrases (Rule 44) ─── */
export const SHA_PHRASES = [
  { phrase: "vice", short: "030f" },
  { phrase: "heist", short: "f1d2" },
  { phrase: "vault", short: "cb83" },
  { phrase: "gordon", short: "e34a" },
  { phrase: "bennett", short: "8682" },
  { phrase: "tommy", short: "117d" },
  { phrase: "malibu", short: "542b" },
  { phrase: "vercetti", short: "7cbb" },
  { phrase: "ocean", short: "6d6b" },
];

/* ─── Systems Architecture Riddles (Rule 32) ─── */
export const SYS_TECH_RIDDLES = [
  {
    clue: "What 7-letter network security system monitors and filters incoming and outgoing network traffic based on security rules?",
    word: "firewall",
    name: "Network Firewall",
    hint: "Security barrier between networks: firewall (do NOT use quotes).",
  },
  {
    clue: "What 6-letter OS program converts human-readable source code into machine code or bytecode?",
    word: "compiler",
    name: "Source Compiler",
    hint: "Program translating source code to executable: compiler (do NOT use quotes).",
  },
  {
    clue: "What 6-letter temporary physical memory region holds data while it is being moved between devices or processes?",
    word: "buffer",
    name: "Memory Buffer",
    hint: "Temporary chunk of RAM: buffer (do NOT use quotes).",
  },
  {
    clue: "What 6-letter core software program directly manages CPU, RAM, and hardware devices at Ring 0?",
    word: "kernel",
    name: "Operating System Kernel",
    hint: "Central core of an OS: kernel (do NOT use quotes).",
  },
  {
    clue: "What high-speed volatile memory built directly inside or adjacent to the CPU provides rapid data access?",
    word: "cache",
    name: "CPU Cache",
    hint: "Fast CPU memory: cache (do NOT use quotes).",
  },
];

/* ─── SQL Keyword Options (Rule 31) ─── */
export const SQL_KEYWORD_OPTIONS = [
  { word: "SELECT", desc: "Retrieve data records from database table" },
  { word: "UPDATE", desc: "Modify existing column values in a database" },
  { word: "INSERT", desc: "Add new tuple row into database" },
  { word: "DELETE", desc: "Remove rows matching query condition" },
  { word: "CREATE", desc: "Instantiate schema table or view" },
  { word: "JOIN", desc: "Combine rows from two relational tables" },
  { word: "WHERE", desc: "Filter relational rows by logical predicate" },
  { word: "GROUP", desc: "Aggregate rows sharing attributes" },
];

/* ─── IANA Network Ports (Rule 43) ─── */
export const NET_PORT_OPTIONS = [
  { port: 80, name: "HTTP Unencrypted Web", proto: "HTTP" },
  { port: 443, name: "HTTPS Encrypted SSL Web", proto: "HTTPS" },
  { port: 22, name: "SSH Secure Shell Terminal", proto: "SSH" },
  { port: 21, name: "FTP File Transfer Protocol", proto: "FTP" },
  { port: 53, name: "DNS Domain Name System", proto: "DNS" },
  { port: 3306, name: "MySQL Relational Database", proto: "MySQL" },
  { port: 5432, name: "PostgreSQL Database Engine", proto: "PostgreSQL" },
  { port: 8080, name: "HTTP Alternate Proxy/Dev", proto: "HTTP-Alt" },
];

/* ─── CS Pioneers (Rule 52) ─── */
export const CS_PIONEERS = [
  { name: "Alan Turing", code: "turing", clue: "Father of theoretical computer science and AI who cracked the Enigma cipher" },
  { name: "Ada Lovelace", code: "lovelace", clue: "World's first computer programmer who published algorithms for the Analytical Engine" },
  { name: "Grace Hopper", code: "hopper", clue: "Naval computing pioneer who invented the compiler and popularized the term debugging" },
  { name: "Claude Shannon", code: "shannon", clue: "Father of Information Theory who proved boolean algebra could implement electrical switches" },
  { name: "Edsger Dijkstra", code: "dijkstra", clue: "Pioneer who developed shortest-path graph algorithm and structured programming" },
  { name: "Donald Knuth", code: "knuth", clue: "Author of The Art of Computer Programming and creator of TeX" },
  { name: "Dennis Ritchie", code: "ritchie", clue: "Creator of the C programming language and co-developer of Unix" },
  { name: "Tim Berners-Lee", code: "lee", clue: "Inventor of the World Wide Web, HTML, and HTTP protocols" },
];

/* ─── Color Swatch Calibration (Rule 49) ─── */
export const SWATCH_OPTIONS = [
  { hex: "#FEE", css: "#ffeeee", name: "Vice Rose" },
  { hex: "#EFE", css: "#eeffee", name: "Palm Mint" },
  { hex: "#EEF", css: "#eeeeff", name: "Ocean Mist" },
  { hex: "#FED", css: "#ffeedd", name: "Sunset Gold" },
  { hex: "#DEF", css: "#ddeeff", name: "Neon Cyan" },
  { hex: "#BEE", css: "#bbeeee", name: "Cyber Aqua" },
  { hex: "#CAB", css: "#ccaabb", name: "Sunset Mauve" },
  { hex: "#FAD", css: "#ffaadd", name: "Synth Magenta" },
  { hex: "#CAF", css: "#ccaaff", name: "Electric Lavender" },
  { hex: "#BAD", css: "#bbaadd", name: "Vercetti Violet" },
];

/* ─── CS Fundamentals (Rule 33) ─── */
export const CS_FUNDAMENTALS = [
  { clue: "The smallest atomic unit of digital data in computer science, storing binary 0 or 1. What 3-letter term am I?", word: "bit", name: "Digital Bit" },
  { clue: "Composed of 8 continuous bits, I represent a single character in ASCII. What 4-letter unit am I?", word: "byte", name: "Data Byte" },
  { clue: "A linear data structure following Last-In First-Out (LIFO) where items push and pop from the top. What 5-letter term am I?", word: "stack", name: "LIFO Stack" },
  { clue: "A linear data structure following First-In First-Out (FIFO) where elements join the rear and leave the front. What 5-letter term am I?", word: "queue", name: "FIFO Queue" },
  { clue: "An unhandled flaw or error in source code causing unintended program behavior. What 3-letter term am I?", word: "bug", name: "Software Bug" },
  { clue: "A contiguous collection of elements of the same data type stored sequentially in memory. What 5-letter data structure am I?", word: "array", name: "Array" },
  { clue: "A non-linear hierarchical data structure consisting of nodes connected by edges, starting from a root. What 4-letter term am I?", word: "tree", name: "Tree Structure" },
];

/* ─── Persistent Non-Repeating Pool Picker ─── */
export function pickNonRepeating(category, pool, keyFn) {
  if (!pool || pool.length === 0) return null;
  let usedKeys = [];
  try {
    const raw = sessionStorage.getItem("vch_recent_pool_" + category);
    if (raw) usedKeys = JSON.parse(raw);
  } catch (_) {}

  let available = pool.filter((item) => !usedKeys.includes(keyFn(item)));
  if (available.length === 0) {
    usedKeys = [];
    available = [...pool];
  }

  const picked = available[Math.floor(Math.random() * available.length)];
  const pickedKey = keyFn(picked);

  const maxHistory = Math.max(1, pool.length - 1);
  const updatedKeys = [...usedKeys.filter((k) => k !== pickedKey), pickedKey].slice(-maxHistory);
  try {
    sessionStorage.setItem("vch_recent_pool_" + category, JSON.stringify(updatedKeys));
  } catch (_) {}

  return picked;
}

/* ─── Broadcast Channel & Local Storage Synchronizer ─── */
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
    chatgpt: pickNonRepeating("chatgpt", CHATGPT_OPTIONS, (c) => c.model),
    tesla: pickNonRepeating("tesla", TESLA_OPTIONS, (t) => t.model),
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

/* ─── Build Full 59-Rule Security Suite with 5-Tier Gradual Difficulty ─── */
export function buildAll59Rules(session = {}, cfg = CAMPAIGN_LEVELS[1]) {
  const safeSession = session && typeof session === "object" ? session : {};

  const codeSnippet =
    CODE_SNIPPET_PUZZLES.find((c) => c.id === (safeSession.codeSnippet?.id || safeSession.codeSnippet)) ||
    CODE_SNIPPET_PUZZLES[0];

  const binaryTarget =
    BINARY_OPTIONS.find((b) => b.dec === Number(safeSession.binaryTarget?.dec || safeSession.binaryTarget)) ||
    BINARY_OPTIONS[0];

  const romanTarget =
    ROMAN_OPTIONS.find((r) => r.num === Number(safeSession.romanTarget?.num || safeSession.romanTarget)) ||
    ROMAN_OPTIONS[0];

  const chatgpt =
    CHATGPT_OPTIONS.find((c) => c.model === (safeSession.chatgpt?.model || safeSession.chatgpt)) ||
    CHATGPT_OPTIONS[0];

  const tesla =
    TESLA_OPTIONS.find((t) => t.model === (safeSession.tesla?.model || safeSession.tesla)) ||
    TESLA_OPTIONS[0];

  const techCommon =
    TECH_COMMON_RIDDLES.find((t) => t.ans === (safeSession.techCommon?.ans || safeSession.techCommon)) ||
    TECH_COMMON_RIDDLES[0];

  const rot13 =
    ROT13_OPTIONS.find((r) => r.plain === (safeSession.rot13?.plain || safeSession.rot13)) ||
    ROT13_OPTIONS[0];

  const caesar =
    CAESAR_OPTIONS.find((c) => c.word === (safeSession.caesar?.word || safeSession.caesar)) ||
    CAESAR_OPTIONS[0];

  const captcha = typeof safeSession.captcha === "string" && safeSession.captcha.length >= 4 ? safeSession.captcha : "VD79K";

  const sqlKeyword =
    SQL_KEYWORD_OPTIONS.find((s) => s.word === (safeSession.sqlKeyword?.word || safeSession.sqlKeyword)) ||
    SQL_KEYWORD_OPTIONS[0];

  const sysTech =
    SYS_TECH_RIDDLES.find((s) => s.word === (safeSession.sysTech?.word || safeSession.sysTech)) ||
    SYS_TECH_RIDDLES[0];

  const csFundamental =
    CS_FUNDAMENTALS.find((s) => s.word === (safeSession.csFundamental?.word || safeSession.csFundamental)) ||
    CS_FUNDAMENTALS[0];

  const netPort =
    NET_PORT_OPTIONS.find((n) => n.port === Number(safeSession.netPort?.port || safeSession.netPort)) ||
    NET_PORT_OPTIONS[0];

  const shaPhrase =
    SHA_PHRASES.find((s) => s.phrase === (safeSession.shaPhrase?.phrase || safeSession.shaPhrase)) ||
    SHA_PHRASES[0];

  const swatch =
    SWATCH_OPTIONS.find((s) => s.hex === (safeSession.swatch?.hex || safeSession.swatch)) ||
    SWATCH_OPTIONS[0];

  const csPioneer =
    CS_PIONEERS.find((c) => c.code === (safeSession.csPioneer?.code || safeSession.csPioneer)) ||
    CS_PIONEERS[0];

  return [
    /* ════ LEVEL 1: TELLERS GATE (Rules 1 - 10) [10 Rules] ════
       Difficulty Curve: Tier 1 (Recruit: Q1-4) -> Tier 2 (Operator: Q5-8) -> Tier 3 (Specialist: Q9-10)
    */
    {
      id: 1,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Length Requirement",
      difficulty: 1,
      difficultyStars: "★☆☆☆☆",
      difficultyTier: "TIER 1 · RECRUIT",
      difficultyColor: "#00E676",
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
      difficulty: 1,
      difficultyStars: "★☆☆☆☆",
      difficultyTier: "TIER 1 · RECRUIT",
      difficultyColor: "#00E676",
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
      difficulty: 1,
      difficultyStars: "★☆☆☆☆",
      difficultyTier: "TIER 1 · RECRUIT",
      difficultyColor: "#00E676",
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
      category: "Numeric Requirement",
      difficulty: 1,
      difficultyStars: "★☆☆☆☆",
      difficultyTier: "TIER 1 · RECRUIT",
      difficultyColor: "#00E676",
      text: "Include at least one numeric digit (0-9)",
      badge: (pw) => (/\d/.test(pw) ? "Digit ✓" : "Digit ?"),
      hint: "Include at least one numeric digit (0-9).",
      check: (pw) => /\d/.test(pw),
      headline: "NUMERIC PRESSURE!",
      managerSpeech: "The tumbler lock requires numerical pressure—insert at least one vault digit from 0 to 9!",
      expectedAnswer: "Any digit 0-9",
    },
    {
      id: 5,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Loop Construct",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      isRiddle: true,
      text: '🔁 LOOP CONSTRUCT: "What standard keyword is used to create a loop in C, C++, or Java?" (3-letter word, e.g. "for" or "while")',
      badge: (pw) => (/(for|while)/i.test(pw.replace(/["']/g, "")) ? "Loop KW ✓" : "Loop KW ?"),
      hint: 'Standard loop iteration keyword: "for" or "while" (type directly, no quotes).',
      check: (pw) => /(for|while)/i.test(pw.replace(/["']/g, "")),
      headline: "LOOP CONSTRUCT KEYWORD!",
      managerSpeech: "Programming fundamentals check! What keyword is used to execute a loop in C, C++, or Java? Enter for or while!",
      expectedAnswer: "for (or while)",
    },
    {
      id: 6,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Conditional Branch",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      isRiddle: true,
      text: '🔀 CONDITIONAL BRANCH: "What fundamental 2-letter keyword is used for conditional branching in C, Python, or Java?"',
      badge: (pw) => (/if/i.test(pw.replace(/["']/g, "")) ? "if ✓" : "Condition KW ?"),
      hint: 'Fundamental conditional statement keyword: "if" (type directly, no quotes).',
      check: (pw) => /if/i.test(pw.replace(/["']/g, "")),
      headline: "CONDITIONAL STATEMENT KEYWORD!",
      managerSpeech: "Decision tree checkpoint! What 2-letter keyword tests a condition? Enter if!",
      expectedAnswer: "if",
    },
    {
      id: 7,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Special Symbol",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      text: "Include at least one special character (!@#$%^&*)",
      badge: (pw) => (/[^a-zA-Z0-9\s]/.test(pw) ? "Special ✓" : "Special ?"),
      hint: "Include at least one special character (!@#$%^&*).",
      check: (pw) => /[^a-zA-Z0-9\s]/.test(pw),
      headline: "ENCRYPT SECURITY SIGNAL!",
      managerSpeech: "Our security transmission needs noise shielding! Inject at least one special symbol into the cipher!",
      expectedAnswer: "Any symbol !@#$%^&*",
    },
    {
      id: 8,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Whitespace Quarantine",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      text: "Quarantine protocol: Master key must not contain any whitespace characters",
      badge: (pw) => (!/\s/.test(pw) ? "No Spaces ✓" : "Space Detected!"),
      hint: "Remove all space characters from the password.",
      check: (pw) => !/\s/.test(pw),
      headline: "REMOVE ALL WHITESPACE!",
      managerSpeech: "Spaces leak buffer memory! Strip every single space character from the password!",
      expectedAnswer: "Zero whitespace characters",
    },
    {
      id: 9,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Binary Conversion",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
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
      id: 10,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: "Code Fill-in-the-Blank",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
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

    /* ════ LEVEL 2: EXECUTIVE CASH CORRIDORS (Rules 11 - 23) [13 Rules] ════
       Difficulty Curve: Tier 2 (Operator: Q11-16) -> Tier 3 (Specialist: Q17-23)
    */
    {
      id: 11,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Sensational AI",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      isRiddle: true,
      poolCategory: "chatgpt",
      text: `🤖 SENSATIONAL AI: ${chatgpt.prompt}`,
      badge: (pw) => {
        const passed = (chatgpt.alt || [chatgpt.model]).some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
        return passed ? `${chatgpt.name} ✓` : "ChatGPT Model ?";
      },
      hint: `${chatgpt.hint}`,
      check: (pw) => (chatgpt.alt || [chatgpt.model]).some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))),
      headline: "CHATGPT GENERATIVE AI MODEL!",
      managerSpeech: `OpenAI intelligence test! ${chatgpt.prompt}`,
      expectedAnswer: chatgpt.model,
    },
    {
      id: 12,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Sensational Tech",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      isRiddle: true,
      poolCategory: "tesla",
      text: `⚡ SENSATIONAL TECH: ${tesla.prompt}`,
      badge: (pw) => {
        const passed = (tesla.alt || [tesla.model]).some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
        return passed ? `${tesla.name} ✓` : "Tesla Tech ?";
      },
      hint: `${tesla.hint}`,
      check: (pw) => (tesla.alt || [tesla.model]).some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))),
      headline: "TESLA HIGH-TECH INNOVATION!",
      managerSpeech: `Automotive engineering question! ${tesla.prompt}`,
      expectedAnswer: tesla.model,
    },
    {
      id: 13,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Tech Trivia",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
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
      id: 14,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Web Markup",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      text: "Include a valid HTML tag (e.g. <div>, <span>, <p>, <h1>)",
      badge: (pw) => (/<s*(?:div|p|span|h[1-6]|a|b|i|u|button|input|form|table|tr|td|th|ul|ol|li|img|head|body|html|main|nav|header|footer|section|article|code|pre)[^>]*>/i.test(pw.replace(/["']/g, "")) || /<[a-zA-Z][a-zA-Z0-9]*>/i.test(pw.replace(/["']/g, "")) ? "HTML Tag ✓" : "HTML Tag ?"),
      hint: "Enclose a standard HTML markup element between angle brackets (e.g. <div>, <p>, <span>). Do NOT use quotes.",
      check: (pw) => /<s*(?:div|p|span|h[1-6]|a|b|i|u|button|input|form|table|tr|td|th|ul|ol|li|img|head|body|html|main|nav|header|footer|section|article|code|pre)[^>]*>/i.test(pw.replace(/["']/g, "")) || /<[a-zA-Z][a-zA-Z0-9]*>/i.test(pw.replace(/["']/g, "")),
      headline: "HTML MARKUP TAG!",
      managerSpeech: "Structure the document DOM! Enclose a standard HTML markup tag between angle brackets!",
      expectedAnswer: "<div>, <p>, <span>, etc.",
    },
    {
      id: 15,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Language Keywords",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      text: "Include a reserved Python keyword (def, return, import, class, etc.)",
      badge: (pw) => (/(def|return|import|lambda|class|yield|async|await|while|elif|from|with|raise|except|finally|assert|break|continue|global|nonlocal)/i.test(pw.replace(/["']/g, "")) ? "Python KW ✓" : "Python KW ?"),
      hint: "Include a reserved Python language keyword (e.g. for functions, loops, or imports). Do NOT use quotes.",
      check: (pw) => /(def|return|import|lambda|class|yield|async|await|while|elif|from|with|raise|except|finally|assert|break|continue|global|nonlocal)/i.test(pw.replace(/["']/g, "")),
      headline: "PYTHON KEYWORD INJECTION!",
      managerSpeech: "Authenticate backend scripts! Inject a reserved Python language keyword!",
      expectedAnswer: "def, return, import, class, etc.",
    },
    {
      id: 16,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Encapsulation",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
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
      category: "Roman Numerals",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
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
      id: 18,
      level: 2,
      section: "Executive Cash Corridors",
      category: "File Extension",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a valid programming file extension (.js, .py, .ts, etc.)",
      badge: (pw) => (/\.(js|py|html|css|ts|json|cpp|java|sh|jsx|tsx|php|rb|go|rs|sql|md)/i.test(pw.replace(/["']/g, "")) ? "File Ext ✓" : "Extension ?"),
      hint: "Include a standard code file extension preceded by a dot (e.g. .js, .py, .ts). Do NOT use quotes.",
      check: (pw) => /\.(js|py|html|css|ts|json|cpp|java|sh|jsx|tsx|php|rb|go|rs|sql|md)/i.test(pw.replace(/["']/g, "")),
      headline: "FILE EXTENSION SPECIFICATION!",
      managerSpeech: "The security program needs to register its script extension! Include a valid programming file extension with its dot!",
      expectedAnswer: ".js, .py, .ts, etc.",
    },
    {
      id: 19,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Version Control",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a Git command (commit, push, pull, branch, merge, etc.)",
      badge: (pw) => (/(commit|push|pull|checkout|branch|clone|status|merge|rebase|fetch|stash|reset|diff)/i.test(pw.replace(/["']/g, "")) ? "Git Cmd ✓" : "Git Cmd ?"),
      hint: "Include a command used in Git version control (e.g. for repository branching, commits, or remotes). Do NOT use quotes.",
      check: (pw) => /(commit|push|pull|checkout|branch|clone|status|merge|rebase|fetch|stash|reset|diff)/i.test(pw.replace(/["']/g, "")),
      headline: "VERSION CONTROL COMMAND!",
      managerSpeech: "Version control sync! Include a primary Git workflow command!",
      expectedAnswer: "commit, push, pull, branch, etc.",
    },
    {
      id: 20,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Networking IP",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a valid IPv4 address (e.g. 192.168.1.1 or 10.0.0.1)",
      badge: (pw) => (/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(pw.replace(/["']/g, "")) ? "IPv4 ✓" : "IPv4 ?"),
      hint: "Include a 4-octet IPv4 numerical address with octets 0-255 separated by dots. Do NOT use quotes.",
      check: (pw) => /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(pw.replace(/["']/g, "")),
      headline: "IPV4 ADDRESS ROUTING!",
      managerSpeech: "Network interface configuration! Route packets with a 4-octet IPv4 numerical address!",
      expectedAnswer: "192.168.1.1, 10.0.0.1, etc.",
    },
    {
      id: 21,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Hardware Address",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a valid MAC address format (e.g. 01:23:45:67:89:AB)",
      badge: (pw) => (/(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/.test(pw.replace(/["']/g, "")) ? "MAC ✓" : "MAC Format ?"),
      hint: "Include 6 pairs of hex digits separated by colons or hyphens, e.g. 01:23:45:67:89:AB (do NOT use quotes).",
      check: (pw) => /(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/.test(pw.replace(/["']/g, "")),
      headline: "PHYSICAL MAC ADDRESS!",
      managerSpeech: "Hardware NIC layer verification! Include a standard MAC address format like 01:23:45:67:89:AB!",
      expectedAnswer: "01:23:45:67:89:AB",
    },
    {
      id: 22,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Tumbler Arithmetic",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: `Tumbler arithmetic: Numeric digits must sum up to at least ${cfg.digitSumTarget}`,
      badge: (pw) => `Sum: ${getDigitSum(pw)}/${cfg.digitSumTarget}`,
      hint: (pw) => `Current digit sum is ${getDigitSum(pw)}. Must be at least ${cfg.digitSumTarget}.`,
      check: (pw) => getDigitSum(pw) >= cfg.digitSumTarget,
      headline: "ARITHMETIC PRESSURE!",
      managerSpeech: (pw, cfg) => `The mechanical tumbler requires numerical pressure! The numbers in your password must sum up to at least ${cfg.digitSumTarget}! Current sum: ${getDigitSum(pw)}!`,
      expectedAnswer: `>= ${cfg.digitSumTarget}`,
    },
    {
      id: 23,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Parallel GPU Tech",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      text: '⚡ NVIDIA PARALLEL COMPUTING: "What 4-letter proprietary parallel computing platform developed by Nvidia powers modern AI GPU training?"',
      badge: (pw) => (/cuda/i.test(pw.replace(/["']/g, "")) ? "CUDA ✓" : "GPU Platform ?"),
      hint: 'Nvidia parallel computing architecture: "cuda" (type directly, no quotes).',
      check: (pw) => /cuda/i.test(pw.replace(/["']/g, "")),
      headline: "NVIDIA CUDA ARCHITECTURE!",
      managerSpeech: "Hardware acceleration protocol! What 4-letter Nvidia parallel platform runs neural network training? Enter cuda!",
      expectedAnswer: "cuda",
    },

    /* ════ LEVEL 3: TITANIUM DEEP VAULT (Rules 24 - 39) [16 Rules] ════
       Difficulty Curve: Tier 3 (Specialist: Q24-34) -> Tier 4 (Expert: Q35-39)
    */
    {
      id: 24,
      level: 3,
      section: "Titanium Deep Vault",
      category: "ROT13 Cipher",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
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
      id: 25,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Caesar Cipher",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
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
      id: 26,
      level: 3,
      section: "Titanium Deep Vault",
      category: "JSON Formatting",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a valid JSON key-value pair string (e.g. {code:101} or {vault:1})",
      badge: (pw) => (/\{[^{}]*:[^{}]*\}/.test(pw.replace(/["']/g, "")) || /["'][a-zA-Z0-9_]+["']\s*:\s*["'][a-zA-Z0-9_]+["']/.test(pw) ? "JSON OK ✓" : "JSON KV ?"),
      hint: "Include key-value format inside braces like {vault:1} or {code:101} (type directly, do NOT use quotes).",
      check: (pw) => /\{[^{}]*:[^{}]*\}/.test(pw.replace(/["']/g, "")) || /["'][a-zA-Z0-9_]+["']\s*:\s*["'][a-zA-Z0-9_]+["']/.test(pw),
      headline: "JSON DATA PROTOCOL!",
      managerSpeech: "Payload serialization! Format a valid JSON key-value pair inside curly braces like {code:101}!",
      expectedAnswer: "{code:101}, {vault:1}, etc.",
    },
    {
      id: 27,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Clearance Token",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      text: `Security CAPTCHA verification: Include verification token (${captcha})`,
      badge: (pw) => (pw.includes(captcha) ? `${captcha} ✓` : "CAPTCHA ?"),
      hint: `Security clearance token is ${captcha} (case-sensitive, type directly, no quotes).`,
      check: (pw) => pw.includes(captcha),
      headline: "CLEARANCE CAPTCHA!",
      managerSpeech: `Security verification challenge! Type the 5-character token ${captcha} into your cipher!`,
      expectedAnswer: captcha,
    },
    {
      id: 28,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Encapsulation",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Security containment: Enclose any token inside curly brackets: { ... }",
      badge: (pw) => (/\{[a-zA-Z0-9_\-!:]+\}/.test(pw.replace(/["']/g, "")) ? "{OK} ✓" : "{ ... } ?"),
      hint: "Wrap any word or token in curly braces like {code} or {token} (type directly, no quotes).",
      check: (pw) => /\{[a-zA-Z0-9_\-!:]+\}/.test(pw.replace(/["']/g, "")),
      headline: "CURLY BRACE ENCAPSULATION!",
      managerSpeech: "Cryptographic closure! Enclose any token inside curly braces like {code}!",
      expectedAnswer: "{code}, {token}, etc.",
    },
    {
      id: 29,
      level: 3,
      section: "Titanium Deep Vault",
      category: "SQL Clauses",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a standard SQL clause (SELECT, FROM, WHERE, GROUP BY, ORDER BY, etc.)",
      badge: (pw) => (/(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT)/i.test(pw.replace(/["']/g, "")) ? "SQL Clause ✓" : "SQL Clause ?"),
      hint: "Include a core SQL clause keyword (e.g. SELECT, FROM, WHERE). Do NOT use quotes.",
      check: (pw) => /(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT)/i.test(pw.replace(/["']/g, "")),
      headline: "DATABASE SQL QUERY CLAUSE!",
      managerSpeech: "Audit the bank ledger! Inject a standard SQL query clause like SELECT or WHERE!",
      expectedAnswer: "SELECT, WHERE, FROM, etc.",
    },
    {
      id: 30,
      level: 3,
      section: "Titanium Deep Vault",
      category: "HTTP Verbs",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a valid HTTP request method (GET, POST, PUT, DELETE, PATCH)",
      badge: (pw) => (/(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/i.test(pw.replace(/["']/g, "")) ? "HTTP Verb ✓" : "HTTP Verb ?"),
      hint: "Include a primary REST HTTP method in uppercase or lowercase (e.g. GET, POST, PUT). Do NOT use quotes.",
      check: (pw) => /(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/i.test(pw.replace(/["']/g, "")),
      headline: "HTTP REST API VERB!",
      managerSpeech: "Transmit the API payload! Inject a valid HTTP request verb like GET, POST, or PUT!",
      expectedAnswer: "GET, POST, PUT, etc.",
    },
    {
      id: 31,
      level: 3,
      section: "Titanium Deep Vault",
      category: "SQL Protocols",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      poolCategory: "sqlKeyword",
      text: `🧩 DATABASE PROTOCOL: Include SQL query instruction (${sqlKeyword.word}) to ${(sqlKeyword.desc || "execute query").toLowerCase()}`,
      badge: (pw) => (new RegExp(sqlKeyword.word, "i").test(pw.replace(/["']/g, "")) ? `${sqlKeyword.word} ✓` : "SQL Cmd ?"),
      hint: `SQL command is ${sqlKeyword.word} (type directly, no quotes).`,
      check: (pw) => new RegExp(sqlKeyword.word, "i").test(pw.replace(/["']/g, "")),
      headline: "SQL COMMAND INJECTION!",
      managerSpeech: `Query the financial accounts! Include the SQL keyword '${sqlKeyword.word}'!`,
      expectedAnswer: sqlKeyword.word,
    },
    {
      id: 32,
      level: 3,
      section: "Titanium Deep Vault",
      category: "System Architecture",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      poolCategory: "sysTech",
      text: `🧩 SYSTEM ARCHITECTURE: ${sysTech.clue}`,
      badge: (pw) => (new RegExp(sysTech.word, "i").test(pw.replace(/["']/g, "")) ? `${sysTech.word} ✓` : "Sys Tech ?"),
      hint: sysTech.hint,
      check: (pw) => new RegExp(sysTech.word, "i").test(pw.replace(/["']/g, "")),
      headline: "SYSTEMS ARCHITECTURE RIDDLE!",
      managerSpeech: `Solve the system architecture puzzle! ${sysTech.clue}`,
      expectedAnswer: sysTech.word,
    },
    {
      id: 33,
      level: 3,
      section: "Titanium Deep Vault",
      category: "CS Fundamentals",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      poolCategory: "csFundamental",
      text: `🧩 CS FUNDAMENTAL: "${csFundamental.clue}"`,
      badge: (pw) => (new RegExp(csFundamental.word, "i").test(pw.replace(/["']/g, "")) ? `${csFundamental.word} ✓` : "CS Unit ?"),
      hint: `The answer is ${csFundamental.word} (type directly, no quotes).`,
      check: (pw) => new RegExp(csFundamental.word, "i").test(pw.replace(/["']/g, "")),
      headline: "CS FUNDAMENTAL RIDDLE!",
      managerSpeech: `Core computer science question! ${csFundamental.clue}`,
      expectedAnswer: csFundamental.word,
    },
    {
      id: 34,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Semantic Versioning",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      text: "Include a valid semantic versioning string (e.g. v1.0.0 or 2.1.3)",
      badge: (pw) => (/(?:v)?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/.test(pw.replace(/["']/g, "")) ? "SemVer ✓" : "SemVer ?"),
      hint: "Include standard semantic versioning like v1.0.0 or 2.4.1 (type directly, no quotes).",
      check: (pw) => /(?:v)?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/.test(pw.replace(/["']/g, "")),
      headline: "SEMANTIC VERSIONING FORMAT!",
      managerSpeech: "Security software release version! Inject a valid semver string like v1.0.0!",
      expectedAnswer: "v1.0.0, 2.1.3, etc.",
    },
    {
      id: 35,
      level: 3,
      section: "Titanium Deep Vault",
      category: "AI Code Assistant",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      text: '🤖 AI DEVELOPER TOOLS: "What famous AI pair programmer created by GitHub assists millions of developers writing code?" (7-letter word)',
      badge: (pw) => (/copilot/i.test(pw.replace(/["']/g, "")) ? "Copilot ✓" : "AI Tool ?"),
      hint: 'GitHub\'s AI pair programmer: "copilot" (type directly, no quotes).',
      check: (pw) => /copilot/i.test(pw.replace(/["']/g, "")),
      headline: "GITHUB COPILOT AI ASSISTANT!",
      managerSpeech: "Next-gen code intelligence! What 7-letter AI assistant developed by GitHub autocompletes code? Enter copilot!",
      expectedAnswer: "copilot",
    },
    {
      id: 36,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Open Source Creator",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      text: '🐧 OPEN SOURCE PIONEER: "What is the last name of the Finnish computer engineer who created the open-source Linux kernel and Git?"',
      badge: (pw) => (/(torvalds|linus)/i.test(pw.replace(/["']/g, "")) ? "Torvalds ✓" : "Linux Creator ?"),
      hint: 'Creator of Linux & Git: "torvalds" or "linus" (type directly, no quotes).',
      check: (pw) => /(torvalds|linus)/i.test(pw.replace(/["']/g, "")),
      headline: "LINUS TORVALDS IDENTIFICATION!",
      managerSpeech: "Open-source foundation check! Who created Linux and Git? Enter torvalds (no quotes)!",
      expectedAnswer: "torvalds",
    },
    {
      id: 37,
      level: 3,
      section: "Titanium Deep Vault",
      category: "ISO Timestamp",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      text: "Include a valid timestamp in ISO 8601 calendar format (e.g. 2026-10-18)",
      badge: (pw) => (/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:Z|[+-]\d{2}:?\d{2})?)?/.test(pw.replace(/["']/g, "")) ? "ISO 8601 ✓" : "ISO Date ?"),
      hint: "Include an ISO 8601 date, e.g. 2026-10-18 or 2026-10-18T12:00:00Z (type directly, no quotes).",
      check: (pw) => /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:Z|[+-]\d{2}:?\d{2})?)?/.test(pw.replace(/["']/g, "")),
      headline: "ISO 8601 TIMESTAMP!",
      managerSpeech: "Temporal synchronization! Log the transaction with an ISO 8601 timestamp like 2026-10-18!",
      expectedAnswer: "YYYY-MM-DD (e.g. 2026-10-18)",
    },
    {
      id: 38,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Algorithms",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '🧩 ALGORITHMS: "What 9-letter algorithmic technique solves subproblems by having a function call ITSELF until reaching a base condition?"',
      badge: (pw) => (/recursion/i.test(pw.replace(/["']/g, "")) ? "recursion ✓" : "Algorithm ?"),
      hint: "Function calling itself: recursion (type directly, no quotes).",
      check: (pw) => /recursion/i.test(pw.replace(/["']/g, "")),
      headline: "RECURSION ALGORITHM RIDDLE!",
      managerSpeech: "Algorithmic thinking! What fundamental technique solves problems by having a function call itself? Enter recursion (no quotes)!",
      expectedAnswer: "recursion",
    },
    {
      id: 39,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Digital Gates",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '🧩 DIGITAL LOGIC: "I am the universal boolean logic gate that outputs 0 ONLY when both inputs are 1. What 4-letter gate am I?"',
      badge: (pw) => (/NAND/i.test(pw.replace(/["']/g, "")) ? "NAND ✓" : "Logic Gate ?"),
      hint: 'Universal logic gate: "NAND" (type directly, no quotes).',
      check: (pw) => /NAND/i.test(pw.replace(/["']/g, "")),
      headline: "UNIVERSAL GATE RIDDLE!",
      managerSpeech: "Universal digital circuits! What gate produces 0 only on two 1s? Enter NAND (no quotes)!",
      expectedAnswer: "NAND",
    },

    /* ════ LEVEL 4: OMEGA QUANTUM CORE (Rules 40 - 59) [20 Rules] ════
       Difficulty Curve: Tier 4 (Expert: Q40-56) -> Tier 5 (Master Cyber: Q57-59)
    */
    {
      id: 40,
      level: 4,
      section: "Omega Quantum Core",
      category: "Environment Variables",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      text: "Include an uppercase environment variable declaration pattern (e.g. PORT=5173 or API_KEY=secret)",
      badge: (pw) => (/[A-Z_]{3,}=[a-zA-Z0-9_\-]+/.test(pw.replace(/["']/g, "")) ? "ENV=VAR ✓" : "ENV Pattern ?"),
      hint: "Include an environment variable assignment like PORT=5173 or KEY=vault (type directly, no quotes).",
      check: (pw) => /[A-Z_]{3,}=[a-zA-Z0-9_\-]+/.test(pw.replace(/["']/g, "")),
      headline: "ENVIRONMENT VARIABLE SPECIFICATION!",
      managerSpeech: "Subsystem environment configuration! Include an uppercase environment variable declaration like PORT=5173!",
      expectedAnswer: "PORT=5173, KEY=secret, etc.",
    },
    {
      id: 41,
      level: 4,
      section: "Omega Quantum Core",
      category: "Arrow Functions",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      text: "Include ES6 arrow function syntax (e.g. () => or (x) => or e =>)",
      badge: (pw) => (/(?:\([a-zA-Z0-9_,\s]*\)|[a-zA-Z_][a-zA-Z0-9_]*)\s*=>/.test(pw.replace(/["']/g, "")) ? "() => ✓" : "Arrow Syntax ?"),
      hint: "Include JavaScript ES6 arrow function syntax like () => or (x) => (type directly, no quotes).",
      check: (pw) => /(?:\([a-zA-Z0-9_,\s]*\)|[a-zA-Z_][a-zA-Z0-9_]*)\s*=>/.test(pw.replace(/["']/g, "")),
      headline: "ES6 ARROW FUNCTION SYNTAX!",
      managerSpeech: "Modernize runtime logic! Inject ES6 arrow function notation like () => into your cipher!",
      expectedAnswer: "() =>, (x) =>, etc.",
    },
    {
      id: 42,
      level: 4,
      section: "Omega Quantum Core",
      category: "Parity Balance",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      text: "Master key parity: Total character count must be an EVEN number",
      badge: (pw) => `Len: ${[...pw].length} (${[...pw].length % 2 === 0 ? "EVEN ✓" : "ODD"})`,
      hint: "Add or remove one character so the total length is an even number.",
      check: (pw) => [...pw].length > 0 && [...pw].length % 2 === 0,
      headline: "EVEN PARITY BALANCE!",
      managerSpeech: "Parity mismatch! The total character count across the whole key must be an EVEN number!",
      expectedAnswer: "Even string length",
    },
    {
      id: 43,
      level: 4,
      section: "Omega Quantum Core",
      category: "Network Ports",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      poolCategory: "netPort",
      text: `🧩 NETWORK PORTS: Include the standard IANA port number reserved for ${netPort.proto} (Port ${netPort.port})`,
      badge: (pw) => (pw.replace(/["']/g, "").includes(String(netPort.port)) ? `Port ${netPort.port} ✓` : "Port ?"),
      hint: `Standard IANA port number for ${netPort.proto} is ${netPort.port} (type directly, no quotes).`,
      check: (pw) => pw.replace(/["']/g, "").includes(String(netPort.port)),
      headline: "IANA PORT NUMBER ASSIGNMENT!",
      managerSpeech: `Configure the network firewall! What is the standard port for ${netPort.proto}? Enter ${netPort.port}!`,
      expectedAnswer: String(netPort.port),
    },
    {
      id: 44,
      level: 4,
      section: "Omega Quantum Core",
      category: "Hash Digest",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      poolCategory: "shaPhrase",
      text: `🧩 CRYPTOGRAPHIC DIGEST: Include the first 4 hex characters of SHA-256 for "${shaPhrase.phrase}" (${shaPhrase.short})`,
      badge: (pw) => (new RegExp(shaPhrase.short, "i").test(pw.replace(/["']/g, "")) ? `${shaPhrase.short} ✓` : "SHA-256 ?"),
      hint: `First 4 hex characters of SHA-256('${shaPhrase.phrase}') is ${shaPhrase.short} (type directly, no quotes).`,
      check: (pw) => new RegExp(shaPhrase.short, "i").test(pw.replace(/["']/g, "")),
      headline: "SHA-256 HASH DIGEST PREFIX!",
      managerSpeech: `Cryptographic integrity verification! Type the first 4 hex characters of SHA-256 for '${shaPhrase.phrase}': ${shaPhrase.short}!`,
      expectedAnswer: shaPhrase.short,
    },
    {
      id: 45,
      level: 4,
      section: "Omega Quantum Core",
      category: "Regular Expressions",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      text: "Include a valid regular expression pattern (e.g. ^[0-9]+$ or \\d+ or [a-z]*)",
      badge: (pw) => (/(?:\^[a-zA-Z0-9_\\\[\].+*?^$]+\$|\\[dswDSW][+*?]?|\[[a-zA-Z0-9_\-]+\][+*?]?)/.test(pw.replace(/["']/g, "")) ? "Regex OK ✓" : "Regex ?"),
      hint: "Include a standard regex pattern like ^[0-9]+$ or \\d+ or [a-z]+ (type directly, no quotes).",
      check: (pw) => /(?:\^[a-zA-Z0-9_\\\[\].+*?^$]+\$|\\[dswDSW][+*?]?|\[[a-zA-Z0-9_\-]+\][+*?]?)/.test(pw.replace(/["']/g, "")),
      headline: "REGEX PATTERN MATCHER!",
      managerSpeech: "Audit text tokens! Include a valid regex pattern like ^[0-9]+$ or \\d+!",
      expectedAnswer: "^[0-9]+$, \\d+, etc.",
    },
    {
      id: 46,
      level: 4,
      section: "Omega Quantum Core",
      category: "CIDR Subnet",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      text: "Subnet CIDR mask: Include a valid IPv4 CIDR prefix notation (/24, /16, /8, /28, or /32)",
      badge: (pw) => (/\/(?:3[0-2]|[12]?[0-9])\b/.test(pw.replace(/["']/g, "")) ? "CIDR ✓" : "CIDR ?"),
      hint: "Include an IPv4 slash CIDR prefix length like /24 or /16 (type directly, no quotes).",
      check: (pw) => /\/(?:3[0-2]|[12]?[0-9])\b/.test(pw.replace(/["']/g, "")),
      headline: "IPV4 CIDR SUBNET MASK!",
      managerSpeech: "Define the network boundaries! Route our IP through a valid slash CIDR mask like /24!",
      expectedAnswer: "/24, /16, /8, etc.",
    },
    {
      id: 47,
      level: 4,
      section: "Omega Quantum Core",
      category: "Prime Numbers",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      text: "Prime number encryption: Include a two-digit prime number (13, 17, 19, 23, 29, 31, 37, etc.)",
      badge: (pw) => (/13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(pw.replace(/["']/g, "")) ? "Prime ✓" : "Prime ?"),
      hint: "Include any two-digit prime number (e.g. 13, 17, 19, 23, 29). Do NOT use quotes.",
      check: (pw) => /13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(pw.replace(/["']/g, "")),
      headline: "PRIME NUMBER ENCRYPTION!",
      managerSpeech: "RSA cryptographic circuit requires primes! Include a 2-digit prime number!",
      expectedAnswer: "13, 17, 19, 23, 29, etc.",
    },
    {
      id: 48,
      level: 4,
      section: "Omega Quantum Core",
      category: "Asymptotic Complexity",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '🧩 ALGORITHMIC COMPLEXITY: In Big-O asymptotic notation, what is the quadratic worst-case runtime complexity of standard unbalanced Quicksort?',
      badge: (pw) => (/O\(n\^?2\)/i.test(pw.replace(/["']/g, "")) ? "O(n²) ✓" : "Big-O ?"),
      hint: "Quicksort worst-case occurs on sorted arrays: quadratic O(n2) or O(n^2) (type directly, no quotes).",
      check: (pw) => /O\(n\^?2\)/i.test(pw.replace(/["']/g, "")),
      headline: "ASYMPTOTIC COMPLEXITY RIDDLE!",
      managerSpeech: "Quicksort worst-case pivot breakdown! What is the quadratic asymptotic upper bound in Big-O? Enter O(n2) or O(n^2) (no quotes)!",
      expectedAnswer: "O(n2) or O(n^2)",
    },
    {
      id: 49,
      level: 4,
      section: "Omega Quantum Core",
      category: "Optical Swatch",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
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
      id: 50,
      level: 4,
      section: "Omega Quantum Core",
      category: "Deadlock Avoidance",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '🧩 OPERATING SYSTEMS: What 6-letter algorithm name, formulated by Edsger Dijkstra, tests resource allocation safety to avoid deadlocks?',
      badge: (pw) => (/banker/i.test(pw.replace(/["']/g, "")) ? "banker ✓" : "Algorithm ?"),
      hint: "Dijkstra's deadlock avoidance algorithm: banker (type directly, no quotes).",
      check: (pw) => /banker/i.test(pw.replace(/["']/g, "")),
      headline: "DEADLOCK AVOIDANCE RIDDLE!",
      managerSpeech: "Operating systems resource matrix! What algorithm formulated by Dijkstra tests safe states to prevent deadlock? Enter banker (no quotes)!",
      expectedAnswer: "banker",
    },
    {
      id: 51,
      level: 4,
      section: "Omega Quantum Core",
      category: "Character Encoding",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
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
      id: 52,
      level: 4,
      section: "Omega Quantum Core",
      category: "CS Pioneer",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
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
      id: 53,
      level: 4,
      section: "Omega Quantum Core",
      category: "Boolean Logic",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
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
      id: 54,
      level: 4,
      section: "Omega Quantum Core",
      category: "Cryptocurrency",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '₿ SENSATIONAL CRYPTO: "What is the first name of the pseudonymous creator of Bitcoin and blockchain who published the 2008 whitepaper?"',
      badge: (pw) => (/satoshi/i.test(pw.replace(/["']/g, "")) ? "Satoshi ✓" : "Bitcoin Creator ?"),
      hint: 'Bitcoin creator\'s first name: "satoshi" (type directly, no quotes).',
      check: (pw) => /satoshi/i.test(pw.replace(/["']/g, "")),
      headline: "BITCOIN CREATOR SATOSHI!",
      managerSpeech: "Cryptographic ledger lore! Who created Bitcoin? Enter satoshi (no quotes)!",
      expectedAnswer: "satoshi",
    },
    {
      id: 55,
      level: 4,
      section: "Omega Quantum Core",
      category: "AI Neural Networks",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '🧠 GENERATIVE AI: "What 3-letter acronym represents Large Language Models trained on vast text data to power ChatGPT, Claude, and Gemini?"',
      badge: (pw) => (/llm/i.test(pw.replace(/["']/g, "")) ? "LLM ✓" : "AI Term ?"),
      hint: 'Large Language Model acronym: "llm" (type directly, no quotes).',
      check: (pw) => /llm/i.test(pw.replace(/["']/g, "")),
      headline: "LARGE LANGUAGE MODEL (LLM)!",
      managerSpeech: "Generative AI architecture! What 3-letter acronym describes models like GPT and Gemini? Enter llm!",
      expectedAnswer: "llm",
    },
    {
      id: 56,
      level: 4,
      section: "Omega Quantum Core",
      category: "Cloud Infrastructure",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '☁️ CLOUD PLATFORMS: "What 3-letter acronym represents the world\'s largest cloud computing infrastructure platform launched by Amazon in 2006?"',
      badge: (pw) => (/aws/i.test(pw.replace(/["']/g, "")) ? "AWS ✓" : "Cloud Acronym ?"),
      hint: 'Amazon Web Services acronym: "aws" (type directly, no quotes).',
      check: (pw) => /aws/i.test(pw.replace(/["']/g, "")),
      headline: "AMAZON WEB SERVICES (AWS)!",
      managerSpeech: "Cloud infrastructure titan! What 3-letter acronym powers Amazon cloud services? Enter aws!",
      expectedAnswer: "aws",
    },
    {
      id: 57,
      level: 4,
      section: "Omega Quantum Core",
      category: "Computer Hardware",
      difficulty: 5,
      difficultyStars: "★★★★★",
      difficultyTier: "TIER 5 · MASTER CYBER",
      difficultyColor: "#9B00FF",
      isRiddle: true,
      text: '🖥️ HARDWARE ENGINEERING: "What is the main printed circuit board in a computer that interconnects the CPU, RAM, storage, and graphics cards?" (11-letter word)',
      badge: (pw) => (/motherboard/i.test(pw.replace(/["']/g, "")) ? "Motherboard ✓" : "Mainboard ?"),
      hint: 'Main computer circuit board: "motherboard" (type directly, no quotes).',
      check: (pw) => /motherboard/i.test(pw.replace(/["']/g, "")),
      headline: "MAIN MOTHERBOARD BUS!",
      managerSpeech: "Hardware motherboard diagnostic! What is the primary circuit board holding the CPU and RAM? Enter motherboard!",
      expectedAnswer: "motherboard",
    },
    {
      id: 58,
      level: 4,
      section: "Omega Quantum Core",
      category: "Design Patterns",
      difficulty: 5,
      difficultyStars: "★★★★★",
      difficultyTier: "TIER 5 · MASTER CYBER",
      difficultyColor: "#9B00FF",
      isRiddle: true,
      text: '📐 SOFTWARE DESIGN PATTERNS: "What software design pattern restricts the instantiation of a class to only ONE single global instance?" (9-letter word)',
      badge: (pw) => (/singleton/i.test(pw.replace(/["']/g, "")) ? "Singleton ✓" : "Design Pattern ?"),
      hint: 'Single instance design pattern: "singleton" (type directly, no quotes).',
      check: (pw) => /singleton/i.test(pw.replace(/["']/g, "")),
      headline: "SINGLETON DESIGN PATTERN!",
      managerSpeech: "Software architecture patterns! What pattern guarantees only a single instance exists across the program? Enter singleton!",
      expectedAnswer: "singleton",
    },
    {
      id: 59,
      level: 4,
      section: "Omega Quantum Core",
      category: "Master Directive",
      difficulty: 5,
      difficultyStars: "★★★★★",
      difficultyTier: "TIER 5 · MASTER CYBER",
      difficultyColor: "#9B00FF",
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

/* Backward compatibility aliases */
export const buildAll45Rules = buildAll59Rules;
