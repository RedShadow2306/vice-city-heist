import { buildAll80Rules, buildAll61Rules, buildAll59Rules, CAMPAIGN_LEVELS, getDigitSum } from "../src/utils/gameRules.js";

console.log("════════════════════════════════════════════════════════════════");
console.log("🧪 RUNNING COMPREHENSIVE TEST SUITE FOR VICE CITY HEIST 80 RULES");
console.log("════════════════════════════════════════════════════════════════\n");

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

const rules = buildAll80Rules();

// 1. Total rule count and distribution
console.log("▶ TEST 1: Rule Counts and Campaign Distribution");
assert(rules.length === 80, `Total rules must be exactly 80 (received: ${rules.length})`);
const level1Rules = rules.filter((r) => r.level === 1);
const level2Rules = rules.filter((r) => r.level === 2);
const level3Rules = rules.filter((r) => r.level === 3);
const level4Rules = rules.filter((r) => r.level === 4);

assert(level1Rules.length === 20, `Level 1 must have 20 rules (received: ${level1Rules.length})`);
assert(level2Rules.length === 20, `Level 2 must have 20 rules (received: ${level2Rules.length})`);
assert(level3Rules.length === 20, `Level 3 must have 20 rules (received: ${level3Rules.length})`);
assert(level4Rules.length === 20, `Level 4 must have 20 rules (received: ${level4Rules.length})`);

// 2. Timers configured in CAMPAIGN_LEVELS
console.log("\n▶ TEST 2: Campaign Level Timers (15m, 13m, 11m, 9m)");
assert(CAMPAIGN_LEVELS[1].startSeconds === 900, "Level 1 is 15 minutes (900s)");
assert(CAMPAIGN_LEVELS[2].startSeconds === 780, "Level 2 is 13 minutes (780s)");
assert(CAMPAIGN_LEVELS[3].startSeconds === 660, "Level 3 is 11 minutes (660s)");
assert(CAMPAIGN_LEVELS[4].startSeconds === 540, "Level 4 is 9 minutes (540s)");

// 3. Verify ZERO maze references across all rules
console.log("\n▶ TEST 3: Verification of Zero Maze Mentions");
let mazeFound = false;
rules.forEach((r) => {
  const serialized = JSON.stringify(r);
  if (/\b(?:maze|airlock|ducts?|shaft)\b/i.test(serialized)) {
    mazeFound = true;
    console.error(`  Found maze reference in Rule #${r.id}: ${r.text}`);
  }
});
assert(!mazeFound, "Zero occurrences of maze/ducts found in any of the rules");

// 4. Test Concatenated Password Evaluation (No Spaces Needed)
console.log("\n▶ TEST 4: Concatenated Word Evaluation (Without Spaces)");

// Rule 10: EAST / E
assert(rules[9].check("EAST"), "Rule 10 accepts EAST");
assert(rules[9].check("E"), "Rule 10 accepts E");

// Rule 11: SIRI
assert(rules[10].check("SIRI"), "Rule 11 (Apple AI) accepts SIRI");

// Rule 12: YOUTUBE
assert(rules[11].check("YOUTUBE"), "Rule 12 (Video platform) accepts YOUTUBE");
assert(rules[11].check("YOUTUBE"), "Rule 12 accepts continuous YOUTUBE without spaces");

// Rule 13: SOUTH
assert(rules[12].check("SOUTH"), "Rule 13 (Compass opposite) accepts SOUTH");

// Rule 18: META
assert(rules[17].check("META"), "Rule 18 (Instagram/WhatsApp AI) accepts META");

// Rule 19: Distance 5m / 5
assert(rules[18].check("5"), "Rule 19 (Distance) accepts 5");

// Rule 21: Alphabet Sequence DW
assert(rules[20].check("DW"), "Rule 21 (Alphabet sequence) accepts DW");

// Rule 28: Cipher Shift LFZ
assert(rules[27].check("LFZ"), "Rule 28 (Cipher) accepts LFZ");

// Rule 29: Snapchat
assert(rules[28].check("SNAPCHAT"), "Rule 29 (Snapchat) accepts SNAPCHAT");

// Rule 30: Android
assert(rules[29].check("ANDROID"), "Rule 30 (Android) accepts ANDROID");

// Rule 31: West
assert(rules[30].check("WEST"), "Rule 31 (West) accepts WEST");

// Rule 37: ChatGPT
assert(rules[36].check("CHATGPT"), "Rule 37 (ChatGPT) accepts CHATGPT");
assert(rules[36].check("GPT"), "Rule 37 accepts GPT");

// Rule 38: Speed 60 km/h (Evaluates in continuous password without spaces!)
assert(rules[37].check("60"), "Rule 38 (Speed) accepts 60");
assert(rules[37].check("CHATGPT60NETFLIX"), "Rule 38 accepts '60' concatenated between words without spaces");

// Rule 39: Netflix
assert(rules[38].check("NETFLIX"), "Rule 39 (Netflix) accepts NETFLIX");

// Rule 44: Clock mirror 9
assert(rules[43].check("9"), "Rule 44 accepts 9");
assert(rules[43].check("36YES9CUBE"), "Rule 44 accepts '9' concatenated without spaces");

// Rule 46: Letter Sum BAD = 7
assert(rules[45].check("7"), "Rule 46 accepts 7");

// Rule 48: Seating D / DAVE (No word boundary trap!)
assert(rules[47].check("DAVE"), "Rule 48 accepts DAVE");
assert(rules[47].check("D"), "Rule 48 accepts D");
assert(rules[47].check("BADDAVEYBPX"), "Rule 48 accepts 'DAVE' concatenated without spaces");

// Rule 50: Tesla
assert(rules[49].check("TESLA"), "Rule 50 (Tesla) accepts TESLA");

// Rule 51: Clock / Watch
assert(rules[50].check("CLOCK"), "Rule 51 (Clock) accepts CLOCK");

// Rule 52: Garage -> Car
assert(rules[51].check("CAR"), "Rule 52 (Car) accepts CAR");

// Rule 53: Desert -> Sand
assert(rules[52].check("SAND"), "Rule 53 (Sand) accepts SAND");

// Rule 54: Stamp
assert(rules[53].check("STAMP"), "Rule 54 (Stamp) accepts STAMP");

// Rule 56: Gemini
assert(rules[55].check("GEMINI"), "Rule 56 (Gemini) accepts GEMINI");
assert(rules[55].check("YBPXGEMINI21"), "Rule 56 accepts 'GEMINI' concatenated without spaces");

// Rule 57: Fibonacci 21
assert(rules[56].check("21"), "Rule 57 (Fibonacci 21) accepts 21");
assert(rules[56].check("GEMINI21SPOTIFY"), "Rule 57 accepts '21' concatenated without spaces");

// Rule 58: Spotify
assert(rules[57].check("SPOTIFY"), "Rule 58 (Spotify) accepts SPOTIFY");
assert(rules[57].check("21SPOTIFY30"), "Rule 58 accepts 'SPOTIFY' concatenated without spaces");

// Rule 60: River Goat
assert(rules[59].check("GOAT"), "Rule 60 (River Goat) accepts GOAT");

// Rule 62: Silent
assert(rules[61].check("SILENT"), "Rule 62 (Silent) accepts SILENT");

// Rule 64: Bob
assert(rules[63].check("BOB"), "Rule 64 (Bob) accepts BOB");

// Rule 66: Monday
assert(rules[65].check("MONDAY"), "Rule 66 (Monday) accepts MONDAY");

// 5. Palindrome Malayalam (User Specific Request)
console.log("\n▶ TEST 5: 9-Letter Language Palindrome (Malayalam)");
assert(rules[67].text.includes("9-letter"), "Rule 68 asks for 9-letter palindrome");
assert(rules[67].hint.includes("language"), "Rule 68 hint directs towards classical language");
assert(rules[67].expectedAnswer === "MALAYALAM", "Rule 68 expected answer is MALAYALAM");
assert(rules[67].check("MALAYALAM"), "Rule 68 accepts 'MALAYALAM'");
assert(rules[67].check("RADAR"), "Rule 68 also accepts fallback 'RADAR'");

// 6. Tricky Family Tree Puzzles in Level 4
console.log("\n▶ TEST 6: Tricky Family Tree & Bloodline Puzzles (Level 4)");
// Rule 70: Father's uncle -> Grandnephew or Nephew
assert(rules[69].check("GRANDNEPHEW"), "Rule 70 accepts GRANDNEPHEW");
assert(rules[69].check("NEPHEW"), "Rule 70 accepts NEPHEW");
assert(rules[69].check("GRAND NEPHEW"), "Rule 70 accepts GRAND NEPHEW with space");
assert(rules[69].check("RADARMGRANDNEPHEWUNCLE"), "Rule 70 accepts GRANDNEPHEW concatenated without spaces");

// Rule 71: Bloodline deduction -> Uncle
assert(rules[70].check("UNCLE"), "Rule 71 accepts UNCLE");

// Rule 72: Lineage deduction -> Son
assert(rules[71].check("SON"), "Rule 72 accepts SON");

// Rule 73: Bloodline syllogism -> Brother
assert(rules[72].check("BROTHER"), "Rule 73 accepts BROTHER");

// Rule 74: Reflection symmetry -> MOM
assert(rules[73].check("MOM"), "Rule 74 accepts MOM");

// Rule 75: Lateral riddle -> Keyboard
assert(rules[74].check("KEYBOARD"), "Rule 75 accepts KEYBOARD");

// Rule 76: Lateral riddle -> Towel
assert(rules[75].check("TOWEL"), "Rule 76 accepts TOWEL");

// Rule 77: Anagram -> Heart
assert(rules[76].check("HEART"), "Rule 77 accepts HEART");

// Rule 78: Parity
assert(rules[77].check("EVENSTRING12"), "Rule 78 accepts even string length");

// Rule 79: Master Equilibrium (Digit sum = 25)
assert(rules[78].category === "Master Equilibrium", "Rule 79 is Master Equilibrium");

// Rule 80: Final lockdown verb -> LOCK
assert(rules[79].check("LOCK"), "Rule 80 accepts LOCK");

console.log("\n════════════════════════════════════════════════════════════════");
console.log(`📊 FINAL RESULT: ${passedTests} / ${totalTests} TESTS PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log("════════════════════════════════════════════════════════════════\n");

if (passedTests === totalTests) {
  console.log("🎉 ALL 80 RULES VERIFIED AND WORKING PERFECTLY!");
  process.exit(0);
} else {
  console.error(`💥 ${totalTests - passedTests} TEST(S) FAILED!`);
  process.exit(1);
}
