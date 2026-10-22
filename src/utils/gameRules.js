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
    cumulativeRules: 10,
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
    rules: 13,
    cumulativeRules: 23,
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
    rules: 16,
    cumulativeRules: 39,
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
    rules: 20,
    cumulativeRules: 59,
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
    managerSpeech: 'Code diagnostic! Fill in the missing C console output function: _____("Access Granted")!'
  },
  {
    id: "def_python",
    lang: "Python",
    title: "Function Declaration",
    snippet: '_____ unlock_vault(code):\n    return True',
    blank: "def",
    hint: 'Fill in the blank: Python keyword used to define a function: def (type directly, no quotes)',
    prompt: 'Fill in the missing Python keyword: _____ unlock_vault(code):',
    managerSpeech: 'Python script syntax check! What keyword defines a function in Python?'
  },
  {
    id: "console_js",
    lang: "JavaScript",
    title: "Console Debug Object",
    snippet: '_____.log("Vault Lockdown Active");',
    blank: "console",
    hint: 'Fill in the blank: JavaScript standard output object: console.log(...) (type directly, no quotes)',
    prompt: 'Fill in the missing JavaScript object: _____.log("Vault Lockdown Active");',
    managerSpeech: 'Browser devtools log check! What object precedes .log("...") in JavaScript?'
  },
  {
    id: "return_fn",
    lang: "General Coding",
    title: "Function Output Statement",
    snippet: 'int calculate_balance() {\n    _____ 3000000;\n}',
    blank: "return",
    hint: 'Fill in the blank: Keyword used to pass back a value from a function: return (type directly, no quotes)',
    prompt: 'Fill in the missing keyword: int calculate_balance() { _____ 3000000; }',
    managerSpeech: 'Function control flow! What keyword passes the calculated value out of a function?'
  },
  {
    id: "for_loop",
    lang: "C / Java / JS",
    title: "Iteration Loop",
    snippet: '_____ (int i = 0; i < 10; i++) {\n    scan_vault_perimeter();\n}',
    blank: "for",
    hint: 'Fill in the blank: Standard loop keyword for counter iterations: for (type directly, no quotes)',
    prompt: 'Fill in the missing loop keyword: _____ (int i = 0; i < 10; i++) { ... }',
    managerSpeech: 'Loop iteration protocol! What keyword executes a counted loop?'
  },
  {
    id: "if_condition",
    lang: "C / Python / JS",
    title: "Conditional Branch",
    snippet: '_____ (threat_level > 5) {\n    trigger_alarm();\n}',
    blank: "if",
    hint: 'Fill in the blank: Fundamental conditional branching keyword: if (type directly, no quotes)',
    prompt: 'Fill in the missing conditional keyword: _____ (threat_level > 5) { trigger_alarm(); }',
    managerSpeech: 'Logic branch checkpoint! What keyword executes a condition?'
  },
  {
    id: "while_loop",
    lang: "C / Python / JS",
    title: "Condition Loop",
    snippet: '_____ (security_breach == true) {\n    lock_outer_doors();\n}',
    blank: "while",
    hint: 'Fill in the blank: Loop keyword that runs while condition holds true: while (type directly, no quotes)',
    prompt: 'Fill in the missing loop keyword: _____ (security_breach == true) { ... }',
    managerSpeech: 'Continuous defense loop! What keyword runs a loop while condition is true?'
  },
  {
    id: "print_python",
    lang: "Python",
    title: "Python Print Statement",
    snippet: '_____("Vault Security Status: Armed")',
    blank: "print",
    hint: 'Fill in the blank: Python built-in standard display function: print (type directly, no quotes)',
    prompt: 'Fill in the missing Python output function: _____("Vault Security Status: Armed");',
    managerSpeech: 'Python terminal log check! What function prints output to console?'
  },
  {
    id: "new_keyword",
    lang: "Java / JS / C++",
    title: "Instance Allocation",
    snippet: 'VaultLock lock = _____ VaultLock();',
    blank: "new",
    hint: 'Fill in the blank: Keyword to instantiate or allocate a new object: new (type directly, no quotes)',
    prompt: 'Fill in the missing object instantiation keyword: VaultLock lock = _____ VaultLock();',
    managerSpeech: 'Object instantiation! What keyword creates a new object instance?'
  },
  {
    id: "static_mod",
    lang: "Java / C / C#",
    title: "Class Modifier",
    snippet: 'public _____ int MAX_SAFE_DEPOSITS = 1986;',
    blank: "static",
    hint: 'Fill in the blank: Keyword for class-level (non-instance) variables/methods: static (type directly, no quotes)',
    prompt: 'Fill in the missing Java/C# modifier: public _____ int MAX_SAFE_DEPOSITS = 1986;',
    managerSpeech: 'Class variable memory check! What modifier makes a field belong to the class itself?'
  },
  {
    id: "const_js",
    lang: "JavaScript",
    title: "Immutable Variable Declaration",
    snippet: '_____ VAULT_CIPHER_VERSION = 2026;',
    blank: "const",
    hint: 'Fill in the blank: JavaScript immutable constant keyword: const (type directly, no quotes)',
    prompt: 'Fill in the missing JavaScript keyword: _____ VAULT_CIPHER_VERSION = 2026;',
    managerSpeech: 'JavaScript syntax check! What keyword declares an immutable block-scoped constant?'
  },
  {
    id: "async_js",
    lang: "JavaScript / Python",
    title: "Asynchronous Subroutine",
    snippet: '_____ function decryptVaultPayload() {\n    await fetchAirlockStatus();\n}',
    blank: "async",
    hint: 'Fill in the blank: Keyword preceding an asynchronous function that uses await: async (type directly, no quotes)',
    prompt: 'Fill in the missing async keyword: _____ function decryptVaultPayload() { ... }',
    managerSpeech: 'Asynchronous event loop! What keyword marks a function as asynchronous?'
  },
  {
    id: "sizeof_c",
    lang: "C / C++",
    title: "Memory Size Operator",
    snippet: 'size_t bytes = _____(struct VaultKey);',
    blank: "sizeof",
    hint: 'Fill in the blank: C compile-time memory size operator: sizeof (type directly, no quotes)',
    prompt: 'Fill in the missing C operator: size_t bytes = _____(struct VaultKey);',
    managerSpeech: 'Memory calculation! What C operator evaluates the byte size of a data type?'
  },
  {
    id: "len_py",
    lang: "Python",
    title: "Collection Length Function",
    snippet: 'num_guards = _____(vault_guard_roster)',
    blank: "len",
    hint: 'Fill in the blank: Python built-in function to obtain length/count: len (type directly, no quotes)',
    prompt: 'Fill in the missing Python function: num_guards = _____(vault_guard_roster)',
    managerSpeech: 'Python built-in check! What function returns the length of a list or string?'
  },
  {
    id: "import_kw",
    lang: "Python / JS",
    title: "Module Loading",
    snippet: '_____ { sanitizeInput } from "./security";',
    blank: "import",
    hint: 'Fill in the blank: Keyword to load exported modules: import (type directly, no quotes)',
    prompt: 'Fill in the missing module keyword: _____ { sanitizeInput } from "./security";',
    managerSpeech: 'Module dependency loading! What keyword imports functions from another module?'
  }
];

/* ─── Sensational Tech: Modern AI Models (Rule 11) ─── */
export const CHATGPT_OPTIONS = [
  {
    model: "4o",
    name: "GPT-4o (Omni)",
    prompt: 'What is OpenAI\'s famous flagship multimodal model release for ChatGPT?',
    hint: 'OpenAI\'s omni flagship model is "4o" (do NOT use quotes).',
    alt: ["4o", "omni", "gpt-4o", "gpt4o"]
  },
  {
    model: "o1",
    name: "OpenAI o1 Reasoning",
    prompt: 'What is OpenAI\'s breakthrough reasoning model series name designed for complex math & coding?',
    hint: 'OpenAI\'s reasoning model series is "o1" (do NOT use quotes).',
    alt: ["o1", "o3", "reasoning"]
  },
  {
    model: "gpt4",
    name: "GPT-4",
    prompt: 'What major transformer model series by OpenAI preceded GPT-4o?',
    hint: 'Generative Pre-trained Transformer model: "gpt4" (do NOT use quotes).',
    alt: ["gpt4", "4o", "gpt-4"]
  }
];

/* ─── Sensational Tech: Tesla High-Tech Innovations (Rule 12) ─── */
export const TESLA_OPTIONS = [
  {
    model: "roadster",
    name: "Tesla Roadster",
    prompt: 'What futuristic sports car has Elon Musk announced with optional SpaceX cold gas thrusters that can "fly"?',
    hint: 'Tesla\'s rocket-thruster flying supercar: "roadster" (do NOT use quotes).',
    alt: ["roadster"]
  },
  {
    model: "cybertruck",
    name: "Tesla Cybertruck",
    prompt: 'What famous angular stainless-steel electric pickup truck was engineered by Tesla?',
    hint: 'Tesla\'s angular electric pickup: "cybertruck" (do NOT use quotes).',
    alt: ["cybertruck"]
  },
  {
    model: "autopilot",
    name: "Tesla Autopilot",
    prompt: 'What famous autonomous driving and self-steering technology is built into Tesla vehicles?',
    hint: 'Tesla autonomous navigation system: "autopilot" (do NOT use quotes).',
    alt: ["autopilot", "fsd"]
  }
];

/* ─── Accessible Tech & Common Knowledge Riddles Pool (Rule 13) ─── */
export const TECH_COMMON_RIDDLES = [
  {
    prompt: "Where is user data from apps like Instagram and TikTok stored remotely?",
    ans: "cloud",
    alt: ["cloud", "server"],
    label: "Cloud Storage",
    hint: "Remote distributed internet servers and offsite data storage: cloud (do NOT use quotes)."
  },
  {
    prompt: "What secure protocol displays a padlock icon in your web browser address bar?",
    ans: "https",
    alt: ["https", "ssl"],
    label: "HTTPS",
    hint: "Encrypted web communications protocol: https (do NOT use quotes)."
  },
  {
    prompt: "What global network of interconnected computers connects the whole world?",
    ans: "internet",
    alt: ["internet", "web"],
    label: "Internet",
    hint: "The vast global telecommunications system: internet (do NOT use quotes)."
  },
  {
    prompt: "What device in your home routes Wi-Fi signals to your smartphone and laptop?",
    ans: "router",
    alt: ["router", "modem"],
    label: "Router",
    hint: "Networking appliance routing packets: router (do NOT use quotes)."
  },
  {
    prompt: "What open-source Google mobile operating system powers billions of smartphones?",
    ans: "android",
    alt: ["android"],
    label: "Android",
    hint: "Google's open-source mobile OS: android (do NOT use quotes)."
  },
  {
    prompt: "What wireless technology connects your smartphone to earbuds or speakers?",
    ans: "bluetooth",
    alt: ["bluetooth"],
    label: "Bluetooth",
    hint: "Named after tenth-century King Harald Gormsson: bluetooth (do NOT use quotes)."
  },
  {
    prompt: "What abbreviation represents Artificial Intelligence systems?",
    ans: "ai",
    alt: ["ai"],
    label: "AI",
    hint: "Two-letter acronym for artificial intelligence: ai (do NOT use quotes)."
  },
  {
    prompt: "What satellite navigation system pinpoints your phone's geographic location?",
    ans: "gps",
    alt: ["gps"],
    label: "GPS",
    hint: "Global Positioning System: gps (do NOT use quotes)."
  },
  {
    prompt: "What video cable standard connects your console, laptop, or monitor for HD video?",
    ans: "hdmi",
    alt: ["hdmi"],
    label: "HDMI",
    hint: "High-Definition Multimedia Interface: hdmi (do NOT use quotes)."
  },
  {
    prompt: "What fast solid-state drive replaced mechanical spinning hard drives in modern laptops?",
    ans: "ssd",
    alt: ["ssd"],
    label: "SSD",
    hint: "Solid-State Drive high-speed storage: ssd (do NOT use quotes)."
  },
  {
    prompt: "What universal cable standard charges modern iPhones, Androids, and laptops?",
    ans: "usb",
    alt: ["usb", "usbc"],
    label: "USB",
    hint: "Universal Serial Bus: usb or usbc (do NOT use quotes)."
  },
  {
    prompt: "What small text file does a website save in your browser to remember your login?",
    ans: "cookie",
    alt: ["cookie", "cookies"],
    label: "HTTP Cookie",
    hint: "Small HTTP browser state tracking file: cookie (do NOT use quotes)."
  },
  {
    prompt: "What vibrant display screen technology illuminates each individual pixel without a backlight?",
    ans: "oled",
    alt: ["oled", "amoled"],
    label: "OLED Screen",
    hint: "Organic Light Emitting Diode: oled (do NOT use quotes)."
  }
];

/* ─── Exact Digit Sum Options (Rule 22 - Dynamic Balancing Puzzle) ─── */
export const DIGIT_SUM_OPTIONS = [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35];

/* ─── Blacklisted Demo MAC Addresses (Rule 21 - Forbidden In Answer) ─── */
export const FORBIDDEN_DEMO_MACS = [
  "00:1A:2B:3C:4D:5E",
  "00-1A-2B-3C-4D-5E",
  "01:23:45:67:89:AB",
  "01-23-45-67-89-AB",
  "AA:BB:CC:DD:EE:FF",
  "AA-BB-CC-DD-EE-FF",
  "11:22:33:44:55:66",
  "11-22-33-44-55-66",
];

/* ─── Tier 1 Logic & Coding Pool A (Rule 5 Dynamic Selection) ─── */
export const TIER1_LOGIC_OPTIONS_A = [
  {
    id: "loop_construct",
    category: "Loop Construct",
    prompt: '🔁 LOOP CONSTRUCT: "What standard keyword is used to create a loop in C, C++, or Java?"',
    badgeText: "Loop KW",
    check: (pw) => /(for|while)/i.test(pw.replace(/["']/g, "")),
    hint: 'Standard loop iteration keyword: for or while (type directly, no quotes).',
    headline: "LOOP CONSTRUCT KEYWORD!",
    managerSpeech: "Programming fundamentals check! What keyword is used to execute a loop in C, C++, or Java?",
    expectedAnswer: "for (or while)",
  },
  {
    id: "inverter_not",
    category: "Logical Inverter",
    prompt: '🔄 LOGIC INVERTER: "What boolean operator keyword flips a conditional state from true to false?"',
    badgeText: "NOT Inverter",
    check: (pw) => /(not|\!)/i.test(pw.replace(/["']/g, "")),
    hint: 'Logical negation keyword or operator: not or ! (type directly, no quotes).',
    headline: "BOOLEAN INVERTER OPERATOR!",
    managerSpeech: "Binary inversion check! What operator or keyword flips true to false?",
    expectedAnswer: "not (or !)",
  },
  {
    id: "return_stmt",
    category: "Function Exit",
    prompt: '🚪 CONTROL FLOW: "What fundamental keyword terminates a function execution and returns a result value?"',
    badgeText: "return",
    check: (pw) => /return/i.test(pw.replace(/["']/g, "")),
    hint: 'Keyword returning a value from a function: return (type directly, no quotes).',
    headline: "RETURN STATEMENT KEYWORD!",
    managerSpeech: "Subroutine control flow! What keyword passes the calculated value out of a function?",
    expectedAnswer: "return",
  },
  {
    id: "zero_index",
    category: "Array Indexing",
    prompt: '🔢 ARRAY INDEXING: "What numeric index represents the very first element of an array in C, Python, or JS?"',
    badgeText: "Index 0",
    check: (pw) => /(?:^|[^0-9])0(?:[^0-9]|$)|zero/i.test(pw.replace(/["']/g, "")),
    hint: 'Standard zero-based index number: 0 or zero (type directly, no quotes).',
    headline: "ZERO-BASED INDEX PROTOCOL!",
    managerSpeech: "Memory offset indexing! What numeric digit addresses the first element of an array?",
    expectedAnswer: "0",
  },
  {
    id: "print_output",
    category: "Console Output",
    prompt: '🖨️ CONSOLE OUTPUT: "In Python, what built-in function outputs text to the standard console?"',
    badgeText: "print",
    check: (pw) => /print/i.test(pw.replace(/["']/g, "")),
    hint: 'Python standard display function: print (type directly, no quotes).',
    headline: "PYTHON PRINT FUNCTION!",
    managerSpeech: "Console diagnostic check! What function prints output to the terminal in Python?",
    expectedAnswer: "print",
  },
  {
    id: "bitwise_and",
    category: "Bitwise Mask",
    prompt: '⚙️ BITWISE OPERATOR: "What single character operator performs a bitwise AND comparison in C, Python, and JavaScript?"',
    badgeText: "& Mask",
    check: (pw) => /(?:&|and)/i.test(pw.replace(/["']/g, "")),
    hint: 'Single-ampersand bitwise operator: & (type directly, no quotes).',
    headline: "BITWISE LOGIC OPERATOR!",
    managerSpeech: "Low-level bit manipulation! What symbol performs bitwise conjunction?",
    expectedAnswer: "& (or and)",
  },
  {
    id: "modulo_rem",
    category: "Arithmetic Remainder",
    prompt: '➗ MODULO ARITHMETIC: "What arithmetic symbol calculates the remainder after integer division?"',
    badgeText: "% Modulo",
    check: (pw) => /(?:%|mod)/i.test(pw.replace(/["']/g, "")),
    hint: 'Modulo remainder operator: % (type directly, no quotes).',
    headline: "MODULO REMAINDER OPERATOR!",
    managerSpeech: "Arithmetic tumbler calibration! What symbol returns the integer remainder?",
    expectedAnswer: "% (or mod)",
  },
  {
    id: "array_size",
    category: "Collection Length",
    prompt: '📏 BUFFER SIZE: "In JavaScript, what property name returns the total number of elements in an array or string?"',
    badgeText: "length",
    check: (pw) => /length/i.test(pw.replace(/["']/g, "")),
    hint: 'Array size property identifier: length (type directly, no quotes).',
    headline: "ARRAY BUFFER LENGTH PROPERTY!",
    managerSpeech: "Buffer boundary verification! What property inspects collection length?",
    expectedAnswer: "length",
  },
];

/* ─── Tier 1 Logic & Coding Pool B (Rule 6 Dynamic Selection) ─── */
export const TIER1_LOGIC_OPTIONS_B = [
  {
    id: "condition_if",
    category: "Conditional Branch",
    prompt: '🔀 CONDITIONAL BRANCH: "What fundamental keyword is used for conditional branching in C, Python, or Java?"',
    badgeText: "if",
    check: (pw) => /if/i.test(pw.replace(/["']/g, "")),
    hint: 'Fundamental conditional statement keyword: if (type directly, no quotes).',
    headline: "CONDITIONAL STATEMENT KEYWORD!",
    managerSpeech: "Decision tree checkpoint! What keyword tests a condition?",
    expectedAnswer: "if",
  },
  {
    id: "boolean_true",
    category: "Boolean State",
    prompt: '💡 BOOLEAN TRUTH: "What lowercase keyword represents the affirmative/1 state in boolean algebra?"',
    badgeText: "true",
    check: (pw) => /true/i.test(pw.replace(/["']/g, "")),
    hint: 'Affirmative boolean state: true (type directly, no quotes).',
    headline: "BOOLEAN TRUE VERIFICATION!",
    managerSpeech: "Logical truth condition! What keyword represents high/true state in code?",
    expectedAnswer: "true",
  },
  {
    id: "var_declaration",
    category: "Variable Scoping",
    prompt: '📦 VARIABLE SCOPING: "What modern JavaScript keyword declares a block-scoped reassignable variable?"',
    badgeText: "let / var",
    check: (pw) => /(let|var)/i.test(pw.replace(/["']/g, "")),
    hint: 'Modern block-scoped declaration: let or var (type directly, no quotes).',
    headline: "VARIABLE SCOPE DECLARATION!",
    managerSpeech: "Scope memory allocation! What keyword declares a variable in JavaScript?",
    expectedAnswer: "let (or var)",
  },
  {
    id: "empty_null",
    category: "Null Reference",
    prompt: '🕳️ ABSENCE OF VALUE: "What keyword represents an intentional absence of any object value in JS or Python?"',
    badgeText: "null / none",
    check: (pw) => /(null|none)/i.test(pw.replace(/["']/g, "")),
    hint: 'Empty object reference: null or none (type directly, no quotes).',
    headline: "NULL VALUE REFERENCE!",
    managerSpeech: "Pointer dereference safeguard! What keyword represents null/none?",
    expectedAnswer: "null (or none)",
  },
  {
    id: "const_immutable",
    category: "Immutable Binding",
    prompt: '🔒 IMMUTABILITY: "What JavaScript keyword declares an immutable, read-only constant variable binding?"',
    badgeText: "const",
    check: (pw) => /const/i.test(pw.replace(/["']/g, "")),
    hint: 'Constant binding keyword: const (type directly, no quotes).',
    headline: "IMMUTABLE VARIABLE CONSTANT!",
    managerSpeech: "Lock variable reassignment! What keyword binds a constant?",
    expectedAnswer: "const",
  },
  {
    id: "loop_break",
    category: "Loop Termination",
    prompt: '⏹️ LOOP TERMINATION: "What control flow statement immediately exits or terminates a loop prematurely?"',
    badgeText: "break",
    check: (pw) => /break/i.test(pw.replace(/["']/g, "")),
    hint: 'Loop exit keyword: break (type directly, no quotes).',
    headline: "LOOP BREAK STATEMENT!",
    managerSpeech: "Halt iterative execution! What keyword breaks out of a loop?",
    expectedAnswer: "break",
  },
];

/* ─── Electronics Resistor Color-Band Puzzles (Rule 23 Visual Decoder) ─── */
export const RESISTOR_PUZZLES = [
  {
    id: "res_220",
    name: "Circuit Resistor R1",
    bands: ["Red", "Red", "Brown", "Gold"],
    bandColors: ["#e53935", "#e53935", "#8d6e63", "#ffd700"],
    value: 220,
    notation: "220",
    alt: ["220", "220ohm", "220ohms", "220r"],
    clue: "Red · Red · Brown · Gold",
  },
  {
    id: "res_1000",
    name: "Circuit Resistor R2",
    bands: ["Brown", "Black", "Red", "Gold"],
    bandColors: ["#8d6e63", "#212121", "#e53935", "#ffd700"],
    value: 1000,
    notation: "1000",
    alt: ["1000", "1k", "1kohm", "1000ohm"],
    clue: "Brown · Black · Red · Gold",
  },
  {
    id: "res_330",
    name: "Circuit Resistor R3",
    bands: ["Orange", "Orange", "Brown", "Gold"],
    bandColors: ["#ff9800", "#ff9800", "#8d6e63", "#ffd700"],
    value: 330,
    notation: "330",
    alt: ["330", "330ohm", "330ohms"],
    clue: "Orange · Orange · Brown · Gold",
  },
  {
    id: "res_47k",
    name: "Circuit Resistor R4",
    bands: ["Yellow", "Violet", "Orange", "Gold"],
    bandColors: ["#ffeb3b", "#7e57c2", "#ff9800", "#ffd700"],
    value: 47000,
    notation: "47000",
    alt: ["47000", "47k", "47kohm"],
    clue: "Yellow · Violet · Orange · Gold",
  },
  {
    id: "res_680",
    name: "Circuit Resistor R5",
    bands: ["Blue", "Grey", "Brown", "Gold"],
    bandColors: ["#1e88e5", "#9e9e9e", "#8d6e63", "#ffd700"],
    value: 680,
    notation: "680",
    alt: ["680", "680ohm", "680ohms"],
    clue: "Blue · Grey · Brown · Gold",
  },
  {
    id: "res_560",
    name: "Circuit Resistor R6",
    bands: ["Green", "Blue", "Brown", "Gold"],
    bandColors: ["#43a047", "#1e88e5", "#8d6e63", "#ffd700"],
    value: 560,
    notation: "560",
    alt: ["560", "560ohm", "560ohms"],
    clue: "Green · Blue · Brown · Gold",
  },
];

/* ─── Ventilation Duct Maze Reconnaissance Puzzles (Rule 16 Mini-Game) ─── */
export const DUCT_MAZE_PUZZLES = [
  { id: "slip_vent_bypass", secretWord: "VENT_BYPASS", slipId: "#88", clue: "Emergency bypass voucher recovered from executive office vent" },
  { id: "slip_corrupto_slip", secretWord: "CORRUPTO_SLIP", slipId: "#42", clue: "Classified voucher slip recovered from office desk" },
  { id: "slip_titanium_pass", secretWord: "TITANIUM_PASS", slipId: "#19", clue: "Titanium airlock voucher recovered from ventilation duct" },
  { id: "slip_gordon_memo", secretWord: "GORDON_MEMO", slipId: "#07", clue: "Handwritten memo from Manager Gordon Bennett's private safe" },
  { id: "slip_phantom_key", secretWord: "PHANTOM_KEY", slipId: "#99", clue: "Sub-floor ventilation slip found near deposit box #88" },
  { id: "slip_airlock_override", secretWord: "AIRLOCK_99", slipId: "#51", clue: "Pneumatic airlock override voucher from executive office" },
  { id: "slip_vercetti_grid", secretWord: "VERCETTI_GRID", slipId: "#86", clue: "Encrypted courier note recovered from the manager's office" },
  { id: "slip_security_leak", secretWord: "SECURITY_LEAK", slipId: "#33", clue: "Classified dispatch voucher recovered from the air shaft" },
];

/* ─── Unix / Linux Terminal Shell Commands (Rule 31 Replacement - Eliminates duplicate SQL) ─── */
export const UNIX_CMD_OPTIONS = [
  { cmd: "grep", desc: "Search files for text patterns matching regular expressions", label: "Pattern Search" },
  { cmd: "chmod", desc: "Modify file system read, write, or execute permissions", label: "File Permissions" },
  { cmd: "sudo", desc: "Execute command with elevated superuser root privileges", label: "Elevated Sudo" },
  { cmd: "curl", desc: "Transfer data from or to a server using HTTP or FTP", label: "Data Transfer" },
  { cmd: "kill", desc: "Send termination signal to an active process ID", label: "Process Signal" },
  { cmd: "mkdir", desc: "Create a new directory in the file system tree", label: "Make Directory" },
  { cmd: "chown", desc: "Change user and group ownership of file objects", label: "Change Owner" },
  { cmd: "ps", alt: ["ps", "systemctl"], desc: "Report a snapshot of the current active system processes", label: "Process Snapshot" },
];

/* ─── Digital Logic Gate Circuit Schematics (Rule 39 Visual Diagram) ─── */
export const LOGIC_CIRCUIT_PUZZLES = [
  {
    id: "gate_nand",
    gateName: "NAND",
    inputA: 1,
    inputB: 1,
    output: 0,
    clue: "Both inputs are 1, but the inverted output Q is 0. What universal gate is this (NOT + AND)?",
    alt: ["NAND", "nand"],
    hint: "Combine the negation letter 'N' with the standard 'AND' gate (starts with N).",
  },
  {
    id: "gate_xor",
    gateName: "XOR",
    inputA: 1,
    inputB: 0,
    output: 1,
    clue: "Input A is 1 and Input B is 0, giving output 1. But identical inputs give 0. What gate is this?",
    alt: ["XOR", "xor"],
    hint: "Short for Exclusive OR (3-letter acronym starting with X).",
  },
  {
    id: "gate_nor",
    gateName: "NOR",
    inputA: 0,
    inputB: 0,
    output: 1,
    clue: "Both inputs are 0, producing output Q = 1. Any active 1 input drops it to 0. What gate is this (NOT + OR)?",
    alt: ["NOR", "nor"],
    hint: "Combine the negation letter 'N' with the standard 'OR' gate (starts with N).",
  },
  {
    id: "gate_xnor",
    gateName: "XNOR",
    inputA: 1,
    inputB: 1,
    output: 1,
    clue: "Outputs 1 only when both inputs are identical (both 0 or both 1). What gate is the opposite of XOR?",
    alt: ["XNOR", "xnor"],
    hint: "The opposite of XOR: add 'N' (NOT) into the exclusive gate acronym.",
  },
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
  { dec: 19, bin: "10011" },
  { dec: 20, bin: "10100" },
  { dec: 21, bin: "10101" },
  { dec: 22, bin: "10110" },
  { dec: 25, bin: "11001" },
  { dec: 26, bin: "11010" },
  { dec: 27, bin: "11011" },
  { dec: 28, bin: "11100" },
  { dec: 30, bin: "11110" },
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
  { num: 17, roman: "XVII" },
  { num: 18, roman: "XVIII" },
  { num: 19, roman: "XIX" },
  { num: 20, roman: "XX" },
  { num: 21, roman: "XXI" },
  { num: 24, roman: "XXIV" },
  { num: 26, roman: "XXVI" },
  { num: 29, roman: "XXIX" },
];

/* ─── ROT13 Options (Rule 24) ─── */
export const ROT13_OPTIONS = [
  { plain: "vault", encoded: "inhyg" },
  { plain: "bank", encoded: "onax" },
  { plain: "heist", encoded: "urvfg" },
  { plain: "cash", encoded: "pnfu" },
  { plain: "safe", encoded: "fnsr" },
  { plain: "gold", encoded: "tbyq" },
  { plain: "lock", encoded: "ybpx" },
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
  { word: "alarm", shift: 3, cipher: "dodup" },
  { word: "beach", shift: 1, cipher: "cfbdi" },
  { word: "vice", shift: 4, cipher: "zmgi" },
  { word: "laser", shift: 2, cipher: "ncugt" },
  { word: "corrupt", shift: 3, cipher: "fruuxsw" },
  { word: "cyber", shift: 2, cipher: "eadgt" },
];

/* ─── SHA-256 Phrases (Rule 44) ─── */
export const SHA_PHRASES = [
  { phrase: "vice", short: "0e1f", hint: "Starts with numeral 0 followed by letter 'e', ending in '1f'." },
  { phrase: "heist", short: "3568", hint: "Four decimal digits: starts with odd '35' and ends with even '68'." },
  { phrase: "vault", short: "e6f0", hint: "Starts with letter 'e' and 6, ending with 'f' and 0." },
  { phrase: "gordon", short: "9fe9", hint: "Symmetrical outer digits: starts and ends with '9', with 'fe' in the middle." },
  { phrase: "bennett", short: "34e0", hint: "Ascending digits '34' followed by letter 'e' and '0'." },
  { phrase: "tommy", short: "044f", hint: "Starts with 0, followed by twin digits '44', ending with letter 'f'." },
  { phrase: "malibu", short: "5f16", hint: "Begins with '5' and letter 'f', followed by number '16'." },
  { phrase: "vercetti", short: "a623", hint: "Begins with letter 'a' and 6, ending with countdown '23'." },
  { phrase: "ocean", short: "47af", hint: "Digits '47' followed by the letters 'af'." },
];

/* ─── Systems Architecture Riddles (Rule 32) ─── */
export const SYS_TECH_RIDDLES = [
  {
    clue: "What network security system monitors and filters incoming and outgoing network traffic based on security rules?",
    word: "firewall",
    name: "Network Firewall",
    hint: "Security barrier between networks: firewall (do NOT use quotes).",
  },
  {
    clue: "What OS program converts human-readable source code into machine code or bytecode?",
    word: "compiler",
    name: "Source Compiler",
    hint: "Program translating source code to executable: compiler (do NOT use quotes).",
  },
  {
    clue: "What temporary physical memory region holds data while it is being moved between devices or processes?",
    word: "buffer",
    name: "Memory Buffer",
    hint: "Temporary chunk of RAM: buffer (do NOT use quotes).",
  },
  {
    clue: "What core software program directly manages CPU, RAM, and hardware devices at Ring 0?",
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
  {
    clue: "What lightweight unit of CPU execution shares memory space with other units within the same parent process?",
    word: "thread",
    name: "Process Thread",
    hint: "Lightweight execution stream: thread (do NOT use quotes).",
  },
  {
    clue: "What endpoint abstraction combines an IP address and a port number for bidirectional network communication?",
    word: "socket",
    name: "Network Socket",
    hint: "IP and port communication endpoint: socket (do NOT use quotes).",
  },
  {
    clue: "What hierarchical protocol translates human-friendly domain names into numerical IP addresses?",
    word: "dns",
    name: "DNS Protocol",
    hint: "Domain Name System: dns (do NOT use quotes).",
  },
  {
    clue: "What concurrency error state occurs when two or more processes permanently block each other waiting for held resources?",
    word: "deadlock",
    alt: ["deadlock", "lock"],
    name: "System Deadlock",
    hint: "Permanent mutual blocking state: lock or deadlock (do NOT use quotes).",
  },
  {
    clue: "What memory management scheme transfers fixed-size blocks of virtual memory between RAM and disk storage?",
    word: "paging",
    alt: ["paging", "page"],
    name: "Memory Paging",
    hint: "Virtual memory block swapping: page or paging (do NOT use quotes).",
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
  {
    port: 80,
    name: "HTTP Unencrypted Web",
    proto: "HTTP",
    mathClue: "Calculate standard cleartext HTTP web port: Solve (100 - 20)",
    hint: "The default HTTP web port: 100 - 20 (or 8 × 10).",
  },
  {
    port: 443,
    name: "HTTPS Encrypted SSL Web",
    proto: "HTTPS",
    mathClue: "Calculate standard encrypted HTTPS web port: Solve (400 + 43)",
    hint: "The default secure web port for SSL/TLS: 400 + 43.",
  },
  {
    port: 22,
    name: "SSH Secure Shell Terminal",
    proto: "SSH",
    mathClue: "Calculate encrypted SSH terminal port: Solve (20 + 2)",
    hint: "A twin-digit repeating port directly between 21 and 23 (20 + 2).",
  },
  {
    port: 21,
    name: "FTP File Transfer Protocol",
    proto: "FTP",
    mathClue: "Calculate File Transfer Protocol (FTP) control port: Solve (3 × 7)",
    hint: "The control port directly before SSH port 22 (3 × 7).",
  },
  {
    port: 53,
    name: "DNS Domain Name System",
    proto: "DNS",
    mathClue: "Calculate Domain Name System (DNS) port: Solve (50 + 3)",
    hint: "The internet name resolution port: 50 + 3.",
  },
  {
    port: 3306,
    name: "MySQL Relational Database",
    proto: "MySQL",
    mathClue: "Calculate standard MySQL database port: Solve (3300 + 6)",
    hint: "Iconic 4-digit database port starting with 33: 3300 + 6.",
  },
  {
    port: 5432,
    name: "PostgreSQL Database Engine",
    proto: "PostgreSQL",
    mathClue: "Calculate standard PostgreSQL database port: Countdown sequence (5, 4, 3, 2)",
    hint: "A 4-digit countdown sequence starting at 5 down to 2 (5...4...3...2).",
  },
  {
    port: 8080,
    name: "HTTP Alternate Proxy/Dev",
    proto: "HTTP-Alt",
    mathClue: "Calculate common alternate dev web port: Repeat port 80 twice",
    hint: "Duplicate the standard HTTP port (80) side-by-side (80...80).",
  },
];

/* ─── CS Pioneers (Rule 52) ─── */
export const CS_PIONEERS = [
  { name: "Tim Berners-Lee", code: "lee", alt: ["lee", "berners"], clue: "Inventor of the World Wide Web and HTML (3-letter surname)", hint: "Short 3-letter surname following Sir Tim Berners-..." },
  { name: "Ada Lovelace", code: "ada", alt: ["ada", "lovelace"], clue: "World's first computer programmer who published algorithms for the Analytical Engine (famous 3-letter first name)", hint: "Her 3-letter first name: A-D-A." },
  { name: "Alan Kay", code: "kay", alt: ["kay", "alan"], clue: "Pioneer of Object-Oriented Programming (OOP) and GUI windows at Xerox PARC (3-letter surname)", hint: "Short 3-letter surname: Alan K-A-Y." },
  { name: "George Boole", code: "boole", alt: ["boole", "boolean"], clue: "Mathematician who created boolean algebra, the basis of all digital logic (5-letter surname)", hint: "5-letter surname of boolean logic: B-O-O-L-E." },
  { name: "Gordon Moore", code: "moore", alt: ["moore"], clue: "Pioneer of Moore's Law: chip transistor counts double every two years (5-letter surname)", hint: "5-letter surname of Moore's Law: M-O-O-R-E." },
  { name: "Donald Knuth", code: "knuth", alt: ["knuth"], clue: "Author of The Art of Computer Programming and creator of TeX (5-letter surname)", hint: "5-letter surname starting with silent K: K-N-U-T-H." },
  { name: "Alan Turing", code: "alan", alt: ["alan", "turing"], clue: "Father of modern computer science who cracked the Enigma cipher (short 4-letter first name)", hint: "Short 4-letter first name: A-L-A-N." },
  { name: "Grace Hopper", code: "grace", alt: ["grace", "hopper"], clue: "Naval computing pioneer who invented compilers and coined 'debugging' (5-letter first name)", hint: "Her 5-letter first name: G-R-A-C-E." },
];

/* ─── Color Swatch Calibration (Rule 49) ─── */
export const SWATCH_OPTIONS = [
  { hex: "#FEE", css: "#ffeeee", name: "Vice Rose", hint: "Maximum Red (F) followed by double high letters (E, E)." },
  { hex: "#EFE", css: "#eeffee", name: "Palm Mint", hint: "High Red (E), maximum Green (F), and high Blue (E)." },
  { hex: "#EEF", css: "#eeeeff", name: "Ocean Mist", hint: "High Red and Green (E, E) with maximum Blue (F)." },
  { hex: "#FED", css: "#ffeedd", name: "Sunset Gold", hint: "Descending three-letter sequence: F -> E -> D." },
  { hex: "#DEF", css: "#ddeeff", name: "Neon Cyan", hint: "Ascending three-letter sequence: D -> E -> F." },
  { hex: "#BEE", css: "#bbeeee", name: "Cyber Aqua", hint: "Word for a buzzing insect: starts with 'B' followed by double 'E's." },
  { hex: "#CAB", css: "#ccaabb", name: "Sunset Mauve", hint: "Word for a yellow taxi cab: letters C, A, B." },
  { hex: "#FAD", css: "#ffaadd", name: "Synth Magenta", hint: "Word for a temporary craze or trend: letters F, A, D." },
  { hex: "#CAF", css: "#ccaaff", name: "Electric Lavender", hint: "Short for cafeteria or cafe: letters C, A, F." },
  { hex: "#BAD", css: "#bbaadd", name: "Vercetti Violet", hint: "Word meaning mischievous or evil: letters B, A, D." },
];

/* ─── CS Fundamentals (Rule 33) ─── */
export const CS_FUNDAMENTALS = [
  { clue: "The smallest atomic unit of digital data in computer science, storing binary 0 or 1. What term am I?", word: "bit", name: "Digital Bit" },
  { clue: "Composed of 8 continuous bits, I represent a single character in ASCII. What unit am I?", word: "byte", name: "Data Byte" },
  { clue: "A linear data structure following Last-In First-Out (LIFO) where items push and pop from the top. What term am I?", word: "stack", name: "LIFO Stack" },
  { clue: "A linear data structure following First-In First-Out (FIFO) where elements join the rear and leave the front. What term am I?", word: "queue", name: "FIFO Queue" },
  { clue: "An unhandled flaw or error in source code causing unintended program behavior. What term am I?", word: "bug", name: "Software Bug" },
  { clue: "A contiguous collection of elements of the same data type stored sequentially in memory. What data structure am I?", word: "array", name: "Array" },
  { clue: "A non-linear hierarchical data structure consisting of nodes connected by edges, starting from a root. What term am I?", word: "tree", name: "Tree Structure" },
  { clue: "What non-linear structure consists of a finite set of vertices (or nodes) and a set of edges connecting them?", word: "graph", name: "Graph Structure" },
  { clue: "What mathematical function maps keys of arbitrary size to fixed-size values for rapid table lookup?", word: "hash", name: "Hash Function" },
  { clue: "What specialized tree-based structure guarantees that parent nodes are always sorted relative to their children?", word: "heap", name: "Binary Heap" },
  { clue: "What variable type stores the memory address of another variable rather than a direct value?", word: "pointer", alt: ["pointer", "ptr"], name: "Memory Pointer" },
  { clue: "What contiguous data structure represents a sequential chain or array of text characters?", word: "string", alt: ["string", "str"], name: "Text String" },
];

/* ─── Persistent Non-Repeating Pool Picker (Supports Cross-Team Randomization) ─── */
export function pickNonRepeating(category, pool, keyFn) {
  if (!pool || pool.length === 0) return null;
  let usedKeys = [];
  try {
    const raw = sessionStorage.getItem("vch_recent_pool_" + category) || localStorage.getItem("vch_recent_pool_" + category);
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
    localStorage.setItem("vch_recent_pool_" + category, JSON.stringify(updatedKeys));
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

export const getSessionData = loadSavedSessionData;

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

/* ─── Session Randomizer (Fresh per Team / Match Round) ─── */
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
    exactDigitSum: pickNonRepeating("exactDigitSum", DIGIT_SUM_OPTIONS, (n) => n) || 25,
    tier1LogicA: pickNonRepeating("tier1LogicA", TIER1_LOGIC_OPTIONS_A, (t) => t.id),
    tier1LogicB: pickNonRepeating("tier1LogicB", TIER1_LOGIC_OPTIONS_B, (t) => t.id),
    resistor: pickNonRepeating("resistor", RESISTOR_PUZZLES, (r) => r.id),
    logicCircuit: pickNonRepeating("logicCircuit", LOGIC_CIRCUIT_PUZZLES, (l) => l.id),
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
    ductMaze: pickNonRepeating("ductMaze", DUCT_MAZE_PUZZLES, (d) => d.id),
    unixCmd: pickNonRepeating("unixCmd", UNIX_CMD_OPTIONS, (u) => u.cmd),
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

  const ductMaze =
    DUCT_MAZE_PUZZLES.find((d) => d.id === (safeSession.ductMaze?.id || safeSession.ductMaze)) ||
    DUCT_MAZE_PUZZLES[0];

  const unixCmd =
    UNIX_CMD_OPTIONS.find((u) => u.cmd === (safeSession.unixCmd?.cmd || safeSession.unixCmd)) ||
    UNIX_CMD_OPTIONS[0];

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

  const exactDigitSum = Number(safeSession.exactDigitSum || 25);

  const tier1LogicA =
    TIER1_LOGIC_OPTIONS_A.find((t) => t.id === (safeSession.tier1LogicA?.id || safeSession.tier1LogicA)) ||
    TIER1_LOGIC_OPTIONS_A[0];

  const tier1LogicB =
    TIER1_LOGIC_OPTIONS_B.find((t) => t.id === (safeSession.tier1LogicB?.id || safeSession.tier1LogicB)) ||
    TIER1_LOGIC_OPTIONS_B[0];

  const resistor =
    RESISTOR_PUZZLES.find((r) => r.id === (safeSession.resistor?.id || safeSession.resistor)) ||
    RESISTOR_PUZZLES[0];

  const logicCircuit =
    LOGIC_CIRCUIT_PUZZLES.find((l) => l.id === (safeSession.logicCircuit?.id || safeSession.logicCircuit)) ||
    LOGIC_CIRCUIT_PUZZLES[0];

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
      text: "DIRECTIVE: Incorporate uppercase authority — include at least one capital letter",
      badge: (pw) => ((pw.match(/[A-Z]/g) || []).length >= 1 ? "Upper ✓" : "Upper ?"),
      hint: "Include at least one capital letter (A-Z).",
      check: (pw) => /[A-Z]/.test(pw),
      headline: "UPPERCASE CLEARANCE!",
      managerSpeech: "Directive from Bennett: Incorporate uppercase authority! Include at least one capital letter in the cipher!",
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
      text: "DIRECTIVE: Inject lowercase encryption clearance — include at least one lowercase letter",
      badge: (pw) => ((pw.match(/[a-z]/g) || []).length >= 1 ? "Lower ✓" : "Lower ?"),
      hint: "Include at least one lowercase letter (a-z).",
      check: (pw) => /[a-z]/.test(pw),
      headline: "LOWERCASE CLEARANCE!",
      managerSpeech: "Directive from Bennett: We need case variation! Include at least one lowercase letter!",
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
      text: "DIRECTIVE: Tumbler lock requires numerical pressure — include at least one numeric digit",
      badge: (pw) => (/\d/.test(pw) ? "Digit ✓" : "Digit ?"),
      hint: "Include at least one numeric digit (0-9).",
      check: (pw) => /\d/.test(pw),
      headline: "NUMERIC PRESSURE!",
      managerSpeech: "Directive from Bennett: The tumbler lock requires numerical pressure—insert at least one vault digit from 0 to 9!",
      expectedAnswer: "Any digit 0-9",
    },
    {
      id: 5,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: tier1LogicA.category || "Loop Construct",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      isRiddle: true,
      poolCategory: "tier1LogicA",
      text: tier1LogicA.prompt,
      badge: (pw) => (tier1LogicA.check(pw) ? `${tier1LogicA.badgeText} ✓` : `${tier1LogicA.badgeText} ?`),
      hint: tier1LogicA.hint,
      check: (pw) => tier1LogicA.check(pw),
      headline: tier1LogicA.headline,
      managerSpeech: tier1LogicA.managerSpeech,
      expectedAnswer: tier1LogicA.expectedAnswer,
    },
    {
      id: 6,
      level: 1,
      section: "Outer Lobby & Tellers Gate",
      category: tier1LogicB.category || "Conditional Branch",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      isRiddle: true,
      poolCategory: "tier1LogicB",
      text: tier1LogicB.prompt,
      badge: (pw) => (tier1LogicB.check(pw) ? `${tier1LogicB.badgeText} ✓` : `${tier1LogicB.badgeText} ?`),
      hint: tier1LogicB.hint,
      check: (pw) => tier1LogicB.check(pw),
      headline: tier1LogicB.headline,
      managerSpeech: tier1LogicB.managerSpeech,
      expectedAnswer: tier1LogicB.expectedAnswer,
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
      text: "DIRECTIVE: Shield transmission channel — inject at least one special character symbol",
      badge: (pw) => (/[^a-zA-Z0-9\s]/.test(pw) ? "Special ✓" : "Special ?"),
      hint: "Include at least one special character (!@#$%^&*).",
      check: (pw) => /[^a-zA-Z0-9\s]/.test(pw),
      headline: "ENCRYPT SECURITY SIGNAL!",
      managerSpeech: "Directive from Bennett: Shield our transmission! Inject at least one special character symbol into the cipher!",
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
      managerSpeech: `Convert decimal ${binaryTarget.dec} into its binary representation!`,
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
      text: "Include a valid HTML tag enclosed in angle brackets",
      badge: (pw) => (/<\s*(?:div|p|span|h[1-6]|a|b|i|u|button|input|form|table|tr|td|th|ul|ol|li|img|head|body|html|main|nav|header|footer|section|article|code|pre)\b[^>]*>/i.test(pw.replace(/["']/g, "")) || /<\s*[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/i.test(pw.replace(/["']/g, "")) ? "HTML Tag ✓" : "HTML Tag ?"),
      hint: "Enclose a standard HTML markup element between angle brackets (e.g. <div>, <p>, <span>). Do NOT use quotes.",
      check: (pw) => /<\s*(?:div|p|span|h[1-6]|a|b|i|u|button|input|form|table|tr|td|th|ul|ol|li|img|head|body|html|main|nav|header|footer|section|article|code|pre)\b[^>]*>/i.test(pw.replace(/["']/g, "")) || /<\s*[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/i.test(pw.replace(/["']/g, "")),
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
      text: "Include a reserved Python keyword",
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
      category: "Reconnaissance",
      difficulty: 2,
      difficultyStars: "★★☆☆☆",
      difficultyTier: "TIER 2 · OPERATOR",
      difficultyColor: "#48D5D0",
      isRiddle: true,
      visualType: "ductMaze",
      mazeData: ductMaze,
      poolCategory: "ductMaze",
      text: "DIRECTIVE: Infiltrate Bennett's ventilation network — pilot the drone probe to Point B and recover the classified voucher code",
      badge: (pw) => (new RegExp(ductMaze.secretWord, "i").test(pw.replace(/["']/g, "")) ? `${ductMaze.secretWord} ✓` : "Vent Maze ?"),
      hint: `Navigate the ventilation blueprint to Point B (Executive Office) or open #/maze in a separate tactical tab. Codeword to submit: ${ductMaze.secretWord}`,
      check: (pw) => new RegExp(ductMaze.secretWord, "i").test(pw.replace(/["']/g, "")),
      headline: "VENTILATION SHAFT RECONNAISSANCE!",
      managerSpeech: "Security probe deployed into the air ducts! Guide it through the junctions to Point B inside my private office before the 60-second airlocks seal!",
      expectedAnswer: ductMaze.secretWord,
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
      text: `Include Roman numeral representation for integer ${romanTarget.num}`,
      badge: (pw) => (pw.includes(romanTarget.roman) ? `Roman ${romanTarget.roman} ✓` : "Roman ?"),
      hint: `Roman numeral for ${romanTarget.num} is ${romanTarget.roman} in uppercase (type directly, no quotes).`,
      check: (pw) => pw.replace(/["']/g, "").includes(romanTarget.roman),
      headline: "ROMAN NUMERAL VAULT ENCRYPTION!",
      managerSpeech: `Ancient Roman cipher lock! Translate decimal ${romanTarget.num} into Roman numerals!`,
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
      text: "Include a valid programming file extension with its dot",
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
      text: "Include a primary Git version control command",
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
      text: "Include a valid IPv4 numerical address",
      badge: (pw) => (/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(pw.replace(/["']/g, "")) ? "IPv4 ✓" : "IPv4 ?"),
      hint: "Include a 4-octet IPv4 numerical address with octets 0-255 separated by dots. Do NOT use quotes.",
      check: (pw) => /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/.test(pw.replace(/["']/g, "")),
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
      isRiddle: true,
      visualType: "macGuide",
      text: "Include a valid physical MAC address format (Demo address from hint is forbidden!)",
      badge: (pw) => {
        const clean = pw.replace(/["']/g, "");
        const macRegex = /(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/g;
        const matches = clean.match(macRegex);
        if (!matches || matches.length === 0) return "MAC Format ?";
        const hasForbidden = matches.some((mac) => FORBIDDEN_DEMO_MACS.some((f) => f.toUpperCase() === mac.toUpperCase()));
        const hasValid = matches.some((mac) => !FORBIDDEN_DEMO_MACS.some((f) => f.toUpperCase() === mac.toUpperCase()));
        if (hasValid) return "MAC ✓";
        if (hasForbidden) return "⚠️ DEMO MAC REJECTED!";
        return "MAC Format ?";
      },
      hint: "Format reference: 00:1A:2B:3C:4D:5E (FOR REFERENCE ONLY — DO NOT USE THIS EXACT ADDRESS!). Include any other valid 6-byte hexadecimal MAC address (e.g. your device's NIC address or custom hex pairs).",
      check: (pw) => {
        const clean = pw.replace(/["']/g, "");
        const macRegex = /(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/g;
        const matches = clean.match(macRegex);
        if (!matches || matches.length === 0) return false;
        return matches.some((mac) => !FORBIDDEN_DEMO_MACS.some((f) => f.toUpperCase() === mac.toUpperCase()));
      },
      headline: "PHYSICAL MAC ADDRESS!",
      managerSpeech: (pw) => {
        const clean = pw.replace(/["']/g, "");
        const macRegex = /(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}/g;
        const matches = clean.match(macRegex);
        if (matches && matches.some((mac) => FORBIDDEN_DEMO_MACS.some((f) => f.toUpperCase() === mac.toUpperCase()))) {
          return "Nice try, team! That MAC address is just the demo reference from the hint! You can't use the demo address—generate your own unique hardware MAC!";
        }
        return "Hardware NIC layer verification! Include a standard MAC address format (do NOT use the demo address)!";
      },
      expectedAnswer: "Valid MAC (excluding 00:1A:2B:3C:4D:5E demo)",
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
      isRiddle: true,
      poolCategory: "exactDigitSum",
      text: `⚡ TUMBLER ARITHMETIC: The sum of ALL numeric digits in your password must equal EXACTLY ${exactDigitSum}`,
      badge: (pw) => {
        const sum = getDigitSum(pw);
        if (sum === exactDigitSum) return `Sum: ${sum}=${exactDigitSum} ✓`;
        const diff = sum - exactDigitSum;
        return `Sum: ${sum}/${exactDigitSum} (${diff > 0 ? `+${diff}` : diff})`;
      },
      hint: (pw) => {
        const sum = getDigitSum(pw);
        if (sum === exactDigitSum) return `Perfect! Total digit sum is exactly ${exactDigitSum}.`;
        if (sum < exactDigitSum) return `Current digit sum is ${sum}. You need ${exactDigitSum - sum} more to reach exactly ${exactDigitSum}!`;
        return `Current digit sum is ${sum}. You are ${sum - exactDigitSum} over the target! Adjust or replace other numbers so the total digit sum equals exactly ${exactDigitSum}.`;
      },
      check: (pw) => getDigitSum(pw) === exactDigitSum,
      headline: "EXACT ARITHMETIC BALANCING!",
      managerSpeech: (pw) => {
        const sum = getDigitSum(pw);
        if (sum === exactDigitSum) return `Tumblers locked in balance! Digit sum across your entire key is precisely ${exactDigitSum}!`;
        if (sum < exactDigitSum) return `The tumblers need more weight! Total numeric digits must sum to EXACTLY ${exactDigitSum}! Currently at ${sum} (need +${exactDigitSum - sum})!`;
        return `Too much weight on the tumblers! Current digit sum is ${sum}, but target is EXACTLY ${exactDigitSum}! You're +${sum - exactDigitSum} over! Adjust your numbers together!`;
      },
      expectedAnswer: `Exactly ${exactDigitSum}`,
    },
    {
      id: 23,
      level: 2,
      section: "Executive Cash Corridors",
      category: "Circuit Hardware",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      visualType: "resistor",
      resistorData: resistor,
      poolCategory: "resistor",
      text: "⚡ VISUAL CIRCUIT: Inspect the 4-band resistor diagram below. Calculate its resistance in Ohms and include the resistance value",
      badge: (pw) => (resistor.alt.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))) ? `${resistor.notation}Ω ✓` : "Resistor Ω ?"),
      hint: `Calculate from color bands: (Band 1 · Band 2) × Multiplier. Resistance is ${resistor.notation} (type directly, no quotes).`,
      check: (pw) => resistor.alt.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))),
      headline: "ELECTRONICS RESISTOR CALCULATION!",
      managerSpeech: "Hardware circuit calibration! Calculate the resistance in Ohms from the color bands on the diagram!",
      expectedAnswer: resistor.notation,
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
      text: `🧩 CIPHER: Include the word "${rot13.plain}" encoded with ROT13`,
      badge: (pw) => (new RegExp(rot13.encoded, "i").test(pw.replace(/["']/g, "")) ? `${rot13.encoded} ✓` : "ROT13 ?"),
      hint: `ROT13 of ${rot13.plain} is ${rot13.encoded} (type directly, do NOT use quotes).`,
      check: (pw) => new RegExp(rot13.encoded, "i").test(pw.replace(/["']/g, "")),
      headline: "ROT13 CIPHER SHIFT!",
      managerSpeech: `Classic ROT13 rotation cipher! Rotate ${rot13.plain} by 13 alphabet positions!`,
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
      text: `🧩 CIPHER: Include Caesar cipher (+${caesar.shift} shift) encoding of the word "${caesar.word}"`,
      badge: (pw) => (new RegExp(caesar.cipher, "i").test(pw.replace(/["']/g, "")) ? `${caesar.cipher} ✓` : "Caesar ?"),
      hint: `Caesar shift +${caesar.shift} of ${caesar.word} is ${caesar.cipher} (type directly, no quotes).`,
      check: (pw) => new RegExp(caesar.cipher, "i").test(pw.replace(/["']/g, "")),
      headline: "CAESAR CIPHER SHIFT!",
      managerSpeech: `Shift the Roman alphabet by +${caesar.shift} for '${caesar.word}'!`,
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
      text: "Include a valid JSON key-value pair string",
      badge: (pw) => (/\{[^{}]*:[^{}]*\}/.test(pw.replace(/["']/g, "")) || /["'][a-zA-Z0-9_]+["']\s*:\s*["'][a-zA-Z0-9_]+["']/.test(pw) ? "JSON OK ✓" : "JSON KV ?"),
      hint: "Include key-value format inside braces like {vault:1} or {code:101} (type directly, do NOT use quotes).",
      check: (pw) => /\{[^{}]*:[^{}]*\}/.test(pw.replace(/["']/g, "")) || /["'][a-zA-Z0-9_]+["']\s*:\s*["'][a-zA-Z0-9_]+["']/.test(pw),
      headline: "JSON DATA PROTOCOL!",
      managerSpeech: "Payload serialization! Format a valid JSON key-value pair inside curly braces!",
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
      visualType: "captcha",
      captchaToken: captcha,
      poolCategory: "captcha",
      text: "🔐 OPTICAL CLEARANCE CAPTCHA: Inspect the security matrix graphic below and transcribe the 5-character clearance token into your master key",
      badge: (pw) => (pw.includes(captcha) ? "CAPTCHA ✓" : "CAPTCHA ?"),
      hint: `Security clearance token shown in the optical card is ${captcha} (case-sensitive, type directly, no quotes).`,
      check: (pw) => pw.includes(captcha),
      headline: "CLEARANCE CAPTCHA!",
      managerSpeech: `Security verification challenge! Transcribe the 5-character token from the optical security graphic into your cipher!`,
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
      text: "DIRECTIVE: Cryptographic closure — enclose any parameter token inside curly brackets: { ... }",
      badge: (pw) => (/\{[^}\s]+\}/.test(pw.replace(/["']/g, "")) ? "{OK} ✓" : "{ ... } ?"),
      hint: "Wrap any word or token in curly braces like {code} or {token} (type directly, no quotes).",
      check: (pw) => /\{[^}\s]+\}/.test(pw.replace(/["']/g, "")),
      headline: "CURLY BRACE ENCAPSULATION!",
      managerSpeech: "Cryptographic closure! Enclose any token inside curly brackets { ... }!",
      expectedAnswer: "{token}, {code}, etc.",
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
      text: "DIRECTIVE: Audit the bank financial database — inject a core SQL query clause",
      badge: (pw) => (/(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT)/i.test(pw.replace(/["']/g, "")) ? "SQL Clause ✓" : "SQL Clause ?"),
      hint: "Include a core SQL query clause keyword (e.g. for retrieving, filtering, or sorting tables). Do NOT use quotes.",
      check: (pw) => /(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|JOIN|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT)/i.test(pw.replace(/["']/g, "")),
      headline: "DATABASE SQL QUERY CLAUSE!",
      managerSpeech: "Audit the bank ledger! Inject a standard SQL query clause into the key!",
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
      text: "DIRECTIVE: REST API authorization — include a primary HTTP request method",
      badge: (pw) => (/(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/i.test(pw.replace(/["']/g, "")) ? "HTTP Verb ✓" : "HTTP Verb ?"),
      hint: "Include a primary REST HTTP request method in uppercase or lowercase. Do NOT use quotes.",
      check: (pw) => /(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/i.test(pw.replace(/["']/g, "")),
      headline: "HTTP REST API VERB!",
      managerSpeech: "Transmit the API payload! Inject a valid HTTP request verb!",
      expectedAnswer: "GET, POST, PUT, etc.",
    },
    {
      id: 31,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Terminal Shell Commands",
      difficulty: 3,
      difficultyStars: "★★★☆☆",
      difficultyTier: "TIER 3 · SPECIALIST",
      difficultyColor: "#FFD166",
      isRiddle: true,
      poolCategory: "unixCmd",
      text: `DIRECTIVE: Mainframe terminal shell instruction to ${unixCmd.desc.toLowerCase()}`,
      badge: (pw) => {
        const patterns = unixCmd.alt || [unixCmd.cmd];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))) ? `${unixCmd.cmd} ✓` : "Unix Cmd ?";
      },
      hint: `Unix shell command is ${unixCmd.cmd} (type directly, no quotes).`,
      check: (pw) => {
        const patterns = unixCmd.alt || [unixCmd.cmd];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
      },
      headline: "UNIX TERMINAL COMMAND INJECTION!",
      managerSpeech: `Access the mainframe terminal! What Unix command is used to ${unixCmd.desc.toLowerCase()}?`,
      expectedAnswer: unixCmd.cmd,
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
      badge: (pw) => {
        const patterns = sysTech.alt || [sysTech.word];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))) ? `${sysTech.word} ✓` : "Sys Tech ?";
      },
      hint: sysTech.hint,
      check: (pw) => {
        const patterns = sysTech.alt || [sysTech.word];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
      },
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
      badge: (pw) => {
        const patterns = csFundamental.alt || [csFundamental.word];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))) ? `${csFundamental.word} ✓` : "CS Unit ?";
      },
      hint: `The answer is ${csFundamental.word} (type directly, no quotes).`,
      check: (pw) => {
        const patterns = csFundamental.alt || [csFundamental.word];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
      },
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
      text: "DIRECTIVE: Software versioning stamp — include a valid semantic versioning string (SemVer format)",
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
      text: '🤖 AI DEVELOPER TOOLS: "What famous AI pair programmer created by GitHub assists millions of developers writing code?"',
      badge: (pw) => (/copilot/i.test(pw.replace(/["']/g, "")) ? "Copilot ✓" : "AI Tool ?"),
      hint: 'GitHub\'s AI pair programmer: "copilot" (type directly, no quotes).',
      check: (pw) => /copilot/i.test(pw.replace(/["']/g, "")),
      headline: "GITHUB COPILOT AI ASSISTANT!",
      managerSpeech: "Next-gen code intelligence! What AI assistant developed by GitHub autocompletes code?",
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
      managerSpeech: "Open-source foundation check! Who created Linux and Git?",
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
      text: "📅 ISO DATE FORMAT: Synchronize the vault clock by including a calendar date in standard ISO 8601 format: 4-digit year, 2-digit month, 2-digit day separated by hyphens (e.g. 2026-10-18)",
      badge: (pw) => (/\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:Z|[+-]\d{2}:?\d{2})?)?/.test(pw.replace(/["']/g, "")) ? "ISO 8601 ✓" : "ISO Date ?"),
      hint: "Format as Year-Month-Day with hyphens: YYYY-MM-DD (e.g. 2026-10-18 or today's date).",
      check: (pw) => /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])(?:T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:Z|[+-]\d{2}:?\d{2})?)?/.test(pw.replace(/["']/g, "")),
      headline: "ISO 8601 TIMESTAMP!",
      managerSpeech: "Temporal synchronization! Enter a valid ISO 8601 calendar date like 2026-10-18!",
      expectedAnswer: "YYYY-MM-DD (e.g. 2026-10-18)",
    },
    {
      id: 38,
      level: 3,
      section: "Titanium Deep Vault",
      category: "Data Structures",
      difficulty: 4,
      difficultyStars: "★★★★☆",
      difficultyTier: "TIER 4 · EXPERT",
      difficultyColor: "#F84391",
      isRiddle: true,
      text: '🧩 MEMORY ARCHITECTURE RIDDLE: "What 5-letter LIFO data structure pushes and pops execution frames from the top of the call sequence?"',
      badge: (pw) => (/(stack|recursion)/i.test(pw.replace(/["']/g, "")) ? "stack ✓" : "LIFO ?"),
      hint: "A 5-letter Last-In First-Out structure (starts with 's', ends with 'k').",
      check: (pw) => /(stack|recursion)/i.test(pw.replace(/["']/g, "")),
      headline: "LIFO STACK MEMORY RIDDLE!",
      managerSpeech: "Execution memory structure! What 5-letter LIFO structure pushes and pops frames from the top?",
      expectedAnswer: "stack",
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
      visualType: "logicCircuit",
      circuitData: logicCircuit,
      poolCategory: "logicCircuit",
      text: `🧩 VISUAL LOGIC CIRCUIT: Inspect the digital circuit schematic below. ${logicCircuit.clue}`,
      badge: (pw) => (logicCircuit.alt.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))) ? `${logicCircuit.gateName} ✓` : "Logic Gate ?"),
      hint: logicCircuit.hint || `Universal logic circuit gate: inverted logic gate (starts with N or X).`,
      check: (pw) => logicCircuit.alt.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))),
      headline: "UNIVERSAL GATE SCHEMATIC!",
      managerSpeech: "Universal digital circuits! Inspect the inputs and output to identify the logic gate!",
      expectedAnswer: logicCircuit.gateName,
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
      text: "DIRECTIVE: Subsystem environment configuration — include an uppercase environment variable assignment (at least 3 uppercase letters, '=', and a value)",
      badge: (pw) => (/[A-Z_]{3,}=[a-zA-Z0-9_\-]+/.test(pw.replace(/["']/g, "")) ? "ENV=VAR ✓" : "ENV Pattern ?"),
      hint: "Format like a .env setting: UPPERCASE_NAME=value (e.g. PORT=5173 or KEY=vault or ENV=prod).",
      check: (pw) => /[A-Z_]{3,}=[a-zA-Z0-9_\-]+/.test(pw.replace(/["']/g, "")),
      headline: "ENVIRONMENT VARIABLE SPECIFICATION!",
      managerSpeech: "Subsystem environment configuration! Include an uppercase environment variable declaration!",
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
      text: "DIRECTIVE: Modernize runtime logic — include JavaScript ES6 arrow function notation (e.g. () => or (x) =>)",
      badge: (pw) => (/(?:\([a-zA-Z0-9_,\s]*\)|[a-zA-Z_][a-zA-Z0-9_]*)\s*=>/.test(pw.replace(/["']/g, "")) ? "() => ✓" : "Arrow Syntax ?"),
      hint: "Include the two-character 'fat arrow' operator with parameter brackets: () => or (x) =>.",
      check: (pw) => /(?:\([a-zA-Z0-9_,\s]*\)|[a-zA-Z_][a-zA-Z0-9_]*)\s*=>/.test(pw.replace(/["']/g, "")),
      headline: "ES6 ARROW FUNCTION SYNTAX!",
      managerSpeech: "Modernize runtime logic! Inject ES6 arrow function notation into your cipher!",
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
      text: "🔢 PARITY MATH PUZZLE: Master key parity — total character count must be an EVEN number (divisible by 2)",
      badge: (pw) => `Len: ${[...pw].length} (${[...pw].length % 2 === 0 ? "EVEN ✓" : "ODD"})`,
      hint: "Look at your total length counter. If it is odd, add or remove 1 character to make the total length even.",
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
      text: `🧩 NETWORK PORT MATH PUZZLE: ${netPort.mathClue}. What standard IANA port number is reserved for ${netPort.proto}?`,
      badge: (pw) => (pw.replace(/["']/g, "").includes(String(netPort.port)) ? `Port ${netPort.port} ✓` : "Port ?"),
      hint: netPort.hint,
      check: (pw) => pw.replace(/["']/g, "").includes(String(netPort.port)),
      headline: "IANA PORT NUMBER ASSIGNMENT!",
      managerSpeech: `Configure the network firewall! ${netPort.mathClue}`,
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
      text: `🧩 CRYPTOGRAPHIC DIGEST: Include the first 4 hex characters of SHA-256 for "${shaPhrase.phrase}"`,
      badge: (pw) => (new RegExp(shaPhrase.short, "i").test(pw.replace(/["']/g, "")) ? `${shaPhrase.short} ✓` : "SHA-256 ?"),
      hint: shaPhrase.hint || "4-character hex digest prefix (letters a-f and numbers 0-9).",
      check: (pw) => new RegExp(shaPhrase.short, "i").test(pw.replace(/["']/g, "")),
      headline: "SHA-256 HASH DIGEST PREFIX!",
      managerSpeech: `Cryptographic integrity verification! What are the first 4 hex characters of SHA-256 for '${shaPhrase.phrase}'?`,
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
      text: "DIRECTIVE: Token validation scanner — include a valid regular expression pattern (e.g. ^[0-9]+$ or \\d+ or [a-z]+)",
      badge: (pw) => (/(?:\^[a-zA-Z0-9_\\\[\].+*?^$]+\$|\\[dswDSW][+*?]?|\[[a-zA-Z0-9_\-]+\][+*?]?)/.test(pw.replace(/["']/g, "")) ? "Regex OK ✓" : "Regex ?"),
      hint: "Include standard regex pattern syntax like \\d+ (digits) or [a-z]+ (letters) or ^...$ (anchors).",
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
      text: "🌐 SUBNET MATH PUZZLE: An IPv4 subnet mask has 8 host bits (32 - 8 = 24). Include an IPv4 slash CIDR subnet prefix mask (e.g. /24 or /16)",
      badge: (pw) => (/\/(?:3[0-2]|[12]?[0-9])\b/.test(pw.replace(/["']/g, "")) ? "CIDR ✓" : "CIDR ?"),
      hint: "Type a forward slash followed by the prefix bit length (e.g. 32 - 8 = 24, so /24).",
      check: (pw) => /\/(?:3[0-2]|[12]?[0-9])\b/.test(pw.replace(/["']/g, "")),
      headline: "IPV4 CIDR SUBNET MASK!",
      managerSpeech: "Define the network boundaries! Route our IP through a valid slash CIDR mask!",
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
      text: "🔢 PRIME MATH PUZZLE: Include a two-digit prime number (a number greater than 10 with no divisors other than 1 and itself, like 13, 17, 19, 23)",
      badge: (pw) => (/13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(pw.replace(/["']/g, "")) ? "Prime ✓" : "Prime ?"),
      hint: "Pick a 2-digit number greater than 10 that cannot be divided by 2, 3, or 5 (like 11 + 2 = 13, 17, 19...).",
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
      text: '🧩 ALGORITHMIC COMPLEXITY: In Big-O asymptotic notation, what is the quadratic worst-case runtime complexity of standard unbalanced Quicksort (proportional to n squared)?',
      badge: (pw) => (/O\(n(?:\^2|2|²)\)/i.test(pw.replace(/["']/g, "")) ? "O(n²) ✓" : "Big-O ?"),
      hint: "Quicksort worst-case is quadratic: write Big-O with n squared, like O(n^2) or O(n2).",
      check: (pw) => /O\(n(?:\^2|2|²)\)/i.test(pw.replace(/["']/g, "")),
      headline: "ASYMPTOTIC COMPLEXITY RIDDLE!",
      managerSpeech: "Quicksort worst-case pivot breakdown! What is the quadratic asymptotic upper bound in Big-O?",
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
      visualType: "swatch",
      swatchData: swatch,
      poolCategory: "swatch",
      swatchColor: swatch.css,
      text: "🎨 OPTICAL SENSOR CALIBRATION: Inspect the color tile below and include its 3-character uppercase hex code",
      badge: (pw) => {
        const clean = pw.replace(/["']/g, "").toUpperCase();
        const rawHex = swatch.hex.replace("#", "").toUpperCase();
        return (clean.includes(swatch.hex.toUpperCase()) || clean.includes(rawHex)) ? `${swatch.hex} ✓` : "Hex Code ?";
      },
      hint: swatch.hint || "3-character hex color code using letters A through F.",
      check: (pw) => {
        const clean = pw.replace(/["']/g, "").toUpperCase();
        const rawHex = swatch.hex.replace("#", "").toUpperCase();
        return clean.includes(swatch.hex.toUpperCase()) || clean.includes(rawHex);
      },
      headline: "OPTICAL SWATCH CALIBRATION!",
      managerSpeech: "Calibrate the laser sensors! Deduce the 3-character hex code for our color swatch!",
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
      text: "🧩 OPERATING SYSTEMS: Dijkstra's deadlock avoidance algorithm evaluates safe states to prevent lockups. Include the 4-letter financial vault institution it is named after (or the 6-letter profession: bank / banker):",
      badge: (pw) => (/(bank|banker)/i.test(pw.replace(/["']/g, "")) ? "bank ✓" : "Safe State ?"),
      hint: "A 4-letter financial institution that secures deposits and vaults (starts with 'b', ends with 'k').",
      check: (pw) => /(bank|banker)/i.test(pw.replace(/["']/g, "")),
      headline: "DEADLOCK AVOIDANCE RIDDLE!",
      managerSpeech: "Operating systems resource matrix! What algorithm formulated by Dijkstra tests safe states to prevent deadlock?",
      expectedAnswer: "bank",
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
      text: '🔢 7-BIT ENCODING PUZZLE: "What foundational character encoding standard, published in 1963, uses 7 bits (2^7 = 128 codes) to assign numerical codes 0–127 to English characters?"',
      badge: (pw) => (/ASCII/i.test(pw) ? "ASCII ✓" : "Character Encoding ?"),
      hint: "5-letter acronym: American Standard Code for Information Interchange (starts with 'ASC...').",
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
      text: `🧩 CS PIONEER: "${csPioneer.clue}. What is their name?"`,
      badge: (pw) => {
        const patterns = csPioneer.alt || [csPioneer.code];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, ""))) ? `${csPioneer.code} ✓` : "Pioneer ?";
      },
      hint: csPioneer.hint || "Identify this legendary computer science pioneer by their short name.",
      check: (pw) => {
        const patterns = csPioneer.alt || [csPioneer.code];
        return patterns.some((w) => new RegExp(w, "i").test(pw.replace(/["']/g, "")));
      },
      headline: "LEGENDARY CS PIONEER!",
      managerSpeech: `Computer pioneer identification! ${csPioneer.clue}`,
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
      text: '🧩 DIGITAL LOGIC: "What 3-letter boolean logic operator outputs 1 (TRUE) if and only if its two binary inputs are strictly DIFFERENT?"',
      badge: (pw) => (/XOR/i.test(pw) ? "XOR ✓" : "Exclusive OR ?"),
      hint: "The 3-letter abbreviation for Exclusive OR (starts with X, ends with R).",
      check: (pw) => /XOR/i.test(pw),
      headline: "EXCLUSIVE OR RIDDLE!",
      managerSpeech: "Binary parity gate! What 3-letter logic operator is true only when inputs differ?",
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
      text: '₿ SENSATIONAL CRYPTO: "What 3-letter ticker symbol represents the world\'s premier cryptocurrency created in 2008 (or its creator\'s name)?"',
      badge: (pw) => (/(BTC|satoshi|sats)/i.test(pw.replace(/["']/g, "")) ? "BTC ✓" : "Crypto ?"),
      hint: "The 3-letter trading ticker for Bitcoin (or the 4-letter unit 'sats').",
      check: (pw) => /(BTC|satoshi|sats)/i.test(pw.replace(/["']/g, "")),
      headline: "BITCOIN TICKER & IDENTITY!",
      managerSpeech: "Cryptographic currency origin! Include the standard 3-letter ticker for Bitcoin (BTC)!",
      expectedAnswer: "BTC",
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
      hint: "3-letter acronym taken from: Large Language Model.",
      check: (pw) => /llm/i.test(pw.replace(/["']/g, "")),
      headline: "LARGE LANGUAGE MODEL (LLM)!",
      managerSpeech: "Generative AI architecture! What 3-letter acronym describes models like GPT and Gemini?",
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
      hint: "3-letter acronym taken from: Amazon Web Services.",
      check: (pw) => /aws/i.test(pw.replace(/["']/g, "")),
      headline: "AMAZON WEB SERVICES (AWS)!",
      managerSpeech: "Cloud infrastructure titan! What 3-letter acronym powers Amazon cloud services?",
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
      text: '🖥️ HARDWARE ENGINEERING: "What 3-letter acronym is known as the central processor or \'brain\' of a computer executing machine instructions?"',
      badge: (pw) => (/(CPU|motherboard)/i.test(pw.replace(/["']/g, "")) ? "CPU ✓" : "Hardware ?"),
      hint: "3-letter acronym: Central Processing Unit (starts with C, ends with U).",
      check: (pw) => /(CPU|motherboard)/i.test(pw.replace(/["']/g, "")),
      headline: "CENTRAL PROCESSOR (CPU)!",
      managerSpeech: "Hardware diagnostic! What 3-letter acronym is the central processor brain of the machine?",
      expectedAnswer: "CPU",
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
      text: '📐 SOFTWARE ARCHITECTURE: "What 3-letter architectural pattern separates software into Model, View, and Controller?"',
      badge: (pw) => (/(MVC|singleton)/i.test(pw.replace(/["']/g, "")) ? "MVC ✓" : "Architecture ?"),
      hint: "3-letter acronym for Model, View, and Controller (starts with M, ends with C).",
      check: (pw) => /(MVC|singleton)/i.test(pw.replace(/["']/g, "")),
      headline: "MVC ARCHITECTURAL PATTERN!",
      managerSpeech: "Software architecture! What 3-letter acronym separates Model, View, and Controller?",
      expectedAnswer: "MVC",
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
      text: '🔒 FINAL LOCKDOWN DIRECTIVE: Final emergency system lockdown: Enter the 4-letter emergency command directive to seal our vault: LOCK',
      badge: (pw) => (/LOCK/i.test(pw) ? "LOCK ✓" : "Master Directive ?"),
      hint: "4-letter emergency command: L-O-C-K.",
      check: (pw) => /LOCK/i.test(pw),
      headline: "FINAL EMERGENCY LOCK DIRECTIVE!",
      managerSpeech: "THIS IS IT, ROOKIE! FINAL LAYER! ENTER THE EMERGENCY 'LOCK' DIRECTIVE TO TRAP TOMMY FOREVER!",
      expectedAnswer: "LOCK",
    },
  ];
}

/* Backward compatibility aliases */
export const buildAll45Rules = buildAll59Rules;
